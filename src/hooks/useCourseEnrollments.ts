import { useState, useEffect } from 'react';
import { getUserFromToken, API_BASE } from '@/lib/api';

interface CourseEnrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
  status: 'ENROLLED' | 'IN_PROGRESS' | 'COMPLETED' | 'DROPPED' | 'SUSPENDED';
  progress: number; // 0-100
  currentModuleId?: string;
  currentLessonId?: string;
  timeSpent: number; // en segundos
  certificateIssued: boolean;
  certificateUrl?: string;
  completedAt?: string;
  finalGrade?: number;
  course: {
    id: string;
    title: string;
    thumbnail?: string;
    modules: any[];
  };
  moduleProgress: {
    [moduleId: string]: {
      completed: boolean;
      lessonsCompleted: number;
      totalLessons: number;
      quizPassed?: boolean;
    };
  };
}

export const useCourseEnrollments = () => {
  console.log('🔍 useCourseEnrollments - Hook initialized');
  console.log('🔍 useCourseEnrollments - Hook called at:', new Date().toISOString());
  
  const [enrollments, setEnrollments] = useState<CourseEnrollment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const fetchEnrollments = async () => {
    console.log('🔍 fetchEnrollments - Function called');
    try {
      setLoading(true);
      setError(null);

      const token = getToken();
      console.log('🔍 fetchEnrollments - Token available:', !!token);
      if (!token) {
        throw new Error('No authentication token available');
      }

      console.log('🔍 fetchEnrollments - Making request to', `${API_BASE}/course-enrollments`);
      const response = await fetch(`${API_BASE}/course-enrollments`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error fetching enrollments: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      console.log('🔍 Fetched enrollments data:', data);
      console.log('🔍 Enrollments count:', data.length || 0);
      
      // The backend already returns enrollments with course data included
      const enrollmentsWithCourses = (data || []).map((enrollment: any) => ({
        ...enrollment,
        progress: typeof enrollment.progress === 'string' ? parseInt(enrollment.progress) : enrollment.progress,
        moduleProgress: enrollment.moduleProgress || {}
      }));

      console.log('🔍 Enrollments with courses:', enrollmentsWithCourses);
      setEnrollments(enrollmentsWithCourses);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error in fetchEnrollments:', err);
    } finally {
      setLoading(false);
    }
  };

  const enrollInCourse = async (courseId: string) => {
    try {
      setLoading(true);
      setError(null);

      const token = getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      // Get current user ID from token
      const userInfo = getUserFromToken();
      
      if (!userInfo || !userInfo.id) {
        throw new Error('No authenticated user found');
      }

      const userId = userInfo.id;
      console.log('🔍 Current user ID:', userId);

      const requestBody = {
        courseId,
        studentId: userId
      };

      console.log('🔍 Enrolling in course with data:', requestBody);
      console.log('🔍 Request body JSON:', JSON.stringify(requestBody));

      const response = await fetch(`${API_BASE}/course-enrollments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error enrolling in course: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      
      // Add new enrollment to the list
      setEnrollments(prev => [...prev, data.enrollment]);
      
      return data.enrollment;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error in enrollInCourse:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getEnrollmentById = async (enrollmentId: string): Promise<CourseEnrollment | null> => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`${API_BASE}/course-enrollments/${enrollmentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error fetching enrollment: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      return data.enrollment;
    } catch (err) {
      console.error('Error in getEnrollmentById:', err);
      return null;
    }
  };

  const updateEnrollmentProgress = async (
    enrollmentId: string, 
    updates: {
      progress?: number;
      currentModuleId?: string;
      currentLessonId?: string;
      status?: string;
      timeSpent?: number;
    }
  ) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`${API_BASE}/course-enrollments/${enrollmentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error updating enrollment: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      
      // Update enrollment in the list
      setEnrollments(prev => 
        prev.map(enrollment => 
          enrollment.id === enrollmentId ? data.enrollment : enrollment
        )
      );
      
      return data.enrollment;
    } catch (err) {
      console.error('Error in updateEnrollmentProgress:', err);
      throw err;
    }
  };

  const completeCourse = async (enrollmentId: string, finalGrade: number) => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`${API_BASE}/course-enrollments/${enrollmentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'COMPLETED',
          completedAt: new Date().toISOString(),
          progress: 100,
          finalGrade,
          certificateIssued: true
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error completing course: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      
      // Update enrollment in the list
      setEnrollments(prev => 
        prev.map(enrollment => 
          enrollment.id === enrollmentId ? data.enrollment : enrollment
        )
      );
      
      return data.enrollment;
    } catch (err) {
      console.error('Error in completeCourse:', err);
      throw err;
    }
  };

  // Load initial data
  useEffect(() => {
    console.log('🔍 useCourseEnrollments: useEffect triggered');
    
    // Check if we have a token before making the request
    const token = getToken();
    console.log('🔍 useCourseEnrollments: Token in useEffect:', !!token);
    
    if (token) {
      fetchEnrollments();
    } else {
      console.log('🔍 useCourseEnrollments: No token available, skipping fetch');
    }
  }, []);

  return {
    enrollments,
    loading,
    error,
    fetchEnrollments,
    enrollInCourse,
    getEnrollmentById,
    updateEnrollmentProgress,
    completeCourse
  };
};
