import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
         const resolvedParams = await params;
     
     const url = new URL(`http://localhost:3001/api/course/${resolvedParams.id}`);

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': request.headers.get('authorization') || '',
        'Content-Type': 'application/json',
      },
    });

         if (!response.ok) {
       const errorText = await response.text();
       console.error('🔍 API: Backend error:', errorText);
      return NextResponse.json(
        { message: `Backend error: ${response.status} ${errorText}` },
        { status: response.status }
      );
    }

         const data = await response.json();
     
     // Si el backend devuelve el curso directamente, envolverlo en un objeto course
     const responseData = data.course ? data : { course: data };
    
    return NextResponse.json(responseData, { status: response.status });
  } catch (error) {
    console.error('Error in course route:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
