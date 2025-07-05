import { NextRequest, NextResponse } from &ldquo;next/server&rdquo;;
import { NewsArticle, NewsType, NewsStatus, NewsPriority } from &ldquo;@/types/news&rdquo;;

// Mock news data
const mockNews: NewsArticle[] = [
  {
    id: &ldquo;news-1&rdquo;,
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
      {
        title: &ldquo;Requisitos Detallados&rdquo;,
        url: &ldquo;https://techcorp.bo/becas-requisitos&rdquo;,
      },
    ],
  },
  {
    id: &ldquo;news-2&rdquo;,
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
    id: &ldquo;news-3&rdquo;,
    title: &ldquo;Innovate Labs Busca 20 Desarrolladores Junior&rdquo;,
    content:
      &ldquo;Innovate Labs, startup líder en desarrollo de aplicaciones móviles, anuncia la apertura de 20 posiciones para desarrolladores junior. La empresa ofrece un ambiente de trabajo dinámico y oportunidades de crecimiento profesional acelerado.\n\nBeneficios ofrecidos:\n• Salario competitivo desde 4,500 BOB\n• Horarios flexibles y trabajo híbrido\n• Capacitación continua en nuevas tecnologías\n• Seguro médico privado\n• Ambiente de startup con proyectos desafiantes\n\nLa empresa busca recién graduados o personas con máximo 2 años de experiencia en React, React Native o Flutter.&rdquo;,
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
    id: &ldquo;news-4&rdquo;,
    title: &ldquo;ONG Futuro Verde Lanza Programa de Educación Ambiental&rdquo;,
    content:
      &ldquo;La ONG Futuro Verde presenta su nuevo programa de educación ambiental dirigido a jóvenes de 15 a 25 años. El programa tiene como objetivo formar líderes ambientales que promuevan el desarrollo sostenible en sus comunidades.\n\nEl programa incluye:\n• 40 horas de capacitación en sostenibilidad\n• Proyectos prácticos de conservación\n• Certificación internacional en gestión ambiental\n• Red de contactos con organizaciones ambientales\n• Oportunidades de voluntariado remunerado\n\nLas inscripciones están abiertas hasta el 15 de marzo. El programa es completamente gratuito y se desarrollará los fines de semana durante 3 meses.&rdquo;,
    summary:
      &ldquo;ONG Futuro Verde ofrece programa gratuito de educación ambiental para formar líderes jóvenes en sostenibilidad.&rdquo;,
    imageUrl: &ldquo;/api/placeholder/800/400&rdquo;,
    authorId: &ldquo;ngo-1&rdquo;,
    authorName: &ldquo;ONG Futuro Verde&rdquo;,
    authorType: &ldquo;NGO&rdquo;,
    authorLogo: &ldquo;/api/placeholder/60/60&rdquo;,
    status: &ldquo;PUBLISHED&rdquo;,
    priority: &ldquo;MEDIUM&rdquo;,
    featured: true,
    tags: [&ldquo;medio ambiente&rdquo;, &ldquo;educación&rdquo;, &ldquo;sostenibilidad&rdquo;, &ldquo;liderazgo&rdquo;],
    category: &ldquo;Programas Sociales&rdquo;,
    publishedAt: &ldquo;2024-02-25T12:00:00Z&rdquo;,
    createdAt: &ldquo;2024-02-24T09:20:00Z&rdquo;,
    updatedAt: &ldquo;2024-02-25T12:00:00Z&rdquo;,
    viewCount: 760,
    likeCount: 94,
    commentCount: 18,
    targetAudience: [&ldquo;YOUTH&rdquo;],
    region: &ldquo;La Paz&rdquo;,
  },
  {
    id: &ldquo;news-5&rdquo;,
    title: &ldquo;Ministerio de Educación Anuncia Nueva Plataforma Digital&rdquo;,
    content:
      &ldquo;El Ministerio de Educación presenta la nueva plataforma digital 'Educa Bolivia' que revolucionará el acceso a la educación técnica y superior en el país. La plataforma ofrecerá más de 200 cursos gratuitos certificados.\n\nCaracterísticas principales:\n• Cursos en línea completamente gratuitos\n• Certificaciones reconocidas oficialmente\n• Modalidad asíncrona para estudiar a tu ritmo\n• Tutores especializados disponibles\n• Contenido actualizado con estándares internacionales\n\nLa plataforma estará disponible a partir del 1 de abril y beneficiará a más de 100,000 estudiantes en todo el territorio nacional.&rdquo;,
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
    id: &ldquo;news-6&rdquo;,
    title: &ldquo;FutureWorks Implementa Programa de Diversidad e Inclusión&rdquo;,
    content:
      &ldquo;FutureWorks, empresa consultora líder en transformación digital, anuncia la implementación de su programa de diversidad e inclusión con enfoque especial en la contratación de jóvenes talentos de comunidades rurales.\n\nIniciativas del programa:\n• Becas de capacitación para jóvenes rurales\n• Mentoring con profesionales experimentados\n• Programa de pasantías remuneradas\n• Flexibilidad laboral para estudiantes\n• Capacitación en habilidades digitales\n\nLa empresa se compromete a que el 30% de sus nuevas contrataciones sean jóvenes de áreas rurales, proporcionando oportunidades equitativas de desarrollo profesional.&rdquo;,
    summary:
      &ldquo;FutureWorks lanza programa de inclusión con becas y empleos especiales para jóvenes de comunidades rurales.&rdquo;,
    imageUrl: &ldquo;/api/placeholder/800/400&rdquo;,
    authorId: &ldquo;company-3&rdquo;,
    authorName: &ldquo;FutureWorks&rdquo;,
    authorType: &ldquo;COMPANY&rdquo;,
    authorLogo: &ldquo;/logos/futureworks.svg&rdquo;,
    status: &ldquo;PUBLISHED&rdquo;,
    priority: &ldquo;MEDIUM&rdquo;,
    featured: false,
    tags: [&ldquo;diversidad&rdquo;, &ldquo;inclusión&rdquo;, &ldquo;empleo rural&rdquo;, &ldquo;oportunidades&rdquo;],
    category: &ldquo;Responsabilidad Social&rdquo;,
    publishedAt: &ldquo;2024-02-23T13:15:00Z&rdquo;,
    createdAt: &ldquo;2024-02-22T16:00:00Z&rdquo;,
    updatedAt: &ldquo;2024-02-23T13:15:00Z&rdquo;,
    viewCount: 650,
    likeCount: 78,
    commentCount: 15,
    targetAudience: [&ldquo;YOUTH&rdquo;],
    region: &ldquo;Cochabamba&rdquo;,
  },
];

