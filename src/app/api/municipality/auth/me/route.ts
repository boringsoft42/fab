import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (error) {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    console.log("🏛️ GET /api/municipality/auth/me - Starting request");

    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log("❌ GET /api/municipality/auth/me - No valid authorization header");
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded) {
      console.log("❌ GET /api/municipality/auth/me - Invalid token");
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    console.log("🏛️ GET /api/municipality/auth/me - Token verified, user ID:", decoded.id);

    // Get the user and check if they are a municipality user
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      console.log("❌ GET /api/municipality/auth/me - User not found");
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.role !== 'MUNICIPAL_GOVERNMENTS') {
      console.log("❌ GET /api/municipality/auth/me - User is not a municipality user");
      return NextResponse.json(
        { error: 'Not authorized as municipality user' },
        { status: 403 }
      );
    }

    // Get profile information
    let profile = null;
    try {
      profile = await prisma.profile.findUnique({
        where: { userId: user.id },
      });
    } catch (error) {
      console.log('No profile found for municipality user:', user.id);
    }

    // For municipal government users, we'll create/return mock municipality data
    // In a real scenario, you'd have a Municipality table linked to the user
    const municipalityData = {
      municipality: {
        id: 'mock-municipality-' + user.id,
        name: profile?.municipality || 'Municipio de ' + user.username,
        department: profile?.department || 'Cochabamba',
        description: 'Gobierno Municipal comprometido con el desarrollo de la comunidad',
        address: profile?.address || 'Dirección municipal',
        phone: profile?.phone || '+591-4-1234567',
        email: profile?.email || user.username + '@municipio.gov.bo',
        website: 'www.' + user.username + '.municipio.gov.bo',
        mayor: profile?.firstName && profile?.lastName 
          ? `${profile.firstName} ${profile.lastName}` 
          : 'Alcalde Municipal',
        population: 50000,
        area: 150.5,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        isActive: user.isActive
      },
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
        firstName: profile?.firstName || '',
        lastName: profile?.lastName || '',
        email: profile?.email || '',
        phone: profile?.phone || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    };

    console.log("✅ GET /api/municipality/auth/me - Returning municipality data for:", user.username);
    return NextResponse.json(municipalityData);

  } catch (error) {
    console.error("❌ GET /api/municipality/auth/me - Error:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
