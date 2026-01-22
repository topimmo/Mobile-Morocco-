import React, { useState } from 'react';
import Navigation from './Navigation';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react';
import { useToast } from './ui/use-toast';

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    toast({
      title: "Message envoyé",
      description: "Nous vous répondrons dans les plus brefs délais.",
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Téléphone",
      details: ["+212 5 22 12 34 56", "+212 6 12 34 56 78"],
      description: "Lun-Ven: 9h-18h, Sam: 9h-13h"
    },
    {
      icon: Mail,
      title: "Email",
      details: ["contact@mobilemorocco.ma", "support@mobilemorocco.ma"],
      description: "Réponse sous 24h"
    },
    {
      icon: MapPin,
      title: "Adresse",
      details: ["123 Avenue Mohammed V", "Casablanca, Maroc"],
      description: "Siège social"
    },
    {
      icon: Clock,
      title: "Horaires",
      details: ["Lun-Ven: 9h-18h", "Sam: 9h-13h"],
      description: "Fermé le dimanche"
    }
  ];

  const faqItems = [
    {
      question: "Comment créer un compte vendeur ?",
      answer: "Cliquez sur 'S'inscrire' et sélectionnez 'Importateur' lors de l'inscription. Vous devrez fournir vos documents d'entreprise pour validation."
    },
    {
      question: "Comment devenir technicien certifié ?",
      answer: "Inscrivez-vous en tant que 'Technicien' et soumettez vos certifications. Notre équipe vérifiera vos qualifications avant activation."
    },
    {
      question: "Quels sont les frais de transaction ?",
      answer: "Les frais varient selon votre plan d'abonnement. Le plan gratuit inclut des frais de 3%, tandis que les plans payants offrent des tarifs réduits."
    },
    {
      question: "Comment signaler un problème ?",
      answer: "Utilisez le bouton 'Signaler' sur chaque produit ou contactez notre support via ce formulaire."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Contactez-nous</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Notre équipe est là pour vous aider. N'hésitez pas à nous contacter pour toute question ou assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-6 w-6 mr-2 text-blue-600" />
                  Envoyez-nous un message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Nom complet *
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Votre nom complet"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+212 6 12 34 56 78"
                      />
                    </div>
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Sujet *
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        placeholder="Sujet de votre message"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="Décrivez votre demande en détail..."
                    />
                  </div>

                  <Button type="submit" className="w-full">
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer le message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <info.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{info.title}</h3>
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="text-gray-600 mb-1">{detail}</p>
                      ))}
                      <p className="text-sm text-gray-500 mt-2">{info.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Questions Fréquentes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqItems.map((item, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{item.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Notre Localisation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-4" />
                  <p>Carte interactive à venir</p>
                  <p className="text-sm">123 Avenue Mohammed V, Casablanca</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}