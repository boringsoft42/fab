import { NextResponse } from &ldquo;next/server&rdquo;;
import prisma from &ldquo;@/lib/prisma&rdquo;;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // For demo purposes, return mock data
    // In production, this would fetch from your database
    const mockNews = {
      id: params.id,
      title: &ldquo;Nuevas oportunidades de empleo en el sector tecnológico&rdquo;,
      summary:
        &ldquo;Importantes empresas tecnológicas abren sus puertas a jóvenes talentos&rdquo;,
      content: `
        <div class=&ldquo;prose max-w-none&rdquo;>
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
      imageUrl: &ldquo;/window.svg&rdquo;,
      authorName: &ldquo;TechCorp&rdquo;,
      authorType: &ldquo;COMPANY&rdquo;,
      authorLogo: &ldquo;/logos/techcorp.svg&rdquo;,
      priority: &ldquo;HIGH&rdquo;,
      category: &ldquo;Empleos&rdquo;,
      publishedAt: new Date().toISOString(),
      viewCount: 156,
      likeCount: 45,
      commentCount: 12,
      shareCount: 8,
      tags: [&ldquo;Tecnología&rdquo;, &ldquo;Empleo Joven&rdquo;, &ldquo;Desarrollo Profesional&rdquo;],
      featured: true,
      readTime: 5,
    };

    return NextResponse.json(mockNews);
  } catch (error) {
    console.error(&ldquo;Error fetching news:&rdquo;, error);
    return new NextResponse(&ldquo;Internal Server Error&rdquo;, { status: 500 });
  }
}
