import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pdfPath = searchParams.get('path');
    const pdfUrl = searchParams.get('url');

    let targetUrl: string | null = null;

    if (pdfPath) {
      // Validar que la URL sea de MinIO (local o producción)
      if (!pdfPath.startsWith('http://127.0.0.1:9000/') &&
        !pdfPath.startsWith('http://localhost:9000/') &&
        !pdfPath.startsWith('https://bucket-production-1a58.up.railway.app/')) {
        return NextResponse.json({ error: 'Invalid PDF URL' }, { status: 400 });
      }
      targetUrl = pdfPath;
    } else if (pdfUrl) {
      // Validar que la URL sea de un dominio permitido para certificados
      const allowedDomains = [
        'minio.example.com',
        'localhost:9000',
        '127.0.0.1:9000',
        'bucket-production-1a58.up.railway.app'
      ];

      const urlObj = new URL(pdfUrl);
      const isAllowed = allowedDomains.some(domain =>
        urlObj.hostname === domain || urlObj.host === domain
      );

      if (!isAllowed) {
        return NextResponse.json({ error: 'Invalid external URL' }, { status: 400 });
      }

      targetUrl = pdfUrl;
    } else {
      return NextResponse.json({ error: 'PDF path or URL is required' }, { status: 400 });
    }

    console.log('🔍 PDF Proxy - Fetching from:', targetUrl);

    // Hacer la petición
    const response = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/pdf',
      },
    });

    if (!response.ok) {
      console.error('🔍 PDF Proxy - Response not ok:', response.status, response.statusText);
      return NextResponse.json({ error: 'Failed to fetch PDF' }, { status: response.status });
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
    const pdfUrl = searchParams.get('url');

    let targetUrl: string | null = null;

    if (pdfPath) {
      // Validar que la URL sea de MinIO (local o producción)
      if (!pdfPath.startsWith('http://127.0.0.1:9000/') &&
        !pdfPath.startsWith('http://localhost:9000/') &&
        !pdfPath.startsWith('https://bucket-production-1a58.up.railway.app/')) {
        return new NextResponse(null, { status: 400 });
      }
      targetUrl = pdfPath;
    } else if (pdfUrl) {
      // Validar que la URL sea de un dominio permitido para certificados
      const allowedDomains = [
        'minio.example.com',
        'localhost:9000',
        '127.0.0.1:9000',
        'bucket-production-1a58.up.railway.app'
      ];

      const urlObj = new URL(pdfUrl);
      const isAllowed = allowedDomains.some(domain =>
        urlObj.hostname === domain || urlObj.host === domain
      );

      if (!isAllowed) {
        return new NextResponse(null, { status: 400 });
      }

      targetUrl = pdfUrl;
    } else {
      return new NextResponse(null, { status: 400 });
    }

    // Hacer HEAD request
    const response = await fetch(targetUrl, {
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
