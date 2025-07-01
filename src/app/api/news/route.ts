import { NextRequest, NextResponse } from "next/server";
import { NewsArticle, NewsType, NewsStatus, NewsPriority } from "@/types/news";

// Mock news data
const mockNews: NewsArticle[] = [
  {
    id: "news-1",
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
      {
        title: "Requisitos Detallados",
        url: "https://techcorp.bo/becas-requisitos",
      },
    ],
  },
  {
    id: "news-2",
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
    id: "news-3",
    title: "Innovate Labs Busca 20 Desarrolladores Junior",
    content:
      "Innovate Labs, startup líder en desarrollo de aplicaciones móviles, anuncia la apertura de 20 posiciones para desarrolladores junior. La empresa ofrece un ambiente de trabajo dinámico y oportunidades de crecimiento profesional acelerado.\n\nBeneficios ofrecidos:\n• Salario competitivo desde 4,500 BOB\n• Horarios flexibles y trabajo híbrido\n• Capacitación continua en nuevas tecnologías\n• Seguro médico privado\n• Ambiente de startup con proyectos desafiantes\n\nLa empresa busca recién graduados o personas con máximo 2 años de experiencia en React, React Native o Flutter.",
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
    id: "news-4",
    title: "ONG Futuro Verde Lanza Programa de Educación Ambiental",
    content:
      "La ONG Futuro Verde presenta su nuevo programa de educación ambiental dirigido a jóvenes de 15 a 25 años. El programa tiene como objetivo formar líderes ambientales que promuevan el desarrollo sostenible en sus comunidades.\n\nEl programa incluye:\n• 40 horas de capacitación en sostenibilidad\n• Proyectos prácticos de conservación\n• Certificación internacional en gestión ambiental\n• Red de contactos con organizaciones ambientales\n• Oportunidades de voluntariado remunerado\n\nLas inscripciones están abiertas hasta el 15 de marzo. El programa es completamente gratuito y se desarrollará los fines de semana durante 3 meses.",
    summary:
      "ONG Futuro Verde ofrece programa gratuito de educación ambiental para formar líderes jóvenes en sostenibilidad.",
    imageUrl: "/api/placeholder/800/400",
    authorId: "ngo-1",
    authorName: "ONG Futuro Verde",
    authorType: "NGO",
    authorLogo: "/api/placeholder/60/60",
    status: "PUBLISHED",
    priority: "MEDIUM",
    featured: true,
    tags: ["medio ambiente", "educación", "sostenibilidad", "liderazgo"],
    category: "Programas Sociales",
    publishedAt: "2024-02-25T12:00:00Z",
    createdAt: "2024-02-24T09:20:00Z",
    updatedAt: "2024-02-25T12:00:00Z",
    viewCount: 760,
    likeCount: 94,
    commentCount: 18,
    targetAudience: ["YOUTH"],
    region: "La Paz",
  },
  {
    id: "news-5",
    title: "Ministerio de Educación Anuncia Nueva Plataforma Digital",
    content:
      "El Ministerio de Educación presenta la nueva plataforma digital 'Educa Bolivia' que revolucionará el acceso a la educación técnica y superior en el país. La plataforma ofrecerá más de 200 cursos gratuitos certificados.\n\nCaracterísticas principales:\n• Cursos en línea completamente gratuitos\n• Certificaciones reconocidas oficialmente\n• Modalidad asíncrona para estudiar a tu ritmo\n• Tutores especializados disponibles\n• Contenido actualizado con estándares internacionales\n\nLa plataforma estará disponible a partir del 1 de abril y beneficiará a más de 100,000 estudiantes en todo el territorio nacional.",
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
    id: "news-6",
    title: "FutureWorks Implementa Programa de Diversidad e Inclusión",
    content:
      "FutureWorks, empresa consultora líder en transformación digital, anuncia la implementación de su programa de diversidad e inclusión con enfoque especial en la contratación de jóvenes talentos de comunidades rurales.\n\nIniciativas del programa:\n• Becas de capacitación para jóvenes rurales\n• Mentoring con profesionales experimentados\n• Programa de pasantías remuneradas\n• Flexibilidad laboral para estudiantes\n• Capacitación en habilidades digitales\n\nLa empresa se compromete a que el 30% de sus nuevas contrataciones sean jóvenes de áreas rurales, proporcionando oportunidades equitativas de desarrollo profesional.",
    summary:
      "FutureWorks lanza programa de inclusión con becas y empleos especiales para jóvenes de comunidades rurales.",
    imageUrl: "/api/placeholder/800/400",
    authorId: "company-3",
    authorName: "FutureWorks",
    authorType: "COMPANY",
    authorLogo: "/logos/futureworks.svg",
    status: "PUBLISHED",
    priority: "MEDIUM",
    featured: false,
    tags: ["diversidad", "inclusión", "empleo rural", "oportunidades"],
    category: "Responsabilidad Social",
    publishedAt: "2024-02-23T13:15:00Z",
    createdAt: "2024-02-22T16:00:00Z",
    updatedAt: "2024-02-23T13:15:00Z",
    viewCount: 650,
    likeCount: 78,
    commentCount: 15,
    targetAudience: ["YOUTH"],
    region: "Cochabamba",
  },
];

