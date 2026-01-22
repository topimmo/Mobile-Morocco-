import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductCard from "./ProductCard";
import { Product, ProductCondition, FilterOptions } from "@/types/marketplace";

// Mock products data
const mockProducts: Product[] = [
  {
    id: "1",
    user_id: "1",
    category_id: "1",
    title: "iPhone 14 Pro 256GB - Excellent Condition",
    price: 9500,
    condition: "like_new",
    brand: "Apple",
    model: "iPhone 14 Pro",
    storage: "256GB",
    ram: "6GB",
    images: ["https://images.unsplash.com/photo-1678652197831-2d180705cd2c?w=400&q=80"],
    city: { id: "1", name: "Casablanca", slug: "casablanca" },
    neighborhood: { id: "1", city_id: "1", name: "Maarif", slug: "maarif" },
    views: 245,
    status: "approved",
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: "1", name: "Smartphones", slug: "smartphones" },
  },
  {
    id: "2",
    user_id: "2",
    category_id: "1",
    title: "Samsung Galaxy S24 Ultra 512GB",
    price: 12999,
    condition: "new",
    brand: "Samsung",
    model: "Galaxy S24 Ultra",
    storage: "512GB",
    ram: "12GB",
    images: ["https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400&q=80"],
    city: { id: "2", name: "Rabat", slug: "rabat" },
    neighborhood: { id: "2", city_id: "2", name: "Agdal", slug: "agdal" },
    views: 189,
    status: "approved",
    is_featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: "1", name: "Smartphones", slug: "smartphones" },
  },
  {
    id: "3",
    user_id: "3",
    category_id: "2",
    title: "MacBook Air M2 2023 - 16GB RAM",
    price: 14500,
    condition: "like_new",
    brand: "Apple",
    model: "MacBook Air M2",
    storage: "512GB SSD",
    ram: "16GB",
    images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80"],
    city: { id: "3", name: "Marrakech", slug: "marrakech" },
    neighborhood: { id: "3", city_id: "3", name: "Guéliz", slug: "gueliz" },
    views: 312,
    status: "approved",
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: "2", name: "Computers", slug: "computers" },
  },
  {
    id: "4",
    user_id: "4",
    category_id: "3",
    title: "AirPods Pro 2nd Generation",
    price: 1800,
    condition: "new",
    brand: "Apple",
    model: "AirPods Pro 2",
    images: ["https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400&q=80"],
    city: { id: "4", name: "Fès", slug: "fes" },
    views: 156,
    status: "approved",
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: "3", name: "Accessories", slug: "accessories" },
  },
  {
    id: "5",
    user_id: "5",
    category_id: "4",
    title: "iPhone 13 Screen Replacement Kit - Original",
    price: 450,
    condition: "new",
    brand: "Apple",
    compatible_models: ["iPhone 13", "iPhone 13 Mini"],
    images: ["https://images.unsplash.com/photo-1621768216002-5ac171876625?w=400&q=80"],
    city: { id: "1", name: "Casablanca", slug: "casablanca" },
    views: 89,
    status: "approved",
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: "4", name: "Spare Parts", slug: "spare-parts" },
  },
  {
    id: "6",
    user_id: "6",
    category_id: "1",
    title: "Google Pixel 8 Pro 256GB",
    price: 8900,
    condition: "good",
    brand: "Google",
    model: "Pixel 8 Pro",
    storage: "256GB",
    ram: "12GB",
    images: ["https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&q=80"],
    city: { id: "3", name: "Marrakech", slug: "marrakech" },
    views: 134,
    status: "approved",
    is_featured: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: { id: "1", name: "Smartphones", slug: "smartphones" },
  },
];

const categories = [
  { slug: "smartphones", name: "Smartphones", name_ar: "الهواتف الذكية" },
  { slug: "computers", name: "Computers", name_ar: "الحواسيب" },
  { slug: "accessories", name: "Accessories", name_ar: "الإكسسوارات" },
  { slug: "spare-parts", name: "Spare Parts", name_ar: "قطع الغيار" },
];

