import { useEffect } from 'react';
import { SEO } from '@/components/SEO';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function PrivacyPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Politique de Confidentialité"
        description="Politique de confidentialité de Mobile Maroc. Découvrez comment nous protégeons vos données personnelles."
        canonical="/privacy"
      />
      <Navigation />

      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Politique de Confidentialité
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
              <CardTitle>1. Introduction</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                Mobile Maroc s'engage à protéger votre vie privée. Cette Politique de Confidentialité explique comment nous collectons, utilisons et protégeons vos informations personnelles.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Informations Collectées</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p><strong>Informations fournies directement :</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Informations de compte (nom, email, téléphone)</li>
                <li>Informations de paiement</li>
                <li>Messages et communications</li>
                <li>Avis et commentaires</li>
              </ul>

              <p><strong>Informations collectées automatiquement :</strong></p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Cookies et technologies de suivi</li>
                <li>Données de navigation</li>
                <li>Adresse IP et informations sur l'appareil</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Utilisation des Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>Nous utilisons vos informations pour :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Fournir et améliorer nos services</li>
                <li>Traiter les transactions et paiements</li>
                <li>Envoyer des notifications importantes</li>
                <li>Répondre à vos demandes</li>
                <li>Détecter et prévenir les fraudes</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Partage d'Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                Nous ne partageons vos informations qu'avec votre consentement ou dans ces cas :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Avec d'autres utilisateurs (profil, annonces publiques)</li>
                <li>Prestataires de services (paiement, hébergement)</li>
                <li>Autorités légales si requis par la loi</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Sécurité des Données</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                Nous protégeons vos informations avec :
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Chiffrement SSL pour les connexions</li>
                <li>Mots de passe hachés</li>
                <li>Contrôle d'accès aux données</li>
                <li>Sauvegardes régulières</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Cookies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                Nous utilisons des cookies pour améliorer votre expérience. Vous pouvez les contrôler via les paramètres de votre navigateur.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Vos Droits</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>Vous avez le droit de :</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Accéder à vos données personnelles</li>
                <li>Corriger les informations inexactes</li>
                <li>Demander la suppression de vos données</li>
                <li>Vous opposer au traitement</li>
                <li>Retirer votre consentement</li>
              </ul>
              <p className="mt-4">
                Contactez-nous à privacy@mobilemaroc.ma pour exercer ces droits.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Conservation des Données</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>
                Nous conservons vos données tant que votre compte est actif ou nécessaire pour nos services légitimes et obligations légales.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-gray-700">
              <p>Pour toute question sur la confidentialité :</p>
              <ul className="space-y-2">
                <li><strong>Email :</strong> privacy@mobilemaroc.ma</li>
                <li><strong>Support :</strong> support@mobilemaroc.ma</li>
                <li><strong>Téléphone :</strong> +212 5 22 12 34 56</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
