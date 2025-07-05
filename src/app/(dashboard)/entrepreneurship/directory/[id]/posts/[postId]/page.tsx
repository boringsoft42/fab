"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User } from "lucide-react";

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
    id: "1",
    title: "Lanzamiento del Programa de Incubación 2024",
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
    image: "/images/institutions/posts/incubation-program.jpg",
    date: "2024-03-15",
    author: "Ana Rodriguez",
    category: "Programas",
    institution: {
      id: "1",
      name: "CEMSE Innovation Hub",
      logo: "/logos/cemse.svg",
    },
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Hero Image */}
      <div className="relative h-[400px]">
        <Image
          src={post.image}
          alt={post.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-transparent">
          <div className="container mx-auto px-6 h-full flex flex-col justify-between py-8">
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="text-white" asChild>
                <Link href={`/entrepreneurship/directory/${params.id}`}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver a la Institución
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Institution Info */}
          <div className="flex items-center gap-3 mb-8">
            <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-white">
              <Image
                src={post.institution.logo}
                alt={post.institution.name}
                fill
                className="object-contain p-2"
              />
            </div>
            <Link
              href={`/entrepreneurship/directory/${post.institution.id}`}
              className="text-lg font-medium hover:text-blue-600"
            >
              {post.institution.name}
            </Link>
          </div>

          {/* Post Header */}
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

          {/* Post Metadata */}
          <div className="flex items-center gap-4 text-muted-foreground mb-8">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {post.author}
            </div>
          </div>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none">
            {post.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph.includes("•") ? (
                  <ul className="list-disc pl-4">
                    {paragraph
                      .split("•")
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
