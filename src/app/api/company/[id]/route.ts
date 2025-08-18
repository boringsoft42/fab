import { NextRequest, NextResponse } from "next/server";
import { CompanyService } from "@/services/company.service";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Mock authentication check for development
    const mockUserRole = "SUPERADMIN";
    
    if (mockUserRole !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "Acceso denegado. Solo super administradores pueden editar empresas." },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    const body = await request.json();
    const result = await CompanyService.updateCompany(resolvedParams.id, body);
    
    if (result.success) {
      return NextResponse.json(
        {
          message: "Empresa actualizada exitosamente",
          company: result.data,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: result.status || 400 }
      );
    }
  } catch (error) {
    console.error("Error updating company:", error);
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
        { error: "Acceso denegado. Solo super administradores pueden eliminar empresas." },
        { status: 403 }
      );
    }

    const resolvedParams = await params;
    const result = await CompanyService.deleteCompany(resolvedParams.id);
    
    if (result.success) {
      return NextResponse.json(
        {
          message: "Empresa eliminada exitosamente",
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: result.status || 400 }
      );
    }
  } catch (error) {
    console.error("Error deleting company:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

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
    const result = await CompanyService.getCompany(resolvedParams.id);
    
    if (result.success) {
      return NextResponse.json({ company: result.data });
    } else {
      return NextResponse.json(
        { error: result.error },
        { status: result.status || 404 }
      );
    }
  } catch (error) {
    console.error("Error fetching company:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 