const cities = ["All Cities", "Casablanca", "Rabat", "Marrakech", "Fès", "Tanger"];
const brands = ["All Brands", "Apple", "Samsung", "Google", "OnePlus", "Xiaomi", "HP", "Dell", "Lenovo"];

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({
    condition: undefined,
    city: undefined,
    brand: undefined,
    minPrice: undefined,
    maxPrice: undefined,
    sortBy: "newest",
  });

  const category = categories.find(c => c.slug === slug);

  const filteredProducts = useMemo(() => {
    return mockProducts
      .filter(p => p.category?.slug === slug)
      .filter(p => !filters.condition || p.condition === filters.condition || 
        (filters.condition === "used" && ["used", "like_new", "good", "fair"].includes(p.condition)))
      .filter(p => !filters.city || filters.city === "All Cities" || p.city?.name === filters.city)
      .filter(p => !filters.brand || filters.brand === "All Brands" || p.brand === filters.brand)
      .filter(p => !filters.minPrice || p.price >= filters.minPrice)
      .filter(p => !filters.maxPrice || p.price <= filters.maxPrice)
      .sort((a, b) => {
        switch (filters.sortBy) {
          case "price_low": return a.price - b.price;
          case "price_high": return b.price - a.price;
          case "popular": return b.views - a.views;
          default: return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }
      });
  }, [slug, filters]);

  const clearFilters = () => {
    setFilters({
      condition: undefined,
      city: undefined,
      brand: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sortBy: "newest",
    });
  };

  const activeFiltersCount = [
    filters.condition,
    filters.city && filters.city !== "All Cities",
    filters.brand && filters.brand !== "All Brands",
    filters.minPrice,
    filters.maxPrice,
  ].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-text-secondary">
            <li><Link to="/" className="hover:text-orange">Home</Link></li>
            <li>/</li>
            <li className="text-white">{category?.name || "Category"}</li>
          </ol>
        </nav>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-syne font-extrabold mb-2">
            {category?.name}
          </h1>
          <p className="text-text-secondary font-grotesk text-lg">
            {category?.name_ar}
          </p>
        </div>

        {/* Condition Filter - Primary */}
        <div className="bg-dark-card rounded-2xl p-6 border border-dark-border mb-6">
          <h3 className="text-lg font-syne font-bold mb-4">Select Condition</h3>
          <div className="flex flex-wrap gap-3">
            <Button
              variant={filters.condition === "new" ? "default" : "outline"}
              onClick={() => setFilters(f => ({ ...f, condition: f.condition === "new" ? undefined : "new" }))}
              className={`rounded-xl font-grotesk ${
                filters.condition === "new" 
                  ? "bg-success hover:bg-success/90 text-white border-0" 
                  : "border-dark-border hover:bg-dark-secondary"
              }`}
            >
              New
            </Button>
            <Button
              variant={filters.condition === "used" ? "default" : "outline"}
              onClick={() => setFilters(f => ({ ...f, condition: f.condition === "used" ? undefined : "used" }))}
              className={`rounded-xl font-grotesk ${
                filters.condition === "used" 
                  ? "bg-orange hover:bg-orange/90 text-white border-0" 
                  : "border-dark-border hover:bg-dark-secondary"
              }`}
            >
              Used
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-dark-border hover:bg-dark-secondary rounded-xl"
            >
              <SlidersHorizontal className="w-5 h-5 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 bg-orange text-white border-0">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-text-secondary hover:text-white"
              >
                <X className="w-4 h-4 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-text-secondary text-sm">Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(f => ({ ...f, sortBy: e.target.value as FilterOptions['sortBy'] }))}
              className="bg-dark-secondary rounded-xl border border-dark-border px-4 py-2 font-grotesk text-sm focus:border-orange focus:outline-none"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price_low">Price: Low to High</option>
              <option value="price_high">Price: High to Low</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Expanded Filters */}
        {showFilters && (
          <div className="bg-dark-card rounded-2xl p-6 border border-dark-border mb-6 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* City */}
              <div>
                <label className="block text-sm text-text-secondary mb-2">City</label>
                <select
                  value={filters.city || "All Cities"}
                  onChange={(e) => setFilters(f => ({ ...f, city: e.target.value }))}
                  className="w-full bg-dark-secondary rounded-xl border border-dark-border px-4 py-3 font-grotesk focus:border-orange focus:outline-none"
                >
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              {/* Brand */}
              <div>
                <label className="block text-sm text-text-secondary mb-2">Brand</label>
                <select
                  value={filters.brand || "All Brands"}
                  onChange={(e) => setFilters(f => ({ ...f, brand: e.target.value }))}
                  className="w-full bg-dark-secondary rounded-xl border border-dark-border px-4 py-3 font-grotesk focus:border-orange focus:outline-none"
                >
                  {brands.map(brand => (
                    <option key={brand} value={brand}>{brand}</option>
                  ))}
                </select>
              </div>

              {/* Min Price */}
              <div>
                <label className="block text-sm text-text-secondary mb-2">Min Price (MAD)</label>
                <input
                  type="number"
                  value={filters.minPrice || ""}
                  onChange={(e) => setFilters(f => ({ ...f, minPrice: e.target.value ? Number(e.target.value) : undefined }))}
                  placeholder="0"
                  className="w-full bg-dark-secondary rounded-xl border border-dark-border px-4 py-3 font-grotesk focus:border-orange focus:outline-none"
                />
              </div>

              {/* Max Price */}
              <div>
                <label className="block text-sm text-text-secondary mb-2">Max Price (MAD)</label>
                <input
                  type="number"
                  value={filters.maxPrice || ""}
                  onChange={(e) => setFilters(f => ({ ...f, maxPrice: e.target.value ? Number(e.target.value) : undefined }))}
                  placeholder="50000"
                  className="w-full bg-dark-secondary rounded-xl border border-dark-border px-4 py-3 font-grotesk focus:border-orange focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <p className="text-text-secondary font-grotesk mb-6">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
        </p>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard 
              key={product.id} 
              id={Number(product.id)}
              title={product.title}
              price={product.price.toLocaleString()}
              image={product.images[0]}
              location={`${product.city?.name}${product.neighborhood ? `, ${product.neighborhood.name}` : ''}`}
              condition={product.condition === "new" ? "New" : product.condition === "like_new" ? "Like New" : product.condition === "good" ? "Good" : "Fair"}
            />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-text-secondary font-grotesk text-lg mb-4">
              No products found matching your criteria.
            </p>
            <Button onClick={clearFilters} className="bg-orange hover:bg-orange/90">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
