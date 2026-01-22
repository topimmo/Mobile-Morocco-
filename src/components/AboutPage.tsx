import React from 'react';
import Navigation from './Navigation';
import { PageLayout, PageMain } from './layout/PageLayout';
import { Container } from './ui/container';
import { SectionHeader } from './ui/section-header';
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
    <PageLayout>
      <Navigation />
      
      <PageMain>
        <Container className="py-12">
          <SectionHeader
            as="h1"
            align="center"
            title="À Propos de Mobile Morocco"
            description="Mobile Morocco est la première plateforme marocaine dédiée à l'écosystème mobile. Nous connectons acheteurs, vendeurs, importateurs et techniciens pour créer une expérience complète et fiable dans le domaine de la téléphonie mobile."
            className="mb-16"
          />

          <section className="py-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <SectionHeader
                  title="Notre Mission"
                  className="mb-6"
                />
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Démocratiser l'accès aux technologies mobiles au Maroc en créant une plateforme 
                  transparente, sécurisée et accessible à tous. Nous visons à simplifier l'achat, 
                  la vente et la réparation de téléphones mobiles tout en soutenant l'économie locale.
                </p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-3" dir="auto">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    Faciliter l'accès aux dernières technologies mobiles
                  </li>
                  <li className="flex items-start gap-3" dir="auto">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    Soutenir les entreprises locales et les techniciens
                  </li>
                  <li className="flex items-start gap-3" dir="auto">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
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
          </section>

          <section className="py-16">
            <SectionHeader
              align="center"
              title="Nos Chiffres"
              className="mb-12"
            />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <stat.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                    <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="py-16">
            <SectionHeader
              align="center"
              title="Notre Équipe"
              className="mb-12"
            />
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
                    <p className="text-primary font-medium">{member.role}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{member.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="py-16">
            <SectionHeader
              align="center"
              title="Nos Valeurs"
              className="mb-12"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-center">Qualité</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">
                    Nous garantissons la qualité de tous les produits et services proposés sur notre plateforme.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-center">Communauté</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">
                    Nous créons une communauté forte et solidaire autour de la technologie mobile.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                  <CardTitle className="text-center">Innovation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">
                    Nous innovons constamment pour améliorer l'expérience utilisateur.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="py-12">
            <Card className="text-center bg-accent/50">
              <CardContent className="pt-12 pb-12">
                <SectionHeader
                  align="center"
                  title="Rejoignez-nous"
                  description="Que vous soyez acheteur, vendeur ou technicien, Mobile Morocco est votre partenaire de confiance."
                  className="mb-8"
                />
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg">
                    Créer un compte
                  </Button>
                  <Button size="lg" variant="outline">
                    Nous contacter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </Container>
      </PageMain>
    </PageLayout>
  );
}