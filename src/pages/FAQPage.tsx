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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <SEO
        title="Questions Fréquemment Posées"
        description="Trouvez les réponses aux questions courantes sur Mobile Maroc, nos services et comment utiliser la plateforme."
        canonical="/faq"
      />
      <Navigation />

      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Questions Fréquemment Posées
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Trouvez des réponses aux questions courantes sur notre plateforme
          </p>
          
          {/* Search */}
          <input
            type="text"
            placeholder="Rechercher une question..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {searchQuery ? (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Résultats de recherche ({filteredItems.length})
              </h2>
              <Accordion type="single" collapsible className="w-full">
                {filteredItems.map((item) => (
                  <AccordionItem key={item.id} value={item.id} className="border rounded-lg mb-4 px-4">
                    <AccordionTrigger className="text-left hover:text-primary py-4">
                      <span className="font-semibold">{item.question}</span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 text-gray-700">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ) : (
            categories.map((category) => (
              <div key={category} className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-primary">
                  {category}
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {faqItems
                    .filter(item => item.category === category)
                    .map((item) => (
                      <AccordionItem key={item.id} value={item.id} className="border rounded-lg mb-4 px-4">
                        <AccordionTrigger className="text-left hover:text-primary py-4">
                          <span className="font-semibold">{item.question}</span>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 text-gray-700">
                          {item.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Contact Support Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Vous n'avez pas trouvé votre réponse ?</h2>
          <p className="text-gray-600 mb-6">Notre équipe de support est là pour vous aider</p>
          <a
            href="/contact"
            className="inline-block bg-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
          >
            Nous Contacter
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
