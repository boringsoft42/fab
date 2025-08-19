import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { NewsArticleService } from "@/services/newsarticle.service";
import { NewsArticle } from "@/types/news";

// Query keys
const NEWS_KEYS = {
  all: ['news'] as const,
  lists: () => [...NEWS_KEYS.all, 'list'] as const,
  list: (filters: string) => [...NEWS_KEYS.lists(), { filters }] as const,
  details: () => [...NEWS_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...NEWS_KEYS.details(), id] as const,
  stats: () => [...NEWS_KEYS.all, 'stats'] as const,
  public: () => [...NEWS_KEYS.all, 'public'] as const,
  author: (authorId: string) => [...NEWS_KEYS.all, 'author', authorId] as const,
};

// Get all news articles (mis noticias para empresas/municipios)
export const useNewsArticles = () => {
  return useQuery({
    queryKey: NEWS_KEYS.lists(),
    queryFn: async () => {
      console.log("📰 useNewsArticles - Calling NewsArticleService.getAll()");
      try {
        const result = await NewsArticleService.getAll();
        console.log("✅ useNewsArticles - Success:", result);
        return result;
      } catch (error) {
        console.error("❌ useNewsArticles - Error:", error);
        throw error;
      }
    },
  });
};

// Get news article by ID
export const useNewsArticle = (id: string) => {
  return useQuery({
    queryKey: NEWS_KEYS.detail(id),
    queryFn: async () => {
      console.log("📰 useNewsArticle - Calling NewsArticleService.getById() with id:", id);
      try {
        const result = await NewsArticleService.getById(id);
        console.log("✅ useNewsArticle - Success:", result);
        return result;
      } catch (error) {
        console.error("❌ useNewsArticle - Error:", error);
        throw error;
      }
    },
    enabled: !!id,
  });
};

// Create news article
export const useCreateNewsArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<NewsArticle>) => {
      console.log("📰 useCreateNewsArticle - Calling NewsArticleService.create() with data:", data);
      try {
        const result = await NewsArticleService.create(data);
        console.log("✅ useCreateNewsArticle - Success:", result);
        return result;
      } catch (error) {
        console.error("❌ useCreateNewsArticle - Error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log("🔄 useCreateNewsArticle - Invalidating queries");
      queryClient.invalidateQueries({ queryKey: NEWS_KEYS.lists() });
    },
  });
};

// Create news article with image
export const useCreateNewsArticleWithImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: FormData) => {
      console.log("📰 useCreateNewsArticleWithImage - Calling NewsArticleService.createWithImage()");
      try {
        const result = await NewsArticleService.createWithImage(formData);
        console.log("✅ useCreateNewsArticleWithImage - Success:", result);
        return result;
      } catch (error) {
        console.error("❌ useCreateNewsArticleWithImage - Error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log("🔄 useCreateNewsArticleWithImage - Invalidating queries");
      queryClient.invalidateQueries({ queryKey: NEWS_KEYS.lists() });
      // Invalidate all author queries to refresh the table
      queryClient.invalidateQueries({ queryKey: NEWS_KEYS.all });
    },
  });
};

// Update news article
export const useUpdateNewsArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<NewsArticle> }) => {
      console.log("📰 useUpdateNewsArticle - Calling NewsArticleService.update() with id:", id, "data:", data);
      try {
        const result = await NewsArticleService.update(id, data);
        console.log("✅ useUpdateNewsArticle - Success:", result);
        return result;
      } catch (error) {
        console.error("❌ useUpdateNewsArticle - Error:", error);
        throw error;
      }
    },
    onSuccess: (_, { id }) => {
      console.log("🔄 useUpdateNewsArticle - Invalidating queries");
      queryClient.invalidateQueries({ queryKey: NEWS_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: NEWS_KEYS.detail(id) });
    },
  });
};

