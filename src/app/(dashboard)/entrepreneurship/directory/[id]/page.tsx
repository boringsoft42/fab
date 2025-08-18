"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Calendar,
  User,
  ArrowLeft,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

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

interface DirectoryProfile {
  id: string;
  name: string;
  description: string;
  logo: string;
  coverImage: string;
  industry: string;
  location: string;
  website: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  stats: {
    followers: number;
    posts: number;
    likes: number;
  };
  servicesOffered: string[];
  focusAreas: string[];
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
}

// TODO: Integrar hooks reales para perfil y posts (useProfile, usePosts) cuando estén disponibles
// Reemplazar fetchProfileData, mockProfile y mockPosts por datos reales de la API
const mockPosts: Post[] = [
  {
    id: "post-1",
    title: "Introducing Our New Product Line",
    content: "We're excited to announce...",
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
  },
  // ... more mock posts
];

const mockProfile: DirectoryProfile = {
  id: "1",
  name: "TechCorp Solutions",
  description: "Leading technology solutions provider",
  logo: "/logos/techcorp.svg",
  coverImage: "/images/cover.jpg",
  industry: "Technology",
  location: "San Francisco, CA",
  website: "https://techcorp.com",
  socialLinks: {
    linkedin: "https://linkedin.com/techcorp",
    twitter: "https://twitter.com/techcorp",
    facebook: "https://facebook.com/techcorp",
  },
  stats: {
    followers: 1500,
    posts: 45,
    likes: 2300,
  },
  servicesOffered: [
    "Product Development",
    "Cloud Solutions",
    "Digital Transformation",
  ],
  focusAreas: ["Technology", "Innovation", "Enterprise Solutions"],
  contactPerson: "John Smith",
  email: "contact@techcorp.com",
  phone: "+1 (555) 123-4567",
  address: "123 Tech Street, San Francisco, CA",
};

export default function DirectoryProfilePage() {
  const [activeTab, setActiveTab] = useState("about");
  const params = useParams();
  const [profile, setProfile] = useState<DirectoryProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfileData = useCallback(async () => {
    try {
      setLoading(true);
      // In a real app, we would fetch this data from an API
      setProfile({ ...mockProfile, id: params.id as string });
      setPosts(mockPosts);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const renderAuthor = (author: { name: string; avatar: string }) => (
    <div className="flex items-center gap-2">
      <Image
        src={author.avatar}
        alt={author.name}
        width={32}
        height={32}
        className="rounded-full"
      />
      <span className="text-sm font-medium">{author.name}</span>
    </div>
  );

  if (loading || !profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Image
              src={profile.logo}
              alt={profile.name}
              width={80}
              height={80}
              className="rounded-lg"
            />
            <div>
              <h2 className="text-2xl font-bold">{profile.name}</h2>
              <p className="text-gray-600">{profile.description}</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-3">Services Offered</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {profile.servicesOffered.map((service, index) => (
                  <li key={index}>{service}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Focus Areas</h3>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {profile.focusAreas.map((area, index) => (
                  <li key={index}>{area}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {profile.email && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Email:</span>
                <a
                  href={`mailto:${profile.email}`}
                  className="text-blue-600 hover:underline"
                >
                  {profile.email}
                </a>
              </div>
            )}
            {profile.phone && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Phone:</span>
                <a
                  href={`tel:${profile.phone}`}
                  className="text-blue-600 hover:underline"
                >
                  {profile.phone}
                </a>
              </div>
            )}
            {profile.address && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Address:</span>
                <span>{profile.address}</span>
              </div>
            )}
            {profile.contactPerson && (
              <div className="flex items-center gap-2">
                <span className="font-medium">Contact Person:</span>
                <span>{profile.contactPerson}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-4">
              {post.image && (
                <div className="relative h-48">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              )}
              <h3 className="mt-4 text-xl font-semibold">{post.title}</h3>
              <p className="mt-2 text-gray-600">{post.content}</p>
              <div className="mt-4 flex items-center justify-between">
                {renderAuthor(post.author)}
                <div className="flex items-center gap-4">
                  <span>{post.likes} likes</span>
                  <span>{post.comments} comments</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
