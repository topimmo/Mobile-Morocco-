import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";
import {
  Upload,
  X,
  Plus,
  MapPin,
  Phone,
  MessageCircle,
  AlertCircle,
  Check,
} from "lucide-react";
import { toast } from "./ui/use-toast";
import { uploadImages, deleteImage } from "@/lib/supabase/storage";
import { Loader2 } from "lucide-react";

interface ProductListingFormProps {
  onSubmit?: (listing: ProductListing) => void;
  onCancel?: () => void;
  initialData?: Partial<ProductListing>;
}

interface ProductListing {
  title: string;
  description: string;
  price: number;
  currency: string;
  condition: "new" | "used" | "refurbished";
  category: string;
  subcategory: string;
  brand: string;
  model: string;
  images: string[];
  specifications: {
    storage?: string;
    ram?: string;
    display?: string;
    camera?: string;
    battery?: string;
    os?: string;
    color?: string;
    warranty?: string;
  };
  location: string;
  contactInfo: {
    phone: string;
    showPhoneNumber: boolean;
    enableWhatsApp: boolean;
    email?: string;
  };
  features: string[];
  negotiable: boolean;
  urgent: boolean;
}

const ProductListingForm: React.FC<ProductListingFormProps> = ({
  onSubmit = () => {},
  onCancel = () => {},
  initialData = {},
}) => {
  const [formData, setFormData] = useState<ProductListing>({
    title: "",
    description: "",
    price: 0,
    currency: "MAD",
    condition: "used",
    category: "",
    subcategory: "",
    brand: "",
    model: "",
    images: [],
    specifications: {},
    location: "",
    contactInfo: {
      phone: "",
      showPhoneNumber: false,
      enableWhatsApp: false,
    },
    features: [],
    negotiable: false,
    urgent: false,
    ...initialData,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>(formData.images || []);
  const [newImageUrl, setNewImageUrl] = useState("");

  const categories = [
    "Smartphones",
    "Accessories",
    "Spare Parts",
    "Repair Equipment",
    "Cases & Covers",
    "Chargers & Cables",
    "Audio",
  ];

  const subcategories = {
    Smartphones: ["New Phones", "Used Phones", "Refurbished Phones"],
    Accessories: ["Cases", "Screen Protectors", "Power Banks", "Headphones"],
    "Spare Parts": ["Screens", "Batteries", "Cameras", "Charging Ports"],
    "Repair Equipment": ["Tools", "Adhesives", "Testing Equipment"],
    "Cases & Covers": ["Phone Cases", "Screen Protectors", "Tempered Glass"],
    "Chargers & Cables": ["Wall Chargers", "Car Chargers", "USB Cables"],
    Audio: ["Headphones", "Earbuds", "Speakers", "Bluetooth Accessories"],
  };

  const brands = [
    "Apple",
    "Samsung",
    "Xiaomi",
    "Huawei",
    "Oppo",
    "Vivo",
    "Realme",
    "OnePlus",
    "Nokia",
    "Google",
    "Sony",
    "LG",
    "Motorola",
    "Other",
  ];

  const locations = [
    "Casablanca",
    "Rabat",
    "Marrakech",
    "Fes",
    "Tangier",
    "Agadir",
    "Meknes",
    "Oujda",
    "Kenitra",
    "Tetouan",
    "Safi",
    "Mohammedia",
  ];

  const availableFeatures = [
    "5G",
    "Dual SIM",
    "Expandable Memory",
    "Fast Charging",
    "Wireless Charging",
    "Water Resistant",
    "Face ID",
    "Fingerprint Scanner",
    "NFC",
    "Bluetooth 5.0",
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSpecificationChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        [field]: value,
      },
    }));
  };

  const handleContactInfoChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [field]: value,
      },
    }));
  };

  const handleFeatureToggle = (feature: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      features: checked
        ? [...prev.features, feature]
        : prev.features.filter((f) => f !== feature),
    }));
  };

  const addImageUrl = () => {
    if (newImageUrl.trim() && !imageUrls.includes(newImageUrl.trim())) {
      const updatedImages = [...imageUrls, newImageUrl.trim()];
      setImageUrls(updatedImages);
      setFormData((prev) => ({ ...prev, images: updatedImages }));
      setNewImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = imageUrls.filter((_, i) => i !== index);
    setImageUrls(updatedImages);
    setFormData((prev) => ({ ...prev, images: updatedImages }));
  };

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      toast({
        title: "Validation Error",
        description: "Product title is required.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Product description is required.",
        variant: "destructive",
      });
      return false;
    }

    if (formData.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Please enter a valid price.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.category) {
      toast({
        title: "Validation Error",
        description: "Please select a category.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.location) {
      toast({
        title: "Validation Error",
        description: "Please select your location.",
        variant: "destructive",
      });
      return false;
    }

    if (!formData.contactInfo.phone.trim()) {
      toast({
        title: "Validation Error",
        description: "Phone number is required.",
        variant: "destructive",
      });
      return false;
    }

    if (imageUrls.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please add at least one product image.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Success!",
        description: "Your product listing has been submitted for review.",
      });

      onSubmit(formData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit listing. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create Product Listing</h1>
        <p className="text-gray-600">
          Fill in the details below to create your product listing. All fields
          marked with * are required.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Product Title *</Label>
              <Input
                id="title"
                placeholder="e.g., iPhone 13 Pro Max - 256GB - Excellent Condition"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe your product in detail. Include condition, usage history, any defects, etc."
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={4}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0"
                  value={formData.price || ""}
                  onChange={(e) =>
                    handleInputChange("price", parseFloat(e.target.value) || 0)
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) =>
                    handleInputChange("currency", value)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MAD">MAD (Dirham)</SelectItem>
                    <SelectItem value="EUR">EUR (Euro)</SelectItem>
                    <SelectItem value="USD">USD (Dollar)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="condition">Condition *</Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) =>
                    handleInputChange("condition", value)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="used">Used</SelectItem>
                    <SelectItem value="refurbished">Refurbished</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="negotiable"
                  checked={formData.negotiable}
                  onCheckedChange={(checked) =>
                    handleInputChange("negotiable", checked)
                  }
                />
                <Label htmlFor="negotiable">Price is negotiable</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="urgent"
                  checked={formData.urgent}
                  onCheckedChange={(checked) =>
                    handleInputChange("urgent", checked)
                  }
                />
                <Label htmlFor="urgent">Urgent sale</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category & Brand */}
        <Card>
          <CardHeader>
            <CardTitle>Category & Brand</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => {
                    handleInputChange("category", value);
                    handleInputChange("subcategory", ""); // Reset subcategory
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.category &&
                subcategories[
                  formData.category as keyof typeof subcategories
                ] && (
                  <div>
                    <Label htmlFor="subcategory">Subcategory</Label>
                    <Select
                      value={formData.subcategory}
                      onValueChange={(value) =>
                        handleInputChange("subcategory", value)
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {subcategories[
                          formData.category as keyof typeof subcategories
                        ].map((subcategory) => (
                          <SelectItem key={subcategory} value={subcategory}>
                            {subcategory}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="brand">Brand</Label>
                <Select
                  value={formData.brand}
                  onValueChange={(value) => handleInputChange("brand", value)}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  placeholder="e.g., iPhone 13 Pro Max"
                  value={formData.model}
                  onChange={(e) => handleInputChange("model", e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="storage">Storage</Label>
                <Input
                  id="storage"
                  placeholder="e.g., 256GB"
                  value={formData.specifications.storage || ""}
                  onChange={(e) =>
                    handleSpecificationChange("storage", e.target.value)
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="ram">RAM</Label>
                <Input
                  id="ram"
                  placeholder="e.g., 8GB"
                  value={formData.specifications.ram || ""}
                  onChange={(e) =>
                    handleSpecificationChange("ram", e.target.value)
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="display">Display</Label>
                <Input
                  id="display"
                  placeholder="e.g., 6.7 inch"
                  value={formData.specifications.display || ""}
                  onChange={(e) =>
                    handleSpecificationChange("display", e.target.value)
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="camera">Camera</Label>
                <Input
                  id="camera"
                  placeholder="e.g., 48MP Triple"
                  value={formData.specifications.camera || ""}
                  onChange={(e) =>
                    handleSpecificationChange("camera", e.target.value)
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="battery">Battery</Label>
                <Input
                  id="battery"
                  placeholder="e.g., 4500mAh"
                  value={formData.specifications.battery || ""}
                  onChange={(e) =>
                    handleSpecificationChange("battery", e.target.value)
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="os">Operating System</Label>
                <Input
                  id="os"
                  placeholder="e.g., iOS 15"
                  value={formData.specifications.os || ""}
                  onChange={(e) =>
                    handleSpecificationChange("os", e.target.value)
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  placeholder="e.g., Space Gray"
                  value={formData.specifications.color || ""}
                  onChange={(e) =>
                    handleSpecificationChange("color", e.target.value)
                  }
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="warranty">Warranty</Label>
                <Input
                  id="warranty"
                  placeholder="e.g., 1 Year"
                  value={formData.specifications.warranty || ""}
                  onChange={(e) =>
                    handleSpecificationChange("warranty", e.target.value)
                  }
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <Card>
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {availableFeatures.map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={`feature-${feature}`}
                    checked={formData.features.includes(feature)}
                    onCheckedChange={(checked) =>
                      handleFeatureToggle(feature, checked === true)
                    }
                  />
                  <Label htmlFor={`feature-${feature}`} className="text-sm">
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle>Product Images *</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter image URL (e.g., https://example.com/image.jpg)"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                className="flex-1"
              />
              <Button type="button" onClick={addImageUrl} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>

            {imageUrls.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {imageUrls.map((url, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={url}
                      alt={`Product image ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1591337676887-a217a6970a8a?w=400&q=80";
                      }}
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    {index === 0 && (
                      <Badge className="absolute bottom-1 left-1 text-xs">
                        Main
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}

            <p className="text-sm text-gray-500">
              Add at least one image. The first image will be used as the main
              product image.
            </p>
          </CardContent>
        </Card>

        {/* Location & Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Location & Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="location">Location *</Label>
              <Select
                value={formData.location}
                onValueChange={(value) => handleInputChange("location", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select your city" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {location}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                placeholder="e.g., 0612345678"
                value={formData.contactInfo.phone}
                onChange={(e) =>
                  handleContactInfoChange("phone", e.target.value)
                }
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={formData.contactInfo.email || ""}
                onChange={(e) =>
                  handleContactInfoChange("email", e.target.value)
                }
                className="mt-1"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="showPhone"
                  checked={formData.contactInfo.showPhoneNumber}
                  onCheckedChange={(checked) =>
                    handleContactInfoChange("showPhoneNumber", checked)
                  }
                />
                <Label htmlFor="showPhone" className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Show phone number publicly
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="enableWhatsApp"
                  checked={formData.contactInfo.enableWhatsApp}
                  onCheckedChange={(checked) =>
                    handleContactInfoChange("enableWhatsApp", checked)
                  }
                />
                <Label
                  htmlFor="enableWhatsApp"
                  className="flex items-center gap-2"
                >
                  <MessageCircle className="h-4 w-4" />
                  Enable WhatsApp contact
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms and Submit */}
        <Card>
          <CardContent className="pt-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Before submitting:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Ensure all information is accurate and complete</li>
                    <li>Your listing will be reviewed before going live</li>
                    <li>You'll receive a notification once approved</li>
                    <li>
                      You can edit your listing anytime from your dashboard
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="min-w-32"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    Submit Listing
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
};

export default ProductListingForm;
