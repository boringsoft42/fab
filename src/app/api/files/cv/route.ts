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
        hasCV: false,
        cvUrl: null
      });
    }

    // Buscar archivos CV específicos del usuario
    const files = await readdir(uploadsDir);
    const userCVFiles = files.filter(file => 
      file.startsWith(`cv-${userId}-`) && file.endsWith('.pdf')
    );
    
    if (userCVFiles.length > 0) {
      // Retornar el CV más reciente del usuario
      const latestCV = userCVFiles.sort().pop();
      return NextResponse.json({
        hasCV: true,
        cvUrl: `/uploads/documents/${latestCV}`
      });
    }

    // NO usar fallback de archivos generales - solo archivos específicos del usuario
    // const generalCVFiles = files.filter(file => 
    //   file.startsWith('cv-') && file.endsWith('.pdf') && !file.includes('-')
    // );
    
    // if (generalCVFiles.length > 0) {
    //   const latestGeneralCV = generalCVFiles.sort().pop();
    //   return NextResponse.json({
    //     hasCV: true,
    //     cvUrl: `/uploads/documents/${latestGeneralCV}`
    //   });
    // }

    return NextResponse.json({
      hasCV: false,
      cvUrl: null
    });

  } catch (error) {
    console.error('Error checking CV:', error);
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
        message: 'No hay CV para eliminar'
      });
    }

    // Buscar y eliminar archivos CV del usuario
    const files = await readdir(uploadsDir);
    const userCVFiles = files.filter(file => 
      file.startsWith(`cv-${userId}-`) && file.endsWith('.pdf')
    );
    
    if (userCVFiles.length > 0) {
      // Eliminar todos los CV del usuario
      for (const file of userCVFiles) {
        const filepath = join(uploadsDir, file);
        await unlink(filepath);
      }
      
      return NextResponse.json({
        message: `Se eliminaron ${userCVFiles.length} CV(s) del usuario`
      });
    }

    return NextResponse.json({
      message: 'No se encontraron CV para eliminar'
    });

  } catch (error) {
    console.error('Error deleting CV:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
