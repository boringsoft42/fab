import { NextRequest, NextResponse } from 'next/server';
import { API_BASE } from '@/lib/api';

// GET: Obtener mensajes de una postulación
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        console.log('🔍 API: Received request for youth application messages:', params.id);

        const url = `${API_BASE}/youthapplication/${params.id}/messages`;
        console.log('🔍 API: Forwarding to backend:', url);

        const response = await fetch(url, {
            headers: {
                'Authorization': request.headers.get('authorization') || '',
                'Content-Type': 'application/json',
            },
        });

        console.log('🔍 API: Backend response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('🔍 API: Backend error:', errorText);
            return NextResponse.json(
                { message: `Backend error: ${response.status} ${errorText}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('🔍 API: Backend data received, messages count:', data.length || 0);
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Error in get youth application messages route:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST: Enviar mensaje en una postulación
export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        console.log('🔍 API: Received request to send message in youth application:', params.id);

        const body = await request.json();
        console.log('🔍 API: Request body:', body);

        const url = `${API_BASE}/youthapplication/${params.id}/message`;
        console.log('🔍 API: Forwarding to backend:', url);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': request.headers.get('authorization') || '',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        console.log('🔍 API: Backend response status:', response.status);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('🔍 API: Backend error:', errorText);
            return NextResponse.json(
                { message: `Backend error: ${response.status} ${errorText}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('🔍 API: Backend data received:', data);
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Error in send youth application message route:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
} 