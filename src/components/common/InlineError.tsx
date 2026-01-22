import React from 'react';
import { AlertCircle, RefreshCw, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface InlineErrorProps {
  title?: string;
  titleAr?: string;
  message?: string;
  messageAr?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  variant?: 'default' | 'destructive';
  className?: string;
}

/**
 * Inline error component for showing errors within a section of a page
 * without replacing the entire page content
 */
export function InlineError({
  title = 'Erreur de chargement',
  titleAr = 'خطأ في التحميل',
  message = 'Une erreur s\'est produite. Veuillez réessayer.',
  messageAr = 'حدث خطأ. يرجى المحاولة مرة أخرى.',
  onRetry,
  isRetrying = false,
  variant = 'destructive',
  className = '',
}: InlineErrorProps) {
  return (
    <Alert variant={variant} className={`${className}`}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{titleAr} / {title}</AlertTitle>
      <AlertDescription className="flex flex-col gap-3">
        <span className="text-sm">
          {messageAr}
          <br />
          {message}
        </span>
        {onRetry && (
          <Button
            onClick={onRetry}
            disabled={isRetrying}
            variant="outline"
            size="sm"
            className="w-fit"
          >
            <RefreshCw className={`w-3 h-3 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
            {isRetrying ? 'جاري...' : 'إعادة المحاولة'}
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}

interface NetworkErrorBannerProps {
  isOffline?: boolean;
  className?: string;
}

/**
 * Banner component for showing network connectivity issues
 */
export function NetworkErrorBanner({ 
  isOffline = false, 
  className = '' 
}: NetworkErrorBannerProps) {
  if (!isOffline) return null;

  return (
    <div className={`bg-yellow-50 border-l-4 border-yellow-400 p-4 ${className}`}>
      <div className="flex items-center">
        <WifiOff className="h-5 w-5 text-yellow-400 mr-3" />
        <div>
          <p className="text-sm text-yellow-700">
            <span className="font-medium">غير متصل بالإنترنت</span> - 
            يتم عرض البيانات المخزنة مؤقتاً
          </p>
          <p className="text-sm text-yellow-700">
            <span className="font-medium">Hors ligne</span> - 
            Les données en cache sont affichées
          </p>
        </div>
      </div>
    </div>
  );
}

interface SectionLoaderProps {
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  onRetry?: () => void;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
}

/**
 * Wrapper component that handles loading, error, and success states
 * for a section of the page
 */
export function SectionLoader({
  isLoading,
  isError,
  error,
  onRetry,
  children,
  fallback,
  loadingFallback,
}: SectionLoaderProps) {
  if (isLoading) {
    return (
      <>
        {loadingFallback || (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          </div>
        )}
      </>
    );
  }

  if (isError) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <InlineError
        message={error?.message}
        onRetry={onRetry}
        className="my-4"
      />
    );
  }

  return <>{children}</>;
}

export default InlineError;
