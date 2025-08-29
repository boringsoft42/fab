import { apiCall } from '@/lib/api';
import { Profile } from '@/types/profile';

// Mock profile data for fallback
const getMockProfile = (): Profile => ({
  id: "mock-profile-1",
  userId: "mock-user-1",
  firstName: "Juan Carlos",
  lastName: "Pérez",
  email: "juan.perez@email.com",
  phone: "+591 700 123 456",
  address: "Av. Principal 123",
  municipality: "La Paz",
  department: "La Paz",
  country: "Bolivia",
  birthDate: new Date("2000-01-15"),
  gender: "MALE",
  educationLevel: "SECONDARY",
  currentInstitution: "Colegio Nacional",
  graduationYear: 2023,
  isStudying: false,
  skills: ["JavaScript", "React", "HTML", "CSS", "Excel", "Word"],
  interests: ["Programación", "Diseño web", "Tecnología", "Música"],
  workExperience: [
    {
      title: "Practicante de Desarrollo Web",
      company: "TechCorp Bolivia",
      period: "Enero 2023 - Marzo 2023",
      description: "Desarrollo de interfaces de usuario con React y JavaScript.",
    },
  ] as any,
  role: "YOUTH",
  avatarUrl: undefined,
  active: true,
  status: "ACTIVE",
  profileCompletion: 85,
  parentalConsent: false,
  createdAt: new Date(),
  updatedAt: new Date(),
});

