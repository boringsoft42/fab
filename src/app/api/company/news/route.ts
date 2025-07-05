import { NextRequest, NextResponse } from &ldquo;next/server&rdquo;;
import { NewsArticle, NewsStatus, NewsPriority } from &ldquo;@/types/news&rdquo;;

// Mock company news data
const mockCompanyNews: NewsArticle[] = [
  {
    id: &ldquo;company-news-1&rdquo;,
    title: &ldquo;TechCorp Bolivia Lanza Programa de Becas 2024&rdquo;,
    content:
      &ldquo;TechCorp Bolivia anuncia su programa anual de becas dirigido a jóvenes talentos en tecnología. El programa incluye 50 becas completas para estudios superiores en ingeniería de sistemas, desarrollo de software y ciencia de datos.\n\nLos beneficiarios recibirán:\n• Beca completa para estudios universitarios\n• Mentoring personalizado con profesionales de la empresa\n• Oportunidad de prácticas profesionales\n• Acceso a cursos especializados en tecnologías emergentes\n\nLas postulaciones están abiertas hasta el 31 de marzo. Los requisitos incluyen promedio mínimo de 80 puntos en bachillerato y demostrar pasión por la tecnología.&rdquo;,
    summary:
      &ldquo;TechCorp Bolivia ofrece 50 becas completas para jóvenes interesados en carreras tecnológicas, incluyendo mentoring y oportunidades de prácticas.&rdquo;,
    imageUrl: &ldquo;/api/placeholder/800/400&rdquo;,
    authorId: &ldquo;company-1&rdquo;,
    authorName: &ldquo;TechCorp Bolivia&rdquo;,
    authorType: &ldquo;COMPANY&rdquo;,
    authorLogo: &ldquo;/logos/techcorp.svg&rdquo;,
    status: &ldquo;PUBLISHED&rdquo;,
    priority: &ldquo;HIGH&rdquo;,
    featured: true,
    tags: [&ldquo;educación&rdquo;, &ldquo;becas&rdquo;, &ldquo;tecnología&rdquo;, &ldquo;oportunidades&rdquo;],
    category: &ldquo;Educación y Becas&rdquo;,
    publishedAt: &ldquo;2024-02-28T09:00:00Z&rdquo;,
    createdAt: &ldquo;2024-02-27T15:30:00Z&rdquo;,
    updatedAt: &ldquo;2024-02-28T09:00:00Z&rdquo;,
    viewCount: 1250,
    likeCount: 89,
    commentCount: 23,
    targetAudience: [&ldquo;YOUTH&rdquo;],
    region: &ldquo;Cochabamba&rdquo;,
    relatedLinks: [
      {
        title: &ldquo;Formulario de Postulación&rdquo;,
        url: &ldquo;https://techcorp.bo/becas2024&rdquo;,
      },
    ],
  },
  {
    id: &ldquo;company-news-2&rdquo;,
    title: &ldquo;Innovate Labs Busca 20 Desarrolladores Junior&rdquo;,
    content:
      &ldquo;Innovate Labs, startup líder en desarrollo de aplicaciones móviles, anuncia la apertura de 20 posiciones para desarrolladores junior. La empresa ofrece un ambiente de trabajo dinámico y oportunidades de crecimiento profesional acelerado.&rdquo;,
    summary:
      &ldquo;Innovate Labs ofrece 20 empleos para desarrolladores junior con salarios competitivos y ambiente de startup.&rdquo;,
    imageUrl: &ldquo;/api/placeholder/800/400&rdquo;,
    authorId: &ldquo;company-2&rdquo;,
    authorName: &ldquo;Innovate Labs&rdquo;,
    authorType: &ldquo;COMPANY&rdquo;,
    authorLogo: &ldquo;/logos/innovatelabs.svg&rdquo;,
    status: &ldquo;PUBLISHED&rdquo;,
    priority: &ldquo;MEDIUM&rdquo;,
    featured: false,
    tags: [&ldquo;empleo&rdquo;, &ldquo;desarrollo&rdquo;, &ldquo;tecnología&rdquo;, &ldquo;startup&rdquo;],
    category: &ldquo;Ofertas de Empleo&rdquo;,
    publishedAt: &ldquo;2024-02-26T16:30:00Z&rdquo;,
    createdAt: &ldquo;2024-02-25T11:45:00Z&rdquo;,
    updatedAt: &ldquo;2024-02-26T16:30:00Z&rdquo;,
    viewCount: 890,
    likeCount: 67,
    commentCount: 12,
    targetAudience: [&ldquo;YOUTH&rdquo;],
    region: &ldquo;Santa Cruz&rdquo;,
  },
  {
    id: &ldquo;company-news-3&rdquo;,
    title: &ldquo;FutureWorks Implementa Programa de Diversidad e Inclusión&rdquo;,
    content:
      &ldquo;FutureWorks anuncia la implementación de su programa de diversidad e inclusión con enfoque especial en la contratación de jóvenes talentos de comunidades rurales.&rdquo;,
    summary:
      &ldquo;FutureWorks lanza programa de inclusión con becas y empleos especiales para jóvenes de comunidades rurales.&rdquo;,
    imageUrl: &ldquo;/api/placeholder/800/400&rdquo;,
    authorId: &ldquo;company-3&rdquo;,
    authorName: &ldquo;FutureWorks&rdquo;,
    authorType: &ldquo;COMPANY&rdquo;,
    authorLogo: &ldquo;/logos/futureworks.svg&rdquo;,
    status: &ldquo;DRAFT&rdquo;,
    priority: &ldquo;MEDIUM&rdquo;,
    featured: false,
    tags: [&ldquo;diversidad&rdquo;, &ldquo;inclusión&rdquo;, &ldquo;empleo rural&rdquo;, &ldquo;oportunidades&rdquo;],
    category: &ldquo;Responsabilidad Social&rdquo;,
    publishedAt: &ldquo;&rdquo;,
    createdAt: &ldquo;2024-02-22T16:00:00Z&rdquo;,
    updatedAt: &ldquo;2024-02-23T13:15:00Z&rdquo;,
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    targetAudience: [&ldquo;YOUTH&rdquo;],
    region: &ldquo;Cochabamba&rdquo;,
  },
];

