import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CourseService } from "@/services/course.service";
import { Course } from "@/types/api";

// Query keys
const COURSE_KEYS = {
  all: ['courses'] as const,
  lists: () => [...COURSE_KEYS.all, 'list'] as const,
  list: (filters: string) => [...COURSE_KEYS.lists(), { filters }] as const,
  details: () => [...COURSE_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...COURSE_KEYS.details(), id] as const,
};

// Get all courses
export const useCourses = () => {
  return useQuery({
    queryKey: COURSE_KEYS.lists(),
    queryFn: async () => {
      console.log("📚 useCourses - Starting...");
      console.log("📚 useCourses - Query key:", COURSE_KEYS.lists());
      try {
        console.log("📚 useCourses - Calling CourseService.getAll()");
        const result = await CourseService.getAll();
        console.log("✅ useCourses - Success:", result);
        return result;
      } catch (error) {
        console.error("❌ useCourses - Error:", error);
        throw error;
      }
    },
    retry: 1,
    retryDelay: 1000,
  });
};

// Get course by ID
export const useCourse = (id: string) => {
  return useQuery({
    queryKey: COURSE_KEYS.detail(id),
    queryFn: async () => {
      console.log("📚 useCourse - Calling CourseService.getById() with id:", id);
      try {
        const result = await CourseService.getById(id);
        console.log("✅ useCourse - Success:", result);
        return result;
      } catch (error) {
        console.error("❌ useCourse - Error:", error);
        throw error;
      }
    },
    enabled: !!id,
  });
};

// Create course
export const useCreateCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<Course>) => {
      console.log("📚 useCreateCourse - Calling CourseService.create() with data:", data);
      try {
        const result = await CourseService.create(data);
        console.log("✅ useCreateCourse - Success:", result);
        return result;
      } catch (error) {
        console.error("❌ useCreateCourse - Error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log("🔄 useCreateCourse - Invalidating queries");
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.lists() });
    },
  });
};

// Update course
export const useUpdateCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Course> }) => {
      console.log("📚 useUpdateCourse - Calling CourseService.update() with id:", id, "data:", data);
      try {
        const result = await CourseService.update(id, data);
        console.log("✅ useUpdateCourse - Success:", result);
        return result;
      } catch (error) {
        console.error("❌ useUpdateCourse - Error:", error);
        throw error;
      }
    },
    onSuccess: (_, { id }) => {
      console.log("🔄 useUpdateCourse - Invalidating queries");
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.detail(id) });
    },
  });
};

// Delete course
export const useDeleteCourse = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      console.log("📚 useDeleteCourse - Calling CourseService.delete() with id:", id);
      try {
        await CourseService.delete(id);
        console.log("✅ useDeleteCourse - Success");
      } catch (error) {
        console.error("❌ useDeleteCourse - Error:", error);
        throw error;
      }
    },
    onSuccess: () => {
      console.log("🔄 useDeleteCourse - Invalidating queries");
      queryClient.invalidateQueries({ queryKey: COURSE_KEYS.lists() });
    },
  });
}; 