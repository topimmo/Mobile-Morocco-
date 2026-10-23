import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface AddAdFormProps {
  onSubmit: (adData: AdFormData) => void;
  onCancel: () => void;
  isRTL?: boolean;
}

export interface AdFormData {
  title: string;
  type: string;
  location: string;
  duration: string;
  imageUrl: string;
  linkUrl: string;
  description: string;
}

const AddAdForm: React.FC<AddAdFormProps> = ({
  onSubmit,
  onCancel,
  isRTL = false,
}) => {
  const [formData, setFormData] = useState<AdFormData>({
    title: "",
    type: "",
    location: "",
    duration: "",
    imageUrl: "",
    linkUrl: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isRTL ? "إضافة إعلان جديد" : "Ajouter une nouvelle publicité"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">
                {isRTL ? "عنوان الإعلان" : "Titre de la publicité"}
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">
                {isRTL ? "نوع الإعلان" : "Type de publicité"}
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange("type", value)}
              >
                <SelectTrigger id="type">
                  <SelectValue
                    placeholder={isRTL ? "اختر النوع" : "Sélectionner le type"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="banner">Banner (728x90)</SelectItem>
                  <SelectItem value="large_banner">
                    Large Banner (970x250)
                  </SelectItem>
                  <SelectItem value="sidebar">Sidebar (300x600)</SelectItem>
                  <SelectItem value="medium_rectangle">
                    Medium Rectangle (300x250)
                  </SelectItem>
                  <SelectItem value="small_banner">
                    Small Banner (468x60)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                {isRTL ? "موقع الإعلان" : "Emplacement de la publicité"}
              </Label>
              <Select
                value={formData.location}
                onValueChange={(value) => handleSelectChange("location", value)}
              >
                <SelectTrigger id="location">
                  <SelectValue
                    placeholder={
                      isRTL ? "اختر الموقع" : "Sélectionner l'emplacement"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home_top">Home Page (Top)</SelectItem>
                  <SelectItem value="home_middle">
                    Home Page (Middle)
                  </SelectItem>
                  <SelectItem value="home_bottom">
                    Home Page (Bottom)
                  </SelectItem>
                  <SelectItem value="category_page">Category Page</SelectItem>
                  <SelectItem value="product_page">Product Page</SelectItem>
                  <SelectItem value="between_listings">
                    Between Listings
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">
                {isRTL ? "مدة الإعلان" : "Durée de la publicité"}
              </Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => handleSelectChange("duration", value)}
              >
                <SelectTrigger id="duration">
                  <SelectValue
                    placeholder={isRTL ? "اختر المدة" : "Sélectionner la durée"}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 {isRTL ? "يوم" : "jour"}</SelectItem>
                  <SelectItem value="7">
                    7 {isRTL ? "أيام" : "jours"}
                  </SelectItem>
                  <SelectItem value="15">
                    15 {isRTL ? "يوم" : "jours"}
                  </SelectItem>
                  <SelectItem value="30">
                    30 {isRTL ? "يوم" : "jours"}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl">
                {isRTL ? "رابط الصورة" : "URL de l'image"}
              </Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkUrl">
                {isRTL ? "رابط الوجهة" : "URL de destination"}
              </Label>
              <Input
                id="linkUrl"
                name="linkUrl"
                value={formData.linkUrl}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              {isRTL ? "وصف الإعلان" : "Description de la publicité"}
            </Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              {isRTL ? "إلغاء" : "Annuler"}
            </Button>
            <Button type="submit">
              {isRTL ? "حفظ الإعلان" : "Enregistrer la publicité"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddAdForm;
