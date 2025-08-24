import { NextRequest, NextResponse } from "next/server";
import { API_BASE } from '@/lib/api';

export async function GET(
    request: NextRequest,
    { params }: { params: { userId: string } }
) {
    try {
        console.log('📊 API: Fetching dashboard data for user:', params.userId);

        const userId = params.userId;
        const authHeader = request.headers.get('authorization');

        if (!authHeader) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            );
        }

        // Fetch statistics and activities from backend
        const backendUrl = `${API_BASE}/user-activities/${userId}/dashboard`;

        const response = await fetch(backendUrl, {
            headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('📊 API: Backend error:', errorText);
            return NextResponse.json(
                { error: `Backend error: ${response.status} ${errorText}` },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('📊 API: Dashboard data received successfully');

        return NextResponse.json(data);
    } catch (error) {
        console.error('📊 API: Error fetching dashboard data:', error);
        return NextResponse.json(
            { error: "Error interno del servidor" },
            { status: 500 }
        );
    }
}
