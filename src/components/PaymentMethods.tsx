import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useLanguage } from '../contexts/LanguageContext';
import { CreditCard, Smartphone, Building, Truck } from 'lucide-react';

interface PaymentDetails {
  method: string;
  amount: number;
  phoneNumber?: string;
  timestamp: string;
}

interface PaymentMethodsProps {
  amount: number;
  onPaymentComplete: (method: string, details: PaymentDetails) => void;
  onCancel?: () => void;
}

export default function PaymentMethods({ 
  amount, 
  onPaymentComplete, 
  onCancel 
}: PaymentMethodsProps) {
  const { t } = useLanguage();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = [
    {
      id: 'orange_money',
      name: t('payment.orange_money'),
      icon: <Smartphone className="h-5 w-5 text-orange-500" />,
      description: 'Paiement via Orange Money',
      color: 'border-orange-200 hover:border-orange-300'
    },
    {
      id: 'inwi_money',
      name: t('payment.inwi_money'),
      icon: <Smartphone className="h-5 w-5 text-red-500" />,
      description: 'Paiement via Inwi Money',
      color: 'border-red-200 hover:border-red-300'
    },
    {
      id: 'maroc_telecom',
      name: t('payment.maroc_telecom'),
      icon: <Smartphone className="h-5 w-5 text-blue-500" />,
      description: 'Paiement via Maroc Telecom Cash',
      color: 'border-blue-200 hover:border-blue-300'
    },
    {
      id: 'cash_delivery',
      name: t('payment.cash_delivery'),
      icon: <Truck className="h-5 w-5 text-green-500" />,
      description: 'Paiement en espèces à la livraison',
      color: 'border-green-200 hover:border-green-300'
    },
    {
      id: 'bank_transfer',
      name: t('payment.bank_transfer'),
      icon: <Building className="h-5 w-5 text-gray-500" />,
      description: 'Virement bancaire',
      color: 'border-gray-200 hover:border-gray-300'
    }
  ];

  const handlePayment = async () => {
    if (!selectedMethod) return;

    setIsProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const paymentDetails = {
        method: selectedMethod,
        amount,
        phoneNumber: phoneNumber || undefined,
        timestamp: new Date().toISOString()
      };

      onPaymentComplete(selectedMethod, paymentDetails);
    } catch (error) {
      console.error('Payment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const requiresPhoneNumber = ['orange_money', 'inwi_money', 'maroc_telecom'].includes(selectedMethod);

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5" />
          <span>Méthodes de paiement</span>
        </CardTitle>
        <CardDescription>
          Choisissez votre méthode de paiement préférée
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Amount Display */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-center">
            <p className="text-sm text-gray-600">Montant à payer</p>
            <p className="text-2xl font-bold text-gray-900">{amount} MAD</p>
          </div>
        </div>

        {/* Payment Methods */}
        <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
          <div className="grid gap-3">
            {paymentMethods.map((method) => (
              <div key={method.id} className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${method.color} ${selectedMethod === method.id ? 'ring-2 ring-blue-500' : ''}`}>
                <Label htmlFor={method.id} className="cursor-pointer">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value={method.id} id={method.id} />
                    <div className="flex items-center space-x-3 flex-1">
                      {method.icon}
                      <div>
                        <p className="font-medium">{method.name}</p>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </div>
        </RadioGroup>

        {/* Phone Number Input for Mobile Money */}
        {requiresPhoneNumber && selectedMethod && (
          <div className="space-y-2">
            <Label htmlFor="phone">Numéro de téléphone</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="06 XX XX XX XX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="text-center"
            />
            <p className="text-xs text-gray-500">
              Entrez le numéro associé à votre compte {paymentMethods.find(m => m.id === selectedMethod)?.name}
            </p>
          </div>
        )}

        {/* Payment Instructions */}
        {selectedMethod === 'cash_delivery' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-medium text-yellow-800 mb-2">Instructions de paiement</h4>
            <ul className="text-sm text-yellow-700 space-y-1">
              <li>• Préparez le montant exact en espèces</li>
              <li>• Le livreur vous contactera avant la livraison</li>
              <li>• Vérifiez le produit avant de payer</li>
            </ul>
          </div>
        )}

        {selectedMethod === 'bank_transfer' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Informations bancaires</h4>
            <div className="text-sm text-blue-700 space-y-1">
              <p><strong>Banque:</strong> Attijariwafa Bank</p>
              <p><strong>RIB:</strong> 007 780 0000123456789012 34</p>
              <p><strong>Bénéficiaire:</strong> MobileMorocco SARL</p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-3">
          {onCancel && (
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              disabled={isProcessing}
            >
              Annuler
            </Button>
          )}
          <Button
            onClick={handlePayment}
            disabled={!selectedMethod || isProcessing || (requiresPhoneNumber && !phoneNumber)}
            className="flex-1"
          >
            {isProcessing ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Traitement...</span>
              </div>
            ) : (
              `Payer ${amount} MAD`
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}