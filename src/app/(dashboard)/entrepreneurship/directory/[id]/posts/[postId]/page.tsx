&ldquo;use client&rdquo;;

import { useParams } from &ldquo;next/navigation&rdquo;;
import Image from &ldquo;next/image&rdquo;;
import Link from &ldquo;next/link&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { ArrowLeft, Calendar, User } from &ldquo;lucide-react&rdquo;;

interface Post {
  id: string;
  title: string;
  content: string;
  image: string;
  date: string;
  author: string;
  category: string;
  institution: {
    id: string;
    name: string;
    logo: string;
  };
}

export default function InstitutionPostPage() {
  // Mock data - replace with API call
  const post: Post = {
    id: &ldquo;1&rdquo;,
    title: &ldquo;Lanzamiento del Programa de Incubación 2024&rdquo;,
    content: `Nos complace anunciar el lanzamiento de nuestro programa de incubación para el año 2024. Este año, estamos buscando startups innovadoras en el sector tecnológico con impacto social.

El programa está diseñado para apoyar a emprendedores jóvenes que buscan desarrollar soluciones tecnológicas con un impacto social positivo en nuestra comunidad.

¿Qué ofrecemos?
• Mentoría especializada
• Acceso a financiamiento
• Espacio de trabajo colaborativo
• Red de contactos
• Capacitación técnica y empresarial

Los participantes seleccionados tendrán la oportunidad de trabajar con mentores experimentados, acceder a recursos técnicos y financieros, y formar parte de una comunidad vibrante de emprendedores.

El programa tiene una duración de 6 meses y está abierto a emprendedores entre 18 y 35 años con una idea de negocio validada en el sector tecnológico.

Las postulaciones están abiertas desde el 1 de abril hasta el 30 de abril de 2024.

Para más información sobre el proceso de aplicación y los requisitos, visita nuestro sitio web o contáctanos directamente.`,
    image: &ldquo;/images/institutions/posts/incubation-program.jpg&rdquo;,
    date: &ldquo;2024-03-15&rdquo;,
    author: &ldquo;Ana Rodriguez&rdquo;,
    category: &ldquo;Programas&rdquo;,
    institution: {
      id: &ldquo;1&rdquo;,
      name: &ldquo;CEMSE Innovation Hub&rdquo;,
      logo: &ldquo;/logos/cemse.svg&rdquo;,
    },
  };

  return (
    <div className=&ldquo;min-h-screen bg-gray-50/50&rdquo;>
      {/* Hero Image */}
      <div className=&ldquo;relative h-[400px]&rdquo;>
        <Image
          src={post.image}
          alt={post.title}
          fill
          className=&ldquo;object-cover&rdquo;
        />
        <div className=&ldquo;absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent&rdquo;>
          <div className=&ldquo;container mx-auto px-6 h-full flex flex-col justify-between py-8&rdquo;>
            <div className=&ldquo;flex items-center gap-2&rdquo;>
              <Button variant=&ldquo;ghost&rdquo; className=&ldquo;text-white&rdquo; asChild>
                <Link href={`/entrepreneurship/directory/${params.id}`}>
                  <ArrowLeft className=&ldquo;h-4 w-4 mr-2&rdquo; />
                  Volver a la Institución
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className=&ldquo;container mx-auto px-6 py-8&rdquo;>
        <div className=&ldquo;max-w-3xl mx-auto&rdquo;>
          {/* Institution Info */}
          <div className=&ldquo;flex items-center gap-3 mb-8&rdquo;>
            <div className=&ldquo;relative h-12 w-12 rounded-lg overflow-hidden bg-white&rdquo;>
              <Image
                src={post.institution.logo}
                alt={post.institution.name}
                fill
                className=&ldquo;object-contain p-2&rdquo;
              />
            </div>
            <Link
              href={`/entrepreneurship/directory/${post.institution.id}`}
              className=&ldquo;text-lg font-medium hover:text-blue-600&rdquo;
            >
              {post.institution.name}
            </Link>
          </div>

          {/* Post Header */}
          <h1 className=&ldquo;text-4xl font-bold mb-4&rdquo;>{post.title}</h1>

          {/* Post Metadata */}
          <div className=&ldquo;flex items-center gap-4 text-muted-foreground mb-8&rdquo;>
            <div className=&ldquo;flex items-center gap-2&rdquo;>
              <Calendar className=&ldquo;h-4 w-4&rdquo; />
              {new Date(post.date).toLocaleDateString()}
            </div>
            <div className=&ldquo;flex items-center gap-2&rdquo;>
              <User className=&ldquo;h-4 w-4&rdquo; />
              {post.author}
            </div>
          </div>

          {/* Post Content */}
          <div className=&ldquo;prose prose-lg max-w-none&rdquo;>
            {post.content.split(&ldquo;\n\n&rdquo;).map((paragraph, index) => (
              <p key={index} className=&ldquo;mb-4&rdquo;>
                {paragraph.includes(&ldquo;•&rdquo;) ? (
                  <ul className=&ldquo;list-disc pl-4&rdquo;>
                    {paragraph
                      .split(&ldquo;•&rdquo;)
                      .map(
                        (item, i) =>
                          item.trim() && <li key={i}>{item.trim()}</li>
                      )}
                  </ul>
                ) : (
                  paragraph
                )}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
