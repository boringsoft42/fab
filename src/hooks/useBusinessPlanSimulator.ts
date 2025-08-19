import { useState, useEffect } from 'react';
import { useAuthContext } from './use-auth';
import { API_BASE, getAuthHeaders } from '@/lib/api';

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
  marketingStrategy?: string; // Para compatibilidad con backend
  marketingPlan?: string; // Para compatibilidad con frontend
  operationalPlan: string;
  managementTeam: string;
  financialProjections?: FinancialProjections; // Opcional para compatibilidad
  initialInvestment?: string; // Para compatibilidad con backend
  monthlyExpenses?: string; // Para compatibilidad con backend
  breakEvenPoint?: number; // Para compatibilidad con backend
  revenueStreams?: string[]; // Para compatibilidad con backend
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

export const useBusinessPlanSimulator = () => {
  const { user } = useAuthContext();
  const [plans, setPlans] = useState<BusinessPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveSimulatorData = async (
    data: SimulatorData,
    options?: { silent?: boolean }
  ): Promise<{ success: boolean; data?: SimulatorResponse['data']; error?: string }> => {
    try {
      setSaving(true);
      setError(null);

      const response = await fetch(`${API_BASE}/businessplan/simulator`, {
        method: 'POST',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        // Update plans list solo si no es guardado silencioso
        if (!options?.silent) {
          await fetchPlans();
        }
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error || 'Error al guardar el plan' };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de conexión';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setSaving(false);
    }
  };

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/businessplan`, {
        headers: getAuthHeaders()
      });
      const result = await response.json();
      
      if (response.ok) {
        // El backend devuelve el objeto directamente, no dentro de result.data
        // Si result es un array, usarlo directamente
        // Si result es un objeto, convertirlo en array
        const plansArray = Array.isArray(result) ? result : [result];
        setPlans(plansArray);
      } else {
        setError(result.error || 'Error al cargar los planes');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de conexión';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getPlan = async (planId: string): Promise<{ success: boolean; data?: BusinessPlan; error?: string }> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/businessplan/${planId}`, {
        headers: getAuthHeaders()
      });
      const result = await response.json();
      
      if (response.ok) {
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error || 'Error al obtener el plan' };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de conexión';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const getPlanByEntrepreneurship = async (entrepreneurshipId: string): Promise<{ success: boolean; data?: BusinessPlan; error?: string }> => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/businessplan/entrepreneurship/${entrepreneurshipId}`, {
        headers: getAuthHeaders()
      });
      const result = await response.json();
      
      if (response.ok) {
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error || 'Error al obtener el plan' };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de conexión';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const updatePlan = async (planId: string, data: Partial<SimulatorData>): Promise<{ success: boolean; data?: BusinessPlan; error?: string }> => {
    try {
      setSaving(true);
      const response = await fetch(`${API_BASE}/businessplan/${planId}`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        await fetchPlans(); // Refresh plans list
        return { success: true, data: result.data };
      } else {
        return { success: false, error: result.error || 'Error al actualizar el plan' };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de conexión';
      return { success: false, error: errorMessage };
    } finally {
      setSaving(false);
    }
  };

  const deletePlan = async (planId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setSaving(true);
      const response = await fetch(`${API_BASE}/businessplan/${planId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      const result = await response.json();
      
      if (response.ok) {
        await fetchPlans(); // Refresh plans list
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Error al eliminar el plan' };
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error de conexión';
      return { success: false, error: errorMessage };
    } finally {
      setSaving(false);
    }
  };

  // Auto-save functionality
  const autoSave = async (data: SimulatorData): Promise<void> => {
    try {
      await saveSimulatorData(data);
    } catch (err) {
      console.error('Auto-save failed:', err);
    }
  };

  // Calculate completion percentage locally
  const calculateCompletion = (data: Partial<SimulatorData>): number => {
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
  };

  // Analyze triple impact locally
  const analyzeTripleImpact = (assessment: TripleImpactAssessment): ImpactAnalysis => {
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
  };

  useEffect(() => {
    if (user) {
      fetchPlans();
    }
  }, [user]);

  return {
    plans,
    loading,
    saving,
    error,
    saveSimulatorData,
    fetchPlans,
    getPlan,
    getPlanByEntrepreneurship,
    updatePlan,
    deletePlan,
    autoSave,
    calculateCompletion,
    analyzeTripleImpact,
    refetch: fetchPlans
  };
};
