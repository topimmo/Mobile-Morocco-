import React, { useState } from 'react';
import Navigation from './Navigation';
import { PageLayout, PageMain } from './layout/PageLayout';
import { Container } from './ui/container';
import { SectionHeader } from './ui/section-header';
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
    <PageLayout>
      <Navigation />
      
      <PageMain>
        <Container className="py-12">
          <SectionHeader
            as="h1"
            align="center"
            title="Contactez-nous"
            description="Notre équipe est là pour vous aider. N'hésitez pas à nous contacter pour toute question ou assistance."
            className="mb-12"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center" dir="auto">
                    <MessageCircle className="h-6 w-6 ltr:mr-2 rtl:ml-2 text-primary" />
                    Envoyez-nous un message
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
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
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
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
                        <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
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
                        <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
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
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
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

                    <Button type="submit" className="w-full" dir="auto">
                      <Send className="h-4 w-4 ltr:mr-2 rtl:ml-2" />
                      Envoyer le message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4" dir="auto">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <info.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-2">{info.title}</h3>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-muted-foreground mb-1">{detail}</p>
                        ))}
                        <p className="text-sm text-muted-foreground mt-2">{info.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <section className="py-16">
            <SectionHeader
              align="center"
              title="Questions Fréquentes"
              className="mb-12"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqItems.map((item, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="py-12">
            <Card>
              <CardHeader>
                <CardTitle>Notre Localisation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted h-64 rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-4" />
                    <p>Carte interactive à venir</p>
                    <p className="text-sm">123 Avenue Mohammed V, Casablanca</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </Container>
      </PageMain>
    </PageLayout>
  );
}