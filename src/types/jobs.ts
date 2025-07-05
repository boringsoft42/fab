export type ContractType =
  | &ldquo;FULL_TIME&rdquo;
  | &ldquo;PART_TIME&rdquo;
  | &ldquo;INTERNSHIP&rdquo;
  | &ldquo;VOLUNTEER&rdquo;
  | &ldquo;FREELANCE&rdquo;;
export type WorkModality = &ldquo;ON_SITE&rdquo; | &ldquo;REMOTE&rdquo; | &ldquo;HYBRID&rdquo;;
export type ExperienceLevel =
  | &ldquo;NO_EXPERIENCE&rdquo;
  | &ldquo;ENTRY_LEVEL&rdquo;
  | &ldquo;MID_LEVEL&rdquo;
  | &ldquo;SENIOR_LEVEL&rdquo;;
export type JobStatus = &ldquo;ACTIVE&rdquo; | &ldquo;PAUSED&rdquo; | &ldquo;CLOSED&rdquo; | &ldquo;DRAFT&rdquo;;
export type ApplicationStatus =
  | &ldquo;SENT&rdquo;
  | &ldquo;UNDER_REVIEW&rdquo;
  | &ldquo;PRE_SELECTED&rdquo;
  | &ldquo;REJECTED&rdquo;
  | &ldquo;HIRED&rdquo;;

export interface Company {
  id: string;
  name: string;
  logo: string;
  description: string;
  website: string;
  sector: string;
  size: string;
  location: string;
  rating?: number;
  reviewCount?: number;
  images?: string[];
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
  expiresAt: string;
}

export interface JobQuestion {
  id: string;
  question: string;
  type: &ldquo;TEXT&rdquo; | &ldquo;MULTIPLE_CHOICE&rdquo; | &ldquo;YES_NO&rdquo;;
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
  frequency: &ldquo;DAILY&rdquo; | &ldquo;WEEKLY&rdquo; | &ldquo;IMMEDIATE&rdquo;;
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
