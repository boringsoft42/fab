import { useState, useEffect } from "react";
import { UserService } from "@/services/user.service";

export function useUsers() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  useEffect(() => {
    UserService.getAll().then(setData).catch(setError).finally(() => setLoading(false));
  }, []);
  return { data, loading, error };
}

export function useUser(id: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  useEffect(() => {
    if (!id) return;
    UserService.getById(id).then(setData).catch(setError).finally(() => setLoading(false));
  }, [id]);
  return { data, loading, error };
}

export function useCreateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const create = async (data: any) => {
    setLoading(true);
    setError(null);
    try {
      return await UserService.create(data);
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };
  return { create, loading, error };
}

export function useUpdateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const update = async (id: string, data: any) => {
    setLoading(true);
    setError(null);
    try {
      return await UserService.update(id, data);
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };
  return { update, loading, error };
}

export function useDeleteUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const remove = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      return await UserService.delete(id);
    } catch (e) {
      setError(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };
  return { remove, loading, error };
} 