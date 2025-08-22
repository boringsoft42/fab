import { NextRequest, NextResponse } from 'next/server';
import { getAuthHeaders , API_BASE} from '@/lib/api';

export async function GET(request: NextRequest) {
  try {
    const backendUrl = process.env.BACKEND_URL || '${BACKEND_URL}';
    const url = `${backendUrl}/api/entrepreneurship/my`;
    

    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...getAuthHeaders()
      }
    });

    if (!response.ok) {
      console.error('🔍 API Route - Backend error:', response.status, response.statusText);
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();

    
    return NextResponse.json(data);
  } catch (error) {
    console.error('🔍 API Route - Error getting my entrepreneurships:', error);
    return NextResponse.json(
      { error: 'Error al cargar mis emprendimientos' },
      { status: 500 }
    );
  }
}
