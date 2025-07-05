&ldquo;use client&rdquo;;

import { useState, useEffect } from &ldquo;react&rdquo;;
import { useParams, useRouter } from &ldquo;next/navigation&rdquo;;
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
} from &ldquo;lucide-react&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { Avatar, AvatarFallback, AvatarImage } from &ldquo;@/components/ui/avatar&rdquo;;
import { Separator } from &ldquo;@/components/ui/separator&rdquo;;
import { Skeleton } from &ldquo;@/components/ui/skeleton&rdquo;;
import { JobApplicationModal } from &ldquo;@/components/jobs/job-application-modal&rdquo;;
import { JobOffer } from &ldquo;@/types/jobs&rdquo;;
import { CompanyGallery } from &ldquo;@/components/jobs/company-gallery&rdquo;;
import { LocationMap } from &ldquo;@/components/jobs/location-map&rdquo;;

export default function JobDetailPage() {
  const [job, setJob] = useState<JobOffer | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [similarJobs, setSimilarJobs] = useState<JobOffer[]>([]);

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
          console.error(&ldquo;Job not found&rdquo;);
        }
      } catch (error) {
        console.error(&ldquo;Error fetching job details:&rdquo;, error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetail();
  }, [jobId]);

  const formatSalary = (min?: number, max?: number, currency = &ldquo;BOB&rdquo;) => {
    if (!min && !max) return &ldquo;Salario a convenir&rdquo;;
    if (min && max)
      return `Bs. ${min.toLocaleString()} - ${max.toLocaleString()}`;
    if (min) return `Desde Bs. ${min.toLocaleString()}`;
    return `Hasta Bs. ${max!.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(&ldquo;es-ES&rdquo;, {
      year: &ldquo;numeric&rdquo;,
      month: &ldquo;long&rdquo;,
      day: &ldquo;numeric&rdquo;,
    });
  };

  const getContractTypeLabel = (type: string) => {
    switch (type) {
      case &ldquo;FULL_TIME&rdquo;:
        return &ldquo;Tiempo completo&rdquo;;
      case &ldquo;PART_TIME&rdquo;:
        return &ldquo;Medio tiempo&rdquo;;
      case &ldquo;INTERNSHIP&rdquo;:
        return &ldquo;Prácticas&rdquo;;
      case &ldquo;VOLUNTEER&rdquo;:
        return &ldquo;Voluntariado&rdquo;;
      case &ldquo;FREELANCE&rdquo;:
        return &ldquo;Freelance&rdquo;;
      default:
        return type;
    }
  };

  const getModalityLabel = (modality: string) => {
    switch (modality) {
      case &ldquo;ON_SITE&rdquo;:
        return &ldquo;Presencial&rdquo;;
      case &ldquo;REMOTE&rdquo;:
        return &ldquo;Remoto&rdquo;;
      case &ldquo;HYBRID&rdquo;:
        return &ldquo;Híbrido&rdquo;;
      default:
        return modality;
    }
  };

  const getExperienceLabel = (level: string) => {
    switch (level) {
      case &ldquo;NO_EXPERIENCE&rdquo;:
        return &ldquo;Sin experiencia&rdquo;;
      case &ldquo;ENTRY_LEVEL&rdquo;:
        return &ldquo;Principiante&rdquo;;
      case &ldquo;MID_LEVEL&rdquo;:
        return &ldquo;Intermedio&rdquo;;
      case &ldquo;SENIOR_LEVEL&rdquo;:
        return &ldquo;Senior&rdquo;;
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
      <div className=&ldquo;max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6&rdquo;>
        <div className=&ldquo;grid grid-cols-1 lg:grid-cols-3 gap-6&rdquo;>
          <div className=&ldquo;lg:col-span-2 space-y-6&rdquo;>
            <Skeleton className=&ldquo;h-8 w-32&rdquo; />
            <Card>
              <CardHeader>
                <Skeleton className=&ldquo;h-6 w-3/4&rdquo; />
                <Skeleton className=&ldquo;h-4 w-1/2&rdquo; />
              </CardHeader>
              <CardContent>
                <div className=&ldquo;space-y-4&rdquo;>
                  <Skeleton className=&ldquo;h-20 w-full&rdquo; />
                  <Skeleton className=&ldquo;h-4 w-full&rdquo; />
                  <Skeleton className=&ldquo;h-4 w-3/4&rdquo; />
                </div>
              </CardContent>
            </Card>
          </div>
          <div className=&ldquo;space-y-6&rdquo;>
            <Skeleton className=&ldquo;h-40 w-full&rdquo; />
            <Skeleton className=&ldquo;h-60 w-full&rdquo; />
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className=&ldquo;max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center&rdquo;>
        <h1 className=&ldquo;text-2xl font-bold text-gray-900 mb-4&rdquo;>
          Empleo no encontrado
        </h1>
        <p className=&ldquo;text-gray-600 mb-6&rdquo;>
          Lo sentimos, no pudimos encontrar el empleo que buscas.
        </p>
        <Button onClick={() => router.push(&ldquo;/jobs&rdquo;)}>
          Volver a la búsqueda
        </Button>
      </div>
    );
  }

  return (
    <div className=&ldquo;max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6&rdquo;>
      {/* Back Button */}
      <Button variant=&ldquo;ghost&rdquo; onClick={() => router.back()} className=&ldquo;mb-6&rdquo;>
        <ArrowLeft className=&ldquo;w-4 h-4 mr-2&rdquo; />
        Volver a los resultados
      </Button>

      <div className=&ldquo;grid grid-cols-1 lg:grid-cols-3 gap-6&rdquo;>
        {/* Main Content */}
        <div className=&ldquo;lg:col-span-2 space-y-6&rdquo;>
          {/* Job Header */}
          <Card>
            <CardHeader>
              <div className=&ldquo;flex items-start justify-between&rdquo;>
                <div className=&ldquo;flex items-start space-x-4&rdquo;>
                  <Avatar className=&ldquo;w-16 h-16&rdquo;>
                    <AvatarImage
                      src={job.company.logo}
                      alt={job.company.name}
                    />
                    <AvatarFallback>
                      {job.company.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className=&ldquo;flex-1&rdquo;>
                    <h1 className=&ldquo;text-2xl font-bold text-gray-900 mb-2&rdquo;>
                      {job.title}
                      {job.featured && (
                        <Star className=&ldquo;inline-block w-5 h-5 text-yellow-500 ml-2&rdquo; />
                      )}
                    </h1>
                    <div className=&ldquo;flex items-center space-x-4 text-gray-600 mb-3&rdquo;>
                      <span className=&ldquo;font-medium text-lg&rdquo;>
                        {job.company.name}
                      </span>
                      {job.company.rating && (
                        <div className=&ldquo;flex items-center space-x-1&rdquo;>
                          <Star className=&ldquo;w-4 h-4 fill-yellow-400 text-yellow-400&rdquo; />
                          <span>{job.company.rating}</span>
                          <span>({job.company.reviewCount} reseñas)</span>
                        </div>
                      )}
                    </div>
                    <div className=&ldquo;flex items-center flex-wrap gap-4 text-sm text-gray-600&rdquo;>
                      <div className=&ldquo;flex items-center space-x-1&rdquo;>
                        <MapPin className=&ldquo;w-4 h-4&rdquo; />
                        <span>{job.location}</span>
                      </div>
                      <div className=&ldquo;flex items-center space-x-1&rdquo;>
                        <Clock className=&ldquo;w-4 h-4&rdquo; />
                        <span>{getModalityLabel(job.workModality)}</span>
                      </div>
                      <div className=&ldquo;flex items-center space-x-1&rdquo;>
                        <Users className=&ldquo;w-4 h-4&rdquo; />
                        <span>{job.applicationCount} aplicaciones</span>
                      </div>
                      <div className=&ldquo;flex items-center space-x-1&rdquo;>
                        <Eye className=&ldquo;w-4 h-4&rdquo; />
                        <span>{job.viewCount} vistas</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className=&ldquo;flex space-x-2&rdquo;>
                  <Button variant=&ldquo;outline&rdquo; size=&ldquo;sm&rdquo; onClick={handleShare}>
                    <Share className=&ldquo;w-4 h-4&rdquo; />
                  </Button>
                  <Button variant=&ldquo;outline&rdquo; size=&ldquo;sm&rdquo; onClick={handleSaveJob}>
                    {isSaved ? (
                      <BookmarkCheck className=&ldquo;w-4 h-4 text-blue-600&rdquo; />
                    ) : (
                      <Bookmark className=&ldquo;w-4 h-4&rdquo; />
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className=&ldquo;flex flex-wrap gap-2 mb-4&rdquo;>
                <Badge variant=&ldquo;secondary&rdquo;>
                  {getContractTypeLabel(job.contractType)}
                </Badge>
                <Badge variant=&ldquo;outline&rdquo;>
                  {getExperienceLabel(job.experienceLevel)}
                </Badge>
                <Badge variant=&ldquo;outline&rdquo;>
                  {formatSalary(
                    job.salaryMin,
                    job.salaryMax,
                    job.salaryCurrency
                  )}
                </Badge>
              </div>
              <div className=&ldquo;flex items-center space-x-4 text-sm text-gray-600&rdquo;>
                <div className=&ldquo;flex items-center space-x-1&rdquo;>
                  <Calendar className=&ldquo;w-4 h-4&rdquo; />
                  <span>Publicado el {formatDate(job.publishedAt)}</span>
                </div>
                {job.closingDate && (
                  <div className=&ldquo;flex items-center space-x-1&rdquo;>
                    <Calendar className=&ldquo;w-4 h-4&rdquo; />
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
              <div className=&ldquo;prose max-w-none&rdquo;>
                {job.description.split(&ldquo;\n&rdquo;).map((paragraph, index) => (
                  <p key={index} className=&ldquo;mb-4 text-gray-700&rdquo;>
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
                <ul className=&ldquo;space-y-2&rdquo;>
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index} className=&ldquo;flex items-start space-x-2&rdquo;>
                      <span className=&ldquo;w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0&rdquo; />
                      <span className=&ldquo;text-gray-700&rdquo;>{responsibility}</span>
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
                <ul className=&ldquo;space-y-2&rdquo;>
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className=&ldquo;flex items-start space-x-2&rdquo;>
                      <span className=&ldquo;w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0&rdquo; />
                      <span className=&ldquo;text-gray-700&rdquo;>{requirement}</span>
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
              <div className=&ldquo;space-y-4&rdquo;>
                <div>
                  <h4 className=&ldquo;font-medium text-gray-900 mb-2&rdquo;>
                    Habilidades esenciales
                  </h4>
                  <div className=&ldquo;flex flex-wrap gap-2&rdquo;>
                    {job.requiredSkills.map((skill) => (
                      <Badge key={skill} variant=&ldquo;default&rdquo;>
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
                {job.desiredSkills && job.desiredSkills.length > 0 && (
                  <div>
                    <h4 className=&ldquo;font-medium text-gray-900 mb-2&rdquo;>
                      Habilidades deseables
                    </h4>
                    <div className=&ldquo;flex flex-wrap gap-2&rdquo;>
                      {job.desiredSkills.map((skill) => (
                        <Badge key={skill} variant=&ldquo;outline&rdquo;>
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
                <ul className=&ldquo;space-y-2&rdquo;>
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className=&ldquo;flex items-start space-x-2&rdquo;>
                      <span className=&ldquo;w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0&rdquo; />
                      <span className=&ldquo;text-gray-700&rdquo;>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className=&ldquo;space-y-6&rdquo;>
          {/* Apply Button */}
          <Card>
            <CardContent className=&ldquo;p-6&rdquo;>
              <Button
                onClick={() => setShowApplicationModal(true)}
                className=&ldquo;w-full mb-4&rdquo;
                size=&ldquo;lg&rdquo;
              >
                Aplicar a este empleo
              </Button>
              <div className=&ldquo;text-center&rdquo;>
                <p className=&ldquo;text-sm text-gray-600&rdquo;>
                  {job.applicationCount} personas ya aplicaron
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Company Info */}
          <Card>
            <CardHeader>
              <CardTitle className=&ldquo;flex items-center space-x-2&rdquo;>
                <Building className=&ldquo;w-5 h-5&rdquo; />
                <span>Sobre la empresa</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className=&ldquo;space-y-4&rdquo;>
                <div className=&ldquo;flex items-center space-x-3&rdquo;>
                  <Avatar className=&ldquo;w-12 h-12&rdquo;>
                    <AvatarImage
                      src={job.company.logo}
                      alt={job.company.name}
                    />
                    <AvatarFallback>
                      {job.company.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className=&ldquo;font-medium&rdquo;>{job.company.name}</h3>
                    <p className=&ldquo;text-sm text-gray-600&rdquo;>{job.company.size}</p>
                  </div>
                </div>

                {job.company.images && job.company.images.length > 0 && (
                  <div className=&ldquo;mt-4&rdquo;>
                    <CompanyGallery images={job.company.images} />
                  </div>
                )}

                <div className=&ldquo;mt-4&rdquo;>
                  <p className=&ldquo;text-gray-700&rdquo;>{job.company.description}</p>
                </div>

                <div className=&ldquo;flex items-center space-x-2 text-sm&rdquo;>
                  <Globe className=&ldquo;w-4 h-4&rdquo; />
                  <a
                    href={job.company.website}
                    target=&ldquo;_blank&rdquo;
                    rel=&ldquo;noopener noreferrer&rdquo;
                    className=&ldquo;text-blue-600 hover:underline&rdquo;
                  >
                    {job.company.website.replace(/^https?:\/\//, &ldquo;&rdquo;)}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Map */}
          <Card>
            <CardHeader>
              <CardTitle className=&ldquo;flex items-center space-x-2&rdquo;>
                <MapPin className=&ldquo;w-5 h-5&rdquo; />
                <span>Ubicación</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <LocationMap location={job.location} />
            </CardContent>
          </Card>
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
