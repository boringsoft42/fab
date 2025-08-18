import { apiCall } from '@/lib/api';
import { StudentNote } from '@/types/courses';

export class StudentNoteService {
  static async getAll(): Promise<StudentNote[]> {
    return await apiCall('/student-notes');
  }

  static async getById(id: string): Promise<StudentNote> {
    return await apiCall(`/student-notes/${id}`);
  }

  static async create(data: Partial<StudentNote>): Promise<StudentNote> {
    return await apiCall('/student-notes', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async update(id: string, data: Partial<StudentNote>): Promise<StudentNote> {
    return await apiCall(`/student-notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static async delete(id: string): Promise<void> {
    await apiCall(`/student-notes/${id}`, { method: 'DELETE' });
  }

  // Métodos específicos para student notes
  static async getByUser(userId: string): Promise<StudentNote[]> {
    return await apiCall(`/student-notes?userId=${userId}`);
  }

  static async getByLesson(lessonId: string): Promise<StudentNote[]> {
    return await apiCall(`/student-notes?lessonId=${lessonId}`);
  }

  static async getMyNotes(): Promise<StudentNote[]> {
    return await apiCall('/student-notes/my-notes');
  }

  static async getNotesByCourse(courseId: string): Promise<StudentNote[]> {
    return await apiCall(`/student-notes?courseId=${courseId}`);
  }

  static async getNotesByModule(moduleId: string): Promise<StudentNote[]> {
    return await apiCall(`/student-notes?moduleId=${moduleId}`);
  }

  static async getVideoNotes(lessonId: string): Promise<StudentNote[]> {
    return await apiCall(`/student-notes?lessonId=${lessonId}&type=video`);
  }

  static async getTextNotes(lessonId: string): Promise<StudentNote[]> {
    return await apiCall(`/student-notes?lessonId=${lessonId}&type=text`);
  }

  static async searchNotes(query: string): Promise<StudentNote[]> {
    return await apiCall(`/student-notes/search?q=${encodeURIComponent(query)}`);
  }

  static async getNotesByTimestamp(lessonId: string, timestamp: number): Promise<StudentNote[]> {
    return await apiCall(`/student-notes?lessonId=${lessonId}&timestamp=${timestamp}`);
  }

  static async getNotesByDateRange(startDate: string, endDate: string): Promise<StudentNote[]> {
    return await apiCall(`/student-notes?startDate=${startDate}&endDate=${endDate}`);
  }

  static async getRecentNotes(limit: number = 10): Promise<StudentNote[]> {
    return await apiCall(`/student-notes/recent?limit=${limit}`);
  }

  static async getPopularNotes(limit: number = 10): Promise<StudentNote[]> {
    return await apiCall(`/student-notes/popular?limit=${limit}`);
  }

  static async duplicateNote(id: string): Promise<StudentNote> {
    return await apiCall(`/student-notes/${id}/duplicate`, { method: 'POST' });
  }

  static async shareNote(id: string, shareWith: string[]): Promise<StudentNote> {
    return await apiCall(`/student-notes/${id}/share`, {
      method: 'POST',
      body: JSON.stringify({ shareWith })
    });
  }

  static async exportNotes(format: 'json' | 'pdf' | 'txt' = 'json'): Promise<Blob> {
    return await apiCall(`/student-notes/export?format=${format}`, {
      responseType: 'blob'
    });
  }

  static async importNotes(notes: Partial<StudentNote>[]): Promise<StudentNote[]> {
    return await apiCall('/student-notes/import', {
      method: 'POST',
      body: JSON.stringify({ notes })
    });
  }

  static async bulkDeleteNotes(noteIds: string[]): Promise<void> {
    return await apiCall('/student-notes/bulk-delete', {
      method: 'DELETE',
      body: JSON.stringify({ noteIds })
    });
  }

  static async getNoteStats(userId: string): Promise<{
    totalNotes: number;
    notesThisWeek: number;
    notesThisMonth: number;
    averageNotesPerLesson: number;
    mostActiveLesson: string;
    totalCharacters: number;
  }> {
    return await apiCall(`/student-notes/stats/${userId}`);
  }

  static async getLessonNoteStats(lessonId: string): Promise<{
    totalNotes: number;
    uniqueUsers: number;
    averageNotesPerUser: number;
    mostCommonTopics: string[];
  }> {
    return await apiCall(`/student-notes/lesson-stats/${lessonId}`);
  }

  static async addNoteTag(id: string, tag: string): Promise<StudentNote> {
    return await apiCall(`/student-notes/${id}/tags`, {
      method: 'POST',
      body: JSON.stringify({ tag })
    });
  }

  static async removeNoteTag(id: string, tag: string): Promise<StudentNote> {
    return await apiCall(`/student-notes/${id}/tags`, {
      method: 'DELETE',
      body: JSON.stringify({ tag })
    });
  }

  static async getNotesByTag(tag: string): Promise<StudentNote[]> {
    return await apiCall(`/student-notes?tag=${encodeURIComponent(tag)}`);
  }

  static async getNoteTags(): Promise<{
    tag: string;
    count: number;
  }[]> {
    return await apiCall('/student-notes/tags');
  }
} 