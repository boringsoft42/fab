import { NextRequest, NextResponse } from "next/server";

// GET: Fetch mock profile data since we're using mock authentication
export async function GET() {
  try {
    // Return mock profile data for development
    const mockProfile = {
      id: "mock-profile-id",
      userId: "mock-user-id",
      firstName: "John",
      lastName: "Doe",
      role: "YOUTH",
      avatarUrl: null,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completionPercentage: 25,
    };

    return NextResponse.json(mockProfile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// PUT: Update mock profile data since we're using mock authentication
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    const { firstName, lastName, avatarUrl, active } = data;

    // Return mock updated profile data for development
    const updatedProfile = {
      id: "mock-profile-id",
      userId: "mock-user-id",
      firstName: firstName || "John",
      lastName: lastName || "Doe",
      role: "YOUTH",
      avatarUrl: avatarUrl || null,
      active: active !== undefined ? active : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completionPercentage: 50,
    };

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

// POST: Create mock profile data since we're using mock authentication
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { userId, firstName, lastName, avatarUrl } = data;

    // Return mock new profile data for development
    const newProfile = {
      id: "mock-profile-id",
      userId: userId || "mock-user-id",
      firstName: firstName || "John",
      lastName: lastName || "Doe",
      role: "YOUTH",
      avatarUrl: avatarUrl || null,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completionPercentage: 10,
    };

    return NextResponse.json(newProfile, { status: 201 });
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    );
  }
}
