import { NextRequest, NextResponse } from 'next/server';
import { readdir, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { getCurrentUserId } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Verificar autenticación
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'documents');
    
    if (!existsSync(uploadsDir)) {
      return NextResponse.json({
        hasCoverLetter: false,
        cvUrl: null
      });
    }

    // Buscar archivos de carta de presentación específicos del usuario
    const files = await readdir(uploadsDir);
    const userCoverLetterFiles = files.filter(file => 
      file.startsWith(`cover-letter-${userId}-`) && file.endsWith('.pdf')
    );
    
    if (userCoverLetterFiles.length > 0) {
      // Retornar la carta de presentación más reciente del usuario
      const latestCoverLetter = userCoverLetterFiles.sort().pop();
      return NextResponse.json({
        hasCoverLetter: true,
        cvUrl: `/uploads/documents/${latestCoverLetter}`
      });
    }

    return NextResponse.json({
      hasCoverLetter: false,
      cvUrl: null
    });

  } catch (error) {
    console.error('Error checking cover letter:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Verificar autenticación
    const userId = await getCurrentUserId();
    
    if (!userId) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'documents');
    
    if (!existsSync(uploadsDir)) {
      return NextResponse.json({
        message: 'No hay carta de presentación para eliminar'
      });
    }

    // Buscar y eliminar archivos de carta de presentación del usuario
    const files = await readdir(uploadsDir);
    const userCoverLetterFiles = files.filter(file => 
      file.startsWith(`cover-letter-${userId}-`) && file.endsWith('.pdf')
    );
    
    if (userCoverLetterFiles.length > 0) {
      // Eliminar todas las cartas de presentación del usuario
      for (const file of userCoverLetterFiles) {
        const filepath = join(uploadsDir, file);
        await unlink(filepath);
      }
      
      return NextResponse.json({
        message: `Se eliminaron ${userCoverLetterFiles.length} carta(s) de presentación del usuario`
      });
    }

    return NextResponse.json({
      message: 'No se encontraron cartas de presentación para eliminar'
    });

  } catch (error) {
    console.error('Error deleting cover letter:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
