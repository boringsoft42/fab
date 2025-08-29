import { NextRequest, NextResponse } from 'next/server';
import { ResourceController } from '@/controllers/ResourceController';

// GET /api/resources/categories - Obtener categorías de recursos
export async function GET() {
  try {
    const controller = new ResourceController();
    const categories = await controller.getResourceCategories();

    return NextResponse.json({ success: true, data: categories });

  } catch (error) {
    console.error('Error getting resource categories:', error);
    return NextResponse.json(
      { success: false, message: 'Error retrieving resource categories' },
      { status: 500 }
    );
  }
}
