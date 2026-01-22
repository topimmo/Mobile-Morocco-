import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Search, Filter } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface LocationSelectorProps {
  onLocationSelect?: (location: LocationData) => void;
  showDeliveryEstimate?: boolean;
}

interface LocationData {
  city: string;
  region: string;
  neighborhood?: string;
  coordinates?: { lat: number; lng: number };
  deliveryZone?: string;
}

const moroccanCities = {
  'Casablanca': {
    region: 'Casablanca-Settat',
    neighborhoods: ['Maarif', 'Ain Diab', 'Bourgogne', 'Gauthier', 'Hay Hassani', 'Sidi Bernoussi', 'Derb Ghallef'],
    coordinates: { lat: 33.5731, lng: -7.5898 }
  },
  'Rabat': {
    region: 'Rabat-Salé-Kénitra',
    neighborhoods: ['Agdal', 'Hassan', 'Hay Riad', 'Souissi', 'Yacoub El Mansour', 'Temara'],
    coordinates: { lat: 34.0209, lng: -6.8416 }
  },
  'Marrakech': {
    region: 'Marrakech-Safi',
    neighborhoods: ['Medina', 'Gueliz', 'Hivernage', 'Majorelle', 'Semlalia', 'Daoudiate'],
    coordinates: { lat: 31.6295, lng: -7.9811 }
  },
  'Fès': {
    region: 'Fès-Meknès',
    neighborhoods: ['Medina', 'Ville Nouvelle', 'Bensouda', 'Narjiss', 'Atlas Fès'],
    coordinates: { lat: 34.0181, lng: -5.0078 }
  },
  'Tanger': {
    region: 'Tanger-Tétouan-Al Hoceïma',
    neighborhoods: ['Medina', 'Malabata', 'Boukhalef', 'Charf', 'Mesnana'],
    coordinates: { lat: 35.7595, lng: -5.8340 }
  },
  'Agadir': {
    region: 'Souss-Massa',
    neighborhoods: ['Centre Ville', 'Hay Mohammadi', 'Talborjt', 'Anza', 'Inezgane'],
    coordinates: { lat: 30.4278, lng: -9.5981 }
  },
  'Oujda': {
    region: 'Oriental',
    neighborhoods: ['Centre', 'Hay Qods', 'Hay Hassani', 'Lazaret'],
    coordinates: { lat: 34.6814, lng: -1.9086 }
  },
  'Kenitra': {
    region: 'Rabat-Salé-Kénitra',
    neighborhoods: ['Centre', 'Hay Riad', 'Saknia', 'Maâmora'],
    coordinates: { lat: 34.2610, lng: -6.5802 }
  },
  'Tetouan': {
    region: 'Tanger-Tétouan-Al Hoceïma',
    neighborhoods: ['Medina', 'Ensanche', 'Sania Ramel', 'Hay Saniat Rmel'],
    coordinates: { lat: 35.5889, lng: -5.3626 }
  },
  'Safi': {
    region: 'Marrakech-Safi',
    neighborhoods: ['Medina', 'Hay Mohammadi', 'Hay Salam', 'Biada'],
    coordinates: { lat: 32.2994, lng: -9.2372 }
  }
};

const deliveryZones = {
  'Zone 1': { cities: ['Casablanca', 'Rabat'], cost: 15, time: '24h' },
  'Zone 2': { cities: ['Marrakech', 'Fès', 'Tanger'], cost: 25, time: '48h' },
  'Zone 3': { cities: ['Agadir', 'Oujda', 'Kenitra', 'Tetouan', 'Safi'], cost: 35, time: '72h' }
};

