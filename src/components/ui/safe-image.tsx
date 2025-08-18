"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";
import { getSafeImageUrl } from "@/lib/utils/image-utils";

interface SafeImageProps extends Omit<ImageProps, "src"> {
  src: string | null | undefined;
  fallback?: string;
  alt: string;
}

export const SafeImage = ({ 
  src, 
  fallback = "/images/default-placeholder.jpg", 
  alt, 
  onError,
  ...props 
}: SafeImageProps) => {
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(getSafeImageUrl(src, fallback));

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError) {
      setHasError(true);
      setCurrentSrc(fallback);
    }
    
    if (onError) {
      onError(e);
    }
  };

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={handleError}
    />
  );
};
