import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth-middleware';
import { API_BASE } from '@/lib/api';

// POST /api/resource/upload - Subir archivo de recurso
export async function POST(request: NextRequest) {
  try {
    console.log('🔐 POST /api/resource/upload - Iniciando autenticación');
    
    // Verificar autenticación
    const authResult = await authenticateToken(request);
    console.log('🔐 POST /api/resource/upload - Resultado autenticación:', authResult);
    
    if (!authResult.success) {
      console.log('🔐 POST /api/resource/upload - Autenticación fallida:', authResult.message);
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const type = formData.get('type') as string;
    const category = formData.get('category') as string;
    const format = formData.get('format') as string;
    const author = formData.get('author') as string;
    const externalUrl = formData.get('externalUrl') as string;
    const publishedDate = formData.get('publishedDate') as string;
    const tags = formData.get('tags') as string;

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    const allowedTypes = [
      // Documentos
      'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/zip', 'application/x-rar-compressed',
      // Videos
      'video/mp4', 'video/webm', 'video/ogg', 'video/x-msvideo', 'video/quicktime', 'video/x-ms-wmv', 'video/x-flv', 'video/x-matroska',
      // Audio
      'audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/aac', 'audio/flac',
      // Imágenes
      'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml', 'image/bmp', 'image/tiff',
      // Texto
      'text/plain', 'text/csv', 'text/html', 'text/css', 'application/javascript', 'application/json', 'application/xml'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: 'File type not allowed' },
        { status: 400 }
      );
    }

    // Validar tamaño (100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, message: 'File too large. Maximum size is 100MB' },
        { status: 400 }
      );
    }

    // Crear FormData para enviar al backend
    const backendFormData = new FormData();
    backendFormData.append('file', file);
    backendFormData.append('title', title);
    backendFormData.append('description', description);
    backendFormData.append('type', type);
    backendFormData.append('category', category);
    backendFormData.append('format', format);
    backendFormData.append('author', author);
    backendFormData.append('authorId', authResult.user.id);
    
    if (externalUrl) {
      backendFormData.append('externalUrl', externalUrl);
    }
    
    if (publishedDate) {
      backendFormData.append('publishedDate', publishedDate);
    }
    
    if (tags) {
      backendFormData.append('tags', tags);
    }

    const response = await fetch('${API_BASE}/resource/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authResult.token}`,
      },
      body: backendFormData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });

  } catch (error) {
    console.error('Error uploading resource file:', error);
    return NextResponse.json(
      { success: false, message: 'Error uploading file' },
      { status: 500 }
    );
  }
}
