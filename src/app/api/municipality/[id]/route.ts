import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Mock authentication check for development
    const mockUserRole = "SUPERADMIN";
    
    if (mockUserRole !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "Acceso denegado" },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    const municipality = await prisma.municipality.findUnique({
      where: { id: resolvedParams.id },
      include: {
        companies: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            businessSector: true,
            isActive: true
          }
        }
      }
    });

    if (!municipality) {
      return NextResponse.json(
        { error: "Municipio no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({ municipality });
  } catch (error) {
    console.error("Error fetching municipality:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Mock authentication check for development
    const mockUserRole = "SUPERADMIN";
    
    if (mockUserRole !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "Acceso denegado. Solo super administradores pueden editar municipios." },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    const body = await request.json();
    const { name, department, region, isActive } = body;

    if (!name || !department) {
      return NextResponse.json(
        { error: "Nombre y departamento son campos obligatorios" },
        { status: 400 }
      );
    }

    // Check if municipality exists
    const existingMunicipality = await prisma.municipality.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!existingMunicipality) {
      return NextResponse.json(
        { error: "Municipio no encontrado" },
        { status: 404 }
      );
    }

    // Check if name already exists (excluding current municipality)
    const duplicateMunicipality = await prisma.municipality.findFirst({
      where: {
        name,
        id: { not: resolvedParams.id }
      }
    });

    if (duplicateMunicipality) {
      return NextResponse.json(
        { error: "Ya existe un municipio con este nombre" },
        { status: 400 }
      );
    }

    const updatedMunicipality = await prisma.municipality.update({
      where: { id: resolvedParams.id },
      data: {
        name,
        department,
        region: region || "",
        isActive: isActive !== undefined ? isActive : existingMunicipality.isActive,
      },
      include: {
        companies: {
          where: { isActive: true },
          select: {
            id: true,
            name: true,
            businessSector: true,
            isActive: true
          }
        }
      }
    });

    return NextResponse.json(
      {
        message: "Municipio actualizado exitosamente",
        municipality: updatedMunicipality,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating municipality:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Mock authentication check for development
    const mockUserRole = "SUPERADMIN";
    
    if (mockUserRole !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "Acceso denegado. Solo super administradores pueden eliminar municipios." },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    // Check if municipality exists
    const municipality = await prisma.municipality.findUnique({
      where: { id: resolvedParams.id },
      include: {
        companies: {
          where: { isActive: true }
        }
      }
    });

    if (!municipality) {
      return NextResponse.json(
        { error: "Municipio no encontrado" },
        { status: 404 }
      );
    }

    // Check if municipality has active companies
    if (municipality.companies.length > 0) {
      return NextResponse.json(
        { error: "No se puede eliminar el municipio porque tiene empresas activas" },
        { status: 400 }
      );
    }

    await prisma.municipality.delete({
      where: { id: resolvedParams.id }
    });

    return NextResponse.json(
      {
        message: "Municipio eliminado exitosamente",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting municipality:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 