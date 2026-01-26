import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SEO } from '@/components/SEO';
import { ShieldAlert, Home, LogIn } from 'lucide-react';

export default function UnauthorizedPage() {
  const { language } = useLanguage();
  const navigate = useNavigate();
  const isRTL = language === 'ar';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO
        title={isRTL ? 'غير مصرح' : 'Non autorisé'}
        description={isRTL ? 'ليس لديك الإذن للوصول إلى هذه الصفحة' : 'Vous n\'avez pas la permission d\'accéder à cette page'}
        noindex={true}
      />
      <Card className="w-full max-w-md p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert className="h-8 w-8 text-red-600" />
        </div>
        
        <h1 className="text-3xl font-bold mb-4">
          {isRTL ? 'غير مصرح' : 'Non autorisé'}
        </h1>
        
        <p className="text-muted-foreground mb-8">
          {isRTL 
            ? 'عذراً، ليس لديك الإذن للوصول إلى هذه الصفحة. يرجى تسجيل الدخول بحساب مصرح له.'
            : 'Désolé, vous n\'avez pas la permission d\'accéder à cette page. Veuillez vous connecter avec un compte autorisé.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate('/')} variant="outline">
            <Home className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {isRTL ? 'الصفحة الرئيسية' : 'Page d\'accueil'}
          </Button>
          <Button onClick={() => navigate('/auth/login')}>
            <LogIn className={`h-4 w-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {isRTL ? 'تسجيل الدخول' : 'Se connecter'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
