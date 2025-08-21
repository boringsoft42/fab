import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth-middleware';
import { ResourceController } from '@/controllers/ResourceController';

// POST /api/resources/[id]/rate - Calificar un recurso
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticación
    const authResult = await authenticateToken(request);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { rating } = body;

    if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, message: 'Valid rating (1-5) is required' },
        { status: 400 }
      );
    }

    const controller = new ResourceController();
    const resource = await controller.rateResource(params.id, rating, authResult.user);

    return NextResponse.json({ success: true, data: resource });

  } catch (error) {
    console.error('Error rating resource:', error);
    return NextResponse.json(
      { success: false, message: 'Error rating resource' },
      { status: 500 }
    );
  }
}
