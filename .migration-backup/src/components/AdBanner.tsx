import React, { useEffect, useState } from "react";
import { getActiveAdsByPosition, recordImpression, recordClick, AdPosition } from "@/services/adService";
import { Card } from "@/components/ui/card";
import { X } from "lucide-react";

interface AdBannerProps {
  position: AdPosition;
  className?: string;
}

const AdBanner: React.FC<AdBannerProps> = ({ position, className = "" }) => {
  const [ad, setAd] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAd();
  }, [position]);

  const loadAd = async () => {
    try {
      setIsLoading(true);
      const ads = await getActiveAdsByPosition(position);
      if (ads && ads.length > 0) {
        // Select a random ad from available ads
        const randomAd = ads[Math.floor(Math.random() * ads.length)];
        setAd(randomAd);
        // Record impression
        await recordImpression(randomAd.id);
      }
    } catch (error) {
      console.error("Error loading ad:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdClick = async () => {
    if (ad) {
      await recordClick(ad.id);
      window.open(ad.linkUrl, "_blank");
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible || !ad || isLoading) {
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <Card className="overflow-hidden border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="relative">
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 z-10 bg-white/80 hover:bg-white rounded-full p-1 transition-colors"
            aria-label="Fermer la publicité"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
          <div
            onClick={handleAdClick}
            className="cursor-pointer transition-transform hover:scale-[1.02]"
          >
            <img
              src={ad.imageUrl}
              alt={ad.title}
              className="w-full h-auto object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
              <p className="text-white text-sm font-semibold">{ad.title}</p>
              <p className="text-white/80 text-xs">Publicité</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdBanner;
