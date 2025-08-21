"use client";

import { useState, useEffect, useCallback } from 'react';
import { apiCall } from '@/lib/api';

interface Enrollment {
  id: string;
  courseId: string;
  userId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  progress: number;
  enrolledAt: string;
  completedAt?: string;
  course: {
    id: string;
    title: string;
  };
}

export const useEnrollments = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar inscripciones del usuario
  const loadEnrollments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall('/course-enrollments');
      console.log('Enrollments response:', response);
      return response || [];
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar inscripciones';
      setError(errorMessage);
      console.error('Error loading enrollments:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Verificar si el usuario está inscrito en un curso específico
  const isEnrolledInCourse = useCallback((courseId: string): Enrollment | null => {
    return enrollments.find(enrollment => enrollment.courseId === courseId) || null;
  }, [enrollments]);

  // Obtener el progreso de un curso específico
  const getCourseProgress = useCallback((courseId: string): number => {
    const enrollment = enrollments.find(enrollment => enrollment.courseId === courseId);
    return enrollment?.progress || 0;
  }, [enrollments]);

  // Obtener el estado de un curso específico
  const getCourseStatus = useCallback((courseId: string): string | null => {
    const enrollment = enrollments.find(enrollment => enrollment.courseId === courseId);
    return enrollment?.status || null;
  }, [enrollments]);

  // Cargar inscripciones al inicializar
  useEffect(() => {
    const fetchEnrollments = async () => {
      const data = await loadEnrollments();
      setEnrollments(data);
    };
    
    fetchEnrollments();
  }, [loadEnrollments]);

  return {
    enrollments,
    loading,
    error,
    loadEnrollments,
    isEnrolledInCourse,
    getCourseProgress,
    getCourseStatus,
    setError
  };
};
