import { Link } from 'react-router-dom';
import { MapPin, Star, ChevronRight, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface StoreCardData {
  id: number | string;
  name: string;
  logo: string;
  type: string;
  location: string;
  rating: number;
  reviews: number;
  listings: number;
  verified?: boolean;
}

interface StoreCardProps {
  store: StoreCardData;
}

export function StoreCard({ store }: StoreCardProps) {
  return (
    <Link to={`/vendor/${store.id}`} className="block">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 group hover:border-[#E67E22]/40 hover:bg-white/[0.05] transition-all duration-200">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/5 flex-shrink-0 border border-white/10">
            <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm text-white group-hover:text-[#E67E22] transition-colors truncate">
                {store.name}
              </h3>
              {store.verified && (
                <Shield className="h-3.5 w-3.5 text-[#00D9FF] flex-shrink-0" />
              )}
            </div>
            <Badge variant="outline" className="text-[10px] border-white/10 text-[#A0AEC0] mt-1">
              {store.type}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-4 text-xs text-[#64748B]">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {store.location}
          </span>
          <span className="flex items-center gap-1">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            {store.rating}
            <span className="text-[#64748B]">({store.reviews})</span>
          </span>
        </div>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
          <span className="text-xs text-[#64748B]">{store.listings} annonces</span>
          <Button
            size="sm"
            variant="ghost"
            className="text-[#E67E22] hover:bg-[#E67E22]/10 text-xs h-7 px-2 gap-1"
            onClick={(e) => e.preventDefault()}
          >
            Voir
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
