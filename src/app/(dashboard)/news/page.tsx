"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Landmark } from "lucide-react";
import { NewsCard } from "@/components/news/news-card";
import { usePublicNews } from "@/hooks/useNewsArticleApi";

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState("company");
  const { data: newsArticles, isLoading: loading, error } = usePublicNews();

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
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                      <div className="p-4 space-y-3">
                        <div className="bg-gray-200 h-4 rounded"></div>
                        <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600">
                    Error al cargar las noticias: {error.message}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.isArray(newsArticles) ? (
                    newsArticles.map((news) => (
                      <NewsCard key={news.id} news={news} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-600">
                        No hay noticias disponibles
                      </p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="institutional" className="mt-0">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-gray-200 h-48 rounded-t-lg"></div>
                      <div className="p-4 space-y-3">
                        <div className="bg-gray-200 h-4 rounded"></div>
                        <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600">
                    Error al cargar las noticias: {error.message}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.isArray(newsArticles) ? (
                    newsArticles.map((news) => (
                      <NewsCard key={news.id} news={news} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-8">
                      <p className="text-gray-600">
                        No hay noticias disponibles
                      </p>
                    </div>
                  )}
                </div>
              )}
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
    </div>
  );
}
