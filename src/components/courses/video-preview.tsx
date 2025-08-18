"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Play, X } from "lucide-react";
import { isYouTubeVideo } from "@/lib/utils/image-utils";

interface VideoPreviewProps {
  videoUrl: string | null;
  title: string;
  className?: string;
}

export const VideoPreview = ({ videoUrl, title, className = "" }: VideoPreviewProps) => {
  const [isOpen, setIsOpen] = useState(false);

  console.log("VideoPreview render:", { videoUrl, isYouTube: isYouTubeVideo(videoUrl), className });

  if (!videoUrl || !isYouTubeVideo(videoUrl)) {
    console.log("VideoPreview: No se renderiza porque:", { videoUrl, isYouTube: isYouTubeVideo(videoUrl) });
    return null;
  }

  const getYouTubeEmbedUrl = (url: string): string => {
    const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  };

  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  return (
    <>
             <div
         className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 hover:bg-opacity-60 transition-all duration-200 cursor-pointer ${className}`}
         onClick={() => setIsOpen(true)}
         style={{ zIndex: 10 }}
       >
         <div className="bg-white bg-opacity-30 rounded-full p-4 backdrop-blur-sm border-2 border-white border-opacity-50 shadow-lg">
           <Play className="h-12 w-12 text-white fill-current" />
         </div>
       </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl w-[90vw] h-[80vh] p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="flex items-center justify-between">
              <span>{title}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 p-4">
            {embedUrl ? (
              <iframe
                src={embedUrl}
                title={title}
                className="w-full h-full rounded-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No se pudo cargar el video
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
