import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pdfPath = searchParams.get('path');
    
    if (!pdfPath) {
      return NextResponse.json({ error: 'PDF path is required' }, { status: 400 });
    }

    // Validar que la URL sea de MinIO local
    if (!pdfPath.startsWith('http://127.0.0.1:9000/') && !pdfPath.startsWith('http://localhost:9000/')) {
      return NextResponse.json({ error: 'Invalid PDF URL' }, { status: 400 });
    }

    console.log('🔍 PDF Proxy - Fetching from MinIO:', pdfPath);

    // Hacer la petición a MinIO
    const response = await fetch(pdfPath, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf',
      },
    });

    if (!response.ok) {
      console.error('🔍 PDF Proxy - MinIO response not ok:', response.status, response.statusText);
      return NextResponse.json({ error: 'Failed to fetch PDF from MinIO' }, { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'application/pdf';
    const contentLength = response.headers.get('content-length');
    
    console.log('🔍 PDF Proxy - Content-Type:', contentType);
    console.log('🔍 PDF Proxy - Content-Length:', contentLength);

    // Crear la respuesta con los headers apropiados
    const pdfBuffer = await response.arrayBuffer();
    
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Length': contentLength || String(pdfBuffer.byteLength),
        'Content-Disposition': 'inline',
        'Cache-Control': 'public, max-age=3600',
        // Headers para permitir el iframe
        'X-Frame-Options': 'SAMEORIGIN',
        'Content-Security-Policy': "frame-ancestors 'self'",
      },
    });
  } catch (error) {
    console.error('🔍 PDF Proxy - Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function HEAD(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pdfPath = searchParams.get('path');
    
    if (!pdfPath) {
      return new NextResponse(null, { status: 400 });
    }

    // Validar que la URL sea de MinIO local
    if (!pdfPath.startsWith('http://127.0.0.1:9000/') && !pdfPath.startsWith('http://localhost:9000/')) {
      return new NextResponse(null, { status: 400 });
    }

    // Hacer HEAD request a MinIO
    const response = await fetch(pdfPath, {
      method: 'HEAD',
    });

    const contentType = response.headers.get('content-type') || 'application/pdf';
    const contentLength = response.headers.get('content-length');

    return new NextResponse(null, {
      status: response.status,
      headers: {
        'Content-Type': contentType,
        'Content-Length': contentLength || '0',
        'Content-Disposition': 'inline',
        'Cache-Control': 'public, max-age=3600',
        'X-Frame-Options': 'SAMEORIGIN',
        'Content-Security-Policy': "frame-ancestors 'self'",
      },
    });
  } catch (error) {
    console.error('🔍 PDF Proxy HEAD - Error:', error);
    return new NextResponse(null, { status: 500 });
  }
}
