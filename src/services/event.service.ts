import { apiCall } from '@/lib/api';

export interface Event {
  id: string;
  title: string;
  organizer: string;
  description: string;
  date: string;
  time: string;
  type: 'IN_PERSON' | 'VIRTUAL' | 'HYBRID';
  category: 'NETWORKING' | 'WORKSHOP' | 'SEMINAR' | 'CONFERENCE' | 'TRAINING' | 'OTHER';
  location: string;
  maxCapacity?: number;
  price?: number;
  status: 'DRAFT' | 'PUBLISHED' | 'CANCELLED' | 'COMPLETED';
  imageUrl?: string;
  tags?: string[];
  requirements?: string[];
  agenda?: string[];
  speakers?: string[];
  featured: boolean;
  registrationDeadline?: string;
  viewsCount: number;
  attendeesCount: number;
  attendanceRate: number;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  creator?: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    municipality: string;
    institutionName?: string;
    companyName?: string;
    avatarUrl?: string;
  };
  _count?: {
    attendees: number;
  };
}

export class EventService {
  static async getAll(filters?: {
    municipality?: string;
    category?: string;
    type?: string;
    status?: string;
    featured?: boolean;
    createdBy?: string;
  }): Promise<Event[]> {
    console.log("🎪 EventService.getAll() - Calling apiCall('/events') with filters:", filters);
    try {
      const params = new URLSearchParams();
      if (filters?.municipality) params.append('municipality', filters.municipality);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.type) params.append('type', filters.type);
      if (filters?.status) params.append('status', filters.status);
      if (filters?.featured !== undefined) params.append('featured', filters.featured.toString());
      if (filters?.createdBy) params.append('createdBy', filters.createdBy);

      const url = `/events${params.toString() ? `?${params.toString()}` : ''}`;
      const result = await apiCall(url);
      console.log("✅ EventService.getAll() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ EventService.getAll() - Error:", error);
      throw error;
    }
  }

  static async getById(id: string): Promise<Event> {
    console.log("🎪 EventService.getById() - Calling apiCall(`/events/${id}`)");
    try {
      const result = await apiCall(`/events/${id}`);
      console.log("✅ EventService.getById() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ EventService.getById() - Error:", error);
      throw error;
    }
  }

  static async create(data: Partial<Event> | FormData): Promise<Event> {
    console.log("🎪 EventService.create() - Calling apiCall('/events') with data:", data);
    try {
      const options: any = { method: 'POST' };
      
      if (data instanceof FormData) {
        options.body = data;
      } else {
        options.body = JSON.stringify(data);
      }

      const result = await apiCall('/events', options);
      console.log("✅ EventService.create() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ EventService.create() - Error:", error);
      throw error;
    }
  }

  static async update(id: string, data: Partial<Event> | FormData): Promise<Event> {
    console.log("🎪 EventService.update() - Calling apiCall(`/events/${id}`) with data:", data);
    try {
      const options: any = { method: 'PUT' };
      
      if (data instanceof FormData) {
        options.body = data;
      } else {
        options.body = JSON.stringify(data);
      }

      const result = await apiCall(`/events/${id}`, options);
      console.log("✅ EventService.update() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ EventService.update() - Error:", error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    console.log("🎪 EventService.delete() - Calling apiCall(`/events/${id}`)");
    try {
      await apiCall(`/events/${id}`, { method: 'DELETE' });
      console.log("✅ EventService.delete() - Success");
    } catch (error) {
      console.error("❌ EventService.delete() - Error:", error);
      throw error;
    }
  }

  static async getByStatus(status: string): Promise<Event[]> {
    console.log("🎪 EventService.getByStatus() - Calling apiCall(`/events?status=${status}`)");
    try {
      const result = await apiCall(`/events?status=${status}`);
      console.log("✅ EventService.getByStatus() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ EventService.getByStatus() - Error:", error);
      throw error;
    }
  }

  static async getFeatured(): Promise<Event[]> {
    console.log("🎪 EventService.getFeatured() - Calling apiCall('/events?featured=true')");
    try {
      const result = await apiCall('/events?featured=true');
      console.log("✅ EventService.getFeatured() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ EventService.getFeatured() - Error:", error);
      throw error;
    }
  }

  static async getPublished(): Promise<Event[]> {
    console.log("🎪 EventService.getPublished() - Calling apiCall('/events?status=PUBLISHED')");
    try {
      const result = await apiCall('/events?status=PUBLISHED');
      console.log("✅ EventService.getPublished() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ EventService.getPublished() - Error:", error);
      throw error;
    }
  }

  static async getByMunicipality(municipality: string): Promise<Event[]> {
    console.log("🎪 EventService.getByMunicipality() - Calling apiCall(`/events?municipality=${municipality}`)");
    try {
      const result = await apiCall(`/events?municipality=${encodeURIComponent(municipality)}`);
      console.log("✅ EventService.getByMunicipality() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ EventService.getByMunicipality() - Error:", error);
      throw error;
    }
  }

  static async getByCategory(category: string): Promise<Event[]> {
    console.log("🎪 EventService.getByCategory() - Calling apiCall(`/events?category=${category}`)");
    try {
      const result = await apiCall(`/events?category=${category}`);
      console.log("✅ EventService.getByCategory() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ EventService.getByCategory() - Error:", error);
      throw error;
    }
  }

  static async attend(eventId: string): Promise<void> {
    console.log("🎪 EventService.attend() - Calling apiCall(`/events/${eventId}/attend`)");
    try {
      await apiCall(`/events/${eventId}/attend`, { method: 'POST' });
      console.log("✅ EventService.attend() - Success");
    } catch (error) {
      console.error("❌ EventService.attend() - Error:", error);
      throw error;
    }
  }

  static async unattend(eventId: string): Promise<void> {
    console.log("🎪 EventService.unattend() - Calling apiCall(`/events/${eventId}/unattend`)");
    try {
      await apiCall(`/events/${eventId}/unattend`, { method: 'POST' });
      console.log("✅ EventService.unattend() - Success");
    } catch (error) {
      console.error("❌ EventService.unattend() - Error:", error);
      throw error;
    }
  }

  static async getAttendees(eventId: string): Promise<any[]> {
    console.log("🎪 EventService.getAttendees() - Calling apiCall(`/events/${eventId}/attendees`)");
    try {
      const result = await apiCall(`/events/${eventId}/attendees`);
      console.log("✅ EventService.getAttendees() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ EventService.getAttendees() - Error:", error);
      throw error;
    }
  }

  static async getMyAttendances(): Promise<Event[]> {
    console.log("🎪 EventService.getMyAttendances() - Calling apiCall('/events/my-attendances')");
    try {
      const result = await apiCall('/events/my-attendances');
      console.log("✅ EventService.getMyAttendances() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ EventService.getMyAttendances() - Error:", error);
      throw error;
    }
  }

  static async getStats(): Promise<any> {
    console.log("🎪 EventService.getStats() - Calling apiCall('/events/stats')");
    try {
      const result = await apiCall('/events/stats');
      console.log("✅ EventService.getStats() - Success:", result);
      return result;
    } catch (error) {
      console.error("❌ EventService.getStats() - Error:", error);
      throw error;
    }
  }

  static async updateAttendeeStatus(eventId: string, attendeeId: string, status: string): Promise<void> {
    console.log("🎪 EventService.updateAttendeeStatus() - Calling apiCall(`/events/${eventId}/attendees/${attendeeId}`)");
    try {
      await apiCall(`/events/${eventId}/attendees/${attendeeId}`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      console.log("✅ EventService.updateAttendeeStatus() - Success");
    } catch (error) {
      console.error("❌ EventService.updateAttendeeStatus() - Error:", error);
      throw error;
    }
  }
}