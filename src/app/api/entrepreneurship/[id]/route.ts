import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { decodeToken } from "@/lib/api";

// GET /api/entrepreneurship/[id] - Get specific entrepreneurship
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔍 GET /api/entrepreneurship/[id] - Request started");
    const { id } = await params;
    console.log("🔍 GET /api/entrepreneurship/[id] - ID:", id);

    const entrepreneurship = await prisma.entrepreneurship.findUnique({
      where: { id },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    if (!entrepreneurship) {
      console.log("🔍 GET /api/entrepreneurship/[id] - Entrepreneurship not found");
      return NextResponse.json({ error: "Emprendimiento no encontrado" }, { status: 404 });
    }

    // Increment view count
    await prisma.entrepreneurship.update({
      where: { id },
      data: { viewsCount: { increment: 1 } },
    });

    console.log("🔍 GET /api/entrepreneurship/[id] - Entrepreneurship found:", entrepreneurship.id);
    return NextResponse.json(entrepreneurship);
  } catch (error) {
    console.error("🔍 GET /api/entrepreneurship/[id] - Error:", error);
    return NextResponse.json({ error: "Error al obtener emprendimiento" }, { status: 500 });
  }
}

// PUT /api/entrepreneurship/[id] - Update entrepreneurship
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔍 PUT /api/entrepreneurship/[id] - Request started");
    const { id } = await params;
    console.log("🔍 PUT /api/entrepreneurship/[id] - ID:", id);

    // Get the Authorization header
    const authHeader = request.headers.get('authorization');
    console.log("🔍 PUT /api/entrepreneurship/[id] - Auth header:", authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("🔍 PUT /api/entrepreneurship/[id] - No valid auth header, returning 401");
      return NextResponse.json(
        { error: "No autorizado. Token de autenticación requerido." },
        { status: 401 }
      );
    }

    // Extract and decode the JWT token
    const token = authHeader.substring(7);
    const decodedToken = decodeToken(token);
    console.log("🔍 PUT /api/entrepreneurship/[id] - Decoded token:", decodedToken);
    
    if (!decodedToken || !decodedToken.id) {
      console.log("🔍 PUT /api/entrepreneurship/[id] - Invalid token, returning 401");
      return NextResponse.json(
        { error: "Token inválido o expirado." },
        { status: 401 }
      );
    }

    const data = await request.json();
    console.log("🔍 PUT /api/entrepreneurship/[id] - Request data:", data);

    const existingEntrepreneurship = await prisma.entrepreneurship.findUnique({
      where: { id },
    });

    if (!existingEntrepreneurship) {
      console.log("🔍 PUT /api/entrepreneurship/[id] - Entrepreneurship not found");
      return NextResponse.json({ error: "Emprendimiento no encontrado" }, { status: 404 });
    }

    if (existingEntrepreneurship.ownerId !== decodedToken.id) {
      console.log("🔍 PUT /api/entrepreneurship/[id] - Unauthorized access");
      return NextResponse.json(
        { error: "No autorizado. Solo puedes editar tu propio emprendimiento." },
        { status: 403 }
      );
    }

    const updatedEntrepreneurship = await prisma.entrepreneurship.update({
      where: { id },
      data: {
        ...data,
        founded: data.founded ? new Date(data.founded) : null,
        employees: data.employees ? parseInt(data.employees) : null,
        annualRevenue: data.annualRevenue ? parseFloat(data.annualRevenue) : null,
      },
      include: {
        owner: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            avatarUrl: true,
          },
        },
      },
    });

    console.log("🔍 PUT /api/entrepreneurship/[id] - Entrepreneurship updated:", updatedEntrepreneurship.id);
    return NextResponse.json({
      message: "Emprendimiento actualizado exitosamente",
      entrepreneurship: updatedEntrepreneurship,
    });
  } catch (error) {
    console.error("🔍 PUT /api/entrepreneurship/[id] - Error:", error);
    return NextResponse.json({ error: "Error al actualizar emprendimiento" }, { status: 500 });
  }
}

// DELETE /api/entrepreneurship/[id] - Delete entrepreneurship
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔍 DELETE /api/entrepreneurship/[id] - Request started");
    const { id } = await params;
    console.log("🔍 DELETE /api/entrepreneurship/[id] - ID:", id);

    // Get the Authorization header
    const authHeader = request.headers.get('authorization');
    console.log("🔍 DELETE /api/entrepreneurship/[id] - Auth header:", authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("🔍 DELETE /api/entrepreneurship/[id] - No valid auth header, returning 401");
      return NextResponse.json(
        { error: "No autorizado. Token de autenticación requerido." },
        { status: 401 }
      );
    }

    // Extract and decode the JWT token
    const token = authHeader.substring(7);
    const decodedToken = decodeToken(token);
    console.log("🔍 DELETE /api/entrepreneurship/[id] - Decoded token:", decodedToken);
    
    if (!decodedToken || !decodedToken.id) {
      console.log("🔍 DELETE /api/entrepreneurship/[id] - Invalid token, returning 401");
      return NextResponse.json(
        { error: "Token inválido o expirado." },
        { status: 401 }
      );
    }

    const existingEntrepreneurship = await prisma.entrepreneurship.findUnique({
      where: { id },
    });

    if (!existingEntrepreneurship) {
      console.log("🔍 DELETE /api/entrepreneurship/[id] - Entrepreneurship not found");
      return NextResponse.json({ error: "Emprendimiento no encontrado" }, { status: 404 });
    }

    if (existingEntrepreneurship.ownerId !== decodedToken.id) {
      console.log("🔍 DELETE /api/entrepreneurship/[id] - Unauthorized access");
      return NextResponse.json(
        { error: "No autorizado. Solo puedes eliminar tu propio emprendimiento." },
        { status: 403 }
      );
    }

    // Soft delete by setting isActive to false
    await prisma.entrepreneurship.update({
      where: { id },
      data: { isActive: false },
    });

    console.log("🔍 DELETE /api/entrepreneurship/[id] - Entrepreneurship deleted (soft delete)");
    return NextResponse.json({ message: "Emprendimiento eliminado exitosamente" });
  } catch (error) {
    console.error("🔍 DELETE /api/entrepreneurship/[id] - Error:", error);
    return NextResponse.json({ error: "Error al eliminar emprendimiento" }, { status: 500 });
  }
}
