import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiCall } from '@/lib/api';

export interface CVData {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    addressLine?: string;
    city?: string;
    state?: string;
    municipality: string;
    department: string;
    country: string;
    birthDate?: Date;
    gender?: string;
    profileImage?: string;
  };
  jobTitle?: string;
  professionalSummary?: string;
  education: {
    level: string;                    // Nivel educativo
    currentInstitution: string;       // Institución actual
    graduationYear: number;           // Año de graduación
    isStudying: boolean;              // Si está estudiando actualmente
    
    // Educación detallada
    educationHistory: EducationHistoryItem[];  // Historial completo
    currentDegree: string;            // Grado actual
    universityName: string;           // Nombre de la universidad
    universityStartDate: string;      // Fecha de inicio en universidad
    universityEndDate: string | null; // Fecha de fin en universidad
    universityStatus: string;         // Estado universitario
    gpa: number;                      // Promedio académico
    academicAchievements: AcademicAchievement[]; // Logros académicos
  };
  skills: {
    name: string;
    experienceLevel?: string;
  }[];
  interests: string[];
  languages: {
    name: string;
    proficiency: string;
  }[];
  socialLinks: {
    platform: string;
    url: string;
  }[];
  workExperience: {
    jobTitle: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  projects: {
    title: string;
    location?: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  activities: {
    title: string;
    organization?: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  achievements: any[];
  certifications: any[];
  targetPosition?: string;
  targetCompany?: string;
  relevantSkills?: string[];
}

// Interfaces adicionales para educación
export interface EducationHistoryItem {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string | null;
  status: string;
  gpa?: number;
}

export interface AcademicAchievement {
  title: string;
  date: string;
  description: string;
  type: string; // "honor", "award", "certification", etc.
}

export interface CoverLetterData {
  template: string;
  content: string;
  recipient: {
    department: string;
    companyName: string; // Changed from company to companyName
    address: string;
    city: string;
    country: string; // Added country field
  };
  subject: string;
}

export interface CreateCVData {
  personalInfo: CVData['personalInfo'];
  jobTitle?: string;
  professionalSummary?: string;
  education: CVData['education'];
  skills: CVData['skills'];
  interests: string[];
  languages: CVData['languages'];
  socialLinks: CVData['socialLinks'];
  workExperience: CVData['workExperience'];
  projects: CVData['projects'];
  activities: CVData['activities'];
  achievements: any[];
  certifications: any[];
  targetPosition?: string;
  targetCompany?: string;
  relevantSkills?: string[];
}

export interface CreateCoverLetterData {
  content: string;
  template?: string;
  recipient?: {
    department: string;
    companyName: string;
    address: string;
    city: string;
    country: string;
  };
  subject?: string;
}

export interface GenerateCVData {
  jobOfferId: string;
}

// Fetch CV
export const useCV = () => {
  return useQuery({
    queryKey: ['cv'],
    queryFn: async () => {
      const data = await apiCall('/cv');
      return data;
    },
  });
};

// Create CV mutation
export const useCreateCV = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (cvData: CreateCVData) => {
      const data = await apiCall('/cv', {
        method: 'POST',
        body: JSON.stringify(cvData),
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cv'] });
    },
  });
};

// Update CV mutation
export const useUpdateCV = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (cvData: Partial<CVData>) => {
      const data = await apiCall('/cv', {
        method: 'PUT',
        body: JSON.stringify(cvData),
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cv'] });
    },
  });
};

// Fetch cover letter
export const useCoverLetter = () => {
  return useQuery({
    queryKey: ['coverLetter'],
    queryFn: async () => {
      const data = await apiCall('/cv/cover-letter');
      return data;
    },
  });
};

// Create cover letter mutation
export const useCreateCoverLetter = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (coverLetterData: CreateCoverLetterData) => {
      const data = await apiCall('/cv/cover-letter', {
        method: 'POST',
        body: JSON.stringify(coverLetterData),
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coverLetter'] });
    },
  });
};

// Generate CV for application mutation
export const useGenerateCVForApplication = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (applicationData: GenerateCVData) => {
      const data = await apiCall('/cv/generate-for-application', {
        method: 'POST',
        body: JSON.stringify(applicationData),
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cv'] });
    },
  });
};
