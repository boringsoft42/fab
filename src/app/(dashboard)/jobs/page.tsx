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
import { JobSearchFilters as JobFilters } from "@/types/jobs";
import { JobOffer } from "@/types/api";
import { useJobOfferSearch } from "@/hooks/useJobOfferApi";

export default function JobsPage() {
  const { search, loading, error } = useJobOfferSearch();
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<JobFilters>({});

  const searchParams = useSearchParams();

  // Initialize search query from URL params
  useEffect(() => {
    const query = searchParams.get("q") || "";
    setSearchQuery(query);
    // Only set filters if there's actually a query
    if (query) {
      setFilters((prev) => ({ ...prev, query }));
    }
  }, [searchParams]);

  // Trigger initial search when component mounts
  useEffect(() => {
    const performInitialSearch = async () => {
      try {
        console.log("🔍 JobsPage - Performing initial search");
        const results = await search({});
        console.log("🔍 JobsPage - Initial search results:", results);
        
        if (Array.isArray(results)) {
          setJobs(results);
          setTotalJobs(results.length);
          
          if (results.length > 0 && results[0].id === "1") {
            console.log("🔧 JobsPage - Using mock data (API not available)");
          }
        }
      } catch (error) {
        console.error("🔍 JobsPage - Initial search error:", error);
      }
    };

    performInitialSearch();
  }, [search]);

  // Debounced search effect - only trigger on filter changes, not on searchQuery changes
  useEffect(() => {
    // Don't trigger search if only searchQuery changed (without being submitted)
    const hasRealFilters = filters.location || filters.contractType || filters.workModality || filters.experienceLevel || filters.salaryMin || filters.salaryMax;
    const hasSubmittedQuery = filters.query;
    
    if (!hasRealFilters && !hasSubmittedQuery) {
      return; // Don't search if no real filters are applied
    }
    
    const timeoutId = setTimeout(() => {
      const performSearch = async () => {
        try {
          console.log("🔍 JobsPage - Performing search with filters:", filters);
          
          const searchFilters = {
            query: filters.query,
            location: filters.location,
            contractType: filters.contractType,
            workModality: filters.workModality,
            experienceLevel: filters.experienceLevel,
            salaryMin: filters.salaryMin,
            salaryMax: filters.salaryMax,
          };
          
          // Remove undefined values
          const cleanFilters = Object.fromEntries(
            Object.entries(searchFilters).filter(([_, value]) => 
              value !== undefined && 
              (Array.isArray(value) ? value.length > 0 : true)
            )
          );
          
          console.log("🔍 JobsPage - Clean filters:", cleanFilters);
          
          const results = await search(cleanFilters);
          console.log("🔍 JobsPage - Search results:", results);
          
          if (Array.isArray(results)) {
            setJobs(results);
            setTotalJobs(results.length);
            
            // Show notification if using mock data (when API is not available)
            if (results.length > 0 && results[0].id === "1") {
              console.log("🔧 JobsPage - Using mock data (API not available)");
            }
          } else {
            setJobs([]);
            setTotalJobs(0);
          }
        } catch (error) {
          console.error("🔍 JobsPage - Search error:", error);
          setJobs([]);
          setTotalJobs(0);
        }
      };

      performSearch();
    }, 300); // Reduced delay to 300ms

    return () => clearTimeout(timeoutId);
  }, [filters, search]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setFilters((prev) => ({ ...prev, query: searchQuery.trim() }));
    } else {
      // If search query is empty, remove it from filters
      setFilters((prev) => {
        const newFilters = { ...prev };
        delete newFilters.query;
        return newFilters;
      });
    }
  };

  const handleFiltersChange = (newFilters: JobFilters) => {
    setFilters(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery("");
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
                {/* Mock data indicator */}
                {jobs.length > 0 && jobs[0]?.id === "1" && (
                  <Badge variant="outline" className="text-xs text-orange-600 border-orange-300">
                    Datos de ejemplo
                  </Badge>
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
            ) : jobs && jobs.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 gap-6"
                    : "space-y-4"
                }
              >
                {jobs?.map((job) => (
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
