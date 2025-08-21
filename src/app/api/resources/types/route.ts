import { NextRequest, NextResponse } from 'next/server';
import { ResourceController } from '@/controllers/ResourceController';

// GET /api/resources/types - Obtener tipos de recursos
export async function GET(request: NextRequest) {
  try {
    const controller = new ResourceController();
    const types = await controller.getResourceTypes();

    return NextResponse.json({ success: true, data: types });

  } catch (error) {
    console.error('Error getting resource types:', error);
    return NextResponse.json(
      { success: false, message: 'Error retrieving resource types' },
      { status: 500 }
    );
  }
}
