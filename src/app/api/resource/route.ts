import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '@/lib/auth-middleware';
import { API_BASE } from '@/lib/api';

// GET /api/resource - Obtener todos los recursos (público)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const isPublic = searchParams.get('isPublic');
    const featured = searchParams.get('featured');
    const authorId = searchParams.get('authorId');
    const limit = searchParams.get('limit');
    const page = searchParams.get('page');
    const search = searchParams.get('q');
    const municipalityId = searchParams.get('municipalityId');

    // Construir URL con parámetros
    let url = `${API_BASE}/resource`;
    const params = new URLSearchParams();

    if (type) params.append('type', type);
    if (category) params.append('category', category);
    if (isPublic) params.append('isPublic', isPublic);
    if (featured) params.append('featured', featured);
    if (authorId) params.append('authorId', authorId);
    if (limit) params.append('limit', limit);
    if (page) params.append('page', page);
    if (search) params.append('q', search);
    if (municipalityId) params.append('municipalityId', municipalityId);

    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (error) {
    console.error('Error getting resources:', error);
    return NextResponse.json(
      { success: false, message: 'Error retrieving resources' },
      { status: 500 }
    );
  }
}

// POST /api/resource - Crear nuevo recurso (requiere autenticación)
export async function POST(request: NextRequest) {
  try {
    console.log('🔐 POST /api/resource - Iniciando autenticación');

    // Verificar autenticación
    const authResult = await authenticateToken(request);
    console.log('🔐 POST /api/resource - Resultado autenticación:', authResult);

    if (!authResult.success) {
      console.log('🔐 POST /api/resource - Autenticación fallida:', authResult.message);
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verificar si es multipart/form-data (con archivo) o JSON
    const contentType = request.headers.get('content-type') || '';
    console.log('🔐 POST /api/resource - Content-Type:', contentType);

    if (contentType.includes('multipart/form-data')) {
      // Manejar FormData con archivo
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
      const isPublic = formData.get('isPublic') as string;

      // Crear FormData para enviar al backend
      const backendFormData = new FormData();
      if (file) backendFormData.append('file', file);
      backendFormData.append('title', title);
      backendFormData.append('description', description);
      backendFormData.append('type', type);
      backendFormData.append('category', category);
      backendFormData.append('format', format);
      backendFormData.append('author', author);
      backendFormData.append('authorId', authResult.user?.id || '');

      if (externalUrl) backendFormData.append('externalUrl', externalUrl);
      if (publishedDate) backendFormData.append('publishedDate', publishedDate);
      if (tags) backendFormData.append('tags', tags);
      if (isPublic) backendFormData.append('isPublic', isPublic);

      const response = await fetch(`${API_BASE}/resource`, {
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

    } else {
      // Manejar JSON sin archivo
      const body = await request.json();

      // Agregar información del autor
      const resourceData = {
        ...body,
        authorId: authResult.user?.id,
        author: body.author || authResult.user?.username,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        downloads: 0,
        rating: 0,
        isPublic: body.isPublic ?? true,
        // Asegurar que los campos opcionales estén presentes
        externalUrl: body.externalUrl || null,
        publishedDate: body.publishedDate || null,
        tags: body.tags || []
      };

      const response = await fetch(`${API_BASE}/resource`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authResult.token}`,
        },
        body: JSON.stringify(resourceData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data, { status: 201 });
    }

  } catch (error) {
    console.error('Error creating resource:', error);
    return NextResponse.json(
      { success: false, message: 'Error creating resource' },
      { status: 500 }
    );
  }
}
