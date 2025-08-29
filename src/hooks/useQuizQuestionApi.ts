import { useState, useEffect } from "react";
import { QuizQuestionService } from "@/services/quizquestion.service";
import { QuizQuestion } from "@/types/courses";

export function useQuizQuestions() {
  const [data, setData] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    QuizQuestionService.getAll()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useQuizQuestion(id: string) {
  const [data, setData] = useState<QuizQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    QuizQuestionService.getById(id)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}

export function useCreateQuizQuestion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = async (data: Partial<QuizQuestion>): Promise<QuizQuestion> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizQuestionService.create(data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}

export function useUpdateQuizQuestion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = async (id: string, data: Partial<QuizQuestion>): Promise<QuizQuestion> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizQuestionService.update(id, data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}

export function useDeleteQuizQuestion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizQuestionService.delete(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
}

// Hooks específicos para quiz questions
export function useQuizQuestionsByQuiz(quizId: string) {
  const [data, setData] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!quizId) return;
    QuizQuestionService.getByQuiz(quizId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [quizId]);

  return { data, loading, error };
}

export function useQuizQuestionsByType(type: string) {
  const [data, setData] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!type) return;
    QuizQuestionService.getByType(type)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [type]);

  return { data, loading, error };
}

export function useQuizQuestionsByOrder(quizId: string) {
  const [data, setData] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!quizId) return;
    QuizQuestionService.getByOrder(quizId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [quizId]);

  return { data, loading, error };
}

export function useRandomQuizQuestions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getRandomQuestions = async (quizId: string, count: number): Promise<QuizQuestion[]> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizQuestionService.getRandomQuestions(quizId, count);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { getRandomQuestions, loading, error };
}

export function useDuplicateQuizQuestion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const duplicateQuestion = async (id: string): Promise<QuizQuestion> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizQuestionService.duplicateQuestion(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { duplicateQuestion, loading, error };
}

export function useReorderQuizQuestions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reorderQuestions = async (quizId: string, questionIds: string[]): Promise<QuizQuestion[]> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizQuestionService.reorderQuestions(quizId, questionIds);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { reorderQuestions, loading, error };
}

export function useBulkCreateQuizQuestions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const bulkCreate = async (quizId: string, questions: Partial<QuizQuestion>[]): Promise<QuizQuestion[]> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizQuestionService.bulkCreateQuestions(quizId, questions);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { bulkCreate, loading, error };
}

export function useBulkUpdateQuizQuestions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const bulkUpdate = async (questions: { id: string; data: Partial<QuizQuestion> }[]): Promise<QuizQuestion[]> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizQuestionService.bulkUpdateQuestions(questions);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { bulkUpdate, loading, error };
}

export function useBulkDeleteQuizQuestions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const bulkDelete = async (questionIds: string[]): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizQuestionService.bulkDeleteQuestions(questionIds);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { bulkDelete, loading, error };
}

export function useQuizQuestionStats(questionId: string) {
  const [data, setData] = useState<{
    totalAnswers: number;
    correctAnswers: number;
    incorrectAnswers: number;
    averageTimeSpent: number;
    difficulty: 'easy' | 'medium' | 'hard';
    successRate: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!questionId) return;
    QuizQuestionService.getQuestionStats(questionId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [questionId]);

  return { data, loading, error };
}

export function useValidateQuizQuestion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const validateQuestion = async (data: Partial<QuizQuestion>): Promise<{
    isValid: boolean;
    errors: string[];
    warnings: string[];
  }> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizQuestionService.validateQuestion(data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { validateQuestion, loading, error };
}

export function useImportQuizQuestions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const importQuestions = async (quizId: string, questions: any[], format: 'json' | 'csv' = 'json'): Promise<QuizQuestion[]> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizQuestionService.importQuestions(quizId, questions, format);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { importQuestions, loading, error };
}

export function useExportQuizQuestions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const exportQuestions = async (quizId: string, format: 'json' | 'csv' = 'json'): Promise<Blob> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizQuestionService.exportQuestions(quizId, format);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { exportQuestions, loading, error };
}

export function useQuizQuestionTemplates() {
  const [data, setData] = useState<{
    id: string;
    name: string;
    type: string;
    template: Partial<QuizQuestion>;
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    QuizQuestionService.getQuestionTemplates()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useCreateQuizQuestionFromTemplate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createFromTemplate = async (templateId: string, quizId: string, customizations?: Partial<QuizQuestion>): Promise<QuizQuestion> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizQuestionService.createFromTemplate(templateId, quizId, customizations);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { createFromTemplate, loading, error };
}

export function useToggleQuizQuestionActive() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const toggleActive = async (id: string): Promise<QuizQuestion> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizQuestionService.toggleQuestionActive(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { toggleActive, loading, error };
}

export function useQuizQuestionPreview(questionId: string) {
  const [data, setData] = useState<{
    question: QuizQuestion;
    preview: string;
    estimatedTime: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!questionId) return;
    QuizQuestionService.getQuestionPreview(questionId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [questionId]);

  return { data, loading, error };
} 