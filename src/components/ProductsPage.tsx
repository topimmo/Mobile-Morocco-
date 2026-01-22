import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navigation from './Navigation';
import ProductGrid from './ProductGrid';
import FilterSidebar from './FilterSidebar';
import AdvancedSearch from './AdvancedSearch';
import { Button } from './ui/button';
import { Grid, List, Filter } from 'lucide-react';
import { mockProducts, getProductsByCategory } from '../data/mockProducts';
import { useSearchParams } from 'react-router-dom';
import type { Product as DataProduct } from '../data/mockProducts';

export default function ProductsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [products] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<DataProduct[]>(mockProducts);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [premiumOnly, setPremiumOnly] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('');

  // Map data products to ProductGrid shape
  const toGridProducts = (list: DataProduct[]) =>
    list.map((p) => ({
      id: p.id,
      title: p.title,
      price: p.price,
      condition: p.condition,
      image: p.image,
      images: p.images,
      seller: {
        name: p.sellerName,
        rating: p.sellerRating,
        location: p.location,
        phoneNumber: p.phoneNumber,
        showPhoneNumber: p.showPhoneNumber,
        enableWhatsApp: p.enableWhatsApp,
      },
    }));

  const applyFilters = () => {
    let filtered: DataProduct[] = products;

    // Category filter
    if (selectedCategory && selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Subcategory filter
    if (selectedSubcategory && selectedSubcategory !== 'all') {
      filtered = filtered.filter(product => product.subcategory === selectedSubcategory);
    }

    // Featured / Premium filters from URL
    if (featuredOnly) {
      filtered = filtered.filter(product => product.isFeatured);
    }
    if (premiumOnly) {
      filtered = filtered.filter(product => product.isPremium);
    }

    // Condition filter
    if (conditionFilter && conditionFilter !== 'all') {
      filtered = filtered.filter(product => product.condition === conditionFilter);
    }

    // Location filter
    if (locationFilter && locationFilter !== 'all') {
      filtered = filtered.filter(product => 
        product.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    // Price range filter
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.specs.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.specs.model?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.sellerRating - a.sellerRating);
        break;
      case 'newest':
        // For demo purposes, sort by featured/premium status
        filtered.sort((a, b) => {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          if (a.isPremium && !b.isPremium) return -1;
          if (!a.isPremium && b.isPremium) return 1;
          return 0;
        });
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  };

  // Sync state from URL search params
  useEffect(() => {
    const category = searchParams.get('category') || '';
    const subcategory = searchParams.get('subcategory') || '';
    const featured = searchParams.get('featured') === 'true';
    const premium = searchParams.get('premium') === 'true';
    setSelectedCategory(category);
    setSelectedSubcategory(subcategory);
    setFeaturedOnly(featured);
    setPremiumOnly(premium);
  }, [searchParams]);

  // Apply filters whenever dependencies change
  useEffect(() => {
    applyFilters();
  }, [selectedCategory, selectedSubcategory, conditionFilter, locationFilter, priceRange, searchQuery, sortBy, featuredOnly, premiumOnly]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Tous les Produits</h1>
          <p className="text-gray-600">Découvrez notre large gamme de téléphones, accessoires et équipements</p>
        </div>

        {/* Advanced Search */}
        <div className="mb-6">
          <AdvancedSearch />
        </div>

        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant={showFilters ? "default" : "outline"}
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex gap-6">
          {/* Sidebar */}
          {showFilters && (
            <div className="w-64 flex-shrink-0">
              <FilterSidebar />
            </div>
          )}

          {/* Products */}
          <div className="flex-1">
            <ProductGrid products={toGridProducts(filteredProducts)} title="Tous les Produits" />
          </div>
        </div>
      </div>
    </div>
  );
}