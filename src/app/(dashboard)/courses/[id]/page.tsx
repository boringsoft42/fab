"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { CourseDetail } from "@/components/courses/course-detail";
import { Course } from "@/types/api";

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
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/course/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();

      if (response.ok) {
        setCourse(data.course);
      } else {
        console.error("Error loading course:", data);
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = () => {
    router.push(`/development/courses/${params.id}/enroll`);
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
        <Button asChild>
          <Link href="/development/courses">Volver al catálogo</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-6 text-sm text-muted-foreground">
        <Link
          href="/development/courses"
          className="hover:text-foreground flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          Cursos
        </Link>
        <span>/</span>
        <span className="text-foreground">{course.title}</span>
      </div>

      <CourseDetail 
        course={course} 
        onEnroll={handleEnroll}
      />
    </div>
  );
}
