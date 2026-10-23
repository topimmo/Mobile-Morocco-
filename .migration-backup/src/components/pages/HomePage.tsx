import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search, ChevronRight, Star, Phone, MapPin, Wrench, Store,
  Smartphone, Settings, Package, Monitor, Cpu, HardDrive,
  ArrowRight, Shield, Clock, MessageCircle, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PublicLayout } from '@/components/layout';
import { ListingCard, FeaturedListingCard, StoreCard } from '@/components/cards';
import { AdBanner, SidebarAd, FooterAd } from '@/components/ads';

const featuredListings = [
  {
    id: 1,
    title: 'iPhone 15 Pro Max 256GB',
    price: 14999,
    condition: 'Neuf',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80',
    location: 'Casablanca',
    seller: 'TechImport Maroc',
    sellerType: 'Vendeur',
    views: 234,
  },
  {
    id: 2,
    title: 'Samsung Galaxy S24 Ultra',
    price: 13499,
    condition: 'Neuf',
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80',
    location: 'Rabat',
    seller: 'MobileShop',
    sellerType: 'Fournisseur',
    views: 189,
  },
  {
    id: 3,
    title: 'Google Pixel 8 Pro',
    price: 10999,
    condition: 'Occasion',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80',
    location: 'Marrakech',
    seller: 'Ahmed Electronics',
    sellerType: 'Vendeur',
    views: 156,
  },
  {
    id: 4,
    title: 'Écran iPhone 14 Pro - Pièce',
    price: 1200,
    condition: 'Neuf',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80',
    location: 'Fès',
    seller: 'Pièces Mobile Pro',
    sellerType: 'Fournisseur',
    views: 98,
  },
  {
    id: 5,
    title: 'MacBook Pro M3 14"',
    price: 22999,
    condition: 'Neuf',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
    location: 'Casablanca',
    seller: 'Apple Store MA',
    sellerType: 'Fournisseur',
    views: 312,
  },
  {
    id: 6,
    title: 'Batterie Samsung Galaxy S23',
    price: 350,
    condition: 'Neuf',
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80',
    location: 'Tanger',
    seller: 'PiècesMobile',
    sellerType: 'Fournisseur',
    views: 87,
  },
];

const categories = [
  { name: 'Smartphones', count: 1250, icon: Smartphone, path: '/phones', color: 'from-blue-500/20 to-blue-600/10' },
  { name: 'Pièces Téléphones', count: 890, icon: Settings, path: '/phone-parts', color: 'from-purple-500/20 to-purple-600/10' },
  { name: 'Ordinateurs', count: 680, icon: Monitor, path: '/computers', color: 'from-green-500/20 to-green-600/10' },
  { name: 'Pièces Ordinateurs', count: 420, icon: Cpu, path: '/computer-parts', color: 'from-cyan-500/20 to-cyan-600/10' },
  { name: 'Équipements', count: 560, icon: HardDrive, path: '/equipment', color: 'from-orange-500/20 to-orange-600/10' },
  { name: 'Réparation', count: 340, icon: Wrench, path: '/repair/phones', color: 'from-red-500/20 to-red-600/10' },
];

const communityCards = [
  {
    title: 'Vendeurs',
    description: 'Publiez vos produits et touchez des milliers d\'acheteurs.',
    icon: Store,
    color: 'bg-green-500/15 text-green-400',
    count: '2,400+',
    link: '/register',
  },
  {
    title: 'Techniciens',
    description: 'Proposez vos services de réparation et trouvez des clients.',
    icon: Wrench,
    color: 'bg-blue-500/15 text-blue-400',
    count: '850+',
    link: '/register',
  },
  {
    title: 'Boutiques',
    description: 'Créez votre vitrine en ligne et fidélisez vos clients.',
    icon: Package,
    color: 'bg-purple-500/15 text-purple-400',
    count: '320+',
    link: '/stores',
  },
  {
    title: 'Annonceurs',
    description: 'Atteignez votre audience avec des publicités ciblées.',
    icon: Zap,
    color: 'bg-orange-500/15 text-orange-400',
    count: '150+',
    link: '/register',
  },
];

const featuredServices = [
  {
    id: 1,
    title: 'Réparation Écran iPhone',
    provider: 'TechRepair Casa',
    location: 'Casablanca',
    rating: 4.9,
    reviews: 128,
    price: 'À partir de 400 MAD',
    image: 'https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?w=400&q=80',
  },
  {
    id: 2,
    title: 'Déblocage Samsung',
    provider: 'Mobile Expert',
    location: 'Rabat',
    rating: 4.7,
    reviews: 89,
    price: 'À partir de 200 MAD',
    image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80',
  },
  {
    id: 3,
    title: 'Réparation Carte Mère',
    provider: 'ProTech Repair',
    location: 'Tanger',
    rating: 4.8,
    reviews: 67,
    price: 'À partir de 500 MAD',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
  },
];

