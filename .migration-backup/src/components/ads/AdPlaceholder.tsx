import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useAds } from '@/lib/ads-context';
import { AdPlacement, AD_SIZE_DIMENSIONS } from '@/types/ads';

interface AdPlaceholderProps {
  placement: AdPlacement;
  className?: string;
  maxAds?: number;
}

export function AdPlaceholder({ placement, className = '', maxAds = 1 }: AdPlaceholderProps) {
  const { getApprovedAdsByPlacement, recordView, recordClick } = useAds();
  const viewedAds = useRef<Set<string>>(new Set());
  
  const ads = getApprovedAdsByPlacement(placement).slice(0, maxAds);

  useEffect(() => {
    ads.forEach(ad => {
      if (!viewedAds.current.has(ad.id)) {
        viewedAds.current.add(ad.id);
        recordView(ad.id);
      }
    });
  }, [ads, recordView]);

  if (ads.length === 0) {
    return null;
  }

  const handleAdClick = (adId: string, redirectUrl?: string) => {
    recordClick(adId);
    if (redirectUrl) {
      window.open(redirectUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className={`flex flex-wrap gap-4 justify-center ${className}`}>
      {ads.map((ad, index) => {
        const dimensions = AD_SIZE_DIMENSIONS[ad.size];
        
        return (
          <motion.div
            key={ad.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="relative group cursor-pointer"
            onClick={() => handleAdClick(ad.id, ad.redirectUrl)}
          >
            <div 
              className="relative overflow-hidden rounded-lg border border-white/10 glass-card transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-accent/10"
              style={{
                maxWidth: dimensions.width,
                aspectRatio: `${dimensions.width}/${dimensions.height}`,
              }}
            >
              {ad.mediaType === 'image' ? (
                <img
                  src={ad.mediaUrl}
                  alt={ad.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              ) : (
                <video
                  src={ad.mediaUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                />
              )}
              
              {/* Sponsored label */}
              <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[10px] text-white/70 font-outfit uppercase tracking-wider">
                Sponsored
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white text-sm font-medium truncate">{ad.title}</p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
