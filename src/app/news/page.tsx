&ldquo;use client&rdquo;;

import { useState } from &ldquo;react&rdquo;;
import { motion, AnimatePresence } from &ldquo;framer-motion&rdquo;;
import { Tabs, TabsContent, TabsList, TabsTrigger } from &ldquo;@/components/ui/tabs&rdquo;;
import { Building2, Landmark } from &ldquo;lucide-react&rdquo;;
import { NewsCard } from &ldquo;@/components/news/news-card&rdquo;;

const mockCompanyNews = [
  {
    id: &ldquo;1&rdquo;,
    title: &ldquo;TechCorp Bolivia Lanza Programa de Becas 2024&rdquo;,
    summary: &ldquo;Oportunidades de formación en tecnología para jóvenes talentos&rdquo;,
    imageUrl: &ldquo;/window.svg&rdquo;,
    authorName: &ldquo;TechCorp&rdquo;,
    authorType: &ldquo;COMPANY&rdquo;,
    authorLogo: &ldquo;/logos/techcorp.svg&rdquo;,
    publishedAt: &ldquo;2024-02-28&rdquo;,
    viewCount: 156,
    category: &ldquo;Becas&rdquo;,
  },
  {
    id: &ldquo;2&rdquo;,
    title: &ldquo;Mindful Co. Abre Nuevas Posiciones para Practicantes&rdquo;,
    summary: &ldquo;Programa de prácticas profesionales en áreas de innovación&rdquo;,
    imageUrl: &ldquo;/window.svg&rdquo;,
    authorName: &ldquo;Mindful Co&rdquo;,
    authorType: &ldquo;COMPANY&rdquo;,
    authorLogo: &ldquo;/logos/mindfulco.svg&rdquo;,
    publishedAt: &ldquo;2024-02-27&rdquo;,
    viewCount: 98,
    category: &ldquo;Empleos&rdquo;,
  },
  {
    id: &ldquo;3&rdquo;,
    title: &ldquo;Innovate Labs Presenta Nueva Iniciativa de Mentoría&rdquo;,
    summary: &ldquo;Conectando jóvenes profesionales con líderes de la industria&rdquo;,
    imageUrl: &ldquo;/window.svg&rdquo;,
    authorName: &ldquo;Innovate Labs&rdquo;,
    authorType: &ldquo;COMPANY&rdquo;,
    authorLogo: &ldquo;/logos/innovatelabs.svg&rdquo;,
    publishedAt: &ldquo;2024-02-26&rdquo;,
    viewCount: 234,
    category: &ldquo;Mentoría&rdquo;,
  },
];

const mockInstitutionalNews = [
  {
    id: &ldquo;4&rdquo;,
    title: &ldquo;Gobierno Municipal Implementa Nueva Política de Empleo Juvenil&rdquo;,
    summary: &ldquo;Plan integral para fomentar la empleabilidad de jóvenes&rdquo;,
    imageUrl: &ldquo;/window.svg&rdquo;,
    authorName: &ldquo;Gobierno Municipal de Cochabamba&rdquo;,
    authorType: &ldquo;GOVERNMENT&rdquo;,
    authorLogo: &ldquo;/logos/government.svg&rdquo;,
    publishedAt: &ldquo;2024-02-27&rdquo;,
    viewCount: 312,
    category: &ldquo;Políticas&rdquo;,
  },
  {
    id: &ldquo;5&rdquo;,
    title: &ldquo;Ministerio de Trabajo Anuncia Feria de Empleo Virtual&rdquo;,
    summary:
      &ldquo;Conectando empresas con talento joven a través de plataforma digital&rdquo;,
    imageUrl: &ldquo;/window.svg&rdquo;,
    authorName: &ldquo;Ministerio de Trabajo&rdquo;,
    authorType: &ldquo;GOVERNMENT&rdquo;,
    authorLogo: &ldquo;/logos/government.svg&rdquo;,
    publishedAt: &ldquo;2024-02-25&rdquo;,
    viewCount: 189,
    category: &ldquo;Eventos&rdquo;,
  },
  {
    id: &ldquo;6&rdquo;,
    title: &ldquo;Nueva Legislación para Impulsar el Primer Empleo&rdquo;,
    summary: &ldquo;Beneficios para empresas que contraten jóvenes sin experiencia&rdquo;,
    imageUrl: &ldquo;/window.svg&rdquo;,
    authorName: &ldquo;Ministerio de Trabajo&rdquo;,
    authorType: &ldquo;GOVERNMENT&rdquo;,
    authorLogo: &ldquo;/logos/government.svg&rdquo;,
    publishedAt: &ldquo;2024-02-24&rdquo;,
    viewCount: 267,
    category: &ldquo;Legislación&rdquo;,
  },
];

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState(&ldquo;company&rdquo;);

  return (
    <div className=&ldquo;container mx-auto px-4 py-8&rdquo;>
      <div className=&ldquo;mb-8&rdquo;>
        <h1 className=&ldquo;text-3xl font-bold mb-2&rdquo;>Centro de Noticias</h1>
        <p className=&ldquo;text-gray-600&rdquo;>
          Mantente informado sobre las últimas novedades y oportunidades
        </p>
      </div>

      <Tabs
        defaultValue=&ldquo;company&rdquo;
        className=&ldquo;w-full&rdquo;
        onValueChange={setActiveTab}
      >
        <TabsList className=&ldquo;grid w-full grid-cols-2 mb-8&rdquo;>
          <TabsTrigger value=&ldquo;company&rdquo; className=&ldquo;flex items-center gap-2 py-3&rdquo;>
            <Building2 className=&ldquo;w-4 h-4&rdquo; />
            Noticias Empresariales
          </TabsTrigger>
          <TabsTrigger
            value=&ldquo;institutional&rdquo;
            className=&ldquo;flex items-center gap-2 py-3&rdquo;
          >
            <Landmark className=&ldquo;w-4 h-4&rdquo; />
            Noticias Institucionales
          </TabsTrigger>
        </TabsList>

        <AnimatePresence mode=&ldquo;wait&rdquo;>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value=&ldquo;company&rdquo; className=&ldquo;mt-0&rdquo;>
              <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6&rdquo;>
                {mockCompanyNews.map((news) => (
                  <NewsCard key={news.id} news={news} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value=&ldquo;institutional&rdquo; className=&ldquo;mt-0&rdquo;>
              <div className=&ldquo;grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6&rdquo;>
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
