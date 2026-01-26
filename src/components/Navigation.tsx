import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Globe, LogOut, LayoutDashboard, LogIn, Menu, X, Home, ShoppingBag, Wrench, Grid3X3, Shield, Users, Smartphone, Settings, Store, Megaphone, Plus, BarChart2, Laptop, Cpu, Monitor, ChevronDown } from 'lucide-react';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
    products: isRTL ? 'المنتجات' : 'Produits',
    services: isRTL ? 'الخدمات' : 'Services',
    stores: isRTL ? 'المتاجر' : 'Boutiques',
    compare: isRTL ? 'مقارنة' : 'Comparer',
    admin: isRTL ? 'الإدارة' : 'Admin',
    login: isRTL ? 'تسجيل الدخول' : 'Connexion',
    register: isRTL ? 'إنشاء حساب' : 'S\'inscrire',
    logout: isRTL ? 'تسجيل الخروج' : 'Déconnexion',
    publish: isRTL ? 'نشر إعلان' : 'Publier',
  };

  // Check if user is admin
  const isAdmin = user?.profile?.role === 'admin';

  // Grouped navigation structure
  const productsMenu = [
    { to: '/phones', label: isRTL ? 'الهواتف' : 'Téléphones', icon: Smartphone },
    { to: '/spare-parts', label: isRTL ? 'قطع الغيار للهواتف' : 'Pièces Mobiles', icon: Settings },
    { to: '/computers', label: isRTL ? 'الحواسيب' : 'Ordinateurs', icon: Laptop },
    { to: '/computer-parts', label: isRTL ? 'قطع الحاسوب' : 'Pièces PC', icon: Cpu },
    { to: '/equipment', label: isRTL ? 'المعدات' : 'Équipements', icon: Wrench },
  ];

  const servicesMenu = [
    { to: '/services', label: isRTL ? 'إصلاح الهواتف' : 'Réparation Mobile', icon: Users },
    { to: '/computer-repair', label: isRTL ? 'إصلاح الحواسيب' : 'Réparation PC', icon: Monitor },
  ];

  // Primary navigation links (always visible)
  const primaryNavLinks = [
    { to: '/', label: labels.home, icon: Home },
  ];

  // Mobile menu - all items in flat list
  const mobileMenuLinks = [
    { to: '/', label: labels.home, icon: Home },
    ...productsMenu,
    ...servicesMenu,
    { to: '/stores', label: labels.stores, icon: Store },
    { to: '/compare', label: labels.compare, icon: BarChart2 },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={cn('bg-white border-b border-border sticky top-0 z-sticky shadow-sm')} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="containerPage px-3 md:px-6 py-2.5 md:py-3 flex items-center">
        <div className={cn('flex justify-between items-center w-full gap-3 md:gap-4', isRTL && 'flex-row-reverse')}>
          {/* Logo */}
          <Link to="/" className="flex items-center flex-shrink-0">
            <div className="h-9 md:h-10 flex items-center bg-white p-1 border border-gray-200 rounded-lg">
              <img 
                src="/assets/logo/logo.png" 
                alt="Mobile Morocco Logo" 
                className="h-full w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.insertAdjacentHTML('afterend', '<span class="text-lg md:text-xl font-bold text-gray-900">Mobile Morocco</span>');
                }}
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className={cn('hidden lg:flex items-center gap-1', isRTL && 'flex-row-reverse')}>
            {/* Home Link */}
            {primaryNavLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={cn(
                  'px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1.5 rounded-md hover:bg-muted',
                  isActive(link.to)
                    ? 'text-primary bg-primary/5'
                    : 'text-muted-foreground hover:text-foreground',
                  isRTL && 'flex-row-reverse'
                )}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}

            {/* Products Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className={cn(
                'px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground outline-none',
                isRTL && 'flex-row-reverse'
              )}>
                <ShoppingBag className="h-4 w-4" />
                {labels.products}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? 'end' : 'start'} className="w-48">
                {productsMenu.map((item) => (
                  <DropdownMenuItem key={item.to} asChild>
                    <Link
                      to={item.to}
                      className={cn(
                        'flex items-center gap-2 cursor-pointer',
                        isActive(item.to) && 'bg-primary/5 text-primary',
                        isRTL && 'flex-row-reverse'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className={cn(
                'px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground outline-none',
                isRTL && 'flex-row-reverse'
              )}>
                <Wrench className="h-4 w-4" />
                {labels.services}
                <ChevronDown className="h-3 w-3 opacity-50" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isRTL ? 'end' : 'start'} className="w-48">
                {servicesMenu.map((item) => (
                  <DropdownMenuItem key={item.to} asChild>
                    <Link
                      to={item.to}
                      className={cn(
                        'flex items-center gap-2 cursor-pointer',
                        isActive(item.to) && 'bg-primary/5 text-primary',
                        isRTL && 'flex-row-reverse'
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Stores Link */}
            <Link
              to="/stores"
              className={cn(
                'px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1.5 rounded-md hover:bg-muted',
                isActive('/stores')
                  ? 'text-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground',
                isRTL && 'flex-row-reverse'
              )}
            >
              <Store className="h-4 w-4" />
              {labels.stores}
            </Link>

            {/* Compare Link */}
            <Link
              to="/compare"
              className={cn(
                'px-3 py-2 text-sm font-medium transition-colors flex items-center gap-1.5 rounded-md hover:bg-muted',
                isActive('/compare')
                  ? 'text-primary bg-primary/5'
                  : 'text-muted-foreground hover:text-foreground',
                isRTL && 'flex-row-reverse'
              )}
            >
              <BarChart2 className="h-4 w-4" />
              {labels.compare}
            </Link>
          </div>

          {/* Desktop Right Section */}
          <div className={cn('hidden lg:flex items-center gap-2', isRTL && 'flex-row-reverse')}>
            {/* Language Selector */}
            <button
              onClick={() => setLanguage(language === 'ar' ? 'fr' : 'ar')}
              className={cn(
                'flex items-center gap-1 px-2.5 py-2 rounded-md hover:bg-muted transition-colors text-sm font-medium',
                isRTL && 'flex-row-reverse'
              )}
              aria-label={language === 'ar' ? 'Changer en français' : 'Switch to Arabic'}
            >
              <Globe className="h-4 w-4" />
              <span>{language === 'ar' ? 'FR' : 'AR'}</span>
            </button>

            {/* Auth Links */}
            {user ? (
              <>
                {isAdmin && (
                  <Link to="/admin">
                    <Button variant="outline" size="sm" className={cn('border-red-600 text-red-600 hover:bg-red-50', isRTL && 'flex-row-reverse')}>
                      <Shield className={cn('h-4 w-4', isRTL ? 'ml-1.5' : 'mr-1.5')} />
                      {labels.admin}
                    </Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await signOut();
                  }}
                  className={cn('text-muted-foreground', isRTL && 'flex-row-reverse')}
                >
                  <LogOut className={cn('h-4 w-4', isRTL ? 'ml-1.5' : 'mr-1.5')} />
                  {labels.logout}
                </Button>
              </>
            ) : (
              <>
                <Link to="/auth/login">
                  <Button variant="ghost" size="sm" className={cn('text-muted-foreground', isRTL && 'flex-row-reverse')}>
                    <LogIn className={cn('h-4 w-4', isRTL ? 'ml-1.5' : 'mr-1.5')} />
                    {labels.login}
                  </Button>
                </Link>
                <Link to="/publish-phone">
                  <Button size="sm" className={cn('bg-primary hover:bg-primary/90 font-medium', isRTL && 'flex-row-reverse')}>
                    <Plus className={cn('h-4 w-4', isRTL ? 'ml-1.5' : 'mr-1.5')} />
                    {labels.publish}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-1.5">
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
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side={isRTL ? 'right' : 'left'} className="w-[280px]">
                <SheetHeader>
                  <SheetTitle className={cn('flex justify-center', isRTL && 'text-right')}>
                    <img 
                      src="/assets/logo/logo.png" 
                      alt="Mobile Morocco Logo"
                      className="h-[36px] w-auto"
                    />
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 flex flex-col gap-1">
                  {mobileMenuLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2.5',
                        isActive(link.to)
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted',
                        isRTL && 'flex-row-reverse text-right'
                      )}
                    >
                      <link.icon className="h-4 w-4" />
                      {link.label}
                    </Link>
                  ))}

                  <hr className="my-3" />

                  {/* Publish Button - Mobile */}
                  <Link
                    to="/publish-phone"
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      'px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2.5 bg-primary text-primary-foreground hover:bg-primary/90',
                      isRTL && 'flex-row-reverse text-right'
                    )}
                  >
                    <Plus className="h-4 w-4" />
                    {labels.publish}
                  </Link>

                  <hr className="my-3" />

                  {user ? (
                    <>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className={cn(
                            'px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2.5 border-2 border-red-600 text-red-600',
                            isRTL && 'flex-row-reverse text-right'
                          )}
                        >
                          <Shield className="h-4 w-4" />
                          {labels.admin}
                        </Link>
                      )}
                      <button
                        onClick={async () => {
                          await signOut();
                          setMobileMenuOpen(false);
                        }}
                        className={cn(
                          'px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2.5 hover:bg-muted text-destructive w-full',
                          isRTL && 'flex-row-reverse text-right'
                        )}
                      >
                        <LogOut className="h-4 w-4" />
                        {labels.logout}
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/auth/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          'px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2.5 hover:bg-muted',
                          isRTL && 'flex-row-reverse text-right'
                        )}
                      >
                        <LogIn className="h-4 w-4" />
                        {labels.login}
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
