import { useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ChevronRight, ChevronDown, SlidersHorizontal, Grid, List, MapPin, Filter, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PublicLayout } from '@/components/layout';
import { ListingCard } from '@/components/cards';
import { EmptyState } from '@/components/shared';
import { AdBanner, SidebarAd, FooterAd } from '@/components/ads';

const listings = [
  { id: 1, title: 'iPhone 15 Pro Max 256GB', price: 14999, condition: 'Neuf', image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400&q=80', location: 'Casablanca', seller: 'TechImport Maroc', sellerType: 'Fournisseur', views: 234, postedDate: '2 jours' },
  { id: 2, title: 'Samsung Galaxy S24 Ultra', price: 13499, condition: 'Neuf', image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80', location: 'Rabat', seller: 'MobileShop', sellerType: 'Vendeur', views: 189, postedDate: '3 jours' },
  { id: 3, title: 'Google Pixel 8 Pro', price: 10999, condition: 'Occasion', image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80', location: 'Marrakech', seller: 'Ahmed', sellerType: 'Particulier', views: 156, postedDate: '5 jours' },
  { id: 4, title: 'OnePlus 12', price: 8999, condition: 'Neuf', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&q=80', location: 'Fès', seller: 'OnePlus Store', sellerType: 'Fournisseur', views: 98, postedDate: '1 semaine' },
  { id: 5, title: 'Xiaomi 14 Pro', price: 7999, condition: 'Neuf', image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&q=80', location: 'Tanger', seller: 'Xiaomi Maroc', sellerType: 'Vendeur', views: 145, postedDate: '4 jours' },
  { id: 6, title: 'Oppo Find X7 Ultra', price: 9499, condition: 'Occasion', image: 'https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=400&q=80', location: 'Agadir', seller: 'Mohammed', sellerType: 'Particulier', views: 67, postedDate: '1 jour' },
];

const CATEGORY_MAP: Record<string, { title: string; count: number }> = {
  '/phones': { title: 'Smartphones', count: 1250 },
  '/phone-parts': { title: 'Pièces Téléphones', count: 890 },
  '/computers': { title: 'Ordinateurs', count: 680 },
  '/computer-parts': { title: 'Pièces Ordinateurs', count: 420 },
  '/equipment': { title: 'Équipements', count: 560 },
  '/category': { title: 'Toutes les catégories', count: 3800 },
};

const cities = ['Toutes les villes', 'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès', 'Oujda'];
const conditions = ['Neuf', 'Occasion', 'Reconditionné'];
const priceRanges = ['Moins de 3000 MAD', '3000 - 6000 MAD', '6000 - 10000 MAD', 'Plus de 10000 MAD'];

const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export function CategoryPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('recent');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const location = useLocation();
  const { slug } = useParams();

  const categoryInfo = CATEGORY_MAP[location.pathname] || CATEGORY_MAP['/category'];
  const pageTitle = slug ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ') : categoryInfo.title;

  return (
    <PublicLayout>
      {/* Breadcrumb */}
      <div className="border-b border-white/5">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <Link to="/" className="hover:text-[#E67E22] transition-colors">Accueil</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">{pageTitle}</span>
          </div>
        </div>
      </div>

      {/* Category Header */}
      <section className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-grotesk font-bold text-white">{pageTitle}</h1>
            <p className="text-sm text-[#64748B] mt-1">{categoryInfo.count.toLocaleString()} annonces disponibles</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
              <Input placeholder="Rechercher dans cette catégorie..." className="pl-10 h-10 bg-white/5 border-white/10 text-sm" />
            </div>
            <Button variant="outline" className="lg:hidden border-white/10 text-[#A0AEC0] h-10" onClick={() => setFiltersOpen(!filtersOpen)}>
              <Filter className="h-4 w-4 mr-1.5" />
              Filtres
            </Button>
          </div>
        </div>
      </section>

      {/* Ad Banner */}
      <section className="container mx-auto px-4 pb-4">
        <AdBanner placement="category" />
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className={`space-y-4 ${filtersOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="flex items-center justify-between">
              <h3 className="font-grotesk font-semibold text-white text-sm flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filtres
              </h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-[#E67E22] text-xs h-7 px-2">Réinitialiser</Button>
                <Button variant="ghost" size="sm" className="lg:hidden text-[#64748B] h-7 px-2" onClick={() => setFiltersOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* City */}
            <div className="rounded-xl p-4 border border-white/10 bg-white/[0.03]">
              <h4 className="font-semibold text-white text-xs mb-3 flex items-center justify-between">
                <span className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> Ville</span>
                <ChevronDown className="h-3.5 w-3.5 text-[#64748B]" />
              </h4>
              <Select defaultValue="Toutes les villes">
                <SelectTrigger className="bg-white/5 border-white/10 h-9 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (<SelectItem key={city} value={city}>{city}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>

            {/* Condition */}
            <div className="rounded-xl p-4 border border-white/10 bg-white/[0.03]">
              <h4 className="font-semibold text-white text-xs mb-3 flex items-center justify-between">État <ChevronDown className="h-3.5 w-3.5 text-[#64748B]" /></h4>
              <div className="space-y-2.5">
                {conditions.map((condition) => (
                  <label key={condition} className="flex items-center gap-2.5 cursor-pointer group">
                    <Checkbox className="h-4 w-4" />
                    <span className="text-xs text-[#A0AEC0] group-hover:text-white transition-colors">{condition}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="rounded-xl p-4 border border-white/10 bg-white/[0.03]">
              <h4 className="font-semibold text-white text-xs mb-3 flex items-center justify-between">Prix <ChevronDown className="h-3.5 w-3.5 text-[#64748B]" /></h4>
              <div className="space-y-2.5">
                {priceRanges.map((range) => (
                  <label key={range} className="flex items-center gap-2.5 cursor-pointer group">
                    <Checkbox className="h-4 w-4" />
                    <span className="text-xs text-[#A0AEC0] group-hover:text-white transition-colors">{range}</span>
                  </label>
                ))}
              </div>
            </div>

            <SidebarAd maxAds={1} />
          </div>

          {/* Listings */}
          <div className="lg:col-span-3">
            {/* Sort & View */}
            <div className="flex items-center justify-between gap-4 mb-5">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px] bg-white/5 border-white/10 h-9 text-xs"><SelectValue placeholder="Trier par" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Plus récentes</SelectItem>
                  <SelectItem value="price-asc">Prix croissant</SelectItem>
                  <SelectItem value="price-desc">Prix décroissant</SelectItem>
                  <SelectItem value="views">Plus vues</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex items-center gap-1.5">
                <Button variant={viewMode === 'grid' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('grid')} className={`h-8 w-8 ${viewMode === 'grid' ? 'bg-[#E67E22]' : 'border-white/10'}`}>
                  <Grid className="h-3.5 w-3.5" />
                </Button>
                <Button variant={viewMode === 'list' ? 'default' : 'outline'} size="icon" onClick={() => setViewMode('list')} className={`h-8 w-8 ${viewMode === 'list' ? 'bg-[#E67E22]' : 'border-white/10'}`}>
                  <List className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {listings.length > 0 ? (
              <>
                <motion.div variants={stagger} initial="hidden" animate="visible" className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
                  {listings.map((listing) => (
                    <motion.div key={listing.id} variants={fadeUp}>
                      <ListingCard listing={listing} variant={viewMode === 'list' ? 'list' : 'default'} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2 mt-8">
                  <Button variant="outline" size="sm" className="border-white/10 text-xs">Précédent</Button>
                  <Button size="sm" className="bg-[#E67E22] text-xs h-8 w-8 p-0">1</Button>
                  <Button variant="outline" size="sm" className="border-white/10 text-xs h-8 w-8 p-0">2</Button>
                  <Button variant="outline" size="sm" className="border-white/10 text-xs h-8 w-8 p-0">3</Button>
                  <Button variant="outline" size="sm" className="border-white/10 text-xs">Suivant</Button>
                </div>
              </>
            ) : (
              <EmptyState type="listings" />
            )}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-6"><FooterAd /></section>
    </PublicLayout>
  );
}
