&ldquo;use client&rdquo;;

import { useState, useEffect } from &ldquo;react&rdquo;;
import Link from &ldquo;next/link&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card, CardContent, CardHeader, CardTitle } from &ldquo;@/components/ui/card&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { Input } from &ldquo;@/components/ui/input&rdquo;;
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from &ldquo;@/components/ui/select&rdquo;;
import { Tabs, TabsContent, TabsList, TabsTrigger } from &ldquo;@/components/ui/tabs&rdquo;;
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
} from &ldquo;lucide-react&rdquo;;
import Image from &ldquo;next/image&rdquo;;

export interface Institution {
  id: string;
  name: string;
  description: string;
  type:
    | &ldquo;incubator&rdquo;
    | &ldquo;accelerator&rdquo;
    | &ldquo;financial&rdquo;
    | &ldquo;government&rdquo;
    | &ldquo;ngo&rdquo;
    | &ldquo;mentor&rdquo;;
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
    type: &ldquo;grants&rdquo; | &ldquo;loans&rdquo; | &ldquo;equity&rdquo; | &ldquo;mentorship&rdquo;;
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

  // Status
  isActive: boolean;
  isVerified: boolean;
  lastUpdated: Date;
  createdAt: Date;

  // New fields
  coverImage?: string;
}

