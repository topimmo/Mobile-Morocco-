import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

function Footer() {
  const currentYear = new Date().getFullYear();
  const { t, isRTL } = useLanguage();

  return (
    <footer className="bg-secondary text-secondary-foreground border-t border-border" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
          
          {/* Brand & Description */}
          <div className={cn(isRTL && 'text-right')}>
            <h3 className="text-white text-lg font-bold mb-4">
              {t('footer.brand_name')}
            </h3>
            <p className="text-sm mb-6 leading-relaxed">
              {t('footer.brand_description')}
            </p>
            <div className={cn('flex gap-4', isRTL && 'justify-end')}>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition" 
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition" 
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition" 
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-primary transition" 
                aria-label="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={cn(isRTL && 'text-right')}>
            <h4 className="text-white font-bold mb-4">{t('footer.quick_links')}</h4>
            <nav>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="hover:text-primary transition text-sm block">
                    {t('footer.home')}
                  </Link>
                </li>
                <li>
                  <Link to="/listings" className="hover:text-primary transition text-sm block">
                    {t('footer.listings')}
                  </Link>
                </li>
                <li>
                  <Link to="/phones" className="hover:text-primary transition text-sm block">
                    {t('footer.phones')}
                  </Link>
                </li>
                <li>
                  <Link to="/stores" className="hover:text-primary transition text-sm block">
                    {t('footer.stores')}
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-primary transition text-sm block">
                    {t('footer.services')}
                  </Link>
                </li>
                <li>
                  <Link to="/technicians" className="hover:text-primary transition text-sm block">
                    {t('footer.technicians')}
                  </Link>
                </li>
                <li>
                  <Link to="/compare" className="hover:text-primary transition text-sm block">
                    {t('footer.compare')}
                  </Link>
                </li>
              </ul>
            </nav>
          </div>

          {/* Information & Contact */}
          <div className={cn(isRTL && 'text-right')}>
            <h4 className="text-white font-bold mb-4">{t('footer.information')}</h4>
            <nav>
              <ul className="space-y-2 mb-6">
                <li>
                  <Link to="/about" className="hover:text-primary transition text-sm block">
                    {t('footer.about')}
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-primary transition text-sm block">
                    {t('footer.faq')}
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-primary transition text-sm block">
                    {t('footer.contact')}
                  </Link>
                </li>
                <li>
                  <Link to="/advertise" className="hover:text-primary transition text-sm block">
                    {t('footer.advertise')}
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
                <Mail size={16} className="flex-shrink-0" />
                <a 
                  href="mailto:support@mobilemaroc.ma" 
                  className="hover:text-primary transition break-all"
                >
                  support@mobilemaroc.ma
                </a>
              </div>
              <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
                <Phone size={16} className="flex-shrink-0" />
                <a 
                  href="tel:+212522123456" 
                  className="hover:text-primary transition"
                >
                  +212 5 22 12 34 56
                </a>
              </div>
              <div className={cn('flex items-start gap-2', isRTL && 'flex-row-reverse')}>
                <MapPin size={16} className="flex-shrink-0 mt-0.5" />
                <span>{t('footer.casablanca_morocco')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-6 md:pt-8"></div>

        {/* Bottom Footer */}
        <div className={cn(
          'flex flex-col md:flex-row md:justify-between md:items-center gap-4 text-sm',
          isRTL && 'md:flex-row-reverse'
        )}>
          {/* Legal Links */}
          <nav>
            <ul className={cn('flex gap-4 md:gap-6 flex-wrap', isRTL && 'justify-end md:justify-start')}>
              <li>
                <Link to="/terms" className="hover:text-primary transition">
                  {t('footer.terms')}
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-primary transition">
                  {t('footer.privacy')}
                </Link>
              </li>
            </ul>
          </nav>

          {/* Copyright */}
          <div className={cn('text-sm', isRTL && 'text-right md:text-center')}>
            <p>
              &copy; {currentYear} {t('footer.brand_name')}. {t('footer.copyright')}.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
