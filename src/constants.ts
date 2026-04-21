import { PricingRule, ProductType, Driver } from './types';

export const CONTACT_INFO = {
  phone: '951244467',
  whatsapp: '934505723',
  facebook: 'www.facebook.com/profile.php?id=61578603071266',
  email: 'MetengExpress@gmail.com',
  address: 'Luanda, Angola (Sede Central)',
  mapsUrl: 'https://maps.app.goo.gl/8bnTFVBjdVWJKcBDA',
};

export const PRICING_RULES: Record<ProductType, PricingRule> = {
  small: {
    basePrice: 2000,
    maxDistanceKm: 5,
    perKmExtra: 500,
  },
  medium: {
    basePrice: 5000,
    maxDistanceKm: 5,
    perKmExtra: 1000,
  },
  large: {
    basePrice: 10000,
    maxDistanceKm: 5,
    perKmExtra: 2000,
  },
  special: {
    basePrice: 15000,
    maxDistanceKm: 5,
    perKmExtra: 3000,
  },
};

export const URGENCY_MULTIPLIER = {
  normal: 1,
  express: 1.5,
  urgent: 2.0,
};

export const CARGO_MODIFIER = {
  normal: 1,
  fragile: 1.2,
  special: 1.5,
};

export const MOCK_DRIVERS: Driver[] = [
  {
    id: 'D001',
    name: 'Fernando Bongo',
    photo: 'https://picsum.photos/seed/driver1/200/200',
    email: 'fernando.bongo@meteng.com',
    phone: '951244467',
    address: 'Mutamba, Luanda',
    rating: 4.9,
    vehicle: {
      type: 'carrinha',
      model: 'Toyota Hilux 2024',
      plate: 'LD-44-88-AF',
      color: 'Branco',
      condition: 'Excelente (Novo)',
    }
  },
  {
    id: 'D002',
    name: 'António Kwanzã',
    photo: 'https://picsum.photos/seed/driver2/200/200',
    email: 'antonio.k@meteng.com',
    phone: '934505723',
    address: 'Viana, Luanda',
    rating: 4.7,
    vehicle: {
      type: 'camiao',
      model: 'Mitsubishi Fuso',
      plate: 'LD-12-99-XC',
      color: 'Azul Meteng',
      condition: 'Bom (Manutenção em dia)',
    }
  },
  {
    id: 'D003',
    name: 'Maria Elite',
    photo: 'https://picsum.photos/seed/driver3/200/200',
    email: 'maria.elite@meteng.com',
    phone: '921345678',
    address: 'Talatona, Luanda',
    rating: 5.0,
    vehicle: {
      type: 'carro',
      model: 'Hyundai Tucson',
      plate: 'LD-00-00-EL',
      color: 'Preto',
      condition: 'Impecável',
    }
  }
];

export const calculatePrice = (
  type: ProductType,
  distance: number,
  urgency: 'normal' | 'express' | 'urgent',
  cargo: 'normal' | 'fragile' | 'special' = 'normal'
): number => {
  const rule = PRICING_RULES[type];
  let price = rule.basePrice;

  if (distance > rule.maxDistanceKm) {
    const extraKm = Math.ceil(distance - rule.maxDistanceKm);
    price += extraKm * rule.perKmExtra;
  }

  const baseResult = price * URGENCY_MULTIPLIER[urgency];
  return baseResult * CARGO_MODIFIER[cargo];
};