// GET /api/news - Fetch news articles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const featured = searchParams.get("featured");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");
    const category = searchParams.get("category");
    const targetAudience = searchParams.get("targetAudience");
    const region = searchParams.get("region");
    const search = searchParams.get("search");

    let filtered = mockNews.filter((news) => news.status === "PUBLISHED");

    // Apply filters
    if (type && type !== "all") {
      filtered = filtered.filter(
        (news) => news.authorType === type.toUpperCase()
      );
    }

    if (featured === "true") {
      filtered = filtered.filter((news) => news.featured);
    }

    if (category && category !== "all") {
      filtered = filtered.filter((news) => news.category === category);
    }

    if (targetAudience && targetAudience !== "all") {
      filtered = filtered.filter(
        (news) =>
          news.targetAudience.includes(targetAudience.toUpperCase()) ||
          news.targetAudience.includes("ALL")
      );
    }

    if (region && region !== "all") {
      filtered = filtered.filter(
        (news) => news.region === region || news.region === "Nacional"
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (news) =>
          news.title.toLowerCase().includes(searchLower) ||
          news.summary.toLowerCase().includes(searchLower) ||
          news.tags.some((tag) => tag.toLowerCase().includes(searchLower))
      );
    }

    // Sort by priority and date
    filtered.sort((a, b) => {
      const priorityOrder = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      const priorityDiff =
        priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;

      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    });

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedNews = filtered.slice(startIndex, endIndex);

    // Calculate stats
    const stats = {
      total: filtered.length,
      published: mockNews.filter((n) => n.status === "PUBLISHED").length,
      draft: mockNews.filter((n) => n.status === "DRAFT").length,
      byType: {
        company: mockNews.filter((n) => n.authorType === "COMPANY").length,
        government: mockNews.filter((n) => n.authorType === "GOVERNMENT")
          .length,
        ngo: mockNews.filter((n) => n.authorType === "NGO").length,
      },
      byPriority: {
        low: mockNews.filter((n) => n.priority === "LOW").length,
        medium: mockNews.filter((n) => n.priority === "MEDIUM").length,
        high: mockNews.filter((n) => n.priority === "HIGH").length,
        urgent: mockNews.filter((n) => n.priority === "URGENT").length,
      },
      totalViews: mockNews.reduce((sum, n) => sum + n.viewCount, 0),
      totalLikes: mockNews.reduce((sum, n) => sum + n.likeCount, 0),
      totalComments: mockNews.reduce((sum, n) => sum + n.commentCount, 0),
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
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Error al obtener noticias" },
      { status: 500 }
    );
  }
}

// POST /api/news - Create new news article
export async function POST(request: NextRequest) {
  try {
    const newsData = await request.json();

    // Validate required fields
    const requiredFields = [
      "title",
      "content",
      "summary",
      "authorId",
      "authorName",
      "authorType",
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
      id: `news-${Date.now()}`,
      ...newsData,
      status: newsData.status || "DRAFT",
      priority: newsData.priority || "MEDIUM",
      featured: newsData.featured || false,
      tags: newsData.tags || [],
      publishedAt:
        newsData.status === "PUBLISHED" ? new Date().toISOString() : "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      targetAudience: newsData.targetAudience || ["ALL"],
    };

    // In real app, this would save to database using Prisma
    mockNews.unshift(newNews);

    return NextResponse.json(
      {
        message: "Noticia creada exitosamente",
        news: newNews,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating news:", error);
    return NextResponse.json(
      { error: "Error al crear noticia" },
      { status: 500 }
    );
  }
}
