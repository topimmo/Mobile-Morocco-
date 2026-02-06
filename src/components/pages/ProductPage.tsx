import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Phone, MessageCircle, Share2, MapPin, ChevronRight, Store, Eye, Calendar, AlertTriangle, Flag, Heart, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PublicLayout } from '@/components/layout';
import { ListingCard } from '@/components/cards';
import { AdBanner, SidebarAd } from '@/components/ads';

const listing = {
  id: 1,
  title: 'iPhone 15 Pro Max 256GB - Titanium Blue',
  price: 14999,
  condition: 'Neuf',
  images: [
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80',
    'https://images.unsplash.com/photo-1695048133098-792f7c8e3b0c?w=600&q=80',
    'https://images.unsplash.com/photo-1695048132832-b41495f4e8e5?w=600&q=80',
  ],
  views: 234,
  postedDate: '15 Janvier 2024',
  description: 'iPhone 15 Pro Max 256GB couleur Titanium Blue. Appareil neuf, sous emballage scellé avec garantie Apple. Importé directement des États-Unis. Facture disponible sur demande.',
  specs: [
    { label: 'Marque', value: 'Apple' },
    { label: 'Modèle', value: 'iPhone 15 Pro Max' },
    { label: 'Stockage', value: '256 GB' },
    { label: 'Couleur', value: 'Titanium Blue' },
    { label: 'État', value: 'Neuf sous emballage' },
    { label: 'Garantie', value: 'Apple 1 an' },
  ],
  seller: {
    name: 'TechImport Maroc',
    type: 'Fournisseur',
    location: 'Casablanca',
    rating: 4.8,
    reviews: 128,
    memberSince: 'Janvier 2022',
    responseTime: '< 1 heure',
    verified: true,
    phone: '+212 6XX-XXXXXX',
    whatsapp: '+212 6XX-XXXXXX',
  },
};

const relatedListings = [
  {
    id: 2,
    title: 'iPhone 15 Pro 128GB',
    price: 12999,
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=300&q=80',
    location: 'Rabat',
    condition: 'Neuf',
  },
  {
    id: 3,
    title: 'Samsung Galaxy S24 Ultra',
    price: 13499,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=300&q=80',
    location: 'Casablanca',
    condition: 'Neuf',
  },
  {
    id: 4,
    title: 'Google Pixel 8 Pro',
    price: 10999,
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=300&q=80',
    location: 'Marrakech',
    condition: 'Occasion',
  },
];

