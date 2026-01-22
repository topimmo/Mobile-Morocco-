import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

/**
 * Footer Component - Swiss Minimal Design
 * Clean, minimal footer with consistent spacing
 * Black and white with orange accents
 */
export default function Footer() {
  // Default values for when context is not available
  let t = (key: string) => key;
  let language = 'ar';

  try {
    const langContext = useLanguage();
    t = langContext.t;
    language = langContext.language;
  } catch {
    // Language context not available, using defaults
  }

  const isRTL = language === 'ar';

  const footerLinks = {
    company: {
      title: isRTL ? 'الشركة' : 'Entreprise',
      links: [
        { label: isRTL ? 'من نحن' : 'À propos', to: '/about' },
        { label: isRTL ? 'اتصل بنا' : 'Contact', to: '/contact' },
        { label: isRTL ? 'الأسئلة الشائعة' : 'FAQ', to: '/faq' },
      ],
    },
    legal: {
      title: isRTL ? 'قانوني' : 'Légal',
      links: [
        { label: isRTL ? 'الخصوصية' : 'Confidentialité', to: '/privacy' },
        { label: isRTL ? 'الشروط' : 'Conditions', to: '/terms' },
      ],
    },
    categories: {
      title: isRTL ? 'الفئات' : 'Catégories',
      links: [
        { label: isRTL ? 'الهواتف' : 'Téléphones', to: '/phones' },
        { label: isRTL ? 'قطع الغيار' : 'Pièces', to: '/spare-parts' },
        { label: isRTL ? 'المعدات' : 'Équipements', to: '/equipment' },
        { label: isRTL ? 'الخدمات' : 'Services', to: '/services' },
      ],
    },
  };

  return (
    <footer className="bg-secondary text-secondary-foreground border-t border-border" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className={cn('grid grid-cols-1 md:grid-cols-4 gap-8', isRTL && 'text-right')}>
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white">Mobile Morocco</h3>
            <p className="text-sm text-muted-foreground">
              {isRTL 
                ? 'سوق الهواتف المحمولة في المغرب'
                : 'Marketplace de téléphones mobiles au Maroc'
              }
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white">{footerLinks.company.title}</h4>
            <ul className="space-y-2">
              {footerLinks.company.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white">{footerLinks.legal.title}</h4>
            <ul className="space-y-2">
              {footerLinks.legal.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white">{footerLinks.categories.title}</h4>
            <ul className="space-y-2">
              {footerLinks.categories.links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={cn('mt-12 pt-8 border-t border-border', isRTL && 'text-right')}>
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} Mobile Morocco.{' '}
            {isRTL ? 'جميع الحقوق محفوظة.' : 'Tous droits réservés.'}
          </p>
        </div>
      </div>
    </footer>
  );
}
