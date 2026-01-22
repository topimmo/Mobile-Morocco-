import React from 'react';
import Navigation from './Navigation';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Phone, Mail, MapPin, Clock, Users, Award } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { icon: Users, label: "Utilisateurs Actifs", value: "10,000+" },
    { icon: Phone, label: "Téléphones Vendus", value: "50,000+" },
    { icon: Award, label: "Techniciens Certifiés", value: "500+" },
    { icon: MapPin, label: "Villes Couvertes", value: "20+" }
  ];

  const team = [
    {
      name: "Youssef Alami",
      role: "Fondateur & CEO",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=youssef",
      description: "Expert en technologie mobile avec 15 ans d'expérience"
    },
    {
      name: "Aicha Benali",
      role: "Directrice Technique",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=aicha",
      description: "Spécialiste en développement de plateformes e-commerce"
    },
    {
      name: "Karim Tazi",
      role: "Responsable Partenariats",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=karim",
      description: "Expert en relations avec les importateurs et techniciens"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">À Propos de Mobile Morocco</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Mobile Morocco est la première plateforme marocaine dédiée à l'écosystème mobile. 
            Nous connectons acheteurs, vendeurs, importateurs et techniciens pour créer 
            une expérience complète et fiable dans le domaine de la téléphonie mobile.
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Notre Mission</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Démocratiser l'accès aux technologies mobiles au Maroc en créant une plateforme 
                transparente, sécurisée et accessible à tous. Nous visons à simplifier l'achat, 
                la vente et la réparation de téléphones mobiles tout en soutenant l'économie locale.
              </p>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Faciliter l'accès aux dernières technologies mobiles
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Soutenir les entreprises locales et les techniciens
                </li>
                <li className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Garantir des transactions sécurisées et transparentes
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl">
              <img 
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&q=80" 
                alt="Mission" 
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Nos Chiffres</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <stat.icon className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Notre Équipe</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4"
                  />
                  <CardTitle className="text-xl">{member.name}</CardTitle>
                  <p className="text-blue-600 font-medium">{member.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{member.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Nos Valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-center">Qualité</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Nous garantissons la qualité de tous les produits et services proposés sur notre plateforme.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-center">Communauté</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Nous créons une communauté forte et solidaire autour de la technologie mobile.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Clock className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                <CardTitle className="text-center">Innovation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-center">
                  Nous innovons constamment pour améliorer l'expérience utilisateur.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="text-center bg-blue-50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Rejoignez-nous</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Que vous soyez acheteur, vendeur ou technicien, Mobile Morocco est votre partenaire de confiance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Créer un compte
            </Button>
            <Button size="lg" variant="outline">
              Nous contacter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}