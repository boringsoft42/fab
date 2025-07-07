import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const newsId = req.nextUrl.pathname.split("/")[3];

    // For demo purposes, return mock data
    // In production, this would fetch from your database
    const mockNews = {
      id: newsId,
      title: "Nuevas oportunidades de empleo en el sector tecnológico",
      summary:
        "Importantes empresas tecnológicas abren sus puertas a jóvenes talentos",
      content: `
        <div class="prose max-w-none">
          <p>Las principales empresas tecnológicas de la región han anunciado nuevas oportunidades de empleo específicamente diseñadas para jóvenes profesionales y estudiantes en último año.</p>
          
          <h3>Principales áreas de oportunidad:</h3>
          <ul>
            <li>Desarrollo de software</li>
            <li>Diseño UX/UI</li>
            <li>Marketing digital</li>
            <li>Análisis de datos</li>
          </ul>
          
          <p>Estas posiciones ofrecen:</p>
          <ul>
            <li>Horarios flexibles</li>
            <li>Capacitación continua</li>
            <li>Mentorías personalizadas</li>
            <li>Posibilidad de crecimiento</li>
          </ul>
          
          <h3>Requisitos generales:</h3>
          <ul>
            <li>Ser estudiante o recién graduado</li>
            <li>Interés en tecnología</li>
            <li>Disponibilidad para aprender</li>
          </ul>
          
          <p>Las empresas participantes incluyen importantes nombres del sector tecnológico y startups innovadoras que buscan incorporar talento joven a sus equipos.</p>
          
          <h3>Proceso de aplicación:</h3>
          <ol>
            <li>Registra tu perfil en la plataforma</li>
            <li>Completa tu información profesional</li>
            <li>Aplica a las posiciones de tu interés</li>
            <li>Espera el contacto de los reclutadores</li>
          </ol>
        </div>
      `,
      imageUrl: "/window.svg",
      authorName: "TechCorp",
      authorType: "COMPANY",
      authorLogo: "/logos/techcorp.svg",
      priority: "HIGH",
      category: "Empleos",
      publishedAt: new Date().toISOString(),
      viewCount: 156,
      likeCount: 45,
      commentCount: 12,
      shareCount: 8,
      tags: ["Tecnología", "Empleo Joven", "Desarrollo Profesional"],
      featured: true,
      readTime: 5,
    };

    return NextResponse.json(mockNews);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
