import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, MapPin, Calendar, Shield, MessageCircle, Phone, ChevronRight, Eye, Clock, Wrench, Package, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PublicLayout } from '@/components/layout';
import { AdBanner, SidebarAd } from '@/components/ads';

const seller = {
  name: 'TechRepair Casa',
  type: 'Atelier de Réparation',
  logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&q=80',
  cover: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80',
  rating: 4.8,
  reviews: 342,
  listings: 45,
  services: 12,
  verified: true,
  location: 'Casablanca, Quartier Maarif',
  memberSince: 'Janvier 2022',
  responseTime: '< 1 heure',
  description: 'Atelier spécialisé dans la réparation de smartphones et tablettes. Plus de 10 ans d\'expérience. Service rapide et garantie sur toutes les réparations.',
  contact: {
    phone: '+212 6XX-XXXXXX',
    whatsapp: '+212 6XX-XXXXXX',
  },
  stats: [
    { label: 'Annonces', value: '45' },
    { label: 'Services', value: '12' },
    { label: 'Avis', value: '342' },
    { label: 'Note', value: '4.8' },
  ],
};

const sellerListings = [
  {
    id: 1,
    title: 'iPhone 15 Pro Max 256GB',
    price: 14999,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&q=80',
    condition: 'Neuf',
    views: 234,
  },
  {
    id: 2,
    title: 'Samsung Galaxy S24 Ultra',
    price: 13499,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&q=80',
    condition: 'Neuf',
    views: 189,
  },
  {
    id: 3,
    title: 'Écran iPhone 14 Pro - Original',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300&q=80',
    condition: 'Neuf',
    views: 98,
  },
  {
    id: 4,
    title: 'Batterie Samsung S23',
    price: 350,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=300&q=80',
    condition: 'Neuf',
    views: 67,
  },
];

const sellerServices = [
  {
    id: 1,
    title: 'Réparation Écran iPhone',
    description: 'Remplacement écran cassé - Toutes versions iPhone',
    priceFrom: 400,
    duration: '30 min',
    image: 'https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?w=300&q=80',
  },
  {
    id: 2,
    title: 'Changement Batterie',
    description: 'Remplacement batterie usée - iPhone & Samsung',
    priceFrom: 200,
    duration: '20 min',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=300&q=80',
  },
  {
    id: 3,
    title: 'Réparation Carte Mère',
    description: 'Diagnostic et réparation micro-soudure',
    priceFrom: 500,
    duration: '2-3 jours',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=300&q=80',
  },
];

