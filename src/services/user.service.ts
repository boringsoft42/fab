import { API_BASE } from '@/lib/api';

export class UserService {
  static async getAll() {
    const res = await fetch(`${API_BASE}/user`);
    return res.json();
  }
  static async getById(id: string) {
    const res = await fetch(`${API_BASE}/user/${id}`);
    return res.json();
  }
  static async create(data: any) {
    const res = await fetch(`${API_BASE}/user`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }
  static async update(id: string, data: any) {
    const res = await fetch(`${API_BASE}/user/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.json();
  }
  static async delete(id: string) {
    await fetch(`${API_BASE}/user/${id}`, { method: "DELETE" });
  }
} 