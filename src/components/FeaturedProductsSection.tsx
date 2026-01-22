import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import { Button } from './ui/button';
import { getFeaturedProducts, getPremiumProducts } from '@/data/mockProducts';
import { ArrowRight } from 'lucide-react';

const FeaturedProductsSection = () => {
  const featuredProducts = getFeaturedProducts().slice(0, 4);
  const premiumProducts = getPremiumProducts().slice(0, 4);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Produits en vedette */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Produits en Vedette
              </h2>
              <p className="text-gray-600">
                Découvrez notre sélection de produits populaires
              </p>
            </div>
            <Link to="/products?featured=true">
              <Button variant="outline" className="flex items-center gap-2">
                Voir tout
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                currency={product.currency}
                condition={product.condition}
                image={product.image}
                images={product.images}
                sellerName={product.sellerName}
                sellerRating={product.sellerRating}
                location={product.location}
                phoneNumber={product.phoneNumber}
                showPhoneNumber={product.showPhoneNumber}
                enableWhatsApp={product.enableWhatsApp}
                isPremium={product.isPremium}
                isFeatured={product.isFeatured}
                specs={product.specs}
              />
            ))}
          </div>
        </div>

        {/* Produits Premium */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Produits Premium
              </h2>
              <p className="text-gray-600">
                Les meilleures offres de nos vendeurs certifiés
              </p>
            </div>
            <Link to="/products?premium=true">
              <Button variant="outline" className="flex items-center gap-2">
                Voir tout
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {premiumProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                currency={product.currency}
                condition={product.condition}
                image={product.image}
                images={product.images}
                sellerName={product.sellerName}
                sellerRating={product.sellerRating}
                location={product.location}
                phoneNumber={product.phoneNumber}
                showPhoneNumber={product.showPhoneNumber}
                enableWhatsApp={product.enableWhatsApp}
                isPremium={product.isPremium}
                isFeatured={product.isFeatured}
                specs={product.specs}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProductsSection;