import { useState, useEffect } from "react";
import { LessonProgressService } from "@/services/lessonprogress.service";
import { LessonProgress } from "@/types/courses";

export function useLessonProgresses() {
  const [data, setData] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    LessonProgressService.getAll()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useLessonProgress(id: string) {
  const [data, setData] = useState<LessonProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    LessonProgressService.getById(id)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}

export function useCreateLessonProgress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = async (data: Partial<LessonProgress>): Promise<LessonProgress> => {
    setLoading(true);
    setError(null);
    try {
      return await LessonProgressService.create(data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}

export function useUpdateLessonProgress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = async (id: string, data: Partial<LessonProgress>): Promise<LessonProgress> => {
    setLoading(true);
    setError(null);
    try {
      return await LessonProgressService.update(id, data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}

export function useDeleteLessonProgress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      return await LessonProgressService.delete(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
}

// Hooks específicos para lesson progress
export function useLessonProgressesByEnrollment(enrollmentId: string) {
  const [data, setData] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enrollmentId) return;
    LessonProgressService.getByEnrollment(enrollmentId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [enrollmentId]);

  return { data, loading, error };
}

export function useLessonProgressesByLesson(lessonId: string) {
  const [data, setData] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!lessonId) return;
    LessonProgressService.getByLesson(lessonId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [lessonId]);

  return { data, loading, error };
}

export function useMyLessonProgresses() {
  const [data, setData] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    LessonProgressService.getMyProgress()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useLessonProgressesByCourse(courseId: string) {
  const [data, setData] = useState<LessonProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!courseId) return;
    LessonProgressService.getByCourse(courseId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [courseId]);

  return { data, loading, error };
}

export function useMarkLessonAsCompleted() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const markAsCompleted = async (lessonId: string, enrollmentId: string): Promise<LessonProgress> => {
    setLoading(true);
    setError(null);
    try {
      return await LessonProgressService.markAsCompleted(lessonId, enrollmentId);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { markAsCompleted, loading, error };
}

export function useUpdateLessonTimeSpent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateTimeSpent = async (lessonId: string, enrollmentId: string, timeSpent: number): Promise<LessonProgress> => {
    setLoading(true);
    setError(null);
    try {
      return await LessonProgressService.updateTimeSpent(lessonId, enrollmentId, timeSpent);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { updateTimeSpent, loading, error };
}

export function useLessonProgressStats(enrollmentId: string) {
  const [data, setData] = useState<{
    totalLessons: number;
    completedLessons: number;
    totalTimeSpent: number;
    completionPercentage: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!enrollmentId) return;
    LessonProgressService.getProgressStats(enrollmentId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [enrollmentId]);

  return { data, loading, error };
}

export function useBulkUpdateLessonProgress() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const bulkUpdate = async (progressUpdates: Array<{
    lessonId: string;
    enrollmentId: string;
    isCompleted?: boolean;
    timeSpent?: number;
  }>): Promise<LessonProgress[]> => {
    setLoading(true);
    setError(null);
    try {
      return await LessonProgressService.bulkUpdateProgress(progressUpdates);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { bulkUpdate, loading, error };
} 