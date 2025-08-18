import { apiCall } from '@/lib/api';
import { NewsArticle } from '@/types/news';

export class NewsArticleService {
  static async getAll(): Promise<NewsArticle[]> {
    console.log("📰 NewsArticleService.getAll() - Calling apiCall('/admin/news')");
    try {
      const result = await apiCall('/admin/news');
      console.log("✅ NewsArticleService.getAll() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ NewsArticleService.getAll() - Error:", error);
      throw error;
    }
  }

  static async getById(id: string): Promise<NewsArticle> {
    console.log("📰 NewsArticleService.getById() - Calling apiCall(`/admin/news/${id}`)");
    try {
      const result = await apiCall(`/admin/news/${id}`);
      console.log("✅ NewsArticleService.getById() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ NewsArticleService.getById() - Error:", error);
      throw error;
    }
  }

  static async create(data: Partial<NewsArticle>): Promise<NewsArticle> {
    console.log("📰 NewsArticleService.create() - Calling apiCall('/admin/news') with data:", data);
    try {
      const result = await apiCall('/admin/news', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      console.log("✅ NewsArticleService.create() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ NewsArticleService.create() - Error:", error);
      throw error;
    }
  }

  static async update(id: string, data: Partial<NewsArticle>): Promise<NewsArticle> {
    console.log("📰 NewsArticleService.update() - Calling apiCall(`/admin/news/${id}`) with data:", data);
    try {
      const result = await apiCall(`/admin/news/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      console.log("✅ NewsArticleService.update() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ NewsArticleService.update() - Error:", error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    console.log("📰 NewsArticleService.delete() - Calling apiCall(`/admin/news/${id}`)");
    try {
      await apiCall(`/admin/news/${id}`, { method: 'DELETE' });
      console.log("✅ NewsArticleService.delete() - Success");
    } catch (error) {
      console.error("❌ NewsArticleService.delete() - Error:", error);
      throw error;
    }
  }

  // Métodos específicos para news articles
  static async getByType(type: string): Promise<NewsArticle[]> {
    console.log("📰 NewsArticleService.getByType() - Calling apiCall(`/admin/news?type=${type}`)");
    try {
      const result = await apiCall(`/admin/news?type=${type}`);
      console.log("✅ NewsArticleService.getByType() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ NewsArticleService.getByType() - Error:", error);
      throw error;
    }
  }

  static async getByCategory(category: string): Promise<NewsArticle[]> {
    console.log("📰 NewsArticleService.getByCategory() - Calling apiCall(`/admin/news?category=${category}`)");
    try {
      const result = await apiCall(`/admin/news?category=${category}`);
      console.log("✅ NewsArticleService.getByCategory() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ NewsArticleService.getByCategory() - Error:", error);
      throw error;
    }
  }

  static async getFeatured(): Promise<NewsArticle[]> {
    console.log("📰 NewsArticleService.getFeatured() - Calling apiCall('/admin/news?featured=true')");
    try {
      const result = await apiCall('/admin/news?featured=true');
      console.log("✅ NewsArticleService.getFeatured() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ NewsArticleService.getFeatured() - Error:", error);
      throw error;
    }
  }

  static async getPublished(): Promise<NewsArticle[]> {
    console.log("📰 NewsArticleService.getPublished() - Calling apiCall('/admin/news?status=PUBLISHED')");
    try {
      const result = await apiCall('/admin/news?status=PUBLISHED');
      console.log("✅ NewsArticleService.getPublished() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ NewsArticleService.getPublished() - Error:", error);
      throw error;
    }
  }

  static async searchNews(query: string): Promise<NewsArticle[]> {
    console.log("📰 NewsArticleService.searchNews() - Calling apiCall(`/admin/news?search=${encodeURIComponent(query)}`)");
    try {
      const result = await apiCall(`/admin/news?search=${encodeURIComponent(query)}`);
      console.log("✅ NewsArticleService.searchNews() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ NewsArticleService.searchNews() - Error:", error);
      throw error;
    }
  }

  static async getByAuthor(authorId: string): Promise<NewsArticle[]> {
    console.log("📰 NewsArticleService.getByAuthor() - Calling apiCall(`/admin/news?authorId=${authorId}`)");
    try {
      const result = await apiCall(`/admin/news?authorId=${authorId}`);
      console.log("✅ NewsArticleService.getByAuthor() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ NewsArticleService.getByAuthor() - Error:", error);
      throw error;
    }
  }

  static async incrementViews(id: string): Promise<NewsArticle> {
    console.log("📰 NewsArticleService.incrementViews() - Calling apiCall(`/admin/news/${id}/views`)");
    try {
      const result = await apiCall(`/admin/news/${id}/views`, { method: 'POST' });
      console.log("✅ NewsArticleService.incrementViews() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ NewsArticleService.incrementViews() - Error:", error);
      throw error;
    }
  }

  static async toggleFeatured(id: string): Promise<NewsArticle> {
    console.log("📰 NewsArticleService.toggleFeatured() - Calling apiCall(`/admin/news/${id}/featured`)");
    try {
      const result = await apiCall(`/admin/news/${id}/featured`, { method: 'POST' });
      console.log("✅ NewsArticleService.toggleFeatured() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ NewsArticleService.toggleFeatured() - Error:", error);
      throw error;
    }
  }

  static async updateStatus(id: string, status: string): Promise<NewsArticle> {
    console.log("📰 NewsArticleService.updateStatus() - Calling apiCall(`/admin/news/${id}/status`) with status:", status);
    try {
      const result = await apiCall(`/admin/news/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      console.log("✅ NewsArticleService.updateStatus() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ NewsArticleService.updateStatus() - Error:", error);
      throw error;
    }
  }

  static async getNewsStats(): Promise<{
    total: number;
    published: number;
    draft: number;
    byType: { company: number; government: number; ngo: number };
    byPriority: { low: number; medium: number; high: number; urgent: number };
    totalViews: number;
    totalLikes: number;
    totalComments: number;
  }> {
    console.log("📰 NewsArticleService.getNewsStats() - Calling apiCall('/admin/news/stats')");
    try {
      const result = await apiCall('/admin/news/stats');
      console.log("✅ NewsArticleService.getNewsStats() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ NewsArticleService.getNewsStats() - Error:", error);
      throw error;
    }
  }
} 