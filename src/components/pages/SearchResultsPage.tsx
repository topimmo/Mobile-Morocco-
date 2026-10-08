import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, X, Filter, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PublicLayout } from '@/components/layout';
import { ListingCard } from '@/components/cards';
import { EmptyState } from '@/components/shared';
import { AdBanner, SidebarAd, FooterAd } from '@/components/ads';

const searchResults = [
  {
    id: 1,
    title: 'iPhone 15 Pro Max 256GB',
    price: 14999,
    condition: 'Neuf',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80',
    location: 'Casablanca',
    seller: 'TechImport Maroc',
    sellerType: 'Fournisseur',
    views: 234,
  },
  {
    id: 2,
    title: 'iPhone 15 Pro 128GB',
    price: 12999,
    condition: 'Neuf',
    image: 'https://images.unsplash.com/photo-1695048133098-792f7c8e3b0c?w=400&q=80',
    location: 'Rabat',
    seller: 'MobileShop Casa',
    sellerType: 'Vendeur',
    views: 189,
  },
  {
    id: 3,
    title: 'iPhone 15 128GB',
    price: 10999,
    condition: 'Occasion',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&q=80',
    location: 'Marrakech',
    seller: 'Ahmed',
    sellerType: 'Particulier',
    views: 156,
  },
  {
    id: 4,
    title: 'Coque iPhone 15 Pro Max - Protection',
    price: 199,
    condition: 'Neuf',
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&q=80',
    location: 'Casablanca',
    seller: 'AccessoiresPro',
    sellerType: 'Fournisseur',
    views: 98,
  },
];

const suggestedSearches = ['iPhone 15 Pro', 'Samsung S24', 'Réparation écran', 'Chargeur rapide', 'Coque protection'];

export function SearchResultsPage() {
  const [searchQuery, setSearchQuery] = useState('iPhone 15');

  return (
    <PublicLayout>
      {/* Search Header */}
      <section className="border-b border-white/5">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#64748B]" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher un produit ou service..."
                className="pl-12 h-12 bg-white/5 border-white/10 text-base"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/10 rounded-full">
                  <X className="h-4 w-4 text-[#64748B]" />
                </button>
              )}
            </div>
            <Button className="h-12 px-6 bg-[#E67E22] hover:bg-[#D35400] text-white">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-xs text-[#64748B]">Suggestions:</span>
            {suggestedSearches.map((s) => (
              <button key={s} onClick={() => setSearchQuery(s)} className="px-3 py-1 text-xs rounded-full bg-white/5 text-[#A0AEC0] hover:bg-white/10 hover:text-white transition-colors">
                {s}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Ad */}
      <section className="container mx-auto px-4 py-4">
        <AdBanner placement="search" />
      </section>

      {/* Results */}
      <section className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-grotesk font-semibold text-white">
                Résultats pour "<span className="text-[#E67E22]">{searchQuery}</span>"
              </h2>
              <span className="text-xs text-[#64748B]">{searchResults.length} annonces</span>
            </div>

            {searchResults.length > 0 ? (
              <>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </motion.div>
                <div className="text-center mt-8">
                  <Button variant="outline" className="border-white/10 text-[#A0AEC0] px-8">Charger plus</Button>
                </div>
              </>
            ) : (
              <EmptyState type="search" />
            )}
          </div>

          <div className="space-y-6">
            <div className="rounded-xl p-4 border border-white/10 bg-white/[0.03]">
              <h3 className="font-grotesk font-semibold text-white text-sm mb-3">Recherches associées</h3>
              <div className="space-y-1.5">
                {['iPhone 15 Pro Max', 'iPhone 14', 'Réparation iPhone', 'Coque iPhone', 'Écran iPhone'].map((term) => (
                  <button key={term} onClick={() => setSearchQuery(term)} className="flex items-center gap-2 w-full text-left px-3 py-2 text-xs rounded-lg text-[#A0AEC0] hover:bg-white/5 hover:text-white transition-colors">
                    <Search className="h-3 w-3 text-[#64748B]" />
                    {term}
                  </button>
                ))}
              </div>
            </div>
            <SidebarAd maxAds={2} />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-6"><FooterAd /></section>
    </PublicLayout>
  );
}
