import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { toast } from "./ui/use-toast";
import {
  Share2,
  Copy,
  MessageCircle,
  Facebook,
  Twitter,
  Mail,
  Link,
  Check,
} from "lucide-react";

interface ShareProductProps {
  productId: string;
  productTitle: string;
  productPrice: number;
  productCurrency?: string;
  productCondition: string;
  productImage?: string;
  sellerName?: string;
  children?: React.ReactNode;
}

const ShareProduct: React.FC<ShareProductProps> = ({
  productId,
  productTitle,
  productPrice,
  productCurrency = "MAD",
  productCondition,
  productImage,
  sellerName,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const productUrl = `${window.location.origin}?product=${productId}`;
  const shareText = `Check out this ${productCondition} ${productTitle} for ${productPrice.toLocaleString()} ${productCurrency}`;
  const shareTextWithSeller = sellerName
    ? `${shareText} by ${sellerName}`
    : shareText;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Product link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
      toast({
        title: "Copy failed",
        description: "Unable to copy link to clipboard.",
        variant: "destructive",
      });
    }
  };

  const shareViaWhatsApp = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      `${shareTextWithSeller}\n\n${productUrl}`,
    )}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  const shareViaFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      productUrl,
    )}&quote=${encodeURIComponent(shareTextWithSeller)}`;
    window.open(facebookUrl, "_blank", "noopener,noreferrer");
  };

  const shareViaTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareTextWithSeller,
    )}&url=${encodeURIComponent(productUrl)}`;
    window.open(twitterUrl, "_blank", "noopener,noreferrer");
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(`Check out this ${productTitle}`);
    const body = encodeURIComponent(
      `Hi,\n\nI found this interesting product and thought you might like it:\n\n${shareTextWithSeller}\n\nView it here: ${productUrl}\n\nBest regards`,
    );
    const emailUrl = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = emailUrl;
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: productTitle,
          text: shareTextWithSeller,
          url: productUrl,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error sharing:", err);
          // Fallback to copy link
          copyToClipboard();
        }
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      copyToClipboard();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Product</DialogTitle>
          <DialogDescription>
            Share this product with your friends and family
          </DialogDescription>
        </DialogHeader>

        {/* Product Preview */}
        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg mb-4">
          {productImage && (
            <img
              src={productImage}
              alt={productTitle}
              className="w-12 h-12 object-cover rounded"
            />
          )}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{productTitle}</p>
            <p className="text-sm text-muted-foreground">
              {productPrice.toLocaleString()} {productCurrency} •{" "}
              {productCondition}
            </p>
          </div>
        </div>

        {/* Share Options */}
        <div className="space-y-4">
          {/* Native Share (if supported) */}
          {navigator.share && (
            <Button
              onClick={handleNativeShare}
              className="w-full justify-start"
              variant="outline"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share via device
            </Button>
          )}

          {/* WhatsApp - Popular in Morocco */}
          <Button
            onClick={shareViaWhatsApp}
            className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Share via WhatsApp
          </Button>

          {/* Social Media */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={shareViaFacebook}
              variant="outline"
              className="justify-start"
            >
              <Facebook className="h-4 w-4 mr-2" />
              Facebook
            </Button>
            <Button
              onClick={shareViaTwitter}
              variant="outline"
              className="justify-start"
            >
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </Button>
          </div>

          {/* Email */}
          <Button
            onClick={shareViaEmail}
            variant="outline"
            className="w-full justify-start"
          >
            <Mail className="h-4 w-4 mr-2" />
            Share via Email
          </Button>

          {/* Copy Link */}
          <div className="space-y-2">
            <Label htmlFor="product-url">Product Link</Label>
            <div className="flex gap-2">
              <Input
                id="product-url"
                value={productUrl}
                readOnly
                className="flex-1"
              />
              <Button
                onClick={copyToClipboard}
                variant="outline"
                size="icon"
                className={copied ? "bg-green-100 border-green-300" : ""}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareProduct;
