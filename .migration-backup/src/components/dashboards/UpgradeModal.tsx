import { Check, Crown } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  language: 'ar' | 'fr';
}

const plans = {
  fr: [
    {
      name: 'Gratuit',
      price: '0',
      products: '10',
      features: ['10 produits maximum', 'Support par email', 'Statistiques de base'],
      current: false,
    },
    {
      name: 'Standard',
      price: '299',
      products: '100',
      features: ['100 produits', 'Support prioritaire', 'Analytique avancée', 'Badge vérifié'],
      current: true,
      popular: true,
    },
    {
      name: 'Professionnel',
      price: '599',
      products: 'Illimité',
      features: ['Produits illimités', 'Support 24/7', 'Analytique complète', 'Badge premium', 'Promotion prioritaire'],
      current: false,
    },
  ],
  ar: [
    {
      name: 'مجاني',
      price: '0',
      products: '10',
      features: ['10 منتجات كحد أقصى', 'دعم عبر البريد الإلكتروني', 'إحصائيات أساسية'],
      current: false,
    },
    {
      name: 'قياسي',
      price: '299',
      products: '100',
      features: ['100 منتج', 'دعم ذو أولوية', 'تحليلات متقدمة', 'شارة موثقة'],
      current: true,
      popular: true,
    },
    {
      name: 'احترافي',
      price: '599',
      products: 'غير محدود',
      features: ['منتجات غير محدودة', 'دعم 24/7', 'تحليلات كاملة', 'شارة مميزة', 'ترويج ذو أولوية'],
      current: false,
    },
  ],
};

export function UpgradeModal({ open, onClose, language }: UpgradeModalProps) {
  const planList = plans[language];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/10 max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className={`text-2xl font-grotesk text-center mb-2 ${language === 'ar' ? 'font-tajawal' : ''}`}>
            {language === 'fr' ? 'Choisissez Votre Plan' : 'اختر خطتك'}
          </DialogTitle>
          <p className="text-center text-muted-foreground">
            {language === 'fr' 
              ? 'Développez votre entreprise avec plus de fonctionnalités'
              : 'قم بتوسيع عملك مع المزيد من الميزات'
            }
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {planList.map((plan, index) => (
            <div
              key={index}
              className={`glass-card rounded-xl p-6 relative ${
                plan.popular ? 'border-2 border-accent glow-cyan' : 'border border-white/10'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-accent text-white px-4 py-1 rounded-full text-xs font-semibold">
                    {language === 'fr' ? 'Populaire' : 'الأكثر شعبية'}
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className={`text-xl font-grotesk font-bold mb-2 ${language === 'ar' ? 'font-tajawal' : ''}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-mono-jet font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">MAD/{language === 'fr' ? 'mois' : 'شهر'}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {plan.products} {language === 'fr' ? 'produits' : 'منتجات'}
                </p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                    <span className={`text-sm ${language === 'ar' ? 'font-tajawal text-right' : ''}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  plan.current
                    ? 'bg-muted text-muted-foreground cursor-not-allowed'
                    : plan.popular
                    ? 'bg-accent hover:bg-accent/90 text-white'
                    : 'bg-primary hover:bg-primary/90'
                }`}
                disabled={plan.current}
              >
                {plan.current ? (
                  language === 'fr' ? 'Plan Actuel' : 'الخطة الحالية'
                ) : (
                  <>
                    <Crown className="h-4 w-4 mr-2" />
                    {language === 'fr' ? 'Choisir ce Plan' : 'اختر هذه الخطة'}
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-accent/10 border border-accent/20">
          <p className={`text-sm text-center ${language === 'ar' ? 'font-tajawal' : ''}`}>
            {language === 'fr'
              ? '💡 Tous les plans incluent une période d\'essai de 7 jours'
              : '💡 جميع الخطط تشمل فترة تجريبية مدتها 7 أيام'
            }
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
