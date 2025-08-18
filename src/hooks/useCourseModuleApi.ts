import { useState, useEffect } from "react";
import { CourseModuleService } from "@/services/coursemodule.service";
import { CourseModule } from "@/types/api";

export function useCourseModules() {
  const [data, setData] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    CourseModuleService.getAll()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);
  
  return { data, loading, error };
}

export function useCourseModule(id: string) {
  const [data, setData] = useState<CourseModule | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!id) return;
    CourseModuleService.getById(id)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);
  
  return { data, loading, error };
}

export function useCreateCourseModule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const create = async (data: Partial<CourseModule>): Promise<CourseModule> => {
    setLoading(true);
    setError(null);
    try {
      return await CourseModuleService.create(data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };
  
  return { create, loading, error };
}

export function useUpdateCourseModule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const update = async (id: string, data: Partial<CourseModule>): Promise<CourseModule> => {
    setLoading(true);
    setError(null);
    try {
      return await CourseModuleService.update(id, data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };
  
  return { update, loading, error };
}

export function useDeleteCourseModule() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const remove = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      return await CourseModuleService.delete(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };
  
  return { remove, loading, error };
}

// Hook específico para módulos de un curso
export function useCourseModulesByCourse(courseId: string) {
  const [data, setData] = useState<CourseModule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!courseId) return;
    CourseModuleService.getModulesByCourse(courseId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [courseId]);
  
  return { data, loading, error };
} 