// GET /api/news - Fetch news articles
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get(&ldquo;type&rdquo;);
    const featured = searchParams.get(&ldquo;featured&rdquo;);
    const limit = parseInt(searchParams.get(&ldquo;limit&rdquo;) || &ldquo;10&rdquo;);
    const page = parseInt(searchParams.get(&ldquo;page&rdquo;) || &ldquo;1&rdquo;);
    const category = searchParams.get(&ldquo;category&rdquo;);
    const targetAudience = searchParams.get(&ldquo;targetAudience&rdquo;);
    const region = searchParams.get(&ldquo;region&rdquo;);
    const search = searchParams.get(&ldquo;search&rdquo;);

    let filtered = mockNews.filter((news) => news.status === &ldquo;PUBLISHED&rdquo;);

    // Apply filters
    if (type && type !== &ldquo;all&rdquo;) {
      filtered = filtered.filter(
        (news) => news.authorType === type.toUpperCase()
      );
    }

    if (featured === &ldquo;true&rdquo;) {
      filtered = filtered.filter((news) => news.featured);
    }

    if (category && category !== &ldquo;all&rdquo;) {
      filtered = filtered.filter((news) => news.category === category);
    }

    if (targetAudience && targetAudience !== &ldquo;all&rdquo;) {
      filtered = filtered.filter(
        (news) =>
          news.targetAudience.includes(targetAudience.toUpperCase()) ||
          news.targetAudience.includes(&ldquo;ALL&rdquo;)
      );
    }

    if (region && region !== &ldquo;all&rdquo;) {
      filtered = filtered.filter(
        (news) => news.region === region || news.region === &ldquo;Nacional&rdquo;
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
      published: mockNews.filter((n) => n.status === &ldquo;PUBLISHED&rdquo;).length,
      draft: mockNews.filter((n) => n.status === &ldquo;DRAFT&rdquo;).length,
      byType: {
        company: mockNews.filter((n) => n.authorType === &ldquo;COMPANY&rdquo;).length,
        government: mockNews.filter((n) => n.authorType === &ldquo;GOVERNMENT&rdquo;)
          .length,
        ngo: mockNews.filter((n) => n.authorType === &ldquo;NGO&rdquo;).length,
      },
      byPriority: {
        low: mockNews.filter((n) => n.priority === &ldquo;LOW&rdquo;).length,
        medium: mockNews.filter((n) => n.priority === &ldquo;MEDIUM&rdquo;).length,
        high: mockNews.filter((n) => n.priority === &ldquo;HIGH&rdquo;).length,
        urgent: mockNews.filter((n) => n.priority === &ldquo;URGENT&rdquo;).length,
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
    console.error(&ldquo;Error fetching news:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Error al obtener noticias&rdquo; },
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
      &ldquo;title&rdquo;,
      &ldquo;content&rdquo;,
      &ldquo;summary&rdquo;,
      &ldquo;authorId&rdquo;,
      &ldquo;authorName&rdquo;,
      &ldquo;authorType&rdquo;,
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
      status: newsData.status || &ldquo;DRAFT&rdquo;,
      priority: newsData.priority || &ldquo;MEDIUM&rdquo;,
      featured: newsData.featured || false,
      tags: newsData.tags || [],
      publishedAt:
        newsData.status === &ldquo;PUBLISHED&rdquo; ? new Date().toISOString() : &ldquo;&rdquo;,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      targetAudience: newsData.targetAudience || [&ldquo;ALL&rdquo;],
    };

    // In real app, this would save to database using Prisma
    mockNews.unshift(newNews);

    return NextResponse.json(
      {
        message: &ldquo;Noticia creada exitosamente&rdquo;,
        news: newNews,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(&ldquo;Error creating news:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Error al crear noticia&rdquo; },
      { status: 500 }
    );
  }
}
