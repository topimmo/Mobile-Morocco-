import { LayoutDashboard, Package, Store, BarChart3, CreditCard, MessageSquare, ChevronLeft, Menu, Megaphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';

export type DashboardView = 'dashboard' | 'products' | 'store' | 'analytics' | 'subscription' | 'support' | 'ads';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  language: 'ar' | 'fr';
  activeView?: DashboardView;
  onViewChange?: (view: DashboardView) => void;
}

const menuItems = {
  fr: [
    { icon: LayoutDashboard, label: 'Tableau de bord', view: 'dashboard' as DashboardView },
    { icon: Package, label: 'Produits', view: 'products' as DashboardView },
    { icon: Megaphone, label: 'Publicités', view: 'ads' as DashboardView },
    { icon: Store, label: 'Profil du magasin', view: 'store' as DashboardView },
    { icon: BarChart3, label: 'Analytique', view: 'analytics' as DashboardView },
    { icon: CreditCard, label: 'Abonnement', view: 'subscription' as DashboardView },
    { icon: MessageSquare, label: 'Support', view: 'support' as DashboardView },
  ],
  ar: [
    { icon: LayoutDashboard, label: 'لوحة القيادة', view: 'dashboard' as DashboardView },
    { icon: Package, label: 'المنتجات', view: 'products' as DashboardView },
    { icon: Megaphone, label: 'الإعلانات', view: 'ads' as DashboardView },
    { icon: Store, label: 'ملف المتجر', view: 'store' as DashboardView },
    { icon: BarChart3, label: 'التحليلات', view: 'analytics' as DashboardView },
    { icon: CreditCard, label: 'الاشتراك', view: 'subscription' as DashboardView },
    { icon: MessageSquare, label: 'الدعم', view: 'support' as DashboardView },
  ],
};

function SidebarContent({ language, collapsed = false, activeView = 'dashboard', onViewChange }: { language: 'ar' | 'fr'; collapsed?: boolean; activeView?: DashboardView; onViewChange?: (view: DashboardView) => void }) {
  const items = menuItems[language];

  return (
    <div className="flex flex-col h-full p-6">
      {/* Logo */}
      <div className="flex items-center justify-between mb-12">
        {!collapsed && (
          <h1 className="text-2xl font-grotesk font-bold text-primary">
            Mobile Maroc
          </h1>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {items.map((item, index) => (
          <button
            key={index}
            onClick={() => onViewChange?.(item.view)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeView === item.view
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
            }`}
          >
            <item.icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && (
              <span className={`font-outfit text-sm ${language === 'ar' ? 'font-tajawal' : ''}`}>
                {item.label}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* User Section */}
      {!collapsed && (
        <div className="pt-6 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-grotesk font-bold">
              AM
            </div>
            <div className="flex-1">
              <p className={`text-sm font-medium ${language === 'ar' ? 'font-tajawal' : ''}`}>
                {language === 'fr' ? 'Ahmed Mansouri' : 'أحمد المنصوري'}
              </p>
              <p className="text-xs text-muted-foreground">
                {language === 'fr' ? 'Importateur' : 'مستورد'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Sidebar({ collapsed, onToggle, language, activeView = 'dashboard', onViewChange }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleViewChange = (view: DashboardView) => {
    onViewChange?.(view);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="glass-card border-white/10 hover:bg-white/10"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side={language === 'ar' ? 'right' : 'left'} className="glass-card border-white/10 p-0 w-[280px]">
            <SidebarContent language={language} activeView={activeView} onViewChange={handleViewChange} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside 
        className={`hidden lg:block fixed top-0 ${language === 'ar' ? 'right-0' : 'left-0'} h-screen glass-card border-r border-white/10 transition-all duration-300 z-50 ${
          collapsed ? 'w-[72px]' : 'w-[280px]'
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="flex items-center justify-between mb-12">
            {!collapsed && (
              <h1 className="text-2xl font-grotesk font-bold text-primary">
                Mobile Maroc
              </h1>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="hover:bg-white/10"
            >
              <ChevronLeft className={`h-5 w-5 transition-transform ${collapsed ? 'rotate-180' : ''} ${language === 'ar' ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {menuItems[language].map((item, index) => (
              <button
                key={index}
                onClick={() => onViewChange?.(item.view)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                  activeView === item.view
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-muted-foreground hover:bg-white/5 hover:text-foreground'
                }`}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!collapsed && (
                  <span className={`font-outfit text-sm ${language === 'ar' ? 'font-tajawal' : ''}`}>
                    {item.label}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* User Section */}
          {!collapsed && (
            <div className="pt-6 border-t border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-grotesk font-bold">
                  AM
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${language === 'ar' ? 'font-tajawal' : ''}`}>
                    {language === 'fr' ? 'Ahmed Mansouri' : 'أحمد المنصوري'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'fr' ? 'Importateur' : 'مستورد'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
