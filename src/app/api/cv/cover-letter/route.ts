import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";

// GET /api/cv/cover-letter - Obtener carta de presentación del usuario
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Perfil no encontrado" },
        { status: 404 }
      );
    }

    // Por ahora retornamos una carta de presentación básica
    // En el futuro se puede almacenar en la base de datos
    const coverLetter = {
      template: "default",
      content: `Estimado/a ${profile.firstName || "Reclutador"},

Me dirijo a usted con gran interés para postularme a la posición disponible en su empresa. Soy ${profile.firstName || ""} ${profile.lastName || ""}, un/a joven profesional con sólidos conocimientos en ${profile.skills?.join(", ") || "diversas áreas"}.

Mi formación académica en ${profile.currentInstitution || "mi institución educativa"} me ha proporcionado una base sólida en ${profile.educationLevel || "mi campo de estudio"}, y estoy comprometido/a con el aprendizaje continuo y el desarrollo profesional.

Mis principales fortalezas incluyen:
${profile.skills?.map(skill => `• ${skill}`).join("\n") || "• Capacidad de aprendizaje rápido\n• Trabajo en equipo\n• Comunicación efectiva"}

Estoy entusiasmado/a por la oportunidad de contribuir con mis habilidades y conocimientos a su organización, y estoy disponible para una entrevista en el momento que considere conveniente.

Agradezco su consideración y quedo atento/a a su respuesta.

Atentamente,
${profile.firstName || ""} ${profile.lastName || ""}`,
      recipient: {
        department: "Departamento de Recursos Humanos",
        company: "Nombre de la Empresa",
        address: "Dirección de la Empresa",
        city: "Ciudad, País",
      },
      subject: `Postulación para el puesto de Desarrollador Frontend`,
    };

    return NextResponse.json(coverLetter);
  } catch (error) {
    console.error("Error al obtener carta de presentación:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST /api/cv/cover-letter - Guardar carta de presentación
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { content, template = "default", recipient, subject } = body;

    // Por ahora solo validamos y retornamos éxito
    // En el futuro se puede almacenar en la base de datos
    if (!content || content.trim().length < 100) {
      return NextResponse.json(
        { error: "La carta de presentación debe tener al menos 100 caracteres" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      message: "Carta de presentación guardada exitosamente",
      coverLetter: { content, template, recipient, subject },
    });
  } catch (error) {
    console.error("Error al guardar carta de presentación:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
