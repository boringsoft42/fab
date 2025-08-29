import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Helper function to decode JWT token
function decodeToken(token: string) {
  try {
    const tokenParts = token.split(".");
    if (tokenParts.length !== 3) {
      return null;
    }

    const base64Url = tokenParts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
}

// In-memory storage for created municipalities (for development/testing)
// In production, this would be replaced with proper database storage
let createdMunicipalities: any[] = [];

// Get stored municipalities from memory
function getStoredMunicipalities() {
  return createdMunicipalities;
}

// Add municipality to storage
function addMunicipalityToStorage(municipality: any) {
  createdMunicipalities.push(municipality);
  console.log("🏛️ Municipality added to storage. Total count:", createdMunicipalities.length);
}

export async function POST(request: NextRequest) {
  try {
    console.log("🏛️ POST /api/municipality - Starting municipality creation");

    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("cemse-auth-token")?.value;

    if (!token) {
      console.log("❌ POST /api/municipality - No auth token found in cookies");
      return NextResponse.json(
        { error: "Acceso denegado. Solo super administradores pueden crear instituciones." },
        { status: 403 }
      );
    }

    // Handle mock development tokens
    let decoded = null;
    if (token.startsWith('mock-dev-token-')) {
      console.log("🔐 POST /api/municipality - Mock token detected, allowing access");
      decoded = { role: 'SUPERADMIN', type: 'SUPERADMIN' };
    } else {
      decoded = decodeToken(token);
      if (!decoded) {
        console.log("❌ POST /api/municipality - Invalid token format");
        return NextResponse.json(
          { error: "Acceso denegado. Token inválido." },
          { status: 403 }
        );
      }
    }

    // Check if user has SUPERADMIN role
    const userRole = decoded.role || decoded.type;
    if (userRole !== "SUPERADMIN") {
      console.log(`❌ POST /api/municipality - Insufficient permissions. Role: ${userRole}`);
      return NextResponse.json(
        { error: "Acceso denegado. Solo super administradores pueden crear instituciones." },
        { status: 403 }
      );
    }

    console.log("✅ POST /api/municipality - Authentication successful");

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

    // Store the created municipality in memory so it persists
    addMunicipalityToStorage(mockMunicipality);

    // In real implementation, here you would:
    // 1. Call your backend API to create the institution
    // 2. Create the user account for the institution
    // 3. Handle any errors from the backend

    console.log("🏛️ Municipality created successfully:", mockMunicipality.name);

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

export async function GET() {
  try {
    console.log("🏛️ GET /api/municipality - Fetching municipalities list");

    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("cemse-auth-token")?.value;

    if (!token) {
      console.log("❌ GET /api/municipality - No auth token found in cookies");
      return NextResponse.json(
        { error: "Acceso denegado" },
        { status: 403 }
      );
    }

    // Handle mock development tokens
    let decoded = null;
    if (token.startsWith('mock-dev-token-')) {
      console.log("🔐 GET /api/municipality - Mock token detected, allowing access");
      decoded = { role: 'SUPERADMIN', type: 'SUPERADMIN' };
    } else {
      decoded = decodeToken(token);
      if (!decoded) {
        console.log("❌ GET /api/municipality - Invalid token format");
        return NextResponse.json(
          { error: "Acceso denegado. Token inválido." },
          { status: 403 }
        );
      }
    }

    // Check if user has SUPERADMIN role
    const userRole = decoded.role || decoded.type;
    if (userRole !== "SUPERADMIN") {
      console.log(`❌ GET /api/municipality - Insufficient permissions. Role: ${userRole}`);
      return NextResponse.json(
        { error: "Acceso denegado" },
        { status: 403 }
      );
    }

    console.log("✅ GET /api/municipality - Authentication successful");

    // Default mock municipalities (static data)
    const defaultMunicipalities = [
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

    // Get dynamically created municipalities from storage
    const dynamicMunicipalities = getStoredMunicipalities();
    
    // Combine default municipalities with created ones
    const allMunicipalities = [...defaultMunicipalities, ...dynamicMunicipalities];

    console.log("🏛️ GET municipalities - Returning data:", {
      default: defaultMunicipalities.length,
      created: dynamicMunicipalities.length,
      total: allMunicipalities.length
    });

    // In real implementation, here you would:
    // 1. Call your backend API to get institutions
    // 2. Handle any errors from the backend

    return NextResponse.json({ municipalities: allMunicipalities });
  } catch (error) {
    console.error("Error fetching municipalities:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 