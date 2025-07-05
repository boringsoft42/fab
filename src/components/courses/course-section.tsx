"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Video,
  Link as LinkIcon,
  Image as ImageIcon,
  Download,
  Clock,
  CheckCircle,
  PlayCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Quiz } from "./quiz";
import type {
  CourseSection as CourseSectionType,
  CourseResource,
  Quiz as QuizType,
} from "@/types/courses";

interface CourseSectionProps {
  section: CourseSectionType;
  isActive: boolean;
  onComplete: () => void;
}

export function CourseSection({
  section,
  isActive,
  onComplete,
}: CourseSectionProps) {
  const [activeTab, setActiveTab] = useState<"content" | "resources" | "quiz">(
    "content"
  );
  const [videoProgress, setVideoProgress] = useState(0);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FileText className="w-4 h-4" />;
      case "VIDEO":
        return <Video className="w-4 h-4" />;
      case "LINK":
        return <LinkIcon className="w-4 h-4" />;
      case "IMAGE":
        return <ImageIcon className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const handleResourceClick = (resource: CourseResource) => {
    if (resource.type === "PDF" || resource.type === "IMAGE") {
      window.open(resource.url, "_blank");
    } else if (resource.type === "LINK") {
      window.open(resource.url, "_blank");
    }
  };

  return (
    <Card className={`p-6 ${!isActive && "opacity-60"}`}>
      <div className="space-y-6">
        {/* Section Header */}
        <div>
          <h3 className="text-xl font-semibold mb-2">{section.title}</h3>
          <p className="text-gray-600">{section.description}</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-2 border-b">
          <Button
            variant={activeTab === "content" ? "default" : "ghost"}
            onClick={() => setActiveTab("content")}
          >
            <PlayCircle className="w-4 h-4 mr-2" />
            Contenido
          </Button>
          <Button
            variant={activeTab === "resources" ? "default" : "ghost"}
            onClick={() => setActiveTab("resources")}
          >
            <FileText className="w-4 h-4 mr-2" />
            Recursos ({section.resources.length})
          </Button>
          {section.quiz && (
            <Button
              variant={activeTab === "quiz" ? "default" : "ghost"}
              onClick={() => setActiveTab("quiz")}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Quiz
            </Button>
          )}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "content" && (
              <div className="space-y-4">
                {section.videoUrl && (
                  <div className="space-y-2">
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                      <iframe
                        src={section.videoUrl}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <Progress value={videoProgress} className="h-1" />
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Progress: {videoProgress}%</span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {section.videoDuration}
                      </span>
                    </div>
                  </div>
                )}
                {section.content && (
                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                )}
              </div>
            )}

            {activeTab === "resources" && (
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-2">
                  {section.resources.map((resource) => (
                    <div
                      key={resource.id}
                      className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleResourceClick(resource)}
                    >
                      <div className="flex items-center space-x-3">
                        {getResourceIcon(resource.type)}
                        <div>
                          <p className="font-medium">{resource.title}</p>
                          {resource.description && (
                            <p className="text-sm text-gray-500">
                              {resource.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 text-sm text-gray-500">
                        {resource.fileSize && <span>{resource.fileSize}</span>}
                        {resource.duration && (
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {resource.duration}
                          </span>
                        )}
                        <Download className="w-4 h-4" />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

            {activeTab === "quiz" && section.quiz && (
              <Quiz
                quiz={section.quiz}
                onComplete={(score) => {
                  if (score >= section.quiz!.passingScore) {
                    onComplete();
                  }
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </Card>
  );
}
