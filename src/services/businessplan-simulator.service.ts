import { apiCall, API_BASE } from '@/lib/api';

// Types
interface TripleImpactAssessment {
  problemSolved: string;
  beneficiaries: string;
  resourcesUsed: string;
  communityInvolvement: string;
  longTermImpact: string;
}

interface FinancialProjections {
  startupCosts: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
  breakEvenMonth: number;
  revenueStreams: string[];
}

interface BusinessModelCanvas {
  keyPartners: string;
  keyActivities: string;
  valuePropositions: string;
  customerRelationships: string;
  customerSegments: string;
  keyResources: string;
  channels: string;
  costStructure: string;
  revenueStreams: string;
}

interface FinancialCalculator {
  initialInvestment: number;
  monthlyRevenue: number;
  fixedCosts: number;
  variableCosts: number;
  projectionMonths: number;
  cashFlowProjection: Array<{
    month: number;
    revenue: number;
    expenses: number;
    profit: number;
    cumulative: number;
  }>;
}

interface EntrepreneurshipData {
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  businessStage: 'IDEA' | 'STARTUP' | 'GROWING' | 'ESTABLISHED';
  municipality: string;
  department?: string;
}

interface SimulatorData {
  entrepreneurshipId?: string;
  entrepreneurshipData?: EntrepreneurshipData;
  tripleImpactAssessment: TripleImpactAssessment;
  executiveSummary: string;
  businessDescription: string;
  marketAnalysis: string;
  competitiveAnalysis: string;
  marketingPlan: string;
  operationalPlan: string;
  managementTeam: string;
  financialProjections: FinancialProjections;
  riskAnalysis: string;
  businessModelCanvas?: BusinessModelCanvas;
  financialCalculator?: FinancialCalculator;
  currentStep: number;
  completionPercentage?: number;
  isCompleted?: boolean;
}

interface ImpactAnalysis {
  economic: boolean;
  social: boolean;
  environmental: boolean;
  impactScore: number;
  recommendations: string[];
}

interface SimulatorResponse {
  success: boolean;
  data: {
    businessPlanId: string;
    entrepreneurshipId: string;
    message: string;
    completionPercentage: number;
    nextRecommendedStep?: number;
    impactAnalysis: ImpactAnalysis;
  };
}

