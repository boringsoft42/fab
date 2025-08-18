import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/cv - Obtener CV del usuario actual
export async function GET(request: NextRequest) {
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

    // Estructurar datos del CV
    const cvData = {
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
      achievements: [], // Se puede expandir con una tabla separada
      certifications: [], // Se puede expandir con una tabla separada
    };

    return NextResponse.json(cvData);
  } catch (error) {
    console.error("Error al obtener CV:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// PUT /api/cv - Actualizar datos del CV
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { personalInfo, education, skills, interests, workExperience } = body;

    const updateData: any = {};

    // Actualizar información personal
    if (personalInfo) {
      updateData.firstName = personalInfo.firstName;
      updateData.lastName = personalInfo.lastName;
      updateData.email = personalInfo.email;
      updateData.phone = personalInfo.phone;
      updateData.address = personalInfo.address;
      updateData.municipality = personalInfo.municipality;
      updateData.department = personalInfo.department;
      updateData.country = personalInfo.country;
      updateData.birthDate = personalInfo.birthDate;
      updateData.gender = personalInfo.gender;
    }

    // Actualizar educación
    if (education) {
      updateData.educationLevel = education.level;
      updateData.currentInstitution = education.institution;
      updateData.graduationYear = education.graduationYear;
      updateData.isStudying = education.isStudying;
    }

    // Actualizar habilidades e intereses
    if (skills) updateData.skills = skills;
    if (interests) updateData.interests = interests;
    if (workExperience) updateData.workExperience = workExperience;

    const updatedProfile = await prisma.profile.update({
      where: { userId: session.user.id },
      data: updateData,
    });

    return NextResponse.json({
      message: "CV actualizado exitosamente",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error al actualizar CV:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
