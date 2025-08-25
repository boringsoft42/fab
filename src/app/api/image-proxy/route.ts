import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const imageUrl = searchParams.get('url');

        if (!imageUrl) {
            return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
        }

        // Validar que la URL sea de MinIO (local o producción)
        if (!imageUrl.includes('127.0.0.1:9000') &&
            !imageUrl.includes('localhost:9000') &&
            !imageUrl.includes('bucket-production-1a58.up.railway.app')) {
            return NextResponse.json({ error: 'Invalid image URL' }, { status: 400 });
        }

        console.log('🔍 Image Proxy - Fetching from:', imageUrl);

        // Fetch the image from MinIO
        const response = await fetch(imageUrl, {
            method: 'GET',
            headers: {
                'Accept': 'image/*',
            },
        });

        if (!response.ok) {
            console.error('🔍 Image Proxy - Response not ok:', response.status, response.statusText);
            return NextResponse.json({ error: 'Image not found' }, { status: 404 });
        }

        // Get image content
        const imageBuffer = await response.arrayBuffer();
        const contentType = response.headers.get('content-type') || 'image/jpeg';

        console.log('🔍 Image Proxy - Content-Type:', contentType);
        console.log('🔍 Image Proxy - Content-Length:', response.headers.get('content-length'));

        // Return image with proper headers
        return new NextResponse(imageBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Length': response.headers.get('content-length') || String(imageBuffer.byteLength),
                'Cache-Control': 'public, max-age=3600',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, HEAD',
            },
        });

    } catch (error) {
        console.error('🔍 Image Proxy - Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function HEAD(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const imageUrl = searchParams.get('url');

        if (!imageUrl) {
            return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
        }

        // Fetch headers from MinIO
        const response = await fetch(imageUrl, {
            method: 'HEAD',
        });

        if (!response.ok) {
            return NextResponse.json({ error: 'Image not found' }, { status: 404 });
        }

        // Return headers
        return new NextResponse(null, {
            status: 200,
            headers: {
                'Content-Type': response.headers.get('content-type') || 'image/jpeg',
                'Content-Length': response.headers.get('content-length') || '0',
                'Cache-Control': 'public, max-age=3600',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, HEAD',
            },
        });

    } catch (error) {
        console.error('🔍 Image Proxy HEAD - Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
} 