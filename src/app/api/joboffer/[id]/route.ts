import { NextRequest, NextResponse } from 'next/server';
import { API_BASE } from '@/lib/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id;
    console.log('🔍 API: Received GET request for job offer:', jobId);
    
    const response = await fetch(`${API_BASE}/joboffer/${jobId}`, {
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
    console.log('🔍 API: Backend data received for job offer:', jobId);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in job offer GET route:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const jobId = params.id;
    console.log('🔍 API: Received PUT request for job offer update:', jobId);
    
    // Check if the request is FormData or JSON
    const contentType = request.headers.get('content-type') || '';
    console.log('🔍 API: Content-Type:', contentType);
    
    let body: any;
    let isFormData = false;
    
    if (contentType.includes('multipart/form-data')) {
      // Handle FormData
      console.log('🔍 API: Processing FormData update request');
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
       console.log('🔍 API: FormData received for update:', formDataObj);
      
             // Forward FormData directly to backend
       console.log('🔍 API: Sending FormData to backend at:', `${API_BASE}/joboffer/${jobId}`);
       console.log('🔍 API: Authorization header present:', !!request.headers.get('authorization'));
       
       const response = await fetch(`${API_BASE}/joboffer/${jobId}`, {
         method: 'PUT',
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
      console.log('🔍 API: Backend data received for job offer update (FormData)');
      return NextResponse.json(data, { status: response.status });
      
    } else {
      // Handle JSON
      console.log('🔍 API: Processing JSON update request');
      body = await request.json();
      
      console.log('🔍 API: Forwarding to backend:', `${API_BASE}/joboffer/${jobId}`);
      console.log('🔍 API: Authorization header:', request.headers.get('authorization') ? 'Present' : 'Missing');

      const response = await fetch(`${API_BASE}/joboffer/${jobId}`, {
        method: 'PUT',
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
      console.log('🔍 API: Backend data received for job offer update (JSON)');
      return NextResponse.json(data, { status: response.status });
    }
  } catch (error) {
    console.error('Error in job offer update route:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    console.log('🔍 API: Received DELETE request for job offer:', resolvedParams.id);
    
    const url = new URL(`${API_BASE}/joboffer/${resolvedParams.id}`);

    console.log('🔍 API: Forwarding to backend:', url.toString());
    console.log('🔍 API: Authorization header:', request.headers.get('authorization') ? 'Present' : 'Missing');

    const response = await fetch(url.toString(), {
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

    const data = await response.json();
    console.log('🔍 API: Backend data received for job offer deletion:', resolvedParams.id);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in job offer deletion route:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
