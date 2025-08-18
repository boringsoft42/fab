import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/profile - Obtener perfil del usuario actual
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

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// PUT /api/profile - Actualizar perfil del usuario actual
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
    
    const updatedProfile = await prisma.profile.update({
      where: { userId: session.user.id },
      data: body,
    });

    return NextResponse.json({
      message: "Perfil actualizado exitosamente",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

// POST: Create mock profile data since we're using mock authentication
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { userId, firstName, lastName, avatarUrl } = data;

    // Return mock new profile data for development
    const newProfile = {
      id: "mock-profile-id",
      userId: userId || "mock-user-id",
      firstName: firstName || "John",
      lastName: lastName || "Doe",
      role: "YOUTH",
      avatarUrl: avatarUrl || null,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completionPercentage: 10,
    };

    return NextResponse.json(newProfile, { status: 201 });
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    );
  }
}
