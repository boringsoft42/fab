"use client";

import { VideoPreview } from "./video-preview";

export const SimpleVideoTest = () => {
  const testVideoUrl = "https://www.youtube.com/watch?v=yEIKwtVRKuQ";
  
  return (
    <div className="p-8 bg-gray-100 rounded-lg">
      <h3 className="text-lg font-bold mb-4">Prueba Simple de Video</h3>
      <div className="relative w-80 h-48 bg-gray-300 rounded-lg overflow-hidden">
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
      <p className="mt-2 text-sm text-gray-600">
        Click en el botón de play para abrir el video
      </p>
    </div>
  );
};
