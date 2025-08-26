import { NextRequest, NextResponse } from "next/server";
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

// GET /api/events - List events
export async function GET(request: NextRequest) {
    try {
        console.log('🔍 API: Received request for events');
        
        const { searchParams } = new URL(request.url);
        const municipality = searchParams.get("municipality");
        const category = searchParams.get("category");
        const type = searchParams.get("type");
        const status = searchParams.get("status");
        const featured = searchParams.get("featured");
        const createdBy = searchParams.get("createdBy");

        // Build filter conditions
        const where: any = {};

        if (municipality) {
            // Filter by municipality through creator's profile
            where.creator = {
                municipality: municipality
            };
        }
        
        if (category) where.category = category;
        if (type) where.type = type;
        if (status) where.status = status;
        if (featured !== null) where.featured = featured === 'true';
        if (createdBy) where.createdBy = createdBy;

        // Default to showing only published events for public access
        // Unless specifically requesting other statuses
        if (!status && !createdBy) {
            where.status = 'PUBLISHED';
        }

        // Get events from database
        const events = await prisma.event.findMany({
            where,
            include: {
                creator: {
                    select: {
                        userId: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        municipality: true,
                        institutionName: true,
                        companyName: true,
                        avatarUrl: true,
                    }
                },
                _count: {
                    select: {
                        attendees: true
                    }
                }
            },
            orderBy: [
                { featured: 'desc' },
                { date: 'asc' }
            ]
        });

        console.log('🔍 API: Found', events.length, 'events');
        return NextResponse.json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json(
            { error: "Error al obtener eventos" },
            { status: 500 }
        );
    }
}

// POST /api/events - Create new event
export async function POST(request: NextRequest) {
    try {
        console.log('🔍 API: Received request to create event');

        // Get auth token
        const token = request.headers.get('authorization')?.replace('Bearer ', '');
        if (!token) {
            return NextResponse.json(
                { error: 'Authorization required' },
                { status: 401 }
            );
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        console.log('🔍 API: Authenticated user:', decoded.username);

        // Check if it's FormData or JSON
        const contentType = request.headers.get('content-type') || '';
        let eventData: any = {};

        if (contentType.includes('multipart/form-data')) {
            // Handle FormData
            const formData = await request.formData();

            // Extract all form fields
            eventData = {
                title: formData.get('title') as string,
                organizer: formData.get('organizer') as string,
                description: formData.get('description') as string,
                date: formData.get('date') as string,
                time: formData.get('time') as string,
                type: formData.get('type') as string,
                category: formData.get('category') as string,
                location: formData.get('location') as string,
                maxCapacity: formData.get('maxCapacity') ? parseInt(formData.get('maxCapacity') as string) : undefined,
                price: formData.get('price') ? parseFloat(formData.get('price') as string) : 0,
                status: formData.get('status') as string || 'DRAFT',
                featured: formData.get('featured') === 'true',
                registrationDeadline: formData.get('registrationDeadline') as string,
                imageUrl: formData.get('imageUrl') as string,
            };

            // Handle arrays (tags, requirements, agenda, speakers)
            const tags = formData.get('tags') as string;
            if (tags) {
                try {
                    eventData.tags = JSON.parse(tags);
                } catch {
                    eventData.tags = [];
                }
            } else {
                eventData.tags = [];
            }

            const requirements = formData.get('requirements') as string;
            if (requirements) {
                try {
                    eventData.requirements = JSON.parse(requirements);
                } catch {
                    eventData.requirements = [];
                }
            } else {
                eventData.requirements = [];
            }

            const agenda = formData.get('agenda') as string;
            if (agenda) {
                try {
                    eventData.agenda = JSON.parse(agenda);
                } catch {
                    eventData.agenda = [];
                }
            } else {
                eventData.agenda = [];
            }

            const speakers = formData.get('speakers') as string;
            if (speakers) {
                try {
                    eventData.speakers = JSON.parse(speakers);
                } catch {
                    eventData.speakers = [];
                }
            } else {
                eventData.speakers = [];
            }

            // Handle image file if present
            const imageFile = formData.get('image') as File;
            if (imageFile) {
                // In a real implementation, you would upload the file to a storage service
                // For now, we'll just store a placeholder URL
                eventData.imageUrl = `/uploads/events/${Date.now()}-${imageFile.name}`;
            }
        } else {
            // Handle JSON
            eventData = await request.json();
        }

        console.log('🔍 API: Request body:', eventData);

        // Validate required fields
        if (!eventData.title || !eventData.organizer || !eventData.description || !eventData.date || !eventData.location) {
            return NextResponse.json(
                { error: 'Faltan campos requeridos: title, organizer, description, date, location' },
                { status: 400 }
            );
        }

        // Create event
        const event = await prisma.event.create({
            data: {
                title: eventData.title.trim(),
                organizer: eventData.organizer.trim(),
                description: eventData.description.trim(),
                date: new Date(eventData.date),
                time: eventData.time || "Por confirmar",
                type: eventData.type || 'IN_PERSON',
                category: eventData.category || 'NETWORKING',
                location: eventData.location.trim(),
                maxCapacity: eventData.maxCapacity,
                price: eventData.price || 0,
                status: eventData.status || 'DRAFT',
                imageUrl: eventData.imageUrl,
                tags: eventData.tags || [],
                requirements: eventData.requirements || [],
                agenda: eventData.agenda || [],
                speakers: eventData.speakers || [],
                featured: eventData.featured || false,
                registrationDeadline: eventData.registrationDeadline ? new Date(eventData.registrationDeadline) : null,
                createdBy: decoded.id,
                viewsCount: 0,
                attendeesCount: 0,
                attendanceRate: 0,
                publishedAt: eventData.status === 'PUBLISHED' ? new Date() : null,
            },
            include: {
                creator: {
                    select: {
                        userId: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        municipality: true,
                        institutionName: true,
                        companyName: true,
                        avatarUrl: true,
                    }
                },
                _count: {
                    select: {
                        attendees: true
                    }
                }
            }
        });

        console.log('🔍 API: Event created:', event.id);
        return NextResponse.json(event, { status: 201 });
    } catch (error) {
        console.error("Error creating event:", error);
        return NextResponse.json(
            { error: "Error al crear evento" },
            { status: 500 }
        );
    }
}