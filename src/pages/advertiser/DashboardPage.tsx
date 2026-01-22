import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus } from 'lucide-react';

export default function AdvertiserDashboard() {
  const { t } = useLanguage();
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen"><span>{t('common.loading')}</span></div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" />;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">{t('advertiser.dashboard')}</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t('advertiser.newCampaign')}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <div className="text-2xl font-bold">0</div>
            <div className="text-muted-foreground">{t('advertiser.activeCampaigns')}</div>
          </Card>
          <Card className="p-6">
            <div className="text-2xl font-bold">0</div>
            <div className="text-muted-foreground">{t('advertiser.impressions')}</div>
          </Card>
          <Card className="p-6">
            <div className="text-2xl font-bold">0</div>
            <div className="text-muted-foreground">{t('advertiser.clicks')}</div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">{t('advertiser.campaigns')}</h2>
          <p className="text-muted-foreground">{t('advertiser.noCampaigns')}</p>
        </Card>
      </div>
    </div>
  );
}
