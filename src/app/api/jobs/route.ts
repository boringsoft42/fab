import { NextRequest, NextResponse } from "next/server";
import {
  JobOffer,
  JobSearchFilters,
  ContractType,
  WorkModality,
  ExperienceLevel,
  JobStatus,
} from "@/types/jobs";

// Mock job data
const mockJobs: JobOffer[] = [
  {
    id: "job-1",
    title: "Desarrollador Frontend Junior",
    description:
      "Buscamos un desarrollador frontend junior para unirse a nuestro equipo dinámico. Trabajarás en proyectos web modernos usando React, TypeScript y Tailwind CSS.",
    company: {
      id: "company-1",
      name: "TechCorp Bolivia",
      logo: "/logos/techcorp.svg",
      description: "Empresa líder en desarrollo de software",
      sector: "Tecnología",
      size: "51-200 empleados",
      location: "Cochabamba, Bolivia",
      rating: 4.5,
      reviewCount: 28,
    },
    location: "Cochabamba, Bolivia",
    contractType: "FULL_TIME" as ContractType,
    workModality: "HYBRID" as WorkModality,
    experienceLevel: "ENTRY_LEVEL" as ExperienceLevel,
    salaryMin: 3000,
    salaryMax: 4500,
    salaryCurrency: "BOB",
    requiredSkills: ["React", "JavaScript", "HTML", "CSS"],
    desiredSkills: ["TypeScript", "Tailwind CSS", "Git"],
    benefits: ["Seguro médico", "Capacitaciones", "Ambiente flexible"],
    requirements: [
      "Título en Ingeniería de Sistemas o afines",
      "Conocimientos básicos de React",
      "Inglés básico",
    ],
    responsibilities: [
      "Desarrollar interfaces de usuario",
      "Colaborar con el equipo de diseño",
      "Mantener código de calidad",
    ],
    status: "ACTIVE" as JobStatus,
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    applicationCount: 15,
    viewCount: 124,
    featured: true,
  },
  {
    id: "job-2",
    title: "Asistente de Marketing Digital",
    description:
      "Oportunidad para jóvenes apasionados por el marketing digital. Aprenderás sobre redes sociales, contenido digital y estrategias de marketing online.",
    company: {
      id: "company-2",
      name: "Mindful Co.",
      logo: "/logos/mindfulco.svg",
      description: "Agencia de marketing digital",
      sector: "Marketing",
      size: "11-50 empleados",
      location: "Cochabamba, Bolivia",
      rating: 4.2,
      reviewCount: 15,
    },
    location: "Cochabamba, Bolivia",
    contractType: "PART_TIME" as ContractType,
    workModality: "ON_SITE" as WorkModality,
    experienceLevel: "NO_EXPERIENCE" as ExperienceLevel,
    salaryMin: 1500,
    salaryMax: 2500,
    salaryCurrency: "BOB",
    requiredSkills: ["Redes sociales", "Creatividad", "Comunicación"],
    desiredSkills: ["Photoshop", "Canva", "Google Analytics"],
    benefits: ["Capacitación continua", "Horarios flexibles", "Proyecto final"],
    requirements: [
      "Estudiante universitario o bachiller",
      "Manejo de redes sociales",
      "Proactividad",
    ],
    responsibilities: [
      "Crear contenido para redes sociales",
      "Analizar métricas",
      "Apoyar en campañas",
    ],
    status: "ACTIVE" as JobStatus,
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    applicationCount: 8,
    viewCount: 89,
  },
  {
    id: "job-3",
    title: "Practicante de Contabilidad",
    description:
      "Excelente oportunidad para estudiantes de contabilidad que buscan ganar experiencia práctica en una empresa consolidada.",
    company: {
      id: "company-3",
      name: "Zenith Health",
      logo: "/logos/zenithhealth.svg",
      description: "Clínica de salud integral",
      sector: "Salud",
      size: "101-500 empleados",
      location: "Cochabamba, Bolivia",
      rating: 4.7,
      reviewCount: 42,
    },
    location: "Cochabamba, Bolivia",
    contractType: "INTERNSHIP" as ContractType,
    workModality: "ON_SITE" as WorkModality,
    experienceLevel: "NO_EXPERIENCE" as ExperienceLevel,
    salaryMin: 800,
    salaryMax: 1200,
    salaryCurrency: "BOB",
    requiredSkills: ["Excel", "Contabilidad básica", "Organización"],
    desiredSkills: ["Software contable", "Inglés básico"],
    benefits: [
      "Certificado de prácticas",
      "Tutoría profesional",
      "Posibilidad de contratación",
    ],
    requirements: [
      "Estudiante de Contabilidad",
      "Mínimo 6to semestre",
      "Disponibilidad de 6 meses",
    ],
    responsibilities: [
      "Apoyo en registros contables",
      "Archivo de documentos",
      "Elaboración de reportes básicos",
    ],
    status: "ACTIVE" as JobStatus,
    publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    applicationCount: 23,
    viewCount: 156,
  },
];

