import React, { useState } from "react";
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
  isFavorite?: boolean;
  phoneNumber?: string;
  showPhoneNumber?: boolean;
  enableWhatsApp?: boolean;
  isPremium?: boolean;
  isFeatured?: boolean;
  onFavoriteToggle?: (id: string) => void;
  onCompare?: (id: string) => void;
  onContactSeller?: (id: string) => void;
  onReport?: (id: string) => void;
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
  isFavorite = false,
  phoneNumber = "0612345678",
  showPhoneNumber = false,
  enableWhatsApp = false,
  isPremium = false,
  isFeatured = false,
  onFavoriteToggle = () => {},
  onCompare = () => {},
  onContactSeller = () => {},
  onReport = () => {},
}: ProductCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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
    onFavoriteToggle(id);
  };

  const handleCompareClick = () => {
    onCompare(id);
  };

  const handleContactSellerClick = () => {
    onContactSeller(id);
  };

  const handleReportClick = () => {
    onReport(id);
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

  return (
    <Card
      className={`w-full max-w-[320px] sm:max-w-full md:max-w-[320px] overflow-hidden transition-all duration-200 hover:shadow-md bg-white ${isPremium ? "ring-2 ring-sky-600 ring-offset-2" : ""} ${isFeatured ? "shadow-lg" : ""}`}
    >
      <div className="relative h-40 sm:h-48 overflow-hidden bg-gray-100">
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
                className={`h-1.5 w-1.5 rounded-full ${index === currentImageIndex ? "bg-primary" : "bg-white/70"}`}
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
                    className={`h-3 w-3 sm:h-4 sm:w-4 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {isFavorite ? "Remove from favorites" : "Add to favorites"}
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
                  className="rounded-full bg-white/90 backdrop-blur-sm h-7 w-7 sm:h-8 sm:w-8"
                  onClick={handleCompareClick}
                >
                  <BarChart2 className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add to comparison</p>
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

      <CardContent className="p-3 sm:p-4">
        <h3 className="font-medium text-base sm:text-lg line-clamp-2 mb-1 sm:mb-2 h-12 sm:h-14">
          {title}
        </h3>
        <p className="text-lg sm:text-xl font-bold text-sky-600 mb-1 sm:mb-2">
          {price.toLocaleString()} {currency}
        </p>
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

      <CardFooter className="p-3 sm:p-4 pt-0 flex flex-col gap-2">
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

export default ProductCard;
