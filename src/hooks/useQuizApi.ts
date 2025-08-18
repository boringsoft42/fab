import { useState, useEffect } from "react";
import { QuizService } from "@/services/quiz.service";
import { Quiz } from "@/types/courses";

export function useQuizzes() {
  const [data, setData] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    QuizService.getAll()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useQuiz(id: string) {
  const [data, setData] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    QuizService.getById(id)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}

export function useCreateQuiz() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = async (data: Partial<Quiz>): Promise<Quiz> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizService.create(data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}

export function useUpdateQuiz() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = async (id: string, data: Partial<Quiz>): Promise<Quiz> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizService.update(id, data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}

export function useDeleteQuiz() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizService.delete(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
}

// Hooks específicos para quizzes
export function useQuizzesByCourse(courseId: string) {
  const [data, setData] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!courseId) return;
    QuizService.getByCourse(courseId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [courseId]);

  return { data, loading, error };
}

export function useQuizzesByLesson(lessonId: string) {
  const [data, setData] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!lessonId) return;
    QuizService.getByLesson(lessonId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [lessonId]);

  return { data, loading, error };
}

export function useActiveQuizzes() {
  const [data, setData] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    QuizService.getActiveQuizzes()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useQuizzesByCategory(category: string) {
  const [data, setData] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!category) return;
    QuizService.getQuizzesByCategory(category)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [category]);

  return { data, loading, error };
}

export function useDuplicateQuiz() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const duplicate = async (id: string): Promise<Quiz> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizService.duplicateQuiz(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { duplicate, loading, error };
}

export function useToggleQuizStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const toggle = async (id: string): Promise<Quiz> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizService.toggleQuizStatus(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { toggle, loading, error };
}

export function useQuizStats(quizId: string) {
  const [data, setData] = useState<{
    totalAttempts: number;
    averageScore: number;
    passRate: number;
    completionRate: number;
    timeSpent: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!quizId) return;
    QuizService.getQuizStats(quizId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [quizId]);

  return { data, loading, error };
}

export function useExportQuizResults() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const exportResults = async (id: string, format: 'csv' | 'pdf' = 'csv'): Promise<Blob> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizService.exportQuizResults(id, format);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { exportResults, loading, error };
}

export function useBulkUpdateQuizzes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const bulkUpdate = async (quizIds: string[], updates: Partial<Quiz>): Promise<Quiz[]> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizService.bulkUpdateQuizzes(quizIds, updates);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { bulkUpdate, loading, error };
}

export function useReorderQuizQuestions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reorder = async (quizId: string, questionIds: string[]): Promise<Quiz> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizService.reorderQuestions(quizId, questionIds);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { reorder, loading, error };
} 