interface BusinessPlan {
  id: string;
  entrepreneurshipId: string;
  executiveSummary?: string;
  businessDescription?: string;
  marketAnalysis?: string;
  competitiveAnalysis?: string;
  marketingStrategy?: string;
  operationalPlan?: string;
  managementTeam?: string;
  riskAnalysis?: string;
  initialInvestment?: number;
  monthlyExpenses?: number;
  breakEvenPoint?: number;
  businessModelCanvas?: string;
  revenueProjection?: string;
  isCompleted: boolean;
  lastSection?: string;
  completionPercentage: number;
  entrepreneurship?: {
    id: string;
    name: string;
    description: string;
    category: string;
    businessStage: string;
    municipality: string;
    isActive: boolean;
    createdAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export class BusinessPlanSimulatorService {
  /**
   * Save simulator data to the backend
   */
  static async saveSimulatorData(data: SimulatorData): Promise<SimulatorResponse> {
    return await apiCall('/businessplan/simulator', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  /**
   * Get all business plans for the current user
   */
  static async getMyPlans(): Promise<BusinessPlan[]> {
    return await apiCall('/businessplan');
  }

  /**
   * Get a specific business plan by ID
   */
  static async getPlan(planId: string): Promise<BusinessPlan> {
    return await apiCall(`/businessplan/${planId}`);
  }

  /**
   * Get business plan by entrepreneurship ID
   */
  static async getPlanByEntrepreneurship(entrepreneurshipId: string): Promise<BusinessPlan> {
    return await apiCall(`/businessplan/entrepreneurship/${entrepreneurshipId}`);
  }

  /**
   * Update an existing business plan
   */
  static async updatePlan(planId: string, data: Partial<SimulatorData>): Promise<BusinessPlan> {
    return await apiCall(`/businessplan/${planId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  /**
   * Delete a business plan
   */
  static async deletePlan(planId: string): Promise<void> {
    await apiCall(`/businessplan/${planId}`, {
      method: 'DELETE'
    });
  }

  /**
   * Calculate completion percentage locally
   */
  static calculateCompletion(data: Partial<SimulatorData>): number {
    const sections = [
      'tripleImpactAssessment',
      'executiveSummary',
      'businessDescription',
      'marketAnalysis',
      'competitiveAnalysis',
      'marketingPlan',
      'operationalPlan',
      'managementTeam',
      'financialProjections',
      'riskAnalysis',
      'businessModelCanvas',
      'financialCalculator'
    ];

    let completedSections = 0;

    sections.forEach(section => {
      if (data[section as keyof SimulatorData]) {
        const sectionData = data[section as keyof SimulatorData];
        if (typeof sectionData === 'object') {
          const hasContent = Object.values(sectionData).some(value => 
            value && (typeof value === 'string' ? value.trim().length > 0 : true)
          );
          if (hasContent) completedSections++;
        } else if (typeof sectionData === 'string' && sectionData.trim().length > 0) {
          completedSections++;
        }
      }
    });

    return Math.round((completedSections / sections.length) * 100);
  }

  /**
   * Analyze triple impact locally
   */
  static analyzeTripleImpact(assessment: TripleImpactAssessment): ImpactAnalysis {
    const text = JSON.stringify(assessment).toLowerCase();
    
    const economic = text.includes('trabajo') || 
                     text.includes('empleo') || 
                     text.includes('ingresos') || 
                     text.includes('finanzas') || 
                     text.includes('rentabilidad') ||
                     text.includes('económico');

    const social = text.includes('comunidad') || 
                   text.includes('personas') || 
                   text.includes('sociedad') || 
                   text.includes('familias') || 
                   text.includes('beneficiarios') ||
                   text.includes('social');

    const environmental = text.includes('sostenible') || 
                          text.includes('medio ambiente') || 
                          text.includes('verde') || 
                          text.includes('recicl') || 
                          text.includes('ambiental') ||
                          text.includes('ecológico');

    const impactScore = [economic, social, environmental].filter(Boolean).length * 33.33;
    
    const recommendations = [];
    if (!economic) recommendations.push('Analiza el impacto económico de tu negocio');
    if (!social) recommendations.push('Considera el impacto social en la comunidad');
    if (!environmental) recommendations.push('Evalúa el impacto ambiental de tu negocio');

    return {
      economic,
      social,
      environmental,
      impactScore: Math.round(impactScore),
      recommendations
    };
  }

  /**
   * Get next recommended step
   */
  static getNextRecommendedStep(data: Partial<SimulatorData>): number {
    const sections = [
      'tripleImpactAssessment',
      'executiveSummary',
      'businessDescription',
      'marketAnalysis',
      'competitiveAnalysis',
      'marketingPlan',
      'operationalPlan',
      'managementTeam',
      'financialProjections',
      'riskAnalysis'
    ];

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      if (!data[section as keyof SimulatorData] || 
          (typeof data[section as keyof SimulatorData] === 'string' && 
           (data[section as keyof SimulatorData] as string).trim().length === 0) ||
          (typeof data[section as keyof SimulatorData] === 'object' && 
           !Object.values(data[section as keyof SimulatorData] as object).some(v => 
             v && (typeof v === 'string' ? v.trim().length > 0 : true)
           ))) {
        return i;
      }
    }
    return sections.length - 1; // All sections completed
  }

  /**
   * Auto-save functionality with debouncing
   */
  static createAutoSave(debounceMs: number = 2000) {
    let timeoutId: NodeJS.Timeout | null = null;
    
    return (data: SimulatorData) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(async () => {
        try {
          await this.saveSimulatorData(data);
        } catch (error) {
          console.error('Auto-save failed:', error);
        }
      }, debounceMs);
    };
  }
}

// Export types for use in components
export type {
  SimulatorData,
  BusinessPlan,
  ImpactAnalysis,
  TripleImpactAssessment,
  FinancialProjections,
  BusinessModelCanvas,
  FinancialCalculator,
  EntrepreneurshipData,
  SimulatorResponse
};
