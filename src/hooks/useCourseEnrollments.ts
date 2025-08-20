import { useState, useEffect, useCallback } from 'react';
import { apiCall } from '@/lib/api';

export interface CourseEnrollment {
  id: string;
  courseId: string;
  userId: string;
  status: 'ENROLLED' | 'IN_PROGRESS' | 'COMPLETED' | 'DROPPED' | 'SUSPENDED';
  progress: number;
  enrolledAt: string;
  completedAt?: string;
  course: {
    id: string;
    title: string;
    description: string;
    thumbnail?: string;
    duration: number;
    level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    category: string;
    instructor?: {
      id: string;
      name: string;
      avatar?: string;
    } | null;
    organization?: {
      id: string;
      name: string;
    } | null;
    totalLessons: number;
    totalQuizzes: number;
    isActive: boolean;
    studentCount?: number;
    rating?: number;
  };
}

export const useCourseEnrollments = () => {
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 useCourseEnrollments: Fetching enrollments...');
      const data = await apiCall('/course-enrollments');
      console.log('🔍 useCourseEnrollments: Response received:', data);
      setEnrollments(data.enrollments || data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar inscripciones');
      console.error('Error fetching enrollments:', err);
    } finally {
      setLoading(false);
    }
  };

  const enrollInCourse = async (courseId: string) => {
    try {
      const data = await apiCall('/course-enrollments', {
        method: 'POST',
        body: JSON.stringify({
          courseId,
          enrollmentDate: new Date().toISOString()
        })
      });
      
      // Actualizar la lista de inscripciones
      await fetchEnrollments();
      
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error al inscribirse en el curso');
    }
  };

  const updateProgress = async (enrollmentId: string, progress: number) => {
    try {
      const data = await apiCall(`/course-enrollments/${enrollmentId}`, {
        method: 'PUT',
        body: JSON.stringify({ progress })
      });
      
      // Actualizar la lista de inscripciones
      await fetchEnrollments();
      
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error al actualizar progreso');
    }
  };

  const updateEnrollmentProgress = async (enrollmentId: string, progressData: any) => {
    try {
      const data = await apiCall(`/course-enrollments/${enrollmentId}`, {
        method: 'PUT',
        body: JSON.stringify(progressData)
      });
      
      // Actualizar la lista de inscripciones
      await fetchEnrollments();
      
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error al actualizar progreso de inscripción');
    }
  };

  const completeCourse = async (enrollmentId: string) => {
    try {
      const data = await apiCall(`/course-enrollments/${enrollmentId}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: 'COMPLETED',
          progress: 100,
          completedAt: new Date().toISOString()
        })
      });
      
      // Actualizar la lista de inscripciones
      await fetchEnrollments();
      
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error al completar el curso');
    }
  };

  const dropCourse = async (enrollmentId: string) => {
    try {
      const data = await apiCall(`/course-enrollments/${enrollmentId}`, {
        method: 'PUT',
        body: JSON.stringify({
          status: 'DROPPED'
        })
      });
      
      // Actualizar la lista de inscripciones
      await fetchEnrollments();
      
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Error al abandonar el curso');
    }
  };

  const getEnrollmentById = useCallback(async (enrollmentId: string): Promise<CourseEnrollment | null> => {
    try {
      console.log('🔍 useCourseEnrollments: Fetching enrollment with ID:', enrollmentId);
      
      // Solicitar datos completos incluyendo resources y quizzes
      const data = await apiCall(`/course-enrollments/${enrollmentId}?include=course.modules.lessons.resources,course.modules.lessons.quizzes`);
      
      console.log('🔍 useCourseEnrollments: Enrollment data received:', data);
      return data.enrollment || data;
    } catch (err) {
      console.error('Error fetching enrollment by ID:', err);
      return null;
    }
  }, []);

  // Solo cargar enrollments automáticamente para la página de "Mis Cursos"
  useEffect(() => {
    fetchEnrollments();
  }, []);

  const getEnrollmentForLearning = useCallback(async (enrollmentId: string): Promise<any | null> => {
    try {
      console.log('🔍 useCourseEnrollments: Fetching enrollment for learning with ID:', enrollmentId);
      
      // Intentar varios endpoints posibles
      const endpoints = [
        `/course-enrollments/${enrollmentId}/learning`, // Endpoint específico para aprendizaje
        `/course-enrollments/${enrollmentId}?include=resources,quizzes`, // Con parámetro include
        `/course-enrollments/${enrollmentId}/full`, // Endpoint full
        `/course-enrollments/${enrollmentId}` // Endpoint normal como fallback
      ];
      
      for (const endpoint of endpoints) {
        try {
          console.log(`🔍 Trying endpoint: ${endpoint}`);
          const data = await apiCall(endpoint);
          console.log(`🔍 Response from ${endpoint}:`, data);
          
          // Verificar si la respuesta incluye resources y quizzes
          const enrollment = data.enrollment || data;
          const hasResourcesAndQuizzes = enrollment?.course?.modules?.some(
            (module: any) => module.lessons?.some(
              (lesson: any) => lesson.resources !== undefined || lesson.quizzes !== undefined
            )
          );
          
          if (hasResourcesAndQuizzes) {
            console.log('✅ Found enrollment with resources and quizzes');
            return enrollment;
          }
        } catch (err) {
          console.log(`❌ Endpoint ${endpoint} failed:`, err);
          continue;
        }
      }
      
      console.warn('⚠️ No endpoint returned complete data with resources and quizzes');
      return null;
    } catch (err) {
      console.error('Error fetching enrollment for learning:', err);
      return null;
    }
  }, []);

  return {
    enrollments,
    loading,
    error,
    fetchEnrollments,
    enrollInCourse,
    updateProgress,
    updateEnrollmentProgress,
    completeCourse,
    dropCourse,
    getEnrollmentById,
    getEnrollmentForLearning
  };
};
