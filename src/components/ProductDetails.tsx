import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  ArrowLeft,
  Shield,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import Navigation from './Navigation';
import { useFavorites } from '../contexts/FavoritesContext';
import { useComparison } from '../contexts/ComparisonContext';
import { getProductById } from '../data/mockProducts';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const { addToComparison, isInComparison } = useComparison();

  const product = id ? getProductById(id) : null;

  useEffect(() => {
    if (!product) {
      navigate('/products');
    }
  }, [product, navigate]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Produit non trouvé</h2>
            <p className="text-gray-600 mb-4">Le produit que vous recherchez n'existe pas.</p>
            <Button onClick={() => navigate('/products')}>
              Retour aux produits
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const allImages = product.images.length > 0 ? product.images : [product.image];

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === allImages.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? allImages.length - 1 : prevIndex - 1
    );
  };

  const handleFavoriteClick = () => {
    if (isFavorite(product.id)) {
      removeFromFavorites(product.id);
    } else {
      addToFavorites(product);
    }
  };

  const handleCompareClick = () => {
    addToComparison(product);
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'bg-green-100 text-green-800';
      case 'used':
        return 'bg-amber-100 text-amber-800';
      case 'refurbished':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'new':
        return 'Neuf';
      case 'used':
        return 'Occasion';
      case 'refurbished':
        return 'Reconditionné';
      default:
        return condition;
    }
  };

  const formatWhatsAppNumber = (number: string) => {
    return number.startsWith('0') ? `212${number.substring(1)}` : number;
  };

  const getWhatsAppLink = () => {
    const formattedNumber = formatWhatsAppNumber(product.phoneNumber);
    const message = `Bonjour, je suis intéressé par votre ${product.title} à ${product.price} ${product.currency}`;
    return `https://wa.me/${formattedNumber}?text=${encodeURIComponent(message)}`;
  };

  const handleShare = () => {
    const shareData = {
      title: product.title,
      text: `Découvrez ce ${getConditionText(product.condition).toLowerCase()} ${product.title} pour ${product.price} ${product.currency}`,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié dans le presse-papiers !');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <span className="text-gray-400">/</span>
          <span className="text-sm text-gray-600">Produits</span>
          <span className="text-gray-400">/</span>
          <span className="text-sm font-medium">{product.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Images Section */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-white rounded-lg overflow-hidden shadow-sm">
              {product.isPremium && (
                <div className="absolute top-4 left-4 z-20 bg-sky-600 text-white px-3 py-1 text-sm font-bold rounded">
                  PREMIUM
                </div>
              )}
              {product.isFeatured && (
                <div className="absolute top-4 right-4 z-20 bg-amber-500 text-white px-3 py-1 text-sm font-bold rounded">
                  FEATURED
                </div>
              )}
              
              <img
                src={allImages[currentImageIndex]}
                alt={`${product.title} - image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Navigation arrows */}
              {allImages.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm"
                    onClick={prevImage}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm"
                    onClick={nextImage}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Action buttons */}
              <div className="absolute bottom-4 right-4 flex gap-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-white/90 backdrop-blur-sm"
                        onClick={handleFavoriteClick}
                      >
                        <Heart
                          className={`h-4 w-4 ${
                            isFavorite(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'
                          }`}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isFavorite(product.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className={`bg-white/90 backdrop-blur-sm ${
                          isInComparison(product.id) ? 'ring-2 ring-blue-500' : ''
                        }`}
                        onClick={handleCompareClick}
                      >
                        <BarChart2
                          className={`h-4 w-4 ${
                            isInComparison(product.id) ? 'text-blue-600' : 'text-gray-600'
                          }`}
                        />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{isInComparison(product.id) ? 'Dans la comparaison' : 'Ajouter à la comparaison'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        className="bg-white/90 backdrop-blur-sm"
                        onClick={handleShare}
                      >
                        <Share2 className="h-4 w-4 text-gray-600" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Partager</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Thumbnail Images */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      index === currentImageIndex ? 'border-sky-600' : 'border-gray-200'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.title} - thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge className={getConditionColor(product.condition)}>
                  {getConditionText(product.condition)}
                </Badge>
                {product.specs?.warranty && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    Garantie {product.specs.warranty}
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <p className="text-4xl font-bold text-sky-600 mb-4">
                {product.price.toLocaleString()} {product.currency}
              </p>
            </div>

            {/* Seller Info */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${product.sellerName}`} />
                      <AvatarFallback>{product.sellerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{product.sellerName}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm">{product.sellerRating}</span>
                        <span className="text-sm text-gray-500">• Vendeur vérifié</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">{product.location}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Buttons */}
            <div className="space-y-3">
              <div className="flex gap-3">
                <Button className="flex-1" size="lg">
                  <Phone className="h-4 w-4 mr-2" />
                  Appeler
                </Button>
                <Button variant="outline" className="flex-1" size="lg" asChild>
                  <a href={getWhatsAppLink()} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </a>
                </Button>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  Envoyer un message
                </Button>
                <Button variant="outline" size="icon">
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck className="h-4 w-4" />
                <span>Livraison disponible</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Réponse rapide</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle className="h-4 w-4" />
                <span>Produit vérifié</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="h-4 w-4" />
                <span>Achat sécurisé</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Information Tabs */}
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="specs" className="w-full">
              <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 gap-1">
                <TabsTrigger value="specs" className="text-xs sm:text-sm">Caractéristiques</TabsTrigger>
                <TabsTrigger value="description" className="text-xs sm:text-sm">Description</TabsTrigger>
                <TabsTrigger value="seller" className="text-xs sm:text-sm">Vendeur</TabsTrigger>
              </TabsList>
              
              <TabsContent value="specs" className="mt-6">
                {product.specs ? (
                  <div className="space-y-6">
                    {/* Main Specifications Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {/* Brand & Model */}
                      {(product.specs.brand || product.specs.model) && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                              <Phone className="h-4 w-4 text-sky-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Marque / Modèle</span>
                          </div>
                          <p className="font-semibold text-gray-900">{product.specs.brand}</p>
                          {product.specs.model && (
                            <p className="text-sm text-gray-600">{product.specs.model}</p>
                          )}
                        </div>
                      )}

                      {/* Storage */}
                      {product.specs.storage && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                              <svg className="h-4 w-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-500">Stockage</span>
                          </div>
                          <p className="font-semibold text-gray-900 text-lg">{product.specs.storage}</p>
                        </div>
                      )}

                      {/* RAM */}
                      {product.specs.ram && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-500">RAM</span>
                          </div>
                          <p className="font-semibold text-gray-900 text-lg">{product.specs.ram}</p>
                        </div>
                      )}

                      {/* Display */}
                      {product.specs.display && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-500">Écran</span>
                          </div>
                          <p className="font-semibold text-gray-900">{product.specs.display}</p>
                        </div>
                      )}

                      {/* Camera */}
                      {product.specs.camera && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                              <svg className="h-4 w-4 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-500">Appareil Photo</span>
                          </div>
                          <p className="font-semibold text-gray-900">{product.specs.camera}</p>
                        </div>
                      )}

                      {/* Battery */}
                      {product.specs.battery && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                              <svg className="h-4 w-4 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-500">Batterie</span>
                          </div>
                          <p className="font-semibold text-gray-900 text-lg">{product.specs.battery}</p>
                        </div>
                      )}

                      {/* OS */}
                      {product.specs.os && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                              <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-500">Système</span>
                          </div>
                          <p className="font-semibold text-gray-900">{product.specs.os}</p>
                        </div>
                      )}

                      {/* Color */}
                      {product.specs.color && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                              <svg className="h-4 w-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                              </svg>
                            </div>
                            <span className="text-sm font-medium text-gray-500">Couleur</span>
                          </div>
                          <p className="font-semibold text-gray-900">{product.specs.color}</p>
                        </div>
                      )}

                      {/* Warranty */}
                      {product.specs.warranty && (
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                              <Shield className="h-4 w-4 text-emerald-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-500">Garantie</span>
                          </div>
                          <p className="font-semibold text-gray-900">{product.specs.warranty}</p>
                        </div>
                      )}
                    </div>

                    {/* Detailed Specs Table */}
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        Fiche technique complète
                      </h4>
                      <div className="bg-white border rounded-lg overflow-hidden">
                        <table className="w-full">
                          <tbody className="divide-y">
                            {Object.entries(product.specs).map(([key, value]) => {
                              if (!value) return null;
                              
                              const labels: Record<string, string> = {
                                brand: 'Marque',
                                model: 'Modèle',
                                storage: 'Capacité de stockage',
                                ram: 'Mémoire RAM',
                                display: 'Taille d\'écran',
                                camera: 'Caméra principale',
                                battery: 'Capacité batterie',
                                os: 'Système d\'exploitation',
                                color: 'Couleur',
                                warranty: 'Garantie'
                              };
                              
                              return (
                                <tr key={key} className="hover:bg-gray-50">
                                  <td className="px-4 py-3 text-sm font-medium text-gray-500 bg-gray-50 w-1/3">
                                    {labels[key] || key}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900">
                                    {value}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Aucune spécification disponible pour ce produit.</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="description" className="mt-6">
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed">
                    {product.title} en {getConditionText(product.condition).toLowerCase()} dans un état impeccable. 
                    Ce produit a été soigneusement vérifié et testé pour garantir son bon fonctionnement.
                  </p>
                  
                  {product.condition === 'used' && (
                    <div className="mt-4 p-4 bg-amber-50 rounded-lg">
                      <h4 className="font-semibold text-amber-800 mb-2">État du produit d'occasion</h4>
                      <ul className="text-sm text-amber-700 space-y-1">
                        <li>• Fonctionnement parfait testé</li>
                        <li>• Traces d'usage normales</li>
                        <li>• Emballage d'origine non inclus</li>
                        <li>• Garantie vendeur incluse</li>
                      </ul>
                    </div>
                  )}
                  
                  {product.condition === 'new' && (
                    <div className="mt-4 p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Produit neuf</h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Emballage d'origine scellé</li>
                        <li>• Garantie constructeur complète</li>
                        <li>• Tous les accessoires inclus</li>
                        <li>• Facture d'achat fournie</li>
                      </ul>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="seller" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${product.sellerName}`} />
                      <AvatarFallback className="text-lg">{product.sellerName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">{product.sellerName}</h3>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= Math.round(product.sellerRating)
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600">
                          ({product.sellerRating.toFixed(1)}) • {product.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-sky-600">98%</div>
                      <div className="text-sm text-gray-600">Avis positifs</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-sky-600">24h</div>
                      <div className="text-sm text-gray-600">Temps de réponse</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-sky-600">156</div>
                      <div className="text-sm text-gray-600">Ventes réalisées</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-sky-600">2 ans</div>
                      <div className="text-sm text-gray-600">Sur la plateforme</div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}