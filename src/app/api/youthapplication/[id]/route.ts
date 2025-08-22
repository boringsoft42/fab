import { NextRequest, NextResponse } from 'next/server';
import { API_BASE } from '@/lib/api';

// GET: Obtener postulación específica
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        console.log('🔍 API: Received request for youth application:', params.id);

        const url = `${API_BASE}/youthapplication/${params.id}`;
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
        console.log('🔍 API: Backend data received:', data);
        return NextResponse.json(data, { status: response.status });
    } catch (error) {
        console.error('Error in get youth application route:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT: Actualizar postulación
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        console.log('🔍 API: Received request to update youth application:', params.id);

        const formData = await request.formData();
        console.log('🔍 API: Form data received:', Object.fromEntries(formData.entries()));

        const url = `${API_BASE}/youthapplication/${params.id}`;
        console.log('🔍 API: Forwarding to backend:', url);

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': request.headers.get('authorization') || '',
            },
            body: formData,
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
        console.error('Error in update youth application route:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE: Eliminar postulación
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        console.log('🔍 API: Received request to delete youth application:', params.id);

        const url = `${API_BASE}/youthapplication/${params.id}`;
        console.log('🔍 API: Forwarding to backend:', url);

        const response = await fetch(url, {
            method: 'DELETE',
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

        return NextResponse.json({ message: 'Youth application deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error in delete youth application route:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
} 