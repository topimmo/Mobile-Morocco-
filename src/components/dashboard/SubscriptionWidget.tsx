import { useState } from 'react';
import { Crown, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { UpgradeModal } from './UpgradeModal';

interface SubscriptionWidgetProps {
  language: 'ar' | 'fr';
}

export function SubscriptionWidget({ language }: SubscriptionWidgetProps) {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const currentPlan = 'Standard';
  const productsUsed = 94;
  const productsLimit = 100;
  const daysRemaining = 23;

  return (
    <>
      <div className="glass-card rounded-xl p-6 border-2 border-accent/30 glow-cyan">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crown className="h-5 w-5 text-accent" />
              <h3 className={`font-grotesk font-semibold ${language === 'ar' ? 'font-tajawal' : ''}`}>
                {language === 'fr' ? 'Abonnement' : 'الاشتراك'}
              </h3>
            </div>
            <p className="text-2xl font-mono-jet font-bold text-accent">
              {currentPlan}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Products Usage */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm text-muted-foreground ${language === 'ar' ? 'font-tajawal' : ''}`}>
                {language === 'fr' ? 'Produits utilisés' : 'المنتجات المستخدمة'}
              </span>
              <span className="text-sm font-mono-jet font-semibold">
                {productsUsed}/{productsLimit}
              </span>
            </div>
            <Progress value={(productsUsed / productsLimit) * 100} className="h-2" />
          </div>

          {/* Expiration */}
          <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
            <p className={`text-sm ${language === 'ar' ? 'font-tajawal text-right' : ''}`}>
              {language === 'fr' 
                ? `Expire dans ${daysRemaining} jours`
                : `تنتهي في ${daysRemaining} يومًا`
              }
            </p>
          </div>

          {/* Upgrade Button */}
          <Button 
            className="w-full bg-accent hover:bg-accent/90 text-white gap-2 shadow-lg shadow-accent/20"
            onClick={() => setShowUpgrade(true)}
          >
            <TrendingUp className="h-4 w-4" />
            {language === 'fr' ? 'Améliorer le Plan' : 'ترقية الخطة'}
          </Button>
        </div>
      </div>

      <UpgradeModal 
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        language={language}
      />
    </>
  );
}
