"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building2, Landmark } from "lucide-react";
import { NewsCard } from "@/components/news/news-card";
import { useNewsArticles } from "@/hooks/useNewsArticleApi";

export default function NewsPage() {
  const [activeTab, setActiveTab] = useState("company");
  const { data: newsArticles, loading, error } = useNewsArticles();

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
                {newsArticles?.map((news) => (
                  <NewsCard key={news.id} news={news} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="institutional" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newsArticles?.map((news) => (
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
