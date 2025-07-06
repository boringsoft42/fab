import { NextRequest, NextResponse } from "next/server";
import { NewsArticle } from "@/types/news";

// Mock company news data
const mockCompanyNews: NewsArticle[] = [
  {
    id: "company-news-1",
    title: "TechCorp Bolivia Lanza Programa de Becas 2024",
    content:
      "TechCorp Bolivia anuncia su programa anual de becas dirigido a jóvenes talentos en tecnología. El programa incluye 50 becas completas para estudios superiores en ingeniería de sistemas, desarrollo de software y ciencia de datos.\n\nLos beneficiarios recibirán:\n• Beca completa para estudios universitarios\n• Mentoring personalizado con profesionales de la empresa\n• Oportunidad de prácticas profesionales\n• Acceso a cursos especializados en tecnologías emergentes\n\nLas postulaciones están abiertas hasta el 31 de marzo. Los requisitos incluyen promedio mínimo de 80 puntos en bachillerato y demostrar pasión por la tecnología.",
    summary:
      "TechCorp Bolivia ofrece 50 becas completas para jóvenes interesados en carreras tecnológicas, incluyendo mentoring y oportunidades de prácticas.",
    imageUrl: "/api/placeholder/800/400",
    authorId: "company-1",
    authorName: "TechCorp Bolivia",
    authorType: "COMPANY",
    authorLogo: "/logos/techcorp.svg",
    status: "PUBLISHED",
    priority: "HIGH",
    featured: true,
    tags: ["educación", "becas", "tecnología", "oportunidades"],
    category: "Educación y Becas",
    publishedAt: "2024-02-28T09:00:00Z",
    createdAt: "2024-02-27T15:30:00Z",
    updatedAt: "2024-02-28T09:00:00Z",
    viewCount: 1250,
    likeCount: 89,
    commentCount: 23,
    targetAudience: ["YOUTH"],
    region: "Cochabamba",
    relatedLinks: [
      {
        title: "Formulario de Postulación",
        url: "https://techcorp.bo/becas2024",
      },
    ],
  },
  {
    id: "company-news-2",
    title: "Innovate Labs Busca 20 Desarrolladores Junior",
    content:
      "Innovate Labs, startup líder en desarrollo de aplicaciones móviles, anuncia la apertura de 20 posiciones para desarrolladores junior. La empresa ofrece un ambiente de trabajo dinámico y oportunidades de crecimiento profesional acelerado.",
    summary:
      "Innovate Labs ofrece 20 empleos para desarrolladores junior con salarios competitivos y ambiente de startup.",
    imageUrl: "/api/placeholder/800/400",
    authorId: "company-2",
    authorName: "Innovate Labs",
    authorType: "COMPANY",
    authorLogo: "/logos/innovatelabs.svg",
    status: "PUBLISHED",
    priority: "MEDIUM",
    featured: false,
    tags: ["empleo", "desarrollo", "tecnología", "startup"],
    category: "Ofertas de Empleo",
    publishedAt: "2024-02-26T16:30:00Z",
    createdAt: "2024-02-25T11:45:00Z",
    updatedAt: "2024-02-26T16:30:00Z",
    viewCount: 890,
    likeCount: 67,
    commentCount: 12,
    targetAudience: ["YOUTH"],
    region: "Santa Cruz",
  },
  {
    id: "company-news-3",
    title: "FutureWorks Implementa Programa de Diversidad e Inclusión",
    content:
      "FutureWorks anuncia la implementación de su programa de diversidad e inclusión con enfoque especial en la contratación de jóvenes talentos de comunidades rurales.",
    summary:
      "FutureWorks lanza programa de inclusión con becas y empleos especiales para jóvenes de comunidades rurales.",
    imageUrl: "/api/placeholder/800/400",
    authorId: "company-3",
    authorName: "FutureWorks",
    authorType: "COMPANY",
    authorLogo: "/logos/futureworks.svg",
    status: "DRAFT",
    priority: "MEDIUM",
    featured: false,
    tags: ["diversidad", "inclusión", "empleo rural", "oportunidades"],
    category: "Responsabilidad Social",
    publishedAt: "",
    createdAt: "2024-02-22T16:00:00Z",
    updatedAt: "2024-02-23T13:15:00Z",
    viewCount: 0,
    likeCount: 0,
    commentCount: 0,
    targetAudience: ["YOUTH"],
    region: "Cochabamba",
  },
];

// GET /api/company/news - Fetch company news
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");

    let filtered = mockCompanyNews;

    // Filter by company if specified
    if (companyId) {
      filtered = filtered.filter((news) => news.authorId === companyId);
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
      published: mockCompanyNews.filter((n) => n.status === "PUBLISHED").length,
      draft: mockCompanyNews.filter((n) => n.status === "DRAFT").length,
      archived: mockCompanyNews.filter((n) => n.status === "ARCHIVED").length,
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
    console.error("Error fetching company news:", error);
    return NextResponse.json(
      { error: "Error al obtener noticias de la empresa" },
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
      "title",
      "content",
      "summary",
      "companyId",
      "companyName",
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
      authorType: "COMPANY",
      authorLogo: newsData.companyLogo,
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
    };

    // In real app, this would save to database using Prisma
    mockCompanyNews.unshift(newNews);

    return NextResponse.json(
      {
        message: "Noticia creada exitosamente",
        news: newNews,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating company news:", error);
    return NextResponse.json(
      { error: "Error al crear noticia" },
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
        { error: "ID de noticia es requerido" },
        { status: 400 }
      );
    }

    const newsIndex = mockCompanyNews.findIndex((news) => news.id === id);
    if (newsIndex === -1) {
      return NextResponse.json(
        { error: "Noticia no encontrada" },
        { status: 404 }
      );
    }

    // Update the news article
    const updatedNews = {
      ...mockCompanyNews[newsIndex],
      ...newsData,
      updatedAt: new Date().toISOString(),
      publishedAt:
        newsData.status === "PUBLISHED" &&
        !mockCompanyNews[newsIndex].publishedAt
          ? new Date().toISOString()
          : mockCompanyNews[newsIndex].publishedAt,
    };

    mockCompanyNews[newsIndex] = updatedNews;

    return NextResponse.json({
      message: "Noticia actualizada exitosamente",
      news: updatedNews,
    });
  } catch (error) {
    console.error("Error updating company news:", error);
    return NextResponse.json(
      { error: "Error al actualizar noticia" },
      { status: 500 }
    );
  }
}

// DELETE /api/company/news - Delete company news
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

    const newsIndex = mockCompanyNews.findIndex((news) => news.id === id);
    if (newsIndex === -1) {
      return NextResponse.json(
        { error: "Noticia no encontrada" },
        { status: 404 }
      );
    }

    // Remove the news article
    mockCompanyNews.splice(newsIndex, 1);

    return NextResponse.json({
      message: "Noticia eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error deleting company news:", error);
    return NextResponse.json(
      { error: "Error al eliminar noticia" },
      { status: 500 }
    );
  }
}
