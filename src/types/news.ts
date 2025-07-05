export type NewsType = "COMPANY" | "GOVERNMENT" | "NGO";
export type NewsStatus = "PUBLISHED" | "DRAFT" | "ARCHIVED";
export type NewsPriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

export interface NewsArticle {
  id: string;
  title: string;
  content: string;
  summary: string;
  imageUrl?: string;
  videoUrl?: string;
  authorId: string;
  authorName: string;
  authorType: NewsType;
  authorLogo?: string;
  status: NewsStatus;
  priority: NewsPriority;
  featured: boolean;
  tags: string[];
  category: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  expiresAt?: string;
  targetAudience: string[]; // ["YOUTH", "COMPANIES", "ALL"]
  region?: string;
  relatedLinks?: Array<{
    title: string;
    url: string;
  }>;
}

export interface NewsComment {
  id: string;
  newsId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  createdAt: string;
  replies?: NewsComment[];
}

export interface NewsFilters {
  type?: NewsType[];
  category?: string[];
  priority?: NewsPriority[];
  featured?: boolean;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
  targetAudience?: string[];
  region?: string;
  search?: string;
}

export interface NewsStats {
  total: number;
  published: number;
  draft: number;
  byType: {
    company: number;
    government: number;
    ngo: number;
  };
  byPriority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
  totalViews: number;
  totalLikes: number;
  totalComments: number;
}
