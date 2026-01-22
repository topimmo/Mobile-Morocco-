import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';
import { 
  CreditCard, 
  Smartphone, 
  Truck, 
  Building2, 
  CheckCircle, 
  AlertCircle,
  Banknote
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  fees: string;
  processingTime: string;
}

interface PaymentInstructionsProps {
  amount: number;
  productName: string;
  sellerInfo: {
    name: string;
    phone: string;
    location: string;
  };
  onPaymentComplete: (paymentMethod: string, transactionId: string) => void;
  onCancel: () => void;
}

const PaymentInstructions: React.FC<PaymentInstructionsProps> = ({
  amount,
  productName,
  sellerInfo,
  onPaymentComplete,
  onCancel
}) => {
  const { t } = useLanguage();
  const [selectedMethod, setSelectedMethod] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'orange_money',
      name: 'Orange Money',
      icon: <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">O</div>,
      description: 'Paiement via Orange Money',
      fees: 'Gratuit',
      processingTime: 'Instantané'
    },
    {
      id: 'inwi_money',
      name: 'Inwi Money',
      icon: <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">I</div>,
      description: 'Paiement via Inwi Money',
      fees: 'Gratuit',
      processingTime: 'Instantané'
    },
    {
      id: 'maroc_telecom',
      name: 'Maroc Telecom Cash',
      icon: <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center text-white text-xs font-bold">M</div>,
      description: 'Paiement via Maroc Telecom Cash',
      fees: 'Gratuit',
      processingTime: 'Instantané'
    },
    {
      id: 'cash_delivery',
      name: 'Paiement à la livraison',
      icon: <Truck className="w-6 h-6 text-green-600" />,
      description: 'Payez en espèces lors de la réception',
      fees: '10 DH',
      processingTime: '1-3 jours'
    },
    {
      id: 'bank_transfer',
      name: 'Virement bancaire',
      icon: <Building2 className="w-6 h-6 text-primary" />,
      description: 'Virement vers le compte du vendeur',
      fees: 'Selon votre banque',
      processingTime: '1-2 jours ouvrables'
    }
  ];

  const selectedPaymentMethod = paymentMethods.find(method => method.id === selectedMethod);

  const handleProceedToPayment = () => {
    if (!selectedMethod) {
      setError('Veuillez sélectionner une méthode de paiement');
      return;
    }

    if (['orange_money', 'inwi_money', 'maroc_telecom'].includes(selectedMethod) && !phoneNumber) {
      setError('Veuillez entrer votre numéro de téléphone');
      return;
    }

    setError('');
    setShowInstructions(true);
  };

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate a mock transaction ID
      const transactionId = `TXN${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
      
      onPaymentComplete(selectedMethod, transactionId);
    } catch (err) {
      setError('Erreur lors du traitement du paiement. Veuillez réessayer.');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderPaymentInstructions = () => {
    if (!selectedPaymentMethod) return null;

    switch (selectedMethod) {
      case 'orange_money':
      case 'inwi_money':
      case 'maroc_telecom':
        return (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                {selectedPaymentMethod.icon}
                Instructions {selectedPaymentMethod.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="font-semibold">Étapes à suivre :</p>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Composez *150# sur votre téléphone</li>
                  <li>Sélectionnez "Transfert d'argent"</li>
                  <li>Entrez le numéro du vendeur : <strong>{sellerInfo.phone}</strong></li>
                  <li>Entrez le montant : <strong>{amount} DH</strong></li>
                  <li>Confirmez la transaction</li>
                  <li>Notez le code de transaction et partagez-le avec le vendeur</li>
                </ol>
              </div>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Une fois le paiement effectué, cliquez sur "Confirmer le paiement" ci-dessous.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        );

      case 'cash_delivery':
        return (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Truck className="w-5 h-5" />
                Paiement à la livraison
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="font-semibold">Informations importantes :</p>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Montant à payer : <strong>{amount + 10} DH</strong> (incluant 10 DH de frais de livraison)</li>
                  <li>Préparez la somme exacte en espèces</li>
                  <li>Vérifiez le produit avant de payer</li>
                  <li>Demandez un reçu au livreur</li>
                </ul>
              </div>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Le vendeur sera contacté pour organiser la livraison. Vous recevrez un SMS avec les détails.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        );

      case 'bank_transfer':
        return (
          <Card className="border-muted bg-muted">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-secondary">
                <Building2 className="w-5 h-5" />
                Virement bancaire
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="font-semibold">Coordonnées bancaires du vendeur :</p>
                <div className="bg-white p-3 rounded border text-sm space-y-1">
                  <p><strong>Bénéficiaire :</strong> {sellerInfo.name}</p>
                  <p><strong>RIB :</strong> 001 810 0000123456789 12</p>
                  <p><strong>Banque :</strong> Attijariwafa Bank</p>
                  <p><strong>Montant :</strong> {amount} DH</p>
                  <p><strong>Référence :</strong> {productName.substring(0, 20)}</p>
                </div>
              </div>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Après avoir effectué le virement, envoyez le reçu au vendeur via WhatsApp : {sellerInfo.phone}
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  if (showInstructions) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Récapitulatif de la commande</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Produit :</span>
                <span className="font-medium">{productName}</span>
              </div>
              <div className="flex justify-between">
                <span>Vendeur :</span>
                <span>{sellerInfo.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Localisation :</span>
                <span>{sellerInfo.location}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total à payer :</span>
                <span>{selectedMethod === 'cash_delivery' ? amount + 10 : amount} DH</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {renderPaymentInstructions()}

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setShowInstructions(false)}
            disabled={isProcessing}
            className="flex-1"
          >
            Retour
          </Button>
          <Button
            onClick={handleConfirmPayment}
            disabled={isProcessing}
            className="flex-1"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Traitement...
              </div>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Confirmer le paiement
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Choisissez votre méthode de paiement</CardTitle>
          <CardDescription>
            Montant à payer : <strong>{amount} DH</strong> pour {productName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-accent/50 cursor-pointer">
                  <RadioGroupItem value={method.id} id={method.id} />
                  <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      {method.icon}
                      <div className="flex-1">
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-muted-foreground">{method.description}</div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-green-600 font-medium">{method.fees}</div>
                        <div className="text-muted-foreground">{method.processingTime}</div>
                      </div>
                    </div>
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>

          {['orange_money', 'inwi_money', 'maroc_telecom'].includes(selectedMethod) && (
            <div className="mt-4 space-y-2">
              <Label htmlFor="phone">Votre numéro de téléphone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="06 XX XX XX XX"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  setError('');
                }}
                className="max-w-xs"
              />
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Annuler
        </Button>
        <Button onClick={handleProceedToPayment} className="flex-1">
          <CreditCard className="h-4 w-4 mr-2" />
          Procéder au paiement
        </Button>
      </div>
    </div>
  );
};

export default PaymentInstructions;