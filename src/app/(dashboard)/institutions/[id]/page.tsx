&ldquo;use client&rdquo;;

import { useState } from &ldquo;react&rdquo;;
import { useParams } from &ldquo;next/navigation&rdquo;;
import Image from &ldquo;next/image&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card, CardContent } from &ldquo;@/components/ui/card&rdquo;;
import { Tabs, TabsContent, TabsList, TabsTrigger } from &ldquo;@/components/ui/tabs&rdquo;;
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
} from &ldquo;lucide-react&rdquo;;

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

// Mock data - replace with actual API call
const mockInstitution: Institution = {
  id: &ldquo;1&rdquo;,
  name: &ldquo;TechCorp Academy&rdquo;,
  description: &ldquo;Centro de formación tecnológica líder en Bolivia&rdquo;,
  longDescription:
    &ldquo;TechCorp Academy es un centro de formación tecnológica comprometido con el desarrollo de talento digital en Bolivia. Ofrecemos programas de formación en desarrollo de software, diseño UX/UI, data science y más.&rdquo;,
  location: &ldquo;La Paz, Bolivia&rdquo;,
  logo: &ldquo;/logos/techcorp.svg&rdquo;,
  coverImage: &ldquo;/images/institutions/techcorp-cover.jpg&rdquo;,
  website: &ldquo;https://techcorp.edu.bo&rdquo;,
  email: &ldquo;contacto@techcorp.edu.bo&rdquo;,
  phone: &ldquo;+591 2 1234567&rdquo;,
  socialMedia: {
    facebook: &ldquo;https://facebook.com/techcorp&rdquo;,
    instagram: &ldquo;https://instagram.com/techcorp&rdquo;,
    linkedin: &ldquo;https://linkedin.com/company/techcorp&rdquo;,
  },
  posts: [
    {
      id: &ldquo;1&rdquo;,
      title: &ldquo;Nuevo programa de becas para jóvenes desarrolladores&rdquo;,
      content: &ldquo;Nos complace anunciar nuestro nuevo programa de becas...&rdquo;,
      image: &ldquo;/images/institutions/post-1.jpg&rdquo;,
      date: &ldquo;2024-03-15&rdquo;,
      author: &ldquo;María González&rdquo;,
      category: &ldquo;Becas&rdquo;,
    },
    // Add more posts...
  ],
};

