import { AdPlaceholder } from './AdPlaceholder';

interface SidebarAdProps {
  className?: string;
  maxAds?: number;
}

export function SidebarAd({ className = '', maxAds = 2 }: SidebarAdProps) {
  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <AdPlaceholder placement="sidebar" maxAds={maxAds} />
    </div>
  );
}
