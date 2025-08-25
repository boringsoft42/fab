import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeaders } from '@/lib/api';
import { API_BASE } from '@/lib/api';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeaders = getAuthHeaders();
    const response = await fetch(`${API_BASE}/resource/${params.id}/download`, {
      method: 'GET',
      headers: {
        ...authHeaders,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the file as a blob
    const blob = await response.blob();
    
    // Get the filename from the response headers or use a default
    const contentDisposition = response.headers.get('content-disposition');
    let filename = 'resource';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    // Return the file as a blob response
    return new NextResponse(blob, {
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error('Error downloading resource:', error);
    return NextResponse.json(
      { success: false, message: 'Error downloading resource' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeaders = getAuthHeaders();
    const response = await fetch(`${API_BASE}/resource/${params.id}/download`, {
      method: 'POST',
      headers: {
        ...authHeaders,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Get the file as a blob
    const blob = await response.blob();
    
    // Get the filename from the response headers or use a default
    const contentDisposition = response.headers.get('content-disposition');
    let filename = 'resource';
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename="(.+)"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    // Return the file as a blob response
    return new NextResponse(blob, {
      headers: {
        'Content-Type': response.headers.get('content-type') || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error('Error downloading resource:', error);
    return NextResponse.json(
      { success: false, message: 'Error downloading resource' },
      { status: 500 }
    );
  }
}
