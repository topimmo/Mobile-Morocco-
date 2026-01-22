import React, { Component, ErrorInfo, ReactNode, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, RefreshCw, Home, WifiOff, ServerCrash, AlertCircle } from 'lucide-react';

// Error types for better categorization
export type ErrorType = 'network' | 'server' | 'auth' | 'notfound' | 'unknown';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  level?: 'global' | 'page' | 'component';
  showDetails?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorType: ErrorType;
}

// Utility to detect error type
function detectErrorType(error: Error | null): ErrorType {
  if (!error) return 'unknown';
  
  const message = error.message.toLowerCase();
  const name = error.name.toLowerCase();
  
  if (message.includes('network') || message.includes('fetch') || 
      message.includes('connection') || name.includes('network')) {
    return 'network';
  }
  
  if (message.includes('500') || message.includes('server') || 
      message.includes('internal')) {
    return 'server';
  }
  
  if (message.includes('401') || message.includes('403') || 
      message.includes('unauthorized') || message.includes('forbidden')) {
    return 'auth';
  }
  
  if (message.includes('404') || message.includes('not found')) {
    return 'notfound';
  }
  
  return 'unknown';
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorType: 'unknown',
  };

  public static getDerivedStateFromError(error: Error): State {
    return { 
      hasError: true, 
      error,
      errorType: detectErrorType(error)
    };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const level = this.props.level || 'component';
    console.error(`ErrorBoundary [${level}] caught an error:`, error, errorInfo);
    this.props.onError?.(error, errorInfo);
    
    // Could send to error tracking service here
    // logErrorToService(error, errorInfo, level);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorType: 'unknown' });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleRefreshPage = () => {
    window.location.reload();
  };

  private getErrorContent() {
    const { errorType, error } = this.state;
    const { showDetails, level } = this.props;
    
    const errorConfig = {
      network: {
        icon: WifiOff,
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        titleFr: 'Problème de connexion',
        titleAr: 'مشكلة في الاتصال',
        messageFr: 'Vérifiez votre connexion internet et réessayez.',
        messageAr: 'تحقق من اتصالك بالإنترنت وحاول مرة أخرى.',
      },
      server: {
        icon: ServerCrash,
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        titleFr: 'Erreur serveur',
        titleAr: 'خطأ في الخادم',
        messageFr: 'Nos serveurs rencontrent des difficultés. Veuillez réessayer plus tard.',
        messageAr: 'تواجه خوادمنا صعوبات. يرجى المحاولة لاحقاً.',
      },
      auth: {
        icon: AlertCircle,
        iconBg: 'bg-orange-100',
        iconColor: 'text-orange-600',
        titleFr: 'Session expirée',
        titleAr: 'انتهت الجلسة',
        messageFr: 'Veuillez vous reconnecter pour continuer.',
        messageAr: 'يرجى تسجيل الدخول مرة أخرى للمتابعة.',
      },
      notfound: {
        icon: AlertCircle,
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        titleFr: 'Page non trouvée',
        titleAr: 'الصفحة غير موجودة',
        messageFr: 'La page que vous recherchez n\'existe pas.',
        messageAr: 'الصفحة التي تبحث عنها غير موجودة.',
      },
      unknown: {
        icon: AlertTriangle,
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        titleFr: 'Une erreur s\'est produite',
        titleAr: 'حدث خطأ',
        messageFr: 'Désolé, une erreur inattendue s\'est produite. Veuillez réessayer.',
        messageAr: 'عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.',
      },
    };
    
    const config = errorConfig[errorType];
    const Icon = config.icon;
    
    return (
      <Card className="max-w-md w-full shadow-lg">
        <CardContent className="pt-6 text-center">
          <div className={`w-16 h-16 ${config.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <Icon className={`w-8 h-8 ${config.iconColor}`} />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            {config.titleAr} / {config.titleFr}
          </h2>
          <p className="text-gray-600 mb-4 text-sm">
            {config.messageAr}
            <br />
            {config.messageFr}
          </p>
          
          {showDetails && error && (
            <div className="bg-gray-100 rounded-md p-3 mb-4 text-left text-xs overflow-auto max-h-32">
              <code className="text-red-600">{error.message}</code>
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              onClick={this.handleReset}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              إعادة المحاولة / Réessayer
            </Button>
            
            {level === 'global' ? (
              <Button
                onClick={this.handleRefreshPage}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
              >
                <RefreshCw className="w-4 h-4" />
                تحديث الصفحة / Actualiser
              </Button>
            ) : (
              <Button
                onClick={this.handleGoHome}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
              >
                <Home className="w-4 h-4" />
                الصفحة الرئيسية / Accueil
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  public render() {
    const { level = 'component' } = this.props;
    
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const containerClass = level === 'global' 
        ? 'min-h-screen flex items-center justify-center p-4 bg-gray-50'
        : level === 'page'
        ? 'min-h-[60vh] flex items-center justify-center p-4'
        : 'min-h-[400px] flex items-center justify-center p-4';

      return (
        <div className={containerClass}>
          {this.getErrorContent()}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Page-level error boundary with automatic retry
export function PageErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary level="page" showDetails={false}>
      {children}
    </ErrorBoundary>
  );
}

// Global error boundary
export function GlobalErrorBoundary({ children }: { children: ReactNode }) {
  return (
    <ErrorBoundary level="global" showDetails={false}>
      {children}
    </ErrorBoundary>
  );
}

// Functional wrapper for easier use with hooks
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode,
  level?: 'global' | 'page' | 'component'
) {
  return function WithErrorBoundaryWrapper(props: P) {
    return (
      <ErrorBoundary fallback={fallback} level={level}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

// ============ BACKEND FAILURE FALLBACK COMPONENTS ============

interface BackendFallbackProps {
  title?: string;
  titleAr?: string;
  message?: string;
  messageAr?: string;
  onRetry?: () => void;
  isRetrying?: boolean;
  showSkeleton?: boolean;
}

export function BackendFallback({
  title = 'Impossible de charger les données',
  titleAr = 'تعذر تحميل البيانات',
  message = 'Nous rencontrons des difficultés techniques. Les données seront mises à jour automatiquement.',
  messageAr = 'نواجه صعوبات تقنية. سيتم تحديث البيانات تلقائياً.',
  onRetry,
  isRetrying = false,
}: BackendFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
        <WifiOff className="w-8 h-8 text-orange-600" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2 text-center">
        {titleAr} / {title}
      </h3>
      <p className="text-gray-600 text-sm text-center mb-4 max-w-md">
        {messageAr}
        <br />
        {message}
      </p>
      {onRetry && (
        <Button 
          onClick={onRetry} 
          disabled={isRetrying}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
          {isRetrying ? 'جاري إعادة المحاولة...' : 'إعادة المحاولة / Réessayer'}
        </Button>
      )}
    </div>
  );
}

// Hook for handling async operations with error states
interface AsyncState<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  isError: boolean;
}

export function useAsyncWithFallback<T>(
  asyncFn: () => Promise<T>,
  fallbackData: T,
  deps: React.DependencyList = []
): AsyncState<T> & { retry: () => void } {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    error: null,
    isLoading: true,
    isError: false,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, isError: false }));
    try {
      const result = await asyncFn();
      setState({
        data: result,
        error: null,
        isLoading: false,
        isError: false,
      });
    } catch (err) {
      console.error('Async operation failed:', err);
      setState({
        data: fallbackData,
        error: err instanceof Error ? err : new Error(String(err)),
        isLoading: false,
        isError: true,
      });
    }
  }, [asyncFn, fallbackData]);

  React.useEffect(() => {
    execute();
  }, deps);

  return { ...state, retry: execute };
}

// Empty state component for when data loads but is empty
export function EmptyState({
  title = 'Aucune donnée',
  titleAr = 'لا توجد بيانات',
  message = 'Aucun élément à afficher pour le moment.',
  messageAr = 'لا توجد عناصر للعرض حالياً.',
  icon: Icon = AlertCircle,
}: {
  title?: string;
  titleAr?: string;
  message?: string;
  messageAr?: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {titleAr} / {title}
      </h3>
      <p className="text-gray-500 text-sm max-w-md">
        {messageAr}
        <br />
        {message}
      </p>
    </div>
  );
}
