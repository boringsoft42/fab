"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Filter, Download, ExternalLink } from "lucide-react";

interface Resource {
  id: string;
  title: string;
  description: string;
  type: "guide" | "template" | "tool" | "course";
  category: string;
  format: string;
  downloadUrl?: string;
  externalUrl?: string;
  thumbnail: string;
  author: string;
  publishedDate: string;
  downloads: number;
  rating: number;
  tags: string[];
}

interface ResourceFilter {
  type: string;
  category: string;
  format: string;
}

const mockResources: Resource[] = [
  {
    id: "1",
    title: "Business Plan Template",
    description:
      "A comprehensive business plan template with financial projections.",
    type: "template",
    category: "Planning",
    format: "PDF",
    downloadUrl: "/resources/business-plan-template.pdf",
    thumbnail: "/images/resources/business-plan.jpg",
    author: "Business Development Team",
    publishedDate: "2024-02-15",
    downloads: 1250,
    rating: 4.8,
    tags: ["Business Plan", "Finance", "Strategy"],
  },
  {
    id: "2",
    title: "Marketing Strategy Guide",
    description:
      "Learn how to create an effective marketing strategy for your startup.",
    type: "guide",
    category: "Marketing",
    format: "PDF",
    downloadUrl: "/resources/marketing-guide.pdf",
    thumbnail: "/images/resources/marketing.jpg",
    author: "Marketing Experts",
    publishedDate: "2024-02-10",
    downloads: 980,
    rating: 4.6,
    tags: ["Marketing", "Strategy", "Growth"],
  },
  // ... more mock resources
];

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [filters, setFilters] = useState<ResourceFilter>({
    type: "",
    category: "",
    format: "",
  });

  const fetchResources = useCallback(async () => {
    try {
      setLoading(true);
      // In a real app, we would fetch this data from an API
      setResources(mockResources);
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleDownload = async (resource: Resource) => {
    // In a real app, we would handle the download process
    console.log(`Downloading resource: ${resource.title}`);
  };

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesFilters =
      (!filters.type || resource.type === filters.type) &&
      (!filters.category || resource.category === filters.category) &&
      (!filters.format || resource.format === filters.format);

    const matchesTab =
      activeTab === "all" ||
      (activeTab === "guides" && resource.type === "guide") ||
      (activeTab === "templates" && resource.type === "template") ||
      (activeTab === "tools" && resource.type === "tool") ||
      (activeTab === "courses" && resource.type === "course");

    return matchesSearch && matchesFilters && matchesTab;
  });

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <div>
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              value={filters.type}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, type: e.target.value }))
              }
              className="w-full p-2 border rounded"
            >
              <option value="">All Types</option>
              <option value="guide">Guides</option>
              <option value="template">Templates</option>
              <option value="tool">Tools</option>
              <option value="course">Courses</option>
            </select>
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              value={filters.category}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full p-2 border rounded"
            >
              <option value="">All Categories</option>
              <option value="Planning">Planning</option>
              <option value="Marketing">Marketing</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
            </select>
          </div>
          <div>
            <Label htmlFor="format">Format</Label>
            <select
              id="format"
              value={filters.format}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, format: e.target.value }))
              }
              className="w-full p-2 border rounded"
            >
              <option value="">All Formats</option>
              <option value="PDF">PDF</option>
              <option value="DOCX">DOCX</option>
              <option value="XLSX">XLSX</option>
              <option value="Video">Video</option>
            </select>
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="guides">Guides</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource) => (
              <Card key={resource.id}>
                <CardContent className="p-6">
                  <div className="relative h-48 mb-4">
                    <Image
                      src={resource.thumbnail}
                      alt={resource.title}
                      fill
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {resource.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm text-gray-600">
                      {resource.downloads} downloads
                    </div>
                    <div className="text-sm text-gray-600">
                      Rating: {resource.rating}/5
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {resource.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-gray-600">
                      {resource.format} • {resource.category}
                    </div>
                    {resource.downloadUrl ? (
                      <Button
                        variant="outline"
                        onClick={() => handleDownload(resource)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    ) : resource.externalUrl ? (
                      <Button
                        variant="outline"
                        onClick={() =>
                          window.open(resource.externalUrl, "_blank")
                        }
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit
                      </Button>
                    ) : null}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