export default function InstitutionDirectoryPage() {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState<
    Institution[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(&ldquo;&rdquo;);
  const [selectedType, setSelectedType] = useState<string>(&ldquo;all&rdquo;);
  const [selectedMunicipality, setSelectedMunicipality] =
    useState<string>(&ldquo;all&rdquo;);
  const [selectedCategory, setSelectedCategory] = useState<string>(&ldquo;all&rdquo;);

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
          id: &ldquo;incubator-1&rdquo;,
          name: &ldquo;CEMSE Innovation Hub&rdquo;,
          description:
            &ldquo;Incubadora especializada en tecnología y emprendimientos juveniles con enfoque en innovación social&rdquo;,
          type: &ldquo;incubator&rdquo;,
          category: &ldquo;Tecnología&rdquo;,
          logo: &ldquo;/api/placeholder/100/100&rdquo;,
          website: &ldquo;https://cemse.edu.bo&rdquo;,
          email: &ldquo;incubadora@cemse.edu.bo&rdquo;,
          phone: &ldquo;+591 4 123-4567&rdquo;,
          address: &ldquo;Av. América E-0505&rdquo;,
          municipality: &ldquo;Cochabamba&rdquo;,
          department: &ldquo;Cochabamba&rdquo;,
          servicesOffered: [
            &ldquo;Incubación de startups&rdquo;,
            &ldquo;Mentoría especializada&rdquo;,
            &ldquo;Acceso a financiamiento&rdquo;,
            &ldquo;Capacitación técnica&rdquo;,
            &ldquo;Networking&rdquo;,
          ],
          focusAreas: [
            &ldquo;Tecnología&rdquo;,
            &ldquo;Innovación Social&rdquo;,
            &ldquo;Emprendimientos Juveniles&rdquo;,
          ],
          targetAudience: [
            &ldquo;Jóvenes de 18-29 años&rdquo;,
            &ldquo;Estudiantes universitarios&rdquo;,
            &ldquo;Emprendedores primerizos&rdquo;,
          ],
          eligibilityRequirements: [
            &ldquo;Edad entre 18-35 años&rdquo;,
            &ldquo;Idea de negocio validada&rdquo;,
            &ldquo;Compromiso de dedicación&rdquo;,
            &ldquo;Residencia en Cochabamba&rdquo;,
          ],
          applicationProcess:
            &ldquo;Aplicación online, pitch presentation, entrevista&rdquo;,
          contactPerson: &ldquo;Ing. Ana Rodriguez&rdquo;,
          socialMedia: {
            facebook: &ldquo;https://facebook.com/cemsehub&rdquo;,
            linkedin: &ldquo;https://linkedin.com/company/cemse-hub&rdquo;,
          },
          isActive: true,
          isVerified: true,
          lastUpdated: new Date(),
          createdAt: new Date(&ldquo;2023-01-15&rdquo;),
          coverImage: &ldquo;/images/institutions/cemse-cover.jpg&rdquo;,
        },
        {
          id: &ldquo;financial-1&rdquo;,
          name: &ldquo;Banco de Desarrollo Productivo (BDP)&rdquo;,
          description:
            &ldquo;Institución financiera estatal que otorga créditos para emprendimientos productivos y empresas&rdquo;,
          type: &ldquo;financial&rdquo;,
          category: &ldquo;Banca de Desarrollo&rdquo;,
          website: &ldquo;https://bdp.com.bo&rdquo;,
          email: &ldquo;emprendedores@bdp.com.bo&rdquo;,
          phone: &ldquo;+591 4 567-8901&rdquo;,
          address: &ldquo;Plaza 14 de Septiembre&rdquo;,
          municipality: &ldquo;Cochabamba&rdquo;,
          department: &ldquo;Cochabamba&rdquo;,
          servicesOffered: [
            &ldquo;Créditos para emprendimientos&rdquo;,
            &ldquo;Microcréditos&rdquo;,
            &ldquo;Capital de trabajo&rdquo;,
            &ldquo;Asesoría financiera&rdquo;,
            &ldquo;Capacitación empresarial&rdquo;,
          ],
          focusAreas: [&ldquo;Sector Productivo&rdquo;, &ldquo;PYMES&rdquo;, &ldquo;Microemprendimientos&rdquo;],
          targetAudience: [
            &ldquo;Emprendedores&rdquo;,
            &ldquo;Pequeños empresarios&rdquo;,
            &ldquo;Cooperativas&rdquo;,
          ],
          eligibilityRequirements: [
            &ldquo;Plan de negocios&rdquo;,
            &ldquo;Garantías requeridas&rdquo;,
            &ldquo;Capacidad de pago&rdquo;,
            &ldquo;Registro empresarial&rdquo;,
          ],
          funding: {
            type: &ldquo;loans&rdquo;,
            amount: &ldquo;Bs. 10.000 - 2.000.000&rdquo;,
            duration: &ldquo;1-5 años&rdquo;,
            requirements: [
              &ldquo;Plan de negocios&rdquo;,
              &ldquo;Garantías&rdquo;,
              &ldquo;Estados financieros&rdquo;,
            ],
          },
          contactPerson: &ldquo;Lic. Carlos Mendoza&rdquo;,
          rating: 4.2,
          reviewsCount: 78,
          isActive: true,
          isVerified: true,
          lastUpdated: new Date(),
          createdAt: new Date(&ldquo;2020-03-10&rdquo;),
          coverImage: &ldquo;/images/institutions/bdp-cover.jpg&rdquo;,
        },
        {
          id: &ldquo;government-1&rdquo;,
          name: &ldquo;Programa Municipal Jóvenes Emprendedores&rdquo;,
          description:
            &ldquo;Programa gubernamental municipal para fomentar el emprendimiento juvenil en Cochabamba&rdquo;,
          type: &ldquo;government&rdquo;,
          category: &ldquo;Programa Municipal&rdquo;,
          website: &ldquo;https://cochabamba.gob.bo/emprendedores&rdquo;,
          email: &ldquo;juventud@cochabamba.gob.bo&rdquo;,
          phone: &ldquo;+591 4 234-5678&rdquo;,
          address: &ldquo;Palacio Municipal, Plaza 14 de Septiembre&rdquo;,
          municipality: &ldquo;Cochabamba&rdquo;,
          department: &ldquo;Cochabamba&rdquo;,
          servicesOffered: [
            &ldquo;Subsidios para emprendimientos&rdquo;,
            &ldquo;Capacitación gratuita&rdquo;,
            &ldquo;Asesoría legal&rdquo;,
            &ldquo;Espacios de coworking&rdquo;,
            &ldquo;Ferias empresariales&rdquo;,
          ],
          focusAreas: [
            &ldquo;Emprendimiento Juvenil&rdquo;,
            &ldquo;Desarrollo Local&rdquo;,
            &ldquo;Innovación&rdquo;,
          ],
          targetAudience: [&ldquo;Jóvenes 18-30 años&rdquo;, &ldquo;Residentes de Cochabamba&rdquo;],
          eligibilityRequirements: [
            &ldquo;Edad 18-30 años&rdquo;,
            &ldquo;Residencia en Cochabamba&rdquo;,
            &ldquo;Idea de negocio innovadora&rdquo;,
            &ldquo;Carnet de identidad vigente&rdquo;,
          ],
          funding: {
            type: &ldquo;grants&rdquo;,
            amount: &ldquo;Bs. 5.000 - 50.000&rdquo;,
            duration: &ldquo;6-12 meses&rdquo;,
            requirements: [&ldquo;Postulación online&rdquo;, &ldquo;Plan básico&rdquo;, &ldquo;Entrevista&rdquo;],
          },
          contactPerson: &ldquo;Lic. María Vargas&rdquo;,
          rating: 4.5,
          reviewsCount: 156,
          successStories: 67,
          isActive: true,
          isVerified: true,
          lastUpdated: new Date(),
          createdAt: new Date(&ldquo;2021-05-20&rdquo;),
          coverImage: &ldquo;/images/institutions/programa-municipal-cover.jpg&rdquo;,
        },
        {
          id: &ldquo;ngo-1&rdquo;,
          name: &ldquo;Fundación Pro-Joven Bolivia&rdquo;,
          description:
            &ldquo;ONG dedicada al desarrollo de capacidades emprendedoras en jóvenes vulnerables&rdquo;,
          type: &ldquo;ngo&rdquo;,
          category: &ldquo;Desarrollo Social&rdquo;,
          website: &ldquo;https://projoven.org.bo&rdquo;,
          email: &ldquo;info@projoven.org.bo&rdquo;,
          phone: &ldquo;+591 4 345-6789&rdquo;,
          address: &ldquo;Av. Heroínas N-234&rdquo;,
          municipality: &ldquo;Cochabamba&rdquo;,
          department: &ldquo;Cochabamba&rdquo;,
          servicesOffered: [
            &ldquo;Formación emprendedora&rdquo;,
            &ldquo;Microcréditos solidarios&rdquo;,
            &ldquo;Mentoría social&rdquo;,
            &ldquo;Redes de apoyo&rdquo;,
            &ldquo;Seguimiento post-incubación&rdquo;,
          ],
          focusAreas: [
            &ldquo;Inclusión Social&rdquo;,
            &ldquo;Emprendimiento Social&rdquo;,
            &ldquo;Desarrollo Comunitario&rdquo;,
          ],
          targetAudience: [
            &ldquo;Jóvenes en situación vulnerable&rdquo;,
            &ldquo;Mujeres emprendedoras&rdquo;,
            &ldquo;Comunidades rurales&rdquo;,
          ],
          eligibilityRequirements: [
            &ldquo;Situación socioeconómica vulnerable&rdquo;,
            &ldquo;Motivación emprendedora&rdquo;,
            &ldquo;Participación en talleres&rdquo;,
            &ldquo;Compromiso social&rdquo;,
          ],
          funding: {
            type: &ldquo;grants&rdquo;,
            amount: &ldquo;Bs. 2.000 - 15.000&rdquo;,
            duration: &ldquo;3-9 meses&rdquo;,
            requirements: [
              &ldquo;Evaluación socioeconómica&rdquo;,
              &ldquo;Plan social&rdquo;,
              &ldquo;Compromiso comunitario&rdquo;,
            ],
          },
          contactPerson: &ldquo;Lic. Patricia Choque&rdquo;,
          socialMedia: {
            facebook: &ldquo;https://facebook.com/projoven&rdquo;,
            instagram: &ldquo;https://instagram.com/projoven&rdquo;,
          },
          rating: 4.7,
          reviewsCount: 234,
          successStories: 189,
          isActive: true,
          isVerified: true,
          lastUpdated: new Date(),
          createdAt: new Date(&ldquo;2018-08-12&rdquo;),
          coverImage:
            &ldquo;/images/institutions/fundacion-pro-joven-bolivia-cover.jpg&rdquo;,
        },
        {
          id: &ldquo;accelerator-1&rdquo;,
          name: &ldquo;Startup Cochabamba Accelerator&rdquo;,
          description:
            &ldquo;Aceleradora privada enfocada en startups tech con potencial de escalamiento internacional&rdquo;,
          type: &ldquo;accelerator&rdquo;,
          category: &ldquo;Tecnología&rdquo;,
          website: &ldquo;https://startupcochabamba.com&rdquo;,
          email: &ldquo;apply@startupcochabamba.com&rdquo;,
          phone: &ldquo;+591 4 456-7890&rdquo;,
          address: &ldquo;Zona Norte, Edificio TechHub&rdquo;,
          municipality: &ldquo;Cochabamba&rdquo;,
          department: &ldquo;Cochabamba&rdquo;,
          servicesOffered: [
            &ldquo;Programa de aceleración&rdquo;,
            &ldquo;Inversión semilla&rdquo;,
            &ldquo;Mentoría internacional&rdquo;,
            &ldquo;Demo Day&rdquo;,
            &ldquo;Acceso a inversionistas&rdquo;,
          ],
          focusAreas: [
            &ldquo;Tecnología&rdquo;,
            &ldquo;Escalamiento&rdquo;,
            &ldquo;Mercados Internacionales&rdquo;,
          ],
          targetAudience: [
            &ldquo;Startups tech&rdquo;,
            &ldquo;Equipos fundadores&rdquo;,
            &ldquo;Empresas en crecimiento&rdquo;,
          ],
          eligibilityRequirements: [
            &ldquo;Startup con tracción&rdquo;,
            &ldquo;Equipo comprometido&rdquo;,
            &ldquo;Producto mínimo viable&rdquo;,
            &ldquo;Potencial de escalamiento&rdquo;,
          ],
          funding: {
            type: &ldquo;equity&rdquo;,
            amount: &ldquo;$10.000 - $50.000 USD&rdquo;,
            duration: &ldquo;3-6 meses&rdquo;,
            requirements: [
              &ldquo;Aplicación detallada&rdquo;,
              &ldquo;Pitch deck&rdquo;,
              &ldquo;Demo funcional&rdquo;,
            ],
          },
          contactPerson: &ldquo;Ing. Roberto Silva&rdquo;,
          socialMedia: {
            linkedin: &ldquo;https://linkedin.com/company/startup-cbba&rdquo;,
            twitter: &ldquo;https://twitter.com/startupcbba&rdquo;,
          },
          rating: 4.6,
          reviewsCount: 89,
          successStories: 34,
          isActive: true,
          isVerified: true,
          lastUpdated: new Date(),
          createdAt: new Date(&ldquo;2022-02-28&rdquo;),
          coverImage:
            &ldquo;/images/institutions/startup-cochabamba-accelerator-cover.jpg&rdquo;,
        },
        {
          id: &ldquo;mentor-1&rdquo;,
          name: &ldquo;Red de Mentores Empresariales Cochabamba&rdquo;,
          description:
            &ldquo;Red de empresarios exitosos que brindan mentoría personalizada a emprendedores&rdquo;,
          type: &ldquo;mentor&rdquo;,
          category: &ldquo;Mentoría&rdquo;,
          website: &ldquo;https://mentores-cbba.com&rdquo;,
          email: &ldquo;mentoria@mentores-cbba.com&rdquo;,
          phone: &ldquo;+591 4 567-8912&rdquo;,
          address: &ldquo;Cámara de Comercio, Av. Ballivián&rdquo;,
          municipality: &ldquo;Cochabamba&rdquo;,
          department: &ldquo;Cochabamba&rdquo;,
          servicesOffered: [
            &ldquo;Mentoría one-on-one&rdquo;,
            &ldquo;Sesiones grupales&rdquo;,
            &ldquo;Networking events&rdquo;,
            &ldquo;Masterclasses&rdquo;,
            &ldquo;Seguimiento personalizado&rdquo;,
          ],
          focusAreas: [
            &ldquo;Gestión Empresarial&rdquo;,
            &ldquo;Ventas&rdquo;,
            &ldquo;Marketing&rdquo;,
            &ldquo;Finanzas&rdquo;,
          ],
          targetAudience: [
            &ldquo;Emprendedores establecidos&rdquo;,
            &ldquo;PYMES&rdquo;,
            &ldquo;Startups en crecimiento&rdquo;,
          ],
          eligibilityRequirements: [
            &ldquo;Empresa en funcionamiento&rdquo;,
            &ldquo;Compromiso con el proceso&rdquo;,
            &ldquo;Apertura al feedback&rdquo;,
            &ldquo;Metas claras&rdquo;,
          ],
          contactPerson: &ldquo;Lic. Fernando Rocha&rdquo;,
          socialMedia: {
            linkedin: &ldquo;https://linkedin.com/company/mentores-cbba&rdquo;,
            facebook: &ldquo;https://facebook.com/mentores.cbba&rdquo;,
          },
          rating: 4.9,
          reviewsCount: 123,
          successStories: 78,
          isActive: true,
          isVerified: true,
          lastUpdated: new Date(),
          createdAt: new Date(&ldquo;2019-11-05&rdquo;),
          coverImage:
            &ldquo;/images/institutions/red-de-mentores-empresariales-cochabamba-cover.jpg&rdquo;,
        },
      ];

      setInstitutions(mockInstitutions);
    } catch (error) {
      console.error(&ldquo;Error fetching institutions:&rdquo;, error);
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
    if (selectedType !== &ldquo;all&rdquo;) {
      filtered = filtered.filter(
        (institution) => institution.type === selectedType
      );
    }

    // Municipality filter
    if (selectedMunicipality !== &ldquo;all&rdquo;) {
      filtered = filtered.filter(
        (institution) => institution.municipality === selectedMunicipality
      );
    }

    // Category filter
    if (selectedCategory !== &ldquo;all&rdquo;) {
      filtered = filtered.filter(
        (institution) => institution.category === selectedCategory
      );
    }

    setFilteredInstitutions(filtered);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case &ldquo;incubator&rdquo;:
        return <Building2 className=&ldquo;h-5 w-5&rdquo; />;
      case &ldquo;accelerator&rdquo;:
        return <Target className=&ldquo;h-5 w-5&rdquo; />;
      case &ldquo;financial&rdquo;:
        return <Banknote className=&ldquo;h-5 w-5&rdquo; />;
      case &ldquo;government&rdquo;:
        return <Award className=&ldquo;h-5 w-5&rdquo; />;
      case &ldquo;ngo&rdquo;:
        return <Heart className=&ldquo;h-5 w-5&rdquo; />;
      case &ldquo;mentor&rdquo;:
        return <User className=&ldquo;h-5 w-5&rdquo; />;
      default:
        return <Building2 className=&ldquo;h-5 w-5&rdquo; />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case &ldquo;incubator&rdquo;:
        return &ldquo;bg-blue-100 text-blue-800&rdquo;;
      case &ldquo;accelerator&rdquo;:
        return &ldquo;bg-green-100 text-green-800&rdquo;;
      case &ldquo;financial&rdquo;:
        return &ldquo;bg-yellow-100 text-yellow-800&rdquo;;
      case &ldquo;government&rdquo;:
        return &ldquo;bg-purple-100 text-purple-800&rdquo;;
      case &ldquo;ngo&rdquo;:
        return &ldquo;bg-pink-100 text-pink-800&rdquo;;
      case &ldquo;mentor&rdquo;:
        return &ldquo;bg-orange-100 text-orange-800&rdquo;;
      default:
        return &ldquo;bg-gray-100 text-gray-800&rdquo;;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case &ldquo;incubator&rdquo;:
        return &ldquo;Incubadora&rdquo;;
      case &ldquo;accelerator&rdquo;:
        return &ldquo;Aceleradora&rdquo;;
      case &ldquo;financial&rdquo;:
        return &ldquo;Institución Financiera&rdquo;;
      case &ldquo;government&rdquo;:
        return &ldquo;Programa Gubernamental&rdquo;;
      case &ldquo;ngo&rdquo;:
        return &ldquo;ONG/Fundación&rdquo;;
      case &ldquo;mentor&rdquo;:
        return &ldquo;Red de Mentores&rdquo;;
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
      <div className=&ldquo;container mx-auto p-6&rdquo;>
        <div className=&ldquo;animate-pulse space-y-6&rdquo;>
          <div className=&ldquo;h-32 bg-gray-200 rounded-lg&rdquo; />
          <div className=&ldquo;grid grid-cols-1 md:grid-cols-4 gap-4&rdquo;>
            {[...Array(8)].map((_, i) => (
              <div key={i} className=&ldquo;h-4 bg-gray-200 rounded&rdquo; />
            ))}
          </div>
          <div className=&ldquo;space-y-4&rdquo;>
            {[...Array(6)].map((_, i) => (
              <div key={i} className=&ldquo;h-48 bg-gray-200 rounded&rdquo; />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className=&ldquo;container mx-auto p-6 space-y-8&rdquo;>
      {/* Header */}
      <div className=&ldquo;bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white&rdquo;>
        <div className=&ldquo;max-w-4xl&rdquo;>
          <h1 className=&ldquo;text-4xl font-bold mb-4&rdquo;>
            Directorio de Instituciones de Apoyo
          </h1>
          <p className=&ldquo;text-xl opacity-90 mb-6&rdquo;>
            Encuentra incubadoras, aceleradoras, instituciones financieras,
            programas gubernamentales y organizaciones que apoyan el
            emprendimiento en Cochabamba
          </p>
          <div className=&ldquo;grid grid-cols-2 md:grid-cols-4 gap-4 text-center&rdquo;>
            <div>
              <div className=&ldquo;text-2xl font-bold&rdquo;>
                {institutions.filter((i) => i.type === &ldquo;incubator&rdquo;).length}
              </div>
              <div className=&ldquo;text-sm opacity-80&rdquo;>Incubadoras</div>
            </div>
            <div>
              <div className=&ldquo;text-2xl font-bold&rdquo;>
                {institutions.filter((i) => i.type === &ldquo;financial&rdquo;).length}
              </div>
              <div className=&ldquo;text-sm opacity-80&rdquo;>Inst. Financieras</div>
            </div>
            <div>
              <div className=&ldquo;text-2xl font-bold&rdquo;>
                {institutions.filter((i) => i.type === &ldquo;government&rdquo;).length}
              </div>
              <div className=&ldquo;text-sm opacity-80&rdquo;>Prog. Gubernamentales</div>
            </div>
            <div>
              <div className=&ldquo;text-2xl font-bold&rdquo;>
                {institutions.filter((i) => i.type === &ldquo;ngo&rdquo;).length}
              </div>
              <div className=&ldquo;text-sm opacity-80&rdquo;>ONGs y Fundaciones</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className=&ldquo;flex items-center gap-2&rdquo;>
            <Filter className=&ldquo;h-5 w-5&rdquo; />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className=&ldquo;grid grid-cols-1 md:grid-cols-4 gap-4&rdquo;>
            <div className=&ldquo;relative&rdquo;>
              <Search className=&ldquo;absolute left-3 top-3 h-4 w-4 text-muted-foreground&rdquo; />
              <Input
                placeholder=&ldquo;Buscar instituciones...&rdquo;
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className=&ldquo;pl-10&rdquo;
              />
            </div>

            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder=&ldquo;Tipo de institución&rdquo; />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=&ldquo;all&rdquo;>Todos los tipos</SelectItem>
                <SelectItem value=&ldquo;incubator&rdquo;>Incubadoras</SelectItem>
                <SelectItem value=&ldquo;accelerator&rdquo;>Aceleradoras</SelectItem>
                <SelectItem value=&ldquo;financial&rdquo;>Inst. Financieras</SelectItem>
                <SelectItem value=&ldquo;government&rdquo;>
                  Prog. Gubernamentales
                </SelectItem>
                <SelectItem value=&ldquo;ngo&rdquo;>ONGs y Fundaciones</SelectItem>
                <SelectItem value=&ldquo;mentor&rdquo;>Redes de Mentores</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedMunicipality}
              onValueChange={setSelectedMunicipality}
            >
              <SelectTrigger>
                <SelectValue placeholder=&ldquo;Municipio&rdquo; />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=&ldquo;all&rdquo;>Todos los municipios</SelectItem>
                {getUniqueValues(&ldquo;municipality&rdquo;).map((municipality) => (
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
                <SelectValue placeholder=&ldquo;Categoría&rdquo; />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=&ldquo;all&rdquo;>Todas las categorías</SelectItem>
                {getUniqueValues(&ldquo;category&rdquo;).map((category) => (
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
      <div className=&ldquo;flex justify-between items-center&rdquo;>
        <h2 className=&ldquo;text-2xl font-bold&rdquo;>
          {filteredInstitutions.length} Instituciones Encontradas
        </h2>
        <Button asChild variant=&ldquo;outline&rdquo;>
          <Link href=&ldquo;/entrepreneurship&rdquo;>Volver a Emprendimiento</Link>
        </Button>
      </div>

      {/* Institution Cards Grid */}
      <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6&rdquo;>
        {filteredInstitutions.map((institution) => (
          <Link
            href={`/entrepreneurship/directory/${institution.id}`}
            key={institution.id}
          >
            <Card className=&ldquo;group h-full overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer&rdquo;>
              {/* Card Background Image */}
              <div className=&ldquo;relative h-48&rdquo;>
                <div className=&ldquo;absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent z-10&rdquo; />
                <Image
                  src={
                    institution.coverImage ||
                    &ldquo;/images/institutions/default-cover.jpg&rdquo;
                  }
                  alt={institution.name}
                  fill
                  className=&ldquo;object-cover group-hover:scale-105 transition-transform duration-300&rdquo;
                />
                <div className=&ldquo;absolute top-4 left-4 z-20&rdquo;>
                  <div className=&ldquo;bg-white rounded-lg p-2 shadow-md&rdquo;>
                    <Image
                      src={
                        institution.logo ||
                        &ldquo;/images/institutions/default-logo.jpg&rdquo;
                      }
                      alt={`${institution.name} logo`}
                      width={40}
                      height={40}
                      className=&ldquo;object-contain&rdquo;
                    />
                  </div>
                </div>
              </div>

              <CardContent className=&ldquo;p-4&rdquo;>
                {/* Institution Name and Description */}
                <h3 className=&ldquo;text-lg font-semibold mb-2&rdquo;>
                  {institution.name}
                </h3>
                <p className=&ldquo;text-muted-foreground text-sm mb-4 line-clamp-2&rdquo;>
                  {institution.description}
                </p>

                {/* Location */}
                <div className=&ldquo;flex items-center gap-2 text-sm text-muted-foreground&rdquo;>
                  <MapPin className=&ldquo;h-4 w-4&rdquo; />
                  <span>{institution.municipality}</span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* No Results */}
      {filteredInstitutions.length === 0 && (
        <div className=&ldquo;text-center py-12&rdquo;>
          <Building2 className=&ldquo;h-24 w-24 text-muted-foreground mx-auto mb-4&rdquo; />
          <h3 className=&ldquo;text-xl font-semibold mb-2&rdquo;>
            No se encontraron instituciones
          </h3>
          <p className=&ldquo;text-muted-foreground mb-4&rdquo;>
            Intenta ajustar tus filtros de búsqueda para encontrar más
            resultados.
          </p>
          <Button
            onClick={() => {
              setSearchQuery(&ldquo;&rdquo;);
              setSelectedType(&ldquo;all&rdquo;);
              setSelectedMunicipality(&ldquo;all&rdquo;);
              setSelectedCategory(&ldquo;all&rdquo;);
            }}
          >
            Limpiar Filtros
          </Button>
        </div>
      )}

      {/* Call to Action */}
      <Card className=&ldquo;bg-gradient-to-r from-purple-600 to-blue-600 text-white&rdquo;>
        <CardContent className=&ldquo;p-8 text-center&rdquo;>
          <h2 className=&ldquo;text-2xl font-bold mb-4&rdquo;>
            ¿Tu institución no está listada?
          </h2>
          <p className=&ldquo;text-lg mb-6 opacity-90&rdquo;>
            Ayúdanos a expandir nuestro directorio registrando tu institución
          </p>
          <Button
            size=&ldquo;lg&rdquo;
            className=&ldquo;bg-white text-purple-600 hover:bg-gray-100&rdquo;
          >
            <Building2 className=&ldquo;h-5 w-5 mr-2&rdquo; />
            Registrar Institución
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
