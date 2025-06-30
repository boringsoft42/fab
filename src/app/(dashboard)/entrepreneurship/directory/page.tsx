"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Building2,
  Banknote,
  Users,
  Heart,
  User,
  Search,
  MapPin,
  Phone,
  Mail,
  Globe,
  Filter,
  Star,
  ExternalLink,
  DollarSign,
  Target,
  CheckCircle,
  Award,
} from "lucide-react";

export interface Institution {
  id: string;
  name: string;
  description: string;
  type:
    | "incubator"
    | "accelerator"
    | "financial"
    | "government"
    | "ngo"
    | "mentor";
  category: string;
  logo?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  municipality: string;
  department: string;

  // Specific details
  servicesOffered: string[];
  focusAreas: string[];
  targetAudience: string[];
  eligibilityRequirements: string[];
  applicationProcess?: string;
  funding?: {
    type: "grants" | "loans" | "equity" | "mentorship";
    amount?: string;
    duration?: string;
    requirements?: string[];
  };

  // Contact and social
  contactPerson?: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };

  // Metrics
  rating?: number;
  reviewsCount: number;
  successStories?: number;

  // Status
  isActive: boolean;
  isVerified: boolean;
  lastUpdated: Date;
  createdAt: Date;
}

export default function InstitutionDirectoryPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState<
    Institution[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedMunicipality, setSelectedMunicipality] =
    useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    fetchInstitutions();
  }, []);

  useEffect(() => {
    filterInstitutions();
  }, [
    institutions,
    searchQuery,
    selectedType,
    selectedMunicipality,
    selectedCategory,
  ]);

  const fetchInstitutions = async () => {
    try {
      setLoading(true);

      // Mock data for demonstration - replace with actual API call
      const mockInstitutions: Institution[] = [
        {
          id: "incubator-1",
          name: "CEMSE Innovation Hub",
          description:
            "Incubadora especializada en tecnología y emprendimientos juveniles con enfoque en innovación social",
          type: "incubator",
          category: "Tecnología",
          logo: "/api/placeholder/100/100",
          website: "https://cemse.edu.bo",
          email: "incubadora@cemse.edu.bo",
          phone: "+591 4 123-4567",
          address: "Av. América E-0505",
          municipality: "Cochabamba",
          department: "Cochabamba",
          servicesOffered: [
            "Incubación de startups",
            "Mentoría especializada",
            "Acceso a financiamiento",
            "Capacitación técnica",
            "Networking",
          ],
          focusAreas: [
            "Tecnología",
            "Innovación Social",
            "Emprendimientos Juveniles",
          ],
          targetAudience: [
            "Jóvenes de 18-29 años",
            "Estudiantes universitarios",
            "Emprendedores primerizos",
          ],
          eligibilityRequirements: [
            "Edad entre 18-35 años",
            "Idea de negocio validada",
            "Compromiso de dedicación",
            "Residencia en Cochabamba",
          ],
          applicationProcess:
            "Aplicación online, pitch presentation, entrevista",
          contactPerson: "Ing. Ana Rodriguez",
          socialMedia: {
            facebook: "https://facebook.com/cemsehub",
            linkedin: "https://linkedin.com/company/cemse-hub",
          },
          rating: 4.8,
          reviewsCount: 45,
          successStories: 23,
          isActive: true,
          isVerified: true,
          lastUpdated: new Date(),
          createdAt: new Date("2023-01-15"),
        },
        {
          id: "financial-1",
          name: "Banco de Desarrollo Productivo (BDP)",
          description:
            "Institución financiera estatal que otorga créditos para emprendimientos productivos y empresas",
          type: "financial",
          category: "Banca de Desarrollo",
          website: "https://bdp.com.bo",
          email: "emprendedores@bdp.com.bo",
          phone: "+591 4 567-8901",
          address: "Plaza 14 de Septiembre",
          municipality: "Cochabamba",
          department: "Cochabamba",
          servicesOffered: [
            "Créditos para emprendimientos",
            "Microcréditos",
            "Capital de trabajo",
            "Asesoría financiera",
            "Capacitación empresarial",
          ],
          focusAreas: ["Sector Productivo", "PYMES", "Microemprendimientos"],
          targetAudience: [
            "Emprendedores",
            "Pequeños empresarios",
            "Cooperativas",
          ],
          eligibilityRequirements: [
            "Plan de negocios",
            "Garantías requeridas",
            "Capacidad de pago",
            "Registro empresarial",
          ],
          funding: {
            type: "loans",
            amount: "Bs. 10.000 - 2.000.000",
            duration: "1-5 años",
            requirements: [
              "Plan de negocios",
              "Garantías",
              "Estados financieros",
            ],
          },
          contactPerson: "Lic. Carlos Mendoza",
          rating: 4.2,
          reviewsCount: 78,
          isActive: true,
          isVerified: true,
          lastUpdated: new Date(),
          createdAt: new Date("2020-03-10"),
        },
        {
          id: "government-1",
          name: "Programa Municipal Jóvenes Emprendedores",
          description:
            "Programa gubernamental municipal para fomentar el emprendimiento juvenil en Cochabamba",
          type: "government",
          category: "Programa Municipal",
          website: "https://cochabamba.gob.bo/emprendedores",
          email: "juventud@cochabamba.gob.bo",
          phone: "+591 4 234-5678",
          address: "Palacio Municipal, Plaza 14 de Septiembre",
          municipality: "Cochabamba",
          department: "Cochabamba",
          servicesOffered: [
            "Subsidios para emprendimientos",
            "Capacitación gratuita",
            "Asesoría legal",
            "Espacios de coworking",
            "Ferias empresariales",
          ],
          focusAreas: [
            "Emprendimiento Juvenil",
            "Desarrollo Local",
            "Innovación",
          ],
          targetAudience: ["Jóvenes 18-30 años", "Residentes de Cochabamba"],
          eligibilityRequirements: [
            "Edad 18-30 años",
            "Residencia en Cochabamba",
            "Idea de negocio innovadora",
            "Carnet de identidad vigente",
          ],
          funding: {
            type: "grants",
            amount: "Bs. 5.000 - 50.000",
            duration: "6-12 meses",
            requirements: ["Postulación online", "Plan básico", "Entrevista"],
          },
          contactPerson: "Lic. María Vargas",
          rating: 4.5,
          reviewsCount: 156,
          successStories: 67,
          isActive: true,
          isVerified: true,
          lastUpdated: new Date(),
          createdAt: new Date("2021-05-20"),
        },
        {
          id: "ngo-1",
          name: "Fundación Pro-Joven Bolivia",
          description:
            "ONG dedicada al desarrollo de capacidades emprendedoras en jóvenes vulnerables",
          type: "ngo",
          category: "Desarrollo Social",
          website: "https://projoven.org.bo",
          email: "info@projoven.org.bo",
          phone: "+591 4 345-6789",
          address: "Av. Heroínas N-234",
          municipality: "Cochabamba",
          department: "Cochabamba",
          servicesOffered: [
            "Formación emprendedora",
            "Microcréditos solidarios",
            "Mentoría social",
            "Redes de apoyo",
            "Seguimiento post-incubación",
          ],
          focusAreas: [
            "Inclusión Social",
            "Emprendimiento Social",
            "Desarrollo Comunitario",
          ],
          targetAudience: [
            "Jóvenes en situación vulnerable",
            "Mujeres emprendedoras",
            "Comunidades rurales",
          ],
          eligibilityRequirements: [
            "Situación socioeconómica vulnerable",
            "Motivación emprendedora",
            "Participación en talleres",
            "Compromiso social",
          ],
          funding: {
            type: "grants",
            amount: "Bs. 2.000 - 15.000",
            duration: "3-9 meses",
            requirements: [
              "Evaluación socioeconómica",
              "Plan social",
              "Compromiso comunitario",
            ],
          },
          contactPerson: "Lic. Patricia Choque",
          socialMedia: {
            facebook: "https://facebook.com/projoven",
            instagram: "https://instagram.com/projoven",
          },
          rating: 4.7,
          reviewsCount: 234,
          successStories: 189,
          isActive: true,
          isVerified: true,
          lastUpdated: new Date(),
          createdAt: new Date("2018-08-12"),
        },
        {
          id: "accelerator-1",
          name: "Startup Cochabamba Accelerator",
          description:
            "Aceleradora privada enfocada en startups tech con potencial de escalamiento internacional",
          type: "accelerator",
          category: "Tecnología",
          website: "https://startupcochabamba.com",
          email: "apply@startupcochabamba.com",
          phone: "+591 4 456-7890",
          address: "Zona Norte, Edificio TechHub",
          municipality: "Cochabamba",
          department: "Cochabamba",
          servicesOffered: [
            "Programa de aceleración",
            "Inversión semilla",
            "Mentoría internacional",
            "Demo Day",
            "Acceso a inversionistas",
          ],
          focusAreas: [
            "Tecnología",
            "Escalamiento",
            "Mercados Internacionales",
          ],
          targetAudience: [
            "Startups tech",
            "Equipos fundadores",
            "Empresas en crecimiento",
          ],
          eligibilityRequirements: [
            "Startup con tracción",
            "Equipo comprometido",
            "Producto mínimo viable",
            "Potencial de escalamiento",
          ],
          funding: {
            type: "equity",
            amount: "$10.000 - $50.000 USD",
            duration: "3-6 meses",
            requirements: [
              "Aplicación detallada",
              "Pitch deck",
              "Demo funcional",
            ],
          },
          contactPerson: "Ing. Roberto Silva",
          socialMedia: {
            linkedin: "https://linkedin.com/company/startup-cbba",
            twitter: "https://twitter.com/startupcbba",
          },
          rating: 4.6,
          reviewsCount: 89,
          successStories: 34,
          isActive: true,
          isVerified: true,
          lastUpdated: new Date(),
          createdAt: new Date("2022-02-28"),
        },
        {
          id: "mentor-1",
          name: "Red de Mentores Empresariales Cochabamba",
          description:
            "Red de empresarios exitosos que brindan mentoría personalizada a emprendedores",
          type: "mentor",
          category: "Mentoría",
          website: "https://mentores-cbba.com",
          email: "mentoria@mentores-cbba.com",
          phone: "+591 4 567-8912",
          address: "Cámara de Comercio, Av. Ballivián",
          municipality: "Cochabamba",
          department: "Cochabamba",
          servicesOffered: [
            "Mentoría one-on-one",
            "Sesiones grupales",
            "Networking events",
            "Masterclasses",
            "Seguimiento personalizado",
          ],
          focusAreas: [
            "Gestión Empresarial",
            "Ventas",
            "Marketing",
            "Finanzas",
          ],
          targetAudience: [
            "Emprendedores establecidos",
            "PYMES",
            "Startups en crecimiento",
          ],
          eligibilityRequirements: [
            "Empresa en funcionamiento",
            "Compromiso con el proceso",
            "Apertura al feedback",
            "Metas claras",
          ],
          contactPerson: "Lic. Fernando Rocha",
          socialMedia: {
            linkedin: "https://linkedin.com/company/mentores-cbba",
            facebook: "https://facebook.com/mentores.cbba",
          },
          rating: 4.9,
          reviewsCount: 123,
          successStories: 78,
          isActive: true,
          isVerified: true,
          lastUpdated: new Date(),
          createdAt: new Date("2019-11-05"),
        },
      ];

      setInstitutions(mockInstitutions);
    } catch (error) {
      console.error("Error fetching institutions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterInstitutions = () => {
    let filtered = [...institutions];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (institution) =>
          institution.name.toLowerCase().includes(query) ||
          institution.description.toLowerCase().includes(query) ||
          institution.category.toLowerCase().includes(query) ||
          institution.focusAreas.some((area) =>
            area.toLowerCase().includes(query)
          ) ||
          institution.servicesOffered.some((service) =>
            service.toLowerCase().includes(query)
          )
      );
    }

    // Type filter
    if (selectedType !== "all") {
      filtered = filtered.filter(
        (institution) => institution.type === selectedType
      );
    }

    // Municipality filter
    if (selectedMunicipality !== "all") {
      filtered = filtered.filter(
        (institution) => institution.municipality === selectedMunicipality
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (institution) => institution.category === selectedCategory
      );
    }

    setFilteredInstitutions(filtered);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "incubator":
        return <Building2 className="h-5 w-5" />;
      case "accelerator":
        return <Target className="h-5 w-5" />;
      case "financial":
        return <Banknote className="h-5 w-5" />;
      case "government":
        return <Award className="h-5 w-5" />;
      case "ngo":
        return <Heart className="h-5 w-5" />;
      case "mentor":
        return <User className="h-5 w-5" />;
      default:
        return <Building2 className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "incubator":
        return "bg-blue-100 text-blue-800";
      case "accelerator":
        return "bg-green-100 text-green-800";
      case "financial":
        return "bg-yellow-100 text-yellow-800";
      case "government":
        return "bg-purple-100 text-purple-800";
      case "ngo":
        return "bg-pink-100 text-pink-800";
      case "mentor":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "incubator":
        return "Incubadora";
      case "accelerator":
        return "Aceleradora";
      case "financial":
        return "Institución Financiera";
      case "government":
        return "Programa Gubernamental";
      case "ngo":
        return "ONG/Fundación";
      case "mentor":
        return "Red de Mentores";
      default:
        return type;
    }
  };

  const getUniqueValues = (key: keyof Institution) => {
    return [
      ...new Set(institutions.map((institution) => institution[key] as string)),
    ].filter(Boolean);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded" />
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
        <div className="max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">
            Directorio de Instituciones de Apoyo
          </h1>
          <p className="text-xl opacity-90 mb-6">
            Encuentra incubadoras, aceleradoras, instituciones financieras,
            programas gubernamentales y organizaciones que apoyan el
            emprendimiento en Cochabamba
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">
                {institutions.filter((i) => i.type === "incubator").length}
              </div>
              <div className="text-sm opacity-80">Incubadoras</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {institutions.filter((i) => i.type === "financial").length}
              </div>
              <div className="text-sm opacity-80">Inst. Financieras</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {institutions.filter((i) => i.type === "government").length}
              </div>
              <div className="text-sm opacity-80">Prog. Gubernamentales</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {institutions.filter((i) => i.type === "ngo").length}
              </div>
              <div className="text-sm opacity-80">ONGs y Fundaciones</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar instituciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de institución" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="incubator">Incubadoras</SelectItem>
                <SelectItem value="accelerator">Aceleradoras</SelectItem>
                <SelectItem value="financial">Inst. Financieras</SelectItem>
                <SelectItem value="government">
                  Prog. Gubernamentales
                </SelectItem>
                <SelectItem value="ngo">ONGs y Fundaciones</SelectItem>
                <SelectItem value="mentor">Redes de Mentores</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedMunicipality}
              onValueChange={setSelectedMunicipality}
            >
              <SelectTrigger>
                <SelectValue placeholder="Municipio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los municipios</SelectItem>
                {getUniqueValues("municipality").map((municipality) => (
                  <SelectItem key={municipality} value={municipality}>
                    {municipality}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger>
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {getUniqueValues("category").map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {filteredInstitutions.length} Instituciones Encontradas
        </h2>
        <Button asChild variant="outline">
          <Link href="/entrepreneurship">Volver a Emprendimiento</Link>
        </Button>
      </div>

      {/* Institution Cards */}
      <div className="space-y-6">
        {filteredInstitutions.map((institution) => (
          <Card
            key={institution.id}
            className="hover:shadow-lg transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Left Side - Main Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                          {getTypeIcon(institution.type)}
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">
                            {institution.name}
                          </h3>
                          <div className="flex items-center gap-2">
                            <Badge className={getTypeColor(institution.type)}>
                              {getTypeLabel(institution.type)}
                            </Badge>
                            <Badge variant="outline">
                              {institution.category}
                            </Badge>
                            {institution.isVerified && (
                              <Badge
                                variant="secondary"
                                className="text-green-700 bg-green-100"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verificado
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        {institution.description}
                      </p>

                      {/* Location and Contact */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span>
                              {institution.municipality},{" "}
                              {institution.department}
                            </span>
                          </div>
                          {institution.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4 text-muted-foreground" />
                              <span>{institution.phone}</span>
                            </div>
                          )}
                        </div>
                        <div className="space-y-2">
                          {institution.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="truncate">
                                {institution.email}
                              </span>
                            </div>
                          )}
                          {institution.website && (
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-muted-foreground" />
                              <a
                                href={institution.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline flex items-center gap-1"
                              >
                                Sitio Web
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Services Offered */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Servicios Ofrecidos:</h4>
                        <div className="flex flex-wrap gap-2">
                          {institution.servicesOffered.map((service, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-xs"
                            >
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Focus Areas */}
                      <div className="space-y-2">
                        <h4 className="font-medium">Áreas de Enfoque:</h4>
                        <div className="flex flex-wrap gap-2">
                          {institution.focusAreas.map((area, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {area}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Additional Info */}
                <div className="lg:w-80 space-y-4">
                  {/* Contact Person */}
                  {institution.contactPerson && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Persona de Contacto</h4>
                      <p className="text-sm">{institution.contactPerson}</p>
                    </div>
                  )}

                  {/* Funding Information */}
                  {institution.funding && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Financiamiento
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Tipo: </span>
                          {institution.funding.type === "grants"
                            ? "Subsidios"
                            : institution.funding.type === "loans"
                              ? "Préstamos"
                              : institution.funding.type === "equity"
                                ? "Inversión de Capital"
                                : "Mentoría"}
                        </div>
                        {institution.funding.amount && (
                          <div>
                            <span className="font-medium">Monto: </span>
                            {institution.funding.amount}
                          </div>
                        )}
                        {institution.funding.duration && (
                          <div>
                            <span className="font-medium">Duración: </span>
                            {institution.funding.duration}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Estadísticas</h4>
                    <div className="space-y-2 text-sm">
                      {institution.rating && (
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>{institution.rating}/5</span>
                          <span className="text-muted-foreground">
                            ({institution.reviewsCount} reseñas)
                          </span>
                        </div>
                      )}
                      {institution.successStories && (
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-green-600" />
                          <span>
                            {institution.successStories} historias de éxito
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Button className="w-full">
                      <Mail className="h-4 w-4 mr-2" />
                      Contactar
                    </Button>
                    {institution.website && (
                      <Button variant="outline" className="w-full" asChild>
                        <a
                          href={institution.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Globe className="h-4 w-4 mr-2" />
                          Visitar Sitio Web
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Expandable Details */}
              <div className="mt-6 pt-6 border-t">
                <Tabs defaultValue="requirements" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="requirements">Requisitos</TabsTrigger>
                    <TabsTrigger value="target">Público Objetivo</TabsTrigger>
                    <TabsTrigger value="process">Proceso</TabsTrigger>
                  </TabsList>

                  <TabsContent value="requirements" className="mt-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">
                        Requisitos de Elegibilidad:
                      </h4>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {institution.eligibilityRequirements.map(
                          (req, index) => (
                            <li key={index}>{req}</li>
                          )
                        )}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="target" className="mt-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Público Objetivo:</h4>
                      <div className="flex flex-wrap gap-2">
                        {institution.targetAudience.map((audience, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {audience}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="process" className="mt-4">
                    {institution.applicationProcess && (
                      <div className="space-y-2">
                        <h4 className="font-medium">Proceso de Aplicación:</h4>
                        <p className="text-sm text-muted-foreground">
                          {institution.applicationProcess}
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredInstitutions.length === 0 && (
        <div className="text-center py-12">
          <Building2 className="h-24 w-24 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            No se encontraron instituciones
          </h3>
          <p className="text-muted-foreground mb-4">
            Intenta ajustar tus filtros de búsqueda para encontrar más
            resultados.
          </p>
          <Button
            onClick={() => {
              setSearchQuery("");
              setSelectedType("all");
              setSelectedMunicipality("all");
              setSelectedCategory("all");
            }}
          >
            Limpiar Filtros
          </Button>
        </div>
      )}

      {/* Call to Action */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardContent className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">
            ¿Tu institución no está listada?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Ayúdanos a expandir nuestro directorio registrando tu institución
          </p>
          <Button
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100"
          >
            <Building2 className="h-5 w-5 mr-2" />
            Registrar Institución
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
