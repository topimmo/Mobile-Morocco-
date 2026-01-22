import React from "react";
import { useComparison } from "../contexts/ComparisonContext";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  X,
  Star,
  MapPin,
  Phone,
  MessageCircle,
  ArrowLeft,
  Trash2,
  Share2,
} from "lucide-react";
import ShareProduct from "./ShareProduct";
import { useNavigate } from "react-router-dom";

const ProductComparison = () => {
  const { comparisonList, removeFromComparison, clearComparison } =
    useComparison();
  const navigate = useNavigate();

  if (comparisonList.length === 0) {
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
              <h1 className="text-3xl font-bold">Product Comparison</h1>
            </div>
          </div>

          <div className="text-center py-12">
            <div className="bg-gray-100 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <Star className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              No products to compare
            </h3>
            <p className="text-gray-500 mb-6">
              Add products to comparison by clicking the comparison icon on
              product cards.
            </p>
            <Button onClick={() => navigate("/phones")}>Browse Phones</Button>
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
        return "bg-muted text-secondary";
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
            <h1 className="text-3xl font-bold">Product Comparison</h1>
            <Badge variant="secondary">
              {comparisonList.length} of 3 products
            </Badge>
          </div>
          <Button
            variant="destructive"
            onClick={clearComparison}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear All
          </Button>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {comparisonList.map((product) => (
                <Card key={product.id} className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 z-10 h-8 w-8 rounded-full bg-white/90 hover:bg-white"
                    onClick={() => removeFromComparison(product.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>

                  <CardHeader className="pb-4">
                    <div className="aspect-square relative overflow-hidden rounded-lg mb-4">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                      {product.isPremium && (
                        <div className="absolute top-2 left-2 bg-primary text-white px-2 py-1 text-xs font-bold rounded">
                          PREMIUM
                        </div>
                      )}
                      {product.isFeatured && (
                        <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 text-xs font-bold rounded">
                          FEATURED
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-lg line-clamp-2 mb-2">
                      {product.title}
                    </CardTitle>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-2xl font-bold text-primary">
                        {product.price.toLocaleString()}{" "}
                        {product.currency || "MAD"}
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
                      <h4 className="font-semibold text-sm mb-2">Seller</h4>
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

                    <Separator />

                    {/* Specifications */}
                    <div>
                      <h4 className="font-semibold text-sm mb-2">
                        Specifications
                      </h4>
                      <div className="space-y-1 text-sm">
                        {product.specs?.brand && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Brand:</span>
                            <span>{product.specs.brand}</span>
                          </div>
                        )}
                        {product.specs?.model && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Model:</span>
                            <span>{product.specs.model}</span>
                          </div>
                        )}
                        {product.specs?.storage && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Storage:</span>
                            <span>{product.specs.storage}</span>
                          </div>
                        )}
                        {product.specs?.ram && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">RAM:</span>
                            <span>{product.specs.ram}</span>
                          </div>
                        )}
                        {product.specs?.display && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Display:</span>
                            <span>{product.specs.display}</span>
                          </div>
                        )}
                        {product.specs?.camera && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Camera:</span>
                            <span>{product.specs.camera}</span>
                          </div>
                        )}
                        {product.specs?.battery && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Battery:</span>
                            <span>{product.specs.battery}</span>
                          </div>
                        )}
                        {product.specs?.os && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">OS:</span>
                            <span>{product.specs.os}</span>
                          </div>
                        )}
                        {product.specs?.color && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Color:</span>
                            <span>{product.specs.color}</span>
                          </div>
                        )}
                        {product.specs?.warranty && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Warranty:</span>
                            <span>{product.specs.warranty}</span>
                          </div>
                        )}
                      </div>
                    </div>

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
          </div>
        </div>

        {/* Comparison Tips */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Comparison Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
              <div>
                <h4 className="font-semibold mb-1">Price Comparison</h4>
                <p className="text-gray-600">
                  Compare prices across different sellers to find the best deal.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Condition Matters</h4>
                <p className="text-gray-600">
                  Consider the condition of each product when making your
                  decision.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-1">Seller Rating</h4>
                <p className="text-gray-600">
                  Higher-rated sellers typically provide better service and
                  reliability.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProductComparison;
