import { useState, useEffect } from "react";
import { JobQuestionService } from "@/services/job-question.service";
import { JobQuestion } from "@/types/jobs";

export function useJobQuestions() {
  const [data, setData] = useState<JobQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    JobQuestionService.getAll()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useJobQuestion(id: string) {
  const [data, setData] = useState<JobQuestion | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    JobQuestionService.getById(id)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}

export function useCreateJobQuestion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = async (data: Partial<JobQuestion>): Promise<JobQuestion> => {
    setLoading(true);
    setError(null);
    try {
      return await JobQuestionService.create(data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}

export function useUpdateJobQuestion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = async (id: string, data: Partial<JobQuestion>): Promise<JobQuestion> => {
    setLoading(true);
    setError(null);
    try {
      return await JobQuestionService.update(id, data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}

export function useDeleteJobQuestion() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      return await JobQuestionService.delete(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
}

// Hooks específicos para job questions
export function useJobQuestionsByJobOffer(jobOfferId: string) {
  const [data, setData] = useState<JobQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!jobOfferId) return;
    JobQuestionService.getByJobOffer(jobOfferId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [jobOfferId]);

  return { data, loading, error };
}

export function useRequiredJobQuestions() {
  const [data, setData] = useState<JobQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    JobQuestionService.getRequired()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useJobQuestionsByType(type: string) {
  const [data, setData] = useState<JobQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!type) return;
    JobQuestionService.getByType(type)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [type]);

  return { data, loading, error };
}

export function useCreateMultipleJobQuestions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createMultiple = async (questions: Partial<JobQuestion>[]): Promise<JobQuestion[]> => {
    setLoading(true);
    setError(null);
    try {
      return await JobQuestionService.createMultiple(questions);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { createMultiple, loading, error };
}

export function useReorderJobQuestions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const reorder = async (jobOfferId: string, questionIds: string[]): Promise<JobQuestion[]> => {
    setLoading(true);
    setError(null);
    try {
      return await JobQuestionService.reorderQuestions(jobOfferId, questionIds);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { reorder, loading, error };
} 