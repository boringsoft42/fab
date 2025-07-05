import { NextRequest, NextResponse } from &ldquo;next/server&rdquo;;

type UserRole = &ldquo;YOUTH&rdquo; | &ldquo;COMPANIES&rdquo; | &ldquo;MUNICIPAL_GOVERNMENTS&rdquo;;

export async function PATCH(request: NextRequest) {
  try {
    const { role } = await request.json();

    // Validate role
    const validRoles: UserRole[] = [
      &ldquo;YOUTH&rdquo;,
      &ldquo;COMPANIES&rdquo;,
      &ldquo;MUNICIPAL_GOVERNMENTS&rdquo;,
    ];

    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: &ldquo;Invalid role&rdquo; }, { status: 400 });
    }

    // Return mock updated user data for development
    const updatedUser = {
      id: &ldquo;mock-user-id&rdquo;,
      email: &ldquo;john@example.com&rdquo;,
      name: &ldquo;John Doe&rdquo;,
      role: role,
      profile: {
        id: &ldquo;mock-profile-id&rdquo;,
        firstName: &ldquo;John&rdquo;,
        lastName: &ldquo;Doe&rdquo;,
        profilePicture: null,
        completionPercentage: 15,
      },
    };

    return NextResponse.json({
      message: &ldquo;Role updated successfully&rdquo;,
      user: updatedUser,
    });
  } catch (error) {
    console.error(&ldquo;Error updating user role:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Internal server error&rdquo; },
      { status: 500 }
    );
  }
}
