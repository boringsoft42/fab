import { useState, useEffect } from "react";
import { LessonService } from "@/services/lesson.service";
import { Lesson } from "@/types/courses";

export function useLessons() {
  const [data, setData] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    LessonService.getAll()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useLesson(id: string) {
  const [data, setData] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    LessonService.getById(id)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}

export function useCreateLesson() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = async (data: Partial<Lesson>): Promise<Lesson> => {
    setLoading(true);
    setError(null);
    try {
      return await LessonService.create(data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}

export function useUpdateLesson() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = async (id: string, data: Partial<Lesson>): Promise<Lesson> => {
    setLoading(true);
    setError(null);
    try {
      return await LessonService.update(id, data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}

export function useDeleteLesson() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      return await LessonService.delete(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
}

// Hooks específicos para lessons
export function useLessonsByModule(moduleId: string) {
  const [data, setData] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!moduleId) return;
    LessonService.getByModule(moduleId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [moduleId]);

  return { data, loading, error };
}

export function useLessonsByCourse(courseId: string) {
  const [data, setData] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!courseId) return;
    LessonService.getByCourse(courseId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [courseId]);

  return { data, loading, error };
}

export function useLessonsByType(type: string) {
  const [data, setData] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!type) return;
    LessonService.getByType(type)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [type]);

  return { data, loading, error };
}

export function usePreviewLessons() {
  const [data, setData] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    LessonService.getPreviewLessons()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useReorderLessons() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reorder = async (moduleId: string, lessonIds: string[]): Promise<Lesson[]> => {
    setLoading(true);
    setError(null);
    try {
      return await LessonService.reorderLessons(moduleId, lessonIds);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { reorder, loading, error };
}

export function useDuplicateLesson() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const duplicate = async (id: string): Promise<Lesson> => {
    setLoading(true);
    setError(null);
    try {
      return await LessonService.duplicateLesson(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { duplicate, loading, error };
}

export function useToggleLessonPreview() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const toggle = async (id: string): Promise<Lesson> => {
    setLoading(true);
    setError(null);
    try {
      return await LessonService.togglePreview(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { toggle, loading, error };
}

export function useLessonProgress(lessonId: string) {
  const [data, setData] = useState<{
    completed: boolean;
    timeSpent: number;
    lastAccessedAt: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!lessonId) return;
    LessonService.getLessonProgress(lessonId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [lessonId]);

  return { data, loading, error };
} 