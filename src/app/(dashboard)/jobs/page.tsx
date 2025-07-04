"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, Grid, List, SortDesc } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { JobSearchFilters } from "@/components/jobs/job-search-filters";
import { JobCard } from "@/components/jobs/job-card";
import { JobOffer, JobSearchFilters as JobFilters } from "@/types/jobs";

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<JobFilters>({});

  const searchParams = useSearchParams();

  const fetchJobs = async (searchFilters: JobFilters) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();

      if (searchFilters.query) params.append("query", searchFilters.query);
      if (searchFilters.location) {
        searchFilters.location.forEach((loc) => params.append("location", loc));
      }
      if (searchFilters.contractType) {
        searchFilters.contractType.forEach((type) =>
          params.append("contractType", type)
        );
      }
      if (searchFilters.workModality) {
        searchFilters.workModality.forEach((modality) =>
          params.append("workModality", modality)
        );
      }
      if (searchFilters.experienceLevel) {
        searchFilters.experienceLevel.forEach((level) =>
          params.append("experienceLevel", level)
        );
      }
      if (searchFilters.salaryMin)
        params.append("salaryMin", searchFilters.salaryMin.toString());
      if (searchFilters.salaryMax)
        params.append("salaryMax", searchFilters.salaryMax.toString());
      if (searchFilters.publishedInDays)
        params.append(
          "publishedInDays",
          searchFilters.publishedInDays.toString()
        );
      if (searchFilters.sector) {
        searchFilters.sector.forEach((sector) =>
          params.append("sector", sector)
        );
      }

      const response = await fetch(`/api/jobs?${params.toString()}`);
      const data = await response.json();

      setJobs(data.jobs || []);
      setTotalJobs(data.total || 0);
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initialize search query from URL params
    const query = searchParams.get("q") || "";
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Buscar Empleos
                </h1>
                <p className="text-gray-600">
                  Encuentra oportunidades laborales que se ajusten a tu perfil
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex space-x-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por título, empresa, habilidades..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2"
                />
              </div>
              <Button type="submit">Buscar</Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filtros</span>
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <JobSearchFilters
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onClearFilters={clearFilters}
              />
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-gray-900">
                  {loading ? "Buscando..." : `${totalJobs} empleos encontrados`}
                </h2>
                {Object.keys(filters).length > 1 && (
                  <Button
                    variant="ghost"
                    onClick={clearFilters}
                    className="text-sm"
                  >
                    Limpiar filtros
                  </Button>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <SortDesc className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  Más recientes primero
                </span>
              </div>
            </div>

            {/* Active Filters */}
            {(filters.contractType?.length ||
              filters.workModality?.length ||
              filters.experienceLevel?.length) && (
              <div className="flex flex-wrap gap-2 mb-4">
                {filters.contractType?.map((type) => (
                  <Badge key={type} variant="secondary" className="text-xs">
                    {type === "FULL_TIME"
                      ? "Tiempo completo"
                      : type === "PART_TIME"
                        ? "Medio tiempo"
                        : type === "INTERNSHIP"
                          ? "Prácticas-Pasantías"
                          : type === "VOLUNTEER"
                            ? "Voluntariado"
                            : "Freelance"}
                  </Badge>
                ))}
                {filters.workModality?.map((modality) => (
                  <Badge key={modality} variant="secondary" className="text-xs">
                    {modality === "ON_SITE"
                      ? "Presencial"
                      : modality === "REMOTE"
                        ? "Remoto"
                        : "Híbrido"}
                  </Badge>
                ))}
                {filters.experienceLevel?.map((level) => (
                  <Badge key={level} variant="secondary" className="text-xs">
                    {level === "NO_EXPERIENCE"
                      ? "Sin experiencia"
                      : level === "ENTRY_LEVEL"
                        ? "Principiante"
                        : level === "MID_LEVEL"
                          ? "Intermedio"
                          : "Senior"}
                  </Badge>
                ))}
              </div>
            )}

            {/* Job Results */}
            {loading ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                    : "space-y-4"
                }
              >
                {[...Array(6)].map((_, i) => (
                  <Card key={i}>
                    <CardHeader>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-20 w-full mb-4" />
                      <div className="flex space-x-2">
                        <Skeleton className="h-6 w-16" />
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-6 w-14" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : jobs.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                    : "space-y-4"
                }
              >
                {jobs.map((job) => (
                  <JobCard key={job.id} job={job} viewMode={viewMode} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Search className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No se encontraron empleos
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Intenta ajustar tus filtros de búsqueda o buscar términos
                    diferentes.
                  </p>
                  <Button onClick={clearFilters} variant="outline">
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
