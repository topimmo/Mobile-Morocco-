import React, { useState } from "react";
import { useFavorites } from "@/contexts/FavoritesContext";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  ArrowLeft,
  Heart,
  Trash2,
  Star,
  MapPin,
  Phone,
  MessageCircle,
  Calendar,
  Filter,
  Share2,
} from "lucide-react";
import ShareProduct from "./ShareProduct";
import { useNavigate } from "react-router-dom";

const FavoritesPage = () => {
  const { favorites, removeFromFavorites, clearFavorites } =
    useFavorites();
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("newest");
  const [filterBy, setFilterBy] = useState("all");

  if (favorites.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate("/")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
              <h1 className="text-3xl font-bold">My Favorites</h1>
            </div>
          </div>

          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
            <p className="text-gray-500 mb-6">
              Start adding products to your favorites by clicking the heart icon
              on product cards.
            </p>
            <Button onClick={() => navigate("/")}>Browse Products</Button>
          </div>
        </div>
      </div>
    );
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "new":
        return "bg-green-100 text-green-800";
      case "used":
        return "bg-amber-100 text-amber-800";
      case "refurbished":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatWhatsAppNumber = (number: string) => {
    return number.startsWith("0") ? `212${number.substring(1)}` : number;
  };

  const getWhatsAppLink = (phoneNumber: string) => {
    const formattedNumber = formatWhatsAppNumber(phoneNumber);
    return `https://wa.me/${formattedNumber}?text=Hello, I saw your listing and would like more details`;
  };

  // Sort and filter favorites
  let sortedAndFilteredProducts = [...favorites];

  // Apply filters
  if (filterBy !== "all") {
    sortedAndFilteredProducts = sortedAndFilteredProducts.filter(
      (product) => product.condition === filterBy,
    );
  }

  // Apply sorting
  sortedAndFilteredProducts.sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.dateAdded || 0).getTime() -
          new Date(a.dateAdded || 0).getTime()
        );
      case "oldest":
        return (
          new Date(a.dateAdded || 0).getTime() -
          new Date(b.dateAdded || 0).getTime()
        );
      case "price-low":
        return a.price - b.price;
      case "price-high":
        return b.price - a.price;
      case "rating":
        return b.sellerRating - a.sellerRating;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
            <h1 className="text-3xl font-bold">My Favorites</h1>
            <Badge variant="secondary">
              {favorites.length} product
              {favorites.length !== 1 ? "s" : ""}
            </Badge>
          </div>
          <Button
            variant="destructive"
            onClick={clearFavorites}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </Button>
        </div>

        {/* Filters and Sorting */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">Filter:</span>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-full sm:w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="used">Used</SelectItem>
                <SelectItem value="refurbished">Refurbished</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Recently Added</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedAndFilteredProducts.map((product) => (
            <Card key={product.id} className="relative overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-white/90 hover:bg-white"
                onClick={() => removeFromFavorites(product.id)}
              >
                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              </Button>

              <div className="aspect-square relative overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                {product.isPremium && (
                  <div className="absolute top-2 left-2 bg-sky-600 text-white px-2 py-1 text-xs font-bold rounded">
                    PREMIUM
                  </div>
                )}
                {product.isFeatured && (
                  <div className="absolute top-2 right-12 bg-amber-500 text-white px-2 py-1 text-xs font-bold rounded">
                    FEATURED
                  </div>
                )}
              </div>

              <CardHeader className="pb-2">
                <CardTitle className="text-lg line-clamp-2 mb-2">
                  {product.title}
                </CardTitle>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-sky-600">
                    {product.price.toLocaleString()} {product.currency || "MAD"}
                  </span>
                  <Badge className={getConditionColor(product.condition)}>
                    {product.condition === "new"
                      ? "New"
                      : product.condition === "used"
                        ? "Used"
                        : "Refurbished"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Seller Information */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm">{product.sellerRating}</span>
                    <span className="text-sm text-gray-500">•</span>
                    <span className="text-sm truncate">
                      {product.sellerName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-gray-500" />
                    <span className="text-sm text-gray-500">
                      {product.location}
                    </span>
                  </div>
                </div>

                {/* Date Added */}
                {product.dateAdded && (
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="h-3 w-3" />
                    <span>
                      Added {new Date(product.dateAdded).toLocaleDateString()}
                    </span>
                  </div>
                )}

                <Separator />

                {/* Contact Options */}
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Button className="flex-1" size="sm">
                      Contact Seller
                    </Button>
                    <ShareProduct
                      productId={product.id}
                      productTitle={product.title}
                      productPrice={product.price}
                      productCurrency={product.currency}
                      productCondition={product.condition}
                      productImage={product.image}
                      sellerName={product.sellerName}
                    >
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </ShareProduct>
                  </div>

                  {(product.showPhoneNumber || product.enableWhatsApp) && (
                    <div className="flex gap-2">
                      {product.showPhoneNumber && product.phoneNumber && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 flex items-center gap-1"
                        >
                          <Phone className="h-3 w-3" />
                          {product.phoneNumber}
                        </Button>
                      )}

                      {product.enableWhatsApp && product.phoneNumber && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 flex items-center gap-1"
                          asChild
                        >
                          <a
                            href={getWhatsAppLink(product.phoneNumber)}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <MessageCircle className="h-3 w-3" />
                            WhatsApp
                          </a>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty state for filtered results */}
        {sortedAndFilteredProducts.length === 0 &&
          favorites.length > 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <Filter className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">
                No products match your filters
              </h3>
              <p className="text-gray-500 mb-6">
                Try adjusting your filter settings to see more results.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setFilterBy("all");
                  setSortBy("newest");
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
      </div>
    </div>
  );
};

export default FavoritesPage;
