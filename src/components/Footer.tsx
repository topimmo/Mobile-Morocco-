import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

function Footer() {
  const currentYear = new Date().getFullYear();
  
  // Default values for when context is not available
  let language = 'ar';
  let isRTL = false;
  
  try {
    const langContext = useLanguage();
    language = langContext.language;
    isRTL = language === 'ar';
  } catch {
    // Language context not available, using defaults
  }

  return (
    <footer className="bg-secondary text-secondary-foreground border-t border-border mt-auto">
      {/* Main Footer Content - Swiss Design */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-16" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className={cn('grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-8')}>
          {/* Company Info */}
          <div className={cn(isRTL && 'text-right')}>
            <h3 className="text-white text-lg font-bold mb-4">
              {isRTL ? 'موبايل المغرب' : 'Mobile Maroc'}
            </h3>
            <p className="text-sm mb-6 leading-relaxed text-secondary-foreground/80">
              {isRTL 
                ? 'المنصة الرائدة لشراء وبيع وإصلاح الهواتف المحمولة في المغرب.'
                : 'La plateforme leader pour acheter, vendre et réparer des téléphones mobiles au Maroc.'
              }
            </p>
            <div className={cn('flex gap-4', isRTL && 'flex-row-reverse justify-end')}>
              <a href="#" className="hover:text-primary transition-colors" aria-label="Facebook">
                <Facebook size={20} />
              </a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="Twitter">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="Instagram">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-primary transition-colors" aria-label="LinkedIn">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={cn(isRTL && 'text-right')}>
            <h4 className="text-white font-bold mb-4">
              {isRTL ? 'روابط سريعة' : 'Accès Rapide'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-primary transition-colors text-sm">
                  {isRTL ? 'الرئيسية' : 'Accueil'}
                </Link>
              </li>
              <li>
                <Link to="/phones" className="hover:text-primary transition-colors text-sm">
                  {isRTL ? 'الهواتف' : 'Téléphones'}
                </Link>
              </li>
              <li>
                <Link to="/spare-parts" className="hover:text-primary transition-colors text-sm">
                  {isRTL ? 'قطع الغيار' : 'Pièces Détachées'}
                </Link>
              </li>
              <li>
                <Link to="/equipment" className="hover:text-primary transition-colors text-sm">
                  {isRTL ? 'المعدات' : 'Équipements'}
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-primary transition-colors text-sm">
                  {isRTL ? 'خدمات الإصلاح' : 'Services de Réparation'}
                </Link>
              </li>
              <li>
                <Link to="/stores" className="hover:text-primary transition-colors text-sm">
                  {isRTL ? 'المتاجر' : 'Boutiques'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className={cn(isRTL && 'text-right')}>
            <h4 className="text-white font-bold mb-4">
              {isRTL ? 'معلومات' : 'Information'}
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="hover:text-primary transition-colors text-sm">
                  {isRTL ? 'من نحن' : 'À Propos'}
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-primary transition-colors text-sm">
                  {isRTL ? 'الأسئلة الشائعة' : 'FAQ'}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition-colors text-sm">
                  {isRTL ? 'اتصل بنا' : 'Nous Contacter'}
                </Link>
              </li>
              <li>
                <Link to="/advertise" className="hover:text-primary transition-colors text-sm">
                  {isRTL ? 'الإعلانات' : 'Publicité'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className={cn(isRTL && 'text-right')}>
            <h4 className="text-white font-bold mb-4">
              {isRTL ? 'اتصل بنا' : 'Nous Contacter'}
            </h4>
            <ul className="space-y-3">
              <li className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse justify-end')}>
                <Mail size={18} />
                <a href="mailto:support@mobilemaroc.ma" className="hover:text-primary transition-colors text-sm">
                  support@mobilemaroc.ma
                </a>
              </li>
              <li className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse justify-end')}>
                <Phone size={18} />
                <a href="tel:+212522123456" className="hover:text-primary transition-colors text-sm">
                  +212 5 22 12 34 56
                </a>
              </li>
              <li className={cn('flex items-start gap-2', isRTL && 'flex-row-reverse justify-end')}>
                <MapPin size={18} className="flex-shrink-0 mt-1" />
                <span className="text-sm">
                  {isRTL ? 'الدار البيضاء، المغرب' : 'Casablanca, Maroc'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-secondary-foreground/20 pt-6 md:pt-8"></div>

        {/* Bottom Footer */}
        <div className={cn('flex flex-col md:flex-row md:justify-between md:items-center gap-4', isRTL && 'md:flex-row-reverse')}>
          {/* Legal Links */}
          <div className={cn('flex gap-4 md:gap-6 flex-wrap text-sm', isRTL && 'flex-row-reverse')}>
            <Link to="/terms" className="hover:text-primary transition-colors">
              {isRTL ? 'شروط الاستخدام' : 'Conditions d\'Utilisation'}
            </Link>
            <Link to="/privacy" className="hover:text-primary transition-colors">
              {isRTL ? 'سياسة الخصوصية' : 'Politique de Confidentialité'}
            </Link>
          </div>

          {/* Copyright */}
          <div className={cn('text-sm text-secondary-foreground/80', isRTL && 'text-right')}>
            <p>
              {isRTL 
                ? `© ${currentYear} موبايل المغرب. جميع الحقوق محفوظة.`
                : `© ${currentYear} Mobile Maroc. Tous les droits réservés.`
              }
            </p>
          </div>

          {/* Payment Methods */}
          <div className="text-sm">
            <div className={cn('flex gap-2', isRTL && 'flex-row-reverse')}>
              <span className="px-2 py-1 bg-secondary-foreground/10 rounded text-xs">Visa</span>
              <span className="px-2 py-1 bg-secondary-foreground/10 rounded text-xs">Mastercard</span>
              <span className="px-2 py-1 bg-secondary-foreground/10 rounded text-xs">
                {isRTL ? 'تحويل بنكي' : 'Virement'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
