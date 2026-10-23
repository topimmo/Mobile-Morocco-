import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ChevronRight, MapPin, Star, Shield, Wrench, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PublicLayout } from '@/components/layout';
import { EmptyState } from '@/components/shared';

const services = [
  { id: 1, title: 'Réparation Écran iPhone', provider: 'TechRepair Casa', location: 'Casablanca', rating: 4.9, reviews: 128, price: 'À partir de 400 MAD', image: 'https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?w=400&q=80', verified: true },
  { id: 2, title: 'Déblocage Samsung', provider: 'Mobile Expert', location: 'Rabat', rating: 4.7, reviews: 89, price: 'À partir de 200 MAD', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80', verified: true },
  { id: 3, title: 'Réparation Carte Mère', provider: 'ProTech Repair', location: 'Tanger', rating: 4.8, reviews: 67, price: 'À partir de 500 MAD', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80', verified: false },
  { id: 4, title: 'Changement Batterie', provider: 'BatteryPro Maroc', location: 'Fès', rating: 4.6, reviews: 102, price: 'À partir de 200 MAD', image: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&q=80', verified: true },
  { id: 5, title: 'Réparation Port Charge', provider: 'SmartFix', location: 'Marrakech', rating: 4.5, reviews: 54, price: 'À partir de 300 MAD', image: 'https://images.unsplash.com/photo-1597740985671-2a8a3b80502e?w=400&q=80', verified: true },
  { id: 6, title: 'Réparation PC Portable', provider: 'PC Doctor', location: 'Casablanca', rating: 4.8, reviews: 198, price: 'À partir de 350 MAD', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80', verified: true },
];

const cities = ['Toutes les villes', 'Casablanca', 'Rabat', 'Marrakech', 'Fès', 'Tanger', 'Agadir'];

const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const fadeUp = { hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

export function ServicesPage() {
  return (
    <PublicLayout>
      <div className="border-b border-white/5">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <Link to="/" className="hover:text-[#E67E22] transition-colors">Accueil</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white">Services de Réparation</span>
          </div>
        </div>
      </div>

      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-grotesk font-bold text-white">Services de Réparation</h1>
            <p className="text-sm text-[#64748B] mt-1">Trouvez un technicien certifié près de chez vous</p>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#64748B]" />
              <Input placeholder="Rechercher un service..." className="pl-10 h-10 bg-white/5 border-white/10 text-sm" />
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

      <section className="container mx-auto px-4 pb-12">
        {services.length > 0 ? (
          <motion.div variants={stagger} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((service) => (
              <motion.div key={service.id} variants={fadeUp}>
                <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden group hover:border-[#E67E22]/40 transition-all duration-200">
                  <div className="relative h-44 overflow-hidden">
                    <img src={service.image} alt={service.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <Badge className="bg-[#E67E22] text-white text-[10px] mb-2">
                        <Wrench className="h-3 w-3 mr-1" />
                        Service
                      </Badge>
                      <h3 className="font-semibold text-white text-sm">{service.title}</h3>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-xs text-[#A0AEC0]">
                      {service.verified && <Shield className="h-3.5 w-3.5 text-[#00D9FF]" />}
                      <span className="font-medium">{service.provider}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-[#64748B]">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{service.location}</span>
                      <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />{service.rating} ({service.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                      <span className="font-mono-jet text-sm font-bold text-[#E67E22]">{service.price}</span>
                      <div className="flex gap-1.5">
                        <Button size="sm" variant="ghost" className="text-green-400 hover:bg-green-500/10 h-8 px-2.5">
                          <Phone className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-[#E67E22] hover:bg-[#E67E22]/10 h-8 px-2.5">
                          <MessageCircle className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <EmptyState type="services" />
        )}
      </section>
    </PublicLayout>
  );
}
