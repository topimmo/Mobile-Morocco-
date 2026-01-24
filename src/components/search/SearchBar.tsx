import { useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { trackSearch } from '@/services/analyticsService';
import { Language } from '@/contexts/LanguageContext';

interface SearchBarProps {
  value?: string;
  onChange: (value: string) => void;
  onSearch?: (value: string) => void;
  language?: Language;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value = '',
  onChange,
  onSearch,
  language = 'ar',
  placeholder,
  className,
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value);

  const isRTL = language === 'ar';
  const placeholderText = placeholder || (isRTL ? 'بحث عن هواتف، إكسسوارات...' : 'Rechercher téléphones, accessoires...');

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localValue.trim()) {
      trackSearch(localValue.trim(), 0); // Results count tracked separately
    }
    onSearch?.(localValue);
  };

  const handleClear = () => {
    setLocalValue('');
    onChange('');
    onSearch?.('');
  };

  return (
    <form onSubmit={handleSubmit} className={cn('relative flex gap-2', className)}>
      <div className="relative flex-1">
        <Search className={cn(
          'absolute top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground',
          isRTL ? 'right-3' : 'left-3'
        )} />
        <Input
          type="text"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholderText}
          className={cn(
            'h-12 text-base',
            isRTL ? 'pr-10 pl-10 text-right' : 'pl-10 pr-10'
          )}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        {localValue && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              'absolute top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted',
              isRTL ? 'left-2' : 'right-2'
            )}
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </button>
        )}
      </div>
      <Button type="submit" size="lg" className="h-12 px-6">
        <Search className={cn('h-5 w-5', isRTL && 'ml-2', !isRTL && 'mr-2')} />
        {isRTL ? 'بحث' : 'Rechercher'}
      </Button>
    </form>
  );
}

export default SearchBar;
