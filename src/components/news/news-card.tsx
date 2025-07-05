&ldquo;use client&rdquo;;

import { useState } from &ldquo;react&rdquo;;
import Image from &ldquo;next/image&rdquo;;
import { useRouter } from &ldquo;next/navigation&rdquo;;
import { motion } from &ldquo;framer-motion&rdquo;;
import { Eye, Calendar } from &ldquo;lucide-react&rdquo;;
import { Card } from &ldquo;@/components/ui/card&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;

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
  const handleClick = () => {
    router.push(`/news/${news.id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(&ldquo;es-ES&rdquo;, {
      day: &ldquo;2-digit&rdquo;,
      month: &ldquo;long&rdquo;,
      year: &ldquo;numeric&rdquo;,
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
        className=&ldquo;overflow-hidden cursor-pointer group&rdquo;
        onClick={handleClick}
      >
        <div className=&ldquo;relative h-48&rdquo;>
          <Image
            src={news.imageUrl}
            alt={news.title}
            fill
            className=&ldquo;object-cover transition-transform duration-300 group-hover:scale-110&rdquo;
          />
          <div className=&ldquo;absolute inset-0 bg-gradient-to-t from-black/60 to-transparent&rdquo; />
          <div className=&ldquo;absolute bottom-4 left-4 right-4&rdquo;>
            <Badge
              variant=&ldquo;secondary&rdquo;
              className=&ldquo;mb-2 bg-white/90 text-gray-800&rdquo;
            >
              {news.category}
            </Badge>
          </div>
        </div>

        <div className=&ldquo;p-4 space-y-4&rdquo;>
          <div className=&ldquo;flex items-center gap-2 mb-3&rdquo;>
            <Image
              src={news.authorLogo}
              alt={news.authorName}
              width={24}
              height={24}
              className=&ldquo;rounded-full&rdquo;
            />
            <span className=&ldquo;text-sm text-gray-600&rdquo;>{news.authorName}</span>
          </div>

          <h3 className=&ldquo;font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors&rdquo;>
            {news.title}
          </h3>

          <p className=&ldquo;text-gray-600 text-sm line-clamp-2&rdquo;>{news.summary}</p>

          <div className=&ldquo;flex items-center justify-between text-sm text-gray-500 pt-2&rdquo;>
            <div className=&ldquo;flex items-center gap-1&rdquo;>
              <Calendar className=&ldquo;w-4 h-4&rdquo; />
              <span>{formatDate(news.publishedAt)}</span>
            </div>
            <div className=&ldquo;flex items-center gap-1&rdquo;>
              <Eye className=&ldquo;w-4 h-4&rdquo; />
              <span>{news.viewCount}</span>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
