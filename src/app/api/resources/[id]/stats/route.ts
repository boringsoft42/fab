import { NextRequest, NextResponse } from 'next/server';
import { ResourceController } from '@/controllers/ResourceController';

// GET /api/resources/[id]/stats - Obtener estadísticas de un recurso
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const controller = new ResourceController();
    const stats = await controller.getResourceStats(params.id);

    return NextResponse.json({ success: true, data: stats });

  } catch (error) {
    console.error('Error getting resource stats:', error);
    return NextResponse.json(
      { success: false, message: 'Error retrieving resource stats' },
      { status: 500 }
    );
  }
}
