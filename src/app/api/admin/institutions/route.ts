import { NextRequest, NextResponse } from "next/server";

// Mock data for demonstration - in real app this would come from Prisma/database
const institutions = [
  {
    id: "inst-1",
    name: "Alcaldía de Cochabamba",
    logo: "/api/placeholder/100/100",
    type: "municipality",
    description:
      "Gobierno municipal enfocado en promover el emprendimiento y desarrollo económico local a través de programas de capacitación y financiamiento.",
    location: "Cochabamba, Bolivia",
    website: "https://cochabamba.bo",
    phone: "+591 4 4258000",
    email: "emprendimiento@cochabamba.bo",
    services: [
      "Licencias Comerciales",
      "Capacitación Empresarial",
      "Microcréditos",
      "Asesoría Legal",
    ],
    programs: [
      "Jóvenes Emprendedores CBBA",
      "Mujeres Empresarias",
      "Startups Locales",
    ],
    beneficiaries: 2500,
    founded: 1994,
    rating: 4.2,
    reviewCount: 89,
    verified: true,
    focus_areas: [
      "Desarrollo Económico",
      "Emprendimiento Juvenil",
      "Microempresas",
    ],
    contact_person: {
      name: "María López",
      position: "Directora de Desarrollo Económico",
      phone: "+591 4 4258100",
      email: "mlopez@cochabamba.bo",
    },
    status: "active",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-02-20"),
  },
  {
    id: "inst-2",
    name: "Fundación Pro-Joven",
    logo: "/api/placeholder/100/100",
    type: "foundation",
    description:
      "Organización sin fines de lucro dedicada a empoderar a jóvenes bolivianos a través de programas de formación, mentorías y financiamiento para emprendimientos.",
    location: "La Paz, Bolivia",
    website: "https://projoven.org.bo",
    phone: "+591 2 2441200",
    email: "contacto@projoven.org.bo",
    services: [
      "Formación Empresarial",
      "Mentorías",
      "Financiamiento",
      "Networking",
    ],
    programs: ["Fondo Semilla", "Aceleradora de Startups", "Liderazgo Juvenil"],
    beneficiaries: 1800,
    founded: 2010,
    rating: 4.7,
    reviewCount: 156,
    verified: true,
    focus_areas: [
      "Juventud",
      "Emprendimiento Social",
      "Innovación",
      "Tecnología",
    ],
    contact_person: {
      name: "Carlos Mendoza",
      position: "Coordinador de Programas",
      phone: "+591 2 2441250",
      email: "cmendoza@projoven.org.bo",
    },
    status: "active",
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-02-18"),
  },
  {
    id: "inst-3",
    name: "Centro de Capacitación CEPYME",
    logo: "/api/placeholder/100/100",
    type: "training_center",
    description:
      "Centro especializado en capacitación empresarial y desarrollo de competencias para pequeñas y medianas empresas en Bolivia.",
    location: "Santa Cruz, Bolivia",
    website: "https://cepyme.org.bo",
    phone: "+591 3 3364500",
    email: "info@cepyme.org.bo",
    services: [
      "Cursos de Gestión",
      "Certificaciones",
      "Consultoría",
      "Diagnósticos Empresariales",
    ],
    programs: [
      "Gestión de Calidad",
      "Marketing Digital",
      "Finanzas Empresariales",
    ],
    beneficiaries: 3200,
    founded: 2005,
    rating: 4.5,
    reviewCount: 234,
    verified: true,
    focus_areas: [
      "Capacitación",
      "Gestión Empresarial",
      "Calidad",
      "Productividad",
    ],
    contact_person: {
      name: "Ana Gutiérrez",
      position: "Directora Académica",
      phone: "+591 3 3364550",
      email: "agutierrez@cepyme.org.bo",
    },
    status: "active",
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-02-15"),
  },
];

// GET /api/admin/institutions - List and filter institutions
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const type = searchParams.get("type");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");

    let filtered = [...institutions];

    // Apply search filter
    if (search) {
      filtered = filtered.filter(
        (institution) =>
          institution.name.toLowerCase().includes(search.toLowerCase()) ||
          institution.description
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          institution.location.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply type filter
    if (type && type !== "all") {
      filtered = filtered.filter((institution) => institution.type === type);
    }

    // Apply status filter
    if (status && status !== "all") {
      filtered = filtered.filter(
        (institution) => institution.status === status
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedInstitutions = filtered.slice(startIndex, endIndex);

    // Calculate statistics
    const stats = {
      total: filtered.length,
      byType: {
        municipality: institutions.filter((i) => i.type === "municipality")
          .length,
        ngo: institutions.filter((i) => i.type === "ngo").length,
        foundation: institutions.filter((i) => i.type === "foundation").length,
        training_center: institutions.filter(
          (i) => i.type === "training_center"
        ).length,
        government: institutions.filter((i) => i.type === "government").length,
      },
      byStatus: {
        active: institutions.filter((i) => i.status === "active").length,
        pending: institutions.filter((i) => i.status === "pending").length,
        inactive: institutions.filter((i) => i.status === "inactive").length,
      },
      totalBeneficiaries: institutions.reduce(
        (sum, i) => sum + i.beneficiaries,
        0
      ),
      averageRating:
        institutions.reduce((sum, i) => sum + i.rating, 0) /
        institutions.length,
    };

    return NextResponse.json({
      institutions: paginatedInstitutions,
      pagination: {
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
      },
      stats,
    });
  } catch (error) {
    console.error("Error fetching institutions:", error);
    return NextResponse.json(
      { error: "Error al obtener instituciones" },
      { status: 500 }
    );
  }
}

// POST /api/admin/institutions - Create new institution
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = ["name", "type", "description", "location", "email"];
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { error: `El campo ${field} es requerido` },
          { status: 400 }
        );
      }
    }

    // Create new institution
    const newInstitution = {
      id: `inst-${Date.now()}`,
      ...data,
      rating: 0,
      reviewCount: 0,
      verified: false,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // In real app, this would save to database using Prisma
    institutions.push(newInstitution);

    return NextResponse.json(
      {
        message: "Institución creada exitosamente",
        institution: newInstitution,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating institution:", error);
    return NextResponse.json(
      { error: "Error al crear institución" },
      { status: 500 }
    );
  }
}
