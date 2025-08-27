import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';

// Mock data for business plans
const getMockBusinessPlans = () => [
  {
    id: '1',
    userId: 'user_123',
    title: 'Mi Startup Digital',
    description: 'Una plataforma de comercio electrónico para productos artesanales',
    industry: 'E-commerce',
    businessModel: 'B2C',
    targetMarket: 'Millennials y Gen Z',
    stage: 'IDEA',
    fundingNeeded: 50000,
    fundingRaised: 0,
    teamSize: 2,
    executiveSummary: 'Plataforma que conecta artesanos locales con consumidores urbanos...',
    marketAnalysis: 'El mercado de productos artesanales está valorado en...',
    competitiveAnalysis: 'Nuestros principales competidores son...',
    marketingStrategy: 'Marketing digital enfocado en redes sociales...',
    operationsStrategy: 'Modelo de fulfillment híbrido...',
    managementTeam: 'Equipo fundador con experiencia en...',
    financialProjections: 'Proyecciones de crecimiento del 200% anual...',
    fundingRequest: 'Buscamos $50,000 para desarrollo inicial...',
    riskAnalysis: 'Principales riesgos identificados...',
    milestones: 'Q1: MVP, Q2: Beta, Q3: Lanzamiento...',
    appendix: 'Documentos adicionales y estudios de mercado...',
    isPublic: false,
    status: 'DRAFT',
    version: '1.0',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    userId: 'user_123',
    title: 'EcoTech Solutions',
    description: 'Soluciones tecnológicas para la sostenibilidad ambiental',
    industry: 'GreenTech',
    businessModel: 'B2B',
    targetMarket: 'Empresas medianas y grandes',
    stage: 'PROTOTYPE',
    fundingNeeded: 150000,
    fundingRaised: 25000,
    teamSize: 5,
    executiveSummary: 'Desarrollamos software para optimizar el consumo energético...',
    marketAnalysis: 'El mercado de tecnologías verdes crece 15% anual...',
    competitiveAnalysis: 'Diferenciación por IA y machine learning...',
    marketingStrategy: 'Ventas directas B2B y partnerships estratégicos...',
    operationsStrategy: 'Modelo SaaS con implementación personalizada...',
    managementTeam: 'Equipo con background en ingeniería y sustentabilidad...',
    financialProjections: 'Break-even en el mes 18...',
    fundingRequest: 'Serie A de $150k para expansión y desarrollo...',
    riskAnalysis: 'Riesgo tecnológico y de adopción del mercado...',
    milestones: 'MVP listo, 3 clientes piloto confirmados...',
    appendix: 'Estudios técnicos y validación de mercado...',
    isPublic: true,
    status: 'ACTIVE',
    version: '2.1',
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z'
  }
];

// GET /api/businessplan - Get business plans for authenticated user
export async function GET(request: NextRequest) {
  try {
    console.log('💼 API: Received request for business plans');
    
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
    console.log('💼 API: Authenticated user:', decoded.username);

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const isPublic = searchParams.get('isPublic');
    const stage = searchParams.get('stage');

    // Get business plans from database through entrepreneurship relationship
    const businessPlans = await prisma.businessPlan.findMany({
      where: {
        entrepreneurship: {
          ownerId: decoded.id
        }
      },
      include: {
        entrepreneurship: {
          select: {
            id: true,
            name: true,
            description: true,
            category: true,
            businessStage: true,
            municipality: true,
            isActive: true,
            createdAt: true
          }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });

    // If no business plans found in database, return mock data
    if (businessPlans.length === 0) {
      console.log('💼 API: No business plans found in database, using mock data');
      let mockPlans = getMockBusinessPlans();

      // Apply filters to mock data
      if (status) {
        mockPlans = mockPlans.filter(bp => bp.status === status);
      }
      if (isPublic !== null) {
        const isPublicBool = isPublic === 'true';
        mockPlans = mockPlans.filter(bp => bp.isPublic === isPublicBool);
      }
      if (stage) {
        mockPlans = mockPlans.filter(bp => bp.stage === stage);
      }

      console.log('💼 API: Returning', mockPlans.length, 'mock business plans');
      return NextResponse.json({ success: true, data: mockPlans });
    }

    console.log('💼 API: Found', businessPlans.length, 'business plans');
    return NextResponse.json({ success: true, data: businessPlans });
  } catch (error) {
    console.error('Error in business plans route:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/businessplan - Create new business plan
export async function POST(request: NextRequest) {
  try {
    console.log('💼 API: Received request to create business plan');

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
    console.log('💼 API: Authenticated user:', decoded.username);

    const body = await request.json();
    const {
      title,
      description,
      industry,
      businessModel,
      targetMarket,
      stage = 'IDEA',
      fundingNeeded = 0,
      teamSize = 1,
      executiveSummary = '',
      marketAnalysis = '',
      competitiveAnalysis = '',
      marketingStrategy = '',
      operationsStrategy = '',
      managementTeam = '',
      financialProjections = '',
      fundingRequest = '',
      riskAnalysis = '',
      milestones = '',
      appendix = '',
      isPublic = false,
      status = 'DRAFT'
    } = body;

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // For now, return mock business plan
    const mockBusinessPlan = {
      id: 'bp_' + Date.now(),
      userId: decoded.id,
      title,
      description: description || '',
      industry: industry || '',
      businessModel: businessModel || '',
      targetMarket: targetMarket || '',
      stage,
      fundingNeeded,
      fundingRaised: 0,
      teamSize,
      executiveSummary,
      marketAnalysis,
      competitiveAnalysis,
      marketingStrategy,
      operationsStrategy,
      managementTeam,
      financialProjections,
      fundingRequest,
      riskAnalysis,
      milestones,
      appendix,
      isPublic,
      status,
      version: '1.0',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('💼 API: Mock business plan created:', mockBusinessPlan.id);
    return NextResponse.json(mockBusinessPlan, { status: 201 });
  } catch (error) {
    console.error('Error creating business plan:', error);
    return NextResponse.json(
      { error: 'Error al crear plan de negocios' },
      { status: 500 }
    );
  }
}