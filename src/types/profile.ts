import type {
  UserRole,
  UserStatus,
  EducationLevel,
  CompanySize,
} from "@prisma/client";

export interface Profile {
  id: string;
  userId: string;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  status: UserStatus;
  role: UserRole;

  // Basic Information (All users)
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  municipality?: string;
  department?: string;
  country?: string;
  birthDate?: Date;
  gender?: string;

  // Identification
  documentType?: string;
  documentNumber?: string;

  // For YOUTH and ADOLESCENTS
  educationLevel?: EducationLevel;
  currentInstitution?: string;
  graduationYear?: number;
  isStudying?: boolean;
  skills?: string[];
  interests?: string[];
  workExperience?: unknown; // JSON object

  // For COMPANIES
  companyName?: string;
  taxId?: string;
  legalRepresentative?: string;
  businessSector?: string;
  companySize?: CompanySize;
  companyDescription?: string;
  website?: string;
  foundedYear?: number;

  // For INSTITUTIONS (Governments, Centers, NGOs)
  institutionName?: string;
  institutionType?: string;
  serviceArea?: string;
  specialization?: string[];
  institutionDescription?: string;

  // Profile Completion
  profileCompletion: number;
  lastLoginAt?: Date;

  // Parental Consent (for ADOLESCENTS)
  parentalConsent: boolean;
  parentEmail?: string;
  consentDate?: Date;
}

// Utility types for different user roles
export type YouthProfile = Profile & {
  role: "YOUTH";
  educationLevel?: EducationLevel;
  skills: string[];
  interests: string[];
  workExperience?: unknown;
};

export type AdolescentProfile = Profile & {
  role: "ADOLESCENTS";
  educationLevel?: EducationLevel;
  skills: string[];
  interests: string[];
  parentalConsent: boolean;
  parentEmail?: string;
};

export type CompanyProfile = Profile & {
  role: "COMPANIES";
  companyName: string;
  taxId?: string;
  legalRepresentative?: string;
  businessSector?: string;
  companySize?: CompanySize;
  companyDescription?: string;
};

export type InstitutionProfile = Profile & {
  role: "MUNICIPAL_GOVERNMENTS" | "TRAINING_CENTERS" | "NGOS_AND_FOUNDATIONS";
  institutionName: string;
  institutionType?: string;
  serviceArea?: string;
  specialization: string[];
  institutionDescription?: string;
};

// Permission matrix type
export interface UserPermissions {
  canSearchJobs: boolean;
  canPublishJobs: boolean;
  canAccessTraining: boolean;
  canManageTraining: boolean;
  canAccessEntrepreneurship: boolean;
  canManageEntrepreneurship: boolean;
  canViewReports: boolean;
  canViewAdvancedReports: boolean;
  canManageUsers: boolean;
  requiresParentalConsent: boolean;
}

// Job related types
export interface JobOffer {
  id: string;
  title: string;
  description: string;
  requirements: string;
  benefits?: string;
  salaryMin?: number;
  salaryMax?: number;
  contractType: "PAID" | "INTERNSHIP" | "VOLUNTEER";
  workSchedule: "FULL_TIME" | "PART_TIME" | "FLEXIBLE";
  workModality: "ON_SITE" | "REMOTE" | "HYBRID";
  location: string;
  municipality: string;
  department: string;
  experienceLevel: string;
  educationRequired?: EducationLevel;
  skillsRequired: string[];
  applicationDeadline?: Date;
  isActive: boolean;
  viewsCount: number;
  applicationsCount: number;
  companyId: string;
  company?: CompanyProfile;
  createdAt: Date;
  updatedAt: Date;
}

export interface JobApplication {
  id: string;
  applicantId: string;
  jobOfferId: string;
  coverLetter?: string;
  cvUrl?: string;
  status: "SENT" | "UNDER_REVIEW" | "PRE_SELECTED" | "REJECTED" | "HIRED";
  appliedAt: Date;
  reviewedAt?: Date;
  notes?: string;
  rating?: number;
  applicant?: YouthProfile | AdolescentProfile;
  jobOffer?: JobOffer;
}

// Course related types
export interface Course {
  id: string;
  title: string;
  description: string;
  objectives: string[];
  prerequisites: string[];
  duration: number;
  level: "BASIC" | "INTERMEDIATE" | "ADVANCED";
  category: string;
  thumbnailUrl?: string;
  isMandatory: boolean;
  isActive: boolean;
  price?: number;
  rating?: number;
  studentsCount: number;
  completionRate?: number;
  instructorId?: string;
  institutionName?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseEnrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  progress: number;
  currentModuleId?: string;
  currentLessonId?: string;
  certificateUrl?: string;
  course?: Course;
}

// Entrepreneurship related types
export interface Entrepreneurship {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  businessStage: "IDEA" | "STARTUP" | "GROWING" | "ESTABLISHED";
  logo?: string;
  images: string[];
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  municipality: string;
  department: string;
  socialMedia?: unknown;
  founded?: Date;
  employees?: number;
  annualRevenue?: number;
  businessModel?: string;
  targetMarket?: string;
  isPublic: boolean;
  isActive: boolean;
  viewsCount: number;
  rating?: number;
  reviewsCount: number;
  owner?: Profile;
  createdAt: Date;
  updatedAt: Date;
}

export interface BusinessPlan {
  id: string;
  entrepreneurshipId: string;
  executiveSummary?: string;
  missionStatement?: string;
  visionStatement?: string;
  marketAnalysis?: string;
  targetMarket?: string;
  competitiveAnalysis?: string;
  businessModelCanvas?: unknown;
  revenueStreams: string[];
  costStructure?: unknown;
  marketingStrategy?: string;
  pricingStrategy?: string;
  salesStrategy?: string;
  initialInvestment?: number;
  monthlyExpenses?: number;
  revenueProjection?: unknown;
  breakEvenPoint?: number;
  roi?: number;
  riskAnalysis?: string;
  mitigationStrategies: string[];
  operationalPlan?: string;
  managementTeam?: unknown;
  isCompleted: boolean;
  lastSection?: string;
  completionPercentage: number;
  createdAt: Date;
  updatedAt: Date;
}
