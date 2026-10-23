import React, { useState, memo } from "react";
import {
  Heart,
  Star,
  MapPin,
  Share2,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  Phone,
  MessageCircle,
  Flag,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useComparison } from "@/contexts/ComparisonContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface ProductCardProps {
  id?: string;
  title?: string;
  price?: number;
  currency?: string;
  condition?: "new" | "used" | "refurbished";
  image?: string;
  images?: string[];
  sellerName?: string;
  sellerRating?: number;
  location?: string;
  initialFavorite?: boolean;
  phoneNumber?: string;
  showPhoneNumber?: boolean;
  enableWhatsApp?: boolean;
  isPremium?: boolean;
  isFeatured?: boolean;
  onFavoriteToggle?: (id: string) => void;
  onCompare?: (id: string) => void;
  onContactSeller?: (id: string) => void;
  onReport?: (id: string) => void;
  specs?: {
    brand?: string;
    model?: string;
    storage?: string;
    ram?: string;
    display?: string;
    camera?: string;
    battery?: string;
    os?: string;
    color?: string;
    warranty?: string;
  };
}

const ProductCard = ({
  id = "1",
  title = "iPhone 13 Pro Max - 256GB",
  price = 5999,
  currency = "MAD",
  condition = "used",
  image = "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&q=80",
  images = [],
  sellerName = "Tech Marketplace",
  sellerRating = 4.5,
  location = "Casablanca",
  initialFavorite = false,
  phoneNumber = "0612345678",
  showPhoneNumber = false,
  enableWhatsApp = false,
  isPremium = false,
  isFeatured = false,
  onFavoriteToggle = () => {},
  onCompare = () => {},
  onContactSeller = () => {},
  onReport = () => {},
  specs,
}: ProductCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { addToComparison, isInComparison } = useComparison();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Create product object for context operations
  const productData = {
    id,
    title,
    price,
    currency,
    condition,
    image: image || "",
    images,
    sellerName,
    sellerRating,
    location,
    phoneNumber,
    showPhoneNumber,
    enableWhatsApp,
    isPremium,
    isFeatured,
    specs,
  };

  // If images array is empty but we have a single image, use that
  const allImages =
    images.length > 0
      ? images
      : image
        ? [image]
        : [
            "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=800&q=80",
          ];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === allImages.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? allImages.length - 1 : prevIndex - 1,
    );
  };

  const handleFavoriteClick = () => {
    if (isFavorite(id)) {
      removeFromFavorites(id);
    } else {
      addToFavorites(productData);
    }
    onFavoriteToggle(id);
  };

  const handleCompareClick = () => {
    addToComparison(productData);
    onCompare(id);
  };

  const handleContactSellerClick = () => {
    onContactSeller(id);
  };

  const handleReportClick = () => {
    onReport(id);
  };

  const handleCardClick = () => {
    navigate(`/product/${id}`);
  };

  const handleShareProduct = () => {
    // Create share data
    const shareData = {
      title: title,
      text: `Check out this ${condition} ${title} for ${price} ${currency}`,
      url: window.location.href.split("?")[0] + `?product=${id}`,
    };

    // Use Web Share API if available
    if (
      navigator.share &&
      navigator.canShare &&
      navigator.canShare(shareData)
    ) {
      navigator
        .share(shareData)
        .then(() => {
          toast({
            title: "Partagé avec succès",
            description: "Le produit a été partagé.",
          });
        })
        .catch((error) => {
          // Fallback to copy link if sharing fails
          copyToClipboard();
        });
    } else {
      // Fallback for browsers that don't support Web Share API
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    const productUrl = window.location.href.split("?")[0] + `?product=${id}`;
    navigator.clipboard
      .writeText(productUrl)
      .then(() => {
        toast({
          title: "Lien copié",
          description: "Le lien a été copié dans le presse-papiers.",
        });
      })
      .catch(() => {
        toast({
          title: "Erreur",
          description: "Impossible de copier le lien.",
          variant: "destructive",
        });
      });
  };

  const formatWhatsAppNumber = (number: string) => {
    // Remove leading zero and add Moroccan country code (212)
    return number.startsWith("0") ? `212${number.substring(1)}` : number;
  };

  const getWhatsAppLink = () => {
    const formattedNumber = formatWhatsAppNumber(phoneNumber);
    return `https://wa.me/${formattedNumber}?text=Hello, I saw your listing and would like more details`;
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "new":
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case "used":
        return "bg-amber-100 text-amber-800 hover:bg-amber-200";
      case "refurbished":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const isProductFavorite = isFavorite(id);
  const isProductInComparison = isInComparison(id);

  return (
    <Card
      className={`w-full overflow-hidden transition-all duration-200 hover:shadow-md bg-white cursor-pointer flex flex-col ${isPremium ? "ring-2 ring-sky-600 ring-offset-2" : ""} ${isFeatured ? "shadow-lg" : ""}`}
      onClick={handleCardClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
        {isPremium && (
          <div className="absolute top-0 left-0 z-20 bg-sky-600 text-white px-2 py-1 text-xs font-bold">
            PREMIUM
          </div>
        )}
        {isFeatured && (
          <div className="absolute top-0 right-0 z-20 bg-amber-500 text-white px-2 py-1 text-xs font-bold">
            FEATURED
          </div>
        )}
        {condition === "new" && (
          <div className="absolute top-0 right-0 z-20 bg-green-500 text-white px-2 py-1 text-xs font-bold">
            NEW
          </div>
        )}
        {/* Image carousel */}
        <img
          src={allImages[currentImageIndex]}
          alt={`${title} - image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />

        {/* Navigation arrows - only show if there are multiple images */}
        {allImages.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-1 top-1/2 transform -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white/80 backdrop-blur-sm z-10"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-white/80 backdrop-blur-sm z-10"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </>
        )}

        {/* Image indicators */}
        {allImages.length > 1 && (
          <div className="absolute bottom-1 left-0 right-0 flex justify-center gap-1 z-10">
            {allImages.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 w-1.5 rounded-full cursor-pointer ${index === currentImageIndex ? "bg-primary" : "bg-white/70"}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex(index);
                }}
              />
            ))}
          </div>
        )}

        <div className="absolute top-2 right-2 flex flex-col gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/90 backdrop-blur-sm h-7 w-7 sm:h-8 sm:w-8"
                  onClick={handleFavoriteClick}
                >
                  <Heart
                    className={`h-3 w-3 sm:h-4 sm:w-4 ${isProductFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isProductFavorite ? "Remove from favorites" : "Add to favorites"}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className={`rounded-full bg-white/90 backdrop-blur-sm h-7 w-7 sm:h-8 sm:w-8 ${isProductInComparison ? "ring-2 ring-blue-500" : ""}`}
                  onClick={handleCompareClick}
                >
                  <BarChart2 className={`h-3 w-3 sm:h-4 sm:w-4 ${isProductInComparison ? "text-blue-600" : "text-gray-600"}`} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isProductInComparison ? "In comparison" : "Add to comparison"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white/90 backdrop-blur-sm h-7 w-7 sm:h-8 sm:w-8"
                  onClick={handleShareProduct}
                >
                  <Share2 className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share product</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Badge
          className={`absolute bottom-2 left-2 text-xs sm:text-sm ${getConditionColor(condition)}`}
          variant="outline"
        >
          {condition === "new"
            ? "New"
            : condition === "used"
              ? "Used"
              : "Refurbished"}
        </Badge>
      </div>

      <CardContent className="p-3 sm:p-4 flex-1">
        <h3 className="font-medium text-base sm:text-lg line-clamp-2 mb-1 sm:mb-2 min-h-[3rem]">
          {title}
        </h3>
        <p className="text-lg sm:text-xl font-bold text-sky-600 mb-1 sm:mb-2">
          {price.toLocaleString()} {currency}
        </p>
        
        {/* Phone specs - show key details if available */}
        {specs && (specs.storage || specs.color || specs.battery) && (
          <div className="flex flex-wrap gap-1 mb-2 text-xs text-gray-600">
            {specs.storage && <span className="bg-muted px-2 py-0.5 rounded">{specs.storage}</span>}
            {specs.color && <span className="bg-muted px-2 py-0.5 rounded">{specs.color}</span>}
            {specs.battery && <span className="bg-muted px-2 py-0.5 rounded">{specs.battery}</span>}
          </div>
        )}
        
        <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-amber-400 text-amber-400" />
            <span>{sellerRating}</span>
            <span className="mx-1">•</span>
            <span className="truncate">{sellerName}</span>
          </div>
        </div>
        <div className="flex items-center mt-1 text-xs sm:text-sm text-gray-500">
          <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
          <span>{location}</span>
        </div>
      </CardContent>

      <CardFooter className="p-3 sm:p-4 pt-0 flex flex-col gap-2 mt-auto">
        <div className="flex gap-2 w-full">
          <Button
            className="flex-1 text-xs sm:text-sm"
            variant="outline"
            onClick={handleContactSellerClick}
          >
            Contact Seller
          </Button>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full h-8 w-8"
                  onClick={handleReportClick}
                >
                  <Flag className="h-4 w-4 text-gray-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Report this listing</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        {(showPhoneNumber || enableWhatsApp) && (
          <div className="flex gap-2 w-full">
            {showPhoneNumber && (
              <Button
                className="flex-1 text-xs sm:text-sm flex items-center gap-1"
                variant="secondary"
                size="sm"
              >
                <Phone className="h-3 w-3" />
                {phoneNumber}
              </Button>
            )}

            {enableWhatsApp && (
              <Button
                className="flex-1 text-xs sm:text-sm flex items-center gap-1"
                variant="secondary"
                size="sm"
                asChild
              >
                <a
                  href={getWhatsAppLink()}
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

        <div className="flex items-center justify-center w-full mt-1">
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-3 w-3 ${star <= Math.round(sellerRating) ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
              />
            ))}
            <span className="text-xs text-gray-500 ml-1">
              ({sellerRating.toFixed(1)})
            </span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default memo(ProductCard);