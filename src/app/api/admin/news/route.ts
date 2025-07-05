import { NextRequest, NextResponse } from &ldquo;next/server&rdquo;;
import { NewsArticle, NewsStatus, NewsPriority } from &ldquo;@/types/news&rdquo;;

// Mock government/NGO news data
const mockAdminNews: NewsArticle[] = [
  {
    id: &ldquo;admin-news-1&rdquo;,
    title: &ldquo;Gobierno Municipal Implementa Nueva Política de Empleo Juvenil&rdquo;,
    content:
      &ldquo;El Gobierno Municipal de Cochabamba anuncia la implementación de una nueva política integral de empleo juvenil que beneficiará a más de 2,000 jóvenes en los próximos 12 meses.\n\nLa política incluye:\n• Programa de primer empleo con subsidio del 50% del salario mínimo\n• Centros de capacitación laboral en oficios técnicos\n• Bolsa de trabajo municipal con prioridad para jóvenes\n• Programa de emprendimiento juvenil con microcréditos\n• Orientación vocacional y laboral gratuita\n\nLa iniciativa tiene un presupuesto de 15 millones de bolivianos y será ejecutada en coordinación con empresas privadas y organizaciones de la sociedad civil.&rdquo;,
    summary:
      &ldquo;Nueva política municipal creará 2,000 empleos para jóvenes con subsidios, capacitación y programas de emprendimiento.&rdquo;,
    imageUrl: &ldquo;/api/placeholder/800/400&rdquo;,
    authorId: &ldquo;gov-1&rdquo;,
    authorName: &ldquo;Gobierno Municipal de Cochabamba&rdquo;,
    authorType: &ldquo;GOVERNMENT&rdquo;,
    authorLogo: &ldquo;/api/placeholder/60/60&rdquo;,
    status: &ldquo;PUBLISHED&rdquo;,
    priority: &ldquo;URGENT&rdquo;,
    featured: true,
    tags: [&ldquo;empleo&rdquo;, &ldquo;juventud&rdquo;, &ldquo;política pública&rdquo;, &ldquo;capacitación&rdquo;],
    category: &ldquo;Política Pública&rdquo;,
    publishedAt: &ldquo;2024-02-27T14:00:00Z&rdquo;,
    createdAt: &ldquo;2024-02-26T10:15:00Z&rdquo;,
    updatedAt: &ldquo;2024-02-27T14:00:00Z&rdquo;,
    viewCount: 2100,
    likeCount: 156,
    commentCount: 45,
    targetAudience: [&ldquo;YOUTH&rdquo;, &ldquo;COMPANIES&rdquo;],
    region: &ldquo;Cochabamba&rdquo;,
  },
  {
    id: &ldquo;admin-news-2&rdquo;,
    title: &ldquo;Ministerio de Educación Anuncia Nueva Plataforma Digital&rdquo;,
    content:
      &ldquo;El Ministerio de Educación presenta la nueva plataforma digital 'Educa Bolivia' que revolucionará el acceso a la educación técnica y superior en el país. La plataforma ofrecerá más de 200 cursos gratuitos certificados.&rdquo;,
    summary:
      &ldquo;Nueva plataforma 'Educa Bolivia' ofrecerá 200 cursos técnicos gratuitos con certificación oficial.&rdquo;,
    imageUrl: &ldquo;/api/placeholder/800/400&rdquo;,
    authorId: &ldquo;gov-2&rdquo;,
    authorName: &ldquo;Ministerio de Educación&rdquo;,
    authorType: &ldquo;GOVERNMENT&rdquo;,
    authorLogo: &ldquo;/api/placeholder/60/60&rdquo;,
    status: &ldquo;PUBLISHED&rdquo;,
    priority: &ldquo;HIGH&rdquo;,
    featured: true,
    tags: [&ldquo;educación&rdquo;, &ldquo;tecnología&rdquo;, &ldquo;cursos gratuitos&rdquo;, &ldquo;certificación&rdquo;],
    category: &ldquo;Educación Digital&rdquo;,
    publishedAt: &ldquo;2024-02-24T10:00:00Z&rdquo;,
    createdAt: &ldquo;2024-02-23T14:30:00Z&rdquo;,
    updatedAt: &ldquo;2024-02-24T10:00:00Z&rdquo;,
    viewCount: 3200,
    likeCount: 245,
    commentCount: 67,
    targetAudience: [&ldquo;YOUTH&rdquo;, &ldquo;ALL&rdquo;],
    region: &ldquo;Nacional&rdquo;,
  },
  {
    id: &ldquo;admin-news-3&rdquo;,
    title: &ldquo;ONG Futuro Verde Lanza Programa de Educación Ambiental&rdquo;,
    content:
      &ldquo;La ONG Futuro Verde presenta su nuevo programa de educación ambiental dirigido a jóvenes de 15 a 25 años. El programa tiene como objetivo formar líderes ambientales que promuevan el desarrollo sostenible en sus comunidades.&rdquo;,
    summary:
      &ldquo;ONG Futuro Verde ofrece programa gratuito de educación ambiental para formar líderes jóvenes en sostenibilidad.&rdquo;,
    imageUrl: &ldquo;/api/placeholder/800/400&rdquo;,
    authorId: &ldquo;ngo-1&rdquo;,
    authorName: &ldquo;ONG Futuro Verde&rdquo;,
    authorType: &ldquo;NGO&rdquo;,
    authorLogo: &ldquo;/api/placeholder/60/60&rdquo;,
    status: &ldquo;DRAFT&rdquo;,
    priority: &ldquo;MEDIUM&rdquo;,
    featured: false,
    tags: [&ldquo;medio ambiente&rdquo;, &ldquo;educación&rdquo;, &ldquo;sostenibilidad&rdquo;, &ldquo;liderazgo&rdquo;],
    category: &ldquo;Programas Sociales&rdquo;,
    publishedAt: &ldquo;&rdquo;,
    createdAt: &ldquo;2024-02-24T09:20:00Z&rdquo;,
    updatedAt: &ldquo;2024-02-25T12:00:00Z&rdquo;,
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    targetAudience: [&ldquo;YOUTH&rdquo;],
    region: &ldquo;La Paz&rdquo;,
  },
];

