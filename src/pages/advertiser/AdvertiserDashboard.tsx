import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import {
  Plus,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  MousePointer,
  Calendar,
  Image,
  ArrowLeft,
  ArrowRight,
} from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  banner_image_url: string;
  destination_url: string;
  start_date: string;
  end_date: string;
  status: string;
  payment_status: string;
  impressions: number;
  clicks: number;
  created_at: string;
}

export default function AdvertiserDashboard() {
  const { language } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const isRTL = language === 'ar';
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  const labels = {
    title: isRTL ? 'لوحة تحكم الإعلانات' : 'Tableau de bord publicitaire',
    subtitle: isRTL ? 'إدارة حملاتك الإعلانية' : 'Gérez vos campagnes publicitaires',
    createCampaign: isRTL ? 'إنشاء حملة جديدة' : 'Créer une campagne',
    all: isRTL ? 'الكل' : 'Tout',
    active: isRTL ? 'نشطة' : 'Actives',
    pending: isRTL ? 'قيد المراجعة' : 'En attente',
    completed: isRTL ? 'منتهية' : 'Terminées',
    noCampaigns: isRTL ? 'لا توجد حملات إعلانية' : 'Aucune campagne',
    noCampaignsHint: isRTL ? 'أنشئ حملتك الإعلانية الأولى' : 'Créez votre première campagne publicitaire',
    status: {
      draft: isRTL ? 'مسودة' : 'Brouillon',
      submitted: isRTL ? 'تم الإرسال' : 'Soumis',
      pending_review: isRTL ? 'قيد المراجعة' : 'En révision',
      approved: isRTL ? 'موافق عليها' : 'Approuvée',
      active: isRTL ? 'نشطة' : 'Active',
      expired: isRTL ? 'منتهية' : 'Expirée',
      rejected: isRTL ? 'مرفوضة' : 'Rejetée',
      paused: isRTL ? 'متوقفة' : 'En pause',
      completed: isRTL ? 'مكتملة' : 'Terminée',
    },
    paymentStatus: {
      pending: isRTL ? 'في انتظار الدفع' : 'En attente de paiement',
      uploaded: isRTL ? 'تم رفع إثبات الدفع' : 'Preuve téléchargée',
      verified: isRTL ? 'تم التحقق' : 'Vérifié',
      rejected: isRTL ? 'مرفوض' : 'Rejeté',
    },
    impressions: isRTL ? 'المشاهدات' : 'Impressions',
    clicks: isRTL ? 'النقرات' : 'Clics',
    startDate: isRTL ? 'تاريخ البداية' : 'Date de début',
    endDate: isRTL ? 'تاريخ النهاية' : 'Date de fin',
    viewDetails: isRTL ? 'عرض التفاصيل' : 'Voir détails',
    statistics: isRTL ? 'الإحصائيات' : 'Statistiques',
    totalCampaigns: isRTL ? 'إجمالي الحملات' : 'Total des campagnes',
    activeCampaigns: isRTL ? 'الحملات النشطة' : 'Campagnes actives',
    totalImpressions: isRTL ? 'إجمالي المشاهدات' : 'Total des impressions',
    totalClicks: isRTL ? 'إجمالي النقرات' : 'Total des clics',
  };

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    loadCampaigns();
  }, [user]);

  const loadCampaigns = async () => {
    if (!user) return;
    setLoading(true);
    
    const { data, error } = await supabase
      .from('ad_campaigns')
      .select('*')
      .eq('advertiser_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading campaigns:', error);
    } else {
      setCampaigns(data || []);
    }
    setLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string; icon: any }> = {
      draft: { color: 'bg-gray-500', icon: Clock },
      submitted: { color: 'bg-blue-500', icon: Clock },
      pending_review: { color: 'bg-yellow-500', icon: AlertCircle },
      approved: { color: 'bg-green-500', icon: CheckCircle },
      active: { color: 'bg-green-600', icon: CheckCircle },
      expired: { color: 'bg-gray-600', icon: XCircle },
      rejected: { color: 'bg-red-500', icon: XCircle },
      paused: { color: 'bg-orange-500', icon: AlertCircle },
      completed: { color: 'bg-blue-600', icon: CheckCircle },
    };
    
    const { color, icon: Icon } = statusMap[status] || { color: 'bg-gray-500', icon: Clock };
    return (
      <Badge className={cn(color, 'text-white')}>
        <Icon className="h-3 w-3 mr-1" />
        {labels.status[status as keyof typeof labels.status] || status}
      </Badge>
    );
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return campaign.status === 'active';
    if (activeTab === 'pending') return ['draft', 'submitted', 'pending_review'].includes(campaign.status);
    if (activeTab === 'completed') return ['expired', 'completed'].includes(campaign.status);
    return true;
  });

  const stats = {
    total: campaigns.length,
    active: campaigns.filter(c => c.status === 'active').length,
    impressions: campaigns.reduce((sum, c) => sum + (c.impressions || 0), 0),
    clicks: campaigns.reduce((sum, c) => sum + (c.clicks || 0), 0),
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? 'rtl' : 'ltr'}>
      <Navigation />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className={cn('flex items-center justify-between mb-8', isRTL && 'flex-row-reverse')}>
          <div>
            <h1 className={cn('text-3xl font-bold', isRTL && 'text-right')}>{labels.title}</h1>
            <p className={cn('text-gray-600', isRTL && 'text-right')}>{labels.subtitle}</p>
          </div>
          <Link to="/advertiser/create-campaign">
            <Button size="lg">
              <Plus className={cn('h-5 w-5', isRTL ? 'ml-2' : 'mr-2')} />
              {labels.createCampaign}
            </Button>
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className={cn('flex items-center gap-4', isRTL && 'flex-row-reverse')}>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-gray-600">{labels.totalCampaigns}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className={cn('flex items-center gap-4', isRTL && 'flex-row-reverse')}>
                <div className="p-3 bg-green-100 rounded-lg">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.active}</p>
                  <p className="text-sm text-gray-600">{labels.activeCampaigns}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className={cn('flex items-center gap-4', isRTL && 'flex-row-reverse')}>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Eye className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.impressions.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{labels.totalImpressions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className={cn('flex items-center gap-4', isRTL && 'flex-row-reverse')}>
                <div className="p-3 bg-orange-100 rounded-lg">
                  <MousePointer className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.clicks.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">{labels.totalClicks}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns List */}
        <Card>
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">{labels.all}</TabsTrigger>
                <TabsTrigger value="active">{labels.active}</TabsTrigger>
                <TabsTrigger value="pending">{labels.pending}</TabsTrigger>
                <TabsTrigger value="completed">{labels.completed}</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            {filteredCampaigns.length === 0 ? (
              <div className="text-center py-16">
                <Image className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">{labels.noCampaigns}</h3>
                <p className="text-gray-500 mb-6">{labels.noCampaignsHint}</p>
                <Link to="/advertiser/create-campaign">
                  <Button>
                    <Plus className={cn('h-5 w-5', isRTL ? 'ml-2' : 'mr-2')} />
                    {labels.createCampaign}
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCampaigns.map((campaign) => (
                  <Card key={campaign.id} className="overflow-hidden">
                    <div className="h-32 bg-gray-200 relative">
                      {campaign.banner_image_url ? (
                        <img
                          src={campaign.banner_image_url}
                          alt={campaign.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Image className="h-12 w-12 text-gray-400" />
                        </div>
                      )}
                      <div className={cn('absolute top-2', isRTL ? 'left-2' : 'right-2')}>
                        {getStatusBadge(campaign.status)}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className={cn('font-semibold mb-2 truncate', isRTL && 'text-right')}>
                        {campaign.name}
                      </h3>
                      
                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(campaign.start_date).toLocaleDateString(isRTL ? 'ar-MA' : 'fr-MA')}</span>
                          <span>-</span>
                          <span>{new Date(campaign.end_date).toLocaleDateString(isRTL ? 'ar-MA' : 'fr-MA')}</span>
                        </div>
                        <div className={cn('flex items-center justify-between', isRTL && 'flex-row-reverse')}>
                          <div className={cn('flex items-center gap-1', isRTL && 'flex-row-reverse')}>
                            <Eye className="h-4 w-4" />
                            <span>{(campaign.impressions || 0).toLocaleString()}</span>
                          </div>
                          <div className={cn('flex items-center gap-1', isRTL && 'flex-row-reverse')}>
                            <MousePointer className="h-4 w-4" />
                            <span>{(campaign.clicks || 0).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <Link to={`/advertiser/campaigns/${campaign.id}`}>
                        <Button variant="outline" className="w-full">
                          {labels.viewDetails}
                          <ArrowIcon className={cn('h-4 w-4', isRTL ? 'mr-2' : 'ml-2')} />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <footer className="bg-gray-900 text-gray-300 py-8 px-4 mt-12">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">© 2025 Mobile Maroc. {isRTL ? 'جميع الحقوق محفوظة.' : 'Tous droits réservés.'}</p>
        </div>
      </footer>
    </div>
  );
}