const getMockProfiles = (): Profile[] => [
  getMockProfile(),
  {
    id: "mock-profile-2",
    userId: "mock-user-2",
    firstName: "María",
    lastName: "González",
    email: "maria.gonzalez@email.com",
    phone: "+591 700 654 321",
    address: "Calle Comercio 456",
    municipality: "Cochabamba",
    department: "Cochabamba",
    country: "Bolivia",
    birthDate: new Date("1999-05-20"),
    gender: "FEMALE",
    educationLevel: "UNIVERSITY",
    currentInstitution: "Universidad Mayor de San Simón",
    graduationYear: 2024,
    isStudying: true,
    skills: ["Python", "Django", "SQL", "Git", "Linux"],
    interests: ["Inteligencia Artificial", "Ciencia de Datos", "Lectura"],
    workExperience: [] as any,
    role: "YOUTH",
    avatarUrl: undefined,
    active: true,
    status: "ACTIVE",
    profileCompletion: 75,
    parentalConsent: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export class ProfileService {
  static async getAll(): Promise<Profile[]> {
    try {
      console.log("👤 ProfileService.getAll - Attempting API call");
      const result = await apiCall('/profile');
      console.log("👤 ProfileService.getAll - API call successful:", result);
      return result.profiles || result;
    } catch (error) {
      console.error("👤 ProfileService.getAll - API call failed, using mock data:", error);
      return getMockProfiles();
    }
  }

  static async getById(id: string): Promise<Profile> {
    try {
      console.log("👤 ProfileService.getById - Attempting API call for ID:", id);
      const result = await apiCall(`/profile/${id}`);
      console.log("👤 ProfileService.getById - API call successful:", result);
      return result;
    } catch (error) {
      console.error("👤 ProfileService.getById - API call failed, using mock data:", error);
      return getMockProfile();
    }
  }

  static async create(data: Partial<Profile>): Promise<Profile> {
    try {
      console.log("👤 ProfileService.create - Attempting API call");
      const result = await apiCall('/profile', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      console.log("👤 ProfileService.create - API call successful:", result);
      return result;
    } catch (error) {
      console.error("👤 ProfileService.create - API call failed:", error);
      throw error;
    }
  }

  static async update(id: string, data: Partial<Profile>): Promise<Profile> {
    try {
      console.log("👤 ProfileService.update - Attempting API call for ID:", id);
      const result = await apiCall(`/profile/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      });
      console.log("👤 ProfileService.update - API call successful:", result);
      return result;
    } catch (error) {
      console.error("👤 ProfileService.update - API call failed:", error);
      throw error;
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      console.log("👤 ProfileService.delete - Attempting API call for ID:", id);
      await apiCall(`/profile/${id}`, { method: 'DELETE' });
      console.log("👤 ProfileService.delete - API call successful");
    } catch (error) {
      console.error("👤 ProfileService.delete - API call failed:", error);
      throw error;
    }
  }

  // Métodos específicos para profiles
  static async getCurrentProfile(): Promise<Profile> {
    try {
      console.log("👤 ProfileService.getCurrentProfile - Attempting API call");
      
      // Try the external API first - using the new /profile/me endpoint
      try {
        const result = await apiCall('/profile/me');
        console.log("👤 ProfileService.getCurrentProfile - External API call successful:", result);
        return result;
      } catch (externalError) {
        console.log("👤 ProfileService.getCurrentProfile - External API failed, trying CV endpoint");
        
        // Try the CV endpoint as second option
        try {
          const cvResult = await apiCall('/cv');
          console.log("👤 ProfileService.getCurrentProfile - CV API call successful:", cvResult);
          
          // Transform CV data to Profile format
          const profile: Profile = {
            id: "current-user",
            userId: "current-user",
            firstName: cvResult.personalInfo?.firstName || "",
            lastName: cvResult.personalInfo?.lastName || "",
            email: cvResult.personalInfo?.email || "",
            phone: cvResult.personalInfo?.phone || "",
            address: cvResult.personalInfo?.address || "",
            municipality: cvResult.personalInfo?.municipality || "",
            department: cvResult.personalInfo?.department || "",
            country: cvResult.personalInfo?.country || "Bolivia",
            birthDate: cvResult.personalInfo?.birthDate ? new Date(cvResult.personalInfo.birthDate) : undefined,
            gender: cvResult.personalInfo?.gender || "",
            educationLevel: cvResult.education?.level || "SECONDARY",
            currentInstitution: cvResult.education?.institution || "",
            graduationYear: cvResult.education?.graduationYear,
            isStudying: cvResult.education?.isStudying || false,
            skills: cvResult.skills || [],
            interests: cvResult.interests || [],
            workExperience: cvResult.workExperience || [],
            role: "YOUTH",
            avatarUrl: cvResult.profileImage,
            active: true,
            status: "ACTIVE",
            profileCompletion: 85,
            parentalConsent: false,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          
          return profile;
        } catch (cvError) {
          console.log("👤 ProfileService.getCurrentProfile - CV API failed, trying Next.js API");
          
          // Try the Next.js API as final fallback
          const result = await apiCall('/profile');
          console.log("👤 ProfileService.getCurrentProfile - Next.js API call successful:", result);
          return result;
        }
      }
    } catch (error) {
      console.error("👤 ProfileService.getCurrentProfile - All API calls failed, using mock data:", error);
      // Return mock data as fallback
      return getMockProfile();
    }
  }

  static async updateCurrentProfile(data: Partial<Profile>): Promise<Profile> {
    try {
      console.log("👤 ProfileService.updateCurrentProfile - Attempting API call");
      
      // Try the external API first - using the new /profile/me endpoint
      try {
        const result = await apiCall('/profile/me', {
          method: 'PUT',
          body: JSON.stringify(data)
        });
        console.log("👤 ProfileService.updateCurrentProfile - External API call successful:", result);
        return result;
      } catch (externalError) {
        console.log("👤 ProfileService.updateCurrentProfile - External API failed, trying CV endpoint");
        
        // Try the CV endpoint as second option
        try {
          const result = await apiCall('/cv', {
            method: 'PUT',
            body: JSON.stringify(data)
          });
          console.log("👤 ProfileService.updateCurrentProfile - CV API call successful:", result);
          return result;
        } catch (cvError) {
          console.log("👤 ProfileService.updateCurrentProfile - CV API failed, trying Next.js API");
          
          // Try the Next.js API as final fallback
          const result = await apiCall('/profile', {
            method: 'PUT',
            body: JSON.stringify(data)
          });
          console.log("👤 ProfileService.updateCurrentProfile - Next.js API call successful:", result);
          return result;
        }
      }
    } catch (error) {
      console.error("👤 ProfileService.updateCurrentProfile - All API calls failed:", error);
      // Return updated mock data as fallback
      const mockProfile = getMockProfile();
      return { ...mockProfile, ...data };
    }
  }

  static async getByRole(role: string): Promise<Profile[]> {
    try {
      console.log("👤 ProfileService.getByRole - Attempting API call for role:", role);
      const result = await apiCall(`/profile?role=${role}`);
      console.log("👤 ProfileService.getByRole - API call successful:", result);
      return result.profiles || result;
    } catch (error) {
      console.error("👤 ProfileService.getByRole - API call failed, using mock data:", error);
      return getMockProfiles().filter(profile => profile.role === role);
    }
  }

  static async searchProfiles(query: string): Promise<Profile[]> {
    try {
      console.log("👤 ProfileService.searchProfiles - Attempting API call for query:", query);
      const result = await apiCall(`/profile?search=${encodeURIComponent(query)}`);
      console.log("👤 ProfileService.searchProfiles - API call successful:", result);
      return result.profiles || result;
    } catch (error) {
      console.error("👤 ProfileService.searchProfiles - API call failed, using mock data:", error);
      const mockProfiles = getMockProfiles();
      const searchTerm = query.toLowerCase();
      return mockProfiles.filter(profile => 
        profile.firstName?.toLowerCase().includes(searchTerm) ||
        profile.lastName?.toLowerCase().includes(searchTerm) ||
        profile.email?.toLowerCase().includes(searchTerm)
      );
    }
  }

  static async getByMunicipality(municipality: string): Promise<Profile[]> {
    try {
      console.log("👤 ProfileService.getByMunicipality - Attempting API call for municipality:", municipality);
      const result = await apiCall(`/profile?municipality=${encodeURIComponent(municipality)}`);
      console.log("👤 ProfileService.getByMunicipality - API call successful:", result);
      return result.profiles || result;
    } catch (error) {
      console.error("👤 ProfileService.getByMunicipality - API call failed, using mock data:", error);
      return getMockProfiles().filter(profile => profile.municipality === municipality);
    }
  }

  static async getByDepartment(department: string): Promise<Profile[]> {
    try {
      console.log("👤 ProfileService.getByDepartment - Attempting API call for department:", department);
      const result = await apiCall(`/profile?department=${encodeURIComponent(department)}`);
      console.log("👤 ProfileService.getByDepartment - API call successful:", result);
      return result.profiles || result;
    } catch (error) {
      console.error("👤 ProfileService.getByDepartment - API call failed, using mock data:", error);
      return getMockProfiles().filter(profile => profile.department === department);
    }
  }

  static async getActiveProfiles(): Promise<Profile[]> {
    try {
      console.log("👤 ProfileService.getActiveProfiles - Attempting API call");
      const result = await apiCall('/profile?active=true');
      console.log("👤 ProfileService.getActiveProfiles - API call successful:", result);
      return result.profiles || result;
    } catch (error) {
      console.error("👤 ProfileService.getActiveProfiles - API call failed, using mock data:", error);
      return getMockProfiles().filter(profile => profile.active);
    }
  }

  static async getProfileCompletion(id: string): Promise<{
    completionPercentage: number;
    missingFields: string[];
  }> {
    try {
      console.log("👤 ProfileService.getProfileCompletion - Attempting API call for ID:", id);
      const result = await apiCall(`/profile/${id}/completion`);
      console.log("👤 ProfileService.getProfileCompletion - API call successful:", result);
      return result;
    } catch (error) {
      console.error("👤 ProfileService.getProfileCompletion - API call failed, using mock data:", error);
      return {
        completionPercentage: 85,
        missingFields: ["certifications", "languages"]
      };
    }
  }

  static async uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
    try {
      console.log("👤 ProfileService.uploadAvatar - Attempting API call");
      const formData = new FormData();
      formData.append('avatar', file);
      
      const result = await apiCall('/files/upload/profile-image', {
        method: 'POST',
        body: formData,
        headers: {} // Let browser set Content-Type for FormData
      });
      console.log("👤 ProfileService.uploadAvatar - API call successful:", result);
      return result;
    } catch (error) {
      console.error("👤 ProfileService.uploadAvatar - API call failed:", error);
      throw error;
    }
  }

  static async deleteAvatar(): Promise<void> {
    try {
      console.log("👤 ProfileService.deleteAvatar - Attempting API call");
      await apiCall('/profile/avatar', { method: 'DELETE' });
      console.log("👤 ProfileService.deleteAvatar - API call successful");
    } catch (error) {
      console.error("👤 ProfileService.deleteAvatar - API call failed:", error);
      throw error;
    }
  }
} 