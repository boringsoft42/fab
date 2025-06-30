export type ContractType =
  | "FULL_TIME"
  | "PART_TIME"
  | "INTERNSHIP"
  | "VOLUNTEER"
  | "FREELANCE";
export type WorkModality = "ON_SITE" | "REMOTE" | "HYBRID";
export type ExperienceLevel =
  | "NO_EXPERIENCE"
  | "ENTRY_LEVEL"
  | "MID_LEVEL"
  | "SENIOR_LEVEL";
export type JobStatus = "ACTIVE" | "PAUSED" | "CLOSED" | "DRAFT";
export type ApplicationStatus =
  | "SENT"
  | "UNDER_REVIEW"
  | "PRE_SELECTED"
  | "REJECTED"
  | "HIRED";

export interface Company {
  id: string;
  name: string;
  logo?: string;
  description: string;
  website?: string;
  sector: string;
  size: string;
  location: string;
  rating?: number;
  reviewCount?: number;
}

export interface JobOffer {
  id: string;
  title: string;
  description: string;
  company: Company;
  location: string;
  contractType: ContractType;
  workModality: WorkModality;
  experienceLevel: ExperienceLevel;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  requiredSkills: string[];
  desiredSkills?: string[];
  benefits: string[];
  requirements: string[];
  responsibilities: string[];
  status: JobStatus;
  publishedAt: string;
  closingDate?: string;
  applicationCount: number;
  viewCount: number;
  questions?: JobQuestion[];
  featured?: boolean;
}

export interface JobQuestion {
  id: string;
  question: string;
  type: "TEXT" | "MULTIPLE_CHOICE" | "YES_NO";
  required: boolean;
  options?: string[];
}

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  companyLogo?: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  cvUrl?: string;
  coverLetter?: string;
  answers?: JobQuestionAnswer[];
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  notes?: string;
  rating?: number;
}

export interface JobQuestionAnswer {
  questionId: string;
  question: string;
  answer: string;
}

export interface JobSearchFilters {
  query?: string;
  location?: string[];
  contractType?: ContractType[];
  workModality?: WorkModality[];
  experienceLevel?: ExperienceLevel[];
  salaryMin?: number;
  salaryMax?: number;
  publishedInDays?: number;
  companySize?: string[];
  sector?: string[];
}

export interface JobAlert {
  id: string;
  userId: string;
  name: string;
  filters: JobSearchFilters;
  isActive: boolean;
  frequency: "DAILY" | "WEEKLY" | "IMMEDIATE";
  createdAt: string;
  lastNotificationAt?: string;
}

export interface SavedSearch {
  id: string;
  userId: string;
  name: string;
  filters: JobSearchFilters;
  createdAt: string;
}
