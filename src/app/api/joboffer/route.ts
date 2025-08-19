import { NextRequest, NextResponse } from 'next/server';
import { API_BASE } from '@/lib/api';

// Mock data for job offers
const getMockJobOffers = () => ({
  jobOffers: [
    {
      id: '1',
      title: 'Desarrollador Frontend',
      company: 'TechCorp',
      location: 'Buenos Aires',
      salary: '$3000 - $5000',
      description: 'Buscamos un desarrollador frontend con experiencia en React',
      requirements: ['React', 'TypeScript', '3+ años de experiencia'],
      createdAt: new Date().toISOString(),
      status: 'active'
    },
    {
      id: '2',
      title: 'Diseñador UX/UI',
      company: 'DesignStudio',
      location: 'Córdoba',
      salary: '$2500 - $4000',
      description: 'Diseñador creativo para proyectos digitales',
      requirements: ['Figma', 'Adobe Creative Suite', '2+ años de experiencia'],
      createdAt: new Date().toISOString(),
      status: 'active'
    }
  ]
});

// Mock data for job offers
const getMockJobOffers = () => ({
  jobOffers: [
    {
      id: '1',
      title: 'Desarrollador Frontend',
      company: 'TechCorp',
      location: 'Buenos Aires',
      salary: '$3000 - $5000',
      description: 'Buscamos un desarrollador frontend con experiencia en React',
      requirements: ['React', 'TypeScript', '3+ años de experiencia'],
      createdAt: new Date().toISOString(),
      status: 'active'
    },
    {
      id: '2',
      title: 'Diseñador UX/UI',
      company: 'DesignStudio',
      location: 'Córdoba',
      salary: '$2500 - $4000',
      description: 'Diseñador creativo para proyectos digitales',
      requirements: ['Figma', 'Adobe Creative Suite', '2+ años de experiencia'],
      createdAt: new Date().toISOString(),
      status: 'active'
    }
  ]
});

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API: Received request for job offers');
    
    // Check if backend should be used
    const useBackend = process.env.NEXT_PUBLIC_USE_BACKEND !== 'false';
    
    if (!useBackend) {
      console.log('🔍 API: Backend disabled, returning mock data');
      const mockData = getMockJobOffers();
      return NextResponse.json(mockData, { status: 200 });
    }
    
    const { searchParams } = new URL(request.url);
    
    // Forward all search parameters to backend
    const url = new URL(`${API_BASE}/joboffer`);
    searchParams.forEach((value, key) => {
      url.searchParams.set(key, value);
    });

    console.log('🔍 API: Forwarding to backend:', url.toString());
    
    // Get authorization header
    const authHeader = request.headers.get('authorization');
    console.log('🔍 API: Authorization header:', authHeader ? 'Present' : 'Missing');

    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    
    // Only add Authorization header if it exists
    if (authHeader) {
      headers['Authorization'] = authHeader;
    }

    const response = await fetch(url.toString(), {
      headers,
    });

    console.log('🔍 API: Backend response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('🔍 API: Backend error:', errorText);
      
      // If it's an auth error and we don't have a token, return mock data
      if (response.status === 401 && !authHeader) {
        console.log('🔍 API: No auth token, returning mock data');
        const mockData = getMockJobOffers();
        return NextResponse.json(mockData, { status: 200 });
      }
      
      return NextResponse.json(
        { message: `Backend error: ${response.status} ${errorText}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('🔍 API: Backend data received, job offers count:', data.jobOffers?.length || 0);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in job offers route:', error);
    
    // If backend is not available, return mock data
    if (error instanceof Error && error.message.includes('fetch failed')) {
      console.log('🔍 API: Backend not available, returning mock data');
      const mockData = getMockJobOffers();
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
    console.log('🔍 API: Received POST request for job offer');
    
    // Check if the request is FormData or JSON
    const contentType = request.headers.get('content-type') || '';
    console.log('🔍 API: Content-Type:', contentType);
    
    let body: any;
    let isFormData = false;
    
    if (contentType.includes('multipart/form-data')) {
      // Handle FormData
      console.log('🔍 API: Processing FormData request');
      isFormData = true;
      const formData = await request.formData();
      
             // Convert FormData to object for logging
       const formDataObj: any = {};
       for (const [key, value] of formData.entries()) {
         if (typeof value === 'object' && value !== null && 'name' in value && 'type' in value) {
           formDataObj[key] = `File: ${(value as any).name} (${(value as any).type})`;
         } else {
           formDataObj[key] = value;
         }
       }
       console.log('🔍 API: FormData received:', formDataObj);
      
             // Forward FormData directly to backend
       console.log('🔍 API: Sending FormData to backend at:', `${API_BASE}/joboffer`);
       console.log('🔍 API: Authorization header present:', !!request.headers.get('authorization'));
       
       const response = await fetch(`${API_BASE}/joboffer`, {
         method: 'POST',
         headers: {
           'Authorization': request.headers.get('authorization') || '',
         },
         body: formData, // Send FormData directly
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
      console.log('🔍 API: Backend data received for job offer creation (FormData)');
      return NextResponse.json(data, { status: response.status });
      
    } else {
      // Handle JSON
      console.log('🔍 API: Processing JSON request');
      body = await request.json();
      
      console.log('🔍 API: Forwarding to backend:', `${API_BASE}/joboffer`);
      console.log('🔍 API: Authorization header:', request.headers.get('authorization') ? 'Present' : 'Missing');

      const response = await fetch(`${API_BASE}/joboffer`, {
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
      console.log('🔍 API: Backend data received for job offer creation (JSON)');
      return NextResponse.json(data, { status: response.status });
    }
  } catch (error) {
    console.error('Error in job offer creation route:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}


