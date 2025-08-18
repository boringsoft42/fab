import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { getCurrentUserId } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/files/upload/cv - Iniciando');
    
    // Verificar autenticación
    const userId = await getCurrentUserId();
    console.log('User ID:', userId);
    
    if (!userId) {
      console.log('No autorizado - sin userId');
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    console.log('User ID:', userId);
    const formData = await request.formData();
    console.log('FormData recibido, entries:', Array.from(formData.entries()).map(([key, value]) => [key, typeof value]));
    
    const file = formData.get('cvFile') as File;
    console.log('File extraído:', file ? `${file.name} (${file.size} bytes, ${file.type})` : 'No file');

    if (!file) {
      console.log('No se proporcionó ningún archivo');
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
    const filename = `cv-${userId}-${timestamp}-${randomString}.pdf`;
    const filepath = join(uploadsDir, filename);

    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Return success response
    const cvUrl = `/uploads/documents/${filename}`;
    
    return NextResponse.json({
      message: 'CV uploaded successfully',
      cvUrl,
      filename,
      originalName: file.name,
      size: file.size,
      mimetype: file.type
    });

  } catch (error) {
    console.error('Error uploading CV:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
