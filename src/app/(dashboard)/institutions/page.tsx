"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Search,
  MapPin,
  Globe,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Institution {
  id: string;
  name: string;
  description: string;
  location: string;
  logo: string;
  coverImage: string;
  website: string;
  socialMedia: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
  };
  postCount: number;
}

// Mock data - replace with actual API call
const mockInstitutions: Institution[] = [
  {
    id: "1",
    name: "TechCorp Academy",
    description: "Centro de formación tecnológica líder en Bolivia",
    location: "La Paz, Bolivia",
    logo: "/logos/techcorp.svg",
    coverImage: "/images/institutions/techcorp-cover.jpg",
    website: "https://techcorp.edu.bo",
    socialMedia: {
      facebook: "https://facebook.com/techcorp",
      instagram: "https://instagram.com/techcorp",
      linkedin: "https://linkedin.com/company/techcorp",
    },
    postCount: 12,
  },
  {
    id: "2",
    name: "Innovate Labs",
    description: "Espacio de innovación y emprendimiento",
    location: "Santa Cruz, Bolivia",
    logo: "/logos/innovatelabs.svg",
    coverImage: "/images/institutions/innovate-cover.jpg",
    website: "https://innovatelabs.bo",
    socialMedia: {
      facebook: "https://facebook.com/innovatelabs",
      twitter: "https://twitter.com/innovatelabs",
      linkedin: "https://linkedin.com/company/innovatelabs",
    },
    postCount: 8,
  },
  // Add more mock institutions...
];

export default function InstitutionsDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [institutions, setInstitutions] =
    useState<Institution[]>(mockInstitutions);

  const filteredInstitutions = institutions.filter(
    (institution) =>
      institution.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      institution.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      institution.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="relative h-64 rounded-2xl overflow-hidden mb-8">
        <Image
          src="/images/institutions/directory-banner.jpg"
          alt="Directorio de Instituciones"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-900/40 flex items-center">
          <div className="px-8">
            <h1 className="text-4xl font-bold text-white mb-4">
              Directorio de Instituciones
            </h1>
            <p className="text-xl text-white/90 max-w-2xl">
              Explora las instituciones que forman parte de nuestra red de
              emprendimiento y desarrollo profesional
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
          <Input
            placeholder="Buscar instituciones por nombre, descripción o ubicación..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-6 text-lg"
          />
        </div>
      </div>

      {/* Institutions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInstitutions.map((institution) => (
          <Link
            key={institution.id}
            href={`/institutions/${institution.id}`}
            className="block group"
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
              <div className="relative h-48">
                <Image
                  src={institution.coverImage}
                  alt={institution.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                  <div className="relative h-16 w-16 mb-2">
                    <Image
                      src={institution.logo}
                      alt={`${institution.name} logo`}
                      fill
                      className="object-contain rounded-lg bg-white p-2"
                    />
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors">
                  {institution.name}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {institution.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1" />
                    {institution.location}
                  </div>
                  <div className="flex items-center gap-2">
                    {institution.socialMedia.facebook && (
                      <Facebook className="h-4 w-4 text-muted-foreground" />
                    )}
                    {institution.socialMedia.instagram && (
                      <Instagram className="h-4 w-4 text-muted-foreground" />
                    )}
                    {institution.socialMedia.linkedin && (
                      <Linkedin className="h-4 w-4 text-muted-foreground" />
                    )}
                    {institution.socialMedia.twitter && (
                      <Twitter className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
