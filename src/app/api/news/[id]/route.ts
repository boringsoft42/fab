import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const news = await prisma.news.findUnique({
      where: {
        id: params.id,
      },
      include: {
        author: {
          select: {
            name: true,
            logo: true,
            type: true,
          },
        },
        tags: true,
        metrics: true,
      },
    });

    if (!news) {
      return new NextResponse("News not found", { status: 404 });
    }

    // Increment view count
    await prisma.newsMetrics.update({
      where: {
        newsId: params.id,
      },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });

    return NextResponse.json({
      id: news.id,
      title: news.title,
      summary: news.summary,
      content: news.content,
      imageUrl: news.imageUrl,
      authorName: news.author.name,
      authorType: news.author.type,
      authorLogo: news.author.logo,
      priority: news.priority,
      category: news.category,
      publishedAt: news.publishedAt,
      viewCount: news.metrics.viewCount,
      likeCount: news.metrics.likeCount,
      commentCount: news.metrics.commentCount,
      shareCount: news.metrics.shareCount,
      tags: news.tags.map((tag) => tag.name),
      featured: news.featured,
      readTime: news.readTime,
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 