// GET /api/admin/news - Fetch admin news
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get(&ldquo;organizationId&rdquo;);
    const type = searchParams.get(&ldquo;type&rdquo;); // &ldquo;GOVERNMENT&rdquo; or &ldquo;NGO&rdquo;
    const status = searchParams.get(&ldquo;status&rdquo;);
    const limit = parseInt(searchParams.get(&ldquo;limit&rdquo;) || &ldquo;10&rdquo;);
    const page = parseInt(searchParams.get(&ldquo;page&rdquo;) || &ldquo;1&rdquo;);

    let filtered = mockAdminNews;

    // Filter by organization if specified
    if (organizationId) {
      filtered = filtered.filter((news) => news.authorId === organizationId);
    }

    // Filter by type if specified
    if (type && type !== &ldquo;all&rdquo;) {
      filtered = filtered.filter(
        (news) => news.authorType === type.toUpperCase()
      );
    }

    // Filter by status if specified
    if (status && status !== &ldquo;all&rdquo;) {
      filtered = filtered.filter(
        (news) => news.status === status.toUpperCase()
      );
    }

    // Sort by creation date (most recent first)
    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedNews = filtered.slice(startIndex, endIndex);

    // Calculate stats
    const stats = {
      total: filtered.length,
      published: mockAdminNews.filter((n) => n.status === &ldquo;PUBLISHED&rdquo;).length,
      draft: mockAdminNews.filter((n) => n.status === &ldquo;DRAFT&rdquo;).length,
      archived: mockAdminNews.filter((n) => n.status === &ldquo;ARCHIVED&rdquo;).length,
      totalViews: mockAdminNews.reduce((sum, n) => sum + n.viewCount, 0),
      totalLikes: mockAdminNews.reduce((sum, n) => sum + n.likeCount, 0),
      totalComments: mockAdminNews.reduce((sum, n) => sum + n.commentCount, 0),
    };

    return NextResponse.json({
      news: paginatedNews,
      pagination: {
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
      },
      stats,
    });
  } catch (error) {
    console.error(&ldquo;Error fetching admin news:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Error al obtener noticias administrativas&rdquo; },
      { status: 500 }
    );
  }
}

