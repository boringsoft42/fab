// Course and Learning Management System Types

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  videoPreview?: string;
  instructor: Instructor;
  institution: string;
  category: CourseCategory;
  level: CourseLevel;
  duration: number; // in hours
  totalLessons: number;
  rating: number;
  studentCount: number;
  price: number; // 0 for free courses
  isMandatory: boolean;
  isActive: boolean;
  objectives: string[];
  prerequisites: string[];
  includedMaterials: string[];
  certification: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  sections: CourseSection[];
  totalQuizzes: number;
  totalResources: number;
  progress?: number;
  enrolledAt?: Date;
  completedAt?: Date;
  certificate?: {
    id: string;
    url: string;
    issuedAt: Date;
  };
}

export interface Instructor {
  id: string;
  name: string;
  title: string;
  avatar: string;
  bio: string;
  rating: number;
  totalStudents: number;
  totalCourses: number;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  order: number;
  duration: number; // in minutes
  lessons: Lesson[];
  isLocked: boolean;
  prerequisites?: string[]; // module IDs
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  type: LessonType;
  content: LessonContent;
  duration: number; // in minutes
  order: number;
  isPreview: boolean;
  attachments?: Attachment[];
  quiz?: Quiz;
}

export interface LessonContent {
  video?: {
    url: string;
    duration: number;
    subtitles?: Subtitle[];
    thumbnails?: string[];
  };
  text?: string; // markdown content
  images?: string[];
  documents?: Attachment[];
  externalLinks?: ExternalLink[];
  exercises?: Exercise[];
}

export interface Subtitle {
  language: string;
  url: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
  size: number;
}

export interface ExternalLink {
  title: string;
  url: string;
  description?: string;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  instructions: string[];
  solution?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  timeLimit?: number; // in minutes
  passingScore: number;
  questions: QuizQuestion[];
  attempts: number;
  isRequired: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOption: number;
  explanation: string;
  points: number;
}

export interface CourseSection {
  id: string;
  title: string;
  description: string;
  order: number;
  videoUrl?: string;
  videoDuration?: string;
  content?: string;
  resources: CourseResource[];
  quiz?: Quiz;
}

export interface CourseResource {
  id: string;
  title: string;
  description?: string;
  type: ResourceType;
  url: string;
  fileSize?: string;
  duration?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: Date;
  completedAt?: Date;
  lastAccessedAt: Date;
  status: EnrollmentStatus;
  progress: CourseProgress;
}

export interface CourseProgress {
  userId: string;
  courseId: string;
  completedSections: string[];
  quizAttempts: {
    quizId: string;
    attempts: number;
    bestScore: number;
    passed: boolean;
    lastAttemptAt: Date;
  }[];
  downloadedResources: string[];
  lastAccessedAt: Date;
  isCompleted: boolean;
  completedAt?: Date;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  template: string;
  issuedAt: Date;
  verificationCode: string;
  digitalSignature: string;
  isValid: boolean;
}

export interface StudentNote {
  id: string;
  userId: string;
  lessonId: string;
  content: string;
  timestamp?: number; // for video notes
  createdAt: Date;
  updatedAt: Date;
}

export interface Discussion {
  id: string;
  lessonId: string;
  userId: string;
  content: string;
  parentId?: string; // for replies
  likes: number;
  createdAt: Date;
  updatedAt: Date;
  replies: Discussion[];
}

// Enums
export enum CourseCategory {
  SOFT_SKILLS = &ldquo;soft_skills&rdquo;,
  BASIC_COMPETENCIES = &ldquo;basic_competencies&rdquo;,
  JOB_PLACEMENT = &ldquo;job_placement&rdquo;,
  ENTREPRENEURSHIP = &ldquo;entrepreneurship&rdquo;,
  TECHNICAL_SKILLS = &ldquo;technical_skills&rdquo;,
  DIGITAL_LITERACY = &ldquo;digital_literacy&rdquo;,
  COMMUNICATION = &ldquo;communication&rdquo;,
  LEADERSHIP = &ldquo;leadership&rdquo;,
}

