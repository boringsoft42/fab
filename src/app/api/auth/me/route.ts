import { NextRequest, NextResponse } from 'next/server';
import { API_BASE } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 /api/auth/me - Request received');
    console.log('🔍 /api/auth/me - All headers:', Object.fromEntries(request.headers.entries()));
    
    // Get the authorization header from the request
    const authHeader = request.headers.get('authorization');
    console.log('🔍 /api/auth/me - Authorization header:', authHeader);
    
    if (!authHeader) {
      console.log('🔍 /api/auth/me - No authorization header found');
      return NextResponse.json({ error: 'No authorization header found' }, { status: 401 });
    }

    // Forward the request to the backend
    const response = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend auth/me error:', errorText);
      return NextResponse.json(
        { error: `Backend error: ${response.status} ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
