export interface Technician {
  id: string;
  name: string;
  city: string;
  services: string[];
  contact: {
    phone?: string;
    email?: string;
    whatsapp?: string;
  };
  portfolio?: string[];
  rating?: number;
  reviewCount?: number;
}
