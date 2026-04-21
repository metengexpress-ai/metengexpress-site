export type ProductType = 'small' | 'medium' | 'large' | 'special';

export type VehicleType = 'carro' | 'carrinha' | 'mota_2' | 'mota_3' | 'camiao';

export interface Driver {
  id: string;
  name: string;
  photo: string;
  email: string;
  phone: string;
  address: string;
  rating: number;
  vehicle: {
    type: VehicleType;
    model: string;
    plate: string;
    color: string;
    condition: string;
  }
}

export interface Order {
  id: string;
  customerName: string;
  phoneNumber: string;
  origin: string;
  destination: string;
  productType: ProductType;
  productImage?: string;
  urgency: 'normal' | 'express' | 'urgent';
  cargoType: 'normal' | 'fragile' | 'special';
  distanceKm: number;
  totalPrice: number;
  status: 'pending' | 'in_progress' | 'delivered';
  createdAt: string;
}

export interface PricingRule {
  basePrice: number;
  maxDistanceKm: number;
  perKmExtra: number;
}
