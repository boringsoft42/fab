"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Course, CourseCatalogResponse, CourseFilters } from "@/types/courses";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Filter, Grid3X3, List, X, BookOpen } from "lucide-react";
import { CourseCard } from "@/components/courses/course-card";
import { CourseFilters as CourseFiltersComponent } from "@/components/courses/course-filters";

export default function CoursesPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("query") || ""
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get("sortBy") || "popularity"
  );
  const [showFilters, setShowFilters] = useState(false);
  const [totalCourses, setTotalCourses] = useState(0);
  const [page, setPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState<CourseFilters>({});

  // Fetch courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append("query", searchQuery);
      if (sortBy) params.append("sortBy", sortBy);
      if (page > 1) params.append("page", page.toString());

      // Add filters to params
      if (activeFilters.category?.length) {
        params.append("category", activeFilters.category.join(","));
      }
      if (activeFilters.level?.length) {
        params.append("level", activeFilters.level.join(","));
      }
      if (activeFilters.isFree !== undefined) {
        params.append("isFree", activeFilters.isFree.toString());
      }
      if (activeFilters.isMandatory !== undefined) {
        params.append("isMandatory", activeFilters.isMandatory.toString());
      }

      const response = await fetch(`/api/courses?${params.toString()}`);
      const data: CourseCatalogResponse = await response.json();

      setCourses(data.courses);
      setTotalCourses(data.total);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [searchQuery, sortBy, activeFilters, page]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
    updateURL({ query });
  };

  const handleFilterChange = (filters: CourseFilters) => {
    setActiveFilters(filters);
    setPage(1);
  };

  const updateURL = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    router.push(`/courses?${newParams.toString()}`);
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchQuery("");
    setPage(1);
    router.push("/courses");
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.category?.length) count += activeFilters.category.length;
    if (activeFilters.level?.length) count += activeFilters.level.length;
    if (activeFilters.isFree !== undefined) count += 1;
    if (activeFilters.isMandatory !== undefined) count += 1;
    return count;
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-t-lg" />
              <CardContent className="p-4">
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-3 bg-gray-200 rounded mb-4" />
                <div className="flex justify-between">
                  <div className="h-3 bg-gray-200 rounded w-16" />
                  <div className="h-3 bg-gray-200 rounded w-12" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Catálogo de Cursos</h1>
        <p className="text-muted-foreground">
          Desarrolla tus habilidades con nuestros cursos especializados
        </p>
      </div>

      {/* Search and Controls */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar cursos, instructores, habilidades..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-10 pr-4"
          />
        </div>

        {/* Controls Row */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros
              {getActiveFilterCount() > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>

            {getActiveFilterCount() > 0 && (
              <Button variant="ghost" onClick={clearFilters} size="sm">
                <X className="h-4 w-4 mr-1" />
                Limpiar filtros
              </Button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Ordenar por:
              </span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Popularidad</SelectItem>
                  <SelectItem value="rating">Calificación</SelectItem>
                  <SelectItem value="date">Más recientes</SelectItem>
                  <SelectItem value="title">Título A-Z</SelectItem>
                  <SelectItem value="duration">Duración</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex border rounded-md">
              <Button
                variant={viewMode === "grid" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {getActiveFilterCount() > 0 && (
          <div className="flex flex-wrap gap-2">
            {activeFilters.category?.map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {category.replace("_", " ")}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => {
                    const newCategories = activeFilters.category?.filter(
                      (c) => c !== category
                    );
                    setActiveFilters({
                      ...activeFilters,
                      category: newCategories?.length
                        ? newCategories
                        : undefined,
                    });
                  }}
                />
              </Badge>
            ))}
            {activeFilters.level?.map((level) => (
              <Badge
                key={level}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {level}
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() => {
                    const newLevels = activeFilters.level?.filter(
                      (l) => l !== level
                    );
                    setActiveFilters({
                      ...activeFilters,
                      level: newLevels?.length ? newLevels : undefined,
                    });
                  }}
                />
              </Badge>
            ))}
            {activeFilters.isFree && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Gratis
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() =>
                    setActiveFilters({ ...activeFilters, isFree: undefined })
                  }
                />
              </Badge>
            )}
            {activeFilters.isMandatory && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Obligatorio
                <X
                  className="h-3 w-3 cursor-pointer"
                  onClick={() =>
                    setActiveFilters({
                      ...activeFilters,
                      isMandatory: undefined,
                    })
                  }
                />
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="lg:col-span-1">
            <CourseFiltersComponent
              filters={activeFilters}
              onFiltersChange={handleFilterChange}
            />
          </div>
        )}

        {/* Course Grid */}
        <div className={showFilters ? "lg:col-span-3" : "lg:col-span-4"}>
          <div className="mb-4 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {totalCourses} cursos encontrados
            </p>
          </div>

          {courses.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No se encontraron cursos
              </h3>
              <p className="text-muted-foreground mb-4">
                Intenta ajustar tus filtros o términos de búsqueda
              </p>
              <Button onClick={clearFilters}>Limpiar filtros</Button>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  viewMode={viewMode}
                />
              ))}
            </div>
          )}

          {/* Load More / Pagination */}
          {courses.length > 0 && courses.length < totalCourses && (
            <div className="text-center mt-8">
              <Button onClick={() => setPage(page + 1)} disabled={loading}>
                Cargar más cursos
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
