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
import { cn } from "@/lib/utils";

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

  const isProductFavorite = isFavorite(id);
  const isProductInComparison = isInComparison(id);

  return (
    <Card
      className={cn(
        "w-full overflow-hidden transition-all duration-200 hover:border-primary/50 bg-card cursor-pointer flex flex-col",
        // Fixed height to prevent CLS
        "h-[440px] sm:h-[460px]",
        isPremium && "border-primary border-2",
        isFeatured && "border-accent"
      )}
      onClick={handleCardClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted flex-shrink-0">
        {isPremium && (
          <div className="absolute top-0 left-0 z-20 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold uppercase">
            Premium
          </div>
        )}
        {isFeatured && (
          <div className="absolute top-0 right-0 z-20 bg-accent text-accent-foreground px-3 py-1 text-xs font-bold uppercase">
            Featured
          </div>
        )}
        {condition === "new" && (
          <div className="absolute top-0 right-0 z-20 bg-primary text-primary-foreground px-3 py-1 text-xs font-bold uppercase">
            New
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
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-sm bg-background/80 backdrop-blur-sm hover:bg-background/90 z-10"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 rounded-sm bg-background/80 backdrop-blur-sm hover:bg-background/90 z-10"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {/* Image indicators */}
        {allImages.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 z-10">
            {allImages.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "h-1.5 w-1.5 rounded-full cursor-pointer transition-all",
                  index === currentImageIndex ? "bg-primary w-3" : "bg-muted-foreground/50"
                )}
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
                  variant="ghost"
                  size="icon"
                  className="rounded-sm bg-background/80 backdrop-blur-sm hover:bg-background/90 h-8 w-8"
                  onClick={handleFavoriteClick}
                >
                  <Heart
                    className={cn(
                      "h-4 w-4",
                      isProductFavorite ? "fill-primary text-primary" : "text-foreground"
                    )}
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
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "rounded-sm bg-background/80 backdrop-blur-sm hover:bg-background/90 h-8 w-8",
                    isProductInComparison && "border border-primary"
                  )}
                  onClick={handleCompareClick}
                >
                  <BarChart2 className={cn(
                    "h-4 w-4",
                    isProductInComparison ? "text-primary" : "text-foreground"
                  )} />
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
                  variant="ghost"
                  size="icon"
                  className="rounded-sm bg-background/80 backdrop-blur-sm hover:bg-background/90 h-8 w-8"
                  onClick={handleShareProduct}
                >
                  <Share2 className="h-4 w-4 text-foreground" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Share product</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Badge
          className={cn(
            "absolute bottom-2 left-2 text-xs font-medium border-0",
            condition === "new" && "bg-primary text-primary-foreground",
            condition === "used" && "bg-muted text-muted-foreground",
            condition === "refurbished" && "bg-secondary text-secondary-foreground"
          )}
        >
          {condition === "new"
            ? "New"
            : condition === "used"
              ? "Used"
              : "Refurbished"}
        </Badge>
      </div>

      <CardContent className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold text-base sm:text-lg line-clamp-2 mb-2 text-foreground h-14">
          {title}
        </h3>
        <p className="text-xl sm:text-2xl font-bold text-primary mb-2">
          {price.toLocaleString()} {currency}
        </p>
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-1">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span>{sellerRating}</span>
            <span className="mx-1">•</span>
            <span className="truncate">{sellerName}</span>
          </div>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="h-3 w-3 mr-1" />
          <span>{location}</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex flex-col gap-2 mt-auto border-t border-border">
        <div className="flex gap-2 w-full">
          <Button
            className="flex-1 text-sm"
            size="sm"
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
                  className="h-9 w-9"
                  onClick={handleReportClick}
                >
                  <Flag className="h-4 w-4" />
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
                className="flex-1 text-sm flex items-center gap-2"
                variant="secondary"
                size="sm"
              >
                <Phone className="h-4 w-4" />
                {phoneNumber}
              </Button>
            )}

            {enableWhatsApp && (
              <Button
                className="flex-1 text-sm flex items-center gap-2"
                variant="secondary"
                size="sm"
                asChild
              >
                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default memo(ProductCard);