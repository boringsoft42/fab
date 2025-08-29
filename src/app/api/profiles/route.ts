import { NextRequest, NextResponse } from "next/server";

type UserRole = "YOUTH" | "COMPANIES" | "MUNICIPAL_GOVERNMENTS";

// GET: Fetch mock profiles data since we're using mock authentication
export async function GET(req: NextRequest) {
  try {
    // Get query parameters for filtering
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const active = searchParams.get("active");

    // Mock profiles data
    let mockProfiles = [
      {
        id: "mock-profile-1",
        userId: "mock-user-1",
        firstName: "John",
        lastName: "Doe",
        role: "YOUTH" as UserRole,
        avatarUrl: null,
        active: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "mock-profile-2",
        userId: "mock-user-2",
        firstName: "Jane",
        lastName: "Smith",
        role: "COMPANIES" as UserRole,
        avatarUrl: null,
        active: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: "mock-profile-3",
        userId: "mock-user-3",
        firstName: "Bob",
        lastName: "Wilson",
        role: "MUNICIPAL_GOVERNMENTS" as UserRole,
        avatarUrl: null,
        active: false,
        createdAt: new Date().toISOString(),
      },
    ];

    // Apply filters if provided
    if (role) {
      mockProfiles = mockProfiles.filter((profile) => profile.role === role);
    }
    if (active !== null) {
      mockProfiles = mockProfiles.filter(
        (profile) => profile.active === (active === "true")
      );
    }

    return NextResponse.json({ profiles: mockProfiles });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