// Update news article with image
export const useUpdateNewsArticleWithImage = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      console.log("📰 useUpdateNewsArticleWithImage - Calling NewsArticleService.updateWithImage() with id:", id);
      try {
        const result = await NewsArticleService.updateWithImage(id, formData);
        console.log("✅ useUpdateNewsArticleWithImage - Success:", result);
        return result;
      } catch (error) {
        console.error("❌ useUpdateNewsArticleWithImage - Error:", error);
        throw error;
      }
    },
    onSuccess: (_, { id }) => {
      console.log("🔄 useUpdateNewsArticleWithImage - Invalidating queries");
      queryClient.invalidateQueries({ queryKey: NEWS_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: NEWS_KEYS.detail(id) });
      // Invalidate all author queries to refresh the table
      queryClient.invalidateQueries({ queryKey: NEWS_KEYS.all });
    },
  });
};

// Delete news article
export const useDeleteNewsArticle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log("📰 useDeleteNewsArticle - Calling NewsArticleService.delete() with id:", id);
      try {
        await NewsArticleService.delete(id);
        console.log("✅ useDeleteNewsArticle - Success");
      } catch (error) {
        console.error("❌ useDeleteNewsArticle - Error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log("🔄 useDeleteNewsArticle - Invalidating queries");
      queryClient.invalidateQueries({ queryKey: NEWS_KEYS.lists() });
      // Invalidate all author queries to refresh the table
      queryClient.invalidateQueries({ queryKey: NEWS_KEYS.all });
    },
  });
};

// Get news by type
export const useNewsByType = (type: string) => {
  return useQuery({
    queryKey: [...NEWS_KEYS.lists(), 'type', type],
    queryFn: async () => {
      console.log("📰 useNewsByType - Calling NewsArticleService.getByType() with type:", type);
      try {
        const result = await NewsArticleService.getByType(type);
        console.log("✅ useNewsByType - Success:", result);
        return result;
      } catch (error) {
        console.error("❌ useNewsByType - Error:", error);
        throw error;
      }
    },
    enabled: !!type,
  });
};

// Get news by category
export const useNewsByCategory = (category: string) => {
  return useQuery({
    queryKey: [...NEWS_KEYS.lists(), 'category', category],
    queryFn: async () => {
      console.log("📰 useNewsByCategory - Calling NewsArticleService.getByCategory() with category:", category);
      try {
        const result = await NewsArticleService.getByCategory(category);
        console.log("✅ useNewsByCategory - Success:", result);
        return result;
      } catch (error) {
        console.error("❌ useNewsByCategory - Error:", error);
        throw error;
      }
    },
    enabled: !!category,
  });
};

// Get news by status
export const useNewsByStatus = (status: string) => {
  return useQuery({
    queryKey: [...NEWS_KEYS.lists(), 'status', status],
    queryFn: async () => {
      console.log("📰 useNewsByStatus - Calling NewsArticleService.getByStatus() with status:", status);
      try {
        const result = await NewsArticleService.getByStatus(status);
        console.log("✅ useNewsByStatus - Success:", result);
        return result;
      } catch (error) {
        console.error("❌ useNewsByStatus - Error:", error);
        throw error;
      }
    },
    enabled: !!status,
  });
};

// Get featured news
export const useFeaturedNews = () => {
  return useQuery({
    queryKey: [...NEWS_KEYS.lists(), 'featured'],
    queryFn: async () => {
      console.log("📰 useFeaturedNews - Calling NewsArticleService.getFeatured()");
      try {
        const result = await NewsArticleService.getFeatured();
        console.log("✅ useFeaturedNews - Success:", result);
        return result;
      } catch (error) {
        console.error("❌ useFeaturedNews - Error:", error);
        throw error;
      }
    },
  });
};

// Get published news
export const usePublishedNews = () => {
  return useQuery({
    queryKey: [...NEWS_KEYS.lists(), 'published'],
    queryFn: async () => {
      console.log("📰 usePublishedNews - Calling NewsArticleService.getPublished()");
      try {
        const result = await NewsArticleService.getPublished();
        console.log("✅ usePublishedNews - Success:", result);
        return result;
      } catch (error) {
        console.error("❌ usePublishedNews - Error:", error);
        throw error;
      }
    },
  });
};

