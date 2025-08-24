import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
// import { prisma } from "@/lib/prisma";

// POST /api/files/upload/profile-image - Subir imagen de perfil
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('avatar') as File;

    if (!file) {
      return NextResponse.json(
        { error: "No se proporcionó archivo" },
        { status: 400 }
      );
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: "El archivo debe ser una imagen" },
        { status: 400 }
      );
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "El archivo es demasiado grande. Máximo 5MB" },
        { status: 400 }
      );
    }

    // Generar nombre único para el archivo
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `profile-${session.user.id}-${timestamp}.${extension}`;

    // En un entorno real, aquí guardarías el archivo en el servidor o en un servicio de almacenamiento
    // Por ahora, simulamos la URL del archivo
    const avatarUrl = `/api/files/images/${filename}`;

    // Actualizar el perfil con la nueva URL de avatar
    const updatedProfile = await prisma.profile.update({
      where: { userId: session.user.id },
      data: { avatarUrl },
    });

    return NextResponse.json({
      message: "Imagen de perfil subida exitosamente",
      avatarUrl,
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error al subir imagen de perfil:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
