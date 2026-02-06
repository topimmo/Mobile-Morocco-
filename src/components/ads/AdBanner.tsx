import { AdPlaceholder } from './AdPlaceholder';
import { AdPlacement } from '@/types/ads';

interface AdBannerProps {
  placement: AdPlacement;
  className?: string;
}

export function AdBanner({ placement, className = '' }: AdBannerProps) {
  return (
    <div className={`w-full ${className}`}>
      <AdPlaceholder placement={placement} maxAds={1} />
    </div>
  );
}
