/**
 * Next.js Middleware for Authentication and Authorization
 *
 * This middleware handles:
 * 1. Session management (Supabase Auth)
 * 2. Route protection (public vs authenticated routes)
 * 3. Role-based access control (admin_fab, admin_asociacion, atleta, entrenador, juez)
 * 4. Estado-based restrictions (pendiente, activo, inactivo, rechazado)
 *
 * Requirements implemented:
 * - REQ-1.2.3: Role-based redirects
 * - REQ-1.3.4: Only "activo" users can access full system
 * - REQ-1.3.6: "rechazado" users blocked from login
 * - REQ-1.3.5, REQ-1.1.7: "pendiente" users have restricted access
 */

import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  // Get user session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Define public routes (accessible without authentication)
  const publicRoutes = ['/sign-in', '/sign-up', '/forgot-password', '/reset-password', '/magic-link', '/auth/callback'];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Define static/asset routes to ignore
  const isStaticRoute =
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') || // Files with extensions
    pathname === '/favicon.ico';

  if (isStaticRoute) {
    return response;
  }

  // If no user and trying to access protected route, redirect to login
  if (!user && !isPublicRoute) {
    const redirectUrl = new URL('/sign-in', request.url);
    redirectUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If user is authenticated, get their rol and estado from database
  if (user) {
    const { data: userRecord } = await supabase
      .from('users')
      .select('rol, estado, asociacion_id')
      .eq('user_id', user.id)
      .single();

    if (!userRecord) {
      // User exists in auth but not in users table - something is wrong
      // Sign out the user and redirect to login
      await supabase.auth.signOut();
      return NextResponse.redirect(new URL('/sign-in?error=invalid_user', request.url));
    }

    const { rol, estado } = userRecord;

    // ============================================================
    // ESTADO-BASED ACCESS CONTROL
    // ============================================================

    // REQ-1.3.6: "rechazado" users cannot access the system
    if (estado === 'rechazado') {
      // Sign out and redirect to login with error
      await supabase.auth.signOut();
      return NextResponse.redirect(
        new URL('/sign-in?error=account_rejected', request.url)
      );
    }

    // REQ-1.3.5, REQ-1.1.7: "pendiente" users have restricted access
    if (estado === 'pendiente') {
      const allowedPendingRoutes = [
        `/dashboard/${rol}-pending`,
        '/profile/edit',
        '/profile/documents',
        '/auth/logout',
      ];

      const isAllowedPendingRoute = allowedPendingRoutes.some((route) =>
        pathname.startsWith(route)
      );

      if (!isAllowedPendingRoute && !isPublicRoute) {
        // Redirect to pending dashboard
        return NextResponse.redirect(new URL(`/dashboard/${rol}-pending`, request.url));
      }
    }

    // "inactivo" users cannot access (similar to rechazado)
    if (estado === 'inactivo') {
      await supabase.auth.signOut();
      return NextResponse.redirect(
        new URL('/sign-in?error=account_inactive', request.url)
      );
    }

    // ============================================================
    // ROLE-BASED REDIRECTS
    // ============================================================

    // If accessing root or /dashboard, redirect to role-specific dashboard
    if (pathname === '/' || pathname === '/dashboard') {
      if (estado === 'pendiente') {
        return NextResponse.redirect(new URL(`/dashboard/${rol}-pending`, request.url));
      } else if (estado === 'activo') {
        // REQ-1.2.3: Role-based redirects
        const dashboardRoutes: Record<string, string> = {
          admin_fab: '/dashboard/admin-fab',
          admin_asociacion: '/dashboard/admin-asociacion',
          atleta: '/dashboard/atleta-activo',
          entrenador: '/dashboard/entrenador-activo',
          juez: '/dashboard/juez-activo',
        };

        const dashboardRoute = dashboardRoutes[rol];
        if (dashboardRoute) {
          return NextResponse.redirect(new URL(dashboardRoute, request.url));
        }
      }
    }

    // ============================================================
    // ADMIN-ONLY ROUTES
    // ============================================================

    const adminOnlyRoutes = ['/users/pending', '/users/admins', '/associations'];
    const isAdminOnlyRoute = adminOnlyRoutes.some((route) => pathname.startsWith(route));

    if (isAdminOnlyRoute && rol !== 'admin_fab') {
      // Redirect to their dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // ============================================================
    // ADMIN ASOCIACION + ADMIN FAB ROUTES
    // ============================================================

    const adminRoutes = ['/events/new', '/inscripciones/pending'];
    const isAdminRoute = adminRoutes.some((route) => pathname.includes(route));

    if (isAdminRoute && !['admin_fab', 'admin_asociacion'].includes(rol)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // If logged in and trying to access auth pages, redirect to dashboard
    if (isPublicRoute && user && estado === 'activo') {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
