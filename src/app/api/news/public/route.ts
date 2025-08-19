import { NextRequest, NextResponse } from "next/server";
import { NewsArticle } from "@/types/news";

// Mock news data - esto se reemplazará con Prisma
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
];

// GET /api/newsarticle/public - Obtener noticias públicas (para jóvenes)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const category = searchParams.get('category');
    const authorType = searchParams.get('authorType');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search');
    
    // Filtrar solo noticias publicadas
    let filteredNews = mockNews.filter(news => news.status === 'PUBLISHED');
    
    // Aplicar filtros adicionales
    if (category) {
      filteredNews = filteredNews.filter(news => news.category === category);
    }
    
    if (authorType) {
      filteredNews = filteredNews.filter(news => news.authorType === authorType.toUpperCase());
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredNews = filteredNews.filter(news => 
        news.title.toLowerCase().includes(searchLower) ||
        news.summary.toLowerCase().includes(searchLower) ||
        news.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    // Ordenar por prioridad y fecha de publicación
    filteredNews.sort((a, b) => {
      const priorityOrder = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
    
    // Aplicar paginación
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedNews = filteredNews.slice(startIndex, endIndex);
    
    // Calcular estadísticas
    const stats = {
      total: filteredNews.length,
      byType: {
        company: filteredNews.filter(n => n.authorType === 'COMPANY').length,
        government: filteredNews.filter(n => n.authorType === 'GOVERNMENT').length,
        ngo: filteredNews.filter(n => n.authorType === 'NGO').length,
      },
      byPriority: {
        low: filteredNews.filter(n => n.priority === 'LOW').length,
        medium: filteredNews.filter(n => n.priority === 'MEDIUM').length,
        high: filteredNews.filter(n => n.priority === 'HIGH').length,
        urgent: filteredNews.filter(n => n.priority === 'URGENT').length,
      },
      totalViews: filteredNews.reduce((sum, n) => sum + n.viewCount, 0),
      totalLikes: filteredNews.reduce((sum, n) => sum + n.likeCount, 0),
      totalComments: filteredNews.reduce((sum, n) => sum + n.commentCount, 0),
    };
    
    return NextResponse.json({
      news: paginatedNews,
      pagination: {
        total: filteredNews.length,
        page,
        limit,
        totalPages: Math.ceil(filteredNews.length / limit),
      },
      stats,
    });
  } catch (error) {
    console.error('Error getting public news:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
