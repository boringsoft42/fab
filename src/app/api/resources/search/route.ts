import { NextRequest, NextResponse } from 'next/server';
import { ResourceController } from '@/controllers/ResourceController';

// GET /api/resources/search - Buscar recursos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Search query is required' },
        { status: 400 }
      );
    }

    const controller = new ResourceController();
    const results = await controller.searchResources(query);

    return NextResponse.json({ success: true, data: results });

  } catch (error) {
    console.error('Error searching resources:', error);
    return NextResponse.json(
      { success: false, message: 'Error searching resources' },
      { status: 500 }
    );
  }
}
