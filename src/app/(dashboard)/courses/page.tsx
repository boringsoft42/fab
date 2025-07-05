&ldquo;use client&rdquo;;

import { useState, useEffect } from &ldquo;react&rdquo;;
import { useSearchParams, useRouter } from &ldquo;next/navigation&rdquo;;
import {
  Course,
  CourseCatalogResponse,
  CourseFilters,
  CourseCategory,
  CourseLevel,
} from &ldquo;@/types/courses&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Input } from &ldquo;@/components/ui/input&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { Card, CardContent, CardHeader } from &ldquo;@/components/ui/card&rdquo;;
import { Progress } from &ldquo;@/components/ui/progress&rdquo;;
import { Separator } from &ldquo;@/components/ui/separator&rdquo;;
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from &ldquo;@/components/ui/select&rdquo;;
import { Checkbox } from &ldquo;@/components/ui/checkbox&rdquo;;
import { Slider } from &ldquo;@/components/ui/slider&rdquo;;
import {
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  Clock,
  Users,
  BookOpen,
  Award,
  ChevronDown,
  X,
} from &ldquo;lucide-react&rdquo;;
import { CourseCard } from &ldquo;@/components/courses/course-card&rdquo;;
import { CourseFilters as CourseFiltersComponent } from &ldquo;@/components/courses/course-filters&rdquo;;

