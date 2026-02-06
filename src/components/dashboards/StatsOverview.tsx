import { Package, Eye, MousePointerClick, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsOverviewProps {
  language: 'ar' | 'fr';
}

const stats = {
  fr: [
    { label: 'Total Produits', value: '127', icon: Package, color: 'from-primary to-orange-600' },
    { label: 'Annonces Actives', value: '94', icon: CheckCircle, color: 'from-success to-green-600' },
    { label: 'Vues ce mois', value: '12.4K', icon: Eye, color: 'from-accent to-cyan-600' },
    { label: 'Clics Contact', value: '847', icon: MousePointerClick, color: 'from-warning to-yellow-600' },
  ],
  ar: [
    { label: 'إجمالي المنتجات', value: '127', icon: Package, color: 'from-primary to-orange-600' },
    { label: 'الإعلانات النشطة', value: '94', icon: CheckCircle, color: 'from-success to-green-600' },
    { label: 'المشاهدات هذا الشهر', value: '12.4K', icon: Eye, color: 'from-accent to-cyan-600' },
    { label: 'نقرات الاتصال', value: '847', icon: MousePointerClick, color: 'from-warning to-yellow-600' },
  ],
};

export function StatsOverview({ language }: StatsOverviewProps) {
  const items = stats[language];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {items.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08, duration: 0.4 }}
          className="glass-card rounded-xl p-6 hover:scale-[1.02] transition-transform duration-200 cursor-pointer group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} shadow-lg`}>
              <stat.icon className="h-6 w-6 text-white" />
            </div>
          </div>
          
          <div>
            <p className={`text-5xl font-mono-jet font-bold mb-2 group-hover:text-primary transition-colors ${language === 'ar' ? 'text-right' : ''}`}>
              {stat.value}
            </p>
            <p className={`text-sm text-muted-foreground uppercase tracking-wider font-grotesk ${language === 'ar' ? 'font-tajawal text-right' : ''}`}>
              {stat.label}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
