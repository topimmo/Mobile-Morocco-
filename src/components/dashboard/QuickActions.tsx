import { useState } from 'react';
import { Plus, TrendingUp, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddProductModal } from './AddProductModal';
import { UpgradeModal } from './UpgradeModal';

interface QuickActionsProps {
  language: 'ar' | 'fr';
}

export function QuickActions({ language }: QuickActionsProps) {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  return (
    <>
      <div className="glass-card rounded-xl p-6">
        <h3 className={`text-lg font-grotesk font-semibold mb-4 ${language === 'ar' ? 'font-tajawal text-right' : ''}`}>
          {language === 'fr' ? 'Actions Rapides' : 'إجراءات سريعة'}
        </h3>
        
        <div className="flex flex-wrap gap-4">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 gap-2 font-outfit"
            onClick={() => setShowAddProduct(true)}
          >
            <Plus className="h-5 w-5" />
            {language === 'fr' ? 'Ajouter un Produit' : 'إضافة منتج'}
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            className="glass-card border-accent text-accent hover:bg-accent/10 gap-2 font-outfit glow-cyan"
            onClick={() => setShowUpgrade(true)}
          >
            <TrendingUp className="h-5 w-5" />
            {language === 'fr' ? 'Améliorer l\'Abonnement' : 'ترقية الاشتراك'}
          </Button>
          
          <Button 
            size="lg" 
            variant="outline"
            className="glass-card border-white/10 hover:bg-white/10 gap-2 font-outfit"
          >
            <BarChart3 className="h-5 w-5" />
            {language === 'fr' ? 'Voir Analytique' : 'عرض التحليلات'}
          </Button>
        </div>
      </div>

      <AddProductModal 
        open={showAddProduct}
        onClose={() => setShowAddProduct(false)}
        language={language}
      />

      <UpgradeModal 
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        language={language}
      />
    </>
  );
}
