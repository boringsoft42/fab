import { NextRequest, NextResponse } from "next/server";

// GET: Get current user's applications
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API: Received request for my applications');
    const { searchParams } = new URL(request.url);
    
    // Forward all search parameters to backend
    const url = new URL('http://localhost:3001/api/my-applications');
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
    console.log('🔍 API: Backend data received, applications count:', data.applications?.length || 0);
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in my applications route:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE: Withdraw application
export async function DELETE(request: NextRequest) {
  try {
    console.log('🔍 API: Received DELETE request for my application');
    const { searchParams } = new URL(request.url);
    const applicationId = searchParams.get("applicationId");
    
    if (!applicationId) {
      return NextResponse.json(
        { error: "Application ID is required" },
        { status: 400 }
      );
    }
    
    const url = new URL(`http://localhost:3001/api/my-applications?applicationId=${applicationId}`);

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
    console.log('🔍 API: Backend data received for application withdrawal');
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in my application withdrawal route:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 