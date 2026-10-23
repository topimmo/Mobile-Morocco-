import { useState, useCallback, memo } from 'react';
import { cn } from '@/lib/utils';
import { ImageOff } from 'lucide-react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  fallbackSrc?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
  onError?: () => void;
}

// Supabase storage URL transformer for optimized images
function getOptimizedUrl(src: string, width?: number, quality: number = 75): string {
  // If it's a Supabase storage URL, add transformation params
  if (src.includes('supabase.co/storage')) {
    const url = new URL(src);
    if (width) {
      url.searchParams.set('width', width.toString());
    }
    url.searchParams.set('quality', quality.toString());
    return url.toString();
  }
  
  // For Unsplash URLs, use their optimization params
  if (src.includes('unsplash.com')) {
    const separator = src.includes('?') ? '&' : '?';
    return `${src}${separator}w=${width || 800}&q=${quality}`;
  }
  
  return src;
}

// Placeholder for loading state
const PLACEHOLDER_BLUR = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PC9zdmc+';

// Default fallback image
const DEFAULT_FALLBACK = 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=60';

export const OptimizedImage = memo(function OptimizedImage({
  src,
  alt,
  className,
  width,
  height,
  quality = 75,
  priority = false,
  fallbackSrc = DEFAULT_FALLBACK,
  objectFit = 'cover',
  onLoad,
  onError,
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(!priority);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  const optimizedSrc = getOptimizedUrl(currentSrc, width, quality);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    } else {
      setHasError(true);
    }
    onError?.();
  }, [currentSrc, fallbackSrc, onError]);

  if (hasError) {
    return (
      <div
        className={cn(
          'flex items-center justify-center bg-gray-100',
          className
        )}
        style={{ width, height }}
      >
        <div className="flex flex-col items-center gap-2 text-gray-400">
          <ImageOff className="h-8 w-8" />
          <span className="text-xs">Image non disponible</span>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {isLoading && (
        <div
          className="absolute inset-0 animate-pulse bg-gray-200"
          style={{
            backgroundImage: `url(${PLACEHOLDER_BLUR})`,
            backgroundSize: 'cover',
          }}
        />
      )}
      <img
        src={optimizedSrc}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'transition-opacity duration-300',
          isLoading ? 'opacity-0' : 'opacity-100',
          objectFit === 'cover' && 'object-cover',
          objectFit === 'contain' && 'object-contain',
          objectFit === 'fill' && 'object-fill',
          objectFit === 'none' && 'object-none',
          objectFit === 'scale-down' && 'object-scale-down',
          'w-full h-full'
        )}
      />
    </div>
  );
});

export default OptimizedImage;
