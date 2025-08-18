import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { getCurrentUserId } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    const formData = await request.formData();
    const file = formData.get('cvFile') as File; // Using same field name as CV for consistency

    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Validate file type
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Solo se permiten archivos PDF' },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'El archivo es demasiado grande. Máximo 10MB' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'documents');
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename with user ID
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const filename = `cover-letter-${userId}-${timestamp}-${randomString}.pdf`;
    const filepath = join(uploadsDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Return success response
    const cvUrl = `/uploads/documents/${filename}`;
    
    return NextResponse.json({
      message: 'Cover letter uploaded successfully',
      cvUrl,
      filename,
      originalName: file.name,
      size: file.size,
      mimetype: file.type
    });

  } catch (error) {
    console.error('Error uploading cover letter:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
