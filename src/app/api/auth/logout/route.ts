import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔒 /api/auth/logout - Logout request received');

    // For JWT-based authentication, logout is handled client-side by clearing the token
    // The server doesn't need to do anything special since JWTs are stateless
    
    // In a production environment with refresh tokens, you might want to:
    // 1. Blacklist the refresh token
    // 2. Add the access token to a blacklist until it expires
    // 3. Log the logout event
    
    // For now, we'll just return a success response
    console.log('🔒 /api/auth/logout - Logout successful');
    
    // Create response and clear cookie
    const jsonResponse = NextResponse.json({ 
      message: 'Logout successful',
      success: true 
    });
    
    // Clear the authentication cookie
    jsonResponse.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/',
    });

    console.log('🔐 Logout API - Token cookie cleared');
    
    return jsonResponse;
  } catch (error) {
    console.error('Error in /api/auth/logout:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}