// GET: Search and list jobs (for Youth/Adolescents)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract search filters
    const filters: JobSearchFilters = {
      query: searchParams.get("query") || undefined,
      location: searchParams.getAll("location"),
      contractType: searchParams.getAll("contractType") as ContractType[],
      workModality: searchParams.getAll("workModality") as WorkModality[],
      experienceLevel: searchParams.getAll(
        "experienceLevel"
      ) as ExperienceLevel[],
      salaryMin: searchParams.get("salaryMin")
        ? parseInt(searchParams.get("salaryMin")!)
        : undefined,
      salaryMax: searchParams.get("salaryMax")
        ? parseInt(searchParams.get("salaryMax")!)
        : undefined,
      publishedInDays: searchParams.get("publishedInDays")
        ? parseInt(searchParams.get("publishedInDays")!)
        : undefined,
      sector: searchParams.getAll("sector"),
    };

    // Filter jobs based on search criteria
    let filteredJobs = mockJobs.filter((job) => job.status === "ACTIVE");

    // Apply text search
    if (filters.query) {
      const query = filters.query.toLowerCase();
      filteredJobs = filteredJobs.filter(
        (job) =>
          job.title.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.company.name.toLowerCase().includes(query) ||
          job.requiredSkills.some((skill) =>
            skill.toLowerCase().includes(query)
          )
      );
    }

    // Apply location filter
    if (filters.location && filters.location.length > 0) {
      filteredJobs = filteredJobs.filter((job) =>
        filters.location!.some((loc) =>
          job.location.toLowerCase().includes(loc.toLowerCase())
        )
      );
    }

    // Apply contract type filter
    if (filters.contractType && filters.contractType.length > 0) {
      filteredJobs = filteredJobs.filter((job) =>
        filters.contractType!.includes(job.contractType)
      );
    }

    // Apply work modality filter
    if (filters.workModality && filters.workModality.length > 0) {
      filteredJobs = filteredJobs.filter((job) =>
        filters.workModality!.includes(job.workModality)
      );
    }

    // Apply experience level filter
    if (filters.experienceLevel && filters.experienceLevel.length > 0) {
      filteredJobs = filteredJobs.filter((job) =>
        filters.experienceLevel!.includes(job.experienceLevel)
      );
    }

    // Apply salary range filter
    if (filters.salaryMin) {
      filteredJobs = filteredJobs.filter((job) =>
        job.salaryMax ? job.salaryMax >= filters.salaryMin! : true
      );
    }

    if (filters.salaryMax) {
      filteredJobs = filteredJobs.filter((job) =>
        job.salaryMin ? job.salaryMin <= filters.salaryMax! : true
      );
    }

    // Apply published date filter
    if (filters.publishedInDays) {
      const cutoffDate = new Date(
        Date.now() - filters.publishedInDays * 24 * 60 * 60 * 1000
      );
      filteredJobs = filteredJobs.filter(
        (job) => new Date(job.publishedAt) >= cutoffDate
      );
    }

    // Apply sector filter
    if (filters.sector && filters.sector.length > 0) {
      filteredJobs = filteredJobs.filter((job) =>
        filters.sector!.includes(job.company.sector)
      );
    }

    // Sort by featured first, then by published date
    filteredJobs.sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return (
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    });

    return NextResponse.json({
      jobs: filteredJobs,
      total: filteredJobs.length,
      filters: filters,
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}

// POST: Create new job (for Companies)
export async function POST(request: NextRequest) {
  try {
    const jobData = await request.json();

    // Mock job creation
    const newJob: JobOffer = {
      id: `job-${Date.now()}`,
      ...jobData,
      publishedAt: new Date().toISOString(),
      applicationCount: 0,
      viewCount: 0,
      status: jobData.status || ("DRAFT" as JobStatus),
    };

    // In real app, save to database
    mockJobs.push(newJob);

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
