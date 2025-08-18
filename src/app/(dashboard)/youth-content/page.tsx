"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Link, Settings } from "lucide-react";
import { useNewsArticles } from "@/hooks/useNewsArticleApi";
import { useResources } from "@/hooks/useResourceApi";

export default function YouthContentPage() {
  const [activeTab, setActiveTab] = useState("content");
  const { data: newsArticles, loading: newsLoading, error: newsError } = useNewsArticles();
  const { data: resources, loading: resourcesLoading, error: resourcesError } = useResources();

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Youth Content Management</h1>
        <Button>
          <FileText className="w-4 h-4 mr-2" />
          Create New Content
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Enter content title" />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Enter content description"
                  />
                </div>
                <div>
                  <Label htmlFor="link">External Link</Label>
                  <div className="flex gap-2">
                    <Input id="link" placeholder="Enter external link" />
                    <Button variant="outline" size="icon">
                      <Link className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="visibility">Visibility Settings</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Button variant="outline" size="sm">
                      Public
                    </Button>
                    <Button variant="outline" size="sm">
                      Private
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Advanced Settings</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <Settings className="w-4 h-4" />
                    <span>Configure additional settings</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
