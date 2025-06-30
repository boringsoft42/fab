import { NextRequest, NextResponse } from "next/server";

// Mock data for entrepreneurship resources
const mockResources = [
  {
    id: "resource-1",
    title: "Plantilla de Plan de Negocios 2024",
    description:
      "Plantilla actualizada con las mejores prácticas para startups bolivianas",
    type: "template",
    category: "Planificación",
    status: "published",
    downloads: 2847,
    rating: 4.8,
    fileUrl: "/resources/business-plan-template-2024.docx",
    createdAt: "2024-01-15T10:00:00.000Z",
    updatedAt: "2024-02-10T15:30:00.000Z",
    createdBy: "admin-001",
  },
  {
    id: "resource-2",
    title: "Guía de Validación de Mercado",
    description:
      "Metodología paso a paso para validar ideas de negocio en el contexto boliviano",
    type: "guide",
    category: "Validación",
    status: "published",
    downloads: 1923,
    rating: 4.6,
    fileUrl: "/resources/market-validation-guide.pdf",
    createdAt: "2024-01-20T14:00:00.000Z",
    updatedAt: "2024-01-20T14:00:00.000Z",
    createdBy: "admin-002",
  },
  {
    id: "resource-3",
    title: "Calculadora de Proyecciones Financieras",
    description:
      "Herramienta Excel interactiva para calcular proyecciones financieras",
    type: "tool",
    category: "Finanzas",
    status: "draft",
    downloads: 0,
    rating: 0,
    fileUrl: "/resources/financial-calculator.xlsx",
    createdAt: "2024-02-15T09:00:00.000Z",
    updatedAt: "2024-02-15T09:00:00.000Z",
    createdBy: "admin-001",
  },
  {
    id: "resource-4",
    title: "Video: Cómo Presentar tu Startup",
    description:
      "Masterclass sobre técnicas de pitch y presentación para emprendedores",
    type: "video",
    category: "Presentación",
    status: "published",
    downloads: 3456,
    rating: 4.9,
    fileUrl: "/resources/startup-pitch-masterclass.mp4",
    createdAt: "2024-01-05T16:00:00.000Z",
    updatedAt: "2024-01-25T11:30:00.000Z",
    createdBy: "admin-003",
  },
  {
    id: "resource-5",
    title: "Podcast: Emprendedores Bolivianos Exitosos",
    description:
      "Serie de entrevistas con emprendedores locales que han escalado sus negocios",
    type: "podcast",
    category: "Inspiración",
    status: "published",
    downloads: 1567,
    rating: 4.7,
    fileUrl: "/resources/bolivian-entrepreneurs-podcast.mp3",
    createdAt: "2024-02-01T12:00:00.000Z",
    updatedAt: "2024-02-01T12:00:00.000Z",
    createdBy: "admin-002",
  },
];

