import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const videoUrl = searchParams.get('url');

    if (!videoUrl) {
      return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
    }

    // Validar que la URL sea de MinIO (local o producción)
    if (!videoUrl.includes('127.0.0.1:9000') &&
      !videoUrl.includes('localhost:9000') &&
      !videoUrl.includes('bucket-production-1a58.up.railway.app')) {
      return NextResponse.json({ error: 'Invalid video URL' }, { status: 400 });
    }

    // Get range header for streaming
    const range = request.headers.get('range');

    // Prepare headers for the fetch request
    const fetchHeaders: Record<string, string> = {
      'Accept': 'video/*',
    };

    // Add range header if present
    if (range) {
      fetchHeaders['Range'] = range;
    }

    console.log('🎥 Video Proxy - Fetching from:', videoUrl);
    if (range) {
      console.log('🎥 Video Proxy - Range request:', range);
    }

    // Fetch the video from MinIO
    const response = await fetch(videoUrl, {
      method: 'GET',
      headers: fetchHeaders,
    });

    if (!response.ok) {
      console.error('🎥 Video Proxy - Response not ok:', response.status, response.statusText);
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Get response headers
    const contentType = response.headers.get('content-type') || 'video/mp4';
    const contentLength = response.headers.get('content-length');
    const contentRange = response.headers.get('content-range');
    const acceptRanges = response.headers.get('accept-ranges');

    console.log('🎥 Video Proxy - Content-Type:', contentType);
    console.log('🎥 Video Proxy - Content-Length:', contentLength);
    console.log('🎥 Video Proxy - Content-Range:', contentRange);

    // Prepare response headers
    const responseHeaders: Record<string, string> = {
      'Content-Type': contentType,
      'Accept-Ranges': acceptRanges || 'bytes',
      'Cache-Control': 'public, max-age=3600',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD',
      'Access-Control-Allow-Headers': 'Range',
    };

    // Add content length and range headers if present
    if (contentLength) {
      responseHeaders['Content-Length'] = contentLength;
    }
    if (contentRange) {
      responseHeaders['Content-Range'] = contentRange;
    }

    // If it's a range request, return the response directly
    if (range) {
      return new NextResponse(response.body, {
        status: response.status,
        headers: responseHeaders,
      });
    }

    // For full requests, return the response body directly (streaming)
    return new NextResponse(response.body, {
      status: 200,
      headers: responseHeaders,
    });

  } catch (error) {
    console.error('🎥 Video proxy error:', error);
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

    console.log('🎥 Video Proxy HEAD - Fetching headers from:', videoUrl);

    // Fetch headers from MinIO
    const response = await fetch(videoUrl, {
      method: 'HEAD',
    });

    if (!response.ok) {
      console.error('🎥 Video Proxy HEAD - Response not ok:', response.status, response.statusText);
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    // Get response headers
    const contentType = response.headers.get('content-type') || 'video/mp4';
    const contentLength = response.headers.get('content-length');
    const acceptRanges = response.headers.get('accept-ranges');

    console.log('🎥 Video Proxy HEAD - Content-Type:', contentType);
    console.log('🎥 Video Proxy HEAD - Content-Length:', contentLength);
    console.log('🎥 Video Proxy HEAD - Accept-Ranges:', acceptRanges);

    // Return headers
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': contentLength || '',
        'Accept-Ranges': acceptRanges || 'bytes',
        'Cache-Control': 'public, max-age=3600',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD',
        'Access-Control-Allow-Headers': 'Range',
      },
    });

  } catch (error) {
    console.error('🎥 Video proxy HEAD error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
