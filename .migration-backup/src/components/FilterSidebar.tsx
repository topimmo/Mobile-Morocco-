import React, { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Search, X } from "lucide-react";

interface FilterSidebarProps {
  onFilterChange?: (filters: FilterState) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

interface FilterState {
  priceRange: [number, number];
  brands: string[];
  condition: string;
  sellerType: string[];
  location: string;
  features: string[];
  partType: string[];
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  onFilterChange = () => {},
  isOpen = true,
  onClose = () => {},
}) => {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 10000],
    brands: [],
    condition: "",
    sellerType: [],
    location: "",
    features: [],
    partType: [],
  });

  const brands = [
    "Apple",
    "Samsung",
    "Xiaomi",
    "Huawei",
    "Oppo",
    "Vivo",
    "Realme",
    "OnePlus",
    "Nokia",
  ];

  const sellerTypes = ["Importer", "Retailer", "Individual", "Technician"];

  const features = [
    "5G",
    "Dual SIM",
    "Expandable Memory",
    "Fast Charging",
    "Wireless Charging",
    "Water Resistant",
  ];

  const partTypes = [
    "Display",
    "Battery",
    "Charging Port",
    "Camera Module",
    "Motherboard",
    "Speaker",
    "Microphone",
    "Back Cover",
    "Frame",
    "Buttons",
  ];

  const locations = [
    "Casablanca",
    "Rabat",
    "Marrakech",
    "Fes",
    "Tangier",
    "Agadir",
    "Meknes",
    "Oujda",
  ];

  const handlePriceChange = (value: number[]) => {
    const newFilters: FilterState = {
      ...filters,
      priceRange: [value[0], value[1] ?? filters.priceRange[1]] as [number, number],
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked
      ? [...filters.brands, brand]
      : filters.brands.filter((b) => b !== brand);

    const newFilters = { ...filters, brands: newBrands };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleConditionChange = (value: string) => {
    const newFilters = { ...filters, condition: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSellerTypeChange = (type: string, checked: boolean) => {
    const newSellerTypes = checked
      ? [...filters.sellerType, type]
      : filters.sellerType.filter((t) => t !== type);

    const newFilters = { ...filters, sellerType: newSellerTypes };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFilters = { ...filters, location: e.target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleFeatureChange = (feature: string, checked: boolean) => {
    const newFeatures = checked
      ? [...filters.features, feature]
      : filters.features.filter((f) => f !== feature);

    const newFilters = { ...filters, features: newFeatures };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handlePartTypeChange = (partType: string, checked: boolean) => {
    const newPartTypes = checked
      ? [...filters.partType, partType]
      : filters.partType.filter((p) => p !== partType);

    const newFilters = { ...filters, partType: newPartTypes };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      priceRange: [0, 10000] as [number, number],
      brands: [],
      condition: "",
      sellerType: [],
      location: "",
      features: [],
      partType: [],
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  if (!isOpen) return null;

  return (
    <div className="w-full max-w-full sm:max-w-[280px] h-full bg-background border-r p-3 sm:p-4 overflow-y-auto max-h-[80vh] sm:max-h-none">
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <h2 className="text-base sm:text-lg font-semibold">Filters</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-3"
          >
            Reset
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="sm:hidden"
            onClick={onClose}
          >
            <X className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {/* Price Range */}
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                defaultValue={[filters.priceRange[0], filters.priceRange[1]]}
                max={10000}
                step={100}
                onValueChange={handlePriceChange}
              />
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={filters.priceRange[0]}
                    onChange={(e) =>
                      handlePriceChange([
                        parseInt(e.target.value),
                        filters.priceRange[1],
                      ])
                    }
                    className="w-24 h-8"
                  />
                  <span>DH</span>
                </div>
                <span>-</span>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={filters.priceRange[1]}
                    onChange={(e) =>
                      handlePriceChange([
                        filters.priceRange[0],
                        parseInt(e.target.value),
                      ])
                    }
                    className="w-24 h-8"
                  />
                  <span>DH</span>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Brands */}
        <AccordionItem value="brands">
          <AccordionTrigger>Brands</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <div className="relative mb-3">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search brands" className="pl-8" />
              </div>
              {brands.map((brand) => (
                <div key={brand} className="flex items-center space-x-2">
                  <Checkbox
                    id={`brand-${brand}`}
                    checked={filters.brands.includes(brand)}
                    onCheckedChange={(checked) =>
                      handleBrandChange(brand, checked === true)
                    }
                  />
                  <Label htmlFor={`brand-${brand}`}>{brand}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Condition */}
        <AccordionItem value="condition">
          <AccordionTrigger>Condition</AccordionTrigger>
          <AccordionContent>
            <RadioGroup
              value={filters.condition}
              onValueChange={handleConditionChange}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="new" id="condition-new" />
                <Label htmlFor="condition-new">New</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="like-new" id="condition-like-new" />
                <Label htmlFor="condition-like-new">Like New</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good" id="condition-good" />
                <Label htmlFor="condition-good">Good</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fair" id="condition-fair" />
                <Label htmlFor="condition-fair">Fair</Label>
              </div>
            </RadioGroup>
          </AccordionContent>
        </AccordionItem>

        {/* Seller Type */}
        <AccordionItem value="seller-type">
          <AccordionTrigger>Seller Type</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {sellerTypes.map((type) => (
                <div key={type} className="flex items-center space-x-2">
                  <Checkbox
                    id={`seller-${type}`}
                    checked={filters.sellerType.includes(type)}
                    onCheckedChange={(checked) =>
                      handleSellerTypeChange(type, checked === true)
                    }
                  />
                  <Label htmlFor={`seller-${type}`}>{type}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Location */}
        <AccordionItem value="location">
          <AccordionTrigger>Location</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search location"
                  className="pl-8"
                  value={filters.location}
                  onChange={handleLocationChange}
                />
              </div>
              <div className="space-y-1 mt-2">
                {locations.map((location) => (
                  <Button
                    key={location}
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-left"
                    onClick={() => {
                      const newFilters = { ...filters, location };
                      setFilters(newFilters);
                      onFilterChange(newFilters);
                    }}
                  >
                    {location}
                  </Button>
                ))}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Features */}
        <AccordionItem value="features">
          <AccordionTrigger>Features</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {features.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={`feature-${feature}`}
                    checked={filters.features.includes(feature)}
                    onCheckedChange={(checked) =>
                      handleFeatureChange(feature, checked === true)
                    }
                  />
                  <Label htmlFor={`feature-${feature}`}>{feature}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Spare Parts */}
        <AccordionItem value="spare-parts">
          <AccordionTrigger>Spare Parts</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              {partTypes.map((part) => (
                <div key={part} className="flex items-center space-x-2">
                  <Checkbox
                    id={`part-${part}`}
                    checked={filters.partType.includes(part)}
                    onCheckedChange={(checked) =>
                      handlePartTypeChange(part, checked === true)
                    }
                  />
                  <Label htmlFor={`part-${part}`}>{part}</Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mt-6">
        <Button className="w-full">Apply Filters</Button>
      </div>
    </div>
  );
};

export default FilterSidebar;