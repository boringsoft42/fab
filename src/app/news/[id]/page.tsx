&ldquo;use client&rdquo;;

import { useEffect, useState } from &ldquo;react&rdquo;;
import { useParams } from &ldquo;next/navigation&rdquo;;
import Image from &ldquo;next/image&rdquo;;
import { motion } from &ldquo;framer-motion&rdquo;;
import { Share2, ThumbsUp, MessageCircle, Eye } from &ldquo;lucide-react&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card } from &ldquo;@/components/ui/card&rdquo;;
import { Skeleton } from &ldquo;@/components/ui/skeleton&rdquo;;

interface NewsDetail {
  id: string;
  title: string;
  summary: string;
  content: string;
  imageUrl: string;
  authorName: string;
  authorType: string;
  authorLogo: string;
  priority: string;
  category: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  tags: string[];
  featured: boolean;
  readTime: number;
}

export default function NewsDetailPage() {
  const { id } = useParams();
  const [news, setNews] = useState<NewsDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const response = await fetch(`/api/news/${id}`);
        if (!response.ok) {
          throw new Error(&ldquo;Failed to fetch news details&rdquo;);
        }
        const data = await response.json();
        setNews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : &ldquo;An error occurred&rdquo;);
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id]);

  if (loading) {
    return (
      <div className=&ldquo;container mx-auto px-4 py-8 max-w-4xl&rdquo;>
        <Skeleton className=&ldquo;h-8 w-3/4 mb-4&rdquo; />
        <Skeleton className=&ldquo;h-4 w-1/2 mb-8&rdquo; />
        <Skeleton className=&ldquo;h-64 w-full mb-8&rdquo; />
        <div className=&ldquo;space-y-4&rdquo;>
          <Skeleton className=&ldquo;h-4 w-full&rdquo; />
          <Skeleton className=&ldquo;h-4 w-full&rdquo; />
          <Skeleton className=&ldquo;h-4 w-3/4&rdquo; />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className=&ldquo;container mx-auto px-4 py-8 text-center&rdquo;>
        <h2 className=&ldquo;text-2xl font-bold text-red-600 mb-4&rdquo;>Error</h2>
        <p className=&ldquo;text-gray-600&rdquo;>{error}</p>
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
      className=&ldquo;container mx-auto px-4 py-8 max-w-4xl&rdquo;
    >
      {/* Header */}
      <div className=&ldquo;mb-8&rdquo;>
        <h1 className=&ldquo;text-3xl font-bold mb-4&rdquo;>{news.title}</h1>
        <div className=&ldquo;flex items-center gap-4 mb-6&rdquo;>
          <div className=&ldquo;flex items-center&rdquo;>
            <Image
              src={news.authorLogo}
              alt={news.authorName}
              width={32}
              height={32}
              className=&ldquo;rounded-full&rdquo;
            />
            <span className=&ldquo;ml-2 text-sm text-gray-600&rdquo;>
              {news.authorName}
            </span>
          </div>
          <span className=&ldquo;text-sm text-gray-500&rdquo;>
            {new Date(news.publishedAt).toLocaleDateString()}
          </span>
          <span className=&ldquo;text-sm text-gray-500&rdquo;>
            {news.readTime} min read
          </span>
        </div>
      </div>

      {/* Featured Image */}
      <div className=&ldquo;relative h-[400px] mb-8 rounded-xl overflow-hidden&rdquo;>
        <Image
          src={news.imageUrl}
          alt={news.title}
          fill
          className=&ldquo;object-cover&rdquo;
        />
      </div>

      {/* Content */}
      <Card className=&ldquo;p-8 mb-8&rdquo;>
        <div
          className=&ldquo;prose max-w-none&rdquo;
          dangerouslySetInnerHTML={{ __html: news.content }}
        />
      </Card>

      {/* Engagement Metrics */}
      <div className=&ldquo;flex justify-between items-center border-t pt-6&rdquo;>
        <div className=&ldquo;flex gap-6&rdquo;>
          <Button variant=&ldquo;ghost&rdquo; className=&ldquo;flex items-center gap-2&rdquo;>
            <ThumbsUp className=&ldquo;w-4 h-4&rdquo; />
            <span>{news.likeCount}</span>
          </Button>
          <Button variant=&ldquo;ghost&rdquo; className=&ldquo;flex items-center gap-2&rdquo;>
            <MessageCircle className=&ldquo;w-4 h-4&rdquo; />
            <span>{news.commentCount}</span>
          </Button>
          <Button variant=&ldquo;ghost&rdquo; className=&ldquo;flex items-center gap-2&rdquo;>
            <Share2 className=&ldquo;w-4 h-4&rdquo; />
            <span>{news.shareCount}</span>
          </Button>
          <div className=&ldquo;flex items-center gap-2 text-gray-500&rdquo;>
            <Eye className=&ldquo;w-4 h-4&rdquo; />
            <span>{news.viewCount} views</span>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div className=&ldquo;mt-6 flex flex-wrap gap-2&rdquo;>
        {news.tags.map((tag) => (
          <span
            key={tag}
            className=&ldquo;px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600&rdquo;
          >
            {tag}
          </span>
        ))}
      </div>
    </motion.div>
  );
}
