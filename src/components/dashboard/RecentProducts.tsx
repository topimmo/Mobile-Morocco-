import { MoreVertical, Edit, Trash2, Copy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface RecentProductsProps {
  language: 'ar' | 'fr';
}

const products = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100&q=80',
    title: { fr: 'iPhone 15 Pro Max 256GB', ar: 'آيفون 15 برو ماكس 256 جيجا' },
    price: '12,500 MAD',
    status: 'approved',
    views: 1247,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=100&q=80',
    title: { fr: 'Samsung Galaxy S24 Ultra', ar: 'سامسونج جالاكسي S24 الترا' },
    price: '11,200 MAD',
    status: 'pending',
    views: 892,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=100&q=80',
    title: { fr: 'AirPods Pro 2ème génération', ar: 'إيربودز برو الجيل الثاني' },
    price: '2,800 MAD',
    status: 'approved',
    views: 2341,
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=100&q=80',
    title: { fr: 'Apple Watch Series 9', ar: 'أبل واتش سيريس 9' },
    price: '4,500 MAD',
    status: 'rejected',
    views: 456,
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=100&q=80',
    title: { fr: 'iPad Air M2 11 pouces', ar: 'آيباد إير M2 11 بوصة' },
    price: '6,800 MAD',
    status: 'approved',
    views: 1876,
  },
];

const statusConfig = {
  approved: {
    fr: 'Approuvé',
    ar: 'موافق عليه',
    className: 'bg-success/20 text-success border-success/30',
  },
  pending: {
    fr: 'En attente',
    ar: 'قيد الانتظار',
    className: 'bg-warning/20 text-warning border-warning/30',
  },
  rejected: {
    fr: 'Rejeté',
    ar: 'مرفوض',
    className: 'bg-destructive/20 text-destructive border-destructive/30',
  },
};

export function RecentProducts({ language }: RecentProductsProps) {
  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className={`text-lg font-grotesk font-semibold ${language === 'ar' ? 'font-tajawal' : ''}`}>
          {language === 'fr' ? 'Produits Récents' : 'المنتجات الأخيرة'}
        </h3>
        <Button variant="ghost" size="sm" className="text-accent hover:text-accent/80">
          {language === 'fr' ? 'Voir tout' : 'عرض الكل'}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className={`text-muted-foreground uppercase text-xs tracking-wider ${language === 'ar' ? 'text-right' : ''}`}>
                {language === 'fr' ? 'Produit' : 'المنتج'}
              </TableHead>
              <TableHead className={`text-muted-foreground uppercase text-xs tracking-wider ${language === 'ar' ? 'text-right' : ''}`}>
                {language === 'fr' ? 'Prix' : 'السعر'}
              </TableHead>
              <TableHead className={`text-muted-foreground uppercase text-xs tracking-wider ${language === 'ar' ? 'text-right' : ''}`}>
                {language === 'fr' ? 'Statut' : 'الحالة'}
              </TableHead>
              <TableHead className={`text-muted-foreground uppercase text-xs tracking-wider ${language === 'ar' ? 'text-right' : ''}`}>
                {language === 'fr' ? 'Vues' : 'المشاهدات'}
              </TableHead>
              <TableHead className={`text-muted-foreground uppercase text-xs tracking-wider ${language === 'ar' ? 'text-right' : ''}`}>
                {language === 'fr' ? 'Actions' : 'الإجراءات'}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id} className="border-white/10 hover:bg-white/5 transition-colors">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image}
                      alt={product.title[language]}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <span className={`font-medium ${language === 'ar' ? 'font-tajawal' : ''}`}>
                      {product.title[language]}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="font-mono-jet font-semibold">{product.price}</span>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusConfig[product.status as keyof typeof statusConfig].className}>
                    {statusConfig[product.status as keyof typeof statusConfig][language]}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="font-mono-jet">{product.views.toLocaleString()}</span>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="hover:bg-white/10">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="glass-card border-white/10">
                      <DropdownMenuItem className="gap-2">
                        <Edit className="h-4 w-4" />
                        {language === 'fr' ? 'Modifier' : 'تعديل'}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <Copy className="h-4 w-4" />
                        {language === 'fr' ? 'Dupliquer' : 'نسخ'}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-destructive">
                        <Trash2 className="h-4 w-4" />
                        {language === 'fr' ? 'Supprimer' : 'حذف'}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
