import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NewsArticle } from '@/types/news';

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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;
    
    const news = mockNews.find(n => n.id === id);
    
    if (!news) {
      return NextResponse.json(
        { message: 'News article not found' },
        { status: 404 }
      );
    }
    
    // Si no está autenticado, solo mostrar noticias públicas
    if (!session && news.status !== 'PUBLISHED') {
      return NextResponse.json(
        { message: 'News article not found' },
        { status: 404 }
      );
    }
    
    // Incrementar contador de vistas si está autenticado
    if (session) {
      news.viewCount++;
    }
    
    return NextResponse.json(news);
  } catch (error) {
    console.error('Error in GET /api/newsarticle/[id]:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;
    
    // Verificar autenticación
    if (!session) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Buscar la noticia
    const newsIndex = mockNews.findIndex(n => n.id === id);
    if (newsIndex === -1) {
      return NextResponse.json(
        { message: 'News article not found' },
        { status: 404 }
      );
    }
    
    const existingNews = mockNews[newsIndex];
    
    // Verificar permisos
    if (!checkPermissions(session, existingNews.authorId)) {
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
    let imageUrl = existingNews.imageUrl;
    if (imageFile && imageFile.size > 0) {
      // Aquí se procesaría la imagen y se subiría a un servicio de almacenamiento
      // Por ahora, simulamos una URL completa
      imageUrl = `http://localhost:3001/uploads/${Date.now()}-${imageFile.name}`;
    }
    
    // Actualizar la noticia
    const updatedNews: NewsArticle = {
      ...existingNews,
      title,
      summary,
      content,
      category,
      status: status || existingNews.status,
      priority: priority || existingNews.priority,
      featured: featured !== undefined ? featured : existingNews.featured,
      updatedAt: new Date().toISOString(),
      publishedAt: status === 'PUBLISHED' ? new Date().toISOString() : existingNews.publishedAt,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : existingNews.tags,
      targetAudience: targetAudience || existingNews.targetAudience,
      region: region || existingNews.region,
      videoUrl: videoUrl || existingNews.videoUrl,
      relatedLinks: relatedLinks || existingNews.relatedLinks,
      imageUrl
    };
    
    // Actualizar en la lista
    mockNews[newsIndex] = updatedNews;
    
    return NextResponse.json(updatedNews);
  } catch (error) {
    console.error('Error in PUT /api/newsarticle/[id]:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { id } = params;
    
    // Verificar autenticación
    if (!session) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Buscar la noticia
    const newsIndex = mockNews.findIndex(n => n.id === id);
    if (newsIndex === -1) {
      return NextResponse.json(
        { message: 'News article not found' },
        { status: 404 }
      );
    }
    
    const existingNews = mockNews[newsIndex];
    
    // Verificar permisos
    if (!checkPermissions(session, existingNews.authorId)) {
      return NextResponse.json(
        { message: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    // Eliminar la noticia
    mockNews.splice(newsIndex, 1);
    
    return NextResponse.json({ message: 'News article deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/newsarticle/[id]:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
