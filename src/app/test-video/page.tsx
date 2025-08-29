import { VideoTest } from "@/components/courses/video-test";
import { SimpleVideoTest } from "@/components/courses/simple-video-test";

export default function TestVideoPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Prueba de Video Preview</h1>
      
      <div className="grid gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Prueba Completa</h2>
          <VideoTest />
        </div>
        
        <div>
          <h2 className="text-2xl font-semibold mb-4">Prueba Simple</h2>
          <SimpleVideoTest />
        </div>
      </div>
    </div>
  );
}
