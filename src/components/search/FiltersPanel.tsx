import { useState, useEffect } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { CitySelector } from './CitySelector';
import { NeighborhoodAutocomplete } from './NeighborhoodAutocomplete';
import { getCategories, Category } from '@/lib/supabase/categories';
import { City } from '@/lib/supabase/cities';
import { Neighborhood } from '@/lib/supabase/neighborhoods';
import { Language } from '@/contexts/LanguageContext';

export interface FilterValues {
  keyword?: string;
  categoryId?: string;
  cityId?: string;
  neighborhoodId?: string;
  condition?: 'new' | 'used' | 'refurbished' | '';
  sortBy?: 'newest' | 'oldest' | 'price_low' | 'price_high' | '';
}

interface FiltersPanelProps {
  values: FilterValues;
  onChange: (values: FilterValues) => void;
  onReset?: () => void;
  language?: Language;
  showCondition?: boolean;
  showPrice?: boolean;
  className?: string;
  collapsible?: boolean;
}

export function FiltersPanel({
  values,
  onChange,
  onReset,
  language = 'ar',
  showCondition = true,
  showPrice = true,
  className,
  collapsible = false,
}: FiltersPanelProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(!collapsible);

  const isRTL = language === 'ar';

  const labels = {
    filters: isRTL ? 'الفلترة' : 'Filtres',
    category: isRTL ? 'الفئة' : 'Catégorie',
    allCategories: isRTL ? 'جميع الفئات' : 'Toutes les catégories',
    city: isRTL ? 'المدينة' : 'Ville',
    neighborhood: isRTL ? 'الحي' : 'Quartier',
    condition: isRTL ? 'الحالة' : 'État',
    allConditions: isRTL ? 'جميع الحالات' : 'Tous les états',
    new: isRTL ? 'جديد' : 'Neuf',
    used: isRTL ? 'مستعمل' : 'Occasion',
    refurbished: isRTL ? 'مجدد' : 'Reconditionné',
    sortBy: isRTL ? 'ترتيب حسب' : 'Trier par',
    newest: isRTL ? 'الأحدث' : 'Plus récent',
    oldest: isRTL ? 'الأقدم' : 'Plus ancien',
    priceLow: isRTL ? 'السعر: من الأقل إلى الأعلى' : 'Prix: croissant',
    priceHigh: isRTL ? 'السعر: من الأعلى إلى الأقل' : 'Prix: décroissant',
    reset: isRTL ? 'إعادة تعيين' : 'Réinitialiser',
    showFilters: isRTL ? 'إظهار الفلاتر' : 'Afficher les filtres',
    hideFilters: isRTL ? 'إخفاء الفلاتر' : 'Masquer les filtres',
  };

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      const data = await getCategories();
      setCategories(data);
      setLoading(false);
    };
    loadCategories();
  }, []);

  const handleCityChange = (cityId: string, _city?: City) => {
    onChange({
      ...values,
      cityId,
      neighborhoodId: undefined, // Reset neighborhood when city changes
    });
  };

  const handleNeighborhoodChange = (neighborhoodId: string, _neighborhood?: Neighborhood) => {
    onChange({
      ...values,
      neighborhoodId,
    });
  };

  const handleReset = () => {
    onChange({});
    onReset?.();
  };

  const hasActiveFilters = Boolean(
    values.categoryId || values.cityId || values.neighborhoodId || values.condition || values.sortBy
  );

  const content = (
    <div className={cn('space-y-4', className)} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Category */}
      <div className="space-y-2">
        <Label className={isRTL ? 'text-right block' : ''}>{labels.category}</Label>
        <Select
          value={values.categoryId || ''}
          onValueChange={(v) => onChange({ ...values, categoryId: v || undefined })}
          disabled={loading}
        >
          <SelectTrigger className={isRTL ? 'text-right' : ''}>
            <SelectValue placeholder={labels.allCategories} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">{labels.allCategories}</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {isRTL ? cat.name_ar : cat.name_fr}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* City */}
      <div className="space-y-2">
        <Label className={isRTL ? 'text-right block' : ''}>{labels.city}</Label>
        <CitySelector
          value={values.cityId}
          onChange={handleCityChange}
          language={language}
          groupByRegion
        />
      </div>

      {/* Neighborhood */}
      {values.cityId && (
        <div className="space-y-2">
          <Label className={isRTL ? 'text-right block' : ''}>{labels.neighborhood}</Label>
          <NeighborhoodAutocomplete
            cityId={values.cityId}
            value={values.neighborhoodId}
            onChange={handleNeighborhoodChange}
            language={language}
          />
        </div>
      )}

      {/* Condition */}
      {showCondition && (
        <div className="space-y-2">
          <Label className={isRTL ? 'text-right block' : ''}>{labels.condition}</Label>
          <Select
            value={values.condition || ''}
            onValueChange={(v) => onChange({ ...values, condition: v as FilterValues['condition'] })}
          >
            <SelectTrigger className={isRTL ? 'text-right' : ''}>
              <SelectValue placeholder={labels.allConditions} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">{labels.allConditions}</SelectItem>
              <SelectItem value="new">{labels.new}</SelectItem>
              <SelectItem value="used">{labels.used}</SelectItem>
              <SelectItem value="refurbished">{labels.refurbished}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Sort */}
      {showPrice && (
        <div className="space-y-2">
          <Label className={isRTL ? 'text-right block' : ''}>{labels.sortBy}</Label>
          <Select
            value={values.sortBy || ''}
            onValueChange={(v) => onChange({ ...values, sortBy: v as FilterValues['sortBy'] })}
          >
            <SelectTrigger className={isRTL ? 'text-right' : ''}>
              <SelectValue placeholder={labels.newest} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">{labels.newest}</SelectItem>
              <SelectItem value="oldest">{labels.oldest}</SelectItem>
              <SelectItem value="price_low">{labels.priceLow}</SelectItem>
              <SelectItem value="price_high">{labels.priceHigh}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Reset Button */}
      {hasActiveFilters && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className={cn('w-full', isRTL && 'flex-row-reverse')}
        >
          <X className={cn('h-4 w-4', isRTL ? 'ml-2' : 'mr-2')} />
          {labels.reset}
        </Button>
      )}
    </div>
  );

  if (collapsible) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className={className}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className={cn('w-full justify-between', isRTL && 'flex-row-reverse')}>
            <span className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
              <Filter className="h-4 w-4" />
              {isOpen ? labels.hideFilters : labels.showFilters}
              {hasActiveFilters && (
                <span className="h-2 w-2 rounded-full bg-primary" />
              )}
            </span>
            {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          {content}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return content;
}

export default FiltersPanel;
