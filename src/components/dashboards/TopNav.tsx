import { Bell, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface TopNavProps {
  language: 'ar' | 'fr';
  onLanguageChange: (lang: 'ar' | 'fr') => void;
}

export function TopNav({ language, onLanguageChange }: TopNavProps) {
  return (
    <header className="sticky top-0 z-40 glass-card border-b border-white/10 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Store Name */}
        <div>
          <h2 className={`text-xl font-grotesk font-bold ${language === 'ar' ? 'font-tajawal' : ''}`}>
            {language === 'fr' ? 'Mon Magasin' : 'متجري'}
          </h2>
          <p className="text-sm text-muted-foreground">
            {language === 'fr' ? 'Bienvenue de retour!' : 'مرحبا بعودتك!'}
          </p>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          {/* Language Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onLanguageChange(language === 'fr' ? 'ar' : 'fr')}
            className="glass-card border-white/10 hover:bg-white/10"
          >
            <span className="font-mono-jet text-xs font-semibold">
              {language === 'fr' ? 'AR' : 'FR'}
            </span>
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative glass-card border-white/10 hover:bg-white/10"
              >
                <Bell className="h-5 w-5" />
                <Badge 
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-accent glow-cyan text-xs"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 glass-card border-white/10">
              <div className="p-4">
                <h3 className="font-grotesk font-semibold mb-3">
                  {language === 'fr' ? 'Notifications' : 'الإشعارات'}
                </h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                    <p className="text-sm font-medium">
                      {language === 'fr' ? 'Produit approuvé' : 'تمت الموافقة على المنتج'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {language === 'fr' ? 'Il y a 2 heures' : 'منذ ساعتين'}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                    <p className="text-sm font-medium">
                      {language === 'fr' ? 'Nouveau message de support' : 'رسالة دعم جديدة'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {language === 'fr' ? 'Il y a 5 heures' : 'منذ 5 ساعات'}
                    </p>
                  </div>
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 hover:bg-white/10">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-grotesk font-bold text-sm">
                  AM
                </div>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-card border-white/10">
              <DropdownMenuItem>
                {language === 'fr' ? 'Profil' : 'الملف الشخصي'}
              </DropdownMenuItem>
              <DropdownMenuItem>
                {language === 'fr' ? 'Paramètres' : 'الإعدادات'}
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                {language === 'fr' ? 'Déconnexion' : 'تسجيل الخروج'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
