import { useState, useEffect } from "react";
import { JobQuestionAnswerService } from "@/services/jobquestionanswer.service";
import { JobQuestionAnswer } from "@/types/jobs";

// Extendemos el tipo para incluir id que probablemente necesite el backend
interface JobQuestionAnswerWithId extends JobQuestionAnswer {
  id: string;
  applicationId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export function useJobQuestionAnswers() {
  const [data, setData] = useState<JobQuestionAnswerWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    JobQuestionAnswerService.getAll()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useJobQuestionAnswer(id: string) {
  const [data, setData] = useState<JobQuestionAnswerWithId | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    JobQuestionAnswerService.getById(id)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}

export function useCreateJobQuestionAnswer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = async (data: Partial<JobQuestionAnswerWithId>): Promise<JobQuestionAnswerWithId> => {
    setLoading(true);
    setError(null);
    try {
      return await JobQuestionAnswerService.create(data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}

export function useUpdateJobQuestionAnswer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = async (id: string, data: Partial<JobQuestionAnswerWithId>): Promise<JobQuestionAnswerWithId> => {
    setLoading(true);
    setError(null);
    try {
      return await JobQuestionAnswerService.update(id, data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}

export function useDeleteJobQuestionAnswer() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      return await JobQuestionAnswerService.delete(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
}

// Hooks específicos para job question answers
export function useJobQuestionAnswersByApplication(applicationId: string) {
  const [data, setData] = useState<JobQuestionAnswerWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!applicationId) return;
    JobQuestionAnswerService.getByApplication(applicationId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [applicationId]);

  return { data, loading, error };
}

export function useJobQuestionAnswersByQuestion(questionId: string) {
  const [data, setData] = useState<JobQuestionAnswerWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!questionId) return;
    JobQuestionAnswerService.getByQuestion(questionId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [questionId]);

  return { data, loading, error };
}

export function useJobQuestionAnswersByJobOffer(jobOfferId: string) {
  const [data, setData] = useState<JobQuestionAnswerWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!jobOfferId) return;
    JobQuestionAnswerService.getByJobOffer(jobOfferId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [jobOfferId]);

  return { data, loading, error };
}

export function useCreateMultipleJobQuestionAnswers() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createMultiple = async (answers: Partial<JobQuestionAnswerWithId>[]): Promise<JobQuestionAnswerWithId[]> => {
    setLoading(true);
    setError(null);
    try {
      return await JobQuestionAnswerService.createMultiple(answers);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { createMultiple, loading, error };
}

export function useAnswersForApplication(applicationId: string) {
  const [data, setData] = useState<JobQuestionAnswerWithId[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!applicationId) return;
    JobQuestionAnswerService.getAnswersForApplication(applicationId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [applicationId]);

  return { data, loading, error };
}

export function useUpdateJobQuestionAnswerText() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateAnswer = async (id: string, answer: string): Promise<JobQuestionAnswerWithId> => {
    setLoading(true);
    setError(null);
    try {
      return await JobQuestionAnswerService.updateAnswer(id, answer);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { updateAnswer, loading, error };
} 