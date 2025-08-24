import { NextRequest, NextResponse } from "next/server";
import { getAuthHeaders } from '@/lib/api';

// GET /api/company/news - Fetch company news
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get("companyId");
    const status = searchParams.get("status");
    const limit = parseInt(searchParams.get("limit") || "10");
    const page = parseInt(searchParams.get("page") || "1");

    const backendUrl = process.env.BACKEND_URL || '${BACKEND_URL}';
    let url = `${backendUrl}/api/newsarticle`;

    // Add query parameters
    const queryParams = new URLSearchParams();
    if (companyId) queryParams.append('authorId', companyId);
    if (status && status !== "all") queryParams.append('status', status);
    if (limit) queryParams.append('limit', limit.toString());
    if (page) queryParams.append('page', page.toString());
    queryParams.append('authorType', 'COMPANY');

    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        ...getAuthHeaders()
      }
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching company news:', error);
    return NextResponse.json(
      { error: 'Error al cargar las noticias de la empresa' },
      { status: 500 }
    );
  }
}

// POST /api/company/news - Create new company news
export async function POST(request: NextRequest) {
  try {
    const newsData = await request.json();

    // Validate required fields
    const requiredFields = [
      "title",
      "content",
      "summary",
      "companyId",
      "companyName",
    ];
    for (const field of requiredFields) {
      if (!newsData[field]) {
        return NextResponse.json(
          { error: `El campo ${field} es requerido` },
          { status: 400 }
        );
      }
    }

    const backendUrl = process.env.BACKEND_URL || '${BACKEND_URL}';
    const url = `${backendUrl}/api/newsarticle`;

    const newsPayload = {
      title: newsData.title,
      content: newsData.content,
      summary: newsData.summary,
      imageUrl: newsData.imageUrl,
      videoUrl: newsData.videoUrl,
      authorId: newsData.companyId,
      authorName: newsData.companyName,
      authorType: "COMPANY",
      authorLogo: newsData.companyLogo,
      status: newsData.status || "DRAFT",
      priority: newsData.priority || "MEDIUM",
      featured: newsData.featured || false,
      tags: newsData.tags || [],
      category: newsData.category || "General",
      targetAudience: newsData.targetAudience || ["YOUTH"],
      region: newsData.region,
      relatedLinks: newsData.relatedLinks || [],
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newsPayload)
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Error creating company news:', error);
    return NextResponse.json(
      { error: 'Error al crear noticia' },
      { status: 500 }
    );
  }
}

// PUT /api/company/news - Update company news
export async function PUT(request: NextRequest) {
  try {
    const newsData = await request.json();
    const { searchParams } = new URL(request.url);
    const newsId = searchParams.get("id");

    if (!newsId) {
      return NextResponse.json(
        { error: 'ID de noticia es requerido' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.BACKEND_URL || '${BACKEND_URL}';
    const url = `${backendUrl}/api/newsarticle/${newsId}`;

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newsData)
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating company news:', error);
    return NextResponse.json(
      { error: 'Error al actualizar noticia' },
      { status: 500 }
    );
  }
}

// DELETE /api/company/news - Delete company news
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const newsId = searchParams.get("id");

    if (!newsId) {
      return NextResponse.json(
        { error: 'ID de noticia es requerido' },
        { status: 400 }
      );
    }

    const backendUrl = process.env.BACKEND_URL || '${BACKEND_URL}';
    const url = `${backendUrl}/api/newsarticle/${newsId}`;

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...getAuthHeaders()
      }
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    return NextResponse.json({ message: 'Noticia eliminada exitosamente' });
  } catch (error) {
    console.error('Error deleting company news:', error);
    return NextResponse.json(
      { error: 'Error al eliminar noticia' },
      { status: 500 }
    );
  }
}