const topStores = [
  { id: 1, name: 'TechImport Maroc', logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&q=80', type: 'Fournisseur', location: 'Casablanca', rating: 4.8, reviews: 342, listings: 45, verified: true },
  { id: 2, name: 'MobileShop Rabat', logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&q=80', type: 'Vendeur', location: 'Rabat', rating: 4.6, reviews: 189, listings: 32, verified: true },
  { id: 3, name: 'TechRepair Casa', logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&q=80', type: 'Réparateur', location: 'Casablanca', rating: 4.9, reviews: 245, listings: 12, verified: true },
  { id: 4, name: 'Parts Express', logo: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=100&q=80', type: 'Fournisseur', location: 'Marrakech', rating: 4.5, reviews: 98, listings: 67, verified: false },
];

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export function HomePage() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E67E22]/10 via-transparent to-[#00D9FF]/5" />
        <div className="absolute inset-0 grid-pattern" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-[#E67E22]/10 text-[#E67E22] border border-[#E67E22]/20 px-3 py-1">
              <Smartphone className="h-3 w-3 mr-1.5" />
              La marketplace #1 au Maroc
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-grotesk font-bold text-white mb-4 leading-tight">
              Achetez & Vendez du{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E67E22] to-[#F39C12]">Mobile & Tech</span>{' '}
              au Maroc
            </h1>
            <p className="text-base md:text-lg text-[#A0AEC0] mb-8 max-w-xl mx-auto">
              Trouvez des smartphones, ordinateurs, pièces détachées et services de réparation. Contactez directement les vendeurs.
            </p>
            <form className="flex gap-2 max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B]" />
                <Input placeholder="Rechercher un produit, service ou boutique..." className="pl-12 h-12 md:h-14 bg-white/5 border-white/10 text-sm md:text-base placeholder:text-[#64748B]" />
              </div>
              <Button className="h-12 md:h-14 px-6 md:px-8 bg-[#E67E22] hover:bg-[#D35400] text-white font-medium">Rechercher</Button>
            </form>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs md:text-sm text-[#64748B]">
              <span className="flex items-center gap-1.5"><Package className="h-4 w-4 text-[#E67E22]" /><strong className="text-white">5,200+</strong> annonces</span>
              <span className="flex items-center gap-1.5"><Store className="h-4 w-4 text-[#E67E22]" /><strong className="text-white">320+</strong> boutiques</span>
              <span className="flex items-center gap-1.5"><Wrench className="h-4 w-4 text-[#E67E22]" /><strong className="text-white">850+</strong> techniciens</span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-6"><AdBanner placement="homepage" /></section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-grotesk font-bold text-white">Catégories</h2>
            <p className="text-sm text-[#64748B] mt-1">Parcourez par catégorie</p>
          </div>
          <Link to="/phones"><Button variant="ghost" className="text-[#E67E22] hover:bg-[#E67E22]/10 gap-1 text-sm">Tout voir <ChevronRight className="h-4 w-4" /></Button></Link>
        </div>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {categories.map((category) => (
            <motion.div key={category.name} variants={fadeUp}>
              <Link to={category.path}>
                <div className={`rounded-xl p-4 md:p-5 border border-white/10 bg-gradient-to-br ${category.color} hover:border-[#E67E22]/40 transition-all duration-200 hover:-translate-y-1 group cursor-pointer`}>
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/10 flex items-center justify-center mb-3">
                    <category.icon className="h-5 w-5 md:h-6 md:w-6 text-white group-hover:text-[#E67E22] transition-colors" />
                  </div>
                  <h3 className="font-grotesk font-semibold text-white text-xs md:text-sm group-hover:text-[#E67E22] transition-colors">{category.name}</h3>
                  <p className="font-mono-jet text-[10px] md:text-xs text-[#64748B] mt-1">{category.count.toLocaleString()} annonces</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Community */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-xl md:text-2xl font-grotesk font-bold text-white">Rejoignez Notre Communauté</h2>
          <p className="text-sm text-[#64748B] mt-1">Créez votre profil et commencez dès aujourd'hui</p>
        </div>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {communityCards.map((card) => (
            <motion.div key={card.title} variants={fadeUp}>
              <Link to={card.link}>
                <div className="rounded-xl p-5 border border-white/10 bg-white/[0.03] hover:border-[#E67E22]/40 hover:bg-white/[0.05] transition-all duration-200 group text-center h-full">
                  <div className={`w-12 h-12 rounded-xl ${card.color} flex items-center justify-center mx-auto mb-4`}><card.icon className="h-6 w-6" /></div>
                  <h3 className="font-grotesk font-semibold text-white text-sm group-hover:text-[#E67E22] transition-colors">{card.title}</h3>
                  <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">{card.description}</p>
                  <p className="font-mono-jet text-lg font-bold text-[#E67E22] mt-3">{card.count}</p>
                  <p className="text-[10px] text-[#64748B] uppercase tracking-wider">inscrits</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Featured Listings */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-grotesk font-bold text-white">Annonces Récentes</h2>
            <p className="text-sm text-[#64748B] mt-1">Les dernières annonces publiées</p>
          </div>
          <Link to="/search"><Button variant="ghost" className="text-[#E67E22] hover:bg-[#E67E22]/10 gap-1 text-sm">Tout voir <ChevronRight className="h-4 w-4" /></Button></Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <motion.div variants={fadeUp}><FeaturedListingCard listing={featuredListings[0]} /></motion.div>
              {featuredListings.slice(1).map((listing) => (
                <motion.div key={listing.id} variants={fadeUp}><ListingCard listing={listing} /></motion.div>
              ))}
            </motion.div>
          </div>
          <div className="space-y-6">
            <SidebarAd maxAds={2} />
            <div className="rounded-xl border border-[#E67E22]/20 bg-gradient-to-b from-[#E67E22]/10 to-transparent p-5">
              <h3 className="font-grotesk font-semibold text-white text-sm mb-2">Vous vendez ?</h3>
              <p className="text-xs text-[#64748B] mb-4">Publiez votre annonce gratuitement et touchez des milliers d'acheteurs.</p>
              <Link to="/post-ad"><Button className="w-full bg-[#E67E22] hover:bg-[#D35400] text-white text-sm gap-1.5">Publier une Annonce <ArrowRight className="h-4 w-4" /></Button></Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="rounded-2xl bg-gradient-to-br from-white/[0.03] to-white/[0.01] border border-white/10 p-6 md:p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl md:text-2xl font-grotesk font-bold text-white">Services de Réparation</h2>
                <p className="text-sm text-[#64748B] mt-1">Trouvez un technicien près de chez vous</p>
              </div>
              <Link to="/repair/phones"><Button variant="ghost" className="text-[#E67E22] hover:bg-[#E67E22]/10 gap-1 text-sm">Tout voir <ChevronRight className="h-4 w-4" /></Button></Link>
            </div>
            <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {featuredServices.map((service) => (
                <motion.div key={service.id} variants={fadeUp}>
                  <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden group hover:border-[#E67E22]/40 transition-all duration-200">
                    <div className="relative h-40 overflow-hidden">
                      <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      <div className="absolute bottom-3 left-3"><Badge className="bg-[#E67E22] text-white text-[10px]"><Wrench className="h-3 w-3 mr-1" />Service</Badge></div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-sm text-white group-hover:text-[#E67E22] transition-colors">{service.title}</h3>
                      <div className="flex items-center gap-2 mt-2 text-xs text-[#64748B]"><Shield className="h-3 w-3 text-[#00D9FF]" /><span>{service.provider}</span></div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-[#64748B]">
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{service.location}</span>
                        <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />{service.rating} ({service.reviews})</span>
                      </div>
                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
                        <span className="font-mono-jet text-sm font-bold text-[#E67E22]">{service.price}</span>
                        <Button size="sm" variant="ghost" className="text-[#E67E22] hover:bg-[#E67E22]/10 text-xs h-7"><MessageCircle className="h-3.5 w-3.5 mr-1" />Contact</Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Top Stores */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl md:text-2xl font-grotesk font-bold text-white">Boutiques Populaires</h2>
            <p className="text-sm text-[#64748B] mt-1">Les meilleurs vendeurs de la plateforme</p>
          </div>
          <Link to="/stores"><Button variant="ghost" className="text-[#E67E22] hover:bg-[#E67E22]/10 gap-1 text-sm">Tout voir <ChevronRight className="h-4 w-4" /></Button></Link>
        </div>
        <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topStores.map((store) => (
            <motion.div key={store.id} variants={fadeUp}><StoreCard store={store} /></motion.div>
          ))}
        </motion.div>
      </section>

      {/* Trust Signals */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Shield, label: 'Vendeurs Vérifiés', desc: 'Profils authentiques' },
            { icon: Clock, label: 'Réponse Rapide', desc: 'Contactez en 1 clic' },
            { icon: Star, label: 'Avis Clients', desc: 'Évaluations réelles' },
            { icon: MapPin, label: 'Proximité', desc: 'Trouvez près de vous' },
          ].map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center p-4 md:p-5 rounded-xl border border-white/5 bg-white/[0.02]">
              <item.icon className="h-6 w-6 text-[#E67E22] mx-auto mb-2" />
              <h4 className="font-grotesk font-semibold text-white text-xs md:text-sm">{item.label}</h4>
              <p className="text-[10px] md:text-xs text-[#64748B] mt-0.5">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 py-6"><FooterAd /></section>
    </PublicLayout>
  );
}
