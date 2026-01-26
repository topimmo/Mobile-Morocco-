import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { SEO } from '@/components/SEO';
import { Card } from '@/components/ui/card';
import { Wrench, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function AgentDashboard() {
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
        title={isRTL ? 'لوحة تحكم الفني' : 'Tableau de bord Agent'}
        description={isRTL ? 'لوحة تحكم الفني - إدارة الخدمات والطلبات' : 'Agent Dashboard - Gérer vos services et demandes'}
        noindex={true}
      />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
              <Wrench className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {isRTL ? 'لوحة تحكم الفني' : 'Tableau de bord Agent'}
              </h1>
              <p className="text-muted-foreground">
                {isRTL ? `مرحباً ${user?.profile?.full_name || 'الفني'}` : `Bienvenue ${user?.profile?.full_name || 'Agent'}`}
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
              {isRTL ? 'خدمات الإصلاح' : 'Services de réparation'}
            </h2>
            <p className="text-muted-foreground mb-4">
              {isRTL 
                ? 'إدارة خدمات الإصلاح الخاصة بك'
                : 'Gérez vos services de réparation'}
            </p>
            <Button className="w-full">
              {isRTL ? 'إدارة الخدمات' : 'Gérer les services'}
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              {isRTL ? 'الطلبات' : 'Demandes'}
            </h2>
            <p className="text-muted-foreground mb-4">
              {isRTL 
                ? 'عرض وإدارة طلبات العملاء'
                : 'Voir et gérer les demandes des clients'}
            </p>
            <Button className="w-full">
              {isRTL ? 'عرض الطلبات' : 'Voir les demandes'}
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">
              {isRTL ? 'الملف الشخصي' : 'Profil'}
            </h2>
            <p className="text-muted-foreground mb-4">
              {isRTL 
                ? 'تحديث معلومات الملف الشخصي'
                : 'Mettre à jour vos informations'}
            </p>
            <Button className="w-full" variant="outline">
              {isRTL ? 'تعديل الملف' : 'Modifier le profil'}
            </Button>
          </Card>
        </div>

        <div className="mt-8 p-4 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-sm text-orange-800">
            {isRTL 
              ? '✅ أنت مسجل كفني/حرفي. يمكنك إدارة خدمات الإصلاح واستقبال طلبات العملاء.'
              : '✅ Vous êtes enregistré comme technicien/artisan. Vous pouvez gérer vos services de réparation et recevoir des demandes de clients.'}
          </p>
        </div>
      </div>
    </div>
  );
}
