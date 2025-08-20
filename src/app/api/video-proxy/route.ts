import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoUrl = searchParams.get('url');

    if (!videoUrl) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    // Validar que la URL sea de MinIO
    if (!videoUrl.includes('127.0.0.1:9000') && !videoUrl.includes('localhost:9000')) {
      return NextResponse.json({ error: 'Invalid video URL' }, { status: 400 });
    }

    // Fetch the video from MinIO
    const response = await fetch(videoUrl, {
      method: 'GET',
      headers: {
        'Accept': 'video/*',
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Get video content
    const videoBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'video/mp4';

    // Return video with proper headers
    return new NextResponse(videoBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': response.headers.get('content-length') || '',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD',
        'Access-Control-Allow-Headers': 'Range',
      },
    });

  } catch (error) {
    console.error('Video proxy error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function HEAD(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoUrl = searchParams.get('url');

    if (!videoUrl) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    // Fetch headers from MinIO
    const response = await fetch(videoUrl, {
      method: 'HEAD',
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Return headers
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Content-Type': response.headers.get('content-type') || 'video/mp4',
        'Content-Length': response.headers.get('content-length') || '',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD',
        'Access-Control-Allow-Headers': 'Range',
      },
    });

  } catch (error) {
    console.error('Video proxy HEAD error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
