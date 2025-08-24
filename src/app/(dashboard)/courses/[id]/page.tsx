"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CourseDetail } from "@/components/courses/course-detail";
import { Course } from "@/types/api";
import { apiCall } from "@/lib/api";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseDetails();
  }, [params.id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const courseId = params.id as string;
      console.log("🔍 CourseDetailPage: Fetching course with ID:", courseId);

      const data = await apiCall(`/course/${courseId}`);
      console.log("🔍 CourseDetailPage: API response:", data);

      const courseData = data.course || data;
      console.log("🔍 CourseDetailPage: Course data:", courseData);

      setCourse(courseData);
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = () => {
    const courseId = params.id as string;
    router.push(`/development/courses/${courseId}/enroll`);
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded" />
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 rounded" />
              <div className="h-12 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Curso no encontrado</h1>
        <Button onClick={handleBack}>Volver</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
        <button
          onClick={handleBack}
          className="hover:text-foreground flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>
        <span>/</span>
        <span className="text-foreground">{course.title}</span>
      </div>

      <CourseDetail course={course} onEnroll={handleEnroll} />
    </div>
  );
}
