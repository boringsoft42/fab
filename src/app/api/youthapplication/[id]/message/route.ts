import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

// GET: Obtener mensajes de una postulación
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        console.log('🔍 API: Received request for youth application messages:', id);

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

        // Get messages for this application
        const messages = await prisma.youthApplicationMessage.findMany({
            where: { applicationId: id },
            orderBy: { createdAt: 'asc' }
        });

        console.log('🔍 API: Found', messages.length, 'messages');
        return NextResponse.json(messages);
    } catch (error) {
        console.error('Error in get youth application messages route:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST: Enviar mensaje en una postulación
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        console.log('🔍 API: Received request to send message in youth application:', id);

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

        const body = await request.json();
        console.log('🔍 API: Request body:', body);

        const { content, senderType } = body;

        if (!content || !senderType) {
            return NextResponse.json(
                { message: 'Content and senderType are required' },
                { status: 400 }
            );
        }

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

        // Create message
        const message = await prisma.youthApplicationMessage.create({
            data: {
                applicationId: id,
                senderId: decoded.id,
                senderType,
                content,
                messageType: 'TEXT',
                status: 'SENT'
            }
        });

        console.log('🔍 API: Message created:', message.id);
        return NextResponse.json(message, { status: 201 });
    } catch (error) {
        console.error('Error in send youth application message route:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
} 