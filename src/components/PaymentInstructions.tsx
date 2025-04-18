import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AlertCircle, CreditCard, FileText, Send } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const PaymentInstructions = () => {
  const [language, setLanguage] = useState<"ar" | "fr">("ar");
  const [showInvoiceForm, setShowInvoiceForm] = useState(false);

  const isRTL = language === "ar";
  const dir = isRTL ? "rtl" : "ltr";

  const bankDetails = {
    accountNumber: "123456789012345678",
    accountHolder: "Mobile Marketplace SARL",
    bank: "Bank Al-Maghrib",
    whatsapp: "+212 612 345 678",
  };

  return (
    <div
      className={`min-h-screen bg-background ${isRTL ? "font-arabic" : "font-french"}`}
      dir={dir}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <a href="/" className="flex items-center gap-2">
              <span className="font-bold text-xl hidden sm:inline-block">
                {isRTL ? "سوق الهواتف" : "Marché Mobile"}
              </span>
            </a>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === "ar" ? "fr" : "ar")}
          >
            {isRTL ? "Français" : "العربية"}
          </Button>
        </div>
      </header>

      <main className="container py-10 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-center">
          {isRTL ? "تعليمات الدفع" : "Instructions de paiement"}
        </h1>

        <Tabs defaultValue="subscription" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="subscription">
              {isRTL ? "اشتراك المورد" : "Abonnement fournisseur"}
            </TabsTrigger>
            <TabsTrigger value="advertising">
              {isRTL ? "الإعلانات" : "Publicité"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="subscription" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {isRTL
                    ? "اشتراك المورد المميز - 49 درهم شهريًا"
                    : "Abonnement fournisseur premium - 49 MAD/mois"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {isRTL ? "المميزات" : "Avantages"}
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>
                        {isRTL
                          ? "عرض مميز في الصفحة الرئيسية"
                          : "Placement en vedette sur la page d'accueil"}
                      </li>
                      <li>
                        {isRTL
                          ? "إعلانات مميزة ومبرزة"
                          : "Annonces mises en évidence"}
                      </li>
                      <li>
                        {isRTL
                          ? "دعم ذو أولوية عبر واتساب"
                          : "Support prioritaire via WhatsApp"}
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">
                      {isRTL ? "تفاصيل البنك" : "Coordonnées bancaires"}
                    </h3>
                    <div className="space-y-2 text-muted-foreground">
                      <p>
                        <span className="font-medium">
                          {isRTL ? "رقم الحساب: " : "Numéro de compte: "}
                        </span>
                        {bankDetails.accountNumber}
                      </p>
                      <p>
                        <span className="font-medium">
                          {isRTL ? "صاحب الحساب: " : "Titulaire du compte: "}
                        </span>
                        {bankDetails.accountHolder}
                      </p>
                      <p>
                        <span className="font-medium">
                          {isRTL ? "البنك: " : "Banque: "}
                        </span>
                        {bankDetails.bank}
                      </p>
                    </div>
                  </div>
                </div>

                <Alert className="bg-primary/5 border-primary/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>
                    {isRTL ? "تأكيد الدفع" : "Confirmation de paiement"}
                  </AlertTitle>
                  <AlertDescription>
                    {isRTL
                      ? "بعد إجراء التحويل البنكي، يرجى إرسال إيصال الدفع عبر واتساب على الرقم التالي:"
                      : "Après avoir effectué le virement bancaire, veuillez envoyer le reçu de paiement via WhatsApp au numéro suivant:"}
                    <div className="flex items-center mt-2 font-semibold">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                        fill="currentColor"
                        className="h-5 w-5 mr-2 text-green-600"
                      >
                        <path d="M380.9 97.1C339-4.2 216.6-28.7 129.1 38.2c-55.5 42.5-80.8 110.4-63.6 176.3L0 480l189.3-62.7c61.3 25.6 132.1 15.4 182-28.5 69.9-62.1 91.2-164.2 47.6-251.7zM243 388.6c-27.1 0-53.4-6.5-77.1-18.7l-5.5-2.9-112.4 37.3L87.7 299l-3.6-5.7c-14.8-23.5-22.5-50.5-22.5-78.4 0-82.1 66.8-149 149-149 39.8 0 77.2 15.5 105.4 43.7s43.7 65.6 43.7 105.4c0 82.2-66.8 149-149 149zm82.3-111.2c-4.5-2.3-26.7-13.2-30.9-14.7-4.1-1.5-7.1-2.3-10.1 2.3s-11.6 14.7-14.2 17.8c-2.6 3-5.2 3.4-9.7 1.1-26.5-13.2-43.8-23.6-61.3-53.3-4.6-7.9 4.6-7.3 13.2-24.3 1.4-3 0.7-5.6-0.4-7.9-1.2-2.3-10.1-24.5-13.9-33.6-3.7-8.9-7.5-7.7-10.1-7.9-2.6-0.1-5.6-0.1-8.6-0.1s-7.9 1.1-12 5.6c-4.1 4.5-15.7 15.3-15.7 37.3s16.1 43.3 18.4 46.3c2.3 3 31.7 48.4 77 67.8 10.8 4.6 19.2 7.4 25.8 9.5 10.9 3.5 20.8 3 28.6 1.8 8.7-1.3 26.7-10.9 30.5-21.5 3.8-10.5 3.8-19.6 2.7-21.5-1.1-1.9-4.1-3-8.6-5.2z" />
                      </svg>
                      {bankDetails.whatsapp}
                    </div>
                  </AlertDescription>
                </Alert>

                <Alert variant="destructive" className="bg-destructive/5">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>
                    {isRTL ? "ملاحظة هامة" : "Note importante"}
                  </AlertTitle>
                  <AlertDescription>
                    {isRTL
                      ? "سيتم تفعيل حسابك المميز بعد تأكيد الدفع من قبل فريقنا."
                      : "Votre compte premium sera activé après confirmation du paiement par notre équipe."}
                  </AlertDescription>
                </Alert>

                <div className="pt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setShowInvoiceForm(!showInvoiceForm)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    {isRTL ? "طلب فاتورة" : "Demander une facture"}
                  </Button>
                </div>

                {showInvoiceForm && (
                  <div className="border rounded-lg p-4 mt-4 space-y-4">
                    <h3 className="font-semibold">
                      {isRTL
                        ? "طلب فاتورة باسم شركتك"
                        : "Demande de facture au nom de votre entreprise"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isRTL
                        ? "يرجى إرسال المعلومات التالية مع إيصال الدفع عبر واتساب:"
                        : "Veuillez envoyer les informations suivantes avec votre reçu de paiement via WhatsApp:"}
                    </p>

                    <div className="space-y-3">
                      <div className="grid gap-2">
                        <Label htmlFor="company">
                          {isRTL ? "اسم الشركة" : "Nom de l'entreprise"}
                        </Label>
                        <Input id="company" placeholder="Mobile Tech SARL" />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="address">
                          {isRTL ? "العنوان الكامل" : "Adresse complète"}
                        </Label>
                        <Textarea
                          id="address"
                          placeholder="123 Rue Mohammed V, Casablanca"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="ice">
                          {isRTL
                            ? "رقم السجل التجاري (ICE)"
                            : "Numéro d'immatriculation (ICE)"}
                        </Label>
                        <Input id="ice" placeholder="000123456789012" />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="email">
                          {isRTL ? "البريد الإلكتروني" : "Adresse e-mail"}
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="contact@company.ma"
                        />
                      </div>

                      <Button className="w-full">
                        <Send className="mr-2 h-4 w-4" />
                        {isRTL
                          ? "إرسال طلب الفاتورة"
                          : "Envoyer la demande de facture"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advertising" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  {isRTL ? "خدمات الإعلان" : "Services publicitaires"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    {isRTL
                      ? "أحجام وأماكن الإعلانات"
                      : "Tailles et emplacements des bannières"}
                  </h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">
                        {isRTL ? "أعلى الصفحة" : "Haut de page (Header)"}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        728 x 90 px
                      </p>
                      <div className="bg-muted h-[45px] w-full rounded flex items-center justify-center text-xs text-muted-foreground">
                        728 x 90
                      </div>
                      <p className="text-sm mt-2">
                        <span className="font-medium">
                          {isRTL ? "السعر: " : "Prix: "}
                        </span>
                        {isRTL ? "100 درهم / يوم" : "100 MAD / jour"}
                      </p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">
                        {isRTL
                          ? "وسط الصفحة الرئيسية"
                          : "Milieu de la page d'accueil"}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        970 x 250 px
                      </p>
                      <div className="bg-muted h-[125px] w-full rounded flex items-center justify-center text-xs text-muted-foreground">
                        970 x 250
                      </div>
                      <p className="text-sm mt-2">
                        <span className="font-medium">
                          {isRTL ? "السعر: " : "Prix: "}
                        </span>
                        {isRTL ? "150 درهم / يوم" : "150 MAD / jour"}
                      </p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">
                        {isRTL ? "أسفل الصفحة" : "Bas de page (Footer)"}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        728 x 90 px
                      </p>
                      <div className="bg-muted h-[45px] w-full rounded flex items-center justify-center text-xs text-muted-foreground">
                        728 x 90
                      </div>
                      <p className="text-sm mt-2">
                        <span className="font-medium">
                          {isRTL ? "السعر: " : "Prix: "}
                        </span>
                        {isRTL ? "80 درهم / يوم" : "80 MAD / jour"}
                      </p>
                    </div>

                    <div className="border rounded-lg p-4">
                      <h4 className="font-medium mb-2">
                        {isRTL ? "بين المنتجات" : "Entre les annonces"}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        468 x 60 px
                      </p>
                      <div className="bg-muted h-[30px] w-full rounded flex items-center justify-center text-xs text-muted-foreground">
                        468 x 60
                      </div>
                      <p className="text-sm mt-2">
                        <span className="font-medium">
                          {isRTL ? "السعر: " : "Prix: "}
                        </span>
                        {isRTL ? "60 درهم / يوم" : "60 MAD / jour"}
                      </p>
                    </div>

                    <div className="border rounded-lg p-4 md:col-span-2">
                      <h4 className="font-medium mb-2">
                        {isRTL ? "الشريط الجانبي" : "Barre latérale"}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        300 x 250 px
                      </p>
                      <div className="bg-muted h-[125px] w-[150px] rounded flex items-center justify-center text-xs text-muted-foreground">
                        300 x 250
                      </div>
                      <p className="text-sm mt-2">
                        <span className="font-medium">
                          {isRTL ? "السعر: " : "Prix: "}
                        </span>
                        {isRTL ? "70 درهم / يوم" : "70 MAD / jour"}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4">
                    <h3 className="text-lg font-semibold mb-4">
                      {isRTL
                        ? "خصومات الفترات الطويلة"
                        : "Remises pour longue durée"}
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                      <li>
                        {isRTL ? "أسبوع: خصم 10٪" : "Semaine: 10% de réduction"}
                      </li>
                      <li>
                        {isRTL ? "شهر: خصم 20٪" : "Mois: 20% de réduction"}
                      </li>
                      <li>
                        {isRTL ? "3 أشهر: خصم 30٪" : "3 mois: 30% de réduction"}
                      </li>
                    </ul>
                  </div>

                  <Alert className="bg-primary/5 border-primary/20">
                    <CreditCard className="h-4 w-4" />
                    <AlertTitle>
                      {isRTL ? "طريقة الدفع" : "Méthode de paiement"}
                    </AlertTitle>
                    <AlertDescription>
                      {isRTL
                        ? "يرجى استخدام نفس تفاصيل البنك المذكورة أعلاه لدفع رسوم الإعلان. بعد إجراء التحويل، أرسل إيصال الدفع مع تفاصيل الإعلان المطلوب (الموقع، المدة) عبر واتساب."
                        : "Veuillez utiliser les mêmes coordonnées bancaires mentionnées ci-dessus pour payer les frais de publicité. Après le virement, envoyez le reçu de paiement avec les détails de l'annonce souhaitée (emplacement, durée) via WhatsApp."}
                      <div className="flex items-center mt-2 font-semibold">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 448 512"
                          fill="currentColor"
                          className="h-5 w-5 mr-2 text-green-600"
                        >
                          <path d="M380.9 97.1C339-4.2 216.6-28.7 129.1 38.2c-55.5 42.5-80.8 110.4-63.6 176.3L0 480l189.3-62.7c61.3 25.6 132.1 15.4 182-28.5 69.9-62.1 91.2-164.2 47.6-251.7zM243 388.6c-27.1 0-53.4-6.5-77.1-18.7l-5.5-2.9-112.4 37.3L87.7 299l-3.6-5.7c-14.8-23.5-22.5-50.5-22.5-78.4 0-82.1 66.8-149 149-149 39.8 0 77.2 15.5 105.4 43.7s43.7 65.6 43.7 105.4c0 82.2-66.8 149-149 149zm82.3-111.2c-4.5-2.3-26.7-13.2-30.9-14.7-4.1-1.5-7.1-2.3-10.1 2.3s-11.6 14.7-14.2 17.8c-2.6 3-5.2 3.4-9.7 1.1-26.5-13.2-43.8-23.6-61.3-53.3-4.6-7.9 4.6-7.3 13.2-24.3 1.4-3 0.7-5.6-0.4-7.9-1.2-2.3-10.1-24.5-13.9-33.6-3.7-8.9-7.5-7.7-10.1-7.9-2.6-0.1-5.6-0.1-8.6-0.1s-7.9 1.1-12 5.6c-4.1 4.5-15.7 15.3-15.7 37.3s16.1 43.3 18.4 46.3c2.3 3 31.7 48.4 77 67.8 10.8 4.6 19.2 7.4 25.8 9.5 10.9 3.5 20.8 3 28.6 1.8 8.7-1.3 26.7-10.9 30.5-21.5 3.8-10.5 3.8-19.6 2.7-21.5-1.1-1.9-4.1-3-8.6-5.2z" />
                        </svg>
                        {bankDetails.whatsapp}
                      </div>
                    </AlertDescription>
                  </Alert>

                  <Alert variant="destructive" className="bg-destructive/5">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>
                      {isRTL ? "ملاحظة هامة" : "Note importante"}
                    </AlertTitle>
                    <AlertDescription>
                      {isRTL
                        ? "سيتم تفعيل إعلانك بعد تأكيد الدفع من قبل فريقنا. يرجى إرسال ملفات الإعلان بتنسيق JPG أو PNG عبر واتساب."
                        : "Votre annonce sera activée après confirmation du paiement par notre équipe. Veuillez envoyer les fichiers de l'annonce au format JPG ou PNG via WhatsApp."}
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © 2023{" "}
            {isRTL
              ? "سوق الهواتف. جميع الحقوق محفوظة"
              : "Marché Mobile. Tous droits réservés"}
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {isRTL ? "سياسة الخصوصية" : "Politique de confidentialité"}
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              {isRTL ? "شروط الاستخدام" : "Conditions d'utilisation"}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PaymentInstructions;
