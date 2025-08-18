import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: List all job offers (for Super Admin)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Super Admin access required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const companyId = searchParams.get("companyId");
    const search = searchParams.get("search");

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (companyId) {
      where.companyId = companyId;
    }
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { location: { contains: search, mode: "insensitive" } },
        { municipality: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get job offers with company information
    const jobOffers = await prisma.jobOffer.findMany({
      where,
      include: {
        company: {
          select: {
            id: true,
            name: true,
            businessSector: true,
            website: true,
          },
        },
        applications: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    // Get total count for pagination
    const total = await prisma.jobOffer.count({ where });

    return NextResponse.json({
      jobOffers,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching job offers:", error);
    return NextResponse.json(
      { error: "Failed to fetch job offers" },
      { status: 500 }
    );
  }
}

// POST: Create new job offer (for Super Admin)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Super Admin access required." },
        { status: 401 }
      );
    }

    const jobData = await request.json();
    
    const {
      title,
      description,
      requirements,
      benefits,
      salaryMin,
      salaryMax,
      salaryCurrency = "BOB",
      contractType,
      workSchedule,
      workModality,
      location,
      municipality,
      department = "Cochabamba",
      experienceLevel,
      educationRequired,
      skillsRequired = [],
      desiredSkills = [],
      applicationDeadline,
      companyId,
      status = "ACTIVE",
      featured = false,
      expiresAt,
    } = jobData;

    // Validate required fields
    if (!title || !description || !requirements || !location || !contractType || !workSchedule || !workModality || !experienceLevel || !companyId || !municipality) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, requirements, location, contractType, workSchedule, workModality, experienceLevel, companyId, municipality" },
        { status: 400 }
      );
    }

    // Verify company exists and is active
    const company = await prisma.company.findUnique({
      where: { id: companyId }
    });

    if (!company || !company.isActive) {
      return NextResponse.json(
        { error: "Invalid or inactive company" },
        { status: 400 }
      );
    }

    // Create job offer
    const newJobOffer = await prisma.jobOffer.create({
      data: {
        title,
        description,
        requirements,
        benefits,
        salaryMin: salaryMin ? parseFloat(salaryMin) : null,
        salaryMax: salaryMax ? parseFloat(salaryMax) : null,
        salaryCurrency,
        contractType,
        workSchedule,
        workModality,
        location,
        municipality,
        department,
        experienceLevel,
        educationRequired,
        skillsRequired,
        desiredSkills,
        applicationDeadline: applicationDeadline ? new Date(applicationDeadline) : null,
        companyId,
        status,
        featured,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        isActive: true,
      },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            businessSector: true,
            website: true,
          },
        },
      },
    });

    return NextResponse.json(newJobOffer, { status: 201 });
  } catch (error) {
    console.error("Error creating job offer:", error);
    return NextResponse.json(
      { error: "Failed to create job offer" },
      { status: 500 }
    );
  }
}
