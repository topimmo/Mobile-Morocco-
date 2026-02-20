import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ChevronRight, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PublicLayout } from '@/components/layout';
import { StoreCard } from '@/components/cards';
import { EmptyState } from '@/components/shared';

const stores = [
  { id: 1, name: 'TechImport Maroc', logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=100&q=80', type: 'Fournisseur', location: 'Casablanca', rating: 4.8, reviews: 342, listings: 45, verified: true },
  { id: 2, name: 'MobileShop Rabat', logo: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=100&q=80', type: 'Vendeur', location: 'Rabat', rating: 4.6, reviews: 189, listings: 32, verified: true },
  { id: 3, name: 'TechRepair Casa', logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100&q=80', type: 'Réparateur', location: 'Casablanca', rating: 4.9, reviews: 245, listings: 12, verified: true },
  { id: 4, name: 'Parts Express', logo: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=100&q=80', type: 'Fournisseur', location: 'Marrakech', rating: 4.5, reviews: 98, listings: 67, verified: false },
  { id: 5, name: 'Digital Store', logo: 'https://images.unsplash.com/photo-1572021335469-31706a17ced0?w=100&q=80', type: 'Vendeur', location: 'Tanger', rating: 4.3, reviews: 56, listings: 23, verified: true },
  { id: 6, name: 'Phone Fix Pro', logo: 'https://images.unsplash.com/photo-1560264280-88b68371db39?w=100&q=80', type: 'Réparateur', location: 'Fès', rating: 4.7, reviews: 134, listings: 8, verified: true },
  { id: 7, name: 'Accessoire World', logo: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=100&q=80', type: 'Fournisseur', location: 'Agadir', rating: 4.4, reviews: 76, listings: 89, verified: false },
  { id: 8, name: 'Smart Repair', logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=100&q=80', type: 'Réparateur', location: 'Meknès', rating: 4.6, reviews: 112, listings: 15, verified: true },
];

const cities = ['Toutes les villes', 'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir', 'Meknès'];

const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export function StoresPage() {
  return (
    <PublicLayout>
      {/* Breadcrumb */}
      <div className="border-b border-white/5">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <Link to="/" className="hover:text-[#E67E22] transition-colors">Accueil</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">Boutiques</span>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-grotesk font-bold text-white">Toutes les Boutiques</h1>
            <p className="text-sm text-[#64748B] mt-1">{stores.length} boutiques vérifiées sur la plateforme</p>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
              <Input placeholder="Rechercher une boutique..." className="pl-10 h-10 bg-white/5 border-white/10 text-sm" />
            </div>
            <Select defaultValue="Toutes les villes">
              <SelectTrigger className="w-[160px] bg-white/5 border-white/10 h-10 text-xs">
                <MapPin className="h-3.5 w-3.5 mr-1.5 text-[#64748B]" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cities.map((city) => (<SelectItem key={city} value={city}>{city}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Stores Grid */}
      <section className="container mx-auto px-4 pb-12">
        {stores.length > 0 ? (
          <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {stores.map((store) => (
              <motion.div key={store.id} variants={fadeUp}>
                <StoreCard store={store} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyState type="stores" />
        )}
      </section>
    </PublicLayout>
  );
}
