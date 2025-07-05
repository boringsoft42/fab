&ldquo;use client&rdquo;;

import { useState } from &ldquo;react&rdquo;;
import { Input } from &ldquo;@/components/ui/input&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card, CardContent } from &ldquo;@/components/ui/card&rdquo;;
import {
  Search,
  MapPin,
  Globe,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
} from &ldquo;lucide-react&rdquo;;
import Link from &ldquo;next/link&rdquo;;
import Image from &ldquo;next/image&rdquo;;

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
    id: &ldquo;1&rdquo;,
    name: &ldquo;TechCorp Academy&rdquo;,
    description: &ldquo;Centro de formación tecnológica líder en Bolivia&rdquo;,
    location: &ldquo;La Paz, Bolivia&rdquo;,
    logo: &ldquo;/logos/techcorp.svg&rdquo;,
    coverImage: &ldquo;/images/institutions/techcorp-cover.jpg&rdquo;,
    website: &ldquo;https://techcorp.edu.bo&rdquo;,
    socialMedia: {
      facebook: &ldquo;https://facebook.com/techcorp&rdquo;,
      instagram: &ldquo;https://instagram.com/techcorp&rdquo;,
      linkedin: &ldquo;https://linkedin.com/company/techcorp&rdquo;,
    },
    postCount: 12,
  },
  {
    id: &ldquo;2&rdquo;,
    name: &ldquo;Innovate Labs&rdquo;,
    description: &ldquo;Espacio de innovación y emprendimiento&rdquo;,
    location: &ldquo;Santa Cruz, Bolivia&rdquo;,
    logo: &ldquo;/logos/innovatelabs.svg&rdquo;,
    coverImage: &ldquo;/images/institutions/innovate-cover.jpg&rdquo;,
    website: &ldquo;https://innovatelabs.bo&rdquo;,
    socialMedia: {
      facebook: &ldquo;https://facebook.com/innovatelabs&rdquo;,
      twitter: &ldquo;https://twitter.com/innovatelabs&rdquo;,
      linkedin: &ldquo;https://linkedin.com/company/innovatelabs&rdquo;,
    },
    postCount: 8,
  },
  // Add more mock institutions...
];

export default function InstitutionsDirectoryPage() {
  const [searchQuery, setSearchQuery] = useState(&ldquo;&rdquo;);
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
    <div className=&ldquo;container mx-auto p-6 max-w-7xl&rdquo;>
      {/* Header */}
      <div className=&ldquo;relative h-64 rounded-2xl overflow-hidden mb-8&rdquo;>
        <Image
          src=&ldquo;/images/institutions/directory-banner.jpg&rdquo;
          alt=&ldquo;Directorio de Instituciones&rdquo;
          fill
          className=&ldquo;object-cover&rdquo;
        />
        <div className=&ldquo;absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-900/40 flex items-center&rdquo;>
          <div className=&ldquo;px-8&rdquo;>
            <h1 className=&ldquo;text-4xl font-bold text-white mb-4&rdquo;>
              Directorio de Instituciones
            </h1>
            <p className=&ldquo;text-xl text-white/90 max-w-2xl&rdquo;>
              Explora las instituciones que forman parte de nuestra red de
              emprendimiento y desarrollo profesional
            </p>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className=&ldquo;mb-8&rdquo;>
        <div className=&ldquo;relative max-w-2xl mx-auto&rdquo;>
          <Search className=&ldquo;absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5&rdquo; />
          <Input
            placeholder=&ldquo;Buscar instituciones por nombre, descripción o ubicación...&rdquo;
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className=&ldquo;pl-10 py-6 text-lg&rdquo;
          />
        </div>
      </div>

      {/* Institutions Grid */}
      <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6&rdquo;>
        {filteredInstitutions.map((institution) => (
          <Link
            key={institution.id}
            href={`/institutions/${institution.id}`}
            className=&ldquo;block group&rdquo;
          >
            <Card className=&ldquo;overflow-hidden hover:shadow-lg transition-shadow duration-200&rdquo;>
              <div className=&ldquo;relative h-48&rdquo;>
                <Image
                  src={institution.coverImage}
                  alt={institution.name}
                  fill
                  className=&ldquo;object-cover&rdquo;
                />
                <div className=&ldquo;absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4&rdquo;>
                  <div className=&ldquo;relative h-16 w-16 mb-2&rdquo;>
                    <Image
                      src={institution.logo}
                      alt={`${institution.name} logo`}
                      fill
                      className=&ldquo;object-contain rounded-lg bg-white p-2&rdquo;
                    />
                  </div>
                </div>
              </div>
              <CardContent className=&ldquo;p-6&rdquo;>
                <h3 className=&ldquo;text-xl font-semibold mb-2 group-hover:text-blue-600 transition-colors&rdquo;>
                  {institution.name}
                </h3>
                <p className=&ldquo;text-muted-foreground mb-4&rdquo;>
                  {institution.description}
                </p>
                <div className=&ldquo;flex items-center justify-between&rdquo;>
                  <div className=&ldquo;flex items-center text-sm text-muted-foreground&rdquo;>
                    <MapPin className=&ldquo;h-4 w-4 mr-1&rdquo; />
                    {institution.location}
                  </div>
                  <div className=&ldquo;flex items-center gap-2&rdquo;>
                    {institution.socialMedia.facebook && (
                      <Facebook className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
                    )}
                    {institution.socialMedia.instagram && (
                      <Instagram className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
                    )}
                    {institution.socialMedia.linkedin && (
                      <Linkedin className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
                    )}
                    {institution.socialMedia.twitter && (
                      <Twitter className=&ldquo;h-4 w-4 text-muted-foreground&rdquo; />
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
