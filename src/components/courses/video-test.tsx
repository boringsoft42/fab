"use client";

import { VideoPreview } from "./video-preview";

export const VideoTest = () => {
  const testVideoUrl = "https://www.youtube.com/watch?v=yEIKwtVRKuQ";
  
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Prueba de Video Preview</h2>
      <div className="relative w-96 h-64 bg-gray-200 rounded-lg overflow-hidden">
        <img 
          src="https://img.youtube.com/vi/yEIKwtVRKuQ/maxresdefault.jpg" 
          alt="Test thumbnail"
          className="w-full h-full object-cover"
        />
        <VideoPreview 
          videoUrl={testVideoUrl}
          title="Video de prueba"
          className="absolute inset-0 opacity-100"
        />
      </div>
      <p className="mt-4 text-sm text-gray-600">
        URL del video: {testVideoUrl}
      </p>
    </div>
  );
};
