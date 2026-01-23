import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Globe, LogOut, LayoutDashboard, LogIn, Menu, X, Home, ShoppingBag, Wrench, Grid3X3, Shield, Users, Smartphone, Settings, Store, Megaphone, Plus, BarChart2 } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useState, memo } from 'react';
import { cn } from '@/lib/utils';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

function Navigation() {
  // Default values for when context is not available (e.g., in storyboards)
  let t = (key: string) => key;
  let language = 'ar';
  let setLanguage = (_lang: string) => {};
  let user = null;
  let signOut = async () => {};

  try {
    const langContext = useLanguage();
    t = langContext.t;
    language = langContext.language;
    setLanguage = langContext.setLanguage;
  } catch {
    // Language context not available, using defaults
  }

  try {
    const authContext = useAuth();
    user = authContext.user;
    signOut = authContext.signOut;
  } catch {
    // Auth context not available, using defaults
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isRTL = language === 'ar';

  const labels = {
    home: isRTL ? 'الرئيسية' : 'Accueil',
    listings: isRTL ? 'الإعلانات' : 'Annonces',
    repairShops: isRTL ? 'محلات الإصلاح' : 'Boutiques',
    categories: isRTL ? 'الفئات' : 'Catégories',
    dashboard: isRTL ? 'لوحة التحكم' : 'Tableau de bord',
    admin: isRTL ? 'الإدارة' : 'Admin',
    login: isRTL ? 'تسجيل الدخول' : 'Connexion',
    register: isRTL ? 'إنشاء حساب' : 'S\'inscrire',
    logout: isRTL ? 'تسجيل الخروج' : 'Déconnexion',
  };

  // Check if user is admin
  const isAdmin = user?.profile?.role === 'admin';

  const navLinks = [
    { to: '/', label: labels.home, icon: Home },
    { to: '/phones', label: isRTL ? 'الهواتف' : 'Téléphones', icon: Smartphone },
    { to: '/spare-parts', label: isRTL ? 'قطع الغيار' : 'Pièces', icon: Settings },
    { to: '/equipment', label: isRTL ? 'المعدات' : 'Équipements', icon: Wrench },
    { to: '/services', label: isRTL ? 'الإصلاح' : 'Réparation', icon: Users },
    { to: '/stores', label: isRTL ? 'المتاجر' : 'Boutiques', icon: Store },
    { to: '/ads/request', label: isRTL ? 'طلب إعلان' : 'Demande pub', icon: Megaphone },
    { to: '/compare', label: isRTL ? 'مقارنة' : 'Comparer', icon: BarChart2 },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={cn('bg-white border-b border-border sticky top-0 z-50 shadow-sm')} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="containerPage py-3">
        <div className={cn('flex justify-between items-center', isRTL && 'flex-row-reverse')}>
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img 
              src="/assets/logo/logo.png" 
              alt="Mobile Morocco Logo" 
              className="h-9 md:h-10 lg:h-12 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.insertAdjacentHTML('afterend', '<span class="text-xl md:text-2xl font-bold text-gray-900">Mobile Morocco</span>');
              }}
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className={cn('hidden md:flex items-center gap-1', isRTL && 'flex-row-reverse')}>
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'px-3 py-2 text-sm font-medium transition-colors flex items-center gap-2',
                  isActive(link.to)
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                  isRTL && 'flex-row-reverse'
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right Section */}
          <div className={cn('hidden md:flex items-center gap-3', isRTL && 'flex-row-reverse')}>
            {/* Publish Phone CTA - Swiss Design */}
            <Link to="/publish-phone">
              <Button size="sm" className={cn('bg-primary hover:bg-primary/90 font-medium whitespace-nowrap', isRTL && 'flex-row-reverse')}>
                <Plus className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')} />
                {isRTL ? 'نشر تلفوني' : 'Publier'}
              </Button>
            </Link>

            {/* Language Selector */}
            <button
              onClick={() => setLanguage(language === 'ar' ? 'fr' : 'ar')}
              className={cn(
                'flex items-center gap-2 px-3 py-2 hover:bg-muted transition-colors font-medium',
                isRTL && 'flex-row-reverse'
              )}
            >
              <Globe className="h-4 w-4" />
              <span className="text-sm">{language === 'ar' ? 'FR' : 'AR'}</span>
            </button>

            {/* Auth Links */}
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="default" size="sm" className={cn('bg-red-600 hover:bg-red-700', isRTL && 'flex-row-reverse')}>
                      <Shield className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')} />
                      {labels.admin}
                    </Button>
                  </Link>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    await signOut();
                  }}
                  className={cn(isRTL && 'flex-row-reverse')}
                >
                  <LogOut className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')} />
                  {labels.logout}
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth/login">
                  <Button variant="outline" size="sm" className={cn(isRTL && 'flex-row-reverse')}>
                    <LogIn className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')} />
                    {labels.login}
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button size="sm">
                    {labels.register}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setLanguage(language === 'ar' ? 'fr' : 'ar')}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label={language === 'ar' ? 'Switch to French' : 'Switch to Arabic'}
            >
              <Globe className="h-5 w-5" />
            </button>
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <button 
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </button>
              </SheetTrigger>
              <SheetContent side={isRTL ? 'right' : 'left'} className="w-[280px]">
                <SheetHeader>
                  <SheetTitle className={cn('flex justify-center', isRTL && 'text-right')}>
                    <img 
                      src="/assets/logo/logo.png" 
                      alt="Mobile Morocco Logo"
                      className="h-9 w-auto"
                    />
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'px-4 py-3 rounded-lg text-base font-medium transition-colors flex items-center gap-3',
                        isActive(link.to)
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted',
                        isRTL && 'flex-row-reverse text-right'
                      )}
                    >
                      <link.icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  ))}

                  {/* Publish Phone CTA - Mobile */}
                  <Link
                    to="/publish-phone"
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'px-4 py-3 rounded-lg text-base font-medium transition-colors flex items-center gap-3 bg-sky-600 text-white hover:bg-sky-700',
                      isRTL && 'flex-row-reverse text-right'
                    )}
                  >
                    <Plus className="h-5 w-5" />
                    {isRTL ? 'نشر تلفوني' : 'Publier mon téléphone'}
                  </Link>

                  <hr className="my-4" />

                  {user ? (
                    <>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            'px-4 py-3 rounded-lg text-base font-medium transition-colors flex items-center gap-3 bg-red-600 text-white',
                            isRTL && 'flex-row-reverse text-right'
                          )}
                        >
                          <Shield className="h-5 w-5" />
                          {labels.admin}
                        </Link>
                      )}
                      <button
                        onClick={async () => {
                          await signOut();
                          setMobileMenuOpen(false);
                        }}
                        className={cn(
                          'px-4 py-3 rounded-lg text-base font-medium transition-colors flex items-center gap-3 hover:bg-muted text-destructive w-full',
                          isRTL && 'flex-row-reverse text-right'
                        )}
                      >
                        <LogOut className="h-5 w-5" />
                        {labels.logout}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/auth/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'px-4 py-3 rounded-lg text-base font-medium transition-colors flex items-center gap-3 hover:bg-muted',
                          isRTL && 'flex-row-reverse text-right'
                        )}
                      >
                        <LogIn className="h-5 w-5" />
                        {labels.login}
                      </Link>
                      <Link
                        to="/auth/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'px-4 py-3 rounded-lg text-base font-medium transition-colors flex items-center gap-3 bg-primary text-primary-foreground',
                          isRTL && 'flex-row-reverse text-right'
                        )}
                      >
                        {labels.register}
                      </Link>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default memo(Navigation);
