import { NextRequest, NextResponse } from 'next/server';
import { API_BASE } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API: Received request for companies');
    const { searchParams } = new URL(request.url);
    
    // Forward all search parameters to backend
    const url = new URL(`${API_BASE}/company`);
    searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });

    console.log('🔍 API: Forwarding to backend:', url.toString());
    console.log('🔍 API: Authorization header:', request.headers.get('authorization') ? 'Present' : 'Missing');

    const response = await fetch(url.toString(), {
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
    console.log('🔍 API: Backend data received, companies count:', data.companies?.length || 0);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in companies route:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 POST /api/company - Starting request");
    
    // Mock authentication check for development
    const mockUserRole = "SUPERADMIN";
    
    if (mockUserRole !== "SUPERADMIN") {
      console.log("❌ Access denied - Not SUPERADMIN");
      return NextResponse.json(
        { error: "Acceso denegado. Solo super administradores pueden crear empresas." },
        { status: 403 }
      );
    }

    const body = await request.json();
    console.log("📝 Request body:", body);
    
    // Mock backend call for POST
    const mockBackendResponse = {
      success: true,
      data: {
        message: "Empresa creada exitosamente",
        company: {
          id: "mock-company-id",
          name: body.name,
          address: body.address,
          phone: body.phone,
          email: body.email,
          createdAt: new Date().toISOString(),
        },
      },
      status: 201,
    };
    console.log("📊 Mock backend response:", mockBackendResponse);

    return NextResponse.json(
      mockBackendResponse,
      { status: mockBackendResponse.status }
    );
  } catch (error) {
    console.error("💥 Error in POST /api/company:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 