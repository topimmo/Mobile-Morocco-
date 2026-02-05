import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mail, Loader, CheckCircle, ArrowLeft } from 'lucide-react';
import { requestPasswordReset } from '@/services/authService';

type ResetWorkflowPhase = 'input' | 'processing' | 'confirmation' | 'failed';

export default function ResetPasswordPage() {
  const { t } = useLanguage();
  const [emailAddress, setEmailAddress] = useState('');
  const [workflowPhase, setWorkflowPhase] = useState<ResetWorkflowPhase>('input');
  const [errorMessage, setErrorMessage] = useState('');

  const initiatePasswordReset = async (event: React.FormEvent) => {
    event.preventDefault();
    setWorkflowPhase('processing');
    setErrorMessage('');

    const resetResult = await requestPasswordReset(emailAddress);
    
    if (resetResult.success) {
      setWorkflowPhase('confirmation');
    } else {
      setErrorMessage(resetResult.error || 'Une erreur est survenue');
      setWorkflowPhase('failed');
    }
  };

  const resetWorkflow = () => {
    setWorkflowPhase('input');
    setErrorMessage('');
    setEmailAddress('');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-3xl font-bold mb-2">{t('auth.resetPassword')}</h1>
        <p className="text-muted-foreground mb-6">{t('auth.resetPasswordSubtitle')}</p>

        {workflowPhase === 'confirmation' && (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <div className="p-4 bg-primary/10 text-primary rounded-lg text-center">
              <p className="font-medium mb-1">Email envoyé avec succès</p>
              <p className="text-sm opacity-90">
                Vérifiez votre boîte de réception à <strong>{emailAddress}</strong>
              </p>
            </div>
            <Button 
              onClick={() => window.location.href = '/auth/login'} 
              className="w-full"
              variant="outline"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la connexion
            </Button>
          </div>
        )}

        {workflowPhase === 'failed' && (
          <div className="space-y-4">
            <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
              <p className="font-medium mb-1">Échec de l'envoi</p>
              <p className="text-sm">{errorMessage}</p>
            </div>
            <Button onClick={resetWorkflow} className="w-full" variant="outline">
              Réessayer
            </Button>
          </div>
        )}

        {(workflowPhase === 'input' || workflowPhase === 'processing') && (
          <form onSubmit={initiatePasswordReset} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">{t('auth.email')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-muted-foreground h-5 w-5" />
                <input
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  required
                  disabled={workflowPhase === 'processing'}
                  className="w-full pl-10 pr-4 py-2 bg-secondary rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                />
              </div>
            </div>

            <Button type="submit" disabled={workflowPhase === 'processing'} className="w-full">
              {workflowPhase === 'processing' ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                'Envoyer le lien de réinitialisation'
              )}
            </Button>
          </form>
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
