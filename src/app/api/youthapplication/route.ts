import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

// GET: Listar postulaciones de jóvenes
export async function GET(request: NextRequest) {
    try {
        console.log('🔍 API: Received request for youth applications');
        
        // Get auth token
        const token = request.headers.get('authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json(
                { message: 'Authorization required' },
                { status: 401 }
            );
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        console.log('🔍 API: Authenticated user:', decoded.username);

        // Get youth applications from database
        const youthApplications = await prisma.youthApplication.findMany({
            include: {
                youthProfile: {
                    select: {
                        userId: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                    }
                },
                _count: {
                    select: {
                        messages: true,
                        companyInterests: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        console.log('🔍 API: Found', youthApplications.length, 'youth applications');
        return NextResponse.json(youthApplications);
    } catch (error) {
        console.error('Error in youth applications route:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST: Crear nueva postulación de joven
export async function POST(request: NextRequest) {
    try {
        console.log('🔍 API: Received request to create youth application');

        // Get auth token
        const token = request.headers.get('authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json(
                { message: 'Authorization required' },
                { status: 401 }
            );
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        console.log('🔍 API: Authenticated user:', decoded.username);

        // Get JSON body (not formData)
        const body = await request.json();
        console.log('🔍 API: Request body received:', body);

        const { title, description, isPublic } = body;

        if (!title || !description) {
            return NextResponse.json(
                { message: 'Title and description are required' },
                { status: 400 }
            );
        }

        // Create youth application in database
        const youthApplication = await prisma.youthApplication.create({
            data: {
                title,
                description,
                isPublic: isPublic || false,
                status: 'ACTIVE',
                youthProfileId: decoded.id, // User ID from JWT
            },
            include: {
                youthProfile: {
                    select: {
                        userId: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        role: true,
                    }
                },
                _count: {
                    select: {
                        messages: true,
                        companyInterests: true
                    }
                }
            }
        });

        console.log('🔍 API: Youth application created:', youthApplication.id);
        return NextResponse.json(youthApplication, { status: 201 });
    } catch (error) {
        console.error('Error in create youth application route:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
} 