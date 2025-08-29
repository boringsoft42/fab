import { useState, useEffect } from "react";
import { StudentNoteService } from "@/services/studentnote.service";
import { StudentNote } from "@/types/courses";

export function useStudentNotes() {
  const [data, setData] = useState<StudentNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    StudentNoteService.getAll()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useStudentNote(id: string) {
  const [data, setData] = useState<StudentNote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    StudentNoteService.getById(id)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}

export function useCreateStudentNote() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = async (data: Partial<StudentNote>): Promise<StudentNote> => {
    setLoading(true);
    setError(null);
    try {
      return await StudentNoteService.create(data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}

export function useUpdateStudentNote() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = async (id: string, data: Partial<StudentNote>): Promise<StudentNote> => {
    setLoading(true);
    setError(null);
    try {
      return await StudentNoteService.update(id, data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}

export function useDeleteStudentNote() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      return await StudentNoteService.delete(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
}

// Hooks específicos para student notes
export function useStudentNotesByUser(userId: string) {
  const [data, setData] = useState<StudentNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;
    StudentNoteService.getByUser(userId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  return { data, loading, error };
}

export function useStudentNotesByLesson(lessonId: string) {
  const [data, setData] = useState<StudentNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!lessonId) return;
    StudentNoteService.getByLesson(lessonId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [lessonId]);

  return { data, loading, error };
}

export function useMyStudentNotes() {
  const [data, setData] = useState<StudentNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    StudentNoteService.getMyNotes()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useStudentNotesByCourse(courseId: string) {
  const [data, setData] = useState<StudentNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!courseId) return;
    StudentNoteService.getNotesByCourse(courseId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [courseId]);

  return { data, loading, error };
}

export function useStudentNotesByModule(moduleId: string) {
  const [data, setData] = useState<StudentNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!moduleId) return;
    StudentNoteService.getNotesByModule(moduleId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [moduleId]);

  return { data, loading, error };
}

export function useVideoNotes(lessonId: string) {
  const [data, setData] = useState<StudentNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!lessonId) return;
    StudentNoteService.getVideoNotes(lessonId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [lessonId]);

  return { data, loading, error };
}

export function useTextNotes(lessonId: string) {
  const [data, setData] = useState<StudentNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!lessonId) return;
    StudentNoteService.getTextNotes(lessonId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [lessonId]);

  return { data, loading, error };
}

export function useSearchStudentNotes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = async (query: string): Promise<StudentNote[]> => {
    setLoading(true);
    setError(null);
    try {
      return await StudentNoteService.searchNotes(query);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { search, loading, error };
}

export function useStudentNotesByTimestamp(lessonId: string, timestamp: number) {
  const [data, setData] = useState<StudentNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!lessonId || timestamp === undefined) return;
    StudentNoteService.getNotesByTimestamp(lessonId, timestamp)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [lessonId, timestamp]);

  return { data, loading, error };
}

export function useStudentNotesByDateRange(startDate: string, endDate: string) {
  const [data, setData] = useState<StudentNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!startDate || !endDate) return;
    StudentNoteService.getNotesByDateRange(startDate, endDate)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [startDate, endDate]);

  return { data, loading, error };
}

export function useRecentStudentNotes(limit: number = 10) {
  const [data, setData] = useState<StudentNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    StudentNoteService.getRecentNotes(limit)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [limit]);

  return { data, loading, error };
}

export function usePopularStudentNotes(limit: number = 10) {
  const [data, setData] = useState<StudentNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    StudentNoteService.getPopularNotes(limit)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [limit]);

  return { data, loading, error };
}

export function useDuplicateStudentNote() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const duplicateNote = async (id: string): Promise<StudentNote> => {
    setLoading(true);
    setError(null);
    try {
      return await StudentNoteService.duplicateNote(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { duplicateNote, loading, error };
}

export function useShareStudentNote() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const shareNote = async (id: string, shareWith: string[]): Promise<StudentNote> => {
    setLoading(true);
    setError(null);
    try {
      return await StudentNoteService.shareNote(id, shareWith);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { shareNote, loading, error };
}

export function useExportStudentNotes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const exportNotes = async (format: 'json' | 'pdf' | 'txt' = 'json'): Promise<Blob> => {
    setLoading(true);
    setError(null);
    try {
      return await StudentNoteService.exportNotes(format);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { exportNotes, loading, error };
}

export function useImportStudentNotes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const importNotes = async (notes: Partial<StudentNote>[]): Promise<StudentNote[]> => {
    setLoading(true);
    setError(null);
    try {
      return await StudentNoteService.importNotes(notes);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { importNotes, loading, error };
}

export function useBulkDeleteStudentNotes() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const bulkDelete = async (noteIds: string[]): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      return await StudentNoteService.bulkDeleteNotes(noteIds);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { bulkDelete, loading, error };
}

export function useStudentNoteStats(userId: string) {
  const [data, setData] = useState<{
    totalNotes: number;
    notesThisWeek: number;
    notesThisMonth: number;
    averageNotesPerLesson: number;
    mostActiveLesson: string;
    totalCharacters: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;
    StudentNoteService.getNoteStats(userId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  return { data, loading, error };
}

export function useLessonNoteStats(lessonId: string) {
  const [data, setData] = useState<{
    totalNotes: number;
    uniqueUsers: number;
    averageNotesPerUser: number;
    mostCommonTopics: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!lessonId) return;
    StudentNoteService.getLessonNoteStats(lessonId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [lessonId]);

  return { data, loading, error };
}

export function useAddNoteTag() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const addTag = async (id: string, tag: string): Promise<StudentNote> => {
    setLoading(true);
    setError(null);
    try {
      return await StudentNoteService.addNoteTag(id, tag);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { addTag, loading, error };
}

export function useRemoveNoteTag() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const removeTag = async (id: string, tag: string): Promise<StudentNote> => {
    setLoading(true);
    setError(null);
    try {
      return await StudentNoteService.removeNoteTag(id, tag);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { removeTag, loading, error };
}

export function useStudentNotesByTag(tag: string) {
  const [data, setData] = useState<StudentNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!tag) return;
    StudentNoteService.getNotesByTag(tag)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [tag]);

  return { data, loading, error };
}

export function useStudentNoteTags() {
  const [data, setData] = useState<{
    tag: string;
    count: number;
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    StudentNoteService.getNoteTags()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
} 