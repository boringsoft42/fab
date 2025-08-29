import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";

// DELETE /api/profile/avatar - Eliminar imagen de perfil
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    // Actualizar el perfil removiendo la URL del avatar
    const updatedProfile = await prisma.profile.update({
      where: { userId: session.user.id },
      data: { avatarUrl: null },
    });

    return NextResponse.json({
      message: "Imagen de perfil eliminada exitosamente",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error al eliminar imagen de perfil:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
