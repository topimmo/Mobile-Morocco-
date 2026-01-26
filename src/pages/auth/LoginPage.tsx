import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SEO } from '@/components/SEO';
import { Mail, Lock, Loader } from 'lucide-react';
import { trackLogin } from '@/services/analyticsService';
import { signInAndRedirect } from '@/services/authService';

export default function LoginPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use the new signInAndRedirect function that fetches role from profiles
      const { user, redirectPath, role, error: signInError } = await signInAndRedirect(email, password);

      if (signInError || !user) {
        setError(signInError || 'Login failed');
        return;
      }

      // Track successful login
      trackLogin();

      // Redirect based on role
      console.log('Login successful, redirecting to:', redirectPath, 'Role:', role);
      navigate(redirectPath);
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <SEO
        title="Connexion"
        description="Connectez-vous à votre compte Mobile Maroc pour gérer vos annonces et accéder à votre tableau de bord."
        canonical="/auth/login"
        noindex={true}
      />
      <Card className="w-full max-w-md p-8">
        <h1 className="text-3xl font-bold mb-2">{t('auth.login')}</h1>
        <p className="text-muted-foreground mb-6">{t('auth.loginSubtitle')}</p>

        {error && (
          <div className="mb-4 p-3 bg-destructive/10 text-destructive rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t('auth.email')}</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-muted-foreground h-5 w-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 bg-background text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">{t('auth.password')}</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-muted-foreground h-5 w-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2 bg-background text-foreground rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                {t('common.loading')}
              </>
            ) : (
              t('auth.loginButton')
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {t('auth.noAccount')}{' '}
            <a href="/auth/register" className="text-primary hover:underline font-medium">
              {t('auth.register')}
            </a>
          </p>
        </div>
      </Card>
    </div>
  );
}
