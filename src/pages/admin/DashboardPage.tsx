import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { SEO } from '@/components/SEO';
import {
  Users,
  ShoppingBag,
  Wrench,
  Megaphone,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  TrendingUp,
  Activity,
  BarChart3,
  Search,
  Eye,
  Phone,
  MessageCircle,
  UserPlus,
  PlusCircle,
} from 'lucide-react';
import {
  getAdminStats,
  getPendingListings,
  getPendingRepairShops,
  getPendingCampaigns,
  approveListing,
  rejectListing,
  approveRepairShop,
  rejectRepairShop,
  approveCampaign,
  rejectCampaign,
  getRecentActivity,
  type AdminStats,
  type PendingListing,
  type PendingRepairShop,
  type PendingCampaign,
} from '@/lib/supabase/admin';
import { useToast } from '@/components/ui/use-toast';

export default function AdminDashboard() {
  const { t, isRTL } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();

  // State
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingListings, setPendingListings] = useState<PendingListing[]>([]);
  const [pendingShops, setPendingShops] = useState<PendingRepairShop[]>([]);
  const [pendingCampaigns, setPendingCampaigns] = useState<PendingCampaign[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch all data
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsData, listingsResult, shopsResult, campaignsResult, activity] = await Promise.all([
        getAdminStats(),
        getPendingListings(),
        getPendingRepairShops(),
        getPendingCampaigns(),
        getRecentActivity(),
      ]);
      setStats(statsData);
      // Extract data from paginated results (listings is paginated, shops/campaigns return arrays)
      setPendingListings(listingsResult.data || []);
      setPendingShops(shopsResult || []);
      setPendingCampaigns(campaignsResult || []);
      setRecentActivity(activity);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: isRTL ? 'خطأ' : 'Erreur',
        description: isRTL ? 'فشل تحميل البيانات' : 'Échec du chargement des données',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [toast, isRTL]);

  useEffect(() => {
    if (user && user.profile?.role === 'admin') {
      fetchData();
    }
  }, [user, fetchData]);

  // Action handlers
  const handleApproveListing = async (id: string) => {
    setActionLoading(id);
    const result = await approveListing(id);
    if (result.success) {
      setPendingListings((prev) => prev.filter((l) => l.id !== id));
      setStats((prev) => prev ? { ...prev, pendingListings: prev.pendingListings - 1, approvedListings: prev.approvedListings + 1 } : prev);
      toast({ title: isRTL ? 'تمت الموافقة' : 'Approuvé', description: isRTL ? 'تمت الموافقة على الإعلان' : 'L\'annonce a été approuvée' });
    } else {
      toast({ title: isRTL ? 'خطأ' : 'Erreur', description: result.error, variant: 'destructive' });
    }
    setActionLoading(null);
  };

  const handleRejectListing = async (id: string) => {
    setActionLoading(id);
    const result = await rejectListing(id);
    if (result.success) {
      setPendingListings((prev) => prev.filter((l) => l.id !== id));
      setStats((prev) => prev ? { ...prev, pendingListings: prev.pendingListings - 1 } : prev);
      toast({ title: isRTL ? 'تم الرفض' : 'Rejeté', description: isRTL ? 'تم رفض الإعلان' : 'L\'annonce a été rejetée' });
    } else {
      toast({ title: isRTL ? 'خطأ' : 'Erreur', description: result.error, variant: 'destructive' });
    }
    setActionLoading(null);
  };

  const handleApproveShop = async (id: string) => {
    setActionLoading(id);
    const result = await approveRepairShop(id);
    if (result.success) {
      setPendingShops((prev) => prev.filter((s) => s.id !== id));
      setStats((prev) => prev ? { ...prev, pendingRepairShops: prev.pendingRepairShops - 1, approvedRepairShops: prev.approvedRepairShops + 1 } : prev);
      toast({ title: isRTL ? 'تمت الموافقة' : 'Approuvé', description: isRTL ? 'تمت الموافقة على المحل' : 'Le magasin a été approuvé' });
    } else {
      toast({ title: isRTL ? 'خطأ' : 'Erreur', description: result.error, variant: 'destructive' });
    }
    setActionLoading(null);
  };

  const handleRejectShop = async (id: string) => {
    setActionLoading(id);
    const result = await rejectRepairShop(id);
    if (result.success) {
      setPendingShops((prev) => prev.filter((s) => s.id !== id));
      setStats((prev) => prev ? { ...prev, pendingRepairShops: prev.pendingRepairShops - 1 } : prev);
      toast({ title: isRTL ? 'تم الرفض' : 'Rejeté', description: isRTL ? 'تم رفض المحل' : 'Le magasin a été rejeté' });
    } else {
      toast({ title: isRTL ? 'خطأ' : 'Erreur', description: result.error, variant: 'destructive' });
    }
    setActionLoading(null);
  };

  const handleApproveCampaign = async (id: string) => {
    setActionLoading(id);
    const result = await approveCampaign(id);
    if (result.success) {
      setPendingCampaigns((prev) => prev.filter((c) => c.id !== id));
      setStats((prev) => prev ? { ...prev, pendingCampaigns: prev.pendingCampaigns - 1, activeCampaigns: prev.activeCampaigns + 1 } : prev);
      toast({ title: isRTL ? 'تمت الموافقة' : 'Approuvé', description: isRTL ? 'تمت الموافقة على الحملة' : 'La campagne a été approuvée' });
    } else {
      toast({ title: isRTL ? 'خطأ' : 'Erreur', description: result.error, variant: 'destructive' });
    }
    setActionLoading(null);
  };

  const handleRejectCampaign = async (id: string) => {
    setActionLoading(id);
    const result = await rejectCampaign(id);
    if (result.success) {
      setPendingCampaigns((prev) => prev.filter((c) => c.id !== id));
      setStats((prev) => prev ? { ...prev, pendingCampaigns: prev.pendingCampaigns - 1 } : prev);
      toast({ title: isRTL ? 'تم الرفض' : 'Rejeté', description: isRTL ? 'تم رفض الحملة' : 'La campagne a été rejetée' });
    } else {
      toast({ title: isRTL ? 'خطأ' : 'Erreur', description: result.error, variant: 'destructive' });
    }
    setActionLoading(null);
  };

  // Auth checks
  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.profile?.role !== 'admin') {
    return <Navigate to="/" />;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(isRTL ? 'ar-MA' : 'fr-MA', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(isRTL ? 'ar-MA' : 'fr-MA', {
      style: 'currency',
      currency: 'MAD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
      <SEO
        title="Tableau de bord Admin"
        description="Gérez les utilisateurs, annonces et campagnes publicitaires sur Mobile Maroc."
        noindex={true}
      />
      
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link to="/" className="font-bold text-xl text-primary">
              Mobile Maroc
            </Link>
            <Badge variant="secondary" className="hidden sm:inline-flex">
              {isRTL ? 'لوحة الإدارة' : 'Admin'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={fetchData} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Link to="/">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                {isRTL ? 'الموقع' : 'Site'}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">
          {isRTL ? 'لوحة الإدارة' : 'Tableau de bord Admin'}
        </h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Total Users */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isRTL ? 'إجمالي المستخدمين' : 'Total Utilisateurs'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <span className="text-2xl font-bold">{stats?.totalUsers || 0}</span>
                )}
                <Users className="h-5 w-5 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          {/* Pending Listings */}
          <Card className={stats?.pendingListings ? 'border-orange-500' : ''}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isRTL ? 'إعلانات معلقة' : 'Annonces en attente'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <span className="text-2xl font-bold text-orange-600">{stats?.pendingListings || 0}</span>
                )}
                <ShoppingBag className="h-5 w-5 text-orange-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {isRTL ? `${stats?.approvedListings || 0} موافق عليها` : `${stats?.approvedListings || 0} approuvées`}
              </p>
            </CardContent>
          </Card>

          {/* Pending Shops */}
          <Card className={stats?.pendingRepairShops ? 'border-orange-500' : ''}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isRTL ? 'محلات معلقة' : 'Magasins en attente'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <span className="text-2xl font-bold text-orange-600">{stats?.pendingRepairShops || 0}</span>
                )}
                <Wrench className="h-5 w-5 text-orange-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {isRTL ? `${stats?.approvedRepairShops || 0} موافق عليها` : `${stats?.approvedRepairShops || 0} approuvés`}
              </p>
            </CardContent>
          </Card>

          {/* Pending Campaigns */}
          <Card className={stats?.pendingCampaigns ? 'border-orange-500' : ''}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {isRTL ? 'حملات معلقة' : 'Campagnes en attente'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                {loading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <span className="text-2xl font-bold text-orange-600">{stats?.pendingCampaigns || 0}</span>
                )}
                <Megaphone className="h-5 w-5 text-orange-500" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {isRTL ? `${stats?.activeCampaigns || 0} نشطة` : `${stats?.activeCampaigns || 0} actives`}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Moderation Tabs */}
        <Tabs defaultValue="listings" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="listings" className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline">{isRTL ? 'الإعلانات' : 'Annonces'}</span>
              {stats?.pendingListings ? (
                <Badge variant="destructive" className="ml-1">{stats.pendingListings}</Badge>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value="shops" className="flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              <span className="hidden sm:inline">{isRTL ? 'المحلات' : 'Magasins'}</span>
              {stats?.pendingRepairShops ? (
                <Badge variant="destructive" className="ml-1">{stats.pendingRepairShops}</Badge>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="flex items-center gap-2">
              <Megaphone className="h-4 w-4" />
              <span className="hidden sm:inline">{isRTL ? 'الحملات' : 'Campagnes'}</span>
              {stats?.pendingCampaigns ? (
                <Badge variant="destructive" className="ml-1">{stats.pendingCampaigns}</Badge>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span className="hidden sm:inline">{isRTL ? 'النشاط' : 'Activité'}</span>
            </TabsTrigger>
          </TabsList>

          {/* Pending Listings Tab */}
          <TabsContent value="listings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  {isRTL ? 'الإعلانات في انتظار الموافقة' : 'Annonces en attente d\'approbation'}
                </CardTitle>
                <CardDescription>
                  {isRTL ? 'راجع الإعلانات الجديدة قبل نشرها' : 'Examinez les nouvelles annonces avant publication'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : pendingListings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                    <p>{isRTL ? 'لا توجد إعلانات معلقة' : 'Aucune annonce en attente'}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingListings.map((listing) => (
                      <div key={listing.id} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg">
                        <div className="flex-shrink-0">
                          {listing.image_url ? (
                            <img
                              src={listing.image_url}
                              alt={listing.title}
                              className="w-24 h-24 object-cover rounded"
                            />
                          ) : (
                            <div className="w-24 h-24 bg-muted rounded flex items-center justify-center">
                              <ShoppingBag className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{listing.title}</h3>
                          <p className="text-lg font-bold text-primary">{formatPrice(listing.price)}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <Badge variant="outline">{listing.category_name}</Badge>
                            <Badge variant="secondary">{listing.city_name}</Badge>
                            <Badge variant={listing.condition === 'new' ? 'default' : 'secondary'}>
                              {listing.condition === 'new' ? (isRTL ? 'جديد' : 'Neuf') : (isRTL ? 'مستعمل' : 'Occasion')}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(listing.created_at)}
                          </p>
                        </div>
                        <div className="flex sm:flex-col gap-2 justify-end">
                          <Button
                            size="sm"
                            onClick={() => handleApproveListing(listing.id)}
                            disabled={actionLoading === listing.id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {isRTL ? 'موافقة' : 'Approuver'}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectListing(listing.id)}
                            disabled={actionLoading === listing.id}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            {isRTL ? 'رفض' : 'Rejeter'}
                          </Button>
                          <Link to={`/listings/${listing.slug}`} target="_blank">
                            <Button size="sm" variant="outline">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Shops Tab */}
          <TabsContent value="shops" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  {isRTL ? 'المحلات في انتظار الموافقة' : 'Magasins en attente d\'approbation'}
                </CardTitle>
                <CardDescription>
                  {isRTL ? 'راجع محلات الإصلاح الجديدة' : 'Examinez les nouveaux magasins de réparation'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : pendingShops.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                    <p>{isRTL ? 'لا توجد محلات معلقة' : 'Aucun magasin en attente'}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingShops.map((shop) => (
                      <div key={shop.id} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg">
                        <div className="flex-shrink-0">
                          {shop.cover_image ? (
                            <img
                              src={shop.cover_image}
                              alt={shop.name}
                              className="w-24 h-24 object-cover rounded"
                            />
                          ) : (
                            <div className="w-24 h-24 bg-muted rounded flex items-center justify-center">
                              <Wrench className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{shop.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{shop.description}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <Badge variant="secondary">{shop.city_name}</Badge>
                            {shop.phone && <Badge variant="outline">{shop.phone}</Badge>}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatDate(shop.created_at)}
                          </p>
                        </div>
                        <div className="flex sm:flex-col gap-2 justify-end">
                          <Button
                            size="sm"
                            onClick={() => handleApproveShop(shop.id)}
                            disabled={actionLoading === shop.id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {isRTL ? 'موافقة' : 'Approuver'}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectShop(shop.id)}
                            disabled={actionLoading === shop.id}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            {isRTL ? 'رفض' : 'Rejeter'}
                          </Button>
                          <Link to={`/repair-shops/${shop.slug}`} target="_blank">
                            <Button size="sm" variant="outline">
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  {isRTL ? 'الحملات الإعلانية في انتظار الموافقة' : 'Campagnes publicitaires en attente'}
                </CardTitle>
                <CardDescription>
                  {isRTL ? 'راجع طلبات الإعلانات من المعلنين' : 'Examinez les demandes de publicité des annonceurs'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : pendingCampaigns.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                    <p>{isRTL ? 'لا توجد حملات معلقة' : 'Aucune campagne en attente'}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingCampaigns.map((campaign) => (
                      <div key={campaign.id} className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg">
                        <div className="flex-shrink-0">
                          {campaign.banner_desktop_url ? (
                            <img
                              src={campaign.banner_desktop_url}
                              alt={campaign.title}
                              className="w-32 h-20 object-cover rounded"
                            />
                          ) : (
                            <div className="w-32 h-20 bg-muted rounded flex items-center justify-center">
                              <Megaphone className="h-8 w-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate">{campaign.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            <Badge variant="secondary">{campaign.slot.toUpperCase()}</Badge>
                            <Badge variant="outline">{campaign.duration_days} {isRTL ? 'يوم' : 'jours'}</Badge>
                            <Badge variant="outline">
                              {campaign.start_date} → {campaign.end_date}
                            </Badge>
                          </div>
                          <a href={campaign.target_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                            {campaign.target_url}
                          </a>
                        </div>
                        <div className="flex sm:flex-col gap-2 justify-end">
                          <Button
                            size="sm"
                            onClick={() => handleApproveCampaign(campaign.id)}
                            disabled={actionLoading === campaign.id}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            {isRTL ? 'موافقة' : 'Approuver'}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleRejectCampaign(campaign.id)}
                            disabled={actionLoading === campaign.id}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            {isRTL ? 'رفض' : 'Rejeter'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  {isRTL ? 'النشاط الأخير' : 'Activité récente'}
                </CardTitle>
                <CardDescription>
                  {isRTL ? 'آخر الإعلانات والمحلات المضافة' : 'Dernières annonces et magasins ajoutés'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : recentActivity.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Activity className="h-12 w-12 mx-auto mb-2" />
                    <p>{isRTL ? 'لا يوجد نشاط بعد' : 'Pas encore d\'activité'}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentActivity.map((item, index) => (
                      <div key={`${item.type}-${item.id}`} className="flex items-center gap-3 p-2 rounded hover:bg-muted/50">
                        <div className={`p-2 rounded-full ${item.type === 'listing' ? 'bg-blue-100' : 'bg-green-100'}`}>
                          {item.type === 'listing' ? (
                            <ShoppingBag className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Wrench className="h-4 w-4 text-green-600" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{item.title}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(item.created_at)}</p>
                        </div>
                        <Badge variant={
                          item.status === 'approved' ? 'default' :
                          item.status === 'pending' ? 'secondary' : 'destructive'
                        }>
                          {item.status === 'approved' ? (isRTL ? 'موافق' : 'Approuvé') :
                           item.status === 'pending' ? (isRTL ? 'معلق' : 'En attente') :
                           (isRTL ? 'مرفوض' : 'Rejeté')}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Coming Soon Features */}
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  {isRTL ? 'قريباً' : 'Bientôt disponible'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {isRTL ? 'تحليلات الزيارات المتقدمة' : 'Analyses de trafic avancées'}
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {isRTL ? 'إدارة التقارير والشكاوى' : 'Gestion des rapports et plaintes'}
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {isRTL ? 'نشر تلقائي على وسائل التواصل' : 'Publication automatique sur les réseaux sociaux'}
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {isRTL ? 'إدارة المستخدمين المتقدمة' : 'Gestion avancée des utilisateurs'}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
