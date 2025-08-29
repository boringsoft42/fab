import { apiCall } from '@/lib/api';
import { NewsComment } from '@/types/news';

export class NewsCommentService {
  static async getAll(): Promise<NewsComment[]> {
    return await apiCall('/news-comments');
  }

  static async getById(id: string): Promise<NewsComment> {
    return await apiCall(`/news-comments/${id}`);
  }

  static async create(data: Partial<NewsComment>): Promise<NewsComment> {
    return await apiCall('/news-comments', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async update(id: string, data: Partial<NewsComment>): Promise<NewsComment> {
    return await apiCall(`/news-comments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  static async delete(id: string): Promise<void> {
    await apiCall(`/news-comments/${id}`, { method: 'DELETE' });
  }

  // Métodos específicos para news comments
  static async getByNews(newsId: string): Promise<NewsComment[]> {
    return await apiCall(`/news-comments?newsId=${newsId}`);
  }

  static async getByUser(userId: string): Promise<NewsComment[]> {
    return await apiCall(`/news-comments?userId=${userId}`);
  }

  static async getReplies(commentId: string): Promise<NewsComment[]> {
    return await apiCall(`/news-comments/${commentId}/replies`);
  }

  static async getTopLevelComments(newsId: string): Promise<NewsComment[]> {
    return await apiCall(`/news-comments?newsId=${newsId}&parentId=null`);
  }

  static async likeComment(commentId: string): Promise<NewsComment> {
    return await apiCall(`/news-comments/${commentId}/like`, { method: 'POST' });
  }

  static async unlikeComment(commentId: string): Promise<NewsComment> {
    return await apiCall(`/news-comments/${commentId}/unlike`, { method: 'POST' });
  }

  static async replyToComment(parentId: string, data: Partial<NewsComment>): Promise<NewsComment> {
    return await apiCall(`/news-comments/${parentId}/reply`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  static async getCommentStats(newsId: string): Promise<{
    totalComments: number;
    totalReplies: number;
    topCommenters: Array<{
      userId: string;
      userName: string;
      commentCount: number;
    }>;
  }> {
    return await apiCall(`/news-comments/stats/${newsId}`);
  }

  static async moderateComment(commentId: string, action: 'approve' | 'reject' | 'delete'): Promise<NewsComment> {
    return await apiCall(`/news-comments/${commentId}/moderate`, {
      method: 'PUT',
      body: JSON.stringify({ action })
    });
  }

  static async getMyComments(): Promise<NewsComment[]> {
    return await apiCall('/news-comments/my-comments');
  }

  static async searchComments(query: string): Promise<NewsComment[]> {
    return await apiCall(`/news-comments?search=${encodeURIComponent(query)}`);
  }
} 