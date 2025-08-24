import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// POST /api/entrepreneurship/[id]/views - Increment view count
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log("🔍 POST /api/entrepreneurship/[id]/views - Request started");
    const { id } = await params;
    console.log("🔍 POST /api/entrepreneurship/[id]/views - ID:", id);

    const entrepreneurship = await prisma.entrepreneurship.findUnique({
      where: { id },
    });

    if (!entrepreneurship) {
      console.log("🔍 POST /api/entrepreneurship/[id]/views - Entrepreneurship not found");
      return NextResponse.json({ error: "Emprendimiento no encontrado" }, { status: 404 });
    }

    // Increment view count
    const updatedEntrepreneurship = await prisma.entrepreneurship.update({
      where: { id },
      data: { viewsCount: { increment: 1 } },
    });

    console.log("🔍 POST /api/entrepreneurship/[id]/views - View count incremented:", updatedEntrepreneurship.viewsCount);
    return NextResponse.json({
      message: "Vista registrada exitosamente",
      viewsCount: updatedEntrepreneurship.viewsCount,
    });
  } catch (error) {
    console.error("🔍 POST /api/entrepreneurship/[id]/views - Error:", error);
    return NextResponse.json({ error: "Error al registrar vista" }, { status: 500 });
  }
}
