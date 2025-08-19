import { useState, useEffect } from "react";
import { JobApplicationService } from "@/services/job-application.service";
import { JobApplication } from "@/types/jobs";

export function useJobApplications() {
  const [data, setData] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    JobApplicationService.getAll()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useJobApplication(id: string) {
  const [data, setData] = useState<JobApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) return;
    JobApplicationService.getById(id)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { data, loading, error };
}

export function useCreateJobApplication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const create = async (data: Partial<JobApplication>): Promise<JobApplication> => {
    setLoading(true);
    setError(null);
    try {
      return await JobApplicationService.create(data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
}

export function useUpdateJobApplication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const update = async (id: string, data: Partial<JobApplication>): Promise<JobApplication> => {
    setLoading(true);
    setError(null);
    try {
      return await JobApplicationService.update(id, data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
}

export function useDeleteJobApplication() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const remove = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      return await JobApplicationService.delete(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { remove, loading, error };
}

// Hooks específicos para job applications
export function useJobApplicationsByApplicant(applicantId: string) {
  const [data, setData] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!applicantId) return;
    JobApplicationService.getByApplicant(applicantId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [applicantId]);

  return { data, loading, error };
}

export function useJobApplicationsByJob(jobId: string) {
  const [data, setData] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!jobId) return;
    JobApplicationService.getByJob(jobId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [jobId]);

  return { data, loading, error };
}

export function useJobApplicationsByStatus(status: string) {
  const [data, setData] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!status) return;
    JobApplicationService.getByStatus(status)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [status]);

  return { data, loading, error };
}

export function useMyJobApplications() {
  const [data, setData] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    console.log("🔍 useMyJobApplications - Starting to fetch data...");
    JobApplicationService.getUserApplications()
      .then((result) => {
        console.log("🔍 useMyJobApplications - Raw result:", result);
        
        // Handle the correct response structure: {items: [], pagination: {}}
        let applicationsArray: JobApplication[] = [];
        
        if (Array.isArray(result)) {
          applicationsArray = result;
        } else if (result && Array.isArray(result.items)) {
          applicationsArray = result.items;
        } else if (result && Array.isArray(result.applications)) {
          applicationsArray = result.applications;
        } else if (result && Array.isArray(result.data)) {
          applicationsArray = result.data;
        }
        
        console.log("🔍 useMyJobApplications - Processed array:", applicationsArray);
        setData(applicationsArray);
      })
      .catch((error) => {
        console.error("🔍 useMyJobApplications - Error:", error);
        setError(error);
      })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading, error };
}

export function useCompanyJobApplications(companyId: string) {
  const [data, setData] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!companyId) return;
    JobApplicationService.getCompanyApplications(companyId)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [companyId]);

  return { data, loading, error };
}

export function useUpdateJobApplicationStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateStatus = async (id: string, status: string, notes?: string, rating?: number): Promise<JobApplication> => {
    setLoading(true);
    setError(null);
    try {
      return await JobApplicationService.updateStatus(id, status, notes, rating);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  return { updateStatus, loading, error };
} 