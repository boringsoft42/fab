"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  MapPin,
  Globe,
  Mail,
  Phone,
  Calendar,
  User,
} from "lucide-react";

interface InstitutionPost {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
  author: string;
  category: string;
}

interface Institution {
  id: string;
  name: string;
  description: string;
  longDescription: string;
  location: string;
  logo: string;
  coverImage: string;
  website: string;
  email: string;
  phone: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  posts: InstitutionPost[];
}

// TODO: Integrar hook real para institución (useInstitution) cuando esté disponible
// Reemplazar mockInstitution por datos reales de la API
const mockInstitution: Institution = {
  id: "1",
  name: "TechCorp Academy",
  description: "Centro de formación tecnológica líder en Bolivia",
  longDescription:
    "TechCorp Academy es un centro de formación tecnológica comprometido con el desarrollo de talento digital en Bolivia. Ofrecemos programas de formación en desarrollo de software, diseño UX/UI, data science y más.",
  location: "La Paz, Bolivia",
  logo: "/logos/techcorp.svg",
  coverImage: "/images/institutions/techcorp-cover.jpg",
  website: "https://techcorp.edu.bo",
  email: "contacto@techcorp.edu.bo",
  phone: "+591 2 1234567",
  socialMedia: {
    facebook: "https://facebook.com/techcorp",
    instagram: "https://instagram.com/techcorp",
    linkedin: "https://linkedin.com/company/techcorp",
  },
  posts: [
    {
      id: "1",
      title: "Nuevo programa de becas para jóvenes desarrolladores",
      content: "Nos complace anunciar nuestro nuevo programa de becas...",
      image: "/images/institutions/post-1.jpg",
      date: "2024-03-15",
      author: "María González",
      category: "Becas",
    },
    // Add more posts...
  ],
};

export default function InstitutionProfilePage() {
  const [institution, setInstitution] = useState<Institution>(mockInstitution);
  const [activeTab, setActiveTab] = useState("about");

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Banner */}
      <div className="relative h-80">
        <Image
          src={institution.coverImage}
          alt={institution.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20">
          <div className="container mx-auto px-6 h-full flex items-end pb-8">
            <div className="flex items-center gap-6">
              <div className="relative h-24 w-24 rounded-xl overflow-hidden bg-white">
                <Image
                  src={institution.logo}
                  alt={`${institution.name} logo`}
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {institution.name}
                </h1>
                <p className="text-white/90 text-lg max-w-2xl">
                  {institution.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center gap-6">
              {institution.socialMedia.facebook && (
                <a
                  href={institution.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Facebook className="h-6 w-6" />
                </a>
              )}
              {institution.socialMedia.instagram && (
                <a
                  href={institution.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-pink-600 transition-colors"
                >
                  <Instagram className="h-6 w-6" />
                </a>
              )}
              {institution.socialMedia.linkedin && (
                <a
                  href={institution.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-blue-700 transition-colors"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
              )}
              {institution.socialMedia.twitter && (
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
            <Button variant="outline" asChild>
              <a
                href={institution.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Globe className="h-4 w-4 mr-2" />
                Visitar sitio web
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <TabsList className="bg-white">
            <TabsTrigger value="about">Acerca de</TabsTrigger>
            <TabsTrigger value="posts">Publicaciones</TabsTrigger>
            <TabsTrigger value="contact">Contacto</TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-4">Sobre nosotros</h2>
                <p className="text-gray-600 leading-relaxed">
                  {institution.longDescription}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="posts" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {institution.posts.map((post) => (
                <Card key={post.id} className="overflow-hidden">
                  <div className="relative h-48">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.date).toLocaleDateString()}
                      <User className="h-4 w-4 ml-2" />
                      {post.author}
                    </div>
                    <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground line-clamp-3">
                      {post.content}
                    </p>
                    <Button variant="link" className="mt-4 px-0">
                      Leer más
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-semibold mb-6">
                  Información de contacto
                </h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <span>{institution.location}</span>
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
