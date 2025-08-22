import { NextRequest, NextResponse } from 'next/server';
import { API_BASE } from '@/lib/api';

// Mock data for companies
const getMockCompanies = () => ({
  companies: [
    {
      id: '1',
      name: 'TechCorp',
      description: 'Empresa de tecnología innovadora',
      location: 'Buenos Aires',
      industry: 'Tecnología',
      website: 'https://techcorp.com',
      email: 'contact@techcorp.com'
    },
    {
      id: '2',
      name: 'DesignStudio',
      description: 'Estudio de diseño creativo',
      location: 'Córdoba',
      industry: 'Diseño',
      website: 'https://designstudio.com',
      email: 'hello@designstudio.com'
    }
  ]
});

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API: Received request for companies');

    // Check if backend should be used
    const useBackend = process.env.NEXT_PUBLIC_USE_BACKEND !== 'false';

    if (!useBackend) {
      console.log('🔍 API: Backend disabled, returning mock data');
      const mockData = getMockCompanies();
      return NextResponse.json(mockData, { status: 200 });
    }

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

    // If backend is not available, return mock data
    if (error instanceof Error && error.message.includes('fetch failed')) {
      console.log('🔍 API: Backend not available, returning mock data');
      const mockData = getMockCompanies();
      return NextResponse.json(mockData, { status: 200 });
    }

    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("🔍 POST /api/company - Starting request");

    // Check if backend should be used
    const useBackend = process.env.NEXT_PUBLIC_USE_BACKEND !== 'false';

    if (!useBackend) {
      console.log("🔍 POST /api/company - Backend disabled, using mock response");
      const body = await request.json();
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
      return NextResponse.json(mockBackendResponse, { status: 201 });
    }

    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    console.log("🔍 POST /api/company - Authorization header:", authHeader ? 'Present' : 'Missing');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("❌ POST /api/company - No valid authorization header");
      return NextResponse.json(
        { message: "No Bearer token provided." },
        { status: 401 }
      );
    }

    const body = await request.json();
    console.log("📝 POST /api/company - Request body:", body);

    // Forward the request to the backend
    const response = await fetch(`${API_BASE}/company`, {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    console.log("🔍 POST /api/company - Backend response status:", response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ POST /api/company - Backend error:", errorText);
      return NextResponse.json(
        { message: `Backend error: ${response.status} ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log("✅ POST /api/company - Backend response data:", data);
    return NextResponse.json(data, { status: response.status });

  } catch (error) {
    console.error("💥 Error in POST /api/company:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 