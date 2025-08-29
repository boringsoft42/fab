import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const userId = (await params).userId;

    // Return mock profile data for development
    const mockProfile = {
      id: "mock-profile-id",
      userId: userId,
      firstName: "John",
      lastName: "Doe",
      avatarUrl: null,
      active: true,
      role: "YOUTH",
      bio: "Mock user bio",
      location: "Mock City",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ profile: mockProfile });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const userId = (await params).userId;
    const json = await request.json();

    // Return mock updated profile data for development
    const updatedProfile = {
      id: "mock-profile-id",
      userId: userId,
      firstName: json.firstName || "John",
      lastName: json.lastName || "Doe",
      avatarUrl: json.avatarUrl || null,
      active: json.active !== undefined ? json.active : true,
      role: "YOUTH",
      bio: json.bio || "Mock user bio",
      location: json.location || "Mock City",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ profile: updatedProfile });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}
