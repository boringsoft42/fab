import { useState, useEffect } from "react";
import { NewsCommentService } from "@/services/newscomment.service";
import { NewsComment } from "@/types/news";

export function useNewsComments() {
  const [data, setData] = useState<NewsComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    NewsCommentService.getAll()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useNewsComment(id: string) {
  const [data, setData] = useState<NewsComment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    NewsCommentService.getById(id)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}

export function useCreateNewsComment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = async (data: Partial<NewsComment>): Promise<NewsComment> => {
    setLoading(true);
    setError(null);
    try {
      return await NewsCommentService.create(data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}

export function useUpdateNewsComment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = async (id: string, data: Partial<NewsComment>): Promise<NewsComment> => {
    setLoading(true);
    setError(null);
    try {
      return await NewsCommentService.update(id, data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}

export function useDeleteNewsComment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      return await NewsCommentService.delete(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
}

// Hooks específicos para news comments
export function useNewsCommentsByNews(newsId: string) {
  const [data, setData] = useState<NewsComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!newsId) return;
    NewsCommentService.getByNews(newsId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [newsId]);

  return { data, loading, error };
}

export function useNewsCommentsByUser(userId: string) {
  const [data, setData] = useState<NewsComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;
    NewsCommentService.getByUser(userId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);

  return { data, loading, error };
}

export function useCommentReplies(commentId: string) {
  const [data, setData] = useState<NewsComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!commentId) return;
    NewsCommentService.getReplies(commentId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [commentId]);

  return { data, loading, error };
}

export function useTopLevelComments(newsId: string) {
  const [data, setData] = useState<NewsComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!newsId) return;
    NewsCommentService.getTopLevelComments(newsId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [newsId]);

  return { data, loading, error };
}

export function useLikeComment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const like = async (commentId: string): Promise<NewsComment> => {
    setLoading(true);
    setError(null);
    try {
      return await NewsCommentService.likeComment(commentId);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { like, loading, error };
}

export function useUnlikeComment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const unlike = async (commentId: string): Promise<NewsComment> => {
    setLoading(true);
    setError(null);
    try {
      return await NewsCommentService.unlikeComment(commentId);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { unlike, loading, error };
}

export function useReplyToComment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reply = async (parentId: string, data: Partial<NewsComment>): Promise<NewsComment> => {
    setLoading(true);
    setError(null);
    try {
      return await NewsCommentService.replyToComment(parentId, data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { reply, loading, error };
}

export function useCommentStats(newsId: string) {
  const [data, setData] = useState<{
    totalComments: number;
    totalReplies: number;
    topCommenters: Array<{
      userId: string;
      userName: string;
      commentCount: number;
    }>;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!newsId) return;
    NewsCommentService.getCommentStats(newsId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [newsId]);

  return { data, loading, error };
}

export function useModerateComment() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const moderate = async (commentId: string, action: 'approve' | 'reject' | 'delete'): Promise<NewsComment> => {
    setLoading(true);
    setError(null);
    try {
      return await NewsCommentService.moderateComment(commentId, action);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { moderate, loading, error };
}

export function useMyComments() {
  const [data, setData] = useState<NewsComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    NewsCommentService.getMyComments()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useSearchComments() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const search = async (query: string): Promise<NewsComment[]> => {
    setLoading(true);
    setError(null);
    try {
      return await NewsCommentService.searchComments(query);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { search, loading, error };
} 