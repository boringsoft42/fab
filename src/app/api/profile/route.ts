import { NextRequest, NextResponse } from &ldquo;next/server&rdquo;;

// GET: Fetch mock profile data since we're using mock authentication
export async function GET() {
  try {
    // Return mock profile data for development
    const mockProfile = {
      id: &ldquo;mock-profile-id&rdquo;,
      userId: &ldquo;mock-user-id&rdquo;,
      firstName: &ldquo;John&rdquo;,
      lastName: &ldquo;Doe&rdquo;,
      role: &ldquo;YOUTH&rdquo;,
      avatarUrl: null,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completionPercentage: 25,
    };

    return NextResponse.json(mockProfile);
  } catch (error) {
    console.error(&ldquo;Error fetching profile:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Failed to fetch profile&rdquo; },
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
      id: &ldquo;mock-profile-id&rdquo;,
      userId: &ldquo;mock-user-id&rdquo;,
      firstName: firstName || &ldquo;John&rdquo;,
      lastName: lastName || &ldquo;Doe&rdquo;,
      role: &ldquo;YOUTH&rdquo;,
      avatarUrl: avatarUrl || null,
      active: active !== undefined ? active : true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completionPercentage: 50,
    };

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error(&ldquo;Error updating profile:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Failed to update profile&rdquo; },
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
      id: &ldquo;mock-profile-id&rdquo;,
      userId: userId || &ldquo;mock-user-id&rdquo;,
      firstName: firstName || &ldquo;John&rdquo;,
      lastName: lastName || &ldquo;Doe&rdquo;,
      role: &ldquo;YOUTH&rdquo;,
      avatarUrl: avatarUrl || null,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completionPercentage: 10,
    };

    return NextResponse.json(newProfile, { status: 201 });
  } catch (error) {
    console.error(&ldquo;Error creating profile:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Failed to create profile&rdquo; },
      { status: 500 }
    );
  }
}
