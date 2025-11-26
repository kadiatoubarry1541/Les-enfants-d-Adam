import { useState, useEffect, ImgHTMLAttributes } from "react";
import { SkeletonLoader } from "./SkeletonLoader";

interface LazyImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  placeholder?: "skeleton" | "blur";
}

export function LazyImage({
  src,
  alt,
  fallback = "/placeholder-image.png",
  placeholder = "skeleton",
  className = "",
  ...props
}: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
    setImageSrc(src);

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setIsLoading(false);
    };

    img.onerror = () => {
      setIsLoading(false);
      setHasError(true);
      setImageSrc(fallback);
    };
  }, [src, fallback]);

  if (isLoading && placeholder === "skeleton") {
    return (
      <SkeletonLoader variant="rectangular" className={`w-full h-full ${className}`} />
    );
  }

  return (
    <img
      src={hasError ? fallback : imageSrc}
      alt={alt}
      className={`transition-opacity duration-300 ${
        isLoading ? "opacity-0" : "opacity-100"
      } ${className}`}
      loading="lazy"
      {...props}
    />
  );
}

