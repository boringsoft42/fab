import { useState, useEffect } from "react";
import { QuizAnswerService } from "@/services/quizanswer.service";
import { QuizAnswer } from "@/types/courses";

// Extend the QuizAnswer interface to include id and other fields from Prisma
interface QuizAnswerWithId extends QuizAnswer {
  id: string;
  attemptId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export function useQuizAnswers() {
  const [data, setData] = useState<QuizAnswerWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    QuizAnswerService.getAll()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useQuizAnswer(id: string) {
  const [data, setData] = useState<QuizAnswerWithId | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    QuizAnswerService.getById(id)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}

export function useCreateQuizAnswer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = async (data: Partial<QuizAnswerWithId>): Promise<QuizAnswerWithId> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizAnswerService.create(data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}

export function useUpdateQuizAnswer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = async (id: string, data: Partial<QuizAnswerWithId>): Promise<QuizAnswerWithId> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizAnswerService.update(id, data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}

export function useDeleteQuizAnswer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizAnswerService.delete(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
}

// Hooks específicos para quiz answers
export function useQuizAnswersByAttempt(attemptId: string) {
  const [data, setData] = useState<QuizAnswerWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!attemptId) return;
    QuizAnswerService.getByAttempt(attemptId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [attemptId]);

  return { data, loading, error };
}

export function useQuizAnswersByQuestion(questionId: string) {
  const [data, setData] = useState<QuizAnswerWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!questionId) return;
    QuizAnswerService.getByQuestion(questionId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [questionId]);

  return { data, loading, error };
}

export function useQuizAnswersByQuiz(quizId: string) {
  const [data, setData] = useState<QuizAnswerWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!quizId) return;
    QuizAnswerService.getByQuiz(quizId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [quizId]);

  return { data, loading, error };
}

export function useMyQuizAnswers() {
  const [data, setData] = useState<QuizAnswerWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    QuizAnswerService.getMyAnswers()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useCorrectQuizAnswers(questionId: string) {
  const [data, setData] = useState<QuizAnswerWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!questionId) return;
    QuizAnswerService.getCorrectAnswers(questionId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [questionId]);

  return { data, loading, error };
}

export function useQuizAnswersByUser(userId: string) {
  const [data, setData] = useState<QuizAnswerWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;
    QuizAnswerService.getAnswersByUser(userId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  return { data, loading, error };
}

export function useBulkCreateQuizAnswers() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const bulkCreate = async (answers: Partial<QuizAnswerWithId>[]): Promise<QuizAnswerWithId[]> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizAnswerService.bulkCreateAnswers(answers);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { bulkCreate, loading, error };
}

export function useQuizAnswerStats(questionId: string) {
  const [data, setData] = useState<{
    totalAnswers: number;
    correctAnswers: number;
    incorrectAnswers: number;
    averageTimeSpent: number;
    mostCommonAnswer: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!questionId) return;
    QuizAnswerService.getAnswerStats(questionId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [questionId]);

  return { data, loading, error };
}

export function useAttemptAnswers(attemptId: string) {
  const [data, setData] = useState<{
    answers: QuizAnswerWithId[];
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    timeSpent: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!attemptId) return;
    QuizAnswerService.getAttemptAnswers(attemptId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [attemptId]);

  return { data, loading, error };
}

export function useUpdateAnswerText() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateText = async (id: string, answer: string): Promise<QuizAnswerWithId> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizAnswerService.updateAnswerText(id, answer);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { updateText, loading, error };
}

export function useMarkAnswerAsCorrect() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const markAsCorrect = async (id: string): Promise<QuizAnswerWithId> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizAnswerService.markAsCorrect(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { markAsCorrect, loading, error };
}

export function useMarkAnswerAsIncorrect() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const markAsIncorrect = async (id: string): Promise<QuizAnswerWithId> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizAnswerService.markAsIncorrect(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { markAsIncorrect, loading, error };
} 