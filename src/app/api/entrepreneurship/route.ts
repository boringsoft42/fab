import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { decodeToken } from "@/lib/api";

// GET /api/entrepreneurship - Get all public entrepreneurships
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const municipality = searchParams.get("municipality");
    const ownerId = searchParams.get("ownerId");
    const isPublic = searchParams.get("isPublic");
    const my = searchParams.get("my");

    const where: any = {
      isActive: true,
    };

    // If my=true, filter by authenticated user's entrepreneurships
    if (my === "true") {
      // Get the Authorization header
      const authHeader = request.headers.get('authorization');
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: "No autorizado. Token de autenticación requerido." },
          { status: 401 }
        );
      }

      // Extract and decode the JWT token
      const token = authHeader.substring(7); // Remove 'Bearer ' prefix
      const decodedToken = decodeToken(token);
      
      if (!decodedToken || !decodedToken.id) {
        return NextResponse.json(
          { error: "Token inválido o expirado." },
          { status: 401 }
        );
      }
      
      where.ownerId = decodedToken.id;
    }

    if (category) {
      where.category = category;
    }

    if (municipality) {
      where.municipality = municipality;
    }

    if (ownerId) {
      where.ownerId = ownerId;
    }

    if (isPublic !== null) {
      where.isPublic = isPublic === "true";
    }

    const entrepreneurships = await prisma.entrepreneurship.findMany({
      where,
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
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({
      items: entrepreneurships,
      total: entrepreneurships.length,
      isMyList: my === "true"
    });
  } catch (error) {
    console.error("Error fetching entrepreneurships:", error);
    return NextResponse.json(
      { error: "Error al obtener emprendimientos" },
      { status: 500 }
    );
  }
}

// POST /api/entrepreneurship - Create new entrepreneurship
export async function POST(request: NextRequest) {
  try {
    console.log("🔍 POST /api/entrepreneurship - Request started");
    
    // Get the Authorization header
    const authHeader = request.headers.get('authorization');
    console.log("🔍 POST /api/entrepreneurship - Auth header:", authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("🔍 POST /api/entrepreneurship - No valid auth header, returning 401");
      return NextResponse.json(
        { error: "No autorizado. Token de autenticación requerido." },
        { status: 401 }
      );
    }

    // Extract and decode the JWT token
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.log("🔍 POST /api/entrepreneurship - Token:", token.substring(0, 20) + "...");
    
    const decodedToken = decodeToken(token);
    console.log("🔍 POST /api/entrepreneurship - Decoded token:", decodedToken);
    
    if (!decodedToken || !decodedToken.id) {
      console.log("🔍 POST /api/entrepreneurship - Invalid token, returning 401");
      return NextResponse.json(
        { error: "Token inválido o expirado." },
        { status: 401 }
      );
    }

    const data = await request.json();
    console.log("🔍 POST /api/entrepreneurship - Request data:", data);
    
    const {
      name,
      description,
      category,
      subcategory,
      businessStage = "IDEA",
      logo,
      images = [],
      website,
      email,
      phone,
      address,
      municipality,
      department = "Cochabamba",
      socialMedia = {},
      founded,
      employees,
      annualRevenue,
      businessModel,
      targetMarket,
      isPublic = true,
      isActive = true,
    } = data;

    // Validate required fields
    if (!name || !description || !category || !municipality) {
      console.log("🔍 POST /api/entrepreneurship - Missing required fields");
      return NextResponse.json(
        { error: "Campos requeridos: name, description, category, municipality" },
        { status: 400 }
      );
    }

    console.log("🔍 POST /api/entrepreneurship - Creating entrepreneurship with ownerId:", decodedToken.id);

    // Create entrepreneurship
    const entrepreneurship = await prisma.entrepreneurship.create({
      data: {
        ownerId: decodedToken.id,
        name,
        description,
        category,
        subcategory,
        businessStage,
        logo,
        images,
        website,
        email,
        phone,
        address,
        municipality,
        department,
        socialMedia,
        founded: founded ? new Date(founded) : null,
        employees: employees ? parseInt(employees) : null,
        annualRevenue: annualRevenue ? parseFloat(annualRevenue) : null,
        businessModel,
        targetMarket,
        isPublic,
        isActive,
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

    console.log("🔍 POST /api/entrepreneurship - Entrepreneurship created:", entrepreneurship.id);

    return NextResponse.json(
      {
        message: "Emprendimiento creado exitosamente",
        entrepreneurship,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("🔍 POST /api/entrepreneurship - Error:", error);
    return NextResponse.json(
      { error: "Error al crear emprendimiento" },
      { status: 500 }
    );
  }
}
