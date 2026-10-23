import { useEffect, useState } from 'react';
import { getActiveBanner, getAdsenseUnit, logAdImpression, logAdClick } from '@/lib/supabase/ads';
import type { PageKey, SlotType } from '@/lib/supabase/ads';
import { cn } from '@/lib/utils';
import { Megaphone } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface BannerSlotProps {
  page: PageKey;
  slot: SlotType;
  showPlaceholder?: boolean;
}

// Sample banners for demo/placeholder (like "Maroc Telecom" style)
const getPlaceholderBanners = (isRTL: boolean) => ({
  top: {
    gradient: 'from-orange-500 via-orange-600 to-red-600',
    text: isRTL ? 'إعلانك هنا' : 'Votre publicité ici',
    subtext: isRTL ? 'تواصل معنا للإعلان' : 'Contactez-nous pour annoncer',
  },
  middle: {
    gradient: 'from-blue-600 via-blue-700 to-indigo-700',
    text: isRTL ? 'عروض حصرية' : 'Offres Exclusives',
    subtext: isRTL ? 'احجز مساحتك الإعلانية الآن' : 'Réservez votre espace publicitaire',
  },
  bottom: {
    gradient: 'from-green-500 via-emerald-600 to-teal-600',
    text: isRTL ? 'شريكك الموثوق' : 'Votre Partenaire de Confiance',
    subtext: isRTL ? 'منصة الهواتف المغربية' : 'Plateforme Mobile Maroc',
  },
  sidebar: {
    gradient: 'from-purple-500 via-purple-600 to-pink-600',
    text: isRTL ? 'إعلان' : 'Publicité',
    subtext: isRTL ? 'مساحة إعلانية' : 'Espace publicitaire',
  },
});

export function BannerSlot({ page, slot, showPlaceholder = true }: BannerSlotProps) {
  const [banner, setBanner] = useState<any>(null);
  const [adsenseUnit, setAdsenseUnit] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Get language context with fallback
  let language = 'fr';
  try {
    const langContext = useLanguage();
    language = langContext.language;
  } catch {
    // Language context not available, using default
  }
  const isRTL = language === 'ar';
  const PLACEHOLDER_BANNERS = getPlaceholderBanners(isRTL);

  useEffect(() => {
    const loadBanner = async () => {
      try {
        // Try to get active paid banner
        const activeBanner = await getActiveBanner(page, slot);
        if (activeBanner) {
          setBanner(activeBanner);
          // Log impression
          await logAdImpression(activeBanner.campaign.id, activeBanner.booking.id, page, slot);
        } else {
          // Fallback to AdSense
          const unit = await getAdsenseUnit(page, slot);
          if (unit?.data) {
            setAdsenseUnit(unit.data);
          }
        }
      } catch (error) {
        // Silently handle error - show placeholder instead
        console.error('Error loading banner:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBanner();
  }, [page, slot]);

  if (loading) {
    return (
      <div className={cn(
        'w-full animate-pulse',
        slot === 'sidebar' ? 'h-64' : 'h-20 md:h-24'
      )}>
        <div className="bg-muted rounded-lg h-full w-full" />
      </div>
    );
  }

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const bannerUrl = isMobile ? banner?.campaign.banner_mobile_url : banner?.campaign.banner_desktop_url;
  const placeholderConfig = PLACEHOLDER_BANNERS[slot] || PLACEHOLDER_BANNERS.middle;

  // If we have a real banner, show it
  if (banner && bannerUrl) {
    return (
      <div className={cn(
        'banner-slot w-full overflow-hidden rounded-lg',
        slot === 'sidebar' ? 'h-auto' : ''
      )}>
        <a
          href={banner.campaign.target_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={async () => {
            try {
              await logAdClick(banner.campaign.id, banner.booking.id, page, slot);
            } catch (error) {
              console.error('Error logging click:', error);
            }
          }}
          className="block w-full"
        >
          <img
            src={bannerUrl}
            alt={banner.campaign.title}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </a>
      </div>
    );
  }

  // If we have AdSense, show it
  if (adsenseUnit) {
    return (
      <div className={cn(
        'banner-slot w-full overflow-hidden rounded-lg bg-muted flex items-center justify-center',
        slot === 'sidebar' ? 'h-64' : 'h-20 md:h-24'
      )}>
        <div className="text-center text-muted-foreground">
          <p className="text-sm">AdSense: {adsenseUnit.unit_id}</p>
        </div>
      </div>
    );
  }

  // Show styled placeholder (like Maroc Telecom banner style)
  if (showPlaceholder) {
    return (
      <div className={cn(
        'banner-slot w-full overflow-hidden rounded-lg',
        slot === 'sidebar' ? 'h-64' : 'py-4 md:py-6'
      )}>
        <div className={cn(
          'w-full h-full bg-gradient-to-r flex items-center justify-center px-4 py-3 md:py-4 rounded-lg',
          placeholderConfig.gradient
        )}>
          <div className="flex items-center gap-3 md:gap-4">
            <Megaphone className="h-6 w-6 md:h-8 md:w-8 text-white" />
            <div className="text-center">
              <p className="font-bold text-sm md:text-lg bg-white/70 px-3 py-2 rounded-lg text-gray-500">
                {placeholderConfig.text}
              </p>
              <p className="text-white/90 text-xs md:text-sm mt-2">
                {placeholderConfig.subtext}
              </p>
            </div>
            <Megaphone className="h-6 w-6 md:h-8 md:w-8 text-white hidden md:block" />
          </div>
        </div>
      </div>
    );
  }

  return null;
}
