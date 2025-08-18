import { useState, useEffect } from "react";
import { getAuthHeaders } from "@/lib/api";

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

export function useCV() {
  const [cvData, setCvData] = useState<CVData | null>(null);
  const [coverLetterData, setCoverLetterData] = useState<CoverLetterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Obtener datos del CV
  const fetchCVData = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/cv", {
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        const data = await response.json();
        setCvData(data);
      } else {
        // Usar datos mock si no hay datos del API
        setCvData(getMockCVData());
      }
    } catch (error) {
      console.error("Error fetching CV data:", error);
      setError(error as Error);
      setCvData(getMockCVData());
    } finally {
      setLoading(false);
    }
  };

  // Actualizar datos del CV
  const updateCVData = async (data: Partial<CVData>) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/cv", {
        method: "PUT",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setCvData(updatedData.profile);
        return updatedData;
      } else {
        throw new Error("Error updating CV data");
      }
    } catch (error) {
      console.error("Error updating CV data:", error);
      setError(error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Obtener carta de presentación
  const fetchCoverLetterData = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/cv/cover-letter", {
        headers: getAuthHeaders(),
      });
      
      if (response.ok) {
        const data = await response.json();
        setCoverLetterData(data);
      } else {
        // Usar datos mock si no hay datos del API
        setCoverLetterData(getMockCoverLetterData());
      }
    } catch (error) {
      console.error("Error fetching cover letter data:", error);
      setError(error as Error);
      setCoverLetterData(getMockCoverLetterData());
    } finally {
      setLoading(false);
    }
  };

  // Guardar carta de presentación
  const saveCoverLetterData = async (
    content: string, 
    template: string = "default",
    recipient?: {
      department: string;
      companyName: string; // Changed from company to companyName to match backend
      address: string;
      city: string;
      country: string; // Added country field
    },
    subject?: string
  ) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/cv/cover-letter", {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, template, recipient, subject }),
      });

      if (response.ok) {
        const data = await response.json();
        setCoverLetterData(data.coverLetter);
        return data;
      } else {
        throw new Error("Error saving cover letter data");
      }
    } catch (error) {
      console.error("Error saving cover letter data:", error);
      setError(error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Generar CV para postulación específica
  const generateCVForApplication = async (jobOfferId: string) => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/api/cv/generate-for-application", {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ jobOfferId }),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error("Error generating CV for application");
      }
    } catch (error) {
      console.error("Error generating CV for application:", error);
      setError(error as Error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Datos mock para el CV
  const getMockCVData = (): CVData => ({
    personalInfo: {
      firstName: "Juan Carlos",
      lastName: "Pérez",
      email: "juan.perez@email.com",
      phone: "+591 700 123 456",
      address: "Av. Principal 123",
      addressLine: "Av. Principal 123",
      city: "La Paz",
      state: "La Paz",
      municipality: "La Paz",
      department: "La Paz",
      country: "Bolivia",
      profileImage: "https://via.placeholder.com/400x400/3B82F6/FFFFFF?text=JC",
    },
    jobTitle: "Desarrollador Frontend",
    professionalSummary: "Joven profesional con sólidos conocimientos en desarrollo web y tecnologías modernas. Comprometido con el aprendizaje continuo y el desarrollo de soluciones innovadoras.",
    education: {
      level: "SECONDARY",
      currentInstitution: "Colegio Nacional",
      graduationYear: 2023,
      isStudying: false,
      educationHistory: [
        {
          institution: "Colegio Nacional",
          degree: "Bachillerato",
          startDate: "2018-01",
          endDate: "2023-06",
          status: "Graduado",
          gpa: 18.5,
        },
      ],
      currentDegree: "Bachillerato",
      universityName: "Universidad de La Paz",
      universityStartDate: "2023-07",
      universityEndDate: null,
      universityStatus: "Estudiante",
      gpa: 3.5,
      academicAchievements: [
        {
          title: "Primer lugar en Hackathon 2023",
          date: "2023",
          description: "Gané el primer lugar en el hackathon de desarrollo web organizado por la universidad",
          type: "honor",
        },
        {
          title: "Certificación en React",
          date: "2023",
          description: "Completé exitosamente el curso de React en Meta",
          type: "certification",
        },
      ],
    },
    skills: [
      { name: "JavaScript", experienceLevel: "Skillful" },
      { name: "React", experienceLevel: "Skillful" },
      { name: "HTML", experienceLevel: "Skillful" },
      { name: "CSS", experienceLevel: "Skillful" },
      { name: "Excel", experienceLevel: "Skillful" },
      { name: "Word", experienceLevel: "Skillful" },
    ],
    interests: ["Programación", "Diseño web", "Tecnología", "Música"],
    languages: [
      { name: "Español", proficiency: "Native speaker" },
      { name: "Inglés", proficiency: "Highly proficient" },
    ],
    socialLinks: [
      { platform: "LinkedIn", url: "https://www.linkedin.com/in/juan-perez" },
    ],
    workExperience: [
      {
        jobTitle: "Practicante de Desarrollo Web",
        company: "TechCorp Bolivia",
        startDate: "2023-01",
        endDate: "2023-03",
        description: "Desarrollo de interfaces de usuario con React y JavaScript.",
      },
    ],
    projects: [
      {
        title: "ACTUARIUS Mobile Application Development",
        location: "Querétaro",
        startDate: "2019-08",
        endDate: "2019-10",
        description: "Desarrollo de aplicación móvil para gestión de seguros.",
      },
      {
        title: "Water Reactor",
        location: "Querétaro",
        startDate: "2018-06",
        endDate: "2018-09",
        description: "Sistema de control para reactor de agua.",
      },
    ],
    activities: [],
    achievements: [
      {
        title: "Primer lugar en Hackathon 2023",
        date: "2023",
        description: "Gané el primer lugar en el hackathon de desarrollo web organizado por la universidad",
      },
      {
        title: "Certificación en React",
        date: "2023",
        description: "Completé exitosamente el curso de React en Meta",
      },
    ],
    certifications: [],
    targetPosition: "Desarrollador Frontend",
  });

  // Datos mock para la carta de presentación
  const getMockCoverLetterData = (): CoverLetterData => ({
    template: "default",
    content: `Estimado/a Reclutador/a,

Me dirijo a usted con gran interés para postularme a la posición disponible en su empresa. Soy Juan Carlos Pérez, un joven profesional con sólidos conocimientos en JavaScript, React, HTML, CSS y Excel.

Mi formación académica en el Colegio Nacional me ha proporcionado una base sólida en mi campo de estudio, y estoy comprometido con el aprendizaje continuo y el desarrollo profesional.

Mis principales fortalezas incluyen mi capacidad de aprendizaje rápido, trabajo en equipo y comunicación efectiva. Estoy entusiasmado por la oportunidad de contribuir con mis habilidades y conocimientos a su organización.

Estoy disponible para una entrevista en el momento que considere conveniente y agradezco su consideración.

Atentamente,
Juan Carlos Pérez`,
    recipient: {
      department: "Departamento de Recursos Humanos",
      companyName: "Nombre de la Empresa",
      address: "Dirección de la Empresa",
      city: "Ciudad, País",
      country: "Bolivia",
    },
    subject: "Postulación para el cargo de Desarrollador Frontend",
  });

  // Cargar datos iniciales
  useEffect(() => {
    fetchCVData();
    fetchCoverLetterData();
  }, []);

  return {
    cvData,
    coverLetterData,
    loading,
    error,
    fetchCVData,
    updateCVData,
    fetchCoverLetterData,
    saveCoverLetterData,
    generateCVForApplication,
  };
}
