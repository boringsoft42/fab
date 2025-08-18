import { NextRequest, NextResponse } from "next/server";

// GET /api/files/images/[filename] - Servir imagen de perfil
export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const { filename } = params;

    if (!filename) {
      return NextResponse.json(
        { error: "Nombre de archivo requerido" },
        { status: 400 }
      );
    }

    // En un entorno real, aquí cargarías la imagen desde el almacenamiento
    // Por ahora, retornamos una imagen placeholder o un error
    const placeholderImageUrl = "https://via.placeholder.com/150x150/cccccc/666666?text=Profile+Image";
    
    // Redirigir a la imagen placeholder
    return NextResponse.redirect(placeholderImageUrl);
  } catch (error) {
    console.error("Error al servir imagen:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
