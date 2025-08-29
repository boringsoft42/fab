import { useState, useEffect } from "react";
import { EnrollmentService } from "@/services/enrollment.service";
import { Enrollment } from "@/types/courses";

export function useEnrollments() {
  const [data, setData] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    EnrollmentService.getAll()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);
  
  return { data, loading, error };
}

export function useEnrollment(id: string) {
  const [data, setData] = useState<Enrollment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!id) return;
    EnrollmentService.getById(id)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);
  
  return { data, loading, error };
}

export function useCreateEnrollment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const create = async (data: Partial<Enrollment>): Promise<Enrollment> => {
    setLoading(true);
    setError(null);
    try {
      return await EnrollmentService.create(data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };
  
  return { create, loading, error };
}

export function useUpdateEnrollment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const update = async (id: string, data: Partial<Enrollment>): Promise<Enrollment> => {
    setLoading(true);
    setError(null);
    try {
      return await EnrollmentService.update(id, data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };
  
  return { update, loading, error };
}

export function useDeleteEnrollment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const remove = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      return await EnrollmentService.delete(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };
  
  return { remove, loading, error };
}

// Hooks específicos para enrollments
export function useEnrollInCourse() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const enroll = async (courseId: string): Promise<Enrollment> => {
    setLoading(true);
    setError(null);
    try {
      return await EnrollmentService.enrollInCourse(courseId);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };
  
  return { enroll, loading, error };
}

export function useUserEnrollments(userId: string) {
  const [data, setData] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!userId) return;
    EnrollmentService.getEnrollmentsByUser(userId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);
  
  return { data, loading, error };
}

export function useCourseEnrollments(courseId: string) {
  const [data, setData] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!courseId) return;
    EnrollmentService.getEnrollmentsByCourse(courseId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [courseId]);
  
  return { data, loading, error };
} 