export enum CourseLevel {
  BEGINNER = &ldquo;beginner&rdquo;,
  INTERMEDIATE = &ldquo;intermediate&rdquo;,
  ADVANCED = &ldquo;advanced&rdquo;,
}

export enum LessonType {
  VIDEO = &ldquo;video&rdquo;,
  TEXT = &ldquo;text&rdquo;,
  QUIZ = &ldquo;quiz&rdquo;,
  EXERCISE = &ldquo;exercise&rdquo;,
  DOCUMENT = &ldquo;document&rdquo;,
  INTERACTIVE = &ldquo;interactive&rdquo;,
}

export enum QuestionType {
  MULTIPLE_CHOICE = &ldquo;multiple_choice&rdquo;,
  TRUE_FALSE = &ldquo;true_false&rdquo;,
  FILL_BLANK = &ldquo;fill_blank&rdquo;,
  SORT_ELEMENTS = &ldquo;sort_elements&rdquo;,
  MULTIPLE_SELECT = &ldquo;multiple_select&rdquo;,
  SHORT_ANSWER = &ldquo;short_answer&rdquo;,
}

export enum EnrollmentStatus {
  ENROLLED = &ldquo;enrolled&rdquo;,
  IN_PROGRESS = &ldquo;in_progress&rdquo;,
  COMPLETED = &ldquo;completed&rdquo;,
  DROPPED = &ldquo;dropped&rdquo;,
  SUSPENDED = &ldquo;suspended&rdquo;,
}

export enum ResourceType {
  PDF = &ldquo;PDF&rdquo;,
  VIDEO = &ldquo;VIDEO&rdquo;,
  LINK = &ldquo;LINK&rdquo;,
  IMAGE = &ldquo;IMAGE&rdquo;,
}

// Filter and Search Types
export interface CourseFilters {
  category?: CourseCategory[];
  level?: CourseLevel[];
  duration?: {
    min: number;
    max: number;
  };
  price?: {
    min: number;
    max: number;
  };
  rating?: number;
  isFree?: boolean;
  isMandatory?: boolean;
  instructor?: string;
  tags?: string[];
}

export interface CourseSearchParams {
  query?: string;
  filters?: CourseFilters;
  sortBy?: &ldquo;popularity&rdquo; | &ldquo;date&rdquo; | &ldquo;rating&rdquo; | &ldquo;title&rdquo; | &ldquo;duration&rdquo;;
  sortOrder?: &ldquo;asc&rdquo; | &ldquo;desc&rdquo;;
  page?: number;
  limit?: number;
}

// Response Types
export interface CourseCatalogResponse {
  courses: Course[];
  total: number;
  page: number;
  totalPages: number;
  filters: {
    categories: { value: CourseCategory; count: number }[];
    levels: { value: CourseLevel; count: number }[];
    instructors: { value: string; count: number }[];
    tags: { value: string; count: number }[];
  };
}

// Mandatory Courses Content Structure
export interface MandatoryCourse {
  id: string;
  title: string;
  duration: number;
  modules: {
    title: string;
    lessons: {
      title: string;
      type: LessonType;
      duration: number;
      content: string;
    }[];
  }[];
}

// The 5 mandatory courses
export const MANDATORY_COURSES = {
  SOFT_SKILLS: &ldquo;soft-skills-empowerment&rdquo;,
  BASIC_COMPETENCIES: &ldquo;basic-competencies&rdquo;,
  JOB_PLACEMENT: &ldquo;job-placement-skills&rdquo;,
  ENTREPRENEURSHIP: &ldquo;entrepreneurship-fundamentals&rdquo;,
  TECHNICAL_SKILLS: &ldquo;technical-skills-digital&rdquo;,
} as const;
