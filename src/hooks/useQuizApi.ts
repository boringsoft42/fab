import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuthHeaders } from '@/lib/api';

// ===== TIPOS =====
export interface Quiz {
  id: string;
  courseId?: string;
  lessonId?: string;
  title: string;
  description?: string;
  timeLimit?: number; // en minutos
  passingScore: number;
  showCorrectAnswers: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  questions?: QuizQuestion[];
  attempts?: QuizAttempt[];
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  question: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK' | 'ESSAY';
  options: string[];
  correctAnswer: string;
  explanation?: string;
  points: number;
  orderIndex: number;
}

export interface QuizAttempt {
  id: string;
  enrollmentId?: string;
  quizId: string;
  studentId: string;
  startedAt: Date;
  completedAt?: Date;
  score?: number;
  passed?: boolean;
  timeSpent: number; // en segundos
  answers?: QuizAnswer[];
}

export interface QuizAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  answer: string;
  isCorrect: boolean;
  points: number;
}

export interface CreateQuizData {
  courseId?: string;
  lessonId?: string;
  title: string;
  description?: string;
  timeLimit?: number;
  passingScore?: number;
  showCorrectAnswers?: boolean;
  isActive?: boolean;
}

export interface UpdateQuizData {
  id: string;
  title?: string;
  description?: string;
  timeLimit?: number;
  passingScore?: number;
  showCorrectAnswers?: boolean;
  isActive?: boolean;
}

export interface CreateQuestionData {
  quizId: string;
  question: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK' | 'ESSAY';
  options: string[];
  correctAnswer: string;
  explanation?: string;
  points?: number;
  orderIndex?: number;
}

export interface UpdateQuestionData {
  id: string;
  question?: string;
  type?: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'FILL_BLANK' | 'ESSAY';
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  points?: number;
  orderIndex?: number;
}

export interface CreateAttemptData {
  quizId: string;
  studentId: string;
  enrollmentId?: string;
}

export interface SubmitAnswerData {
  attemptId: string;
  questionId: string;
  answer: string;
}

// ===== HOOKS DE QUIZ =====

// Obtener quizzes de una lección
export const useLessonQuizzes = (lessonId?: string) => {
  return useQuery({
    queryKey: ['lessonQuizzes', lessonId],
    queryFn: async () => {
      if (!lessonId) return { quizzes: [] };
      
      const params = new URLSearchParams({ lessonId });
      const response = await fetch(`http://localhost:3001/api/quiz?${params}`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch lesson quizzes');
      }
      
      const data = await response.json();
      
      // Si la respuesta es un array directo, lo envuelvo en el formato esperado
      if (Array.isArray(data)) {
        return { quizzes: data };
      }
      
      return data;
    },
    enabled: !!lessonId,
  });
};

// Obtener quizzes de un curso
export const useCourseQuizzes = (courseId?: string) => {
  return useQuery({
    queryKey: ['courseQuizzes', courseId],
    queryFn: async () => {
      if (!courseId) return { quizzes: [] };
      
      const params = new URLSearchParams({ courseId });
      const response = await fetch(`http://localhost:3001/api/quiz?${params}`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch course quizzes');
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        return { quizzes: data };
      }
      
      return data;
    },
    enabled: !!courseId,
  });
};

// Obtener un quiz específico con sus preguntas
export const useQuiz = (quizId?: string) => {
  return useQuery({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      if (!quizId) return null;
      
      const response = await fetch(`http://localhost:3001/api/quiz/${quizId}`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch quiz');
      }
      
      return response.json();
    },
    enabled: !!quizId,
  });
};

// Crear quiz
export const useCreateQuiz = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (quizData: CreateQuizData) => {
      const response = await fetch('http://localhost:3001/api/quiz', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(quizData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create quiz');
      }
      
      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate relevant queries
      if (variables.lessonId) {
        queryClient.invalidateQueries({
          queryKey: ['lessonQuizzes', variables.lessonId],
        });
      }
      if (variables.courseId) {
        queryClient.invalidateQueries({
          queryKey: ['courseQuizzes', variables.courseId],
        });
      }
    },
  });
};

// Actualizar quiz
export const useUpdateQuiz = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (quizData: UpdateQuizData) => {
      const response = await fetch(`http://localhost:3001/api/quiz/${quizData.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(quizData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update quiz');
      }
      
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['quiz', variables.id],
      });
    },
  });
};

// Eliminar quiz
export const useDeleteQuiz = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (quizId: string) => {
      const response = await fetch(`http://localhost:3001/api/quiz/${quizId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete quiz');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['lessonQuizzes'],
      });
      queryClient.invalidateQueries({
        queryKey: ['courseQuizzes'],
      });
    },
  });
};

// ===== HOOKS DE PREGUNTAS =====

// Obtener preguntas de un quiz
export const useQuizQuestions = (quizId?: string) => {
  return useQuery({
    queryKey: ['quizQuestions', quizId],
    queryFn: async () => {
      if (!quizId) return { questions: [] };
      
      const params = new URLSearchParams({ quizId });
      const response = await fetch(`http://localhost:3001/api/quizquestion?${params}`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch quiz questions');
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        return { questions: data };
      }
      
      return data;
    },
    enabled: !!quizId,
  });
};

// Crear pregunta
export const useCreateQuestion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (questionData: CreateQuestionData) => {
      const response = await fetch('http://localhost:3001/api/quizquestion', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(questionData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create question');
      }
      
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['quizQuestions', variables.quizId],
      });
    },
  });
};

// Actualizar pregunta
export const useUpdateQuestion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (questionData: UpdateQuestionData) => {
      const response = await fetch(`http://localhost:3001/api/quizquestion/${questionData.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(questionData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update question');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['quizQuestions'],
      });
    },
  });
};

// Eliminar pregunta
export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (questionId: string) => {
      const response = await fetch(`http://localhost:3001/api/quizquestion/${questionId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete question');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['quizQuestions'],
      });
    },
  });
};

// ===== HOOKS DE INTENTOS =====

// Obtener intentos de un quiz
export const useQuizAttempts = (quizId?: string) => {
  return useQuery({
    queryKey: ['quizAttempts', quizId],
    queryFn: async () => {
      if (!quizId) return { attempts: [] };
      
      const params = new URLSearchParams({ quizId });
      const response = await fetch(`http://localhost:3001/api/quizattempt?${params}`, {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch quiz attempts');
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        return { attempts: data };
      }
      
      return data;
    },
    enabled: !!quizId,
  });
};

// Crear intento
export const useCreateAttempt = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (attemptData: CreateAttemptData) => {
      const response = await fetch('http://localhost:3001/api/quizattempt', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(attemptData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create attempt');
      }
      
      return response.json();
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['quizAttempts', variables.quizId],
      });
    },
  });
};

// Finalizar intento
export const useCompleteAttempt = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (attemptId: string) => {
      const response = await fetch(`http://localhost:3001/api/quizattempt/${attemptId}/complete`, {
        method: 'PUT',
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Failed to complete attempt');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['quizAttempts'],
      });
    },
  });
};

// ===== HOOKS DE RESPUESTAS =====

// Enviar respuesta
export const useSubmitAnswer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (answerData: SubmitAnswerData) => {
      const response = await fetch('http://localhost:3001/api/quizanswer', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(answerData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit answer');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['quizAttempts'],
      });
    },
  });
}; 