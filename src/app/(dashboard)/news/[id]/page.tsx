"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useNewsArticle } from "@/hooks/useNewsArticleApi";

export default function NewsDetailPage() {
  const { id } = useParams();
  const {
    data: news,
    isLoading: loading,
    error,
  } = useNewsArticle(id as string);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Skeleton className="h-8 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/2 mb-8" />
        <Skeleton className="h-64 w-full mb-8" />
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-600">{error.message}</p>
      </div>
    );
  }

  if (!news) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-4xl"
    >
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{news.title}</h1>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center">
            {news.authorLogo ? (
              <Image
                src={news.authorLogo}
                alt={news.authorName}
                width={32}
                height={32}
                className="rounded-full"
              />
            ) : (
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs text-gray-600">
                  {news.authorName.charAt(0)}
                </span>
              </div>
            )}
            <span className="ml-2 text-sm text-gray-600">
              {news.authorName}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {new Date(news.publishedAt).toLocaleDateString()}
          </span>
          <span className="text-sm text-gray-500">5 min read</span>
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative h-[400px] mb-8 rounded-xl overflow-hidden group">
        {news.imageUrl ? (
          <>
            <Image
              src={news.imageUrl}
              alt={news.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/90 hover:bg-white text-gray-800 shadow-lg"
                onClick={() => {
                  // Abrir imagen en nueva pestaña para verla más grande
                  window.open(news.imageUrl, "_blank");
                }}
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                  />
                </svg>
                Ver más grande
              </Button>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500">Sin imagen</span>
          </div>
        )}
      </div>

      {/* Content */}
      <Card className="p-8 mb-8">
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />
      </Card>

      {/* Tags */}
      <div className="mt-6 flex flex-wrap gap-2">
        {news.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600"
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
