import { NextRequest, NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET: Get job offer by ID (for Super Admin)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Super Admin access required." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const jobOffer = await prisma.jobOffer.findUnique({
      where: { id },
      include: {
        company: {
          select: {
            id: true,
            name: true,
            businessSector: true,
            website: true,
            email: true,
            phone: true,
            address: true,
          },
        },
        applications: {
          select: {
            id: true,
            status: true,
            appliedAt: true,
            applicant: {
              select: {
                firstName: true,
                lastName: true,
                email: true,
                role: true,
              },
            },
          },
        },
        jobQuestions: {
          orderBy: {
            orderIndex: "asc",
          },
        },
      },
    });

    if (!jobOffer) {
      return NextResponse.json(
        { error: "Job offer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(jobOffer);
  } catch (error) {
    console.error("Error fetching job offer:", error);
    return NextResponse.json(
      { error: "Failed to fetch job offer" },
      { status: 500 }
    );
  }
}

// PUT: Update job offer (for Super Admin)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Super Admin access required." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const updates = await request.json();

    // Check if job offer exists
    const existingJobOffer = await prisma.jobOffer.findUnique({
      where: { id },
    });

    if (!existingJobOffer) {
      return NextResponse.json(
        { error: "Job offer not found" },
        { status: 404 }
      );
    }

    // If companyId is being updated, verify the new company exists
    if (updates.companyId && updates.companyId !== existingJobOffer.companyId) {
      const company = await prisma.company.findUnique({
        where: { id: updates.companyId }
      });

      if (!company || !company.isActive) {
        return NextResponse.json(
          { error: "Invalid or inactive company" },
          { status: 400 }
        );
      }
    }

    // Prepare update data
    const updateData: any = { ...updates };
    
    // Handle numeric fields
    if (updateData.salaryMin !== undefined) {
      updateData.salaryMin = updateData.salaryMin ? parseFloat(updateData.salaryMin) : null;
    }
    if (updateData.salaryMax !== undefined) {
      updateData.salaryMax = updateData.salaryMax ? parseFloat(updateData.salaryMax) : null;
    }
    
    // Handle date fields
    if (updateData.applicationDeadline !== undefined) {
      updateData.applicationDeadline = updateData.applicationDeadline ? new Date(updateData.applicationDeadline) : null;
    }
    if (updateData.expiresAt !== undefined) {
      updateData.expiresAt = updateData.expiresAt ? new Date(updateData.expiresAt) : null;
    }

    // Update job offer
    const updatedJobOffer = await prisma.jobOffer.update({
      where: { id },
      data: updateData,
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

    return NextResponse.json(updatedJobOffer);
  } catch (error) {
    console.error("Error updating job offer:", error);
    return NextResponse.json(
      { error: "Failed to update job offer" },
      { status: 500 }
    );
  }
}

// DELETE: Delete job offer (for Super Admin)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== "SUPERADMIN") {
      return NextResponse.json(
        { error: "Unauthorized. Super Admin access required." },
        { status: 401 }
      );
    }

    const { id } = await params;

    // Check if job offer exists
    const existingJobOffer = await prisma.jobOffer.findUnique({
      where: { id },
    });

    if (!existingJobOffer) {
      return NextResponse.json(
        { error: "Job offer not found" },
        { status: 404 }
      );
    }

    // Delete job offer (this will cascade delete related records)
    await prisma.jobOffer.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Job offer deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting job offer:", error);
    return NextResponse.json(
      { error: "Failed to delete job offer" },
      { status: 500 }
    );
  }
}
