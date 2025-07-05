import type {
  UserRole,
  UserStatus,
  EducationLevel,
  CompanySize,
} from &ldquo;@prisma/client&rdquo;;

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
  role: &ldquo;YOUTH&rdquo;;
  educationLevel?: EducationLevel;
  skills: string[];
  interests: string[];
  workExperience?: unknown;
};

export type AdolescentProfile = Profile & {
  role: &ldquo;ADOLESCENTS&rdquo;;
  educationLevel?: EducationLevel;
  skills: string[];
  interests: string[];
  parentalConsent: boolean;
  parentEmail?: string;
};

export type CompanyProfile = Profile & {
  role: &ldquo;COMPANIES&rdquo;;
  companyName: string;
  taxId?: string;
  legalRepresentative?: string;
  businessSector?: string;
  companySize?: CompanySize;
  companyDescription?: string;
};

export type InstitutionProfile = Profile & {
  role: &ldquo;MUNICIPAL_GOVERNMENTS&rdquo; | &ldquo;TRAINING_CENTERS&rdquo; | &ldquo;NGOS_AND_FOUNDATIONS&rdquo;;
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
  contractType: &ldquo;PAID&rdquo; | &ldquo;INTERNSHIP&rdquo; | &ldquo;VOLUNTEER&rdquo;;
  workSchedule: &ldquo;FULL_TIME&rdquo; | &ldquo;PART_TIME&rdquo; | &ldquo;FLEXIBLE&rdquo;;
  workModality: &ldquo;ON_SITE&rdquo; | &ldquo;REMOTE&rdquo; | &ldquo;HYBRID&rdquo;;
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
  status: &ldquo;SENT&rdquo; | &ldquo;UNDER_REVIEW&rdquo; | &ldquo;PRE_SELECTED&rdquo; | &ldquo;REJECTED&rdquo; | &ldquo;HIRED&rdquo;;
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
  level: &ldquo;BASIC&rdquo; | &ldquo;INTERMEDIATE&rdquo; | &ldquo;ADVANCED&rdquo;;
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
  businessStage: &ldquo;IDEA&rdquo; | &ldquo;STARTUP&rdquo; | &ldquo;GROWING&rdquo; | &ldquo;ESTABLISHED&rdquo;;
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
