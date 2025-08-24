import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: List all companies (for Super Admin)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Super Admin access required." },
        { status: 401 }
      );
    }

    // TODO: Replace with actual database implementation
    // const companies = await prisma.company.findMany({
    //   where: {
    //     isActive: true,
    //   },
    //   select: {
    //     id: true,
    //     name: true,
    //     businessSector: true,
    //     website: true,
    //     email: true,
    //     phone: true,
    //     address: true,
    //   },
    //   orderBy: {
    //     name: "asc",
    //   },
    // });

    // Return mock data for now
    return NextResponse.json([]);
  } catch (error) {
    console.error("Error fetching companies:", error);
    return NextResponse.json(
      { error: "Failed to fetch companies" },
      { status: 500 }
    );
  }
}
