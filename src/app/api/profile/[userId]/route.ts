import { NextRequest, NextResponse } from &ldquo;next/server&rdquo;;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const userId = (await params).userId;

    // Return mock profile data for development
    const mockProfile = {
      id: &ldquo;mock-profile-id&rdquo;,
      userId: userId,
      firstName: &ldquo;John&rdquo;,
      lastName: &ldquo;Doe&rdquo;,
      avatarUrl: null,
      active: true,
      role: &ldquo;YOUTH&rdquo;,
      bio: &ldquo;Mock user bio&rdquo;,
      location: &ldquo;Mock City&rdquo;,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ profile: mockProfile });
  } catch (error) {
    console.error(&ldquo;Error fetching profile:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Failed to fetch profile&rdquo; },
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
      id: &ldquo;mock-profile-id&rdquo;,
      userId: userId,
      firstName: json.firstName || &ldquo;John&rdquo;,
      lastName: json.lastName || &ldquo;Doe&rdquo;,
      avatarUrl: json.avatarUrl || null,
      active: json.active !== undefined ? json.active : true,
      role: &ldquo;YOUTH&rdquo;,
      bio: json.bio || &ldquo;Mock user bio&rdquo;,
      location: json.location || &ldquo;Mock City&rdquo;,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ profile: updatedProfile });
  } catch (error) {
    console.error(&ldquo;Error updating profile:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Failed to update profile&rdquo; },
      { status: 500 }
    );
  }
}
