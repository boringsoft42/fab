import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ contactId: string }> }
) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');
    const limit = searchParams.get('limit');
    
    const resolvedParams = await params;
    const url = new URL(`http://localhost:3001/api/messages/conversation/${resolvedParams.contactId}`);
    if (page) url.searchParams.set('page', page);
    if (limit) url.searchParams.set('limit', limit);

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': request.headers.get('authorization') || '',
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Error in messages conversation route:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
