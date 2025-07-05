"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Landmark } from "lucide-react";
import { NewsCard } from "@/components/news/news-card";

const mockCompanyNews = [
  {
    id: "1",
    title: "TechCorp Bolivia Lanza Programa de Becas 2024",
    summary: "Oportunidades de formación en tecnología para jóvenes talentos",
    imageUrl: "/window.svg",
    authorName: "TechCorp",
    authorType: "COMPANY",
    authorLogo: "/logos/techcorp.svg",
    publishedAt: "2024-02-28",
    viewCount: 156,
    category: "Becas",
  },
  {
    id: "2",
    title: "Mindful Co. Abre Nuevas Posiciones para Practicantes",
    summary: "Programa de prácticas profesionales en áreas de innovación",
    imageUrl: "/window.svg",
    authorName: "Mindful Co",
    authorType: "COMPANY",
    authorLogo: "/logos/mindfulco.svg",
    publishedAt: "2024-02-27",
    viewCount: 98,
    category: "Empleos",
  },
  {
    id: "3",
    title: "Innovate Labs Presenta Nueva Iniciativa de Mentoría",
    summary: "Conectando jóvenes profesionales con líderes de la industria",
    imageUrl: "/window.svg",
    authorName: "Innovate Labs",
    authorType: "COMPANY",
    authorLogo: "/logos/innovatelabs.svg",
    publishedAt: "2024-02-26",
    viewCount: 234,
    category: "Mentoría",
  },
];

const mockInstitutionalNews = [
  {
    id: "4",
    title: "Gobierno Municipal Implementa Nueva Política de Empleo Juvenil",
    summary: "Plan integral para fomentar la empleabilidad de jóvenes",
    imageUrl: "/window.svg",
    authorName: "Gobierno Municipal de Cochabamba",
    authorType: "GOVERNMENT",
    authorLogo: "/logos/government.svg",
    publishedAt: "2024-02-27",
    viewCount: 312,
    category: "Políticas",
  },
  {
    id: "5",
    title: "Ministerio de Trabajo Anuncia Feria de Empleo Virtual",
    summary:
      "Conectando empresas con talento joven a través de plataforma digital",
    imageUrl: "/window.svg",
    authorName: "Ministerio de Trabajo",
    authorType: "GOVERNMENT",
    authorLogo: "/logos/government.svg",
    publishedAt: "2024-02-25",
    viewCount: 189,
    category: "Eventos",
  },
  {
    id: "6",
    title: "Nueva Legislación para Impulsar el Primer Empleo",
    summary: "Beneficios para empresas que contraten jóvenes sin experiencia",
    imageUrl: "/window.svg",
    authorName: "Ministerio de Trabajo",
    authorType: "GOVERNMENT",
    authorLogo: "/logos/government.svg",
    publishedAt: "2024-02-24",
    viewCount: 267,
    category: "Legislación",
  },
];

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState("company");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Centro de Noticias</h1>
        <p className="text-gray-600">
          Mantente informado sobre las últimas novedades y oportunidades
        </p>
      </div>

      <Tabs
        defaultValue="company"
        className="w-full"
        onValueChange={setActiveTab}
      >
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="company" className="flex items-center gap-2 py-3">
            <Building2 className="w-4 h-4" />
            Noticias Empresariales
          </TabsTrigger>
          <TabsTrigger
            value="institutional"
            className="flex items-center gap-2 py-3"
          >
            <Landmark className="w-4 h-4" />
            Noticias Institucionales
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="company" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockCompanyNews.map((news) => (
                  <NewsCard key={news.id} news={news} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="institutional" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockInstitutionalNews.map((news) => (
                  <NewsCard key={news.id} news={news} />
                ))}
              </div>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
