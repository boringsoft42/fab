import { useState, useEffect } from "react";
import { BusinessPlanService } from "@/services/businessplan.service";
import { BusinessPlan } from "@/types/api";

export function useBusinessPlans() {
  const [data, setData] = useState<BusinessPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    BusinessPlanService.getAll()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);
  
  return { data, loading, error };
}

export function useBusinessPlan(id: string) {
  const [data, setData] = useState<BusinessPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!id) return;
    BusinessPlanService.getById(id)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);
  
  return { data, loading, error };
}

export function useCreateBusinessPlan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const create = async (data: Partial<BusinessPlan>): Promise<BusinessPlan> => {
    setLoading(true);
    setError(null);
    try {
      return await BusinessPlanService.create(data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };
  
  return { create, loading, error };
}

export function useUpdateBusinessPlan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const update = async (id: string, data: Partial<BusinessPlan>): Promise<BusinessPlan> => {
    setLoading(true);
    setError(null);
    try {
      return await BusinessPlanService.update(id, data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };
  
  return { update, loading, error };
}

export function useDeleteBusinessPlan() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const remove = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      return await BusinessPlanService.delete(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };
  
  return { remove, loading, error };
} 