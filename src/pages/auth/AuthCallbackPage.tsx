import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUserRole, REDIRECT_PATHS, UserRole } from '@/services/authService';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the code from URL parameters (PKCE flow)
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        // Handle error from Supabase
        if (error) {
          console.error('Auth error:', error, errorDescription);
          setErrorMessage(errorDescription || error);
          setStatus('error');
          return;
        }

        // Exchange code for session
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            console.error('Session exchange error:', exchangeError);
            setErrorMessage(exchangeError.message);
            setStatus('error');
            return;
          }

          setStatus('success');
          
          // Get user's role and redirect to appropriate dashboard
          setTimeout(async () => {
            try {
              const { data: { user } } = await supabase.auth.getUser();
              
              if (user) {
                // Fetch role and redirect accordingly
                const { role } = await getUserRole(user.id);
                
                let redirectPath = REDIRECT_PATHS.USER; // default
                
                if (role) {
                  switch (role as UserRole) {
                    case 'admin':
                      redirectPath = REDIRECT_PATHS.ADMIN;
                      break;
                    case 'agent':
                      redirectPath = REDIRECT_PATHS.AGENT;
                      break;
                    case 'merchant':
                      redirectPath = REDIRECT_PATHS.MERCHANT;
                      break;
                    case 'user':
                    default:
                      redirectPath = REDIRECT_PATHS.USER;
                      break;
                  }
                }
                
                console.log('AuthCallback: Redirecting to role-based path:', redirectPath);
                navigate(redirectPath, { replace: true });
              } else {
                // No user, go to login
                navigate('/auth/login', { replace: true });
              }
            } catch (error) {
              console.error('AuthCallback: Error determining redirect:', error);
              // Fallback to default dashboard
              navigate('/dashboard', { replace: true });
            }
          }, 2000);
        } else {
          // No code parameter - might be a legacy link or direct access
          setErrorMessage('Invalid confirmation link. Please check your email and try again.');
          setStatus('error');
        }
      } catch (err) {
        console.error('Callback error:', err);
        setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred');
        setStatus('error');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            {status === 'loading' && 'Confirming your email...'}
            {status === 'success' && 'Email confirmed!'}
            {status === 'error' && 'Confirmation failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'loading' && (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground text-center">
                Please wait while we confirm your email address...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <Alert className="border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">
                  Your email has been confirmed successfully! Redirecting to your dashboard...
                </AlertDescription>
              </Alert>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center gap-4">
              <XCircle className="h-12 w-12 text-red-500" />
              <Alert variant="destructive">
                <AlertDescription>
                  {errorMessage || 'Failed to confirm your email. Please try again.'}
                </AlertDescription>
              </Alert>
              <div className="flex gap-2 w-full">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => navigate('/auth/login')}
                >
                  Go to Login
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => navigate('/')}
                >
                  Go to Home
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
