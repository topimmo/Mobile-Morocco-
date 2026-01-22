import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Container } from '@/components/ui/container';
import { PageLayout, PageMain } from '@/components/layout/PageLayout';
import { SEO } from '@/components/SEO';
import { Loader } from 'lucide-react';
import { trackLogin } from '@/services/analyticsService';

export default function LoginPage() {
  const { t } = useLanguage();
  const { signIn } = useAuth();
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
      await signIn(email, password);
      trackLogin(); // Track successful login
      navigate('/advertiser/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <SEO
        title="Connexion"
        description="Connectez-vous à votre compte Mobile Maroc pour gérer vos annonces et accéder à votre tableau de bord."
        canonical="/auth/login"
        noindex={true}
      />
      <PageMain className="flex items-center justify-center min-h-screen bg-background">
        <Container size="sm">
          <Card className="p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">{t('auth.login')}</h1>
              <p className="text-muted-foreground">{t('auth.loginSubtitle')}</p>
            </div>

            {error && (
              <div className="mb-6 p-3 bg-destructive/10 text-destructive rounded text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium">
                  {t('auth.email')}
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium">
                  {t('auth.password')}
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
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

            <div className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                {t('auth.noAccount')}{' '}
                <a href="/auth/register" className="text-primary hover:underline font-medium">
                  {t('auth.register')}
                </a>
              </p>
            </div>
          </Card>
        </Container>
      </PageMain>
    </PageLayout>
  );
}
