import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // Mock authentication check for development
    const mockUserRole = "SUPERADMIN";
    
    if (mockUserRole !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "Acceso denegado. Solo super administradores pueden crear instituciones." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { 
      name, 
      department, 
      region, 
      address,
      website,
      username,
      password,
      email,
      phone,
      institutionType,
      customType,
      primaryColor,
      secondaryColor
    } = body;

    // Validate required fields
    if (!name || !department || !username || !password || !email || !institutionType) {
      return NextResponse.json(
        { error: "Nombre, departamento, usuario, contraseña, email e institutionType son campos obligatorios" },
        { status: 400 }
      );
    }

    // Validate institutionType
    const validInstitutionTypes = ["MUNICIPALITY", "NGO", "FOUNDATION", "OTHER"];
    if (!validInstitutionTypes.includes(institutionType)) {
      return NextResponse.json(
        { error: "Tipo de institución inválido" },
        { status: 400 }
      );
    }

    // Mock validation - in real implementation, check against backend
    // Check if institution already exists by name
    // Check if username already exists
    // Check if email already exists

    // Mock institution creation - in real implementation, call backend API
    const mockMunicipality = {
      id: `municipality_${Date.now()}`,
      name,
      department,
      region: region || "",
      address: address || "",
      website: website || "",
      phone: phone || "",
      institutionType,
      customType: customType || null,
      primaryColor: primaryColor || "#1E40AF",
      secondaryColor: secondaryColor || "#F59E0B",
      isActive: true,
      username,
      email,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      creator: {
        id: "admin123",
        username: "superadmin",
        role: "SUPERADMIN"
      }
    };

    // In real implementation, here you would:
    // 1. Call your backend API to create the institution
    // 2. Create the user account for the institution
    // 3. Handle any errors from the backend

    return NextResponse.json(
      {
        message: "Institución creada exitosamente",
        municipality: mockMunicipality,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating municipality:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Mock authentication check for development
    const mockUserRole = "SUPERADMIN";
    
    if (mockUserRole !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "Acceso denegado" },
        { status: 403 }
      );
    }

    // Mock institutions data - in real implementation, call backend API
    const mockMunicipalities = [
      {
        id: "municipality_1",
        name: "Municipio de Cochabamba",
        department: "Cochabamba",
        region: "Valle",
        address: "Plaza Principal 14 de Septiembre",
        website: "https://cochabamba.gob.bo",
        phone: "+591 4 4222222",
        institutionType: "MUNICIPALITY",
        customType: null,
        primaryColor: "#1E40AF",
        secondaryColor: "#F59E0B",
        isActive: true,
        username: "cochabamba_muni",
        email: "info@cochabamba.gob.bo",
        createdAt: "2025-01-15T10:00:00.000Z",
        updatedAt: "2025-01-15T10:00:00.000Z",
        creator: {
          id: "admin123",
          username: "superadmin",
          role: "SUPERADMIN"
        }
      },
      {
        id: "municipality_2",
        name: "Municipio de La Paz",
        department: "La Paz",
        region: "Altiplano",
        address: "Plaza Murillo",
        website: "https://lapaz.gob.bo",
        phone: "+591 2 2200000",
        institutionType: "MUNICIPALITY",
        customType: null,
        primaryColor: "#DC2626",
        secondaryColor: "#FCD34D",
        isActive: true,
        username: "lapaz_muni",
        email: "info@lapaz.gob.bo",
        createdAt: "2025-01-10T10:00:00.000Z",
        updatedAt: "2025-01-10T10:00:00.000Z",
        creator: {
          id: "admin123",
          username: "superadmin",
          role: "SUPERADMIN"
        }
      }
    ];

    // In real implementation, here you would:
    // 1. Call your backend API to get institutions
    // 2. Handle any errors from the backend

    return NextResponse.json({ municipalities: mockMunicipalities });
  } catch (error) {
    console.error("Error fetching municipalities:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 