import { NextRequest, NextResponse } from 'next/server';
import { API_BASE } from '@/lib/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  try {
    const resolvedParams = await params;
    console.log('🔍 GET /api/jobapplication-messages/[applicationId]/messages called');
    console.log('📝 Application ID:', resolvedParams.applicationId);
    
    const token = request.headers.get('authorization');
    console.log('🔑 Authorization header:', token ? `${token.substring(0, 20)}...` : 'Missing');
    
    if (!token) {
      console.log('❌ No authorization token found');
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Remove 'Bearer ' prefix if present
    const cleanToken = token.replace('Bearer ', '');
    console.log('🔑 Clean token:', cleanToken ? `${cleanToken.substring(0, 20)}...` : 'Empty');

    const backendUrl = `${API_BASE}/jobapplication-messages/${resolvedParams.applicationId}/messages`;
    console.log('🌐 Backend URL:', backendUrl);

    const response = await fetch(backendUrl, {
      headers: {
        'Authorization': `Bearer ${cleanToken}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Backend error response:', errorText);
      throw new Error(`Backend responded with ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ Successfully fetched messages:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('❌ Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Error al cargar mensajes' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ applicationId: string }> }
) {
  try {
    const resolvedParams = await params;
    const token = request.headers.get('authorization');
    const body = await request.json();
    
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const response = await fetch(
      `${API_BASE}/jobapplication-messages/${resolvedParams.applicationId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      throw new Error(`Backend responded with ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Error al enviar mensaje' },
      { status: 500 }
    );
  }
}
