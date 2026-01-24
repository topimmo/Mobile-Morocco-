import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Check, X, Clock } from 'lucide-react';
import {
  approveNeighborhood,
  rejectNeighborhood,
  type PendingNeighborhood,
} from '@/lib/supabase/admin';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';
import { Language } from '@/contexts/LanguageContext';

interface NeighborhoodListProps {
  neighborhoods: PendingNeighborhood[];
  onUpdate: () => void;
  language?: Language;
}

export function NeighborhoodList({
  neighborhoods,
  onUpdate,
  language = 'ar',
}: NeighborhoodListProps) {
  const { toast } = useToast();
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const isRTL = language === 'ar';

  const labels = {
    title: isRTL ? 'الأحياء المعلقة' : 'Quartiers en attente',
    noData: isRTL ? 'لا توجد أحياء معلقة' : 'Aucun quartier en attente',
    city: isRTL ? 'المدينة' : 'Ville',
    neighborhood: isRTL ? 'الحي' : 'Quartier',
    submittedBy: isRTL ? 'مقدم من' : 'Soumis par',
    submittedOn: isRTL ? 'بتاريخ' : 'Le',
    approve: isRTL ? 'موافقة' : 'Approuver',
    reject: isRTL ? 'رفض' : 'Rejeter',
    approved: isRTL ? 'تمت الموافقة' : 'Approuvé',
    rejected: isRTL ? 'تم الرفض' : 'Rejeté',
    error: isRTL ? 'خطأ' : 'Erreur',
  };

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    const result = await approveNeighborhood(id);
    setActionLoading(null);

    if (result.success) {
      toast({
        title: labels.approved,
        description: isRTL
          ? 'تمت الموافقة على الحي وأصبح متاحاً للجميع'
          : 'Le quartier a été approuvé et est maintenant disponible',
      });
      onUpdate();
    } else {
      toast({
        title: labels.error,
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    const result = await rejectNeighborhood(id);
    setActionLoading(null);

    if (result.success) {
      toast({
        title: labels.rejected,
        description: isRTL
          ? 'تم رفض الحي وحذفه من النظام'
          : 'Le quartier a été rejeté et supprimé',
      });
      onUpdate();
    } else {
      toast({
        title: labels.error,
        description: result.error,
        variant: 'destructive',
      });
    }
  };

  if (neighborhoods.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
            <MapPin className="h-5 w-5" />
            {labels.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={cn('text-muted-foreground text-center py-8', isRTL && 'text-right')}>
            {labels.noData}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
          <MapPin className="h-5 w-5" />
          {labels.title}
          <Badge variant="secondary">{neighborhoods.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {neighborhoods.map((neighborhood) => (
            <div
              key={neighborhood.id}
              className={cn(
                'flex items-start justify-between gap-4 p-4 border rounded-lg',
                isRTL && 'flex-row-reverse'
              )}
            >
              <div className={cn('flex-1 space-y-1', isRTL && 'text-right')}>
                <div className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
                  <h3 className="font-medium">{neighborhood.name}</h3>
                  <Badge variant="outline" className="text-xs">
                    <Clock className={cn('h-3 w-3', isRTL ? 'ml-1' : 'mr-1')} />
                    {isRTL ? 'جديد' : 'nouveau'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {labels.city}:{' '}
                  {isRTL ? neighborhood.city_name_ar : neighborhood.city_name_fr}
                </p>
                <p className="text-xs text-muted-foreground">
                  {labels.submittedOn}:{' '}
                  {new Date(neighborhood.created_at).toLocaleDateString(
                    isRTL ? 'ar-MA' : 'fr-MA'
                  )}
                </p>
              </div>

              <div className={cn('flex gap-2', isRTL && 'flex-row-reverse')}>
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => handleApprove(neighborhood.id)}
                  disabled={actionLoading === neighborhood.id}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Check className={cn('h-4 w-4', isRTL ? 'ml-1' : 'mr-1')} />
                  {labels.approve}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleReject(neighborhood.id)}
                  disabled={actionLoading === neighborhood.id}
                >
                  <X className={cn('h-4 w-4', isRTL ? 'ml-1' : 'mr-1')} />
                  {labels.reject}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default NeighborhoodList;
