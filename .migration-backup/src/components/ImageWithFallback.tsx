import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Smartphone, ImageOff } from 'lucide-react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string | null;
  alt: string;
  fallbackIcon?: 'phone' | 'image';
  thumbnail?: boolean;
  width?: number;
  quality?: number;
}

/**
 * Image component with lazy loading, fallback, and thumbnail support
 * Optimizes images for grid views by using smaller dimensions
 */
export function ImageWithFallback({
  src,
  alt,
  fallbackIcon = 'phone',
  thumbnail = false,
  width = 400,
  quality = 75,
  className,
  ...props
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Reset error state when src changes
  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  // Process image URL for optimization
  const getOptimizedUrl = (url: string | null | undefined): string | null => {
    if (!url) return null;

    // For Unsplash images, add quality and width params
    if (url.includes('unsplash.com')) {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}w=${thumbnail ? 200 : width}&q=${quality}&auto=format`;
    }

    // For Supabase storage, you can add transformation params here
    // if (url.includes('supabase.co')) { ... }

    return url;
  };

  const optimizedSrc = getOptimizedUrl(src);

  // Render fallback
  if (!optimizedSrc || hasError) {
    return (
      <div
        className={cn(
          'bg-gray-100 flex items-center justify-center',
          className
        )}
        {...props}
      >
        {fallbackIcon === 'phone' ? (
          <Smartphone className="w-12 h-12 text-gray-300" />
        ) : (
          <ImageOff className="w-12 h-12 text-gray-300" />
        )}
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Skeleton placeholder while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      <img
        ref={imgRef}
        src={optimizedSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setHasError(true)}
        onLoad={() => setIsLoaded(true)}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0',
          'w-full h-full object-cover'
        )}
        {...props}
      />
    </div>
  );
}

export default ImageWithFallback;
