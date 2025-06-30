"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Users,
  Eye,
  Star,
  Share,
  Bookmark,
  BookmarkCheck,
  Building,
  Globe,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { JobApplicationModal } from "@/components/jobs/job-application-modal";
import { JobOffer } from "@/types/jobs";

export default function JobDetailPage() {
  const [job, setJob] = useState<JobOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [similarJobs, setSimilarJobs] = useState<JobOffer[]>([]);

  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const response = await fetch(`/api/jobs/${jobId}`);
        if (response.ok) {
          const jobData = await response.json();
          setJob(jobData);

          // Fetch similar jobs (simplified - in real app would use better matching)
          const similarResponse = await fetch(
            `/api/jobs?limit=3&exclude=${jobId}`
          );
          if (similarResponse.ok) {
            const similarData = await similarResponse.json();
            setSimilarJobs(similarData.jobs?.slice(0, 3) || []);
          }
        } else {
          console.error("Job not found");
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [jobId]);

  const formatSalary = (min?: number, max?: number, currency = "BOB") => {
    if (!min && !max) return "Salario a convenir";
    if (min && max)
      return `Bs. ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `Desde Bs. ${min.toLocaleString()}`;
    return `Hasta Bs. ${max!.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getContractTypeLabel = (type: string) => {
    switch (type) {
      case "FULL_TIME":
        return "Tiempo completo";
      case "PART_TIME":
        return "Medio tiempo";
      case "INTERNSHIP":
        return "Prácticas";
      case "VOLUNTEER":
        return "Voluntariado";
      case "FREELANCE":
        return "Freelance";
      default:
        return type;
    }
  };

  const getModalityLabel = (modality: string) => {
    switch (modality) {
      case "ON_SITE":
        return "Presencial";
      case "REMOTE":
        return "Remoto";
      case "HYBRID":
        return "Híbrido";
      default:
        return modality;
    }
  };

  const getExperienceLabel = (level: string) => {
    switch (level) {
      case "NO_EXPERIENCE":
        return "Sin experiencia";
      case "ENTRY_LEVEL":
        return "Principiante";
      case "MID_LEVEL":
        return "Intermedio";
      case "SENIOR_LEVEL":
        return "Senior";
      default:
        return level;
    }
  };

  const handleSaveJob = () => {
    setIsSaved(!isSaved);
    // TODO: Implement save/unsave job functionality
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: job?.title,
        text: `Mira esta oportunidad laboral: ${job?.title} en ${job?.company.name}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // TODO: Show toast notification
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-8 w-32" />
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-60 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Empleo no encontrado
        </h1>
        <p className="text-gray-600 mb-6">
          Lo sentimos, no pudimos encontrar el empleo que buscas.
        </p>
        <Button onClick={() => router.push("/jobs")}>
          Volver a la búsqueda
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.back()} className="mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Volver a los resultados
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Job Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage
                      src={job.company.logo}
                      alt={job.company.name}
                    />
                    <AvatarFallback>
                      {job.company.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                      {job.title}
                      {job.featured && (
                        <Star className="inline-block w-5 h-5 text-yellow-500 ml-2" />
                      )}
                    </h1>
                    <div className="flex items-center space-x-4 text-gray-600 mb-3">
                      <span className="font-medium text-lg">
                        {job.company.name}
                      </span>
                      {job.company.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span>{job.company.rating}</span>
                          <span>({job.company.reviewCount} reseñas)</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{getModalityLabel(job.workModality)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{job.applicationCount} aplicaciones</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{job.viewCount} vistas</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleSaveJob}>
                    {isSaved ? (
                      <BookmarkCheck className="w-4 h-4 text-blue-600" />
                    ) : (
                      <Bookmark className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="secondary">
                  {getContractTypeLabel(job.contractType)}
                </Badge>
                <Badge variant="outline">
                  {getExperienceLabel(job.experienceLevel)}
                </Badge>
                <Badge variant="outline">
                  {formatSalary(
                    job.salaryMin,
                    job.salaryMax,
                    job.salaryCurrency
                  )}
                </Badge>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Publicado el {formatDate(job.publishedAt)}</span>
                </div>
                {job.closingDate && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Cierra el {formatDate(job.closingDate)}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Job Description */}
          <Card>
            <CardHeader>
              <CardTitle>Descripción del puesto</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {job.description.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Responsibilities */}
          {job.responsibilities.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Responsabilidades</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Requirements */}
          {job.requirements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Requisitos</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle>Habilidades requeridas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    Habilidades esenciales
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {job.requiredSkills.map((skill) => (
                      <Badge key={skill} variant="default">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                {job.desiredSkills && job.desiredSkills.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Habilidades deseables
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {job.desiredSkills.map((skill) => (
                        <Badge key={skill} variant="outline">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          {job.benefits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Beneficios</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Apply Button */}
          <Card>
            <CardContent className="p-6">
              <Button
                onClick={() => setShowApplicationModal(true)}
                className="w-full mb-4"
                size="lg"
              >
                Aplicar a este empleo
              </Button>
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  {job.applicationCount} personas ya aplicaron
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Company Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="w-5 h-5" />
                <span>Sobre la empresa</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage
                      src={job.company.logo}
                      alt={job.company.name}
                    />
                    <AvatarFallback>
                      {job.company.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{job.company.name}</h3>
                    <p className="text-sm text-gray-600">{job.company.size}</p>
                  </div>
                </div>
                <p className="text-gray-700">{job.company.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{job.company.location}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Building className="w-4 h-4" />
                    <span>{job.company.sector}</span>
                  </div>
                  {job.company.website && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Globe className="w-4 h-4" />
                      <a
                        href={job.company.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Sitio web
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Similar Jobs */}
          {similarJobs.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Empleos similares</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {similarJobs.map((similarJob) => (
                    <div
                      key={similarJob.id}
                      className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                      onClick={() => router.push(`/jobs/${similarJob.id}`)}
                    >
                      <h4 className="font-medium text-sm text-gray-900 mb-1">
                        {similarJob.title}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {similarJob.company.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {similarJob.location}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Application Modal */}
      {showApplicationModal && (
        <JobApplicationModal
          job={job}
          onClose={() => setShowApplicationModal(false)}
          onSuccess={() => {
            setShowApplicationModal(false);
            // TODO: Show success message
          }}
        />
      )}
    </div>
  );
}
