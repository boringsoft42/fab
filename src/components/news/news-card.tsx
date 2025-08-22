"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { NewsArticle } from "@/types/news";

interface NewsCardProps {
  news: NewsArticle;
}

export function NewsCard({ news }: NewsCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/news/${news.id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
      <Card
        className="overflow-hidden cursor-pointer group"
        onClick={handleClick}
      >
        <div className="relative h-48">
          {news.imageUrl ? (
            <Image
              src={news.imageUrl}
              alt={news.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-500">Sin imagen</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <Badge
              variant="secondary"
              className="mb-2 bg-white/90 text-gray-800"
            >
              {news.category}
            </Badge>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2 mb-3">
            {news.authorLogo ? (
              <Image
                src={news.authorLogo}
                alt={news.authorName}
                width={24}
                height={24}
                className="rounded-full"
              />
            ) : (
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-xs text-gray-600">
                  {news.authorName.charAt(0)}
                </span>
              </div>
            )}
            <span className="text-sm text-gray-600">{news.authorName}</span>
          </div>

          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
            {news.title}
          </h3>

          <p className="text-gray-600 text-sm line-clamp-2">{news.summary}</p>

          <div className="flex items-center justify-between text-sm text-gray-500 pt-2">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(news.publishedAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{news.viewCount}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
