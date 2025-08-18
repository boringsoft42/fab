import { NextRequest, NextResponse } from 'next/server';
import { API_BASE } from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API: Received request for job offers');
    const { searchParams } = new URL(request.url);
    
    // Forward all search parameters to backend
    const url = new URL(`${API_BASE}/joboffer`);
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
    console.log('🔍 API: Backend data received, job offers count:', data.jobOffers?.length || 0);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in job offers route:', error);
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


