import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

function verifyToken(token: string) {
  try {
    console.log('🔐 Profile API - Verifying token with JWT_SECRET:', JWT_SECRET.substring(0, 10) + '...');
    console.log('🔐 Profile API - Token to verify:', token.substring(0, 50) + '...');
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    console.log('🔐 Profile API - Token verified successfully for user:', decoded.username);
    return decoded;
  } catch (error) {
    console.error('🔐 Profile API - Token verification failed:', error);
    return null;
  }
}

// GET /api/profile - Get profiles with optional role filtering
export async function GET(request: NextRequest) {
  try {
    console.log('👤 /api/profile - Profile request received');

    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    
    console.log('👤 /api/profile - Fetching profiles with role:', role);

    // Build query based on parameters
    if (role) {
      // First find users with the specified role
      const users = await prisma.user.findMany({
        where: {
          role: role,
          isActive: true
        },
        select: {
          id: true,
          username: true,
          role: true,
          isActive: true
        }
      });

      // Get user IDs to find their profiles
      const userIds = users.map(user => user.id);
      
      // Find profiles for these users
      const profiles = await prisma.profile.findMany({
        where: {
          userId: {
            in: userIds
          }
        }
      });

      // Combine profile data with user data
      const profilesWithUsers = profiles.map(profile => {
        const user = users.find(u => u.id === profile.userId);
        return {
          ...profile,
          user: user
        };
      });

      console.log('👤 /api/profile - Found profiles with role', role, ':', profilesWithUsers.length);
      return NextResponse.json(profilesWithUsers);
    } else {
      // Get current user's profile if no role specified
      const profile = await prisma.profile.findUnique({
        where: { userId: decoded.id }
      });

      if (!profile) {
        return NextResponse.json(
          { error: "Profile not found" },
          { status: 404 }
        );
      }

      // Get user data separately
      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          username: true,
          role: true,
          isActive: true
        }
      });

      const profileWithUser = {
        ...profile,
        user: user
      };

      console.log('👤 /api/profile - Found user profile:', profile.id);
      return NextResponse.json(profileWithUser);
    }

  } catch (error) {
    console.error("Error in /api/profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT /api/profile - Update current user's profile
export async function PUT(request: NextRequest) {
  try {
    console.log('👤 /api/profile PUT - Profile update request received');

    // Get token from Authorization header
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await request.json();

    const updatedProfile = await prisma.profile.update({
      where: { userId: decoded.id },
      data: body,
    });

    console.log('👤 /api/profile PUT - Profile updated:', updatedProfile.id);
    return NextResponse.json({
      message: "Profile updated successfully",
      profile: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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
