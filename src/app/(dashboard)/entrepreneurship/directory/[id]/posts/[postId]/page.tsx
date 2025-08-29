"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  likes: number;
  comments: number;
  image?: string;
  date?: string;
  category?: string;
}

export default function PostDetailPage() {
  const params = useParams();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  // TODO: Integrar hook real para post (usePost) cuando esté disponible
  // Reemplazar fetchPost y mockPost por datos reales de la API
  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      // Mock data for demonstration
      const mockPost: Post = {
        id: params.postId as string,
        title: "Introducing Our New Product Line",
        content:
          "We're excited to announce our latest product line that revolutionizes the way businesses handle their operations. This innovative solution combines cutting-edge technology with user-friendly interfaces to deliver unparalleled value to our customers.",
        author: {
          name: "John Smith",
          avatar: "/avatars/john.jpg",
        },
        createdAt: "2024-03-01",
        likes: 45,
        comments: 12,
        image: "/images/product-line.jpg",
        date: "2024-03-01",
        category: "Product Launch",
      };
      setPost(mockPost);
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  }, [params.postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  if (loading || !post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link href={`/entrepreneurship/directory/${params.id as string}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-6">
          {post.image && (
            <div className="relative h-[400px] mb-6">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="rounded-lg object-cover"
              />
            </div>
          )}
          <div className="flex items-center gap-4 mb-6">
            <Image
              src={post.author.avatar}
              alt={post.author.name}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <h3 className="font-medium">{post.author.name}</h3>
              <p className="text-sm text-gray-600">
                {new Date(post.date || post.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">
            {post.content}
          </p>
          <div className="mt-6 flex items-center gap-4 text-gray-600">
            <span>{post.likes} likes</span>
            <span>{post.comments} comments</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
