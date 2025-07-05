import { NextRequest, NextResponse } from &ldquo;next/server&rdquo;;
import {
  JobOffer,
  JobSearchFilters,
  ContractType,
  WorkModality,
  ExperienceLevel,
  JobStatus,
} from &ldquo;@/types/jobs&rdquo;;

// Mock job data
const mockJobs: JobOffer[] = [
  {
    id: &ldquo;job-1&rdquo;,
    title: &ldquo;Desarrollador Frontend Junior&rdquo;,
    description:
      &ldquo;Buscamos un desarrollador frontend junior para unirse a nuestro equipo dinámico. Trabajarás en proyectos web modernos usando React, TypeScript y Tailwind CSS.&rdquo;,
    company: {
      id: &ldquo;company-1&rdquo;,
      name: &ldquo;TechCorp Bolivia&rdquo;,
      logo: &ldquo;/logos/techcorp.svg&rdquo;,
      description: &ldquo;Empresa líder en desarrollo de software&rdquo;,
      sector: &ldquo;Tecnología&rdquo;,
      size: &ldquo;51-200 empleados&rdquo;,
      location: &ldquo;Cochabamba, Bolivia&rdquo;,
      rating: 4.5,
      reviewCount: 28,
    },
    location: &ldquo;Cochabamba, Bolivia&rdquo;,
    contractType: &ldquo;FULL_TIME&rdquo; as ContractType,
    workModality: &ldquo;HYBRID&rdquo; as WorkModality,
    experienceLevel: &ldquo;ENTRY_LEVEL&rdquo; as ExperienceLevel,
    salaryMin: 3000,
    salaryMax: 4500,
    salaryCurrency: &ldquo;BOB&rdquo;,
    requiredSkills: [&ldquo;React&rdquo;, &ldquo;JavaScript&rdquo;, &ldquo;HTML&rdquo;, &ldquo;CSS&rdquo;],
    desiredSkills: [&ldquo;TypeScript&rdquo;, &ldquo;Tailwind CSS&rdquo;, &ldquo;Git&rdquo;],
    benefits: [&ldquo;Seguro médico&rdquo;, &ldquo;Capacitaciones&rdquo;, &ldquo;Ambiente flexible&rdquo;],
    requirements: [
      &ldquo;Título en Ingeniería de Sistemas o afines&rdquo;,
      &ldquo;Conocimientos básicos de React&rdquo;,
      &ldquo;Inglés básico&rdquo;,
    ],
    responsibilities: [
      &ldquo;Desarrollar interfaces de usuario&rdquo;,
      &ldquo;Colaborar con el equipo de diseño&rdquo;,
      &ldquo;Mantener código de calidad&rdquo;,
    ],
    status: &ldquo;ACTIVE&rdquo; as JobStatus,
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    applicationCount: 15,
    viewCount: 124,
    featured: true,
  },
  {
    id: &ldquo;job-2&rdquo;,
    title: &ldquo;Asistente de Marketing Digital&rdquo;,
    description:
      &ldquo;Oportunidad para jóvenes apasionados por el marketing digital. Aprenderás sobre redes sociales, contenido digital y estrategias de marketing online.&rdquo;,
    company: {
      id: &ldquo;company-2&rdquo;,
      name: &ldquo;Mindful Co.&rdquo;,
      logo: &ldquo;/logos/mindfulco.svg&rdquo;,
      description: &ldquo;Agencia de marketing digital&rdquo;,
      sector: &ldquo;Marketing&rdquo;,
      size: &ldquo;11-50 empleados&rdquo;,
      location: &ldquo;Cochabamba, Bolivia&rdquo;,
      rating: 4.2,
      reviewCount: 15,
    },
    location: &ldquo;Cochabamba, Bolivia&rdquo;,
    contractType: &ldquo;PART_TIME&rdquo; as ContractType,
    workModality: &ldquo;ON_SITE&rdquo; as WorkModality,
    experienceLevel: &ldquo;NO_EXPERIENCE&rdquo; as ExperienceLevel,
    salaryMin: 1500,
    salaryMax: 2500,
    salaryCurrency: &ldquo;BOB&rdquo;,
    requiredSkills: [&ldquo;Redes sociales&rdquo;, &ldquo;Creatividad&rdquo;, &ldquo;Comunicación&rdquo;],
    desiredSkills: [&ldquo;Photoshop&rdquo;, &ldquo;Canva&rdquo;, &ldquo;Google Analytics&rdquo;],
    benefits: [&ldquo;Capacitación continua&rdquo;, &ldquo;Horarios flexibles&rdquo;, &ldquo;Proyecto final&rdquo;],
    requirements: [
      &ldquo;Estudiante universitario o bachiller&rdquo;,
      &ldquo;Manejo de redes sociales&rdquo;,
      &ldquo;Proactividad&rdquo;,
    ],
    responsibilities: [
      &ldquo;Crear contenido para redes sociales&rdquo;,
      &ldquo;Analizar métricas&rdquo;,
      &ldquo;Apoyar en campañas&rdquo;,
    ],
    status: &ldquo;ACTIVE&rdquo; as JobStatus,
    publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    applicationCount: 8,
    viewCount: 89,
  },
  {
    id: &ldquo;job-3&rdquo;,
    title: &ldquo;Practicante de Contabilidad&rdquo;,
    description:
      &ldquo;Excelente oportunidad para estudiantes de contabilidad que buscan ganar experiencia práctica en una empresa consolidada.&rdquo;,
    company: {
      id: &ldquo;company-3&rdquo;,
      name: &ldquo;Zenith Health&rdquo;,
      logo: &ldquo;/logos/zenithhealth.svg&rdquo;,
      description: &ldquo;Clínica de salud integral&rdquo;,
      sector: &ldquo;Salud&rdquo;,
      size: &ldquo;101-500 empleados&rdquo;,
      location: &ldquo;Cochabamba, Bolivia&rdquo;,
      rating: 4.7,
      reviewCount: 42,
    },
    location: &ldquo;Cochabamba, Bolivia&rdquo;,
    contractType: &ldquo;INTERNSHIP&rdquo; as ContractType,
    workModality: &ldquo;ON_SITE&rdquo; as WorkModality,
    experienceLevel: &ldquo;NO_EXPERIENCE&rdquo; as ExperienceLevel,
    salaryMin: 800,
    salaryMax: 1200,
    salaryCurrency: &ldquo;BOB&rdquo;,
    requiredSkills: [&ldquo;Excel&rdquo;, &ldquo;Contabilidad básica&rdquo;, &ldquo;Organización&rdquo;],
    desiredSkills: [&ldquo;Software contable&rdquo;, &ldquo;Inglés básico&rdquo;],
    benefits: [
      &ldquo;Certificado de prácticas&rdquo;,
      &ldquo;Tutoría profesional&rdquo;,
      &ldquo;Posibilidad de contratación&rdquo;,
    ],
    requirements: [
      &ldquo;Estudiante de Contabilidad&rdquo;,
      &ldquo;Mínimo 6to semestre&rdquo;,
      &ldquo;Disponibilidad de 6 meses&rdquo;,
    ],
    responsibilities: [
      &ldquo;Apoyo en registros contables&rdquo;,
      &ldquo;Archivo de documentos&rdquo;,
      &ldquo;Elaboración de reportes básicos&rdquo;,
    ],
    status: &ldquo;ACTIVE&rdquo; as JobStatus,
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
      query: searchParams.get(&ldquo;query&rdquo;) || undefined,
      location: searchParams.getAll(&ldquo;location&rdquo;),
      contractType: searchParams.getAll(&ldquo;contractType&rdquo;) as ContractType[],
      workModality: searchParams.getAll(&ldquo;workModality&rdquo;) as WorkModality[],
      experienceLevel: searchParams.getAll(
        &ldquo;experienceLevel&rdquo;
      ) as ExperienceLevel[],
      salaryMin: searchParams.get(&ldquo;salaryMin&rdquo;)
        ? parseInt(searchParams.get(&ldquo;salaryMin&rdquo;)!)
        : undefined,
      salaryMax: searchParams.get(&ldquo;salaryMax&rdquo;)
        ? parseInt(searchParams.get(&ldquo;salaryMax&rdquo;)!)
        : undefined,
      publishedInDays: searchParams.get(&ldquo;publishedInDays&rdquo;)
        ? parseInt(searchParams.get(&ldquo;publishedInDays&rdquo;)!)
        : undefined,
      sector: searchParams.getAll(&ldquo;sector&rdquo;),
    };

    // Filter jobs based on search criteria
    let filteredJobs = mockJobs.filter((job) => job.status === &ldquo;ACTIVE&rdquo;);

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
    console.error(&ldquo;Error fetching jobs:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Failed to fetch jobs&rdquo; },
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
      status: jobData.status || (&ldquo;DRAFT&rdquo; as JobStatus),
    };

    // In real app, save to database
    mockJobs.push(newJob);

    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error(&ldquo;Error creating job:&rdquo;, error);
    return NextResponse.json(
      { error: &ldquo;Failed to create job&rdquo; },
      { status: 500 }
    );
  }
}
