import { useEffect } from 'react';
import { SEO } from '@/components/SEO';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function TermsPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <SEO
        title="Conditions d'Utilisation"
        description="Consultez les conditions d'utilisation de Mobile Maroc. Termes et conditions légales pour tous les utilisateurs."
        canonical="/terms"
      />
      <Navigation />

      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Conditions d'Utilisation
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Dernière mise à jour : Janvier 2025
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>1. Acceptation des Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                En accédant et en utilisant le site web Mobile Maroc et son application mobile, vous acceptez d'être lié par ces conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser notre plateforme.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Utilisation du Service</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                Vous vous engagez à utiliser Mobile Maroc uniquement à des fins légales. Vous acceptez de :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Ne pas utiliser la plateforme pour des activités illégales</li>
                <li>Ne pas harceler ou menacer d'autres utilisateurs</li>
                <li>Ne pas poster de contenu offensant ou discriminatoire</li>
                <li>Respecter les droits de propriété intellectuelle</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Types de Comptes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                Mobile Maroc offre trois types de comptes : Client, Importateur, et Technicien. Chaque type a des droits et des responsabilités spécifiques. Vous êtes responsable de la confidentialité de vos identifiants.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Transactions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                Mobile Maroc agit comme intermédiaire entre acheteurs et vendeurs. Les vendeurs sont responsables de la précision des descriptions et de la qualité des produits. Tous les prix sont en Dirhams Marocains (MAD).
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Paiements et Frais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                Les paiements sont traités de manière sécurisée. Les frais de commission varient selon votre plan d'abonnement. Mobile Maroc ne peut être tenu responsable des erreurs de paiement dues à des informations inexactes.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Politique de Retour</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                Les retours doivent être demandés dans les 14 jours suivant la réception si le produit ne correspond pas à la description. Contactez le vendeur via notre système de messagerie.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Propriété Intellectuelle</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                Tout contenu sur Mobile Maroc est protégé par les lois de propriété intellectuelle. Vous acceptez de ne pas reproduire ou distribuer le contenu sans permission écrite.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Responsabilité</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                Mobile Maroc fournit la plateforme "telle quelle" sans garantie. Nous ne sommes pas responsables des dommages indirects, de la qualité des produits listés, ou des actions des utilisateurs.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Loi Applicable</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                Ces conditions sont régies par les lois du Maroc. Tout litige sera soumis à la juridiction exclusive des tribunaux marocains.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>10. Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>Pour toute question :</p>
              <ul className="space-y-2">
                <li><strong>Email :</strong> support@mobilemaroc.ma</li>
                <li><strong>Téléphone :</strong> +212 5 22 12 34 56</li>
                <li><strong>Adresse :</strong> Casablanca, Maroc</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
