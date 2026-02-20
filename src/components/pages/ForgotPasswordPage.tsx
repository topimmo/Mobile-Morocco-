import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react';
import { SEO } from '@/components/SEO';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const { resetPassword } = useAuth();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO
        title="Mot de passe oublié - Mobile Morocco"
        description="Réinitialisez votre mot de passe Mobile Morocco"
      />
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <Button
              variant="ghost"
              className="mb-6"
              onClick={() => navigate('/login')}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour à la connexion
            </Button>

            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Mot de passe oublié</CardTitle>
                <CardDescription>
                  Entrez votre email pour réinitialiser votre mot de passe
                </CardDescription>
              </CardHeader>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {success && (
                    <Alert>
                      <CheckCircle2 className="h-4 w-4" />
                      <AlertDescription>
                        Un email de réinitialisation a été envoyé à{' '}
                        <strong>{email}</strong>. Veuillez vérifier votre boîte de réception.
                      </AlertDescription>
                    </Alert>
                  )}

                  {!success && (
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="votre@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                  {!success ? (
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        'Envoyer le lien de réinitialisation'
                      )}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      className="w-full"
                      onClick={() => navigate('/login')}
                    >
                      Retour à la connexion
                    </Button>
                  )}

                  <div className="text-center text-sm">
                    <span className="text-muted-foreground">
                      Vous vous souvenez de votre mot de passe?{' '}
                    </span>
                    <Link to="/login" className="text-primary hover:underline">
                      Se connecter
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
