import { NextRequest, NextResponse } from "next/server";
import { NewsArticle } from "@/types/news";

// Mock government/NGO news data
const mockAdminNews: NewsArticle[] = [
  {
    id: "admin-news-1",
    title: "Gobierno Municipal Implementa Nueva Política de Empleo Juvenil",
    content:
      "El Gobierno Municipal de Cochabamba anuncia la implementación de una nueva política integral de empleo juvenil que beneficiará a más de 2,000 jóvenes en los próximos 12 meses.\n\nLa política incluye:\n• Programa de primer empleo con subsidio del 50% del salario mínimo\n• Centros de capacitación laboral en oficios técnicos\n• Bolsa de trabajo municipal con prioridad para jóvenes\n• Programa de emprendimiento juvenil con microcréditos\n• Orientación vocacional y laboral gratuita\n\nLa iniciativa tiene un presupuesto de 15 millones de bolivianos y será ejecutada en coordinación con empresas privadas y organizaciones de la sociedad civil.",
    summary:
      "Nueva política municipal creará 2,000 empleos para jóvenes con subsidios, capacitación y programas de emprendimiento.",
    imageUrl: "/api/placeholder/800/400",
    authorId: "gov-1",
    authorName: "Gobierno Municipal de Cochabamba",
    authorType: "GOVERNMENT",
    authorLogo: "/api/placeholder/60/60",
    status: "PUBLISHED",
    priority: "URGENT",
    featured: true,
    tags: ["empleo", "juventud", "política pública", "capacitación"],
    category: "Política Pública",
    publishedAt: "2024-02-27T14:00:00Z",
    createdAt: "2024-02-26T10:15:00Z",
    updatedAt: "2024-02-27T14:00:00Z",
    viewCount: 2100,
    likeCount: 156,
    commentCount: 45,
    targetAudience: ["YOUTH", "COMPANIES"],
    region: "Cochabamba",
  },
  {
    id: "admin-news-2",
    title: "Ministerio de Educación Anuncia Nueva Plataforma Digital",
    content:
      "El Ministerio de Educación presenta la nueva plataforma digital 'Educa Bolivia' que revolucionará el acceso a la educación técnica y superior en el país. La plataforma ofrecerá más de 200 cursos gratuitos certificados.",
    summary:
      "Nueva plataforma 'Educa Bolivia' ofrecerá 200 cursos técnicos gratuitos con certificación oficial.",
    imageUrl: "/api/placeholder/800/400",
    authorId: "gov-2",
    authorName: "Ministerio de Educación",
    authorType: "GOVERNMENT",
    authorLogo: "/api/placeholder/60/60",
    status: "PUBLISHED",
    priority: "HIGH",
    featured: true,
    tags: ["educación", "tecnología", "cursos gratuitos", "certificación"],
    category: "Educación Digital",
    publishedAt: "2024-02-24T10:00:00Z",
    createdAt: "2024-02-23T14:30:00Z",
    updatedAt: "2024-02-24T10:00:00Z",
    viewCount: 3200,
    likeCount: 245,
    commentCount: 67,
    targetAudience: ["YOUTH", "ALL"],
    region: "Nacional",
  },
  {
    id: "admin-news-3",
    title: "ONG Futuro Verde Lanza Programa de Educación Ambiental",
    content:
      "La ONG Futuro Verde presenta su nuevo programa de educación ambiental dirigido a jóvenes de 15 a 25 años. El programa tiene como objetivo formar líderes ambientales que promuevan el desarrollo sostenible en sus comunidades.",
    summary:
      "ONG Futuro Verde ofrece programa gratuito de educación ambiental para formar líderes jóvenes en sostenibilidad.",
    imageUrl: "/api/placeholder/800/400",
    authorId: "ngo-1",
    authorName: "ONG Futuro Verde",
    authorType: "NGO",
    authorLogo: "/api/placeholder/60/60",
    status: "DRAFT",
    priority: "MEDIUM",
    featured: false,
    tags: ["medio ambiente", "educación", "sostenibilidad", "liderazgo"],
    category: "Programas Sociales",
    publishedAt: "",
    createdAt: "2024-02-24T09:20:00Z",
    updatedAt: "2024-02-25T12:00:00Z",
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    targetAudience: ["YOUTH"],
    region: "La Paz",
  },
];

