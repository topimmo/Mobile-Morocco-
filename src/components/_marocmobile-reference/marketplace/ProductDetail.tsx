import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Eye, 
  Phone, 
  MessageCircle, 
  ChevronLeft, 
  ChevronRight,
  Shield,
  Heart,
  Share2,
  Scale
} from "lucide-react";
import { Product } from "@/types/marketplace";
import { Link } from "react-router-dom";

interface ProductDetailProps {
  product: Product;
  onAddToCompare?: (product: Product) => void;
  onToggleFavorite?: (productId: string) => void;
  isFavorite?: boolean;
}

export default function ProductDetail({ 
  product, 
  onAddToCompare, 
  onToggleFavorite,
  isFavorite = false 
}: ProductDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showContactInfo, setShowContactInfo] = useState(false);

  const conditionLabels: Record<string, { label: string; color: string }> = {
    new: { label: "New", color: "bg-success text-white" },
    like_new: { label: "Like New", color: "bg-orange text-white" },
    good: { label: "Good", color: "bg-yellow text-dark-bg" },
    fair: { label: "Fair", color: "bg-text-secondary text-dark-bg" },
    used: { label: "Used", color: "bg-dark-secondary text-white" },
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center gap-2 text-text-secondary">
            <li><Link to="/" className="hover:text-orange">Home</Link></li>
            <li>/</li>
            <li><Link to={`/category/${product.category?.slug}`} className="hover:text-orange">{product.category?.name}</Link></li>
            <li>/</li>
            <li className="text-white truncate max-w-[200px]">{product.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-dark-card rounded-2xl overflow-hidden border border-dark-border">
              <img
                src={product.images[currentImageIndex]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation Arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-dark-bg/80 rounded-full flex items-center justify-center hover:bg-orange transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-dark-bg/80 rounded-full flex items-center justify-center hover:bg-orange transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Condition Badge */}
              <Badge className={`absolute top-4 left-4 ${conditionLabels[product.condition]?.color} border-0 font-grotesk font-medium`}>
                {conditionLabels[product.condition]?.label}
              </Badge>

              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-dark-bg/80 px-3 py-1 rounded-full text-sm font-mono">
                {currentImageIndex + 1} / {product.images.length}
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    index === currentImageIndex 
                      ? "border-orange" 
                      : "border-dark-border hover:border-text-secondary"
                  }`}
                >
                  <img src={image} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Title & Price */}
            <div>
              <h1 className="text-2xl md:text-3xl font-syne font-bold mb-4">
                {product.title}
              </h1>
              <p className="text-4xl font-mono font-bold text-orange">
                {product.price.toLocaleString()} <span className="text-xl">MAD</span>
              </p>
            </div>

            {/* Quick Info */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 text-text-secondary">
                <MapPin className="w-4 h-4" />
                <span className="font-grotesk">
                  {product.city?.name}{product.neighborhood && `, ${product.neighborhood.name}`}
                </span>
              </div>
              <div className="flex items-center gap-2 text-text-secondary">
                <Eye className="w-4 h-4" />
                <span className="font-grotesk">{product.views} views</span>
              </div>
            </div>

            {/* Specifications */}
            {(product.brand || product.model || product.storage || product.ram) && (
              <div className="bg-dark-card rounded-2xl p-6 border border-dark-border">
                <h3 className="text-lg font-syne font-bold mb-4">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  {product.brand && (
                    <div>
                      <p className="text-text-secondary text-sm">Brand</p>
                      <p className="font-grotesk font-medium">{product.brand}</p>
                    </div>
                  )}
                  {product.model && (
                    <div>
                      <p className="text-text-secondary text-sm">Model</p>
                      <p className="font-grotesk font-medium">{product.model}</p>
                    </div>
                  )}
                  {product.storage && (
                    <div>
                      <p className="text-text-secondary text-sm">Storage</p>
                      <p className="font-grotesk font-medium">{product.storage}</p>
                    </div>
                  )}
                  {product.ram && (
                    <div>
                      <p className="text-text-secondary text-sm">RAM</p>
                      <p className="font-grotesk font-medium">{product.ram}</p>
                    </div>
                  )}
                  {product.specifications && Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-text-secondary text-sm capitalize">{key.replace(/_/g, ' ')}</p>
                      <p className="font-grotesk font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Compatible Models (for spare parts) */}
            {product.compatible_models && product.compatible_models.length > 0 && (
              <div className="bg-dark-card rounded-2xl p-6 border border-dark-border">
                <h3 className="text-lg font-syne font-bold mb-4">Compatible Models</h3>
                <div className="flex flex-wrap gap-2">
                  {product.compatible_models.map((model, index) => (
                    <Badge key={index} variant="outline" className="border-dark-border text-text-secondary">
                      {model}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="bg-dark-card rounded-2xl p-6 border border-dark-border">
                <h3 className="text-lg font-syne font-bold mb-4">Description</h3>
                <p className="font-grotesk text-text-secondary whitespace-pre-wrap">
                  {product.description}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-4">
              <Button
                onClick={() => setShowContactInfo(!showContactInfo)}
                className="w-full h-14 bg-orange hover:bg-orange/90 text-white font-syne font-bold text-lg rounded-xl"
              >
                <Phone className="w-5 h-5 mr-2" />
                Contact Seller
              </Button>

              {showContactInfo && (
                <div className="bg-dark-card rounded-2xl p-6 border border-dark-border space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-dark-secondary flex items-center justify-center">
                      <span className="text-xl font-bold">
                        {product.seller?.name?.[0] || product.seller?.email?.[0] || "S"}
                      </span>
                    </div>
                    <div>
                      <p className="font-grotesk font-medium">{product.seller?.name || "Seller"}</p>
                      <p className="text-sm text-text-secondary">{product.seller?.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 border-dark-border hover:bg-dark-secondary">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                    <Button variant="outline" className="flex-1 border-dark-border hover:bg-success hover:border-success">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      WhatsApp
                    </Button>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => onToggleFavorite?.(product.id)}
                  className={`flex-1 border-dark-border ${isFavorite ? "bg-orange/20 border-orange text-orange" : "hover:bg-dark-secondary"}`}
                >
                  <Heart className={`w-5 h-5 mr-2 ${isFavorite ? "fill-current" : ""}`} />
                  {isFavorite ? "Saved" : "Save"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => onAddToCompare?.(product)}
                  className="flex-1 border-dark-border hover:bg-dark-secondary"
                >
                  <Scale className="w-5 h-5 mr-2" />
                  Compare
                </Button>
                <Button
                  variant="outline"
                  className="border-dark-border hover:bg-dark-secondary"
                >
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Safety Disclaimer */}
            <div className="bg-yellow/10 border border-yellow/30 rounded-2xl p-4 flex gap-3">
              <Shield className="w-6 h-6 text-yellow flex-shrink-0" />
              <div>
                <p className="font-grotesk font-medium text-yellow mb-1">Safety Notice</p>
                <p className="text-sm text-text-secondary">
                  MobileMorocco is a marketplace platform only. We do not process payments or guarantee transactions. 
                  Always meet in safe public places and verify products before purchase.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
