import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Search,
  MapPin,
  X,
  SlidersHorizontal,
  Target,
} from "lucide-react";

interface AdvancedSearchProps {
  onSearch?: (filters: SearchFilters) => void;
  onClose?: () => void;
  initialFilters?: Partial<SearchFilters>;
}

interface SearchFilters {
  query: string;
  category: string;
  condition: string[];
  brands: string[];
  priceRange: [number, number];
  location: string;
  radius: number; // in km
  datePosted: string;
  features: string[];
  sortBy: string;
  hasImages: boolean;
  hasWarranty: boolean;
  negotiable: boolean;
}

const AdvancedSearch: React.FC<AdvancedSearchProps> = ({
  onSearch = () => {},
  onClose: _onClose = () => {},
  initialFilters = {},
}) => {
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    category: "",
    condition: [],
    brands: [],
    priceRange: [0, 50000],
    location: "",
    radius: 10,
    datePosted: "",
    features: [],
    sortBy: "relevance",
    hasImages: false,
    hasWarranty: false,
    negotiable: false,
    ...initialFilters,
  });

  const [isOpen, setIsOpen] = useState(false);

  const categories = [
    "Smartphones",
    "Accessories",
    "Spare Parts",
    "Repair Equipment",
    "Cases & Covers",
    "Chargers & Cables",
    "Audio",
  ];

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
    "Google",
    "Sony",
    "LG",
    "Motorola",
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
    "Kenitra",
    "Tetouan",
    "Safi",
    "Mohammedia",
  ];

  const features = [
    "5G",
    "Dual SIM",
    "Expandable Memory",
    "Fast Charging",
    "Wireless Charging",
    "Water Resistant",
    "Face ID",
    "Fingerprint Scanner",
    "NFC",
    "Bluetooth 5.0",
  ];

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleArrayFilterToggle = (key: keyof SearchFilters, value: string) => {
    setFilters((prev) => {
      const currentArray = prev[key] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value];
      return {
        ...prev,
        [key]: newArray,
      };
    });
  };

  const handleSearch = () => {
    onSearch(filters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    setFilters({
      query: "",
      category: "",
      condition: [],
      brands: [],
      priceRange: [0, 50000],
      location: "",
      radius: 10,
      datePosted: "",
      features: [],
      sortBy: "relevance",
      hasImages: false,
      hasWarranty: false,
      negotiable: false,
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.query) count++;
    if (filters.category) count++;
    if (filters.condition.length > 0) count++;
    if (filters.brands.length > 0) count++;
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 50000) count++;
    if (filters.location) count++;
    if (filters.datePosted) count++;
    if (filters.features.length > 0) count++;
    if (filters.hasImages || filters.hasWarranty || filters.negotiable) count++;
    return count;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative">
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Advanced Search
          {getActiveFiltersCount() > 0 && (
            <Badge
              variant="secondary"
              className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {getActiveFiltersCount()}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Advanced Search
          </DialogTitle>
          <DialogDescription>
            Use advanced filters to find exactly what you're looking for
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Search */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Search</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="query">Search Keywords</Label>
                <Input
                  id="query"
                  placeholder="e.g., iPhone 13, Samsung Galaxy..."
                  value={filters.query}
                  onChange={(e) => handleFilterChange("query", e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select
                  value={filters.category}
                  onValueChange={(value) =>
                    handleFilterChange("category", value)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sortBy">Sort By</Label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => handleFilterChange("sortBy", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Most Relevant</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price-low">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-high">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="distance">Nearest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Location & Geo-targeting */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location & Geo-targeting
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="location">City/Location</Label>
                <Select
                  value={filters.location}
                  onValueChange={(value) =>
                    handleFilterChange("location", value)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Locations</SelectItem>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          {location}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="radius" className="flex items-center gap-2">
                  <Target className="h-3 w-3" />
                  Search Radius: {filters.radius} km
                </Label>
                <Slider
                  value={[filters.radius]}
                  onValueChange={(value) =>
                    handleFilterChange("radius", value[0])
                  }
                  max={100}
                  min={1}
                  step={1}
                  className="mt-2"
                  disabled={!filters.location}
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1 km</span>
                  <span>100 km</span>
                </div>
              </div>

              <div>
                <Label htmlFor="datePosted">Date Posted</Label>
                <Select
                  value={filters.datePosted}
                  onValueChange={(value) =>
                    handleFilterChange("datePosted", value)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Any time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This week</SelectItem>
                    <SelectItem value="month">This month</SelectItem>
                    <SelectItem value="3months">Last 3 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Product Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Product Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Condition</Label>
                <div className="grid grid-cols-1 gap-2 mt-2">
                  {["new", "used", "refurbished"].map((condition) => (
                    <div
                      key={condition}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`condition-${condition}`}
                        checked={filters.condition.includes(condition)}
                        onCheckedChange={() =>
                          handleArrayFilterToggle("condition", condition)
                        }
                      />
                      <Label
                        htmlFor={`condition-${condition}`}
                        className="text-sm"
                      >
                        {condition === "new"
                          ? "New"
                          : condition === "used"
                            ? "Used"
                            : "Refurbished"}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Label>Price Range (MAD)</Label>
                <div className="mt-2">
                  <Slider
                    value={filters.priceRange}
                    onValueChange={(value) =>
                      handleFilterChange(
                        "priceRange",
                        value as [number, number],
                      )
                    }
                    max={50000}
                    min={0}
                    step={100}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground mt-1">
                    <span>{filters.priceRange[0].toLocaleString()} MAD</span>
                    <span>{filters.priceRange[1].toLocaleString()} MAD</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasImages"
                    checked={filters.hasImages}
                    onCheckedChange={(checked) =>
                      handleFilterChange("hasImages", checked)
                    }
                  />
                  <Label htmlFor="hasImages" className="text-sm">
                    Has Images
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="hasWarranty"
                    checked={filters.hasWarranty}
                    onCheckedChange={(checked) =>
                      handleFilterChange("hasWarranty", checked)
                    }
                  />
                  <Label htmlFor="hasWarranty" className="text-sm">
                    Has Warranty
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="negotiable"
                    checked={filters.negotiable}
                    onCheckedChange={(checked) =>
                      handleFilterChange("negotiable", checked)
                    }
                  />
                  <Label htmlFor="negotiable" className="text-sm">
                    Price Negotiable
                  </Label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Brands & Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Brands & Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Brands</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
                  {brands.map((brand) => (
                    <div key={brand} className="flex items-center space-x-2">
                      <Checkbox
                        id={`brand-${brand}`}
                        checked={filters.brands.includes(brand)}
                        onCheckedChange={() =>
                          handleArrayFilterToggle("brands", brand)
                        }
                      />
                      <Label htmlFor={`brand-${brand}`} className="text-sm">
                        {brand}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <Label>Features</Label>
                <div className="grid grid-cols-2 gap-2 mt-2 max-h-40 overflow-y-auto">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-2">
                      <Checkbox
                        id={`feature-${feature}`}
                        checked={filters.features.includes(feature)}
                        onCheckedChange={() =>
                          handleArrayFilterToggle("features", feature)
                        }
                      />
                      <Label htmlFor={`feature-${feature}`} className="text-sm">
                        {feature}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Filters Summary */}
        {getActiveFiltersCount() > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Active Filters ({getActiveFiltersCount()})
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {filters.query && (
                  <Badge variant="secondary">Search: "{filters.query}"</Badge>
                )}
                {filters.category && (
                  <Badge variant="secondary">
                    Category: {filters.category}
                  </Badge>
                )}
                {filters.condition.length > 0 && (
                  <Badge variant="secondary">
                    Condition: {filters.condition.join(", ")}
                  </Badge>
                )}
                {filters.brands.length > 0 && (
                  <Badge variant="secondary">
                    Brands: {filters.brands.slice(0, 2).join(", ")}
                    {filters.brands.length > 2 &&
                      ` +${filters.brands.length - 2}`}
                  </Badge>
                )}
                {(filters.priceRange[0] > 0 ||
                  filters.priceRange[1] < 50000) && (
                  <Badge variant="secondary">
                    Price: {filters.priceRange[0].toLocaleString()} -{" "}
                    {filters.priceRange[1].toLocaleString()} MAD
                  </Badge>
                )}
                {filters.location && (
                  <Badge variant="secondary">
                    Location: {filters.location} ({filters.radius}km)
                  </Badge>
                )}
                {filters.datePosted && (
                  <Badge variant="secondary">
                    Posted: {filters.datePosted}
                  </Badge>
                )}
                {filters.features.length > 0 && (
                  <Badge variant="secondary">
                    Features: {filters.features.slice(0, 2).join(", ")}
                    {filters.features.length > 2 &&
                      ` +${filters.features.length - 2}`}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={clearFilters}>
            Clear All Filters
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search Products
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedSearch;
