import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { SEO } from '@/components/SEO';
import { Card } from '@/components/ui/card';
import { Store, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function MerchantDashboard() {
  const { language } = useLanguage();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isRTL = language === 'ar';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO
        title={isRTL ? 'لوحة تحكم المتجر' : 'Tableau de bord Boutique'}
        description={isRTL ? 'لوحة تحكم المتجر - إدارة المنتجات والإعلانات' : 'Merchant Dashboard - Gérer vos produits et annonces'}
        noindex={true}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center">
              <Store className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {isRTL ? 'لوحة تحكم المتجر' : 'Tableau de bord Boutique'}
              </h1>
              <p className="text-muted-foreground">
                {isRTL ? `مرحباً ${user?.profile?.full_name || 'التاجر'}` : `Bienvenue ${user?.profile?.full_name || 'Marchand'}`}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {isRTL ? 'تسجيل الخروج' : 'Déconnexion'}
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              {isRTL ? 'إدارة المتجر' : 'Gérer la boutique'}
            </h2>
            <p className="text-muted-foreground mb-4">
              {isRTL 
                ? 'تحديث معلومات وصور المتجر'
                : 'Mettre à jour les informations et images de votre boutique'}
            </p>
            <Button className="w-full">
              {isRTL ? 'تعديل المتجر' : 'Modifier la boutique'}
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              {isRTL ? 'المنتجات' : 'Produits'}
            </h2>
            <p className="text-muted-foreground mb-4">
              {isRTL 
                ? 'إدارة المنتجات والإعلانات'
                : 'Gérer vos produits et annonces'}
            </p>
            <Button className="w-full">
              {isRTL ? 'إدارة المنتجات' : 'Gérer les produits'}
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              {isRTL ? 'الإحصائيات' : 'Statistiques'}
            </h2>
            <p className="text-muted-foreground mb-4">
              {isRTL 
                ? 'عرض إحصائيات المتجر والمبيعات'
                : 'Voir les statistiques de votre boutique'}
            </p>
            <Button className="w-full" variant="outline">
              {isRTL ? 'عرض الإحصائيات' : 'Voir les stats'}
            </Button>
          </Card>
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            {isRTL 
              ? '✅ أنت مسجل كمتجر/مستورد. يمكنك نشر إعلانات متعددة وإدارة المخزون.'
              : '✅ Vous êtes enregistré comme boutique/importateur. Vous pouvez publier plusieurs annonces et gérer votre inventaire.'}
          </p>
        </div>
      </div>
    </div>
  );
}
