import { useState, useEffect } from "react";
import { QuizAttemptService } from "@/services/quizattempt.service";
import { QuizAttempt } from "@/types/courses";

export function useQuizAttempts() {
  const [data, setData] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    QuizAttemptService.getAll()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useQuizAttempt(id: string) {
  const [data, setData] = useState<QuizAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    QuizAttemptService.getById(id)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}

export function useCreateQuizAttempt() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = async (data: Partial<QuizAttempt>): Promise<QuizAttempt> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizAttemptService.create(data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}

export function useUpdateQuizAttempt() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = async (id: string, data: Partial<QuizAttempt>): Promise<QuizAttempt> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizAttemptService.update(id, data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}

export function useDeleteQuizAttempt() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizAttemptService.delete(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
}

// Hooks específicos para quiz attempts
export function useQuizAttemptsByQuiz(quizId: string) {
  const [data, setData] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!quizId) return;
    QuizAttemptService.getByQuiz(quizId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [quizId]);

  return { data, loading, error };
}

export function useQuizAttemptsByStudent(studentId: string) {
  const [data, setData] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!studentId) return;
    QuizAttemptService.getByStudent(studentId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [studentId]);

  return { data, loading, error };
}

export function useQuizAttemptsByEnrollment(enrollmentId: string) {
  const [data, setData] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enrollmentId) return;
    QuizAttemptService.getByEnrollment(enrollmentId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [enrollmentId]);

  return { data, loading, error };
}

export function useMyQuizAttempts() {
  const [data, setData] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    QuizAttemptService.getMyAttempts()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function usePassedQuizAttempts(quizId: string) {
  const [data, setData] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!quizId) return;
    QuizAttemptService.getPassedAttempts(quizId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [quizId]);

  return { data, loading, error };
}

export function useFailedQuizAttempts(quizId: string) {
  const [data, setData] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!quizId) return;
    QuizAttemptService.getFailedAttempts(quizId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [quizId]);

  return { data, loading, error };
}

export function useActiveQuizAttempts() {
  const [data, setData] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    QuizAttemptService.getActiveAttempts()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useCompletedQuizAttempts() {
  const [data, setData] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    QuizAttemptService.getCompletedAttempts()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useStartQuizAttempt() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const startAttempt = async (quizId: string, enrollmentId?: string): Promise<QuizAttempt> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizAttemptService.startAttempt(quizId, enrollmentId);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { startAttempt, loading, error };
}

export function useCompleteQuizAttempt() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const completeAttempt = async (id: string, answers: any[], timeSpent: number): Promise<QuizAttempt> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizAttemptService.completeAttempt(id, answers, timeSpent);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { completeAttempt, loading, error };
}

export function useSubmitQuizAttempt() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const submitAttempt = async (id: string, answers: any[]): Promise<QuizAttempt> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizAttemptService.submitAttempt(id, answers);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { submitAttempt, loading, error };
}

export function usePauseQuizAttempt() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const pauseAttempt = async (id: string): Promise<QuizAttempt> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizAttemptService.pauseAttempt(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { pauseAttempt, loading, error };
}

export function useResumeQuizAttempt() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const resumeAttempt = async (id: string): Promise<QuizAttempt> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizAttemptService.resumeAttempt(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { resumeAttempt, loading, error };
}

export function useQuizAttemptStats(quizId: string) {
  const [data, setData] = useState<{
    totalAttempts: number;
    passedAttempts: number;
    failedAttempts: number;
    averageScore: number;
    averageTimeSpent: number;
    bestScore: number;
    passRate: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!quizId) return;
    QuizAttemptService.getAttemptStats(quizId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [quizId]);

  return { data, loading, error };
}

export function useStudentAttemptStats(studentId: string) {
  const [data, setData] = useState<{
    totalAttempts: number;
    passedAttempts: number;
    failedAttempts: number;
    averageScore: number;
    totalTimeSpent: number;
    quizzesAttempted: number;
    quizzesPassed: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!studentId) return;
    QuizAttemptService.getStudentAttemptStats(studentId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [studentId]);

  return { data, loading, error };
}

export function useBestQuizAttempt(quizId: string, studentId: string) {
  const [data, setData] = useState<QuizAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!quizId || !studentId) return;
    QuizAttemptService.getBestAttempt(quizId, studentId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [quizId, studentId]);

  return { data, loading, error };
}

export function useQuizAttemptHistory(quizId: string, studentId: string) {
  const [data, setData] = useState<QuizAttempt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!quizId || !studentId) return;
    QuizAttemptService.getAttemptHistory(quizId, studentId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [quizId, studentId]);

  return { data, loading, error };
}

export function useResetQuizAttempt() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const resetAttempt = async (id: string): Promise<QuizAttempt> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizAttemptService.resetAttempt(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { resetAttempt, loading, error };
}

export function useExtendTimeLimit() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const extendTime = async (id: string, additionalMinutes: number): Promise<QuizAttempt> => {
    setLoading(true);
    setError(null);
    try {
      return await QuizAttemptService.extendTimeLimit(id, additionalMinutes);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { extendTime, loading, error };
}

export function useValidateQuizAttempt(attemptId: string) {
  const [data, setData] = useState<{
    isValid: boolean;
    reason?: string;
    timeRemaining?: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!attemptId) return;
    QuizAttemptService.validateAttempt(attemptId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [attemptId]);

  return { data, loading, error };
} 