const mockPrograms = [
  {
    id: "program-1",
    name: "Aceleradora Municipal 2024",
    description:
      "Programa de aceleración para startups locales con mentoría y financiamiento",
    type: "accelerator",
    status: "active",
    duration: "6 meses",
    budget: 500000,
    applicants: 89,
    acceptedApplicants: 15,
    deadline: "2024-04-15T23:59:59.000Z",
    startDate: "2024-05-01T09:00:00.000Z",
    location: "Cochabamba",
    organizer: "Alcaldía de Cochabamba",
    requirements: [
      "Startup con menos de 2 años de operación",
      "Equipo de al menos 2 personas",
      "Propuesta de valor clara",
      "Potencial de escalabilidad",
    ],
    benefits: [
      "Financiamiento de hasta Bs. 50,000",
      "Mentoría personalizada",
      "Acceso a red de inversionistas",
      "Espacio de coworking gratuito",
    ],
    createdAt: "2024-01-01T08:00:00.000Z",
    updatedAt: "2024-02-20T14:30:00.000Z",
  },
  {
    id: "program-2",
    name: "Fondo Jóvenes Emprendedores",
    description:
      "Grants de hasta $5000 USD para jóvenes emprendedores bolivianos entre 18-30 años",
    type: "grant",
    status: "active",
    duration: "12 meses",
    budget: 1000000,
    applicants: 234,
    acceptedApplicants: 45,
    deadline: "2024-03-30T23:59:59.000Z",
    startDate: "2024-04-15T09:00:00.000Z",
    location: "Nacional",
    organizer: "Fundación Pro-Joven Bolivia",
    requirements: [
      "Edad entre 18-30 años",
      "Ciudadanía boliviana",
      "Idea de negocio innovadora",
      "Plan de negocios completo",
    ],
    benefits: [
      "Grant de hasta $5,000 USD",
      "Capacitación en emprendimiento",
      "Mentoría de 6 meses",
      "Certificación internacional",
    ],
    createdAt: "2024-01-10T10:00:00.000Z",
    updatedAt: "2024-02-18T16:45:00.000Z",
  },
  {
    id: "program-3",
    name: "Incubadora Verde 2024",
    description:
      "Incubadora especializada en startups de tecnología sostenible y energías renovables",
    type: "incubator",
    status: "upcoming",
    duration: "8 meses",
    budget: 300000,
    applicants: 0,
    acceptedApplicants: 0,
    deadline: "2024-05-30T23:59:59.000Z",
    startDate: "2024-06-15T09:00:00.000Z",
    location: "Santa Cruz",
    organizer: "EcoInnovate Bolivia",
    requirements: [
      "Enfoque en tecnología sostenible",
      "Prototipo funcional o MVP",
      "Equipo técnico competente",
      "Validación inicial de mercado",
    ],
    benefits: [
      "Financiamiento de hasta Bs. 75,000",
      "Acceso a laboratorio de innovación",
      "Red de mentores especializados",
      "Conexión con mercados internacionales",
    ],
    createdAt: "2024-02-01T11:00:00.000Z",
    updatedAt: "2024-02-01T11:00:00.000Z",
  },
];

