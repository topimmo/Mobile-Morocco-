import { AlertTriangle, RefreshCw, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Fallback component shown when environment variables are missing.
 * This helps developers and deployers quickly identify configuration issues.
 */
export function EnvErrorFallback() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto bg-red-100 rounded-full p-3 w-fit mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-red-900">Configuration Error</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-600 text-center">
            Required environment variables are missing. The application cannot start.
          </p>
          
          <div className="bg-gray-100 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Required Variables:</h4>
            <ul className="text-sm text-gray-700 space-y-1 font-mono">
              <li>• VITE_SUPABASE_URL</li>
              <li>• VITE_SUPABASE_ANON_KEY</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-900 mb-2">How to fix:</h4>
            <ol className="text-sm text-blue-800 space-y-2 list-decimal list-inside">
              <li>Check your hosting provider's environment variables</li>
              <li>Ensure values are set (not empty)</li>
              <li>Redeploy the application</li>
            </ol>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={handleRefresh}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
            <Button
              asChild
              variant="default"
              className="flex-1"
            >
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Supabase Dashboard
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default EnvErrorFallback;
