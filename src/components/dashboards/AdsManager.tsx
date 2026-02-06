import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff,
  MousePointerClick,
  ArrowUpDown,
  Image as ImageIcon,
  Video,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAds } from '@/lib/ads-context';
import { 
  Ad, 
  AdPlacement, 
  AdStatus, 
  AD_PLACEMENTS, 
  AD_SIZE_DIMENSIONS, 
  AD_STATUSES 
} from '@/types/ads';
import { UploadAdModal } from './UploadAdModal';
import { EditAdModal } from './EditAdModal';

interface AdsManagerProps {
  language: 'ar' | 'fr';
}

const translations = {
  fr: {
    title: 'Gestionnaire de Publicités',
    subtitle: 'Gérez vos campagnes publicitaires',
    addNew: 'Nouvelle Publicité',
    search: 'Rechercher...',
    filterByStatus: 'Filtrer par statut',
    filterByPlacement: 'Filtrer par emplacement',
    allStatuses: 'Tous les statuts',
    allPlacements: 'Tous les emplacements',
    thumbnail: 'Aperçu',
    adTitle: 'Titre',
    type: 'Type',
    size: 'Taille',
    placement: 'Emplacement',
    status: 'Statut',
    views: 'Vues',
    clicks: 'Clics',
    actions: 'Actions',
    edit: 'Modifier',
    delete: 'Supprimer',
    enable: 'Activer',
    disable: 'Désactiver',
    approve: 'Approuver',
    reject: 'Rejeter',
    setPending: 'Mettre en attente',
    deleteConfirmTitle: 'Supprimer la publicité',
    deleteConfirmDesc: 'Êtes-vous sûr de vouloir supprimer cette publicité ? Cette action est irréversible.',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    noAds: 'Aucune publicité trouvée',
    noAdsDesc: 'Créez votre première publicité pour commencer',
    totalAds: 'Total Publicités',
    activeAds: 'Publicités Actives',
    totalViews: 'Vues Totales',
    totalClicks: 'Clics Totaux',
  },
  ar: {
    title: 'مدير الإعلانات',
    subtitle: 'إدارة حملاتك الإعلانية',
    addNew: 'إعلان جديد',
    search: 'بحث...',
    filterByStatus: 'تصفية حسب الحالة',
    filterByPlacement: 'تصفية حسب الموقع',
    allStatuses: 'جميع الحالات',
    allPlacements: 'جميع المواقع',
    thumbnail: 'معاينة',
    adTitle: 'العنوان',
    type: 'النوع',
    size: 'الحجم',
    placement: 'الموقع',
    status: 'الحالة',
    views: 'المشاهدات',
    clicks: 'النقرات',
    actions: 'الإجراءات',
    edit: 'تعديل',
    delete: 'حذف',
    enable: 'تفعيل',
    disable: 'تعطيل',
    approve: 'موافقة',
    reject: 'رفض',
    setPending: 'قيد الانتظار',
    deleteConfirmTitle: 'حذف الإعلان',
    deleteConfirmDesc: 'هل أنت متأكد من حذف هذا الإعلان؟ لا يمكن التراجع عن هذا الإجراء.',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    noAds: 'لا توجد إعلانات',
    noAdsDesc: 'أنشئ إعلانك الأول للبدء',
    totalAds: 'إجمالي الإعلانات',
    activeAds: 'الإعلانات النشطة',
    totalViews: 'إجمالي المشاهدات',
    totalClicks: 'إجمالي النقرات',
  },
};

