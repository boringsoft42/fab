import { NextRequest, NextResponse } from "next/server";

type UserRole =
  | "YOUTH"
  | "ADOLESCENTS"
  | "COMPANIES"
  | "MUNICIPAL_GOVERNMENTS"
  | "TRAINING_CENTERS"
  | "NGOS_AND_FOUNDATIONS";

export async function PATCH(request: NextRequest) {
  try {
    const { role } = await request.json();

    // Validate role
    const validRoles: UserRole[] = [
      "YOUTH",
      "ADOLESCENTS",
      "COMPANIES",
      "MUNICIPAL_GOVERNMENTS",
      "TRAINING_CENTERS",
      "NGOS_AND_FOUNDATIONS",
    ];

    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Return mock updated user data for development
    const updatedUser = {
      id: "mock-user-id",
      email: "john@example.com",
      name: "John Doe",
      role: role,
      profile: {
        id: "mock-profile-id",
        firstName: "John",
        lastName: "Doe",
        profilePicture: null,
        completionPercentage: 15,
      },
    };

    return NextResponse.json({
      message: "Role updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
