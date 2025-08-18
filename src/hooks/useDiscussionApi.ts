import { useState, useEffect } from "react";
import { DiscussionService } from "@/services/discussion.service";
import { Discussion } from "@/types/courses";

export function useDiscussions() {
  const [data, setData] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    DiscussionService.getAll()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);
  
  return { data, loading, error };
}

export function useDiscussion(id: string) {
  const [data, setData] = useState<Discussion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!id) return;
    DiscussionService.getById(id)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);
  
  return { data, loading, error };
}

export function useCreateDiscussion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const create = async (data: Partial<Discussion>): Promise<Discussion> => {
    setLoading(true);
    setError(null);
    try {
      return await DiscussionService.create(data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };
  
  return { create, loading, error };
}

export function useUpdateDiscussion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const update = async (id: string, data: Partial<Discussion>): Promise<Discussion> => {
    setLoading(true);
    setError(null);
    try {
      return await DiscussionService.update(id, data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };
  
  return { update, loading, error };
}

export function useDeleteDiscussion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const remove = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      return await DiscussionService.delete(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };
  
  return { remove, loading, error };
}

// Hooks específicos para discussions
export function useLessonDiscussions(lessonId: string) {
  const [data, setData] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!lessonId) return;
    DiscussionService.getDiscussionsByLesson(lessonId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [lessonId]);
  
  return { data, loading, error };
}

export function useUserDiscussions(userId: string) {
  const [data, setData] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!userId) return;
    DiscussionService.getDiscussionsByUser(userId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);
  
  return { data, loading, error };
}

export function useDiscussionReplies(discussionId: string) {
  const [data, setData] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!discussionId) return;
    DiscussionService.getReplies(discussionId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [discussionId]);
  
  return { data, loading, error };
}

export function useLikeDiscussion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const like = async (id: string): Promise<Discussion> => {
    setLoading(true);
    setError(null);
    try {
      return await DiscussionService.likeDiscussion(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };
  
  return { like, loading, error };
}

export function useUnlikeDiscussion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const unlike = async (id: string): Promise<Discussion> => {
    setLoading(true);
    setError(null);
    try {
      return await DiscussionService.unlikeDiscussion(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };
  
  return { unlike, loading, error };
} 