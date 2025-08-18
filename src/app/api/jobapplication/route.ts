import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API: Received request for job applications');
    const { searchParams } = new URL(request.url);
    
    // Forward all search parameters to backend
    const url = new URL('http://localhost:3001/api/jobapplication');
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
    console.log('🔍 API: Backend data received, applications count:', data.length || 0);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in job applications route:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API: Received POST request for job application');
    
    // Handle FormData for file uploads
    const formData = await request.formData();
    
    console.log('🔍 API: Forwarding to backend:', 'http://localhost:3001/api/jobapplication');
    console.log('🔍 API: Authorization header:', request.headers.get('authorization') ? 'Present' : 'Missing');

    // Forward the FormData to backend
    const response = await fetch('http://localhost:3001/api/jobapplication', {
      method: 'POST',
      headers: {
        'Authorization': request.headers.get('authorization') || '',
        // Don't set Content-Type for FormData, let the browser set it with boundary
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
    console.log('🔍 API: Backend data received for job application creation');
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in job application creation route:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
