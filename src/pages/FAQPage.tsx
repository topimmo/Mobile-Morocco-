import { useEffect, useState } from 'react';
import { SEO } from '@/components/SEO';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Container } from '@/components/ui/container';
import { SectionHeader } from '@/components/ui/section-header';
import { PageLayout, PageMain } from '@/components/layout/PageLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqItems: FAQItem[] = [
  {
    id: '1',
    category: 'Compte & Inscription',
    question: 'Comment créer un compte sur Mobile Maroc ?',
    answer: "Pour créer un compte, cliquez sur \"S'inscrire\" sur la page d'accueil. Sélectionnez votre type de compte (Client, Importateur ou Technicien), fournissez une adresse email valide, créez un mot de passe sécurisé, et vérifiez votre email.",
  },
  {
    id: '2',
    category: 'Compte & Inscription',
    question: 'Quels sont les types de comptes disponibles ?',
    answer: 'Nous offrons trois types de comptes : Client (pour acheter), Importateur (pour vendre), et Technicien (pour offrir des services de réparation).',
  },
  {
    id: '3',
    category: 'Abonnements',
    question: "Quels sont les plans d'abonnement disponibles ?",
    answer: 'Nous proposons trois plans : Free (gratuit), Standard (fonctionnalités étendues), et Professional (accès complet).',
  },
  {
    id: '4',
    category: 'Abonnements',
    question: "Puis-je changer mon plan d'abonnement ?",
    answer: 'Oui, vous pouvez changer votre plan à tout moment depuis votre tableau de bord.',
  },
  {
    id: '5',
    category: 'Achat & Vente',
    question: 'Comment acheter un produit ?',
    answer: 'Parcourez les catégories, utilisez la recherche avancée, consultez les détails et cliquez sur "Acheter" pour procéder au paiement.',
  },
  {
    id: '6',
    category: 'Achat & Vente',
    question: 'Comment lister un produit à vendre ?',
    answer: "Si vous êtes Importateur, accédez à votre tableau de bord et cliquez sur \"Ajouter un produit\". Fournissez les détails et attendez l'approbation.",
  },
  {
    id: '7',
    category: 'Paiement & Sécurité',
    question: 'Quels sont les modes de paiement acceptés ?',
    answer: 'Nous acceptons les cartes bancaires, virements bancaires, et portefeuilles numériques. Tous les paiements sont sécurisés par SSL.',
  },
  {
    id: '8',
    category: 'Livraison & Retours',
    question: 'Quelle est votre politique de retour ?',
    answer: 'Les retours sont acceptés dans les 14 jours si le produit ne correspond pas à la description.',
  },
  {
    id: '9',
    category: 'Services de Réparation',
    question: 'Comment trouver un technicien de réparation ?',
    answer: 'Consultez notre section "Techniciens" et filtrez par localisation et spécialité.',
  },
  {
    id: '10',
    category: 'Signalements & Sécurité',
    question: 'Comment signaler un produit suspect ?',
    answer: "Cliquez sur le bouton \"Signaler\" sur l'annonce et décrivez le problème. Notre équipe enquêtera dans les 24 heures.",
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = Array.from(new Set(faqItems.map(item => item.category)));
  
  const filteredItems = searchQuery
    ? faqItems.filter(
        item =>
          item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqItems;

  return (
    <PageLayout>
      <SEO
        title="Questions Fréquemment Posées"
        description="Trouvez les réponses aux questions courantes sur Mobile Maroc, nos services et comment utiliser la plateforme."
        canonical="/faq"
      />
      <Navigation />

      <PageMain>
        <Container className="py-16" size="sm">
          <SectionHeader
            as="h1"
            title="Questions Fréquemment Posées"
            description="Trouvez des réponses aux questions courantes sur notre plateforme"
            align="center"
          />

          {/* Search */}
          <div className="mt-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher une question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* FAQ Content */}
          <div className="mt-12 space-y-12">
            {searchQuery ? (
              <div>
                <h2 className="text-xl font-semibold mb-6">
                  Résultats de recherche ({filteredItems.length})
                </h2>
                <Accordion type="single" collapsible className="space-y-3">
                  {filteredItems.map((item) => (
                    <AccordionItem key={item.id} value={item.id} className="border rounded-lg px-6">
                      <AccordionTrigger className="text-left py-4 hover:no-underline">
                        <span className="font-medium">{item.question}</span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-4 text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ) : (
              categories.map((category) => (
                <div key={category}>
                  <h2 className="text-xl font-semibold mb-6 pb-3 border-b">
                    {category}
                  </h2>
                  <Accordion type="single" collapsible className="space-y-3">
                    {faqItems
                      .filter(item => item.category === category)
                      .map((item) => (
                        <AccordionItem key={item.id} value={item.id} className="border rounded-lg px-6">
                          <AccordionTrigger className="text-left py-4 hover:no-underline">
                            <span className="font-medium">{item.question}</span>
                          </AccordionTrigger>
                          <AccordionContent className="pb-4 text-muted-foreground">
                            {item.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                  </Accordion>
                </div>
              ))
            )}
          </div>
        </Container>

        {/* Contact Support Section */}
        <div className="bg-muted/30 py-16 mt-16">
          <Container size="sm">
            <Card>
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-semibold mb-3">
                  Vous n'avez pas trouvé votre réponse ?
                </h2>
                <p className="text-muted-foreground mb-6">
                  Notre équipe de support est là pour vous aider
                </p>
                <Button asChild size="lg">
                  <a href="/contact">Nous Contacter</a>
                </Button>
              </CardContent>
            </Card>
          </Container>
        </div>
      </PageMain>

      <Footer />
    </PageLayout>
  );
}
