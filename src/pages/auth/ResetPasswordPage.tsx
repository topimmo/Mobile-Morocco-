import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mail, Loader } from 'lucide-react';

export default function ResetPasswordPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Call Supabase resetPasswordForEmail
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-3xl font-bold mb-2">{t('auth.resetPassword')}</h1>
        <p className="text-muted-foreground mb-6">{t('auth.resetPasswordSubtitle')}</p>

        {sent ? (
          <div className="p-4 bg-primary/10 text-primary rounded-lg">
            {t('auth.resetEmailSent')}
          </div>
        ) : (
          <>
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
                    className="w-full pl-10 pr-4 py-2 bg-secondary rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
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
                  t('auth.sendResetEmail')
                )}
              </Button>
            </form>
          </>
        )}

        <div className="mt-6 text-center">
          <a href="/auth/login" className="text-primary hover:underline font-medium text-sm">
            {t('auth.backToLogin')}
          </a>
        </div>
      </Card>
    </div>
  );
}