// Search news
export const useSearchNews = (query: string) => {
  return useQuery({
    queryKey: [...NEWS_KEYS.lists(), 'search', query],
    queryFn: async () => {
      console.log("📰 useSearchNews - Calling NewsArticleService.searchNews() with query:", query);
      try {
        const result = await NewsArticleService.searchNews(query);
        console.log("✅ useSearchNews - Success:", result);
        return result;
      } catch (error) {
        console.error("❌ useSearchNews - Error:", error);
        throw error;
      }
    },
    enabled: !!query,
  });
};

// Get news by author
export const useNewsByAuthor = (authorId: string) => {
  return useQuery({
    queryKey: NEWS_KEYS.author(authorId),
    queryFn: async () => {
      console.log("📰 useNewsByAuthor - Calling NewsArticleService.getByAuthor() with authorId:", authorId);
      try {
        const result = await NewsArticleService.getByAuthor(authorId);
        console.log("✅ useNewsByAuthor - Success:", result);
        return result;
      } catch (error) {
        console.error("❌ useNewsByAuthor - Error:", error);
        throw error;
      }
    },
    enabled: !!authorId,
  });
};

// Get public news (para jóvenes)
export const usePublicNews = () => {
  return useQuery({
    queryKey: NEWS_KEYS.public(),
    queryFn: async () => {
      console.log("📰 usePublicNews - Calling NewsArticleService.getPublicNews()");
      try {
        const result = await NewsArticleService.getPublicNews();
        console.log("✅ usePublicNews - Success:", result);
        return result;
      } catch (error) {
        console.error("❌ usePublicNews - Error:", error);
        throw error;
      }
    },
  });
};

// Get news stats
export const useNewsStats = () => {
  return useQuery({
    queryKey: NEWS_KEYS.stats(),
    queryFn: async () => {
      console.log("📰 useNewsStats - Calling NewsArticleService.getNewsStats()");
      try {
        const result = await NewsArticleService.getNewsStats();
        console.log("✅ useNewsStats - Success:", result);
        return result;
      } catch (error) {
        console.error("❌ useNewsStats - Error:", error);
        throw error;
      }
    },
  });
};

// Increment views
export const useIncrementViews = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log("📰 useIncrementViews - Calling NewsArticleService.incrementViews() with id:", id);
      try {
        const result = await NewsArticleService.incrementViews(id);
        console.log("✅ useIncrementViews - Success:", result);
        return result;
      } catch (error) {
        console.error("❌ useIncrementViews - Error:", error);
        throw error;
      }
    },
    onSuccess: (_, id) => {
      console.log("🔄 useIncrementViews - Invalidating queries");
      queryClient.invalidateQueries({ queryKey: NEWS_KEYS.detail(id) });
    },
  });
};

// Toggle featured
export const useToggleFeatured = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log("📰 useToggleFeatured - Calling NewsArticleService.toggleFeatured() with id:", id);
      try {
        const result = await NewsArticleService.toggleFeatured(id);
        console.log("✅ useToggleFeatured - Success:", result);
        return result;
      } catch (error) {
        console.error("❌ useToggleFeatured - Error:", error);
        throw error;
      }
    },
    onSuccess: (_, id) => {
      console.log("🔄 useToggleFeatured - Invalidating queries");
      queryClient.invalidateQueries({ queryKey: NEWS_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: NEWS_KEYS.detail(id) });
      // Invalidate all author queries to refresh the table
      queryClient.invalidateQueries({ queryKey: NEWS_KEYS.all });
    },
  });
};

// Update status
export const useUpdateNewsStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      console.log("📰 useUpdateNewsStatus - Calling NewsArticleService.updateStatus() with id:", id, "status:", status);
      try {
        const result = await NewsArticleService.updateStatus(id, status);
        console.log("✅ useUpdateNewsStatus - Success:", result);
        return result;
      } catch (error) {
        console.error("❌ useUpdateNewsStatus - Error:", error);
        throw error;
      }
    },
    onSuccess: (_, { id }) => {
      console.log("🔄 useUpdateNewsStatus - Invalidating queries");
      queryClient.invalidateQueries({ queryKey: NEWS_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: NEWS_KEYS.detail(id) });
      // Invalidate all author queries to refresh the table
      queryClient.invalidateQueries({ queryKey: NEWS_KEYS.all });
    },
  });
}; 