export function ProductPage() {
  return (
    <PublicLayout>
      {/* Breadcrumb */}
      <div className="border-b border-white/5">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <Link to="/" className="hover:text-[#E67E22] transition-colors">Accueil</Link>
            <ChevronRight className="h-3 w-3" />
            <Link to="/phones" className="hover:text-[#E67E22] transition-colors">Smartphones</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white truncate">{listing.title}</span>
          </div>
        </div>
      </div>

      {/* Listing Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Listing Images */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="aspect-square rounded-xl overflow-hidden glass-card border border-white/10"
              >
                <img 
                  src={listing.images[0]} 
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              </motion.div>
              <div className="grid grid-cols-2 gap-4">
                {listing.images.slice(1).map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (index + 1) * 0.1 }}
                    className="aspect-square rounded-xl overflow-hidden glass-card border border-white/10"
                  >
                    <img 
                      src={image} 
                      alt={`${listing.title} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </motion.div>
                ))}
                
                {/* Ad in gallery */}
                <div className="aspect-square">
                  <AdBanner placement="product" />
                </div>
              </div>
            </div>
          </div>

          {/* Listing Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge className="bg-green-500/20 text-green-400 border-0">
                  {listing.condition}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  {listing.views} vues
                </div>
              </div>
              <h1 className="text-2xl font-grotesk font-bold mb-2">{listing.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Calendar className="h-4 w-4" />
                Publié le {listing.postedDate}
              </div>
            </div>

            {/* Price */}
            <div className="glass-card rounded-xl p-6 border border-white/10">
              <p className="text-4xl font-mono-jet font-bold text-primary mb-4">
                {listing.price.toLocaleString()} MAD
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Prix indicatif - Négociez directement avec le vendeur
              </p>

              {/* Contact Buttons */}
              <div className="space-y-3">
                <Button className="w-full h-12 bg-green-600 hover:bg-green-700 text-lg">
                  <Phone className="h-5 w-5 mr-2" />
                  Appeler: {listing.seller.phone}
                </Button>
                <Button variant="outline" className="w-full h-12 border-green-600 text-green-400 hover:bg-green-600/20">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  WhatsApp
                </Button>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1 border-white/10">
                  <Heart className="h-4 w-4 mr-1" />
                  Sauvegarder
                </Button>
                <Button variant="outline" size="sm" className="flex-1 border-white/10">
                  <Share2 className="h-4 w-4 mr-1" />
                  Partager
                </Button>
              </div>
            </div>

            {/* Seller Info */}
            <div className="glass-card rounded-xl p-4 border border-white/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Store className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{listing.seller.name}</span>
                    {listing.seller.verified && (
                      <Badge className="bg-accent/20 text-accent border-0 text-xs">Vérifié</Badge>
                    )}
                  </div>
                  <Badge variant="outline" className="text-xs mt-1">
                    {listing.seller.type}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {listing.seller.location}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  Répond en {listing.seller.responseTime}
                </div>
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{listing.seller.rating}</span>
                  <span className="text-muted-foreground">({listing.seller.reviews} avis)</span>
                </div>
                <div className="text-muted-foreground">
                  Membre depuis {listing.seller.memberSince}
                </div>
              </div>

              <Button variant="outline" size="sm" className="w-full mt-4 border-white/10">
                Voir le profil du vendeur
              </Button>
            </div>

            {/* Report Button */}
            <Button variant="ghost" size="sm" className="w-full text-muted-foreground">
              <Flag className="h-4 w-4 mr-2" />
              Signaler cette annonce
            </Button>

            {/* Sidebar Ad */}
            <SidebarAd maxAds={1} />
          </div>
        </div>
      </section>

      {/* Listing Details Tabs */}
      <section className="container mx-auto px-4 py-8">
        <Tabs defaultValue="description" className="w-full">
          <TabsList className="glass-card border border-white/10 p-1">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specs">Caractéristiques</TabsTrigger>
          </TabsList>
          
          <TabsContent value="description" className="mt-6">
            <div className="glass-card rounded-xl p-6 border border-white/10">
              <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{listing.description}</p>
            </div>
          </TabsContent>
          
          <TabsContent value="specs" className="mt-6">
            <div className="glass-card rounded-xl p-6 border border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {listing.specs.map((spec, index) => (
                  <div key={index} className="flex justify-between py-3 border-b border-white/10 last:border-0">
                    <span className="text-muted-foreground">{spec.label}</span>
                    <span className="font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* Safety Notice */}
      <section className="container mx-auto px-4 py-8">
        <div className="glass-card rounded-xl p-6 border border-yellow-500/20 bg-yellow-500/5">
          <div className="flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h4 className="font-semibold text-yellow-200 mb-2">Conseils de Sécurité</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Rencontrez le vendeur dans un lieu public et sûr</li>
                <li>• Vérifiez le produit avant tout échange d'argent</li>
                <li>• Méfiez-vous des prix trop bas ou des offres trop belles</li>
                <li>• Ne partagez jamais vos informations bancaires</li>
                <li>• Mobile Maroc ne participe à aucune transaction</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Related Listings */}
      <section className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-grotesk font-bold mb-6">Annonces Similaires</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedListings.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card rounded-xl border border-white/10 overflow-hidden group hover:border-primary/50 transition-all"
            >
              <div className="aspect-square overflow-hidden relative">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-3 left-3 bg-green-500/80 text-white">
                  {item.condition}
                </Badge>
              </div>
              <div className="p-4">
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {item.location}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-mono-jet font-bold text-primary">
                    {item.price.toLocaleString()} MAD
                  </span>
                  <Button size="sm" variant="outline" className="border-primary text-primary">
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer Ad */}
      <section className="container mx-auto px-4 py-8">
        <AdBanner placement="footer" />
      </section>
    </PublicLayout>
  );
}
