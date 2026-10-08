import { useState } from 'react';
import { X, Upload, MapPin } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  language: 'ar' | 'fr';
}

export function AddProductModal({ open, onClose, language }: AddProductModalProps) {
  const [step, setStep] = useState('details');

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass-card border-white/10 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className={`text-2xl font-grotesk ${language === 'ar' ? 'font-tajawal text-right' : ''}`}>
            {language === 'fr' ? 'Ajouter un Nouveau Produit' : 'إضافة منتج جديد'}
          </DialogTitle>
        </DialogHeader>

        <Tabs value={step} onValueChange={setStep} className="w-full">
          <TabsList className="grid w-full grid-cols-4 glass-card">
            <TabsTrigger value="details">
              {language === 'fr' ? 'Détails' : 'التفاصيل'}
            </TabsTrigger>
            <TabsTrigger value="images">
              {language === 'fr' ? 'Images' : 'الصور'}
            </TabsTrigger>
            <TabsTrigger value="pricing">
              {language === 'fr' ? 'Prix' : 'السعر'}
            </TabsTrigger>
            <TabsTrigger value="location">
              {language === 'fr' ? 'Lieu' : 'الموقع'}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="title" className={language === 'ar' ? 'font-tajawal' : ''}>
                {language === 'fr' ? 'Titre du produit' : 'عنوان المنتج'}
              </Label>
              <Input
                id="title"
                placeholder={language === 'fr' ? 'Ex: iPhone 15 Pro Max 256GB' : 'مثال: آيفون 15 برو ماكس 256 جيجا'}
                className="glass-card border-white/10"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className={language === 'ar' ? 'font-tajawal' : ''}>
                {language === 'fr' ? 'Description' : 'الوصف'}
              </Label>
              <Textarea
                id="description"
                rows={4}
                placeholder={language === 'fr' ? 'Décrivez votre produit...' : 'صف منتجك...'}
                className="glass-card border-white/10"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="brand" className={language === 'ar' ? 'font-tajawal' : ''}>
                  {language === 'fr' ? 'Marque' : 'العلامة التجارية'}
                </Label>
                <Input
                  id="brand"
                  placeholder="Apple"
                  className="glass-card border-white/10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="condition" className={language === 'ar' ? 'font-tajawal' : ''}>
                  {language === 'fr' ? 'État' : 'الحالة'}
                </Label>
                <Input
                  id="condition"
                  placeholder={language === 'fr' ? 'Neuf' : 'جديد'}
                  className="glass-card border-white/10"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="images" className="space-y-4 mt-6">
            <div className="border-2 border-dashed border-white/20 rounded-lg p-12 text-center hover:border-accent/50 transition-colors cursor-pointer">
              <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <p className={`text-sm text-muted-foreground mb-2 ${language === 'ar' ? 'font-tajawal' : ''}`}>
                {language === 'fr' 
                  ? 'Cliquez pour télécharger ou glissez-déposez'
                  : 'انقر للتحميل أو اسحب وأفلت'
                }
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG, WEBP {language === 'fr' ? 'jusqu\'à' : 'حتى'} 10MB
              </p>
            </div>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="price" className={language === 'ar' ? 'font-tajawal' : ''}>
                {language === 'fr' ? 'Prix (MAD)' : 'السعر (درهم)'}
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="12500"
                className="glass-card border-white/10 font-mono-jet"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="negotiable" className={language === 'ar' ? 'font-tajawal' : ''}>
                {language === 'fr' ? 'Prix négociable?' : 'السعر قابل للتفاوض؟'}
              </Label>
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1 glass-card border-white/10">
                  {language === 'fr' ? 'Oui' : 'نعم'}
                </Button>
                <Button variant="outline" className="flex-1 glass-card border-white/10">
                  {language === 'fr' ? 'Non' : 'لا'}
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="location" className="space-y-4 mt-6">
            <div className="space-y-2">
              <Label htmlFor="city" className={language === 'ar' ? 'font-tajawal' : ''}>
                {language === 'fr' ? 'Ville' : 'المدينة'}
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="city"
                  placeholder={language === 'fr' ? 'Casablanca' : 'الدار البيضاء'}
                  className="glass-card border-white/10 pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className={language === 'ar' ? 'font-tajawal' : ''}>
                {language === 'fr' ? 'Adresse (optionnel)' : 'العنوان (اختياري)'}
              </Label>
              <Textarea
                id="address"
                rows={3}
                placeholder={language === 'fr' ? 'Adresse complète...' : 'العنوان الكامل...'}
                className="glass-card border-white/10"
              />
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-6 border-t border-white/10">
          <Button
            variant="outline"
            onClick={onClose}
            className="glass-card border-white/10"
          >
            {language === 'fr' ? 'Annuler' : 'إلغاء'}
          </Button>
          <Button className="bg-primary hover:bg-primary/90">
            {language === 'fr' ? 'Soumettre pour Approbation' : 'إرسال للموافقة'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
