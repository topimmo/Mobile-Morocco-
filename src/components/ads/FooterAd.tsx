import { AdPlaceholder } from './AdPlaceholder';

interface FooterAdProps {
  className?: string;
}

export function FooterAd({ className = '' }: FooterAdProps) {
  return (
    <div className={`w-full py-6 ${className}`}>
      <AdPlaceholder placement="footer" maxAds={1} />
    </div>
  );
}
