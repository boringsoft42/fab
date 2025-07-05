&ldquo;use client&rdquo;;

import { useState } from &ldquo;react&rdquo;;
import { ChevronLeft, ChevronRight } from &ldquo;lucide-react&rdquo;;
import { Button } from &ldquo;@/components/ui/button&rdquo;;

interface CompanyGalleryProps {
  images: string[];
}

export function CompanyGallery({ images }: CompanyGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (!images.length) {
    return null;
  }

  return (
    <div className=&ldquo;relative w-full h-64 rounded-xl overflow-hidden bg-gray-100 shadow-sm&rdquo;>
      <img
        src={images[currentIndex]}
        alt={`Company image ${currentIndex + 1}`}
        className=&ldquo;w-full h-full object-cover transition-opacity duration-300&rdquo;
      />
      {images.length > 1 && (
        <>
          <Button
            variant=&ldquo;ghost&rdquo;
            size=&ldquo;icon&rdquo;
            className=&ldquo;absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-sm rounded-full&rdquo;
            onClick={previousImage}
          >
            <ChevronLeft className=&ldquo;h-4 w-4&rdquo; />
          </Button>
          <Button
            variant=&ldquo;ghost&rdquo;
            size=&ldquo;icon&rdquo;
            className=&ldquo;absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white shadow-sm rounded-full&rdquo;
            onClick={nextImage}
          >
            <ChevronRight className=&ldquo;h-4 w-4&rdquo; />
          </Button>
          <div className=&ldquo;absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 px-2 py-1 bg-black/20 backdrop-blur-sm rounded-full&rdquo;>
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? &ldquo;bg-white scale-110&rdquo;
                    : &ldquo;bg-white/50 hover:bg-white/70&rdquo;
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
