import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NewsArticle } from '@/types/news';
import { API_BASE } from '@/lib/api';

// Mock data - será reemplazado por Prisma
let mockNews: NewsArticle[] = [
  {
    id: '1',
    title: 'Noticia de ejemplo',
    summary: 'Esta es una noticia de ejemplo',
    content: 'Contenido completo de la noticia de ejemplo',
    category: 'General',
    authorId: 'company-1',
    authorType: 'COMPANIES',
    status: 'PUBLISHED',
    priority: 'MEDIUM',
    featured: false,
    viewCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    tags: ['ejemplo'],
    targetAudience: 'General',
    region: 'Nacional',
    videoUrl: '',
    relatedLinks: '',
    imageUrl: ''
  }
];

// Helper functions
const generateId = () => Math.random().toString(36).substr(2, 9);

const validateNewsData = (data: any) => {
  const { title, content, summary, category } = data;
  
  if (!title || !content || !summary || !category) {
    return {
      isValid: false,
      message: "Title, content, summary, and category are required"
    };
  }
  
  return { isValid: true };
};

const checkPermissions = (session: any, authorId?: string) => {
  if (!session) return false;
  
  const allowedRoles = ['COMPANIES', 'MUNICIPAL_GOVERNMENTS', 'SUPERADMIN'];
  if (!allowedRoles.includes(session.user.role)) return false;
  
  // Si se proporciona authorId, verificar que coincida con el usuario actual
  if (authorId && session.user.id !== authorId) return false;
  
  return true;
};

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(request.url);
    
    // Si no está autenticado, devolver noticias públicas
    if (!session) {
      const publicNews = mockNews.filter(news => news.status === 'PUBLISHED');
      return NextResponse.json(publicNews);
    }
    
    // Filtrar por parámetros
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const authorType = searchParams.get('authorType');
    const authorId = searchParams.get('authorId');
    
    let filteredNews = mockNews;
    
    // Filtrar por autor si está autenticado
    if (authorId) {
      filteredNews = filteredNews.filter(news => news.authorId === authorId);
    }
    
    if (status) {
      filteredNews = filteredNews.filter(news => news.status === status);
    }
    
    if (category) {
      filteredNews = filteredNews.filter(news => news.category === category);
    }
    
    if (authorType) {
      filteredNews = filteredNews.filter(news => news.authorType === authorType);
    }
    
    return NextResponse.json(filteredNews);
  } catch (error) {
    console.error('Error in GET /api/newsarticle:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Verificar autenticación
    if (!session) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Verificar permisos
    if (!checkPermissions(session)) {
      return NextResponse.json(
        { message: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    // Parse multipart/form-data
    const formData = await request.formData();
    
    // Extraer datos del FormData
    const title = formData.get('title') as string;
    const summary = formData.get('summary') as string;
    const content = formData.get('content') as string;
    const category = formData.get('category') as string;
    const tags = formData.get('tags') as string;
    const priority = formData.get('priority') as string;
    const status = formData.get('status') as string;
    const featured = formData.get('featured') === 'true';
    const targetAudience = formData.get('targetAudience') as string;
    const region = formData.get('region') as string;
    const videoUrl = formData.get('videoUrl') as string;
    const relatedLinks = formData.get('relatedLinks') as string;
    const imageFile = formData.get('image') as File;
    
    // Validar datos requeridos
    const validation = validateNewsData({ title, content, summary, category });
    if (!validation.isValid) {
      return NextResponse.json(
        { message: validation.message },
        { status: 400 }
      );
    }
    
    // Procesar imagen si existe
    let imageUrl = '';
    if (imageFile && imageFile.size > 0) {
      // Aquí se procesaría la imagen y se subiría a un servicio de almacenamiento
      // Por ahora, simulamos una URL completa
      imageUrl = `${BACKEND_URL}/uploads/${Date.now()}-${imageFile.name}`;
    }
    
    // Crear nueva noticia
    const newNews: NewsArticle = {
      id: generateId(),
      title,
      summary,
      content,
      category,
      authorId: session.user.id,
      authorType: session.user.role,
      status: status || 'DRAFT',
      priority: priority || 'MEDIUM',
      featured: featured || false,
      viewCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: status === 'PUBLISHED' ? new Date().toISOString() : '',
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      targetAudience: targetAudience || '',
      region: region || '',
      videoUrl: videoUrl || '',
      relatedLinks: relatedLinks || '',
      imageUrl
    };
    
    // Agregar a la lista de noticias
    mockNews.push(newNews);
    
    return NextResponse.json(newNews, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/newsarticle:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
