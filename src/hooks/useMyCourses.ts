import { useQuery } from "@tanstack/react-query";
import { apiCall } from "@/lib/api";
import { Enrollment, EnrollmentStatus } from "@/types/courses";

export interface UserCourse {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
  startedAt: string | null;
  completedAt: string | null;
  status: EnrollmentStatus;
  progress: string;
  currentModuleId: string | null;
  currentLessonId: string | null;
  certificateUrl: string | null;
  timeSpent: number;
  certificateIssued: boolean;
  finalGrade: number | null;
  moduleProgress: any;
  quizResults: any;
  course: {
    id: string;
    title: string;
    slug: string;
    description: string;
    shortDescription: string;
    thumbnail: string;
    videoPreview: string;
    objectives: string[];
    prerequisites: string[];
    duration: number;
    level: string;
    category: string;
    isMandatory: boolean;
    isActive: boolean;
    price: string;
    rating: string;
    studentsCount: number;
    completionRate: string;
    totalLessons: number;
    totalQuizzes: number;
    totalResources: number;
    tags: string[];
    certification: boolean;
    includedMaterials: string[];
    instructorId: string | null;
    institutionName: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string | null;
    modules: Array<{
      id: string;
      courseId: string;
      title: string;
      description: string;
      orderIndex: number;
      estimatedDuration: number;
      isLocked: boolean;
      prerequisites: string[];
      lessons: Array<{
        id: string;
        moduleId: string;
        title: string;
        description: string;
        content: string;
        contentType: string;
        videoUrl: string;
        duration: number;
        orderIndex: number;
        isRequired: boolean;
        isPreview: boolean;
        attachments: any;
      }>;
    }>;
    instructor: any;
  };
  student: any;
}

export interface CourseStats {
  total: number;
  inProgress: number;
  completed: number;
  enrolled: number;
  totalTimeSpent: number;
  averageProgress: number;
  certificatesEarned: number;
}

export const useMyCourses = () => {
  return useQuery({
    queryKey: ["my-courses"],
    queryFn: async (): Promise<UserCourse[]> => {
      console.log("🔍 useMyCourses - Fetching course enrollments...");
      try {
        const response = await apiCall("/course-enrollments");
        console.log("🔍 useMyCourses - Response received:", response);
        return response;
      } catch (error) {
        console.error("🔍 useMyCourses - Error fetching courses:", error);
        throw error;
      }
    },
  });
};

export const useMyCoursesStats = (courses: UserCourse[] | undefined) => {
  if (!courses) {
    return {
      total: 0,
      inProgress: 0,
      completed: 0,
      enrolled: 0,
      totalTimeSpent: 0,
      averageProgress: 0,
      certificatesEarned: 0,
    };
  }

  const stats: CourseStats = {
    total: courses.length,
    inProgress: courses.filter(c => c.status === EnrollmentStatus.IN_PROGRESS).length,
    completed: courses.filter(c => c.status === EnrollmentStatus.COMPLETED).length,
    enrolled: courses.filter(c => c.status === EnrollmentStatus.ENROLLED).length,
    totalTimeSpent: courses.reduce((sum, c) => sum + (c.timeSpent || 0), 0),
    averageProgress: courses.length > 0 
      ? courses.reduce((sum, c) => sum + parseFloat(c.progress || "0"), 0) / courses.length
      : 0,
    certificatesEarned: courses.filter(c => c.certificateIssued).length,
  };

  return stats;
};