export default function CoursesPage() {
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<&ldquo;grid&rdquo; | &ldquo;list&rdquo;>(&ldquo;grid&rdquo;);
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get(&ldquo;query&rdquo;) || &ldquo;&rdquo;
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get(&ldquo;sortBy&rdquo;) || &ldquo;popularity&rdquo;
  );
  const [showFilters, setShowFilters] = useState(false);
  const [totalCourses, setTotalCourses] = useState(0);
  const [page, setPage] = useState(1);
  const [activeFilters, setActiveFilters] = useState<CourseFilters>({});

  // Fetch courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      if (searchQuery) params.append(&ldquo;query&rdquo;, searchQuery);
      if (sortBy) params.append(&ldquo;sortBy&rdquo;, sortBy);
      if (page > 1) params.append(&ldquo;page&rdquo;, page.toString());

      // Add filters to params
      if (activeFilters.category?.length) {
        params.append(&ldquo;category&rdquo;, activeFilters.category.join(&ldquo;,&rdquo;));
      }
      if (activeFilters.level?.length) {
        params.append(&ldquo;level&rdquo;, activeFilters.level.join(&ldquo;,&rdquo;));
      }
      if (activeFilters.isFree !== undefined) {
        params.append(&ldquo;isFree&rdquo;, activeFilters.isFree.toString());
      }
      if (activeFilters.isMandatory !== undefined) {
        params.append(&ldquo;isMandatory&rdquo;, activeFilters.isMandatory.toString());
      }

      const response = await fetch(`/api/courses?${params}`);
      const data: CourseCatalogResponse = await response.json();

      setCourses(data.courses);
      setTotalCourses(data.total);
    } catch (error) {
      console.error(&ldquo;Error fetching courses:&rdquo;, error);
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
    setSearchQuery(&ldquo;&rdquo;);
    setPage(1);
    router.push(&ldquo;/courses&rdquo;);
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
      <div className=&ldquo;container mx-auto p-6&rdquo;>
        <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6&rdquo;>
          {[...Array(6)].map((_, i) => (
            <Card key={i} className=&ldquo;animate-pulse&rdquo;>
              <div className=&ldquo;h-48 bg-gray-200 rounded-t-lg&rdquo; />
              <CardContent className=&ldquo;p-4&rdquo;>
                <div className=&ldquo;h-4 bg-gray-200 rounded mb-2&rdquo; />
                <div className=&ldquo;h-3 bg-gray-200 rounded mb-4&rdquo; />
                <div className=&ldquo;flex justify-between&rdquo;>
                  <div className=&ldquo;h-3 bg-gray-200 rounded w-16&rdquo; />
                  <div className=&ldquo;h-3 bg-gray-200 rounded w-12&rdquo; />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className=&ldquo;container mx-auto p-6&rdquo;>
      {/* Header */}
      <div className=&ldquo;mb-8&rdquo;>
        <h1 className=&ldquo;text-3xl font-bold mb-2&rdquo;>Catálogo de Cursos</h1>
        <p className=&ldquo;text-muted-foreground&rdquo;>
          Desarrolla tus habilidades con nuestros cursos especializados
        </p>
      </div>

      {/* Search and Controls */}
      <div className=&ldquo;mb-6 space-y-4&rdquo;>
        {/* Search Bar */}
        <div className=&ldquo;relative&rdquo;>
          <Search className=&ldquo;absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4&rdquo; />
          <Input
            placeholder=&ldquo;Buscar cursos, instructores, habilidades...&rdquo;
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className=&ldquo;pl-10 pr-4&rdquo;
          />
        </div>

        {/* Controls Row */}
        <div className=&ldquo;flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4&rdquo;>
          <div className=&ldquo;flex items-center gap-4&rdquo;>
            <Button
              variant={showFilters ? &ldquo;default&rdquo; : &ldquo;outline&rdquo;}
              onClick={() => setShowFilters(!showFilters)}
              className=&ldquo;flex items-center gap-2&rdquo;
            >
              <Filter className=&ldquo;h-4 w-4&rdquo; />
              Filtros
              {getActiveFilterCount() > 0 && (
                <Badge variant=&ldquo;secondary&rdquo; className=&ldquo;ml-1&rdquo;>
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>

            {getActiveFilterCount() > 0 && (
              <Button variant=&ldquo;ghost&rdquo; onClick={clearFilters} size=&ldquo;sm&rdquo;>
                <X className=&ldquo;h-4 w-4 mr-1&rdquo; />
                Limpiar filtros
              </Button>
            )}
          </div>

          <div className=&ldquo;flex items-center gap-4&rdquo;>
            <div className=&ldquo;flex items-center gap-2&rdquo;>
              <span className=&ldquo;text-sm text-muted-foreground&rdquo;>
                Ordenar por:
              </span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className=&ldquo;w-40&rdquo;>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=&ldquo;popularity&rdquo;>Popularidad</SelectItem>
                  <SelectItem value=&ldquo;rating&rdquo;>Calificación</SelectItem>
                  <SelectItem value=&ldquo;date&rdquo;>Más recientes</SelectItem>
                  <SelectItem value=&ldquo;title&rdquo;>Título A-Z</SelectItem>
                  <SelectItem value=&ldquo;duration&rdquo;>Duración</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className=&ldquo;flex border rounded-md&rdquo;>
              <Button
                variant={viewMode === &ldquo;grid&rdquo; ? &ldquo;default&rdquo; : &ldquo;ghost&rdquo;}
                size=&ldquo;sm&rdquo;
                onClick={() => setViewMode(&ldquo;grid&rdquo;)}
              >
                <Grid3X3 className=&ldquo;h-4 w-4&rdquo; />
              </Button>
              <Button
                variant={viewMode === &ldquo;list&rdquo; ? &ldquo;default&rdquo; : &ldquo;ghost&rdquo;}
                size=&ldquo;sm&rdquo;
                onClick={() => setViewMode(&ldquo;list&rdquo;)}
              >
                <List className=&ldquo;h-4 w-4&rdquo; />
              </Button>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {getActiveFilterCount() > 0 && (
          <div className=&ldquo;flex flex-wrap gap-2&rdquo;>
            {activeFilters.category?.map((category) => (
              <Badge
                key={category}
                variant=&ldquo;secondary&rdquo;
                className=&ldquo;flex items-center gap-1&rdquo;
              >
                {category.replace(&ldquo;_&rdquo;, &ldquo; &rdquo;)}
                <X
                  className=&ldquo;h-3 w-3 cursor-pointer&rdquo;
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
                variant=&ldquo;secondary&rdquo;
                className=&ldquo;flex items-center gap-1&rdquo;
              >
                {level}
                <X
                  className=&ldquo;h-3 w-3 cursor-pointer&rdquo;
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
              <Badge variant=&ldquo;secondary&rdquo; className=&ldquo;flex items-center gap-1&rdquo;>
                Gratis
                <X
                  className=&ldquo;h-3 w-3 cursor-pointer&rdquo;
                  onClick={() =>
                    setActiveFilters({ ...activeFilters, isFree: undefined })
                  }
                />
              </Badge>
            )}
            {activeFilters.isMandatory && (
              <Badge variant=&ldquo;secondary&rdquo; className=&ldquo;flex items-center gap-1&rdquo;>
                Obligatorio
                <X
                  className=&ldquo;h-3 w-3 cursor-pointer&rdquo;
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

      <div className=&ldquo;grid grid-cols-1 lg:grid-cols-4 gap-6&rdquo;>
        {/* Filters Sidebar */}
        {showFilters && (
          <div className=&ldquo;lg:col-span-1&rdquo;>
            <CourseFiltersComponent
              filters={activeFilters}
              onFiltersChange={handleFilterChange}
            />
          </div>
        )}

        {/* Course Grid */}
        <div className={showFilters ? &ldquo;lg:col-span-3&rdquo; : &ldquo;lg:col-span-4&rdquo;}>
          <div className=&ldquo;mb-4 flex justify-between items-center&rdquo;>
            <p className=&ldquo;text-sm text-muted-foreground&rdquo;>
              {totalCourses} cursos encontrados
            </p>
          </div>

          {courses.length === 0 ? (
            <div className=&ldquo;text-center py-12&rdquo;>
              <BookOpen className=&ldquo;h-12 w-12 text-muted-foreground mx-auto mb-4&rdquo; />
              <h3 className=&ldquo;text-lg font-semibold mb-2&rdquo;>
                No se encontraron cursos
              </h3>
              <p className=&ldquo;text-muted-foreground mb-4&rdquo;>
                Intenta ajustar tus filtros o términos de búsqueda
              </p>
              <Button onClick={clearFilters}>Limpiar filtros</Button>
            </div>
          ) : (
            <div
              className={
                viewMode === &ldquo;grid&rdquo;
                  ? &ldquo;grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6&rdquo;
                  : &ldquo;space-y-4&rdquo;
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
            <div className=&ldquo;text-center mt-8&rdquo;>
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
