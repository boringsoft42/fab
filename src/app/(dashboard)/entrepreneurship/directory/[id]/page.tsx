"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Calendar,
  User,
  ArrowLeft,
} from "lucide-react";
import type { Institution } from "../page";

interface InstitutionPost {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
  author: string;
  category: string;
}

export default function InstitutionProfilePage() {
  const params = useParams();
  const [activeTab, setActiveTab] = useState("about");

  // Mock data - replace with API call
  const institution: Institution = {
    id: "1",
    name: "CEMSE Innovation Hub",
    description:
      "Incubadora especializada en tecnología y emprendimientos juveniles con enfoque en innovación social",
    type: "incubator",
    category: "Tecnología",
    logo: "/logos/cemse.svg",
    coverImage: "/images/institutions/cemse-cover.jpg",
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
    targetAudience: [],
    eligibilityRequirements: [],
    contactPerson: "Ing. Ana Rodriguez",
    socialMedia: {
      facebook: "https://facebook.com/cemsehub",
      linkedin: "https://linkedin.com/company/cemse-hub",
    },
    isActive: true,
    isVerified: true,
    lastUpdated: new Date(),
    createdAt: new Date("2023-01-15"),
  };

  const posts: InstitutionPost[] = [
    {
      id: "1",
      title: "Lanzamiento del Programa de Incubación 2024",
      content:
        "Nos complace anunciar el lanzamiento de nuestro programa de incubación para el año 2024. Este año, estamos buscando startups innovadoras en el sector tecnológico con impacto social...",
      image: "/images/institutions/posts/incubation-program.jpg",
      date: "2024-03-15",
      author: "Ana Rodriguez",
      category: "Programas",
    },
    {
      id: "2",
      title: "Caso de Éxito: TechSocial Bolivia",
      content:
        "TechSocial Bolivia, una startup graduada de nuestro programa de incubación, ha logrado impactar a más de 1,000 jóvenes a través de su plataforma de educación tecnológica...",
      image: "/images/institutions/posts/success-story.jpg",
      date: "2024-03-10",
      author: "Carlos Mendoza",
      category: "Casos de Éxito",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Banner */}
      <div className="relative h-[400px]">
        <Image
          src={institution.coverImage || "/images/institutions/default-cover.jpg"}
          alt={institution.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent">
          <div className="container mx-auto px-6 h-full flex flex-col justify-between py-8">
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="text-white" asChild>
                <Link href="/entrepreneurship/directory">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver al Directorio
                </Link>
              </Button>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative h-32 w-32 rounded-xl overflow-hidden bg-white">
                <Image
                  src={institution.logo || "/images/institutions/default-logo.jpg"}
                  alt={`${institution.name} logo`}
                  fill
                  className="object-contain p-4"
                />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {institution.name}
                </h1>
                <p className="text-xl text-white/90 max-w-2xl">
                  {institution.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-6 py-4">
            {institution.socialMedia?.facebook && (
              <a
                href={institution.socialMedia.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Facebook className="h-6 w-6" />
              </a>
            )}
            {institution.socialMedia?.instagram && (
              <a
                href={institution.socialMedia.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-pink-600 transition-colors"
              >
                <Instagram className="h-6 w-6" />
              </a>
            )}
            {institution.socialMedia?.linkedin && (
              <a
                href={institution.socialMedia.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-700 transition-colors"
              >
                <Linkedin className="h-6 w-6" />
              </a>
            )}
            {institution.socialMedia?.twitter && (
              <a
                href={institution.socialMedia.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-400 transition-colors"
              >
                <Twitter className="h-6 w-6" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Info */}
          <div className="lg:col-span-2">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-8"
            >
              <TabsList>
                <TabsTrigger value="about">Información</TabsTrigger>
                <TabsTrigger value="posts">Publicaciones</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">
                      Sobre nosotros
                    </h2>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {institution.description}
                    </p>

                    <h3 className="font-semibold mb-3">Servicios Ofrecidos</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600 mb-6">
                      {institution.servicesOffered.map((service, index) => (
                        <li key={index}>{service}</li>
                      ))}
                    </ul>

                    <h3 className="font-semibold mb-3">Áreas de Enfoque</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                      {institution.focusAreas.map((area, index) => (
                        <li key={index}>{area}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="posts" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {posts.map((post) => (
                    <Link
                      href={`/entrepreneurship/directory/${params.id}/posts/${post.id}`}
                      key={post.id}
                    >
                      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                        <div className="relative h-48">
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="p-6">
                          <h3 className="text-xl font-semibold mb-2">
                            {post.title}
                          </h3>
                          <p className="text-muted-foreground mb-4 line-clamp-2">
                            {post.content}
                          </p>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              {new Date(post.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              {post.author}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Información de Contacto</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span>{institution.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <a
                      href={`mailto:${institution.email}`}
                      className="hover:text-blue-600"
                    >
                      {institution.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <a
                      href={`tel:${institution.phone}`}
                      className="hover:text-blue-600"
                    >
                      {institution.phone}
                    </a>
                  </div>
                  {institution.website && (
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                      <a
                        href={institution.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600"
                      >
                        Visitar sitio web
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Persona de Contacto</h3>
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <span>{institution.contactPerson}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
