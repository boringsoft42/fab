import { NextRequest, NextResponse } from &ldquo;next/server&rdquo;;

type UserRole = &ldquo;YOUTH&rdquo; | &ldquo;COMPANIES&rdquo; | &ldquo;MUNICIPAL_GOVERNMENTS&rdquo;;

// GET: Fetch mock profiles data since we're using mock authentication
export async function GET(req: NextRequest) {
  try {
    // Get query parameters for filtering
    const { searchParams } = new URL(req.url);
    const role = searchParams.get(&ldquo;role&rdquo;);
    const active = searchParams.get(&ldquo;active&rdquo;);

    // Mock profiles data
    let mockProfiles = [
      {
        id: &ldquo;mock-profile-1&rdquo;,
        userId: &ldquo;mock-user-1&rdquo;,
        firstName: &ldquo;John&rdquo;,
        lastName: &ldquo;Doe&rdquo;,
        role: &ldquo;YOUTH&rdquo; as UserRole,
        avatarUrl: null,
        active: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: &ldquo;mock-profile-2&rdquo;,
        userId: &ldquo;mock-user-2&rdquo;,
        firstName: &ldquo;Jane&rdquo;,
        lastName: &ldquo;Smith&rdquo;,
        role: &ldquo;COMPANIES&rdquo; as UserRole,
        avatarUrl: null,
        active: true,
        createdAt: new Date().toISOString(),
      },
      {
        id: &ldquo;mock-profile-3&rdquo;,
        userId: &ldquo;mock-user-3&rdquo;,
        firstName: &ldquo;Bob&rdquo;,
        lastName: &ldquo;Wilson&rdquo;,
        role: &ldquo;MUNICIPAL_GOVERNMENTS&rdquo; as UserRole,
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
        (profile) => profile.active === (active === &ldquo;true&rdquo;)
      );
    }

    return NextResponse.json({ profiles: mockProfiles });
  } catch (error) {
    console.error(&ldquo;Error fetching profiles:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Internal server error&rdquo; },
      { status: 500 }
    );
  }
}
