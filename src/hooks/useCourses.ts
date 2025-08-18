import { useState, useEffect } from 'react';
import { API_BASE } from '@/lib/api';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  duration: number; // en minutos
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  category: string;
  instructor: {
    id: string;
    name: string;
    avatar?: string;
  };
  organization: {
    id: string;
    name: string;
  };
  modules: CourseModule[];
  totalLessons: number;
  totalQuizzes: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CourseModule {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: Lesson[];
  quiz?: Quiz;
  isRequired: boolean;
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  content: string;
  type: 'VIDEO' | 'TEXT' | 'INTERACTIVE' | 'DOCUMENT';
  duration: number; // en minutos
  order: number;
  isRequired: boolean;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  passingScore: number;
  timeLimit?: number; // en minutos
}

interface QuizQuestion {
  id: string;
  question: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER';
  options?: string[];
  correctAnswer: string | string[];
  points: number;
}

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getToken = () => {
    return localStorage.getItem('token');
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`${API_BASE}/course`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error fetching courses: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      setCourses(data.courses || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error in fetchCourses:', err);
    } finally {
      setLoading(false);
    }
  };

  const getCourseById = async (courseId: string): Promise<Course | null> => {
    try {
      const token = getToken();
      if (!token) {
        throw new Error('No authentication token available');
      }

      const response = await fetch(`/api/course/${courseId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error fetching course: ${response.status} ${errorText}`);
      }

      const data = await response.json();
      return data.course;
    } catch (err) {
      console.error('Error in getCourseById:', err);
      return null;
    }
  };

  // Load initial data
  useEffect(() => {
    fetchCourses();
  }, []);

  return {
    courses,
    loading,
    error,
    fetchCourses,
    getCourseById
  };
};
