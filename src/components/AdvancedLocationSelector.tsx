import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Calculator } from 'lucide-react';

interface Location {
  city: string;
  district?: string;
  coordinates?: { lat: number; lng: number };
}

interface AdvancedLocationSelectorProps {
  onLocationChange: (location: Location) => void;
  showDeliveryCalculator?: boolean;
  className?: string;
}

const moroccanCities = [
  {
    name: 'Casablanca',
    districts: ['Anfa', 'Maarif', 'Gauthier', 'Bourgogne', 'Hay Hassani', 'Sidi Bernoussi', 'Ain Sebaa'],
    coordinates: { lat: 33.5731, lng: -7.5898 }
  },
  {
    name: 'Rabat',
    districts: ['Agdal', 'Hassan', 'Medina', 'Souissi', 'Hay Riad', 'Temara', 'Sale'],
    coordinates: { lat: 34.0209, lng: -6.8416 }
  },
  {
    name: 'Marrakech',
    districts: ['Medina', 'Gueliz', 'Hivernage', 'Majorelle', 'Targa', 'Daoudiate'],
    coordinates: { lat: 31.6295, lng: -7.9811 }
  },
  {
    name: 'Fès',
    districts: ['Medina', 'Ville Nouvelle', 'Zouagha', 'Atlas', 'Bensouda', 'Narjiss'],
    coordinates: { lat: 34.0181, lng: -5.0078 }
  },
  {
    name: 'Tanger',
    districts: ['Medina', 'Malabata', 'Boukhalef', 'Gzenaya', 'Charf', 'Mesnana'],
    coordinates: { lat: 35.7595, lng: -5.8340 }
  },
  {
    name: 'Agadir',
    districts: ['Centre', 'Talborjt', 'Hay Mohammadi', 'Anza', 'Inezgane', 'Dcheira'],
    coordinates: { lat: 30.4278, lng: -9.5981 }
  },
  {
    name: 'Meknès',
    districts: ['Medina', 'Ville Nouvelle', 'Hamria', 'Toulal', 'Riad', 'Ouislane'],
    coordinates: { lat: 33.8935, lng: -5.5473 }
  },
  {
    name: 'Oujda',
    districts: ['Centre', 'Sidi Maafa', 'Lazaret', 'Angad', 'Hay Qods', 'Hay Hassani'],
    coordinates: { lat: 34.6814, lng: -1.9086 }
  }
];

const AdvancedLocationSelector: React.FC<AdvancedLocationSelectorProps> = ({
  onLocationChange,
  showDeliveryCalculator = false,
  className = ""
}) => {
  const { t } = useLanguage();
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [deliveryDistance, setDeliveryDistance] = useState<number | null>(null);
  const [deliveryCost, setDeliveryCost] = useState<number | null>(null);

  const selectedCityData = moroccanCities.find(city => city.name === selectedCity);

  useEffect(() => {
    if (selectedCity) {
      const location: Location = {
        city: selectedCity,
        district: selectedDistrict || undefined,
        coordinates: selectedCityData?.coordinates
      };
      setCurrentLocation(location);
      onLocationChange(location);
    }
  }, [selectedCity, selectedDistrict, selectedCityData, onLocationChange]);

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          // Trouver la ville la plus proche (simulation)
          const distances = moroccanCities.map(city => ({
            ...city,
            distance: Math.sqrt(
              Math.pow(city.coordinates.lat - latitude, 2) + 
              Math.pow(city.coordinates.lng - longitude, 2)
            )
          }));
          
          const nearestCity = distances.reduce((prev, current) => 
            prev.distance < current.distance ? prev : current
          );
          
          setSelectedCity(nearestCity.name);
          setIsGettingLocation(false);
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
          setIsGettingLocation(false);
        }
      );
    } else {
      setIsGettingLocation(false);
    }
  };

  const calculateDelivery = (fromCity: string, toCity: string) => {
    // Simulation du calcul de distance et coût de livraison
    const fromCityData = moroccanCities.find(city => city.name === fromCity);
    const toCityData = moroccanCities.find(city => city.name === toCity);
    
    if (fromCityData && toCityData) {
      const distance = Math.sqrt(
        Math.pow(fromCityData.coordinates.lat - toCityData.coordinates.lat, 2) + 
        Math.pow(fromCityData.coordinates.lng - toCityData.coordinates.lng, 2)
      ) * 111; // Approximation en km
      
      let cost = 0;
      if (distance < 50) cost = 25; // Livraison locale
      else if (distance < 200) cost = 50; // Livraison régionale
      else cost = 80; // Livraison nationale
      
      setDeliveryDistance(Math.round(distance));
      setDeliveryCost(cost);
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Sélection de localisation
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Bouton de géolocalisation automatique */}
        <Button
          variant="outline"
          onClick={getCurrentLocation}
          disabled={isGettingLocation}
          className="w-full"
        >
          <Navigation className="h-4 w-4 mr-2" />
          {isGettingLocation ? 'Localisation...' : 'Utiliser ma position actuelle'}
        </Button>

        {/* Sélection manuelle de ville */}
        <div className="space-y-2">
          <Label htmlFor="city">Ville</Label>
          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionnez une ville" />
            </SelectTrigger>
            <SelectContent>
              {moroccanCities.map((city) => (
                <SelectItem key={city.name} value={city.name}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Sélection de quartier */}
        {selectedCityData && (
          <div className="space-y-2">
            <Label htmlFor="district">Quartier (optionnel)</Label>
            <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez un quartier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tous les quartiers</SelectItem>
                {selectedCityData.districts.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Affichage de la localisation actuelle */}
        {currentLocation && (
          <div className="p-3 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium text-secondary">Localisation sélectionnée</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{currentLocation.city}</Badge>
              {currentLocation.district && (
                <Badge variant="outline">{currentLocation.district}</Badge>
              )}
            </div>
          </div>
        )}

        {/* Calculateur de livraison */}
        {showDeliveryCalculator && selectedCity && (
          <div className="space-y-3 p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <Calculator className="h-4 w-4" />
              <span className="font-medium">Calculateur de livraison</span>
            </div>
            
            <div className="space-y-2">
              <Label>Calculer depuis</Label>
              <Select onValueChange={(value) => calculateDelivery(value, selectedCity)}>
                <SelectTrigger>
                  <SelectValue placeholder="Ville d'expédition" />
                </SelectTrigger>
                <SelectContent>
                  {moroccanCities.map((city) => (
                    <SelectItem key={city.name} value={city.name}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {deliveryDistance && deliveryCost && (
              <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                <div>
                  <p className="text-sm text-green-700">Distance: ~{deliveryDistance} km</p>
                  <p className="text-sm font-medium text-green-800">Coût: {deliveryCost} DH</p>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  {deliveryCost <= 25 ? 'Local' : deliveryCost <= 50 ? 'Régional' : 'National'}
                </Badge>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdvancedLocationSelector;