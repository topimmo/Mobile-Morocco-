import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Phone, MessageCircle, Shield, CheckCircle, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface VerificationComponentProps {
  onVerificationComplete?: (verified: boolean) => void;
}

export default function VerificationComponent({ onVerificationComplete }: VerificationComponentProps) {
  const { t } = useLanguage();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code' | 'verified'>('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const moroccanOperators = [
    { prefix: '+212 6', name: 'Orange', color: 'bg-orange-500' },
    { prefix: '+212 7', name: 'Inwi', color: 'bg-red-500' },
    { prefix: '+212 5', name: 'Maroc Telecom', color: 'bg-muted' }
  ];

  const validateMoroccanPhone = (phone: string): boolean => {
    const cleanPhone = phone.replace(/\s+/g, '');
    const moroccanPhoneRegex = /^(\+212|0)(5|6|7)[0-9]{8}$/;
    return moroccanPhoneRegex.test(cleanPhone);
  };

  const sendVerificationCode = async () => {
    if (!validateMoroccanPhone(phoneNumber)) {
      setError('Numéro de téléphone marocain invalide');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulation d'envoi SMS
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStep('code');
      setError('');
    } catch (err) {
      setError('Erreur lors de l\'envoi du code');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async () => {
    if (verificationCode.length !== 6) {
      setError('Le code doit contenir 6 chiffres');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulation de vérification
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Pour la démo, accepter le code "123456"
      if (verificationCode === '123456') {
        setStep('verified');
        onVerificationComplete?.(true);
      } else {
        setError('Code de vérification incorrect');
      }
    } catch (err) {
      setError('Erreur lors de la vérification');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.startsWith('212')) {
      return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)} ${cleaned.slice(10, 12)}`;
    } else if (cleaned.startsWith('0')) {
      return `${cleaned.slice(0, 1)} ${cleaned.slice(1, 2)} ${cleaned.slice(2, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8, 10)}`;
    }
    return value;
  };

  return (
    <div className="bg-white min-h-screen p-4">
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-xl font-bold">
            {step === 'phone' && 'Vérification du numéro'}
            {step === 'code' && 'Code de vérification'}
            {step === 'verified' && 'Compte vérifié'}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {step === 'phone' && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Numéro de téléphone marocain</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <Input
                    type="tel"
                    placeholder="+212 6 12 34 56 78"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">Opérateurs supportés :</p>
                <div className="flex flex-wrap gap-2">
                  {moroccanOperators.map((operator) => (
                    <Badge key={operator.name} variant="secondary" className="text-xs">
                      <div className={`w-2 h-2 rounded-full ${operator.color} mr-1`} />
                      {operator.name} ({operator.prefix})
                    </Badge>
                  ))}
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <Button 
                onClick={sendVerificationCode}
                disabled={isLoading || !phoneNumber}
                className="w-full"
              >
                {isLoading ? 'Envoi en cours...' : 'Envoyer le code SMS'}
              </Button>
            </>
          )}

          {step === 'code' && (
            <>
              <div className="text-center space-y-2">
                <MessageCircle className="w-12 h-12 text-primary mx-auto" />
                <p className="text-sm text-gray-600">
                  Code envoyé au {phoneNumber}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Code de vérification</label>
                <Input
                  type="text"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="text-center text-lg tracking-widest"
                  maxLength={6}
                />
                <p className="text-xs text-gray-500 text-center">
                  Pour la démo, utilisez le code : 123456
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Button 
                  onClick={verifyCode}
                  disabled={isLoading || verificationCode.length !== 6}
                  className="w-full"
                >
                  {isLoading ? 'Vérification...' : 'Vérifier le code'}
                </Button>

                <Button 
                  variant="ghost" 
                  onClick={() => setStep('phone')}
                  className="w-full text-sm"
                >
                  Modifier le numéro
                </Button>
              </div>
            </>
          )}

          {step === 'verified' && (
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800">Numéro vérifié avec succès !</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Votre compte est maintenant sécurisé
                </p>
              </div>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Shield className="w-3 h-3 mr-1" />
                Compte vérifié
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}