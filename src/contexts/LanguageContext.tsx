import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';

export type Language = 'fr' | 'ar' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isRTL: boolean;
}

const translations: Record<string, Record<string, string>> = {
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.categories': 'الفئات',
    'nav.listings': 'الإعلانات',
    'nav.repair_shops': 'محلات الإصلاح',
    'nav.login': 'تسجيل الدخول',
    'nav.register': 'إنشاء حساب',
    'nav.dashboard': 'لوحة التحكم',
    'nav.admin': 'لوحة الإدارة',
    'nav.advertiser': 'لوحة المعلن',
    
    // Common
    'common.search': 'بحث',
    'common.filter': 'تصفية',
    'common.price': 'السعر',
    'common.location': 'الموقع',
    'common.city': 'المدينة',
    'common.neighborhood': 'الحي',
    'common.condition': 'الحالة',
    'common.brand': 'العلامة التجارية',
    'common.model': 'الطراز',
    'common.new': 'جديد',
    'common.used': 'مستعمل',
    'common.refurbished': 'مجدد',
    'common.contact_whatsapp': 'تواصل عبر واتساب',
    'common.contact_phone': 'اتصل هاتفياً',
    'common.share': 'شارك',
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.submit': 'إرسال',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.view_all': 'عرض الكل',
    'common.load_more': 'تحميل المزيد',
    'common.no_results': 'لا توجد نتائج',
    'common.free': 'مجاني',
    'common.mad': 'درهم',
    
    // Categories
    'category.phones': 'الهواتف',
    'category.accessories': 'الإكسسوارات',
    'category.spare_parts': 'قطع الغيار',
    'category.repair_equipment': 'معدات الإصلاح',
    
    // Repair Shops
    'repair.title': 'محلات إصلاح الهواتف',
    'repair.specialties': 'التخصصات',
    'repair.working_hours': 'ساعات العمل',
    'repair.address': 'العنوان',
    'repair.view_on_map': 'عرض على الخريطة',
    
    // Auth
    'auth.email': 'البريد الإلكتروني',
    'auth.password': 'كلمة المرور',
    'auth.phone': 'رقم الهاتف',
    'auth.full_name': 'الاسم الكامل',
    'auth.login': 'تسجيل الدخول',
    'auth.loginSubtitle': 'سجل دخولك للوصول إلى حسابك',
    'auth.loginButton': 'تسجيل الدخول',
    'auth.noAccount': 'ليس لديك حساب؟',
    'auth.register': 'إنشاء حساب',
    'auth.registrationSuccessCheckEmail': 'تم التسجيل بنجاح! يرجى التحقق من بريدك الإلكتروني لتأكيد حسابك قبل تسجيل الدخول.',
    'auth.invalidEmailOrPassword': 'البريد الإلكتروني أو كلمة المرور غير صحيحة. يرجى التحقق من بياناتك والمحاولة مرة أخرى.',
    'auth.profileNotFound': 'لم يتم العثور على الملف الشخصي. يرجى إكمال إعداد حسابك.',
    'auth.resendConfirmation': 'إعادة إرسال رسالة التأكيد',
    'auth.confirmationSent': 'تم إرسال رسالة تأكيد جديدة إلى',
    'auth.forgot_password': 'نسيت كلمة المرور؟',
    'auth.reset_password': 'إعادة تعيين كلمة المرور',
    'auth.verify_otp': 'التحقق من الرمز',
    'auth.send_otp': 'إرسال رمز التحقق',
    'auth.whatsapp_otp': 'التحقق عبر واتساب',
    'auth.email_otp': 'التحقق عبر البريد',
    
    // Banners & Ads
    'ads.create_campaign': 'إنشاء حملة إعلانية',
    'ads.my_campaigns': 'حملاتي الإعلانية',
    'ads.banner_top': 'بانر علوي',
    'ads.banner_bottom': 'بانر سفلي',
    'ads.duration': 'المدة',
    'ads.days': 'أيام',
    'ads.start_date': 'تاريخ البداية',
    'ads.end_date': 'تاريخ النهاية',
    'ads.select_pages': 'اختر الصفحات',
    'ads.all_pages': 'جميع الصفحات',
    'ads.check_availability': 'التحقق من التوفر',
    'ads.upload_banner': 'رفع البانر',
    'ads.banner_sizes': 'أحجام البانر المطلوبة',
    'ads.status_pending': 'قيد المراجعة',
    'ads.status_approved': 'مقبول',
    'ads.status_rejected': 'مرفوض',
    'ads.status_paused': 'متوقف',
    
    // Admin
    'admin.dashboard': 'لوحة الإدارة',
    'admin.manage_listings': 'إدارة الإعلانات',
    'admin.manage_shops': 'إدارة المحلات',
    'admin.manage_campaigns': 'إدارة الحملات',
    'admin.manage_users': 'إدارة المستخدمين',
    'admin.statistics': 'الإحصائيات',
    'admin.approve': 'قبول',
    'admin.reject': 'رفض',
    'admin.pause': 'إيقاف',
    
    // Cities
    'city.casablanca': 'الدار البيضاء',
    'city.rabat': 'الرباط',
    'city.marrakech': 'مراكش',
    'city.fes': 'فاس',
    'city.tanger': 'طنجة',
    'city.agadir': 'أكادير',
    'city.meknes': 'مكناس',
    'city.oujda': 'وجدة',
    'city.kenitra': 'القنيطرة',
    'city.tetouan': 'تطوان',

    // Homepage
    'home.hero_title': 'دليلك للهواتف في المغرب',
    'home.hero_subtitle': 'اعثر على أفضل الهواتف والإكسسوارات وقطع الغيار ومحلات الإصلاح',
    'home.search_placeholder': 'ابحث عن الهواتف والإكسسوارات...',
    'home.popular_categories': 'الفئات الشائعة',
    'home.popular_cities': 'المدن الشائعة',
    'home.latest_listings': 'أحدث الإعلانات',
    'home.featured_shops': 'محلات الإصلاح المميزة',

    // Footer
    'footer.brand_name': 'موبايل المغرب',
    'footer.brand_description': 'منصتك الأولى للهواتف والإكسسوارات وخدمات الإصلاح في المغرب',
    'footer.quick_links': 'روابط سريعة',
    'footer.home': 'الرئيسية',
    'footer.listings': 'الإعلانات',
    'footer.phones': 'الهواتف',
    'footer.spare_parts': 'قطع الغيار',
    'footer.equipment': 'المعدات',
    'footer.services': 'خدمات الإصلاح',
    'footer.stores': 'المحلات',
    'footer.technicians': 'الفنيين',
    'footer.compare': 'المقارنة',
    'footer.information': 'معلومات',
    'footer.about': 'من نحن',
    'footer.faq': 'الأسئلة الشائعة',
    'footer.contact': 'اتصل بنا',
    'footer.advertise': 'الإعلان',
    'footer.email': 'البريد الإلكتروني',
    'footer.phone': 'الهاتف',
    'footer.location': 'الموقع',
    'footer.casablanca_morocco': 'الدار البيضاء، المغرب',
    'footer.legal': 'قانوني',
    'footer.terms': 'شروط الاستخدام',
    'footer.privacy': 'سياسة الخصوصية',
    'footer.copyright': 'جميع الحقوق محفوظة',
    'footer.follow_us': 'تابعنا',
  },
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.categories': 'Catégories',
    'nav.listings': 'Annonces',
    'nav.repair_shops': 'Boutiques de réparation',
    'nav.login': 'Connexion',
    'nav.register': 'S\'inscrire',
    'nav.dashboard': 'Tableau de bord',
    'nav.admin': 'Administration',
    'nav.advertiser': 'Espace annonceur',
    
    // Common
    'common.search': 'Rechercher',
    'common.filter': 'Filtrer',
    'common.price': 'Prix',
    'common.location': 'Localisation',
    'common.city': 'Ville',
    'common.neighborhood': 'Quartier',
    'common.condition': 'État',
    'common.brand': 'Marque',
    'common.model': 'Modèle',
    'common.new': 'Neuf',
    'common.used': 'Occasion',
    'common.refurbished': 'Reconditionné',
    'common.contact_whatsapp': 'Contacter via WhatsApp',
    'common.contact_phone': 'Appeler',
    'common.share': 'Partager',
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.submit': 'Soumettre',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
    'common.view_all': 'Voir tout',
    'common.load_more': 'Charger plus',
    'common.no_results': 'Aucun résultat',
    'common.free': 'Gratuit',
    'common.mad': 'MAD',
    
    // Categories
    'category.phones': 'Téléphones',
    'category.accessories': 'Accessoires',
    'category.spare_parts': 'Pièces détachées',
    'category.repair_equipment': 'Équipement de réparation',
    
    // Repair Shops
    'repair.title': 'Boutiques de réparation',
    'repair.specialties': 'Spécialités',
    'repair.working_hours': 'Horaires d\'ouverture',
    'repair.address': 'Adresse',
    'repair.view_on_map': 'Voir sur la carte',
    
    // Auth
    'auth.email': 'Email',
    'auth.password': 'Mot de passe',
    'auth.phone': 'Téléphone',
    'auth.full_name': 'Nom complet',
    'auth.login': 'Se connecter',
    'auth.loginSubtitle': 'Connectez-vous pour accéder à votre compte',
    'auth.loginButton': 'Se connecter',
    'auth.noAccount': 'Vous n\'avez pas de compte?',
    'auth.register': 'S\'inscrire',
    'auth.registrationSuccessCheckEmail': 'Inscription réussie! Veuillez vérifier votre email pour confirmer votre compte avant de vous connecter.',
    'auth.invalidEmailOrPassword': 'Email ou mot de passe invalide. Veuillez vérifier vos informations et réessayer.',
    'auth.profileNotFound': 'Profil non trouvé. Veuillez compléter la configuration de votre compte.',
    'auth.resendConfirmation': 'Renvoyer l\'email de confirmation',
    'auth.confirmationSent': 'Un nouvel email de confirmation a été envoyé à',
    'auth.forgot_password': 'Mot de passe oublié?',
    'auth.reset_password': 'Réinitialiser le mot de passe',
    'auth.verify_otp': 'Vérifier le code',
    'auth.send_otp': 'Envoyer le code',
    'auth.whatsapp_otp': 'Vérification WhatsApp',
    'auth.email_otp': 'Vérification email',
    
    // Banners & Ads
    'ads.create_campaign': 'Créer une campagne',
    'ads.my_campaigns': 'Mes campagnes',
    'ads.banner_top': 'Bannière haut',
    'ads.banner_bottom': 'Bannière bas',
    'ads.duration': 'Durée',
    'ads.days': 'jours',
    'ads.start_date': 'Date de début',
    'ads.end_date': 'Date de fin',
    'ads.select_pages': 'Sélectionner les pages',
    'ads.all_pages': 'Toutes les pages',
    'ads.check_availability': 'Vérifier la disponibilité',
    'ads.upload_banner': 'Télécharger la bannière',
    'ads.banner_sizes': 'Tailles de bannière requises',
    'ads.status_pending': 'En attente',
    'ads.status_approved': 'Approuvé',
    'ads.status_rejected': 'Rejeté',
    'ads.status_paused': 'En pause',
    
    // Admin
    'admin.dashboard': 'Tableau de bord admin',
    'admin.manage_listings': 'Gérer les annonces',
    'admin.manage_shops': 'Gérer les boutiques',
    'admin.manage_campaigns': 'Gérer les campagnes',
    'admin.manage_users': 'Gérer les utilisateurs',
    'admin.statistics': 'Statistiques',
    'admin.approve': 'Approuver',
    'admin.reject': 'Rejeter',
    'admin.pause': 'Mettre en pause',
    
    // Cities
    'city.casablanca': 'Casablanca',
    'city.rabat': 'Rabat',
    'city.marrakech': 'Marrakech',
    'city.fes': 'Fès',
    'city.tanger': 'Tanger',
    'city.agadir': 'Agadir',
    'city.meknes': 'Meknès',
    'city.oujda': 'Oujda',
    'city.kenitra': 'Kénitra',
    'city.tetouan': 'Tétouan',

    // Homepage
    'home.hero_title': 'Votre guide mobile au Maroc',
    'home.hero_subtitle': 'Trouvez les meilleurs téléphones, accessoires, pièces détachées et boutiques de réparation',
    'home.search_placeholder': 'Rechercher téléphones, accessoires...',
    'home.popular_categories': 'Catégories populaires',
    'home.popular_cities': 'Villes populaires',
    'home.latest_listings': 'Dernières annonces',
    'home.featured_shops': 'Boutiques en vedette',

    // Footer
    'footer.brand_name': 'Mobile Maroc',
    'footer.brand_description': 'Votre première plateforme pour les téléphones, accessoires et services de réparation au Maroc',
    'footer.quick_links': 'Accès Rapide',
    'footer.home': 'Accueil',
    'footer.listings': 'Annonces',
    'footer.phones': 'Téléphones',
    'footer.spare_parts': 'Pièces Détachées',
    'footer.equipment': 'Équipements',
    'footer.services': 'Services de Réparation',
    'footer.stores': 'Boutiques',
    'footer.technicians': 'Techniciens',
    'footer.compare': 'Comparer',
    'footer.information': 'Information',
    'footer.about': 'À Propos',
    'footer.faq': 'FAQ',
    'footer.contact': 'Nous Contacter',
    'footer.advertise': 'Publicité',
    'footer.email': 'Email',
    'footer.phone': 'Téléphone',
    'footer.location': 'Localisation',
    'footer.casablanca_morocco': 'Casablanca, Maroc',
    'footer.legal': 'Légal',
    'footer.terms': 'Conditions d\'Utilisation',
    'footer.privacy': 'Politique de Confidentialité',
    'footer.copyright': 'Tous les droits réservés',
    'footer.follow_us': 'Suivez-nous',
  },
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.categories': 'Categories',
    'nav.listings': 'Listings',
    'nav.repair_shops': 'Repair Shops',
    'nav.login': 'Login',
    'nav.register': 'Register',
    'nav.dashboard': 'Dashboard',
    'nav.admin': 'Admin Panel',
    'nav.advertiser': 'Advertiser Panel',
    
    // Common
    'common.search': 'Search',
    'common.filter': 'Filter',
    'common.price': 'Price',
    'common.location': 'Location',
    'common.city': 'City',
    'common.neighborhood': 'Neighborhood',
    'common.condition': 'Condition',
    'common.brand': 'Brand',
    'common.model': 'Model',
    'common.new': 'New',
    'common.used': 'Used',
    'common.refurbished': 'Refurbished',
    'common.contact_whatsapp': 'Contact via WhatsApp',
    'common.contact_phone': 'Call',
    'common.share': 'Share',
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.submit': 'Submit',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.view_all': 'View All',
    'common.load_more': 'Load More',
    'common.no_results': 'No Results',
    'common.free': 'Free',
    'common.mad': 'MAD',
    
    // Categories
    'category.phones': 'Phones',
    'category.accessories': 'Accessories',
    'category.spare_parts': 'Spare Parts',
    'category.repair_equipment': 'Repair Equipment',
    
    // Repair Shops
    'repair.title': 'Repair Shops',
    'repair.specialties': 'Specialties',
    'repair.working_hours': 'Working Hours',
    'repair.address': 'Address',
    'repair.view_on_map': 'View on Map',
    
    // Auth
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.phone': 'Phone',
    'auth.full_name': 'Full Name',
    'auth.login': 'Login',
    'auth.loginSubtitle': 'Login to access your account',
    'auth.loginButton': 'Login',
    'auth.noAccount': 'Don\'t have an account?',
    'auth.register': 'Register',
    'auth.registrationSuccessCheckEmail': 'Registration successful! Please check your email to confirm your account before logging in.',
    'auth.invalidEmailOrPassword': 'Invalid email or password. Please check your credentials and try again.',
    'auth.profileNotFound': 'Profile not found. Please complete your account setup.',
    'auth.resendConfirmation': 'Resend Confirmation Email',
    'auth.confirmationSent': 'A new confirmation email has been sent to',
    'auth.forgot_password': 'Forgot Password?',
    'auth.reset_password': 'Reset Password',
    'auth.verify_otp': 'Verify Code',
    'auth.send_otp': 'Send Code',
    'auth.whatsapp_otp': 'WhatsApp Verification',
    'auth.email_otp': 'Email Verification',
    
    // Banners & Ads
    'ads.create_campaign': 'Create Campaign',
    'ads.my_campaigns': 'My Campaigns',
    'ads.banner_top': 'Top Banner',
    'ads.banner_bottom': 'Bottom Banner',
    'ads.duration': 'Duration',
    'ads.days': 'days',
    'ads.start_date': 'Start Date',
    'ads.end_date': 'End Date',
    'ads.select_pages': 'Select Pages',
    'ads.all_pages': 'All Pages',
    'ads.check_availability': 'Check Availability',
    'ads.upload_banner': 'Upload Banner',
    'ads.banner_sizes': 'Required Banner Sizes',
    'ads.status_pending': 'Pending',
    'ads.status_approved': 'Approved',
    'ads.status_rejected': 'Rejected',
    'ads.status_paused': 'Paused',
    
    // Admin
    'admin.dashboard': 'Admin Dashboard',
    'admin.manage_listings': 'Manage Listings',
    'admin.manage_shops': 'Manage Shops',
    'admin.manage_campaigns': 'Manage Campaigns',
    'admin.manage_users': 'Manage Users',
    'admin.statistics': 'Statistics',
    'admin.approve': 'Approve',
    'admin.reject': 'Reject',
    'admin.pause': 'Pause',
    
    // Cities
    'city.casablanca': 'Casablanca',
    'city.rabat': 'Rabat',
    'city.marrakech': 'Marrakech',
    'city.fes': 'Fes',
    'city.tanger': 'Tangier',
    'city.agadir': 'Agadir',
    'city.meknes': 'Meknes',
    'city.oujda': 'Oujda',
    'city.kenitra': 'Kenitra',
    'city.tetouan': 'Tetouan',

    // Homepage
    'home.hero_title': 'Your Mobile Guide in Morocco',
    'home.hero_subtitle': 'Find the best phones, accessories, spare parts and repair shops',
    'home.search_placeholder': 'Search for phones, accessories...',
    'home.popular_categories': 'Popular Categories',
    'home.popular_cities': 'Popular Cities',
    'home.latest_listings': 'Latest Listings',
    'home.featured_shops': 'Featured Shops',

    // Footer
    'footer.brand_name': 'Mobile Morocco',
    'footer.brand_description': 'Your premier platform for phones, accessories, and repair services in Morocco',
    'footer.quick_links': 'Quick Links',
    'footer.home': 'Home',
    'footer.listings': 'Listings',
    'footer.phones': 'Phones',
    'footer.spare_parts': 'Spare Parts',
    'footer.equipment': 'Equipment',
    'footer.services': 'Repair Services',
    'footer.stores': 'Stores',
    'footer.technicians': 'Technicians',
    'footer.compare': 'Compare',
    'footer.information': 'Information',
    'footer.about': 'About',
    'footer.faq': 'FAQ',
    'footer.contact': 'Contact Us',
    'footer.advertise': 'Advertise',
    'footer.email': 'Email',
    'footer.phone': 'Phone',
    'footer.location': 'Location',
    'footer.casablanca_morocco': 'Casablanca, Morocco',
    'footer.legal': 'Legal',
    'footer.terms': 'Terms of Service',
    'footer.privacy': 'Privacy Policy',
    'footer.copyright': 'All rights reserved',
    'footer.follow_us': 'Follow Us',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'fr' || saved === 'ar' || saved === 'en') ? saved : 'ar'; // Default to Arabic
  });

  const isRTL = language === 'ar';

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
    
    // Update body class for RTL styling
    if (isRTL) {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }
  }, [language, isRTL]);

  const t = useCallback((key: string): string => {
    return translations[language]?.[key] || translations['ar']?.[key] || key;
  }, [language]);

  const value = useMemo(
    () => ({ language, setLanguage, t, isRTL }),
    [language, t, isRTL]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};