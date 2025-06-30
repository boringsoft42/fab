"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Building2,
  MapPin,
  Star,
  Filter,
  Globe,
  Phone,
  Mail,
  Users,
  Calendar,
  Award,
  Target,
  Heart,
  Briefcase,
} from "lucide-react";

interface Institution {
  id: string;
  name: string;
  logo: string;
  type:
    | "municipality"
    | "ngo"
    | "foundation"
    | "training_center"
    | "government";
  description: string;
  location: string;
  website: string;
  phone: string;
  email: string;
  services: string[];
  programs: string[];
  beneficiaries: number;
  founded: number;
  rating: number;
  reviewCount: number;
  verified: boolean;
  focus_areas: string[];
  contact_person: {
    name: string;
    position: string;
    phone: string;
    email: string;
  };
}

interface Program {
  id: string;
  title: string;
  description: string;
  institution: string;
  type: "grant" | "training" | "incubator" | "mentorship" | "funding";
  duration: string;
  deadline: Date;
  requirements: string[];
  benefits: string[];
  target_audience: string[];
}

export default function DirectoryPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("institutions");
  const [selectedType, setSelectedType] = useState("all");

  useEffect(() => {
    fetchDirectoryData();
  }, []);

  const fetchDirectoryData = async () => {
    try {
      setLoading(true);

      // Mock data for demonstration
      const mockInstitutions: Institution[] = [
        {
          id: "inst-1",
          name: "Alcaldía de Cochabamba",
          logo: "/api/placeholder/100/100",
          type: "municipality",
          description:
            "Gobierno municipal enfocado en promover el emprendimiento y desarrollo económico local a través de programas de capacitación y financiamiento.",
          location: "Cochabamba, Bolivia",
          website: "https://cochabamba.bo",
          phone: "+591 4 4258000",
          email: "emprendimiento@cochabamba.bo",
          services: [
            "Licencias Comerciales",
            "Capacitación Empresarial",
            "Microcréditos",
            "Asesoría Legal",
          ],
          programs: [
            "Jóvenes Emprendedores CBBA",
            "Mujeres Empresarias",
            "Startups Locales",
          ],
          beneficiaries: 2500,
          founded: 1994,
          rating: 4.2,
          reviewCount: 89,
          verified: true,
          focus_areas: [
            "Desarrollo Económico",
            "Emprendimiento Juvenil",
            "Microempresas",
          ],
          contact_person: {
            name: "María López",
            position: "Directora de Desarrollo Económico",
            phone: "+591 4 4258100",
            email: "mlopez@cochabamba.bo",
          },
        },
        {
          id: "inst-2",
          name: "Fundación Pro-Joven",
          logo: "/api/placeholder/100/100",
          type: "foundation",
          description:
            "Organización sin fines de lucro dedicada a empoderar a jóvenes bolivianos a través de programas de formación, mentorías y financiamiento para emprendimientos.",
          location: "La Paz, Bolivia",
          website: "https://projoven.org.bo",
          phone: "+591 2 2441200",
          email: "contacto@projoven.org.bo",
          services: [
            "Formación Empresarial",
            "Mentorías",
            "Financiamiento",
            "Networking",
          ],
          programs: [
            "Fondo Semilla",
            "Aceleradora de Startups",
            "Liderazgo Juvenil",
          ],
          beneficiaries: 1800,
          founded: 2010,
          rating: 4.7,
          reviewCount: 156,
          verified: true,
          focus_areas: [
            "Juventud",
            "Emprendimiento Social",
            "Innovación",
            "Tecnología",
          ],
          contact_person: {
            name: "Carlos Mendoza",
            position: "Coordinador de Programas",
            phone: "+591 2 2441250",
            email: "cmendoza@projoven.org.bo",
          },
        },
        {
          id: "inst-3",
          name: "Centro de Capacitación CEPYME",
          logo: "/api/placeholder/100/100",
          type: "training_center",
          description:
            "Centro especializado en capacitación empresarial y desarrollo de competencias para pequeñas y medianas empresas en Bolivia.",
          location: "Santa Cruz, Bolivia",
          website: "https://cepyme.org.bo",
          phone: "+591 3 3364500",
          email: "info@cepyme.org.bo",
          services: [
            "Cursos de Gestión",
            "Certificaciones",
            "Consultoría",
            "Diagnósticos Empresariales",
          ],
          programs: [
            "Gestión de Calidad",
            "Marketing Digital",
            "Finanzas Empresariales",
          ],
          beneficiaries: 3200,
          founded: 2005,
          rating: 4.5,
          reviewCount: 234,
          verified: true,
          focus_areas: [
            "Capacitación",
            "Gestión Empresarial",
            "Calidad",
            "Productividad",
          ],
          contact_person: {
            name: "Ana Gutiérrez",
            position: "Directora Académica",
            phone: "+591 3 3364550",
            email: "agutierrez@cepyme.org.bo",
          },
        },
        {
          id: "inst-4",
          name: "ONG Emprende Bolivia",
          logo: "/api/placeholder/100/100",
          type: "ngo",
          description:
            "Organización no gubernamental que trabaja en el fortalecimiento del ecosistema emprendedor boliviano a través de programas de incubación y aceleración.",
          location: "Oruro, Bolivia",
          website: "https://emprendebolivia.org",
          phone: "+591 2 5252000",
          email: "contacto@emprendebolivia.org",
          services: [
            "Incubación de Negocios",
            "Aceleración",
            "Investigación de Mercados",
            "Networking Internacional",
          ],
          programs: [
            "Incubadora Rural",
            "Mujeres Emprendedoras",
            "Tecnología e Innovación",
          ],
          beneficiaries: 950,
          founded: 2015,
          rating: 4.8,
          reviewCount: 67,
          verified: true,
          focus_areas: [
            "Emprendimiento Rural",
            "Género",
            "Innovación",
            "Sostenibilidad",
          ],
          contact_person: {
            name: "Roberto Silva",
            position: "Director Ejecutivo",
            phone: "+591 2 5252100",
            email: "rsilva@emprendebolivia.org",
          },
        },
      ];

      const mockPrograms: Program[] = [
        {
          id: "prog-1",
          title: "Fondo Municipal de Emprendimiento",
          description:
            "Programa de financiamiento para startups locales con capital semilla de hasta 50,000 Bs.",
          institution: "Alcaldía de Cochabamba",
          type: "funding",
          duration: "12 meses",
          deadline: new Date("2024-04-30"),
          requirements: [
            "Ser residente de Cochabamba",
            "Tener entre 18-35 años",
            "Plan de negocios completo",
            "Proyecto innovador",
          ],
          benefits: [
            "Capital semilla hasta 50,000 Bs",
            "Mentorías mensuales",
            "Capacitación gratuita",
            "Networking empresarial",
          ],
          target_audience: ["Jóvenes", "Emprendedores locales", "Startups"],
        },
        {
          id: "prog-2",
          title: "Programa de Incubación Social",
          description:
            "Incubadora para emprendimientos con impacto social y ambiental positivo.",
          institution: "ONG Emprende Bolivia",
          type: "incubator",
          duration: "6 meses",
          deadline: new Date("2024-03-25"),
          requirements: [
            "Emprendimiento con impacto social",
            "Equipo fundador completo",
            "Prototipo o MVP",
            "Sostenibilidad demostrada",
          ],
          benefits: [
            "Espacio de trabajo",
            "Mentorías especializadas",
            "Acceso a inversores",
            "Capacitación técnica",
          ],
          target_audience: [
            "Emprendedores sociales",
            "Startups de impacto",
            "Innovadores rurales",
          ],
        },
      ];

      setInstitutions(mockInstitutions);
      setPrograms(mockPrograms);
    } catch (error) {
      console.error("Error fetching directory data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "municipality":
        return "bg-blue-100 text-blue-800";
      case "ngo":
        return "bg-green-100 text-green-800";
      case "foundation":
        return "bg-purple-100 text-purple-800";
      case "training_center":
        return "bg-orange-100 text-orange-800";
      case "government":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "municipality":
        return "Municipalidad";
      case "ngo":
        return "ONG";
      case "foundation":
        return "Fundación";
      case "training_center":
        return "Centro de Capacitación";
      case "government":
        return "Gobierno";
      default:
        return type;
    }
  };

  const filteredInstitutions = institutions.filter((institution) => {
    const matchesSearch =
      institution.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      institution.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      institution.services.some((service) =>
        service.toLowerCase().includes(searchQuery.toLowerCase())
      ) ||
      institution.focus_areas.some((area) =>
        area.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesType =
      selectedType === "all" || institution.type === selectedType;

    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Directorio de Instituciones</h1>
        <p className="text-muted-foreground">
          Encuentra organizaciones, fundaciones y centros que apoyan el
          emprendimiento en Bolivia
        </p>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="institutions">Instituciones</TabsTrigger>
          <TabsTrigger value="programs">Programas Disponibles</TabsTrigger>
        </TabsList>

        {/* Institutions Tab */}
        <TabsContent value="institutions" className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar instituciones por nombre, servicios o áreas de enfoque..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border rounded-md px-3 py-2 bg-white"
              >
                <option value="all">Todos los tipos</option>
                <option value="municipality">Municipalidades</option>
                <option value="ngo">ONGs</option>
                <option value="foundation">Fundaciones</option>
                <option value="training_center">Centros de Capacitación</option>
                <option value="government">Gobierno</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredInstitutions.map((institution) => (
              <Card
                key={institution.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={institution.logo}
                          alt={institution.name}
                        />
                        <AvatarFallback className="text-lg">
                          {institution.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {institution.verified && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <Award className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">
                          {institution.name}
                        </h3>
                        <Badge className={getTypeColor(institution.type)}>
                          {getTypeLabel(institution.type)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3" />
                        {institution.location}
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{institution.rating}</span>
                        <span className="text-muted-foreground">
                          ({institution.reviewCount} reseñas)
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {institution.description}
                  </p>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Servicios
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {institution.services.slice(0, 3).map((service) => (
                          <Badge
                            key={service}
                            variant="outline"
                            className="text-xs"
                          >
                            {service}
                          </Badge>
                        ))}
                        {institution.services.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{institution.services.length - 3}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Áreas de Enfoque
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {institution.focus_areas.slice(0, 2).map((area) => (
                          <Badge
                            key={area}
                            variant="secondary"
                            className="text-xs"
                          >
                            {area}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      {institution.beneficiaries.toLocaleString()} beneficiarios
                    </div>
                    <div>Fundada: {institution.founded}</div>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Globe className="h-3 w-3 mr-1" />
                      Sitio Web
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Phone className="h-3 w-3 mr-1" />
                      Contactar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredInstitutions.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Building2 className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                No se encontraron instituciones
              </h3>
              <p className="text-muted-foreground">
                Intenta ajustar los filtros o términos de búsqueda
              </p>
            </div>
          )}
        </TabsContent>

        {/* Programs Tab */}
        <TabsContent value="programs" className="space-y-6">
          <div className="space-y-4">
            {programs.map((program) => (
              <Card key={program.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">
                          {program.title}
                        </h3>
                        <Badge
                          className={
                            program.type === "funding"
                              ? "bg-green-100 text-green-800"
                              : program.type === "training"
                                ? "bg-blue-100 text-blue-800"
                                : program.type === "incubator"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-orange-100 text-orange-800"
                          }
                        >
                          {program.type === "funding"
                            ? "Financiamiento"
                            : program.type === "training"
                              ? "Capacitación"
                              : program.type === "incubator"
                                ? "Incubadora"
                                : "Mentoría"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {program.institution}
                      </p>
                      <p className="text-muted-foreground mb-3">
                        {program.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium mb-1">Requisitos:</p>
                          <ul className="text-muted-foreground space-y-1">
                            {program.requirements
                              .slice(0, 2)
                              .map((req, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-1"
                                >
                                  <span className="text-xs mt-1">•</span>
                                  {req}
                                </li>
                              ))}
                          </ul>
                        </div>
                        <div>
                          <p className="font-medium mb-1">Beneficios:</p>
                          <ul className="text-muted-foreground space-y-1">
                            {program.benefits
                              .slice(0, 2)
                              .map((benefit, idx) => (
                                <li
                                  key={idx}
                                  className="flex items-start gap-1"
                                >
                                  <span className="text-xs mt-1">•</span>
                                  {benefit}
                                </li>
                              ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="text-right ml-4">
                      <div className="text-sm text-muted-foreground mb-1">
                        Cierra:
                      </div>
                      <div className="font-semibold mb-1">
                        {program.deadline.toLocaleDateString()}
                      </div>
                      <div className="text-xs text-muted-foreground mb-3">
                        Duración: {program.duration}
                      </div>
                      <Button size="sm">Aplicar</Button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {program.target_audience.map((audience) => (
                      <Badge
                        key={audience}
                        variant="outline"
                        className="text-xs"
                      >
                        {audience}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
