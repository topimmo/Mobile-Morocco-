import { Link } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { SEO } from '@/components/SEO';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { cn } from '@/lib/utils';

export default function NotFoundPage() {
  let language = 'ar';
  let isRTL = true;

  try {
    const langContext = useLanguage();
    language = langContext.language;
    isRTL = language === 'ar';
  } catch {
    // Context not available, use defaults
  }

  const labels = {
    title: isRTL ? '404 - الصفحة غير موجودة' : '404 - Page non trouvée',
    subtitle: isRTL 
      ? 'عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.'
      : 'Désolé, la page que vous recherchez n\'existe pas ou a été déplacée.',
    backHome: isRTL ? 'العودة للرئيسية' : 'Retour à l\'accueil',
    browseListings: isRTL ? 'تصفح الإعلانات' : 'Parcourir les annonces',
    searchShops: isRTL ? 'البحث عن محلات' : 'Chercher des boutiques',
  };

  return (
    <div className={cn('min-h-screen bg-background', isRTL && 'rtl')}>
      <SEO
        title={isRTL ? 'صفحة غير موجودة - 404' : 'Page non trouvée - 404'}
        description={isRTL ? 'الصفحة التي تبحث عنها غير موجودة' : 'La page que vous recherchez n\'existe pas'}
        noindex={true}
      />
      <Navigation />
      
      <main className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary/20">404</div>
        </div>

        {/* Text Content */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {labels.title}
        </h1>
        <p className="text-muted-foreground text-lg mb-8 max-w-md">
          {labels.subtitle}
        </p>

        {/* Action Buttons */}
        <div className={cn(
          'flex flex-col sm:flex-row gap-4',
          isRTL && 'sm:flex-row-reverse'
        )}>
          <Link to="/">
            <Button size="lg" className={cn('gap-2', isRTL && 'flex-row-reverse')}>
              <Home className="h-5 w-5" />
              {labels.backHome}
            </Button>
          </Link>
          
          <Link to="/listings">
            <Button variant="outline" size="lg" className={cn('gap-2', isRTL && 'flex-row-reverse')}>
              <Search className="h-5 w-5" />
              {labels.browseListings}
            </Button>
          </Link>
          
          <Link to="/repair-shops">
            <Button variant="outline" size="lg" className={cn('gap-2', isRTL && 'flex-row-reverse')}>
              <ArrowLeft className={cn('h-5 w-5', isRTL && 'rotate-180')} />
              {labels.searchShops}
            </Button>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="mt-12 text-sm text-muted-foreground">
          <p className="mb-2">{isRTL ? 'روابط مفيدة:' : 'Liens utiles:'}</p>
          <div className={cn('flex gap-4 justify-center', isRTL && 'flex-row-reverse')}>
            <Link to="/categories/telephones" className="hover:text-primary transition-colors">
              {isRTL ? 'الهواتف' : 'Téléphones'}
            </Link>
            <span>•</span>
            <Link to="/categories/accessoires" className="hover:text-primary transition-colors">
              {isRTL ? 'الإكسسوارات' : 'Accessoires'}
            </Link>
            <span>•</span>
            <Link to="/auth/register" className="hover:text-primary transition-colors">
              {isRTL ? 'التسجيل' : 'S\'inscrire'}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
