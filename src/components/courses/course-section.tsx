&ldquo;use client&rdquo;;

import { useState } from &ldquo;react&rdquo;;
import { motion, AnimatePresence } from &ldquo;framer-motion&rdquo;;
import {
  FileText,
  Video,
  Link as LinkIcon,
  Image as ImageIcon,
  Download,
  Clock,
  CheckCircle,
  PlayCircle,
} from &ldquo;lucide-react&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;
import { Card } from &ldquo;@/components/ui/card&rdquo;;
import { Badge } from &ldquo;@/components/ui/badge&rdquo;;
import { Progress } from &ldquo;@/components/ui/progress&rdquo;;
import { Separator } from &ldquo;@/components/ui/separator&rdquo;;
import { ScrollArea } from &ldquo;@/components/ui/scroll-area&rdquo;;
import { Quiz } from &ldquo;./quiz&rdquo;;
import type {
  CourseSection as CourseSectionType,
  CourseResource,
  Quiz as QuizType,
} from &ldquo;@/types/courses&rdquo;;

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
  const [activeTab, setActiveTab] = useState<&ldquo;content&rdquo; | &ldquo;resources&rdquo; | &ldquo;quiz&rdquo;>(
    &ldquo;content&rdquo;
  );
  const [videoProgress, setVideoProgress] = useState(0);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case &ldquo;PDF&rdquo;:
        return <FileText className=&ldquo;w-4 h-4&rdquo; />;
      case &ldquo;VIDEO&rdquo;:
        return <Video className=&ldquo;w-4 h-4&rdquo; />;
      case &ldquo;LINK&rdquo;:
        return <LinkIcon className=&ldquo;w-4 h-4&rdquo; />;
      case &ldquo;IMAGE&rdquo;:
        return <ImageIcon className=&ldquo;w-4 h-4&rdquo; />;
      default:
        return <FileText className=&ldquo;w-4 h-4&rdquo; />;
    }
  };

  const handleResourceClick = (resource: CourseResource) => {
    if (resource.type === &ldquo;PDF&rdquo; || resource.type === &ldquo;IMAGE&rdquo;) {
      window.open(resource.url, &ldquo;_blank&rdquo;);
    } else if (resource.type === &ldquo;LINK&rdquo;) {
      window.open(resource.url, &ldquo;_blank&rdquo;);
    }
  };

  return (
    <Card className={`p-6 ${!isActive && &ldquo;opacity-60&rdquo;}`}>
      <div className=&ldquo;space-y-6&rdquo;>
        {/* Section Header */}
        <div>
          <h3 className=&ldquo;text-xl font-semibold mb-2&rdquo;>{section.title}</h3>
          <p className=&ldquo;text-gray-600&rdquo;>{section.description}</p>
        </div>

        {/* Tab Navigation */}
        <div className=&ldquo;flex space-x-2 border-b&rdquo;>
          <Button
            variant={activeTab === &ldquo;content&rdquo; ? &ldquo;default&rdquo; : &ldquo;ghost&rdquo;}
            onClick={() => setActiveTab(&ldquo;content&rdquo;)}
          >
            <PlayCircle className=&ldquo;w-4 h-4 mr-2&rdquo; />
            Contenido
          </Button>
          <Button
            variant={activeTab === &ldquo;resources&rdquo; ? &ldquo;default&rdquo; : &ldquo;ghost&rdquo;}
            onClick={() => setActiveTab(&ldquo;resources&rdquo;)}
          >
            <FileText className=&ldquo;w-4 h-4 mr-2&rdquo; />
            Recursos ({section.resources.length})
          </Button>
          {section.quiz && (
            <Button
              variant={activeTab === &ldquo;quiz&rdquo; ? &ldquo;default&rdquo; : &ldquo;ghost&rdquo;}
              onClick={() => setActiveTab(&ldquo;quiz&rdquo;)}
            >
              <CheckCircle className=&ldquo;w-4 h-4 mr-2&rdquo; />
              Quiz
            </Button>
          )}
        </div>

        {/* Content Area */}
        <AnimatePresence mode=&ldquo;wait&rdquo;>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === &ldquo;content&rdquo; && (
              <div className=&ldquo;space-y-4&rdquo;>
                {section.videoUrl && (
                  <div className=&ldquo;space-y-2&rdquo;>
                    <div className=&ldquo;relative aspect-video rounded-lg overflow-hidden bg-gray-100&rdquo;>
                      <iframe
                        src={section.videoUrl}
                        className=&ldquo;absolute inset-0 w-full h-full&rdquo;
                        allow=&ldquo;accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture&rdquo;
                        allowFullScreen
                      />
                    </div>
                    <Progress value={videoProgress} className=&ldquo;h-1&rdquo; />
                    <div className=&ldquo;flex justify-between text-sm text-gray-500&rdquo;>
                      <span>Progress: {videoProgress}%</span>
                      <span className=&ldquo;flex items-center&rdquo;>
                        <Clock className=&ldquo;w-4 h-4 mr-1&rdquo; />
                        {section.videoDuration}
                      </span>
                    </div>
                  </div>
                )}
                {section.content && (
                  <div
                    className=&ldquo;prose max-w-none&rdquo;
                    dangerouslySetInnerHTML={{ __html: section.content }}
                  />
                )}
              </div>
            )}

            {activeTab === &ldquo;resources&rdquo; && (
              <ScrollArea className=&ldquo;h-[400px] pr-4&rdquo;>
                <div className=&ldquo;space-y-2&rdquo;>
                  {section.resources.map((resource) => (
                    <div
                      key={resource.id}
                      className=&ldquo;flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 cursor-pointer&rdquo;
                      onClick={() => handleResourceClick(resource)}
                    >
                      <div className=&ldquo;flex items-center space-x-3&rdquo;>
                        {getResourceIcon(resource.type)}
                        <div>
                          <p className=&ldquo;font-medium&rdquo;>{resource.title}</p>
                          {resource.description && (
                            <p className=&ldquo;text-sm text-gray-500&rdquo;>
                              {resource.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className=&ldquo;flex items-center space-x-3 text-sm text-gray-500&rdquo;>
                        {resource.fileSize && <span>{resource.fileSize}</span>}
                        {resource.duration && (
                          <span className=&ldquo;flex items-center&rdquo;>
                            <Clock className=&ldquo;w-4 h-4 mr-1&rdquo; />
                            {resource.duration}
                          </span>
                        )}
                        <Download className=&ldquo;w-4 h-4&rdquo; />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

            {activeTab === &ldquo;quiz&rdquo; && section.quiz && (
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
