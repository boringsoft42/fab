import { NextRequest, NextResponse } from 'next/server';
import { API_BASE } from '@/lib/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    console.log('🔍 API: Fetching course with ID:', resolvedParams.id);
    
    const url = new URL(`${API_BASE}/course/${resolvedParams.id}`);
    console.log('🔍 API: Backend URL:', url.toString());

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
    console.log('🔍 API: Backend data received:', data);
    
    // Si el backend devuelve el curso directamente, envolverlo en un objeto course
    const responseData = data.course ? data : { course: data };
    console.log('🔍 API: Final response data:', responseData);
    
    return NextResponse.json(responseData, { status: response.status });
  } catch (error) {
    console.error('Error in course route:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
