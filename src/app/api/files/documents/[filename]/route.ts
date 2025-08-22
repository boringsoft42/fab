import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';
import { getCurrentUserId } from '@/lib/auth';

export async function GET(
    request: NextRequest,
    { params }: { params: { filename: string } }
) {
    try {
        // Verificar autenticación
        const userId = await getCurrentUserId();

        if (!userId) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            );
        }

        const filename = params.filename;

        // Validar el nombre del archivo para evitar path traversal
        if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
            return NextResponse.json(
                { error: "Nombre de archivo inválido" },
                { status: 400 }
            );
        }

        const filePath = join(process.cwd(), 'public', 'uploads', 'documents', filename);

        if (!existsSync(filePath)) {
            return NextResponse.json(
                { error: "Archivo no encontrado" },
                { status: 404 }
            );
        }

        // Leer el archivo
        const fileBuffer = await readFile(filePath);

        // Determinar el tipo MIME basado en la extensión
        const extension = filename.split('.').pop()?.toLowerCase();
        let contentType = 'application/octet-stream';

        if (extension === 'pdf') {
            contentType = 'application/pdf';
        } else if (extension === 'doc') {
            contentType = 'application/msword';
        } else if (extension === 'docx') {
            contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        }

        // Crear la respuesta con los headers apropiados
        return new NextResponse(fileBuffer, {
            status: 200,
            headers: {
                'Content-Type': contentType,
                'Content-Disposition': `inline; filename="${filename}"`,
                'Cache-Control': 'public, max-age=3600',
            },
        });
    } catch (error) {
        console.error('Error serving document:', error);
        return NextResponse.json(
            { error: 'Error interno del servidor' },
            { status: 500 }
        );
    }
} 