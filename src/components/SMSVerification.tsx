import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useLanguage } from '../contexts/LanguageContext';
import { Phone, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { useToast } from './ui/use-toast';

interface SMSVerificationProps {
  phoneNumber: string;
  onVerificationComplete: (verified: boolean) => void;
  onBack?: () => void;
}

export default function SMSVerification({ 
  phoneNumber, 
  onVerificationComplete, 
  onBack 
}: SMSVerificationProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleSendSMS = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Simulate SMS sending - In real app, call your SMS service
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset countdown
      setCountdown(60);
      setCanResend(false);
      
      toast({
        title: "SMS envoyé",
        description: `Code de vérification envoyé au ${phoneNumber}`,
      });
    } catch (err) {
      setError('Erreur lors de l\'envoi du SMS');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (verificationCode.length !== 6) {
      setError('Le code doit contenir 6 chiffres');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Simulate verification - In real app, verify with your backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo, accept any 6-digit code
      if (verificationCode.length === 6) {
        setIsVerified(true);
        setTimeout(() => {
          onVerificationComplete(true);
        }, 1000);
      } else {
        setError('Code de vérification incorrect');
      }
    } catch (err) {
      setError('Erreur lors de la vérification');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = () => {
    if (canResend) {
      handleSendSMS();
    }
  };

  // Auto-send SMS on component mount
  useEffect(() => {
    handleSendSMS();
  }, []);

  if (isVerified) {
    return (
      <Card className="w-full max-w-md mx-auto bg-white">
        <CardContent className="pt-6">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-700 mb-2">
              Vérification réussie !
            </h3>
            <p className="text-gray-600">
              Votre numéro de téléphone a été vérifié avec succès.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 p-3 bg-muted rounded-full w-fit">
          <MessageSquare className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="text-xl font-bold">
          {t('verification.phone')}
        </CardTitle>
        <CardDescription>
          {t('verification.sms_sent')}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Phone Number Display */}
        <div className="flex items-center justify-center space-x-2 p-3 bg-gray-50 rounded-lg">
          <Phone className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-gray-700">{phoneNumber}</span>
        </div>

        {/* Verification Code Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            {t('verification.enter_code')}
          </label>
          <Input
            type="text"
            placeholder="000000"
            value={verificationCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setVerificationCode(value);
              setError('');
            }}
            className="text-center text-lg tracking-widest"
            maxLength={6}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        {/* Verify Button */}
        <Button
          onClick={handleVerifyCode}
          disabled={isLoading || verificationCode.length !== 6}
          className="w-full"
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Vérification...</span>
            </div>
          ) : (
            t('verification.verify')
          )}
        </Button>

        {/* Resend Code */}
        <div className="text-center">
          {!canResend ? (
            <div className="flex items-center justify-center space-x-2 text-gray-500">
              <Clock className="h-4 w-4" />
              <span className="text-sm">
                Renvoyer le code dans {countdown}s
              </span>
            </div>
          ) : (
            <Button
              variant="ghost"
              onClick={handleResendCode}
              disabled={isLoading}
              className="text-primary hover:text-primary"
            >
              {t('verification.resend')}
            </Button>
          )}
        </div>

        {/* Back Button */}
        {onBack && (
          <Button
            variant="outline"
            onClick={onBack}
            className="w-full"
          >
            Retour
          </Button>
        )}
      </CardContent>
    </Card>
  );
}