const mockEntrepreneurships = [
  {
    id: "ent-1",
    businessName: "EcoTech Bolivia",
    entrepreneur: {
      name: "María González",
      email: "maria@ecotech.bo",
      phone: "+591 70123456",
    },
    category: "AgTech",
    subcategory: "Agricultura Inteligente",
    description:
      "Startup de tecnología verde que desarrolla soluciones sostenibles para el sector agrícola boliviano",
    status: "approved",
    location: "Santa Cruz",
    employees: 8,
    foundedYear: 2023,
    revenue: 50000,
    views: 1247,
    contactRequests: 23,
    services: [
      "Sistemas de Riego Inteligente",
      "Monitoreo de Cultivos",
      "Consultoría AgTech",
    ],
    tags: ["Sostenible", "Tecnología Verde", "Agricultura", "IoT"],
    socialMedia: {
      website: "https://ecotech.bo",
      facebook: "@EcoTechBolivia",
      instagram: "@ecotech_bo",
      linkedin: "ecotech-bolivia",
    },
    createdAt: "2024-02-01T10:00:00.000Z",
    updatedAt: "2024-02-20T15:30:00.000Z",
  },
  {
    id: "ent-2",
    businessName: "Artesanías Digitales",
    entrepreneur: {
      name: "Carlos Mamani",
      email: "carlos@artesaniasdigitales.com",
      phone: "+591 60987654",
    },
    category: "E-commerce",
    subcategory: "Marketplace Cultural",
    description:
      "Plataforma digital que conecta artesanos bolivianos con mercados nacionales e internacionales",
    status: "pending",
    location: "La Paz",
    employees: 5,
    foundedYear: 2023,
    revenue: 30000,
    views: 892,
    contactRequests: 15,
    services: [
      "Marketplace Online",
      "Fotografía de Producto",
      "Marketing Digital",
      "Logística",
    ],
    tags: ["Artesanías", "E-commerce", "Cultura Boliviana", "Comercio Justo"],
    socialMedia: {
      website: "https://artesaniasdigitales.com",
      facebook: "@ArtesaniasDigitalesBO",
      instagram: "@artesanias_digitales",
      linkedin: "artesanias-digitales-bolivia",
    },
    createdAt: "2024-02-20T14:00:00.000Z",
    updatedAt: "2024-02-20T14:00:00.000Z",
  },
  {
    id: "ent-3",
    businessName: "FoodTech Express",
    entrepreneur: {
      name: "Ana Gutiérrez",
      email: "ana@foodtechexpress.bo",
      phone: "+591 75456789",
    },
    category: "FoodTech",
    subcategory: "Delivery y Logística",
    description:
      "Aplicación móvil para delivery de comida casera que conecta cocineros locales con clientes",
    status: "approved",
    location: "Cochabamba",
    employees: 12,
    foundedYear: 2022,
    revenue: 120000,
    views: 1456,
    contactRequests: 34,
    services: [
      "App de Delivery",
      "Logística Urbana",
      "Marketing Gastronómico",
      "Capacitación Cocineros",
    ],
    tags: ["Food Tech", "Delivery", "App Móvil", "Gastronomía Local"],
    socialMedia: {
      website: "https://foodtechexpress.bo",
      facebook: "@FoodTechExpressBO",
      instagram: "@foodtech_express",
      linkedin: "foodtech-express-bolivia",
    },
    createdAt: "2024-01-25T12:00:00.000Z",
    updatedAt: "2024-02-15T18:20:00.000Z",
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // resources, programs, entrepreneurships
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    let data;

    switch (type) {
      case "programs":
        data = mockPrograms;
        break;
      case "entrepreneurships":
        data = mockEntrepreneurships;
        break;
      case "resources":
      default:
        data = mockResources;
        break;
    }

    // Apply filters
    let filteredData = [...data];

    if (status && status !== "all") {
      filteredData = filteredData.filter((item: any) => item.status === status);
    }

    if (category && category !== "all") {
      filteredData = filteredData.filter(
        (item: any) => item.category === category
      );
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = filteredData.filter(
        (item: any) =>
          item.title?.toLowerCase().includes(searchLower) ||
          item.name?.toLowerCase().includes(searchLower) ||
          item.businessName?.toLowerCase().includes(searchLower) ||
          item.description?.toLowerCase().includes(searchLower)
      );
    }

    // Calculate summary statistics
    const stats = {
      total: data.length,
      published: data.filter(
        (item: any) => item.status === "published" || item.status === "approved"
      ).length,
      draft: data.filter(
        (item: any) => item.status === "draft" || item.status === "pending"
      ).length,
      active: data.filter((item: any) => item.status === "active").length,
      totalDownloads:
        type === "resources"
          ? data.reduce(
              (sum: number, item: any) => sum + (item.downloads || 0),
              0
            )
          : 0,
      totalApplicants:
        type === "programs"
          ? data.reduce(
              (sum: number, item: any) => sum + (item.applicants || 0),
              0
            )
          : 0,
      totalViews:
        type === "entrepreneurships"
          ? data.reduce((sum: number, item: any) => sum + (item.views || 0), 0)
          : 0,
    };

    return NextResponse.json({
      success: true,
      data: filteredData,
      stats,
      message: `${type || "resources"} retrieved successfully`,
    });
  } catch (error) {
    console.error("Error fetching admin entrepreneurship data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to fetch entrepreneurship data",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, ...data } = body;

    // Validate required fields based on type
    if (!type) {
      return NextResponse.json(
        {
          success: false,
          error: "Type is required",
          message: "Please specify the type of content to create",
        },
        { status: 400 }
      );
    }

    // Mock creation based on type
    let newItem;
    const currentDate = new Date().toISOString();

    switch (type) {
      case "resource":
        newItem = {
          id: `resource-${Date.now()}`,
          ...data,
          status: "draft",
          downloads: 0,
          rating: 0,
          createdAt: currentDate,
          updatedAt: currentDate,
          createdBy: "current-admin",
        };
        break;

      case "program":
        newItem = {
          id: `program-${Date.now()}`,
          ...data,
          status: "upcoming",
          applicants: 0,
          acceptedApplicants: 0,
          createdAt: currentDate,
          updatedAt: currentDate,
        };
        break;

      case "entrepreneurship":
        newItem = {
          id: `ent-${Date.now()}`,
          ...data,
          status: "pending",
          views: 0,
          contactRequests: 0,
          createdAt: currentDate,
          updatedAt: currentDate,
        };
        break;

      default:
        return NextResponse.json(
          {
            success: false,
            error: "Invalid type",
            message: "Type must be one of: resource, program, entrepreneurship",
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: newItem,
      message: `${type} created successfully`,
    });
  } catch (error) {
    console.error("Error creating entrepreneurship content:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        message: "Failed to create content",
      },
      { status: 500 }
    );
  }
}
