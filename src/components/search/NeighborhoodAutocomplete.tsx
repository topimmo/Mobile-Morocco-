import { useState, useEffect, useRef, useCallback } from 'react';
import { MapPin, Plus, Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  getNeighborhoodsByCity,
  searchNeighborhoods,
  addOrGetNeighborhood,
  Neighborhood,
} from '@/lib/supabase/neighborhoods';
import { Language } from '@/contexts/LanguageContext';

interface NeighborhoodAutocompleteProps {
  cityId: string;
  value?: string;
  onChange: (neighborhoodId: string, neighborhood?: Neighborhood) => void;
  language?: Language;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  userId?: string;
}

export function NeighborhoodAutocomplete({
  cityId,
  value,
  onChange,
  language = 'ar',
  placeholder,
  className,
  disabled = false,
  userId,
}: NeighborhoodAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [neighborhoods, setNeighborhoods] = useState<Neighborhood[]>([]);
  const [filteredNeighborhoods, setFilteredNeighborhoods] = useState<Neighborhood[]>([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<Neighborhood | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isRTL = language === 'ar';
  const placeholderText = placeholder || (isRTL ? 'الحي / المنطقة...' : 'Quartier / Zone...');
  const addNewText = isRTL ? 'إضافة حي جديد:' : 'Ajouter un nouveau quartier:';
  const noResultsText = isRTL ? 'لم يتم العثور على أحياء' : 'Aucun quartier trouvé';

  // Load neighborhoods when city changes
  useEffect(() => {
    if (!cityId) {
      setNeighborhoods([]);
      setFilteredNeighborhoods([]);
      setSelectedNeighborhood(null);
      setInputValue('');
      return;
    }

    const loadNeighborhoods = async () => {
      setLoading(true);
      const data = await getNeighborhoodsByCity(cityId);
      setNeighborhoods(data);
      setFilteredNeighborhoods(data);
      setLoading(false);
    };
    loadNeighborhoods();
  }, [cityId]);

  // Find selected neighborhood when value changes
  useEffect(() => {
    if (value && neighborhoods.length > 0) {
      const neighborhood = neighborhoods.find((n) => n.id === value);
      if (neighborhood) {
        setSelectedNeighborhood(neighborhood);
        setInputValue(neighborhood.name);
      }
    } else if (!value) {
      setSelectedNeighborhood(null);
      setInputValue('');
    }
  }, [value, neighborhoods]);

  // Filter neighborhoods based on input
  const handleInputChange = useCallback(async (searchTerm: string) => {
    setInputValue(searchTerm);
    
    if (!cityId) return;

    if (searchTerm.trim().length < 1) {
      setFilteredNeighborhoods(neighborhoods);
      return;
    }

    // Local filter first
    const localFiltered = neighborhoods.filter((n) =>
      n.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNeighborhoods(localFiltered);

    // Server search for more results
    if (searchTerm.trim().length >= 2) {
      const serverResults = await searchNeighborhoods(cityId, searchTerm);
      const merged = [...localFiltered];
      serverResults.forEach((sr) => {
        if (!merged.find((m) => m.id === sr.id)) {
          merged.push(sr);
        }
      });
      setFilteredNeighborhoods(merged);
    }
  }, [cityId, neighborhoods]);

  const handleSelect = (neighborhood: Neighborhood) => {
    setSelectedNeighborhood(neighborhood);
    setInputValue(neighborhood.name);
    onChange(neighborhood.id, neighborhood);
    setIsOpen(false);
  };

  const handleAddNew = async () => {
    if (!cityId || !inputValue.trim()) return;

    setAdding(true);
    const newNeighborhood = await addOrGetNeighborhood(cityId, inputValue.trim(), userId);
    setAdding(false);

    if (newNeighborhood) {
      // Update local list
      if (!neighborhoods.find((n) => n.id === newNeighborhood.id)) {
        setNeighborhoods((prev) => [...prev, newNeighborhood]);
      }
      handleSelect(newNeighborhood);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showAddOption = inputValue.trim() && !filteredNeighborhoods.find(
    (n) => n.name.toLowerCase() === inputValue.trim().toLowerCase()
  );

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <MapPin className={cn(
          'absolute top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground',
          isRTL ? 'right-3' : 'left-3'
        )} />
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholderText}
          disabled={disabled || !cityId}
          className={cn(
            isRTL ? 'pr-10 text-right' : 'pl-10',
            'w-full'
          )}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        {loading && (
          <Loader2 className={cn(
            'absolute top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground',
            isRTL ? 'left-3' : 'right-3'
          )} />
        )}
      </div>

      {isOpen && cityId && (
        <div className={cn(
          'absolute z-50 mt-1 w-full rounded-md border bg-popover shadow-lg',
          'max-h-60 overflow-auto'
        )}>
          {filteredNeighborhoods.length === 0 && !showAddOption ? (
            <div className={cn(
              'px-4 py-3 text-sm text-muted-foreground text-center',
              isRTL && 'text-right'
            )}>
              {noResultsText}
            </div>
          ) : (
            <div className="py-1">
              {filteredNeighborhoods.map((neighborhood) => (
                <button
                  key={neighborhood.id}
                  type="button"
                  onClick={() => handleSelect(neighborhood)}
                  className={cn(
                    'flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-accent cursor-pointer',
                    isRTL && 'flex-row-reverse text-right',
                    selectedNeighborhood?.id === neighborhood.id && 'bg-accent'
                  )}
                >
                  <Check className={cn(
                    'h-4 w-4',
                    selectedNeighborhood?.id === neighborhood.id ? 'opacity-100' : 'opacity-0'
                  )} />
                  <span className="flex-1">{neighborhood.name}</span>
                  {!neighborhood.is_verified && (
                    <span className="text-xs text-muted-foreground">
                      {isRTL ? 'جديد' : 'nouveau'}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {showAddOption && (
            <div className="border-t">
              <button
                type="button"
                onClick={handleAddNew}
                disabled={adding}
                className={cn(
                  'flex w-full items-center gap-2 px-4 py-3 text-sm hover:bg-accent cursor-pointer',
                  isRTL && 'flex-row-reverse text-right',
                  'text-primary font-medium'
                )}
              >
                {adding ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                <span>{addNewText} "{inputValue.trim()}"</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NeighborhoodAutocomplete;
