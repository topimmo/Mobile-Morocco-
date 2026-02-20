import { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { getCities, getCitiesByRegion, City, getCityName } from '@/lib/supabase/cities';
import { Language } from '@/contexts/LanguageContext';

interface CitySelectorProps {
  value?: string;
  onChange: (cityId: string, city?: City) => void;
  language?: Language;
  placeholder?: string;
  className?: string;
  groupByRegion?: boolean;
}

export function CitySelector({
  value,
  onChange,
  language = 'ar',
  placeholder,
  className,
  groupByRegion = false,
}: CitySelectorProps) {
  const [open, setOpen] = useState(false);
  const [cities, setCities] = useState<City[]>([]);
  const [citiesByRegion, setCitiesByRegion] = useState<Record<string, City[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState<City | null>(null);

  const isRTL = language === 'ar';
  const placeholderText = placeholder || (isRTL ? 'اختر المدينة...' : 'Sélectionner une ville...');
  const searchPlaceholder = isRTL ? 'البحث عن مدينة...' : 'Rechercher une ville...';
  const noResults = isRTL ? 'لم يتم العثور على مدينة.' : 'Aucune ville trouvée.';

  useEffect(() => {
    const loadCities = async () => {
      setLoading(true);
      if (groupByRegion) {
        const grouped = await getCitiesByRegion(language);
        setCitiesByRegion(grouped);
        const allCities = Object.values(grouped).flat();
        setCities(allCities);
      } else {
        const data = await getCities(language);
        setCities(data);
      }
      setLoading(false);
    };
    loadCities();
  }, [language, groupByRegion]);

  useEffect(() => {
    if (value && cities.length > 0) {
      const city = cities.find((c) => c.id === value);
      setSelectedCity(city || null);
    } else {
      setSelectedCity(null);
    }
  }, [value, cities]);

  const handleSelect = (cityId: string) => {
    const city = cities.find((c) => c.id === cityId);
    setSelectedCity(city || null);
    onChange(cityId, city);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between',
            isRTL && 'flex-row-reverse text-right',
            className
          )}
          disabled={loading}
        >
          <span className={cn('flex items-center gap-2', isRTL && 'flex-row-reverse')}>
            <MapPin className="h-4 w-4 text-muted-foreground" />
            {selectedCity ? getCityName(selectedCity, language) : placeholderText}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align={isRTL ? 'end' : 'start'}>
        <Command dir={isRTL ? 'rtl' : 'ltr'}>
          <CommandInput placeholder={searchPlaceholder} className={isRTL ? 'text-right' : ''} />
          <CommandList>
            <CommandEmpty>{noResults}</CommandEmpty>
            {groupByRegion ? (
              Object.entries(citiesByRegion).map(([region, regionCities]) => (
                <CommandGroup key={region} heading={region}>
                  {regionCities.map((city) => (
                    <CommandItem
                      key={city.id}
                      value={`${getCityName(city, language)} ${city.slug}`}
                      onSelect={() => handleSelect(city.id)}
                      className={cn(isRTL && 'flex-row-reverse text-right')}
                    >
                      <Check
                        className={cn(
                          'h-4 w-4',
                          isRTL ? 'ml-2' : 'mr-2',
                          value === city.id ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {getCityName(city, language)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))
            ) : (
              <CommandGroup>
                {cities.map((city) => (
                  <CommandItem
                    key={city.id}
                    value={`${getCityName(city, language)} ${city.slug}`}
                    onSelect={() => handleSelect(city.id)}
                    className={cn(isRTL && 'flex-row-reverse text-right')}
                  >
                    <Check
                      className={cn(
                        'h-4 w-4',
                        isRTL ? 'ml-2' : 'mr-2',
                        value === city.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {getCityName(city, language)}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default CitySelector;
