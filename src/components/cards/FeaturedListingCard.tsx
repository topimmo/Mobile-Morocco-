import { Link } from 'react-router-dom';
import { MapPin, Eye, Phone, Star, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ListingCardData } from './ListingCard';

interface FeaturedListingCardProps {
  listing: ListingCardData;
}

export function FeaturedListingCard({ listing }: FeaturedListingCardProps) {
  return (
    <Link to={`/listing/${listing.id}`} className="block">
      <div className="relative rounded-xl border border-[#E67E22]/30 bg-gradient-to-b from-[#E67E22]/5 to-white/[0.03] overflow-hidden group hover:border-[#E67E22]/60 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-200 hover:-translate-y-1">
        {/* Featured Badge */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-r from-[#E67E22] to-[#D35400] px-3 py-1.5 flex items-center gap-1.5">
          <Zap className="h-3 w-3 text-white" />
          <span className="text-[10px] font-semibold text-white uppercase tracking-wider">En Vedette</span>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden mt-0">
          <img
            src={listing.image}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-9 left-2.5 bg-green-500/80 text-white text-[10px] px-2 py-0.5">
            {listing.condition}
          </Badge>
          <div className="absolute top-9 right-2.5 flex items-center gap-1 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-[10px] text-white/80">
            <Eye className="h-3 w-3" />
            {listing.views}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-sm text-white group-hover:text-[#E67E22] transition-colors line-clamp-2 leading-snug">
            {listing.title}
          </h3>

          <div className="flex items-center gap-2 mt-2 text-xs text-[#64748B]">
            <MapPin className="h-3 w-3" />
            {listing.location}
            <span className="ml-auto flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-yellow-400">{listing.seller}</span>
            </span>
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
            <span className="text-lg font-mono-jet font-bold text-[#E67E22]">
              {listing.price.toLocaleString()} MAD
            </span>
            <Button
              size="sm"
              className="bg-[#E67E22] hover:bg-[#D35400] text-white text-xs h-8 gap-1"
              onClick={(e) => e.preventDefault()}
            >
              <Phone className="h-3.5 w-3.5" />
              Contacter
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
