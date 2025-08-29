import { apiCall } from '@/lib/api';
import { Discussion } from '@/types/courses';

export class DiscussionService {
  static async getAll(): Promise<Discussion[]> {
    return await apiCall('/discussions');
  }

  static async getById(id: string): Promise<Discussion> {
    return await apiCall(`/discussions/${id}`);
  }

  static async create(data: Partial<Discussion>): Promise<Discussion> {
    return await apiCall('/discussions', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async update(id: string, data: Partial<Discussion>): Promise<Discussion> {
    return await apiCall(`/discussions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static async delete(id: string): Promise<void> {
    await apiCall(`/discussions/${id}`, { method: 'DELETE' });
  }

  // Métodos específicos para discussions
  static async getDiscussionsByLesson(lessonId: string): Promise<Discussion[]> {
    return await apiCall(`/discussions?lessonId=${lessonId}`);
  }

  static async getDiscussionsByUser(userId: string): Promise<Discussion[]> {
    return await apiCall(`/discussions?userId=${userId}`);
  }

  static async getReplies(discussionId: string): Promise<Discussion[]> {
    return await apiCall(`/discussions?parentId=${discussionId}`);
  }

  static async likeDiscussion(id: string): Promise<Discussion> {
    return await apiCall(`/discussions/${id}/like`, { method: 'POST' });
  }

  static async unlikeDiscussion(id: string): Promise<Discussion> {
    return await apiCall(`/discussions/${id}/unlike`, { method: 'POST' });
  }
} 