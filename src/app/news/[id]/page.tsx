"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { Share2, ThumbsUp, MessageCircle, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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
          throw new Error("Failed to fetch news details");
        }
        const data = await response.json();
        setNews(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id]);

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
        <p className="text-gray-600">{error}</p>
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
            <Image
              src={news.authorLogo}
              alt={news.authorName}
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="ml-2 text-sm text-gray-600">
              {news.authorName}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {new Date(news.publishedAt).toLocaleDateString()}
          </span>
          <span className="text-sm text-gray-500">
            {news.readTime} min read
          </span>
        </div>
      </div>

      {/* Featured Image */}
      <div className="relative h-[400px] mb-8 rounded-xl overflow-hidden">
        <Image
          src={news.imageUrl}
          alt={news.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Content */}
      <Card className="p-8 mb-8">
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: news.content }}
        />
      </Card>

      {/* Engagement Metrics */}
      <div className="flex justify-between items-center border-t pt-6">
        <div className="flex gap-6">
          <Button variant="ghost" className="flex items-center gap-2">
            <ThumbsUp className="w-4 h-4" />
            <span>{news.likeCount}</span>
          </Button>
          <Button variant="ghost" className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            <span>{news.commentCount}</span>
          </Button>
          <Button variant="ghost" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            <span>{news.shareCount}</span>
          </Button>
          <div className="flex items-center gap-2 text-gray-500">
            <Eye className="w-4 h-4" />
            <span>{news.viewCount} views</span>
          </div>
        </div>
      </div>

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
