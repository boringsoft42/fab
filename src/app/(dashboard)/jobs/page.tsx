&ldquo;use client&rdquo;;

import { useState, useEffect } from &ldquo;react&rdquo;;
import { useSearchParams } from &ldquo;next/navigation&rdquo;;
import { Search, Filter, Grid, List, SortDesc } from &ldquo;lucide-react&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Input } from &ldquo;@/components/ui/input&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { Skeleton } from &ldquo;@/components/ui/skeleton&rdquo;;
import { JobSearchFilters } from &ldquo;@/components/jobs/job-search-filters&rdquo;;
import { JobCard } from &ldquo;@/components/jobs/job-card&rdquo;;
import { JobOffer, JobSearchFilters as JobFilters } from &ldquo;@/types/jobs&rdquo;;

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [searchQuery, setSearchQuery] = useState(&ldquo;&rdquo;);
  const [viewMode, setViewMode] = useState<&ldquo;grid&rdquo; | &ldquo;list&rdquo;>(&ldquo;grid&rdquo;);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<JobFilters>({});

  const searchParams = useSearchParams();

  const fetchJobs = async (searchFilters: JobFilters) => {
    setLoading(true);
    try {
      if (searchFilters.query) params.append(&ldquo;query&rdquo;, searchFilters.query);
      if (searchFilters.location) {
        searchFilters.location.forEach((loc) => params.append(&ldquo;location&rdquo;, loc));
      }
      if (searchFilters.contractType) {
        searchFilters.contractType.forEach((type) =>
          params.append(&ldquo;contractType&rdquo;, type)
        );
      }
      if (searchFilters.workModality) {
        searchFilters.workModality.forEach((modality) =>
          params.append(&ldquo;workModality&rdquo;, modality)
        );
      }
      if (searchFilters.experienceLevel) {
        searchFilters.experienceLevel.forEach((level) =>
          params.append(&ldquo;experienceLevel&rdquo;, level)
        );
      }
      if (searchFilters.salaryMin)
        params.append(&ldquo;salaryMin&rdquo;, searchFilters.salaryMin.toString());
      if (searchFilters.salaryMax)
        params.append(&ldquo;salaryMax&rdquo;, searchFilters.salaryMax.toString());
      if (searchFilters.publishedInDays)
        params.append(
          &ldquo;publishedInDays&rdquo;,
          searchFilters.publishedInDays.toString()
        );
      if (searchFilters.sector) {
        searchFilters.sector.forEach((sector) =>
          params.append(&ldquo;sector&rdquo;, sector)
        );
      }

      const response = await fetch(`/api/jobs?${params.toString()}`);
      const data = await response.json();

      setJobs(data.jobs || []);
      setTotalJobs(data.total || 0);
    } catch (error) {
      console.error(&ldquo;Error fetching jobs:&rdquo;, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initialize search query from URL params
    const query = searchParams.get(&ldquo;q&rdquo;) || &ldquo;&rdquo;;
    setSearchQuery(query);
    setFilters((prev) => ({ ...prev, query }));
  }, [searchParams]);

  useEffect(() => {
    fetchJobs(filters);
  }, [filters]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters((prev) => ({ ...prev, query: searchQuery }));
  };

  const handleFiltersChange = (newFilters: JobFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({ query: searchQuery });
  };

  return (
    <div className=&ldquo;min-h-screen bg-gray-50&rdquo;>
      {/* Header */}
      <div className=&ldquo;bg-white border-b&rdquo;>
        <div className=&ldquo;max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6&rdquo;>
          <div className=&ldquo;flex flex-col space-y-4&rdquo;>
            <div className=&ldquo;flex items-center justify-between&rdquo;>
              <div>
                <h1 className=&ldquo;text-2xl font-bold text-gray-900&rdquo;>
                  Buscar Empleos
                </h1>
                <p className=&ldquo;text-gray-600&rdquo;>
                  Encuentra oportunidades laborales que se ajusten a tu perfil
                </p>
              </div>
              <div className=&ldquo;flex items-center space-x-2&rdquo;>
                <Button
                  variant={viewMode === &ldquo;grid&rdquo; ? &ldquo;default&rdquo; : &ldquo;outline&rdquo;}
                  size=&ldquo;sm&rdquo;
                  onClick={() => setViewMode(&ldquo;grid&rdquo;)}
                >
                  <Grid className=&ldquo;w-4 h-4&rdquo; />
                </Button>
                <Button
                  variant={viewMode === &ldquo;list&rdquo; ? &ldquo;default&rdquo; : &ldquo;outline&rdquo;}
                  size=&ldquo;sm&rdquo;
                  onClick={() => setViewMode(&ldquo;list&rdquo;)}
                >
                  <List className=&ldquo;w-4 h-4&rdquo; />
                </Button>
              </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className=&ldquo;flex space-x-2&rdquo;>
              <div className=&ldquo;flex-1 relative&rdquo;>
                <Search className=&ldquo;absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4&rdquo; />
                <Input
                  placeholder=&ldquo;Buscar por título, empresa, habilidades...&rdquo;
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className=&ldquo;pl-10 pr-4 py-2&rdquo;
                />
              </div>
              <Button type=&ldquo;submit&rdquo;>Buscar</Button>
              <Button
                variant=&ldquo;outline&rdquo;
                onClick={() => setShowFilters(!showFilters)}
                className=&ldquo;flex items-center space-x-2&rdquo;
              >
                <Filter className=&ldquo;w-4 h-4&rdquo; />
                <span>Filtros</span>
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className=&ldquo;max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6&rdquo;>
        <div className=&ldquo;flex gap-6&rdquo;>
          {/* Filters Sidebar */}
          {showFilters && (
            <div className=&ldquo;w-80 flex-shrink-0&rdquo;>
              <JobSearchFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={clearFilters}
              />
            </div>
          )}

          {/* Results */}
          <div className=&ldquo;flex-1&rdquo;>
            {/* Results Header */}
            <div className=&ldquo;flex items-center justify-between mb-6&rdquo;>
              <div className=&ldquo;flex items-center space-x-4&rdquo;>
                <h2 className=&ldquo;text-lg font-semibold text-gray-900&rdquo;>
                  {loading ? &ldquo;Buscando...&rdquo; : `${totalJobs} empleos encontrados`}
                </h2>
                {Object.keys(filters).length > 1 && (
                  <Button
                    variant=&ldquo;ghost&rdquo;
                    onClick={clearFilters}
                    className=&ldquo;text-sm&rdquo;
                  >
                    Limpiar filtros
                  </Button>
                )}
              </div>
              <div className=&ldquo;flex items-center space-x-2&rdquo;>
                <SortDesc className=&ldquo;w-4 h-4 text-gray-400&rdquo; />
                <span className=&ldquo;text-sm text-gray-600&rdquo;>
                  Más recientes primero
                </span>
              </div>
            </div>

            {/* Active Filters */}
            {(filters.contractType?.length ||
              filters.workModality?.length ||
              filters.experienceLevel?.length) && (
              <div className=&ldquo;flex flex-wrap gap-2 mb-4&rdquo;>
                {filters.contractType?.map((type) => (
                  <Badge key={type} variant=&ldquo;secondary&rdquo; className=&ldquo;text-xs&rdquo;>
                    {type === &ldquo;FULL_TIME&rdquo;
                      ? &ldquo;Tiempo completo&rdquo;
                      : type === &ldquo;PART_TIME&rdquo;
                        ? &ldquo;Medio tiempo&rdquo;
                        : type === &ldquo;INTERNSHIP&rdquo;
                          ? &ldquo;Prácticas-Pasantías&rdquo;
                          : type === &ldquo;VOLUNTEER&rdquo;
                            ? &ldquo;Voluntariado&rdquo;
                            : &ldquo;Freelance&rdquo;}
                  </Badge>
                ))}
                {filters.workModality?.map((modality) => (
                  <Badge key={modality} variant=&ldquo;secondary&rdquo; className=&ldquo;text-xs&rdquo;>
                    {modality === &ldquo;ON_SITE&rdquo;
                      ? &ldquo;Presencial&rdquo;
                      : modality === &ldquo;REMOTE&rdquo;
                        ? &ldquo;Remoto&rdquo;
                        : &ldquo;Híbrido&rdquo;}
                  </Badge>
                ))}
                {filters.experienceLevel?.map((level) => (
                  <Badge key={level} variant=&ldquo;secondary&rdquo; className=&ldquo;text-xs&rdquo;>
                    {level === &ldquo;NO_EXPERIENCE&rdquo;
                      ? &ldquo;Sin experiencia&rdquo;
                      : level === &ldquo;ENTRY_LEVEL&rdquo;
                        ? &ldquo;Principiante&rdquo;
                        : level === &ldquo;MID_LEVEL&rdquo;
                          ? &ldquo;Intermedio&rdquo;
                          : &ldquo;Senior&rdquo;}
                  </Badge>
                ))}
              </div>
            )}

            {/* Job Results */}
            {loading ? (
              <div
                className={
                  viewMode === &ldquo;grid&rdquo;
                    ? &ldquo;grid grid-cols-1 md:grid-cols-2 gap-6&rdquo;
                    : &ldquo;space-y-4&rdquo;
                }
              >
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className=&ldquo;h-6 w-3/4&rdquo; />
                      <Skeleton className=&ldquo;h-4 w-1/2&rdquo; />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className=&ldquo;h-20 w-full mb-4&rdquo; />
                      <div className=&ldquo;flex space-x-2&rdquo;>
                        <Skeleton className=&ldquo;h-6 w-16&rdquo; />
                        <Skeleton className=&ldquo;h-6 w-20&rdquo; />
                        <Skeleton className=&ldquo;h-6 w-14&rdquo; />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : jobs.length > 0 ? (
              <div
                className={
                  viewMode === &ldquo;grid&rdquo;
                    ? &ldquo;grid grid-cols-1 md:grid-cols-2 gap-6&rdquo;
                    : &ldquo;space-y-4&rdquo;
                }
              >
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className=&ldquo;flex flex-col items-center justify-center py-12 text-center&rdquo;>
                  <Search className=&ldquo;w-12 h-12 text-gray-400 mb-4&rdquo; />
                  <h3 className=&ldquo;text-lg font-semibold text-gray-900 mb-2&rdquo;>
                    No se encontraron empleos
                  </h3>
                  <p className=&ldquo;text-gray-600 mb-4&rdquo;>
                    Intenta ajustar tus filtros de búsqueda o buscar términos
                    diferentes.
                  </p>
                  <Button onClick={clearFilters} variant=&ldquo;outline&rdquo;>
                    Limpiar todos los filtros
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