// GET /api/admin/news - Fetch admin news
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId");
    const type = searchParams.get("type"); // "GOVERNMENT" or "NGO"
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");

    let filtered = mockAdminNews;

    // Filter by organization if specified
    if (organizationId) {
      filtered = filtered.filter((news) => news.authorId === organizationId);
    }

    // Filter by type if specified
    if (type && type !== "all") {
      filtered = filtered.filter(
        (news) => news.authorType === type.toUpperCase()
      );
    }

    // Filter by status if specified
    if (status && status !== "all") {
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
      published: mockAdminNews.filter((n) => n.status === "PUBLISHED").length,
      draft: mockAdminNews.filter((n) => n.status === "DRAFT").length,
      archived: mockAdminNews.filter((n) => n.status === "ARCHIVED").length,
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
    console.error("Error fetching admin news:", error);
    return NextResponse.json(
      { error: "Error al obtener noticias administrativas" },
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
      "title",
      "content",
      "summary",
      "organizationId",
      "organizationName",
      "organizationType",
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
      authorType: newsData.organizationType, // "GOVERNMENT" or "NGO"
      authorLogo: newsData.organizationLogo,
      status: newsData.status || "DRAFT",
      priority: newsData.priority || "MEDIUM",
      featured: newsData.featured || false,
      tags: newsData.tags || [],
      category: newsData.category || "General",
      publishedAt:
        newsData.status === "PUBLISHED" ? new Date().toISOString() : "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      targetAudience: newsData.targetAudience || ["YOUTH"],
      region: newsData.region,
      relatedLinks: newsData.relatedLinks || [],
      expiresAt: newsData.expiresAt,
    };

    // In real app, this would save to database using Prisma
    mockAdminNews.unshift(newNews);

    return NextResponse.json(
      {
        message: "Noticia creada exitosamente",
        news: newNews,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating admin news:", error);
    return NextResponse.json(
      { error: "Error al crear noticia" },
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
        { error: "ID de noticia es requerido" },
        { status: 400 }
      );
    }

    const newsIndex = mockAdminNews.findIndex((news) => news.id === id);
    if (newsIndex === -1) {
      return NextResponse.json(
        { error: "Noticia no encontrada" },
        { status: 404 }
      );
    }

    // Update the news article
    const updatedNews = {
      ...mockAdminNews[newsIndex],
      ...newsData,
      updatedAt: new Date().toISOString(),
      publishedAt:
        newsData.status === "PUBLISHED" && !mockAdminNews[newsIndex].publishedAt
          ? new Date().toISOString()
          : mockAdminNews[newsIndex].publishedAt,
    };

    mockAdminNews[newsIndex] = updatedNews;

    return NextResponse.json({
      message: "Noticia actualizada exitosamente",
      news: updatedNews,
    });
  } catch (error) {
    console.error("Error updating admin news:", error);
    return NextResponse.json(
      { error: "Error al actualizar noticia" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/news - Delete admin news
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "ID de noticia es requerido" },
        { status: 400 }
      );
    }

    const newsIndex = mockAdminNews.findIndex((news) => news.id === id);
    if (newsIndex === -1) {
      return NextResponse.json(
        { error: "Noticia no encontrada" },
        { status: 404 }
      );
    }

    // Remove the news article
    mockAdminNews.splice(newsIndex, 1);

    return NextResponse.json({
      message: "Noticia eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error deleting admin news:", error);
    return NextResponse.json(
      { error: "Error al eliminar noticia" },
      { status: 500 }
    );
  }
}
