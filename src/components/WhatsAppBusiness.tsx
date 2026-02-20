import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { useLanguage } from '../contexts/LanguageContext';
import { MessageCircle, Phone, Share2, Send } from 'lucide-react';

interface WhatsAppBusinessProps {
  productName?: string;
  productPrice?: number;
  productImage?: string;
  sellerPhone?: string;
  sellerName?: string;
}

export default function WhatsAppBusiness({
  productName = "Produit",
  productPrice = 0,
  productImage: _productImage,
  sellerPhone = "+212600000000",
  sellerName = "Vendeur"
}: WhatsAppBusinessProps) {
  const { t: _t } = useLanguage();
  const [_message, _setMessage] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [showCustomMessage, setShowCustomMessage] = useState(false);

  const predefinedMessages = [
    {
      id: 'interest',
      text: `Bonjour, je suis intéressé(e) par ${productName} au prix de ${productPrice} MAD. Pouvez-vous me donner plus d'informations ?`,
      label: 'Demander des informations'
    },
    {
      id: 'availability',
      text: `Salut ! Est-ce que ${productName} est toujours disponible ? Je voudrais l'acheter.`,
      label: 'Vérifier la disponibilité'
    },
    {
      id: 'negotiation',
      text: `Bonjour, je voudrais négocier le prix de ${productName}. Quel est votre meilleur prix ?`,
      label: 'Négocier le prix'
    },
    {
      id: 'meeting',
      text: `Bonjour, je voudrais voir ${productName} en personne. Où peut-on se rencontrer ?`,
      label: 'Organiser une rencontre'
    }
  ];

  const formatPhoneNumber = (phone: string) => {
    // Remove all non-digits and format for WhatsApp
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.startsWith('0')) {
      return '212' + cleaned.substring(1);
    }
    if (cleaned.startsWith('212')) {
      return cleaned;
    }
    return '212' + cleaned;
  };

  const openWhatsApp = (messageText: string) => {
    const formattedPhone = formatPhoneNumber(sellerPhone);
    const encodedMessage = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  const handleSendMessage = (messageText: string) => {
    if (messageText.trim()) {
      openWhatsApp(messageText);
    }
  };

  const shareProduct = () => {
    const shareText = `Regardez ce produit intéressant: ${productName} - ${productPrice} MAD\n\nContact: ${sellerName}\n${window.location.href}`;
    
    if (navigator.share) {
      navigator.share({
        title: productName,
        text: shareText,
        url: window.location.href
      });
    } else {
      // Fallback to WhatsApp sharing
      const encodedText = encodeURIComponent(shareText);
      const whatsappShareUrl = `https://wa.me/?text=${encodedText}`;
      window.open(whatsappShareUrl, '_blank');
    }
  };

  const callSeller = () => {
    window.open(`tel:${sellerPhone}`, '_self');
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5 text-green-600" />
          <span>Contacter le vendeur</span>
        </CardTitle>
        <CardDescription>
          Communiquez directement avec {sellerName}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Seller Info */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium">{sellerName}</p>
              <p className="text-sm text-gray-600">{sellerPhone}</p>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={callSeller}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Phone className="h-4 w-4" />
            <span>Appeler</span>
          </Button>
          <Button
            onClick={shareProduct}
            variant="outline"
            className="flex items-center space-x-2"
          >
            <Share2 className="h-4 w-4" />
            <span>Partager</span>
          </Button>
        </div>

        {/* Predefined Messages */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Messages rapides :</h4>
          <div className="space-y-2">
            {predefinedMessages.map((msg) => (
              <Button
                key={msg.id}
                variant="outline"
                size="sm"
                onClick={() => handleSendMessage(msg.text)}
                className="w-full text-left justify-start h-auto p-3 whitespace-normal"
              >
                <div>
                  <p className="font-medium text-xs text-green-600 mb-1">{msg.label}</p>
                  <p className="text-xs text-gray-600 line-clamp-2">{msg.text}</p>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Message */}
        <div className="space-y-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCustomMessage(!showCustomMessage)}
            className="text-blue-600 hover:text-blue-700"
          >
            {showCustomMessage ? 'Masquer' : 'Message personnalisé'}
          </Button>

          {showCustomMessage && (
            <div className="space-y-2">
              <Textarea
                placeholder="Tapez votre message personnalisé..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={3}
              />
              <Button
                onClick={() => handleSendMessage(customMessage)}
                disabled={!customMessage.trim()}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Envoyer sur WhatsApp
              </Button>
            </div>
          )}
        </div>

        {/* WhatsApp Business Badge */}
        <div className="text-center pt-2">
          <div className="inline-flex items-center space-x-2 text-xs text-gray-500">
            <MessageCircle className="h-3 w-3 text-green-600" />
            <span>Propulsé par WhatsApp Business</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}