export default function LocationSelector({ onLocationSelect, showDeliveryEstimate = false }: LocationSelectorProps) {
  const { t } = useLanguage();
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filteredCities = Object.keys(moroccanCities).filter(city =>
    city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getDeliveryInfo = (city: string) => {
    for (const [zone, info] of Object.entries(deliveryZones)) {
      if (info.cities.includes(city)) {
        return { zone, ...info };
      }
    }
    return null;
  };

  const handleLocationSelect = () => {
    if (selectedCity) {
      const cityData = moroccanCities[selectedCity];
      const deliveryInfo = getDeliveryInfo(selectedCity);
      
      const locationData: LocationData = {
        city: selectedCity,
        region: cityData.region,
        neighborhood: selectedNeighborhood,
        coordinates: cityData.coordinates,
        deliveryZone: deliveryInfo?.zone
      };

      onLocationSelect?.(locationData);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Simulation de géolocalisation inverse
          const { latitude, longitude } = position.coords;
          
          // Trouver la ville la plus proche (simulation)
          let closestCity = 'Casablanca';
          let minDistance = Infinity;
          
          Object.entries(moroccanCities).forEach(([city, data]) => {
            const distance = Math.sqrt(
              Math.pow(data.coordinates.lat - latitude, 2) + 
              Math.pow(data.coordinates.lng - longitude, 2)
            );
            if (distance < minDistance) {
              minDistance = distance;
              closestCity = city;
            }
          });
          
          setSelectedCity(closestCity);
        },
        (error) => {
          console.error('Erreur de géolocalisation:', error);
        }
      );
    }
  };

  return (
    <div className="bg-white min-h-screen p-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Sélectionner votre localisation
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Recherche et géolocalisation */}
          <div className="space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une ville..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" onClick={getCurrentLocation}>
                <Navigation className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Sélection de ville */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Ville</label>
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir une ville" />
              </SelectTrigger>
              <SelectContent>
                {filteredCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    <div className="flex items-center justify-between w-full">
                      <span>{city}</span>
                      <Badge variant="secondary" className="ml-2 text-xs">
                        {moroccanCities[city].region}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sélection de quartier */}
          {selectedCity && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Quartier (optionnel)</label>
              <Select value={selectedNeighborhood} onValueChange={setSelectedNeighborhood}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un quartier" />
                </SelectTrigger>
                <SelectContent>
                  {moroccanCities[selectedCity].neighborhoods.map((neighborhood) => (
                    <SelectItem key={neighborhood} value={neighborhood}>
                      {neighborhood}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Informations de livraison */}
          {selectedCity && showDeliveryEstimate && (
            <Card className="bg-muted border-muted">
              <CardContent className="pt-4">
                <h4 className="font-medium text-secondary mb-2">Informations de livraison</h4>
                {(() => {
                  const deliveryInfo = getDeliveryInfo(selectedCity);
                  return deliveryInfo ? (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Zone de livraison:</span>
                        <Badge variant="secondary">{deliveryInfo.zone}</Badge>
                      </div>
                      <div className="flex justify-between">
                        <span>Frais de livraison:</span>
                        <span className="font-medium">{deliveryInfo.cost} DH</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Délai estimé:</span>
                        <span className="font-medium">{deliveryInfo.time}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">Informations de livraison non disponibles</p>
                  );
                })()}
              </CardContent>
            </Card>
          )}

          {/* Filtres avancés */}
          {showFilters && (
            <Card className="border-gray-200">
              <CardContent className="pt-4">
                <h4 className="font-medium mb-3">Filtres avancés</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Région</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Toutes les régions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casablanca-settat">Casablanca-Settat</SelectItem>
                        <SelectItem value="rabat-sale-kenitra">Rabat-Salé-Kénitra</SelectItem>
                        <SelectItem value="marrakech-safi">Marrakech-Safi</SelectItem>
                        <SelectItem value="fes-meknes">Fès-Meknès</SelectItem>
                        <SelectItem value="tanger-tetouan">Tanger-Tétouan-Al Hoceïma</SelectItem>
                        <SelectItem value="souss-massa">Souss-Massa</SelectItem>
                        <SelectItem value="oriental">Oriental</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Zone de livraison</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Toutes les zones" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zone1">Zone 1 (15 DH - 24h)</SelectItem>
                        <SelectItem value="zone2">Zone 2 (25 DH - 48h)</SelectItem>
                        <SelectItem value="zone3">Zone 3 (35 DH - 72h)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bouton de confirmation */}
          <Button 
            onClick={handleLocationSelect}
            disabled={!selectedCity}
            className="w-full"
          >
            Confirmer la localisation
          </Button>

          {/* Localisation sélectionnée */}
          {selectedCity && (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Localisation sélectionnée:</p>
              <p className="font-medium">
                {selectedNeighborhood && `${selectedNeighborhood}, `}
                {selectedCity}, {moroccanCities[selectedCity].region}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}