export function VendorProfilePage() {
  return (
    <PublicLayout>
      {/* Breadcrumb */}
      <div className="border-b border-white/5">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <Link to="/" className="hover:text-[#E67E22] transition-colors">Accueil</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/stores" className="hover:text-[#E67E22] transition-colors">Boutiques</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">{seller.name}</span>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="relative h-64 md:h-80">
        <img 
          src={seller.cover} 
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </div>

      {/* Seller Info */}
      <div className="container mx-auto px-4 -mt-24 relative z-10">
        <div className="glass-card rounded-xl p-6 border border-white/10">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Logo */}
            <div className="w-32 h-32 rounded-xl overflow-hidden border-4 border-background shadow-xl">
              <img 
                src={seller.logo} 
                alt={seller.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl font-grotesk font-bold">{seller.name}</h1>
                {seller.verified && (
                  <Badge className="bg-accent/20 text-accent border-0">
                    <Shield className="h-3 w-3 mr-1" />
                    Vérifié
                  </Badge>
                )}
              </div>

              <Badge variant="outline" className="mb-4">
                <Wrench className="h-3 w-3 mr-1" />
                {seller.type}
              </Badge>

              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {seller.location}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Membre depuis {seller.memberSince}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  {seller.rating} ({seller.reviews} avis)
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Répond en {seller.responseTime}
                </span>
              </div>

              <p className="text-muted-foreground mb-4">{seller.description}</p>

              {/* Contact Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button className="bg-green-600 hover:bg-green-700">
                  <Phone className="h-4 w-4 mr-2" />
                  Appeler
                </Button>
                <Button variant="outline" className="border-green-600 text-green-400 hover:bg-green-600/20">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 md:w-48">
              {seller.stats.map((stat, index) => (
                <div key={index} className="text-center p-3 rounded-lg bg-white/5">
                  <p className="text-2xl font-mono-jet font-bold text-primary">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Profile Ad */}
      <section className="container mx-auto px-4 py-8">
        <AdBanner placement="vendor-profile" />
      </section>

      {/* Listings & Services */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="listings" className="w-full">
              <TabsList className="glass-card border border-white/10 p-1 mb-6">
                <TabsTrigger value="listings">
                  <Package className="h-4 w-4 mr-2" />
                  Annonces ({seller.listings})
                </TabsTrigger>
                <TabsTrigger value="services">
                  <Wrench className="h-4 w-4 mr-2" />
                  Services ({seller.services})
                </TabsTrigger>
                <TabsTrigger value="reviews">
                  <Star className="h-4 w-4 mr-2" />
                  Avis ({seller.reviews})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="listings">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sellerListings.map((listing, index) => (
                    <motion.div
                      key={listing.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card rounded-xl border border-white/10 overflow-hidden group hover:border-primary/50 transition-all"
                    >
                      <div className="aspect-square overflow-hidden relative">
                        <img 
                          src={listing.image} 
                          alt={listing.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge className="absolute top-3 left-3 bg-green-500/80 text-white">
                          {listing.condition}
                        </Badge>
                        <div className="absolute top-3 right-3 px-2 py-1 rounded bg-black/60 backdrop-blur-sm text-xs flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {listing.views}
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                          {listing.title}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-mono-jet font-bold text-primary">
                            {listing.price.toLocaleString()} MAD
                          </span>
                          <Button size="sm" variant="outline" className="border-primary text-primary">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 text-center">
                  <Button variant="outline" className="border-white/10">
                    Voir toutes les annonces
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="services">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {sellerServices.map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="glass-card rounded-xl border border-white/10 overflow-hidden group hover:border-primary/50 transition-all flex"
                    >
                      <div className="w-32 overflow-hidden">
                        <img 
                          src={service.image} 
                          alt={service.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div className="flex-1 p-4">
                        <Badge className="bg-primary/20 text-primary border-0 mb-2">
                          <Wrench className="h-3 w-3 mr-1" />
                          Service
                        </Badge>
                        <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors">
                          {service.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-lg font-mono-jet font-bold text-primary">
                              À partir de {service.priceFrom} MAD
                            </span>
                            <span className="text-xs text-muted-foreground ml-2">• {service.duration}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="reviews">
                <div className="glass-card rounded-xl p-6 border border-white/10 text-center text-muted-foreground">
                  <Star className="h-12 w-12 mx-auto mb-4 text-yellow-400" />
                  <p>Les avis des clients seront affichés ici</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="glass-card rounded-xl p-6 border border-white/10">
              <h3 className="font-grotesk font-semibold mb-4">Contact Rapide</h3>
              <div className="space-y-3">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  <Phone className="h-4 w-4 mr-2" />
                  Appeler
                </Button>
                <Button variant="outline" className="w-full border-green-600 text-green-400 hover:bg-green-600/20">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>

            {/* Safety Notice */}
            <div className="glass-card rounded-xl p-4 border border-yellow-500/20 bg-yellow-500/5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-200 text-sm mb-1">Conseils</h4>
                  <p className="text-xs text-muted-foreground">
                    Vérifiez toujours les produits avant achat. 
                    Rencontrez-vous dans un lieu public.
                  </p>
                </div>
              </div>
            </div>

            {/* Sidebar Ads */}
            <SidebarAd maxAds={2} />
          </div>
        </div>
      </section>

      {/* Footer Ad */}
      <section className="container mx-auto px-4 py-8">
        <AdBanner placement="footer" />
      </section>
    </PublicLayout>
  );
}
