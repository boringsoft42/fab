"use client";

import { useEffect } from 'react';
import { useAuthContext } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { UserRole } from '@/types/api';

export function AuthRedirect() {
  const { user, loading, isAuthenticated } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    // Only redirect if user is authenticated and not loading
    if (!loading && isAuthenticated && user) {
      console.log('🔐 AuthRedirect - User authenticated:', {
        role: user.role,
        username: user.username,
        id: user.id
      });

      // Redirect based on user role
      switch (user.role) {
        case 'EMPRESAS':
          console.log('🔐 AuthRedirect - Redirecting company user to company jobs');
          router.replace('/company/jobs');
          break;
        case 'GOBIERNOS_MUNICIPALES':
          console.log('🔐 AuthRedirect - Redirecting municipality user to municipality dashboard');
          router.replace('/admin/companies');
          break;
        case 'SUPER_ADMIN':
        case 'SUPERADMIN':
          console.log('🔐 AuthRedirect - Redirecting super admin to admin dashboard');
          router.replace('/admin/users');
          break;
        case 'JOVENES':
        case 'ADOLESCENTES':
          console.log('🔐 AuthRedirect - Redirecting youth user to youth dashboard');
          router.replace('/dashboard');
          break;
        case 'CENTROS_DE_FORMACION':
          console.log('🔐 AuthRedirect - Redirecting training center to training dashboard');
          router.replace('/admin/courses');
          break;
        case 'ONGS_Y_FUNDACIONES':
          console.log('🔐 AuthRedirect - Redirecting NGO to NGO dashboard');
          router.replace('/dashboard');
          break;
        default:
          console.log('🔐 AuthRedirect - Unknown role, redirecting to default dashboard');
          router.replace('/dashboard');
          break;
      }
    }
  }, [user, loading, isAuthenticated, router]);

  // Don't render anything, this is just for side effects
  return null;
} 