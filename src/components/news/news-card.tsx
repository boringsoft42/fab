"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface NewsCardProps {
  news: {
    id: string;
    title: string;
    summary: string;
    imageUrl: string;
    authorName: string;
    authorType: string;
    authorLogo: string;
    publishedAt: string;
    viewCount: number;
    category: string;
  };
}

export function NewsCard({ news }: NewsCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);

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
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className="overflow-hidden cursor-pointer group"
        onClick={handleClick}
      >
        <div className="relative h-48">
          <Image
            src={news.imageUrl}
            alt={news.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
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
            <Image
              src={news.authorLogo}
              alt={news.authorName}
              width={24}
              height={24}
              className="rounded-full"
            />
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
