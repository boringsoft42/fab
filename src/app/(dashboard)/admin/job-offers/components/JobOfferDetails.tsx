"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  Building2, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Eye, 
  Calendar,
  Star,
  GraduationCap,
  Briefcase
} from "lucide-react";

interface JobOffer {
  id: string;
  title: string;
  description: string;
  requirements: string;
  benefits?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  contractType: string;
  workSchedule: string;
  workModality: string;
  location: string;
  latitude?: number;
  longitude?: number;
  municipality: string;
  department: string;
  experienceLevel: string;
  educationRequired?: string;
  skillsRequired: string[];
  desiredSkills: string[];
  applicationDeadline?: string;
  status: string;
  viewsCount: number;
  applicationsCount: number;
  featured: boolean;
  publishedAt: string;
  expiresAt?: string;
  company?: {
    id: string;
    name: string;
    businessSector?: string;
    website?: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  applications?: Array<{
    id: string;
    status: string;
    appliedAt: string;
    applicant: {
      firstName?: string;
      lastName?: string;
      email?: string;
      role?: string;
    };
  }>;
}

interface JobOfferDetailsProps {
  jobOffer: JobOffer;
}

export function JobOfferDetails({ jobOffer }: JobOfferDetailsProps) {
  const formatSalary = (min?: number, max?: number, currency = "BOB") => {
    if (!min && !max) return "Not specified";
    if (min && max) return `${min.toLocaleString()} - ${max.toLocaleString()} ${currency}`;
    if (min) return `${min.toLocaleString()} ${currency}`;
    if (max) return `${max.toLocaleString()} ${currency}`;
    return "Not specified";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      ACTIVE: { variant: "default" as const, label: "Active" },
      PAUSED: { variant: "secondary" as const, label: "Paused" },
      CLOSED: { variant: "destructive" as const, label: "Closed" },
      DRAFT: { variant: "outline" as const, label: "Draft" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.DRAFT;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getApplicationStatusBadge = (status: string) => {
    const statusConfig = {
      SENT: { variant: "outline" as const, label: "Sent" },
      UNDER_REVIEW: { variant: "secondary" as const, label: "Under Review" },
      PRE_SELECTED: { variant: "default" as const, label: "Pre-selected" },
      REJECTED: { variant: "destructive" as const, label: "Rejected" },
      HIRED: { variant: "default" as const, label: "Hired" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.SENT;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-bold">{jobOffer.title}</h2>
            <p className="text-muted-foreground">{jobOffer.experienceLevel}</p>
          </div>
          <div className="flex items-center gap-2">
            {jobOffer.featured && (
              <Badge variant="default" className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                Featured
              </Badge>
            )}
            {getStatusBadge(jobOffer.status)}
          </div>
        </div>
      </div>

      <Separator />

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Company Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <h3 className="font-semibold">{jobOffer.company?.name || "N/A"}</h3>
            <p className="text-sm text-muted-foreground">
              {jobOffer.company?.businessSector || "N/A"}
            </p>
          </div>
          {jobOffer.company?.website && (
            <div>
              <span className="text-sm font-medium">Website: </span>
              <a 
                href={jobOffer.company.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline"
              >
                {jobOffer.company.website}
              </a>
            </div>
          )}
          {jobOffer.company?.email && (
            <div>
              <span className="text-sm font-medium">Email: </span>
              <span className="text-sm">{jobOffer.company.email}</span>
            </div>
          )}
          {jobOffer.company?.phone && (
            <div>
              <span className="text-sm font-medium">Phone: </span>
              <span className="text-sm">{jobOffer.company.phone}</span>
            </div>
          )}
          {jobOffer.company?.address && (
            <div>
              <span className="text-sm font-medium">Address: </span>
              <span className="text-sm">{jobOffer.company.address}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Job Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Job Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Contract Type:</span>
              <span className="text-sm">{jobOffer.contractType}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Work Modality:</span>
              <span className="text-sm">{jobOffer.workModality}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Schedule:</span>
              <span className="text-sm">{jobOffer.workSchedule}</span>
            </div>
            {jobOffer.educationRequired && (
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Education:</span>
                <span className="text-sm">{jobOffer.educationRequired}</span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location & Salary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Location:</span>
              <span className="text-sm">{jobOffer.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Municipality:</span>
              <span className="text-sm">{jobOffer.municipality}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Department:</span>
              <span className="text-sm">{jobOffer.department}</span>
            </div>
            {jobOffer.latitude && jobOffer.longitude && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Coordinates:</span>
                <span className="text-sm">{jobOffer.latitude}, {jobOffer.longitude}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Salary:</span>
              <span className="text-sm">
                {formatSalary(jobOffer.salaryMin, jobOffer.salaryMax, jobOffer.salaryCurrency)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{jobOffer.viewsCount}</div>
              <div className="text-sm text-muted-foreground">Views</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{jobOffer.applicationsCount}</div>
              <div className="text-sm text-muted-foreground">Applications</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">
                {formatDate(jobOffer.publishedAt)}
              </div>
              <div className="text-sm text-muted-foreground">Published</div>
            </div>
            {jobOffer.expiresAt && (
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {formatDate(jobOffer.expiresAt)}
                </div>
                <div className="text-sm text-muted-foreground">Expires</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap">{jobOffer.description}</p>
          </div>
        </CardContent>
      </Card>

      {/* Requirements */}
      <Card>
        <CardHeader>
          <CardTitle>Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-wrap">{jobOffer.requirements}</p>
          </div>
        </CardContent>
      </Card>

      {/* Benefits */}
      {jobOffer.benefits && (
        <Card>
          <CardHeader>
            <CardTitle>Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap">{jobOffer.benefits}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skills */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Required Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {jobOffer.skillsRequired.length > 0 ? (
                jobOffer.skillsRequired.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No required skills specified</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Desired Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {jobOffer.desiredSkills.length > 0 ? (
                jobOffer.desiredSkills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No desired skills specified</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications */}
      {jobOffer.applications && jobOffer.applications.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications ({jobOffer.applications.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {jobOffer.applications.slice(0, 5).map((application) => (
                <div key={application.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <div className="font-medium">
                      {application.applicant.firstName} {application.applicant.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {application.applicant.email} • {application.applicant.role}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Applied: {formatDate(application.appliedAt)}
                    </div>
                  </div>
                  {getApplicationStatusBadge(application.status)}
                </div>
              ))}
              {jobOffer.applications.length > 5 && (
                <p className="text-sm text-muted-foreground text-center">
                  And {jobOffer.applications.length - 5} more applications...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Important Dates
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Published:</span>
            <span className="text-sm">{formatDate(jobOffer.publishedAt)}</span>
          </div>
          {jobOffer.applicationDeadline && (
            <div className="flex justify-between">
              <span className="text-sm font-medium">Application Deadline:</span>
              <span className="text-sm">{formatDate(jobOffer.applicationDeadline)}</span>
            </div>
          )}
          {jobOffer.expiresAt && (
            <div className="flex justify-between">
              <span className="text-sm font-medium">Expires:</span>
              <span className="text-sm">{formatDate(jobOffer.expiresAt)}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
