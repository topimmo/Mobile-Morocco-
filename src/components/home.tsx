import React from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import CategorySection from './CategorySection';
import AdvertiserSection from './AdvertiserSection';
import FeaturedProductsSection from './FeaturedProductsSection';
import AdBanner from './AdBanner';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Smartphone, 
  Wrench, 
  Users, 
  ShoppingBag, 
  Star,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: Smartphone,
      title: 'Téléphones & Accessoires',
      description: 'Large sélection de téléphones neufs et d\'occasion, accessoires et pièces détachées',
      link: '/products'
    },
    {
      icon: Wrench,
      title: 'Services de Réparation',
      description: 'Trouvez des techniciens qualifiés pour réparer vos appareils',
      link: '/technicians'
    },
    {
      icon: Users,
      title: 'Communauté',
      description: 'Rejoignez notre communauté d\'importateurs, techniciens et clients',
      link: '/register'
    },
    {
      icon: ShoppingBag,
      title: 'Marketplace',
      description: 'Achetez et vendez en toute sécurité sur notre plateforme',
      link: '/products'
    }
  ];

  const stats = [
    { label: 'Utilisateurs Actifs', value: '10,000+' },
    { label: 'Produits Disponibles', value: '50,000+' },
    { label: 'Techniciens Certifiés', value: '500+' },
    { label: 'Villes Couvertes', value: '20+' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Top Banner Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <AdBanner position="header" />
      </div>

      {/* Hero Section */}
      <section className="bg-secondary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Mobile Morocco
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              La plateforme leader au Maroc pour l'achat, la vente et la réparation de téléphones mobiles
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                  Commencer Maintenant
                </Button>
              </Link>
              <Link to="/products">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                  Explorer les Produits
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez tout ce que Mobile Morocco peut vous offrir
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-muted rounded-lg flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center mb-4">
                      {feature.description}
                    </CardDescription>
                    <Link to={feature.link}>
                      <Button variant="outline" className="w-full">
                        En Savoir Plus
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <CategorySection />

      {/* Middle Banner Ad */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdBanner position="home_middle" />
      </div>

      {/* Featured Products Section */}
      <FeaturedProductsSection />

      {/* Sidebar Ad Section */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div className="md:col-span-1">
              <AdBanner position="sidebar" />
            </div>
            <div className="md:col-span-3">
              {/* Content placeholder */}
            </div>
          </div>
        </div>
      </section>

      {/* Advertiser Section */}
      <AdvertiserSection />

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Prêt à Commencer ?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui font confiance à Mobile Morocco
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Créer un Compte
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Se Connecter
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Mobile Morocco</h3>
              <p className="text-gray-400">
                La plateforme de référence pour les mobiles au Maroc
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Liens Rapides</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/products" className="hover:text-white">Produits</Link></li>
                <li><Link to="/technicians" className="hover:text-white">Techniciens</Link></li>
                <li><Link to="/register" className="hover:text-white">S'inscrire</Link></li>
                <li><Link to="/login" className="hover:text-white">Se connecter</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link to="/help" className="hover:text-white">Aide</Link></li>
                <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <div className="space-y-2 text-gray-400">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  +212 6XX XXX XXX
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  contact@mobilemorocco.ma
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  Casablanca, Maroc
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Mobile Morocco. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;