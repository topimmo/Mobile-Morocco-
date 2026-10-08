import React, { createContext, useContext, useState } from 'react';

interface LocationContextType {
  selectedCity: string;
  selectedNeighborhood: string;
  setSelectedCity: (city: string) => void;
  setSelectedNeighborhood: (neighborhood: string) => void;
  cities: string[];
  neighborhoods: { [key: string]: string[] };
  calculateDistance: (lat1: number, lon1: number, lat2: number, lon2: number) => number;
}

const moroccanCities = [
  'Casablanca', 'Rabat', 'Fès', 'Marrakech', 'Agadir', 'Tanger', 'Meknès', 'Oujda',
  'Kenitra', 'Tétouan', 'Safi', 'Mohammedia', 'Khouribga', 'Beni Mellal', 'El Jadida',
  'Nador', 'Taza', 'Settat', 'Berrechid', 'Khemisset', 'Inezgane', 'Ksar El Kebir',
  'Larache', 'Guelmim', 'Berkane', 'Taourirt', 'Bouskoura', 'Fquih Ben Salah',
  'Dcheira El Jihadia', 'Oued Zem'
];

const neighborhoods = {
  'Casablanca': [
    'Maarif', 'Gauthier', 'Racine', 'Bourgogne', 'Palmier', 'Anfa', 'Ain Diab',
    'Hay Hassani', 'Derb Ghallef', 'Sidi Bernoussi', 'Ain Sebaa', 'Mohammedia',
    'Bouskoura', 'Nouaceur', 'Mediouna', 'Dar Bouazza'
  ],
  'Rabat': [
    'Agdal', 'Hassan', 'Hay Riad', 'Souissi', 'Yacoub El Mansour', 'Takaddoum',
    'Hay Nahda', 'Aviation', 'Diour Jamaa', 'Akkari', 'Temara', 'Salé'
  ],
  'Marrakech': [
    'Medina', 'Gueliz', 'Hivernage', 'Majorelle', 'Semlalia', 'Daoudiate',
    'Hay Targa', 'Massira', 'Amerchich', 'Sidi Youssef Ben Ali'
  ],
  'Fès': [
    'Medina', 'Ville Nouvelle', 'Zouagha', 'Atlas', 'Saiss', 'Bensouda',
    'Hay Anas', 'Narjiss', 'Ain Kadous'
  ],
  'Tanger': [
    'Centre Ville', 'Malabata', 'California', 'Boukhalef', 'Gzenaya',
    'Hay Hassani', 'Mesnana', 'Charf'
  ],
  'Agadir': [
    'Centre', 'Talborjt', 'Hay Mohammadi', 'Anza', 'Inezgane',
    'Dcheira', 'Ait Melloul', 'Drarga'
  ]
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState<string>('');

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return (
    <LocationContext.Provider value={{
      selectedCity,
      selectedNeighborhood,
      setSelectedCity,
      setSelectedNeighborhood,
      cities: moroccanCities,
      neighborhoods,
      calculateDistance
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};