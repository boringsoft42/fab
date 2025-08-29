import { NextRequest, NextResponse } from 'next/server';
import { ResourceController } from '@/controllers/ResourceController';

// GET /api/resources/[id]/download - Descargar un recurso
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const controller = new ResourceController();
    const blob = await controller.downloadResource(params.id);

    // Obtener información del recurso para el nombre del archivo
    const resource = await controller.getResourceById(params.id);
    const filename = resource?.title || 'resource';

    return new NextResponse(blob, {
      headers: {
        'Content-Type': 'application/octet-stream',
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

// POST /api/resources/[id]/download - Incrementar contador de descargas
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const controller = new ResourceController();
    await controller.downloadResource(params.id);

    return NextResponse.json({ success: true, message: 'Download count incremented' });

  } catch (error) {
    console.error('Error incrementing download count:', error);
    return NextResponse.json(
      { success: false, message: 'Error incrementing download count' },
      { status: 500 }
    );
  }
}
