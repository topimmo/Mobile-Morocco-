import { Link } from 'react-router-dom';
import { MapPin, Eye, Phone, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export interface ListingCardData {
  id: number | string;
  title: string;
  price: number;
  condition: string;
  image: string;
  location: string;
  seller: string;
  sellerType: string;
  views: number;
  postedDate?: string;
}

interface ListingCardProps {
  listing: ListingCardData;
  variant?: 'default' | 'compact' | 'list';
}

export function ListingCard({ listing, variant = 'default' }: ListingCardProps) {
  if (variant === 'list') {
    return (
      <Link to={`/listing/${listing.id}`} className="block">
        <div className="flex rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden group hover:border-[#E67E22]/40 hover:bg-white/[0.05] transition-all duration-200">
          <div className="relative w-36 sm:w-48 flex-shrink-0 overflow-hidden">
            <img
              src={listing.image}
              alt={listing.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <Badge className="absolute top-2 left-2 bg-green-500/80 text-white text-[10px] px-1.5 py-0.5">
              {listing.condition}
            </Badge>
          </div>

          <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
            <div>
              <h3 className="font-semibold text-white group-hover:text-[#E67E22] transition-colors line-clamp-1 text-sm sm:text-base">
                {listing.title}
              </h3>
              <div className="flex items-center gap-2 mt-1.5 text-xs text-[#64748B]">
                <MapPin className="h-3 w-3" />
                {listing.location}
                {listing.postedDate && (
                  <span className="ml-auto">• {listing.postedDate}</span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-[10px] border-white/10 text-[#A0AEC0]">
                  {listing.sellerType}
                </Badge>
                <span className="text-xs text-[#64748B] truncate">{listing.seller}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-3">
              <span className="text-lg font-mono-jet font-bold text-[#E67E22]">
                {listing.price.toLocaleString()} MAD
              </span>
              <Button size="sm" variant="outline" className="border-[#E67E22]/30 text-[#E67E22] hover:bg-[#E67E22] hover:text-white text-xs h-8">
                <Phone className="h-3 w-3 mr-1" />
                Contacter
              </Button>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/listing/${listing.id}`} className="block">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden group hover:border-[#E67E22]/40 hover:bg-white/[0.05] transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={listing.image}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className="absolute top-2.5 left-2.5 bg-green-500/80 text-white text-[10px] px-2 py-0.5">
            {listing.condition}
          </Badge>
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-md bg-black/60 backdrop-blur-sm text-[10px] text-white/80">
            <Eye className="h-3 w-3" />
            {listing.views}
          </div>
          {/* Favorite button */}
          <button className="absolute bottom-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-white/60 hover:text-red-400 hover:bg-black/70 transition-colors opacity-0 group-hover:opacity-100">
            <Heart className="h-4 w-4" />
          </button>
        </div>

        <div className="p-3.5">
          <h3 className="font-semibold text-sm text-white group-hover:text-[#E67E22] transition-colors line-clamp-2 leading-snug min-h-[2.5rem]">
            {listing.title}
          </h3>

          <div className="flex items-center gap-1.5 mt-2 text-xs text-[#64748B]">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{listing.location}</span>
          </div>

          <div className="flex items-center gap-2 mt-2">
            <Badge variant="outline" className="text-[10px] border-white/10 text-[#A0AEC0] px-1.5 py-0">
              {listing.sellerType}
            </Badge>
            {listing.postedDate && (
              <span className="text-[10px] text-[#64748B]">• {listing.postedDate}</span>
            )}
          </div>

          <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/5">
            <span className="text-base font-mono-jet font-bold text-[#E67E22]">
              {listing.price.toLocaleString()} MAD
            </span>
            <Button
              size="sm"
              variant="ghost"
              className="text-[#E67E22] hover:bg-[#E67E22]/10 text-xs h-7 px-2"
              onClick={(e) => e.preventDefault()}
            >
              <Phone className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
