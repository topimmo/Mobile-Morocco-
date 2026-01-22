import { useEffect } from 'react';
import { SEO } from '@/components/SEO';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Users, Globe, Shield, Zap, Award } from 'lucide-react';

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="À Propos de Mobile Maroc"
        description="Découvrez Mobile Maroc, la plateforme de confiance pour acheter, vendre et réparer des téléphones au Maroc."
        canonical="/about"
      />
      <Navigation />

      {/* Hero Section */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            À Propos de Mobile Maroc
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed">
            Mobile Maroc est la plateforme leader au Maroc dédiée à l'achat, la vente et la réparation de téléphones mobiles, accessoires et pièces détachées.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Notre Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Nous connectons les acheteurs et vendeurs de téléphones mobiles, d'accessoires et d'équipements de réparation au Maroc. Notre objectif est de créer un écosystème numérique transparent, sécurisé et accessible à tous.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Mobile Maroc offre une plateforme robuste et conviviale qui soutient une variété de types d'utilisateurs et de niveaux d'abonnement, chacun avec son propre ensemble de privilèges et de fonctionnalités.
          </p>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Nos Valeurs</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <Shield className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Confiance & Sécurité</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Nous mettons en place des mesures de sécurité robustes pour protéger les données et transactions de nos utilisateurs.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Accessibilité</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Notre plateforme est conçue pour être accessible à tous, quel que soit leur niveau technique ou leur expertise.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Nous innovons continuellement pour améliorer l'expérience utilisateur et intégrer les dernières technologies.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Award className="w-8 h-8 text-primary mb-2" />
                <CardTitle>Qualité</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Nous nous engageons à maintenir les plus hauts standards de qualité dans nos services et notre support client.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* User Types Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Qui Peut Utiliser Mobile Maroc ?</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="w-5 h-5 mr-2 text-primary" />
                  Clients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Achetez des téléphones neufs ou d'occasion, des accessoires, et trouvez des services de réparation professionnels près de chez vous.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-primary" />
                  Importateurs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Vendez vos produits, gérez votre inventaire, suivez vos performances et accédez à des outils de vente avancés.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-primary" />
                  Techniciens
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Proposez vos services de réparation, gérez vos demandes de travail et élargissez votre clientèle.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">Par les Chiffres</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">10K+</div>
              <p className="text-gray-600">Produits Listés</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">5K+</div>
              <p className="text-gray-600">Vendeurs Actifs</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">50K+</div>
              <p className="text-gray-600">Utilisateurs Satisfaits</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">Nos Fonctionnalités</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Recherche Avancée</h3>
                <p className="mt-2 text-gray-600">Filtrez par localisation, prix, marque et condition du produit</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Comparaison de Produits</h3>
                <p className="mt-2 text-gray-600">Comparez les spécifications et les prix côte à côte</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Avis et Évaluations</h3>
                <p className="mt-2 text-gray-600">Lisez les avis vérifiés d'autres utilisateurs</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Notifications en Temps Réel</h3>
                <p className="mt-2 text-gray-600">Restez informé des mises à jour importantes</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Géolocalisation</h3>
                <p className="mt-2 text-gray-600">Trouvez des produits et services près de chez vous</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  ✓
                </div>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Support Multilingue</h3>
                <p className="mt-2 text-gray-600">Français et Arabe pour une meilleure expérience</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Prêt à Commencer ?</h2>
          <p className="text-xl mb-8 opacity-90">
            Rejoignez des milliers d'utilisateurs satisfaits sur Mobile Maroc
          </p>
          <a
            href="/register"
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            S'Inscrire Maintenant
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
