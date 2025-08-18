import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// POST /api/cv/generate-for-application - Generar CV para postulación específica
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
    const { jobOfferId } = body;

    if (!jobOfferId) {
      return NextResponse.json(
        { error: "ID de oferta de trabajo requerido" },
        { status: 400 }
      );
    }

    // Obtener perfil del usuario
    const profile = await prisma.profile.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: "Perfil no encontrado" },
        { status: 404 }
      );
    }

    // Obtener información de la oferta de trabajo
    const jobOffer = await prisma.jobOffer.findUnique({
      where: { id: jobOfferId },
      include: {
        company: true,
      },
    });

    if (!jobOffer) {
      return NextResponse.json(
        { error: "Oferta de trabajo no encontrada" },
        { status: 404 }
      );
    }

    // Generar CV personalizado para esta oferta
    const personalizedCV = {
      personalInfo: {
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || profile.user?.email || "",
        phone: profile.phone || "",
        address: profile.address || "",
        municipality: profile.municipality || "",
        department: profile.department || "",
        country: profile.country || "Bolivia",
        birthDate: profile.birthDate,
        gender: profile.gender || "",
      },
      education: {
        level: profile.educationLevel || "",
        institution: profile.currentInstitution || "",
        graduationYear: profile.graduationYear,
        isStudying: profile.isStudying || false,
      },
      skills: profile.skills || [],
      interests: profile.interests || [],
      workExperience: profile.workExperience || [],
      achievements: [],
      certifications: [],
      // Información específica de la oferta
      targetPosition: jobOffer.title,
      targetCompany: jobOffer.company?.name || "",
      relevantSkills: profile.skills?.filter(skill => 
        jobOffer.requiredSkills?.includes(skill) || 
        jobOffer.desiredSkills?.includes(skill)
      ) || [],
    };

    // Generar carta de presentación personalizada
    const personalizedCoverLetter = generatePersonalizedCoverLetter(profile, jobOffer);

    return NextResponse.json({
      cvData: personalizedCV,
      coverLetter: personalizedCoverLetter,
      jobOffer: {
        id: jobOffer.id,
        title: jobOffer.title,
        company: jobOffer.company?.name,
        location: jobOffer.location,
        contractType: jobOffer.contractType,
        workModality: jobOffer.workModality,
      },
    });
  } catch (error) {
    console.error("Error al generar CV para aplicación:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

function generatePersonalizedCoverLetter(profile: any, jobOffer: any) {
  const companyName = jobOffer.company?.name || "su empresa";
  const position = jobOffer.title;
  const location = jobOffer.location;
  
  // Filtrar habilidades relevantes para esta posición
  const relevantSkills = profile.skills?.filter((skill: string) => 
    jobOffer.requiredSkills?.includes(skill) || 
    jobOffer.desiredSkills?.includes(skill)
  ) || [];

  const coverLetter = `Estimado/a equipo de ${companyName},

Me dirijo a ustedes con gran entusiasmo para postularme a la posición de ${position} en ${companyName}, ubicada en ${location}.

Soy ${profile.firstName || ""} ${profile.lastName || ""}, un/a joven profesional con sólidos conocimientos en ${profile.skills?.join(", ") || "diversas áreas técnicas"}. Mi formación académica en ${profile.currentInstitution || "mi institución educativa"} me ha proporcionado una base sólida en ${profile.educationLevel || "mi campo de estudio"}.

${relevantSkills.length > 0 ? `Mis habilidades más relevantes para esta posición incluyen:
${relevantSkills.map((skill: string) => `• ${skill}`).join("\n")}` : "Mis principales fortalezas incluyen mi capacidad de aprendizaje rápido, trabajo en equipo y comunicación efectiva."}

${jobOffer.workModality === "REMOTE" ? "Valoro especialmente la oportunidad de trabajar en un entorno remoto, donde puedo demostrar mi autonomía y capacidad de organización." : ""}
${jobOffer.contractType === "INTERNSHIP" ? "Como estudiante/joven profesional, estoy entusiasmado/a por la oportunidad de aplicar mis conocimientos teóricos en un entorno laboral real y aprender de profesionales experimentados." : ""}

Estoy comprometido/a con el aprendizaje continuo y el desarrollo profesional, y estoy convencido/a de que puedo contribuir significativamente al equipo de ${companyName} con mi entusiasmo, dedicación y habilidades técnicas.

Estoy disponible para una entrevista en el momento que consideren conveniente y agradezco su consideración.

Atentamente,
${profile.firstName || ""} ${profile.lastName || ""}
${profile.email || ""}
${profile.phone || ""}`;

  return coverLetter;
}