// GET /api/company/news - Fetch company news
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get(&ldquo;companyId&rdquo;);
    const status = searchParams.get(&ldquo;status&rdquo;);
    const limit = parseInt(searchParams.get(&ldquo;limit&rdquo;) || &ldquo;10&rdquo;);
    const page = parseInt(searchParams.get(&ldquo;page&rdquo;) || &ldquo;1&rdquo;);

    let filtered = mockCompanyNews;

    // Filter by company if specified
    if (companyId) {
      filtered = filtered.filter((news) => news.authorId === companyId);
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
      published: mockCompanyNews.filter((n) => n.status === &ldquo;PUBLISHED&rdquo;).length,
      draft: mockCompanyNews.filter((n) => n.status === &ldquo;DRAFT&rdquo;).length,
      archived: mockCompanyNews.filter((n) => n.status === &ldquo;ARCHIVED&rdquo;).length,
      totalViews: mockCompanyNews.reduce((sum, n) => sum + n.viewCount, 0),
      totalLikes: mockCompanyNews.reduce((sum, n) => sum + n.likeCount, 0),
      totalComments: mockCompanyNews.reduce(
        (sum, n) => sum + n.commentCount,
        0
      ),
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
    console.error(&ldquo;Error fetching company news:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Error al obtener noticias de la empresa&rdquo; },
      { status: 500 }
    );
  }
}

// POST /api/company/news - Create new company news
export async function POST(request: NextRequest) {
  try {
    const newsData = await request.json();

    // Validate required fields
    const requiredFields = [
      &ldquo;title&rdquo;,
      &ldquo;content&rdquo;,
      &ldquo;summary&rdquo;,
      &ldquo;companyId&rdquo;,
      &ldquo;companyName&rdquo;,
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
      id: `company-news-${Date.now()}`,
      title: newsData.title,
      content: newsData.content,
      summary: newsData.summary,
      imageUrl: newsData.imageUrl,
      videoUrl: newsData.videoUrl,
      authorId: newsData.companyId,
      authorName: newsData.companyName,
      authorType: &ldquo;COMPANY&rdquo;,
      authorLogo: newsData.companyLogo,
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
    };

    // In real app, this would save to database using Prisma
    mockCompanyNews.unshift(newNews);

    return NextResponse.json(
      {
        message: &ldquo;Noticia creada exitosamente&rdquo;,
        news: newNews,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(&ldquo;Error creating company news:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Error al crear noticia&rdquo; },
      { status: 500 }
    );
  }
}

// PUT /api/company/news - Update company news
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

    const newsIndex = mockCompanyNews.findIndex((news) => news.id === id);
    if (newsIndex === -1) {
      return NextResponse.json(
        { error: &ldquo;Noticia no encontrada&rdquo; },
        { status: 404 }
      );
    }

    // Update the news article
    const updatedNews = {
      ...mockCompanyNews[newsIndex],
      ...newsData,
      updatedAt: new Date().toISOString(),
      publishedAt:
        newsData.status === &ldquo;PUBLISHED&rdquo; &&
        !mockCompanyNews[newsIndex].publishedAt
          ? new Date().toISOString()
          : mockCompanyNews[newsIndex].publishedAt,
    };

    mockCompanyNews[newsIndex] = updatedNews;

    return NextResponse.json({
      message: &ldquo;Noticia actualizada exitosamente&rdquo;,
      news: updatedNews,
    });
  } catch (error) {
    console.error(&ldquo;Error updating company news:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Error al actualizar noticia&rdquo; },
      { status: 500 }
    );
  }
}

// DELETE /api/company/news - Delete company news
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

    const newsIndex = mockCompanyNews.findIndex((news) => news.id === id);
    if (newsIndex === -1) {
      return NextResponse.json(
        { error: &ldquo;Noticia no encontrada&rdquo; },
        { status: 404 }
      );
    }

    // Remove the news article
    mockCompanyNews.splice(newsIndex, 1);

    return NextResponse.json({
      message: &ldquo;Noticia eliminada exitosamente&rdquo;,
    });
  } catch (error) {
    console.error(&ldquo;Error deleting company news:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Error al eliminar noticia&rdquo; },
      { status: 500 }
    );
  }
}