// POST /api/admin/news - Create new admin news
export async function POST(request: NextRequest) {
  try {
    const newsData = await request.json();

    // Validate required fields
    const requiredFields = [
      &ldquo;title&rdquo;,
      &ldquo;content&rdquo;,
      &ldquo;summary&rdquo;,
      &ldquo;organizationId&rdquo;,
      &ldquo;organizationName&rdquo;,
      &ldquo;organizationType&rdquo;,
    ];
    for (const field of requiredFields) {
      if (!newsData[field]) {
        return NextResponse.json(
          { error: `El campo ${field} es requerido` },
          { status: 400 }
        );
      }
    }

    const newNews: NewsArticle = {
      id: `admin-news-${Date.now()}`,
      title: newsData.title,
      content: newsData.content,
      summary: newsData.summary,
      imageUrl: newsData.imageUrl,
      videoUrl: newsData.videoUrl,
      authorId: newsData.organizationId,
      authorName: newsData.organizationName,
      authorType: newsData.organizationType, // &ldquo;GOVERNMENT&rdquo; or &ldquo;NGO&rdquo;
      authorLogo: newsData.organizationLogo,
      status: newsData.status || &ldquo;DRAFT&rdquo;,
      priority: newsData.priority || &ldquo;MEDIUM&rdquo;,
      featured: newsData.featured || false,
      tags: newsData.tags || [],
      category: newsData.category || &ldquo;General&rdquo;,
      publishedAt:
        newsData.status === &ldquo;PUBLISHED&rdquo; ? new Date().toISOString() : &ldquo;&rdquo;,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      targetAudience: newsData.targetAudience || [&ldquo;YOUTH&rdquo;],
      region: newsData.region,
      relatedLinks: newsData.relatedLinks || [],
      expiresAt: newsData.expiresAt,
    };

    // In real app, this would save to database using Prisma
    mockAdminNews.unshift(newNews);

    return NextResponse.json(
      {
        message: &ldquo;Noticia creada exitosamente&rdquo;,
        news: newNews,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(&ldquo;Error creating admin news:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Error al crear noticia&rdquo; },
      { status: 500 }
    );
  }
}

// PUT /api/admin/news - Update admin news
export async function PUT(request: NextRequest) {
  try {
    const updateData = await request.json();
    const { id, ...newsData } = updateData;

    if (!id) {
      return NextResponse.json(
        { error: &ldquo;ID de noticia es requerido&rdquo; },
        { status: 400 }
      );
    }

    const newsIndex = mockAdminNews.findIndex((news) => news.id === id);
    if (newsIndex === -1) {
      return NextResponse.json(
        { error: &ldquo;Noticia no encontrada&rdquo; },
        { status: 404 }
      );
    }

    // Update the news article
    const updatedNews = {
      ...mockAdminNews[newsIndex],
      ...newsData,
      updatedAt: new Date().toISOString(),
      publishedAt:
        newsData.status === &ldquo;PUBLISHED&rdquo; && !mockAdminNews[newsIndex].publishedAt
          ? new Date().toISOString()
          : mockAdminNews[newsIndex].publishedAt,
    };

    mockAdminNews[newsIndex] = updatedNews;

    return NextResponse.json({
      message: &ldquo;Noticia actualizada exitosamente&rdquo;,
      news: updatedNews,
    });
  } catch (error) {
    console.error(&ldquo;Error updating admin news:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Error al actualizar noticia&rdquo; },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/news - Delete admin news
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get(&ldquo;id&rdquo;);

    if (!id) {
      return NextResponse.json(
        { error: &ldquo;ID de noticia es requerido&rdquo; },
        { status: 400 }
      );
    }

    const newsIndex = mockAdminNews.findIndex((news) => news.id === id);
    if (newsIndex === -1) {
      return NextResponse.json(
        { error: &ldquo;Noticia no encontrada&rdquo; },
        { status: 404 }
      );
    }

    // Remove the news article
    mockAdminNews.splice(newsIndex, 1);

    return NextResponse.json({
      message: &ldquo;Noticia eliminada exitosamente&rdquo;,
    });
  } catch (error) {
    console.error(&ldquo;Error deleting admin news:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Error al eliminar noticia&rdquo; },
      { status: 500 }
    );
  }
}
