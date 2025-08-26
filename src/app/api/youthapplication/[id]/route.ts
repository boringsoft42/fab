import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

// GET: Obtener postulación específica
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        console.log('🔍 API: Received request for youth application:', id);

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

        // Get youth application from database
        const youthApplication = await prisma.youthApplication.findUnique({
            where: { id },
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

        if (!youthApplication) {
            return NextResponse.json(
                { message: 'Youth application not found' },
                { status: 404 }
            );
        }

        console.log('🔍 API: Youth application found:', youthApplication.id);
        return NextResponse.json(youthApplication);
    } catch (error) {
        console.error('Error in get youth application route:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT: Actualizar postulación (Not implemented in this phase)
// export async function PUT(...) { ... }

// DELETE: Eliminar postulación
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        console.log('🔍 API: Received request to delete youth application:', id);

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

        // Check if application exists and user has permission
        const youthApplication = await prisma.youthApplication.findUnique({
            where: { id },
            select: { id: true, youthProfileId: true }
        });

        if (!youthApplication) {
            return NextResponse.json(
                { message: 'Youth application not found' },
                { status: 404 }
            );
        }

        // Only allow the creator to delete their application
        if (youthApplication.youthProfileId !== decoded.id) {
            return NextResponse.json(
                { message: 'Permission denied' },
                { status: 403 }
            );
        }

        // Delete youth application
        await prisma.youthApplication.delete({
            where: { id }
        });

        console.log('🔍 API: Youth application deleted successfully:', id);
        return NextResponse.json({ message: 'Youth application deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error in delete youth application route:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
} 