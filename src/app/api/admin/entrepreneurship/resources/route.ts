import { NextRequest, NextResponse } from &ldquo;next/server&rdquo;;

// Mock data for demonstration - in real app this would come from Prisma/database
const resources = [
  {
    id: &ldquo;resource-1&rdquo;,
    title: &ldquo;Plantilla de Plan de Negocios&rdquo;,
    description:
      &ldquo;Plantilla completa en Word para crear tu plan de negocios paso a paso&rdquo;,
    type: &ldquo;template&rdquo;,
    thumbnail: &ldquo;/api/placeholder/300/200&rdquo;,
    category: &ldquo;Planificación&rdquo;,
    downloads: 2847,
    rating: 4.8,
    author: &ldquo;Gobierno Municipal&rdquo;,
    fileUrl: &ldquo;/downloads/plantilla-plan-negocios.docx&rdquo;,
    fileSize: &ldquo;2.5 MB&rdquo;,
    tags: [&ldquo;plan de negocios&rdquo;, &ldquo;emprendimiento&rdquo;, &ldquo;plantilla&rdquo;],
    status: &ldquo;published&rdquo;,
    featured: true,
    createdAt: new Date(&ldquo;2024-01-15&rdquo;),
    updatedAt: new Date(&ldquo;2024-02-20&rdquo;),
  },
  {
    id: &ldquo;resource-2&rdquo;,
    title: &ldquo;Cómo Validar tu Idea de Negocio&rdquo;,
    description:
      &ldquo;Guía práctica para validar tu idea antes de invertir tiempo y dinero&rdquo;,
    type: &ldquo;guide&rdquo;,
    thumbnail: &ldquo;/api/placeholder/300/200&rdquo;,
    category: &ldquo;Validación&rdquo;,
    downloads: 1923,
    rating: 4.6,
    author: &ldquo;Fundación Pro-Joven&rdquo;,
    fileUrl: &ldquo;/downloads/validacion-idea-negocio.pdf&rdquo;,
    fileSize: &ldquo;1.8 MB&rdquo;,
    tags: [&ldquo;validación&rdquo;, &ldquo;idea de negocio&rdquo;, &ldquo;metodología&rdquo;],
    status: &ldquo;published&rdquo;,
    featured: false,
    createdAt: new Date(&ldquo;2024-01-20&rdquo;),
    updatedAt: new Date(&ldquo;2024-02-18&rdquo;),
  },
  {
    id: &ldquo;resource-3&rdquo;,
    title: &ldquo;Finanzas para Emprendedores&rdquo;,
    description: &ldquo;Video curso sobre gestión financiera básica para startups&rdquo;,
    type: &ldquo;video&rdquo;,
    thumbnail: &ldquo;/api/placeholder/300/200&rdquo;,
    category: &ldquo;Finanzas&rdquo;,
    downloads: 3456,
    rating: 4.9,
    author: &ldquo;Centro CEPYME&rdquo;,
    fileUrl: &ldquo;https://youtube.com/watch?v=example&rdquo;,
    fileSize: &ldquo;25 MB&rdquo;,
    tags: [&ldquo;finanzas&rdquo;, &ldquo;contabilidad&rdquo;, &ldquo;startups&rdquo;],
    status: &ldquo;published&rdquo;,
    featured: true,
    createdAt: new Date(&ldquo;2024-01-10&rdquo;),
    updatedAt: new Date(&ldquo;2024-02-15&rdquo;),
  },
];

// GET /api/admin/entrepreneurship/resources - List and filter resources
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get(&ldquo;search&rdquo;);
    const type = searchParams.get(&ldquo;type&rdquo;);
    const category = searchParams.get(&ldquo;category&rdquo;);
    const status = searchParams.get(&ldquo;status&rdquo;);
    const limit = parseInt(searchParams.get(&ldquo;limit&rdquo;) || &ldquo;10&rdquo;);
    const page = parseInt(searchParams.get(&ldquo;page&rdquo;) || &ldquo;1&rdquo;);

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
    if (type && type !== &ldquo;all&rdquo;) {
      filtered = filtered.filter((resource) => resource.type === type);
    }

    // Apply category filter
    if (category && category !== &ldquo;all&rdquo;) {
      filtered = filtered.filter((resource) => resource.category === category);
    }

    // Apply status filter
    if (status && status !== &ldquo;all&rdquo;) {
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
        template: resources.filter((r) => r.type === &ldquo;template&rdquo;).length,
        guide: resources.filter((r) => r.type === &ldquo;guide&rdquo;).length,
        video: resources.filter((r) => r.type === &ldquo;video&rdquo;).length,
        podcast: resources.filter((r) => r.type === &ldquo;podcast&rdquo;).length,
        tool: resources.filter((r) => r.type === &ldquo;tool&rdquo;).length,
      },
      byStatus: {
        published: resources.filter((r) => r.status === &ldquo;published&rdquo;).length,
        draft: resources.filter((r) => r.status === &ldquo;draft&rdquo;).length,
        archived: resources.filter((r) => r.status === &ldquo;archived&rdquo;).length,
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
    console.error(&ldquo;Error fetching resources:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Error al obtener recursos&rdquo; },
      { status: 500 }
    );
  }
}

// POST /api/admin/entrepreneurship/resources - Create new resource
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Validate required fields
    const requiredFields = [&ldquo;title&rdquo;, &ldquo;description&rdquo;, &ldquo;type&rdquo;, &ldquo;category&rdquo;];
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
      status: data.status || &ldquo;draft&rdquo;,
      featured: data.featured || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // In real app, this would save to database using Prisma
    resources.push(newResource);

    return NextResponse.json(
      {
        message: &ldquo;Recurso creado exitosamente&rdquo;,
        resource: newResource,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(&ldquo;Error creating resource:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Error al crear recurso&rdquo; },
      { status: 500 }
    );
  }
}