export function AdsManager({ language }: AdsManagerProps) {
  const t = translations[language];
  const { ads, deleteAd, toggleAdEnabled, updateAdStatus } = useAds();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<AdStatus | 'all'>('all');
  const [placementFilter, setPlacementFilter] = useState<AdPlacement | 'all'>('all');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [adToDelete, setAdToDelete] = useState<string | null>(null);

  // Filter ads
  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ad.status === statusFilter;
    const matchesPlacement = placementFilter === 'all' || ad.placement === placementFilter;
    return matchesSearch && matchesStatus && matchesPlacement;
  });

  // Stats
  const totalAds = ads.length;
  const activeAds = ads.filter(ad => ad.status === 'approved' && ad.enabled).length;
  const totalViews = ads.reduce((sum, ad) => sum + ad.views, 0);
  const totalClicks = ads.reduce((sum, ad) => sum + ad.clicks, 0);

  const handleEdit = (ad: Ad) => {
    setSelectedAd(ad);
    setEditModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setAdToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (adToDelete) {
      deleteAd(adToDelete);
      setAdToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className={`space-y-6 ${language === 'ar' ? 'font-tajawal' : ''}`} dir={language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-grotesk font-bold">{t.title}</h2>
          <p className="text-muted-foreground text-sm">{t.subtitle}</p>
        </div>
        <Button 
          onClick={() => setUploadModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white gap-2"
        >
          <Plus className="h-4 w-4" />
          {t.addNew}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: t.totalAds, value: totalAds, icon: ImageIcon, color: 'text-primary' },
          { label: t.activeAds, value: activeAds, icon: Eye, color: 'text-green-400' },
          { label: t.totalViews, value: formatNumber(totalViews), icon: Eye, color: 'text-accent' },
          { label: t.totalClicks, value: formatNumber(totalClicks), icon: MousePointerClick, color: 'text-yellow-400' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-white/5 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-mono-jet font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-white/5 border-white/10"
          />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as AdStatus | 'all')}>
          <SelectTrigger className="w-full sm:w-[180px] bg-white/5 border-white/10">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder={t.filterByStatus} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.allStatuses}</SelectItem>
            {Object.entries(AD_STATUSES).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>{label[language]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={placementFilter} onValueChange={(v) => setPlacementFilter(v as AdPlacement | 'all')}>
          <SelectTrigger className="w-full sm:w-[200px] bg-white/5 border-white/10">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder={t.filterByPlacement} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t.allPlacements}</SelectItem>
            {Object.entries(AD_PLACEMENTS).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>{label[language]}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Ads Table */}
      <div className="glass-card rounded-xl border border-white/10 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-white/5">
              <TableHead className="text-muted-foreground">{t.thumbnail}</TableHead>
              <TableHead className="text-muted-foreground">{t.adTitle}</TableHead>
              <TableHead className="text-muted-foreground">{t.type}</TableHead>
              <TableHead className="text-muted-foreground">{t.size}</TableHead>
              <TableHead className="text-muted-foreground">{t.placement}</TableHead>
              <TableHead className="text-muted-foreground">{t.status}</TableHead>
              <TableHead className="text-muted-foreground text-center">{t.views}</TableHead>
              <TableHead className="text-muted-foreground text-center">{t.clicks}</TableHead>
              <TableHead className="text-muted-foreground text-right">{t.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAds.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-12">
                  <div className="flex flex-col items-center gap-2">
                    <ImageIcon className="h-12 w-12 text-muted-foreground/50" />
                    <p className="text-muted-foreground">{t.noAds}</p>
                    <p className="text-sm text-muted-foreground/70">{t.noAdsDesc}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredAds.map((ad, index) => (
                <motion.tr
                  key={ad.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="border-white/10 hover:bg-white/5 transition-colors"
                >
                  <TableCell>
                    <div className="w-16 h-12 rounded-lg overflow-hidden bg-white/5">
                      {ad.mediaType === 'image' ? (
                        <img 
                          src={ad.mediaUrl} 
                          alt={ad.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video 
                          src={ad.mediaUrl}
                          className="w-full h-full object-cover"
                          muted
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium truncate max-w-[200px]">{ad.title}</span>
                      {ad.redirectUrl && (
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <ExternalLink className="h-3 w-3" />
                          {new URL(ad.redirectUrl).hostname}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {ad.mediaType === 'image' ? (
                        <ImageIcon className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Video className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="capitalize">{ad.mediaType}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{AD_SIZE_DIMENSIONS[ad.size].label[language]}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{AD_PLACEMENTS[ad.placement].label[language]}</span>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${AD_STATUSES[ad.status].color} border-0`}>
                      {AD_STATUSES[ad.status].label[language]}
                    </Badge>
                    {!ad.enabled && ad.status === 'approved' && (
                      <Badge variant="outline" className="ml-2 text-xs">
                        <EyeOff className="h-3 w-3 mr-1" />
                        {language === 'fr' ? 'Désactivé' : 'معطل'}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center font-mono-jet">
                    {formatNumber(ad.views)}
                  </TableCell>
                  <TableCell className="text-center font-mono-jet">
                    {formatNumber(ad.clicks)}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="hover:bg-white/10">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass-card border-white/10">
                        <DropdownMenuItem onClick={() => handleEdit(ad)}>
                          <Edit className="h-4 w-4 mr-2" />
                          {t.edit}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleAdEnabled(ad.id)}>
                          {ad.enabled ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-2" />
                              {t.disable}
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              {t.enable}
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/10" />
                        {ad.status !== 'approved' && (
                          <DropdownMenuItem 
                            onClick={() => updateAdStatus(ad.id, 'approved')}
                            className="text-green-400"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            {t.approve}
                          </DropdownMenuItem>
                        )}
                        {ad.status !== 'rejected' && (
                          <DropdownMenuItem 
                            onClick={() => updateAdStatus(ad.id, 'rejected')}
                            className="text-red-400"
                          >
                            <EyeOff className="h-4 w-4 mr-2" />
                            {t.reject}
                          </DropdownMenuItem>
                        )}
                        {ad.status !== 'pending' && (
                          <DropdownMenuItem 
                            onClick={() => updateAdStatus(ad.id, 'pending')}
                            className="text-yellow-400"
                          >
                            <ArrowUpDown className="h-4 w-4 mr-2" />
                            {t.setPending}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteClick(ad.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          {t.delete}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </motion.tr>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Upload Modal */}
      <UploadAdModal 
        open={uploadModalOpen} 
        onOpenChange={setUploadModalOpen}
        language={language}
      />

      {/* Edit Modal */}
      {selectedAd && (
        <EditAdModal
          open={editModalOpen}
          onOpenChange={setEditModalOpen}
          ad={selectedAd}
          language={language}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="glass-card border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle>{t.deleteConfirmTitle}</AlertDialogTitle>
            <AlertDialogDescription>{t.deleteConfirmDesc}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/10 hover:bg-white/10">
              {t.cancel}
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90"
            >
              {t.confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
