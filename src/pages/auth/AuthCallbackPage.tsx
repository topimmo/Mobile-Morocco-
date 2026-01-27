import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getUserRole, REDIRECT_PATHS, resendConfirmationEmail } from '@/services/authService';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [errorType, setErrorType] = useState<'confirmation' | 'profile' | 'other'>('other');
  const [showResendForm, setShowResendForm] = useState(false);
  const [resendEmail, setResendEmail] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

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
          
          // Categorize error types for better user feedback
          if (error.toLowerCase().includes('token') || error.toLowerCase().includes('expired')) {
            setErrorType('confirmation');
            setErrorMessage('This confirmation link has expired or is invalid. Please request a new confirmation email.');
          } else {
            setErrorType('other');
            setErrorMessage(errorDescription || error);
          }
          
          setStatus('error');
          return;
        }

        // Exchange code for session
        if (code) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          
          if (exchangeError) {
            console.error('Session exchange error:', exchangeError);
            
            // Categorize exchange errors
            if (exchangeError.message?.toLowerCase().includes('token') || 
                exchangeError.message?.toLowerCase().includes('expired') ||
                exchangeError.message?.toLowerCase().includes('invalid')) {
              setErrorType('confirmation');
              setErrorMessage('This confirmation link has expired or is invalid. Please request a new confirmation email below.');
            } else {
              setErrorType('other');
              setErrorMessage(exchangeError.message || 'Failed to verify your email. Please try again.');
            }
            
            setStatus('error');
            return;
          }

          // Session established successfully
          // Now fetch user role from profiles table (single source of truth for roles)
          // Note: Roles are stored in public.profiles, NOT in auth.users metadata
          if (data?.user) {
            const { role, error: roleError } = await getUserRole(data.user.id);

            if (roleError || !role) {
              console.error('Error fetching user role from profiles table:', roleError);
              // Profile doesn't exist - this shouldn't happen but handle gracefully
              setErrorType('profile');
              setErrorMessage('Your profile could not be found. This may be due to a database configuration issue. Please contact support.');
              setStatus('error');
              return;
            }

            // Determine redirect path based on role
            let redirectPath: string;
            switch (role) {
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
                // Default to user dashboard for any unexpected role
                if (role !== 'user') {
                  console.warn(`Unexpected role '${role}' for user ${data.user.id}, defaulting to user dashboard`);
                }
                redirectPath = REDIRECT_PATHS.USER;
                break;
            }

            setStatus('success');
            
            // Redirect to role-specific dashboard after successful confirmation
            setTimeout(() => {
              navigate(redirectPath, { replace: true });
            }, 2000);
          } else {
            setErrorType('other');
            setErrorMessage('Session verification failed. Please try logging in or contact support.');
            setStatus('error');
          }
        } else {
          // No code parameter - might be a legacy link or direct access
          setErrorType('confirmation');
          setErrorMessage('Invalid confirmation link. Please check your email for the correct link, or request a new confirmation email below.');
          setStatus('error');
        }
      } catch (err) {
        console.error('Callback error:', err);
        setErrorType('other');
        setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred');
        setStatus('error');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  const handleResendConfirmation = async (e: React.FormEvent) => {
    e.preventDefault();
    setResendLoading(true);
    
    try {
      const { success, error } = await resendConfirmationEmail(resendEmail);
      
      if (success) {
        setResendSuccess(true);
      } else {
        setErrorMessage(error || 'Failed to resend confirmation email');
      }
    } catch (err) {
      setErrorMessage('Failed to resend confirmation email. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

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
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {errorMessage || 'Failed to confirm your email. Please try again.'}
                </AlertDescription>
              </Alert>

              {/* Show resend form for confirmation errors */}
              {errorType === 'confirmation' && !resendSuccess && (
                <div className="w-full mt-4 space-y-3">
                  {!showResendForm ? (
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => setShowResendForm(true)}
                    >
                      Resend Confirmation Email
                    </Button>
                  ) : (
                    <form onSubmit={handleResendConfirmation} className="space-y-3">
                      <div>
                        <Label htmlFor="resend-email">Email Address</Label>
                        <Input
                          id="resend-email"
                          type="email"
                          value={resendEmail}
                          onChange={(e) => setResendEmail(e.target.value)}
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          type="button"
                          variant="outline" 
                          className="flex-1"
                          onClick={() => setShowResendForm(false)}
                        >
                          Cancel
                        </Button>
                        <Button 
                          type="submit"
                          className="flex-1"
                          disabled={resendLoading}
                        >
                          {resendLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            'Send'
                          )}
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Show success message after resending */}
              {resendSuccess && (
                <Alert className="border-green-200 bg-green-50 w-full">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    A new confirmation email has been sent to {resendEmail}. Please check your inbox and spam folder.
                  </AlertDescription>
                </Alert>
              )}

              {/* Profile error - suggest contacting support */}
              {errorType === 'profile' && (
                <Alert className="border-amber-200 bg-amber-50 w-full">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    This appears to be a system configuration issue. Please contact support at support@mobilemorocco.com with your email address.
                  </AlertDescription>
                </Alert>
              )}

              {/* Navigation buttons */}
              <div className="flex gap-2 w-full mt-4">
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