export default function InstitutionProfilePage() {
  const [institution, setInstitution] = useState<Institution>(mockInstitution);
  const [activeTab, setActiveTab] = useState(&ldquo;about&rdquo;);

  return (
    <div className=&ldquo;min-h-screen bg-gray-50/50&rdquo;>
      {/* Hero Banner */}
      <div className=&ldquo;relative h-80&rdquo;>
        <Image
          src={institution.coverImage}
          alt={institution.name}
          fill
          className=&ldquo;object-cover&rdquo;
        />
        <div className=&ldquo;absolute inset-0 bg-gradient-to-b from-black/60 to-black/20&rdquo;>
          <div className=&ldquo;container mx-auto px-6 h-full flex items-end pb-8&rdquo;>
            <div className=&ldquo;flex items-center gap-6&rdquo;>
              <div className=&ldquo;relative h-24 w-24 rounded-xl overflow-hidden bg-white&rdquo;>
                <Image
                  src={institution.logo}
                  alt={`${institution.name} logo`}
                  fill
                  className=&ldquo;object-contain p-2&rdquo;
                />
              </div>
              <div>
                <h1 className=&ldquo;text-3xl font-bold text-white mb-2&rdquo;>
                  {institution.name}
                </h1>
                <p className=&ldquo;text-white/90 text-lg max-w-2xl&rdquo;>
                  {institution.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Bar */}
      <div className=&ldquo;bg-white border-b&rdquo;>
        <div className=&ldquo;container mx-auto px-6&rdquo;>
          <div className=&ldquo;flex items-center justify-between py-4&rdquo;>
            <div className=&ldquo;flex items-center gap-6&rdquo;>
              {institution.socialMedia.facebook && (
                <a
                  href={institution.socialMedia.facebook}
                  target=&ldquo;_blank&rdquo;
                  rel=&ldquo;noopener noreferrer&rdquo;
                  className=&ldquo;text-gray-600 hover:text-blue-600 transition-colors&rdquo;
                >
                  <Facebook className=&ldquo;h-6 w-6&rdquo; />
                </a>
              )}
              {institution.socialMedia.instagram && (
                <a
                  href={institution.socialMedia.instagram}
                  target=&ldquo;_blank&rdquo;
                  rel=&ldquo;noopener noreferrer&rdquo;
                  className=&ldquo;text-gray-600 hover:text-pink-600 transition-colors&rdquo;
                >
                  <Instagram className=&ldquo;h-6 w-6&rdquo; />
                </a>
              )}
              {institution.socialMedia.linkedin && (
                <a
                  href={institution.socialMedia.linkedin}
                  target=&ldquo;_blank&rdquo;
                  rel=&ldquo;noopener noreferrer&rdquo;
                  className=&ldquo;text-gray-600 hover:text-blue-700 transition-colors&rdquo;
                >
                  <Linkedin className=&ldquo;h-6 w-6&rdquo; />
                </a>
              )}
              {institution.socialMedia.twitter && (
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
            <Button variant=&ldquo;outline&rdquo; asChild>
              <a
                href={institution.website}
                target=&ldquo;_blank&rdquo;
                rel=&ldquo;noopener noreferrer&rdquo;
              >
                <Globe className=&ldquo;h-4 w-4 mr-2&rdquo; />
                Visitar sitio web
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className=&ldquo;container mx-auto px-6 py-8&rdquo;>
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className=&ldquo;space-y-8&rdquo;
        >
          <TabsList className=&ldquo;bg-white&rdquo;>
            <TabsTrigger value=&ldquo;about&rdquo;>Acerca de</TabsTrigger>
            <TabsTrigger value=&ldquo;posts&rdquo;>Publicaciones</TabsTrigger>
            <TabsTrigger value=&ldquo;contact&rdquo;>Contacto</TabsTrigger>
          </TabsList>

          <TabsContent value=&ldquo;about&rdquo; className=&ldquo;space-y-6&rdquo;>
            <Card>
              <CardContent className=&ldquo;p-6&rdquo;>
                <h2 className=&ldquo;text-2xl font-semibold mb-4&rdquo;>Sobre nosotros</h2>
                <p className=&ldquo;text-gray-600 leading-relaxed&rdquo;>
                  {institution.longDescription}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value=&ldquo;posts&rdquo; className=&ldquo;space-y-6&rdquo;>
            <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6&rdquo;>
              {institution.posts.map((post) => (
                <Card key={post.id} className=&ldquo;overflow-hidden&rdquo;>
                  <div className=&ldquo;relative h-48&rdquo;>
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className=&ldquo;object-cover&rdquo;
                    />
                  </div>
                  <CardContent className=&ldquo;p-6&rdquo;>
                    <div className=&ldquo;flex items-center gap-2 text-sm text-muted-foreground mb-3&rdquo;>
                      <Calendar className=&ldquo;h-4 w-4&rdquo; />
                      {new Date(post.date).toLocaleDateString()}
                      <User className=&ldquo;h-4 w-4 ml-2&rdquo; />
                      {post.author}
                    </div>
                    <h3 className=&ldquo;text-xl font-semibold mb-2 line-clamp-2&rdquo;>
                      {post.title}
                    </h3>
                    <p className=&ldquo;text-muted-foreground line-clamp-3&rdquo;>
                      {post.content}
                    </p>
                    <Button variant=&ldquo;link&rdquo; className=&ldquo;mt-4 px-0&rdquo;>
                      Leer más
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value=&ldquo;contact&rdquo; className=&ldquo;space-y-6&rdquo;>
            <Card>
              <CardContent className=&ldquo;p-6&rdquo;>
                <h2 className=&ldquo;text-2xl font-semibold mb-6&rdquo;>
                  Información de contacto
                </h2>
                <div className=&ldquo;space-y-4&rdquo;>
                  <div className=&ldquo;flex items-center gap-3&rdquo;>
                    <MapPin className=&ldquo;h-5 w-5 text-muted-foreground&rdquo; />
                    <span>{institution.location}</span>
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
