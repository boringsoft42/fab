&ldquo;use client&rdquo;;

import { useState } from &ldquo;react&rdquo;;
import { useParams } from &ldquo;next/navigation&rdquo;;
import Image from &ldquo;next/image&rdquo;;
import Link from &ldquo;next/link&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card, CardContent } from &ldquo;@/components/ui/card&rdquo;;
import { Tabs, TabsContent, TabsList, TabsTrigger } from &ldquo;@/components/ui/tabs&rdquo;;
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
} from &ldquo;lucide-react&rdquo;;
import type { Institution } from &ldquo;../page&rdquo;;

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
  const [activeTab, setActiveTab] = useState(&ldquo;about&rdquo;);

  // Mock data - replace with API call
  const institution: Institution = {
    id: &ldquo;1&rdquo;,
    name: &ldquo;CEMSE Innovation Hub&rdquo;,
    description:
      &ldquo;Incubadora especializada en tecnología y emprendimientos juveniles con enfoque en innovación social&rdquo;,
    type: &ldquo;incubator&rdquo;,
    category: &ldquo;Tecnología&rdquo;,
    logo: &ldquo;/logos/cemse.svg&rdquo;,
    coverImage: &ldquo;/images/institutions/cemse-cover.jpg&rdquo;,
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
    targetAudience: [],
    eligibilityRequirements: [],
    contactPerson: &ldquo;Ing. Ana Rodriguez&rdquo;,
    socialMedia: {
      facebook: &ldquo;https://facebook.com/cemsehub&rdquo;,
      linkedin: &ldquo;https://linkedin.com/company/cemse-hub&rdquo;,
    },
    isActive: true,
    isVerified: true,
    lastUpdated: new Date(),
    createdAt: new Date(&ldquo;2023-01-15&rdquo;),
  };

  const posts: InstitutionPost[] = [
    {
      id: &ldquo;1&rdquo;,
      title: &ldquo;Lanzamiento del Programa de Incubación 2024&rdquo;,
      content:
        &ldquo;Nos complace anunciar el lanzamiento de nuestro programa de incubación para el año 2024. Este año, estamos buscando startups innovadoras en el sector tecnológico con impacto social...&rdquo;,
      image: &ldquo;/images/institutions/posts/incubation-program.jpg&rdquo;,
      date: &ldquo;2024-03-15&rdquo;,
      author: &ldquo;Ana Rodriguez&rdquo;,
      category: &ldquo;Programas&rdquo;,
    },
    {
      id: &ldquo;2&rdquo;,
      title: &ldquo;Caso de Éxito: TechSocial Bolivia&rdquo;,
      content:
        &ldquo;TechSocial Bolivia, una startup graduada de nuestro programa de incubación, ha logrado impactar a más de 1,000 jóvenes a través de su plataforma de educación tecnológica...&rdquo;,
      image: &ldquo;/images/institutions/posts/success-story.jpg&rdquo;,
      date: &ldquo;2024-03-10&rdquo;,
      author: &ldquo;Carlos Mendoza&rdquo;,
      category: &ldquo;Casos de Éxito&rdquo;,
    },
  ];

  return (
    <div className=&ldquo;min-h-screen bg-gray-50/50&rdquo;>
      {/* Hero Banner */}
      <div className=&ldquo;relative h-[400px]&rdquo;>
        <Image
          src={institution.coverImage || &ldquo;/images/institutions/default-cover.jpg&rdquo;}
          alt={institution.name}
          fill
          className=&ldquo;object-cover&rdquo;
        />
        <div className=&ldquo;absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent&rdquo;>
          <div className=&ldquo;container mx-auto px-6 h-full flex flex-col justify-between py-8&rdquo;>
            <div className=&ldquo;flex items-center gap-2&rdquo;>
              <Button variant=&ldquo;ghost&rdquo; className=&ldquo;text-white&rdquo; asChild>
                <Link href=&ldquo;/entrepreneurship/directory&rdquo;>
                  <ArrowLeft className=&ldquo;h-4 w-4 mr-2&rdquo; />
                  Volver al Directorio
                </Link>
              </Button>
            </div>
            <div className=&ldquo;flex items-center gap-6&rdquo;>
              <div className=&ldquo;relative h-32 w-32 rounded-xl overflow-hidden bg-white&rdquo;>
                <Image
                  src={institution.logo || &ldquo;/images/institutions/default-logo.jpg&rdquo;}
                  alt={`${institution.name} logo`}
                  fill
                  className=&ldquo;object-contain p-4&rdquo;
                />
              </div>
              <div>
                <h1 className=&ldquo;text-4xl font-bold text-white mb-2&rdquo;>
                  {institution.name}
                </h1>
                <p className=&ldquo;text-xl text-white/90 max-w-2xl&rdquo;>
                  {institution.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className=&ldquo;bg-white border-b&rdquo;>
        <div className=&ldquo;container mx-auto px-6&rdquo;>
          <div className=&ldquo;flex items-center gap-6 py-4&rdquo;>
            {institution.socialMedia?.facebook && (
              <a
                href={institution.socialMedia.facebook}
                target=&ldquo;_blank&rdquo;
                rel=&ldquo;noopener noreferrer&rdquo;
                className=&ldquo;text-gray-600 hover:text-blue-600 transition-colors&rdquo;
              >
                <Facebook className=&ldquo;h-6 w-6&rdquo; />
              </a>
            )}
            {institution.socialMedia?.instagram && (
              <a
                href={institution.socialMedia.instagram}
                target=&ldquo;_blank&rdquo;
                rel=&ldquo;noopener noreferrer&rdquo;
                className=&ldquo;text-gray-600 hover:text-pink-600 transition-colors&rdquo;
              >
                <Instagram className=&ldquo;h-6 w-6&rdquo; />
              </a>
            )}
            {institution.socialMedia?.linkedin && (
              <a
                href={institution.socialMedia.linkedin}
                target=&ldquo;_blank&rdquo;
                rel=&ldquo;noopener noreferrer&rdquo;
                className=&ldquo;text-gray-600 hover:text-blue-700 transition-colors&rdquo;
              >
                <Linkedin className=&ldquo;h-6 w-6&rdquo; />
              </a>
            )}
            {institution.socialMedia?.twitter && (
              <a
                href={institution.socialMedia.twitter}
                target=&ldquo;_blank&rdquo;
                rel=&ldquo;noopener noreferrer&rdquo;
                className=&ldquo;text-gray-600 hover:text-blue-400 transition-colors&rdquo;
              >
                <Twitter className=&ldquo;h-6 w-6&rdquo; />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className=&ldquo;container mx-auto px-6 py-8&rdquo;>
        <div className=&ldquo;grid grid-cols-1 lg:grid-cols-3 gap-8&rdquo;>
          {/* Left Column - Info */}
          <div className=&ldquo;lg:col-span-2&rdquo;>
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className=&ldquo;space-y-8&rdquo;
            >
              <TabsList>
                <TabsTrigger value=&ldquo;about&rdquo;>Información</TabsTrigger>
                <TabsTrigger value=&ldquo;posts&rdquo;>Publicaciones</TabsTrigger>
              </TabsList>

              <TabsContent value=&ldquo;about&rdquo; className=&ldquo;space-y-6&rdquo;>
                <Card>
                  <CardContent className=&ldquo;p-6&rdquo;>
                    <h2 className=&ldquo;text-2xl font-semibold mb-4&rdquo;>
                      Sobre nosotros
                    </h2>
                    <p className=&ldquo;text-gray-600 leading-relaxed mb-6&rdquo;>
                      {institution.description}
                    </p>

                    <h3 className=&ldquo;font-semibold mb-3&rdquo;>Servicios Ofrecidos</h3>
                    <ul className=&ldquo;list-disc list-inside space-y-1 text-gray-600 mb-6&rdquo;>
                      {institution.servicesOffered.map((service, index) => (
                        <li key={index}>{service}</li>
                      ))}
                    </ul>

                    <h3 className=&ldquo;font-semibold mb-3&rdquo;>Áreas de Enfoque</h3>
                    <ul className=&ldquo;list-disc list-inside space-y-1 text-gray-600&rdquo;>
                      {institution.focusAreas.map((area, index) => (
                        <li key={index}>{area}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value=&ldquo;posts&rdquo; className=&ldquo;space-y-6&rdquo;>
                <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 gap-6&rdquo;>
                  {posts.map((post) => (
                    <Link
                      href={`/entrepreneurship/directory/${params.id}/posts/${post.id}`}
                      key={post.id}
                    >
                      <Card className=&ldquo;overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full&rdquo;>
                        <div className=&ldquo;relative h-48&rdquo;>
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            className=&ldquo;object-cover&rdquo;
                          />
                        </div>
                        <CardContent className=&ldquo;p-6&rdquo;>
                          <h3 className=&ldquo;text-xl font-semibold mb-2&rdquo;>
                            {post.title}
                          </h3>
                          <p className=&ldquo;text-muted-foreground mb-4 line-clamp-2&rdquo;>
                            {post.content}
                          </p>
                          <div className=&ldquo;flex items-center justify-between text-sm text-muted-foreground&rdquo;>
                            <div className=&ldquo;flex items-center gap-2&rdquo;>
                              <Calendar className=&ldquo;h-4 w-4&rdquo; />
                              {new Date(post.date).toLocaleDateString()}
                            </div>
                            <div className=&ldquo;flex items-center gap-2&rdquo;>
                              <User className=&ldquo;h-4 w-4&rdquo; />
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
          <div className=&ldquo;space-y-6&rdquo;>
            <Card>
              <CardContent className=&ldquo;p-6&rdquo;>
                <h3 className=&ldquo;font-semibold mb-4&rdquo;>Información de Contacto</h3>
                <div className=&ldquo;space-y-4&rdquo;>
                  <div className=&ldquo;flex items-center gap-3&rdquo;>
                    <MapPin className=&ldquo;h-5 w-5 text-muted-foreground&rdquo; />
                    <span>{institution.address}</span>
                  </div>
                  <div className=&ldquo;flex items-center gap-3&rdquo;>
                    <Mail className=&ldquo;h-5 w-5 text-muted-foreground&rdquo; />
                    <a
                      href={`mailto:${institution.email}`}
                      className=&ldquo;hover:text-blue-600&rdquo;
                    >
                      {institution.email}
                    </a>
                  </div>
                  <div className=&ldquo;flex items-center gap-3&rdquo;>
                    <Phone className=&ldquo;h-5 w-5 text-muted-foreground&rdquo; />
                    <a
                      href={`tel:${institution.phone}`}
                      className=&ldquo;hover:text-blue-600&rdquo;
                    >
                      {institution.phone}
                    </a>
                  </div>
                  {institution.website && (
                    <div className=&ldquo;flex items-center gap-3&rdquo;>
                      <Globe className=&ldquo;h-5 w-5 text-muted-foreground&rdquo; />
                      <a
                        href={institution.website}
                        target=&ldquo;_blank&rdquo;
                        rel=&ldquo;noopener noreferrer&rdquo;
                        className=&ldquo;hover:text-blue-600&rdquo;
                      >
                        Visitar sitio web
                      </a>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className=&ldquo;p-6&rdquo;>
                <h3 className=&ldquo;font-semibold mb-4&rdquo;>Persona de Contacto</h3>
                <div className=&ldquo;flex items-center gap-3&rdquo;>
                  <User className=&ldquo;h-5 w-5 text-muted-foreground&rdquo; />
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
