import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

// GET: Obtener intereses de empresas en una postulación
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        console.log('🔍 API: Received request for company interests in youth application:', id);

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

        // Check if application exists
        const youthApplication = await prisma.youthApplication.findUnique({
            where: { id },
            select: { id: true }
        });

        if (!youthApplication) {
            return NextResponse.json(
                { message: 'Youth application not found' },
                { status: 404 }
            );
        }

        // Get company interests for this application
        const interests = await prisma.youthApplicationCompanyInterest.findMany({
            where: { applicationId: id },
            include: {
                company: {
                    select: {
                        id: true,
                        name: true,
                        businessSector: true,
                        companySize: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        console.log('🔍 API: Found', interests.length, 'company interests');
        return NextResponse.json(interests);
    } catch (error) {
        console.error('Error in get company interests route:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST: Expresar interés de empresa en una postulación (Not fully implemented - requires Company authentication)
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        console.log('🔍 API: Received request to express company interest in youth application:', id);

        // Get auth token
        const token = request.headers.get('authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json(
                { message: 'Authorization required' },
                { status: 401 }
            );
        }

        // Note: This endpoint requires Company role authentication which is not implemented in this phase
        return NextResponse.json(
            { message: 'Company interest functionality not implemented in this phase' },
            { status: 501 }
        );
    } catch (error) {
        console.error('Error in express company interest route:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
} 