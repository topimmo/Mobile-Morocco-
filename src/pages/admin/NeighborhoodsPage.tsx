import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { SEO } from '@/components/SEO';
import {
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import {
  getPendingNeighborhoods,
  getAllNeighborhoods,
  approveNeighborhood,
  rejectNeighborhood,
  deleteNeighborhood,
  Neighborhood,
} from '@/lib/supabase/neighborhoods';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface NeighborhoodWithCity extends Neighborhood {
  city?: {
    id: string;
    name_fr: string;
    name_ar: string;
  };
}

export default function NeighborhoodsPage() {
  const { language } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const isRTL = language === 'ar';

  const [pendingNeighborhoods, setPendingNeighborhoods] = useState<NeighborhoodWithCity[]>([]);
  const [allNeighborhoods, setAllNeighborhoods] = useState<NeighborhoodWithCity[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('pending');

  const labels = {
    title: isRTL ? 'إدارة الأحياء' : 'Gestion des Quartiers',
    pending: isRTL ? 'قيد الانتظار' : 'En attente',
    all: isRTL ? 'الكل' : 'Tous',
    approve: isRTL ? 'موافقة' : 'Approuver',
    reject: isRTL ? 'رفض' : 'Rejeter',
    delete: isRTL ? 'حذف' : 'Supprimer',
    city: isRTL ? 'المدينة' : 'Ville',
    status: isRTL ? 'الحالة' : 'Statut',
    verified: isRTL ? 'تم التحقق' : 'Vérifié',
    pendingStatus: isRTL ? 'قيد الانتظار' : 'En attente',
    createdAt: isRTL ? 'تاريخ الإنشاء' : 'Date de création',
    refresh: isRTL ? 'تحديث' : 'Actualiser',
    noResults: isRTL ? 'لا توجد نتائج' : 'Aucun résultat',
    noPending: isRTL ? 'لا توجد أحياء قيد الانتظار' : 'Aucun quartier en attente',
    actions: isRTL ? 'الإجراءات' : 'Actions',
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [pending, all] = await Promise.all([
        getPendingNeighborhoods(),
        getAllNeighborhoods(),
      ]);
      setPendingNeighborhoods(pending as NeighborhoodWithCity[]);
      setAllNeighborhoods(all as NeighborhoodWithCity[]);
    } catch (error) {
      console.error('Error fetching neighborhoods:', error);
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

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      const success = await approveNeighborhood(id);
      if (success) {
        toast({
          title: isRTL ? 'تمت الموافقة' : 'Approuvé',
          description: isRTL ? 'تمت الموافقة على الحي بنجاح' : 'Quartier approuvé avec succès',
        });
        fetchData();
      } else {
        throw new Error('Failed to approve');
      }
    } catch (error) {
      toast({
        title: isRTL ? 'خطأ' : 'Erreur',
        description: isRTL ? 'فشلت الموافقة' : 'Échec de l\'approbation',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    if (!confirm(isRTL ? 'هل أنت متأكد من رفض هذا الحي؟' : 'Êtes-vous sûr de rejeter ce quartier ?')) {
      return;
    }

    setActionLoading(id);
    try {
      const success = await rejectNeighborhood(id);
      if (success) {
        toast({
          title: isRTL ? 'تم الرفض' : 'Rejeté',
          description: isRTL ? 'تم رفض الحي' : 'Quartier rejeté',
        });
        fetchData();
      } else {
        throw new Error('Failed to reject');
      }
    } catch (error) {
      toast({
        title: isRTL ? 'خطأ' : 'Erreur',
        description: isRTL ? 'فشل الرفض' : 'Échec du rejet',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(isRTL ? 'هل أنت متأكد من حذف هذا الحي؟' : 'Êtes-vous sûr de supprimer ce quartier ?')) {
      return;
    }

    setActionLoading(id);
    try {
      const success = await deleteNeighborhood(id);
      if (success) {
        toast({
          title: isRTL ? 'تم الحذف' : 'Supprimé',
          description: isRTL ? 'تم حذف الحي' : 'Quartier supprimé',
        });
        fetchData();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      toast({
        title: isRTL ? 'خطأ' : 'Erreur',
        description: isRTL ? 'فشل الحذف' : 'Échec de la suppression',
        variant: 'destructive',
      });
    } finally {
      setActionLoading(null);
    }
  };

  // Check if user is admin
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="containerPage py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  if (!user || user.profile?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const renderNeighborhoodCard = (neighborhood: NeighborhoodWithCity) => {
    const isPending = !neighborhood.is_verified;
    const isLoading = actionLoading === neighborhood.id;

    return (
      <Card key={neighborhood.id} className="overflow-hidden">
        <CardHeader className="pb-3">
          <div className={cn('flex items-start justify-between gap-4', isRTL && 'flex-row-reverse')}>
            <div className="flex-1">
              <CardTitle className={cn('text-lg', isRTL && 'text-right')}>
                {neighborhood.name}
              </CardTitle>
              <CardDescription className={cn('mt-1 flex items-center gap-2', isRTL && 'flex-row-reverse text-right')}>
                <MapPin className="h-4 w-4" />
                {neighborhood.city ? (isRTL ? neighborhood.city.name_ar : neighborhood.city.name_fr) : '-'}
              </CardDescription>
            </div>
            <Badge variant={neighborhood.is_verified ? 'default' : 'secondary'}>
              {neighborhood.is_verified ? labels.verified : labels.pendingStatus}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className={cn('flex items-center gap-2 text-sm text-muted-foreground mb-4', isRTL && 'flex-row-reverse')}>
            <Clock className="h-4 w-4" />
            {new Date(neighborhood.created_at).toLocaleDateString(isRTL ? 'ar' : 'fr')}
          </div>
          <div className={cn('flex gap-2', isRTL && 'flex-row-reverse')}>
            {isPending ? (
              <>
                <Button
                  size="sm"
                  onClick={() => handleApprove(neighborhood.id)}
                  disabled={isLoading}
                  className={cn(isRTL && 'flex-row-reverse')}
                >
                  {isLoading ? (
                    <RefreshCw className={cn('h-4 w-4 animate-spin', isRTL ? 'ml-2' : 'mr-2')} />
                  ) : (
                    <CheckCircle className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')} />
                  )}
                  {labels.approve}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleReject(neighborhood.id)}
                  disabled={isLoading}
                  className={cn(isRTL && 'flex-row-reverse')}
                >
                  <XCircle className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')} />
                  {labels.reject}
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(neighborhood.id)}
                disabled={isLoading}
                className={cn(isRTL && 'flex-row-reverse')}
              >
                {isLoading ? (
                  <RefreshCw className={cn('h-4 w-4 animate-spin', isRTL ? 'ml-2' : 'mr-2')} />
                ) : (
                  <Trash2 className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')} />
                )}
                {labels.delete}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <SEO
        title={labels.title}
        description={isRTL ? 'إدارة الأحياء في النظام' : 'Gérer les quartiers dans le système'}
      />
      <div className="min-h-screen bg-background" dir={isRTL ? 'rtl' : 'ltr'}>
        <Navigation />
        <div className="containerPage py-8">
          <div className={cn('flex items-center justify-between mb-6', isRTL && 'flex-row-reverse')}>
            <h1 className={cn('text-3xl font-bold', isRTL && 'text-right')}>{labels.title}</h1>
            <Button
              onClick={fetchData}
              variant="outline"
              size="sm"
              disabled={loading}
              className={cn(isRTL && 'flex-row-reverse')}
            >
              <RefreshCw className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2', loading && 'animate-spin')} />
              {labels.refresh}
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className={cn('grid w-full grid-cols-2 mb-6', isRTL && 'flex-row-reverse')}>
              <TabsTrigger value="pending">
                {labels.pending}
                {pendingNeighborhoods.length > 0 && (
                  <Badge variant="secondary" className={cn('ml-2', isRTL && 'mr-2 ml-0')}>
                    {pendingNeighborhoods.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="all">{labels.all}</TabsTrigger>
            </TabsList>

            <TabsContent value="pending">
              {loading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-48" />
                  ))}
                </div>
              ) : pendingNeighborhoods.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">{labels.noPending}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {pendingNeighborhoods.map(renderNeighborhoodCard)}
                </div>
              )}
            </TabsContent>

            <TabsContent value="all">
              {loading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Skeleton key={i} className="h-48" />
                  ))}
                </div>
              ) : allNeighborhoods.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">{labels.noResults}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {allNeighborhoods.map(renderNeighborhoodCard)}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
