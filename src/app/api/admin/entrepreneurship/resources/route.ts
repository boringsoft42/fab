import { NextRequest, NextResponse } from "next/server";

// Mock data for demonstration - in real app this would come from Prisma/database
const resources = [
  {
    id: "resource-1",
    title: "Plantilla de Plan de Negocios",
    description:
      "Plantilla completa en Word para crear tu plan de negocios paso a paso",
    type: "template",
    thumbnail: "/api/placeholder/300/200",
    category: "Planificación",
    downloads: 2847,
    rating: 4.8,
    author: "Gobierno Municipal",
    fileUrl: "/downloads/plantilla-plan-negocios.docx",
    fileSize: "2.5 MB",
    tags: ["plan de negocios", "emprendimiento", "plantilla"],
    status: "published",
    featured: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-02-20"),
  },
  {
    id: "resource-2",
    title: "Cómo Validar tu Idea de Negocio",
    description:
      "Guía práctica para validar tu idea antes de invertir tiempo y dinero",
    type: "guide",
    thumbnail: "/api/placeholder/300/200",
    category: "Validación",
    downloads: 1923,
    rating: 4.6,
    author: "Fundación Pro-Joven",
    fileUrl: "/downloads/validacion-idea-negocio.pdf",
    fileSize: "1.8 MB",
    tags: ["validación", "idea de negocio", "metodología"],
    status: "published",
    featured: false,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-02-18"),
  },
  {
    id: "resource-3",
    title: "Finanzas para Emprendedores",
    description: "Video curso sobre gestión financiera básica para startups",
    type: "video",
    thumbnail: "/api/placeholder/300/200",
    category: "Finanzas",
    downloads: 3456,
    rating: 4.9,
    author: "Centro CEPYME",
    fileUrl: "https://youtube.com/watch?v=example",
    fileSize: "25 MB",
    tags: ["finanzas", "contabilidad", "startups"],
    status: "published",
    featured: true,
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-02-15"),
  },
];

// GET /api/admin/entrepreneurship/resources - List and filter resources
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");

    let filtered = [...resources];

    // Apply search filter
    if (search) {
      filtered = filtered.filter(
        (resource) =>
          resource.title.toLowerCase().includes(search.toLowerCase()) ||
          resource.description.toLowerCase().includes(search.toLowerCase()) ||
          resource.tags.some((tag) =>
            tag.toLowerCase().includes(search.toLowerCase())
          )
      );
    }

    // Apply type filter
    if (type && type !== "all") {
      filtered = filtered.filter((resource) => resource.type === type);
    }

    // Apply category filter
    if (category && category !== "all") {
      filtered = filtered.filter((resource) => resource.category === category);
    }

    // Apply status filter
    if (status && status !== "all") {
      filtered = filtered.filter((resource) => resource.status === status);
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResources = filtered.slice(startIndex, endIndex);

    // Calculate statistics
    const stats = {
      total: filtered.length,
      byType: {
        template: resources.filter((r) => r.type === "template").length,
        guide: resources.filter((r) => r.type === "guide").length,
        video: resources.filter((r) => r.type === "video").length,
        podcast: resources.filter((r) => r.type === "podcast").length,
        tool: resources.filter((r) => r.type === "tool").length,
      },
      byStatus: {
        published: resources.filter((r) => r.status === "published").length,
        draft: resources.filter((r) => r.status === "draft").length,
        archived: resources.filter((r) => r.status === "archived").length,
      },
      totalDownloads: resources.reduce((sum, r) => sum + r.downloads, 0),
      averageRating:
        resources.reduce((sum, r) => sum + r.rating, 0) / resources.length,
      featured: resources.filter((r) => r.featured).length,
    };

    return NextResponse.json({
      resources: paginatedResources,
      pagination: {
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
      },
      stats,
    });
  } catch (error) {
    console.error("Error fetching resources:", error);
    return NextResponse.json(
      { error: "Error al obtener recursos" },
      { status: 500 }
    );
  }
}

// POST /api/admin/entrepreneurship/resources - Create new resource
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = ["title", "description", "type", "category"];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `El campo ${field} es requerido` },
          { status: 400 }
        );
      }
    }

    // Create new resource
    const newResource = {
      id: `resource-${Date.now()}`,
      ...data,
      downloads: 0,
      rating: 0,
      status: data.status || "draft",
      featured: data.featured || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // In real app, this would save to database using Prisma
    resources.push(newResource);

    return NextResponse.json(
      {
        message: "Recurso creado exitosamente",
        resource: newResource,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating resource:", error);
    return NextResponse.json(
      { error: "Error al crear recurso" },
      { status: 500 }
    );
  }
}
