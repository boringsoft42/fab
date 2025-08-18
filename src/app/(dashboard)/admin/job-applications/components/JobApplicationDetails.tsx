"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Calendar, Building, FileText, ExternalLink } from "lucide-react";

interface JobApplication {
  id: string;
  jobOfferId: string;
  applicantId: string;
  status: string;
  coverLetter?: string;
  resumeUrl?: string;
  appliedAt: string;
  updatedAt: string;
  jobOffer?: {
    id: string;
    title: string;
    description?: string;
    location?: string;
    contractType?: string;
    company?: {
      name: string;
      businessSector?: string;
    };
  };
  applicant?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
}

interface JobApplicationDetailsProps {
  application: JobApplication;
}

export function JobApplicationDetails({ application }: JobApplicationDetailsProps) {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: "outline" as const, label: "Pending" },
      REVIEWING: { variant: "secondary" as const, label: "Reviewing" },
      INTERVIEWED: { variant: "default" as const, label: "Interviewed" },
      ACCEPTED: { variant: "default" as const, label: "Accepted" },
      REJECTED: { variant: "destructive" as const, label: "Rejected" },
      WITHDRAWN: { variant: "outline" as const, label: "Withdrawn" },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getApplicantName = () => {
    if (application.applicant) {
      return `${application.applicant.firstName} ${application.applicant.lastName}`;
    }
    return "N/A";
  };

  return (
    <div className="space-y-6">
      {/* Application Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Application Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">Status</h4>
              {getStatusBadge(application.status)}
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">Application ID</h4>
              <p className="text-sm font-mono">{application.id}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">Applied Date</h4>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{formatDate(application.appliedAt)}</span>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">Last Updated</h4>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{formatDate(application.updatedAt)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applicant Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Applicant Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">Full Name</h4>
              <p className="font-medium">{getApplicantName()}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">Email</h4>
              <p className="text-sm">{application.applicant?.email || "N/A"}</p>
            </div>
          </div>
          {application.applicant?.phone && (
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">Phone</h4>
              <p className="text-sm">{application.applicant.phone}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Job Offer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Job Position
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground mb-2">Position Title</h4>
            <p className="font-medium">{application.jobOffer?.title || "N/A"}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">Company</h4>
              <p className="text-sm">{application.jobOffer?.company?.name || "N/A"}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">Location</h4>
              <p className="text-sm">{application.jobOffer?.location || "N/A"}</p>
            </div>
          </div>
          {application.jobOffer?.contractType && (
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">Contract Type</h4>
              <p className="text-sm">{application.jobOffer.contractType}</p>
            </div>
          )}
          {application.jobOffer?.description && (
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">Job Description</h4>
              <p className="text-sm text-muted-foreground">{application.jobOffer.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cover Letter */}
      {application.coverLetter && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Cover Letter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap text-sm">{application.coverLetter}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resume */}
      {application.resumeUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Resume
            </CardTitle>
          </CardHeader>
          <CardContent>
            <a
              href={application.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 underline"
            >
              <ExternalLink className="h-4 w-4" />
              View Resume
            </a>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
