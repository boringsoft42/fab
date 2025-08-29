"use client";

import { useState, useEffect } from "react";
import { CertificateService } from "@/services/certificate.service";
import { Certificate } from "@/types/api";

export function useCertificates() {
  const [data, setData] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    CertificateService.getAll()
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);
  
  return { data, loading, error };
}

export function useCertificate(id: string) {
  const [data, setData] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  useEffect(() => {
    if (!id) return;
    CertificateService.getById(id)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);
  
  return { data, loading, error };
}

export function useCreateCertificate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const create = async (data: Partial<Certificate>): Promise<Certificate> => {
    setLoading(true);
    setError(null);
    try {
      return await CertificateService.create(data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };
  
  return { create, loading, error };
}

export function useUpdateCertificate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const update = async (id: string, data: Partial<Certificate>): Promise<Certificate> => {
    setLoading(true);
    setError(null);
    try {
      return await CertificateService.update(id, data);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };
  
  return { update, loading, error };
}

export function useDeleteCertificate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const remove = async (id: string): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      return await CertificateService.delete(id);
    } catch (e) {
      setError(e as Error);
      throw e;
    } finally {
      setLoading(false);
    }
  };
  
  return { remove, loading, error };
} 