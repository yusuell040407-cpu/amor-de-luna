import { AntimateriaPackage, PlanType } from './types';

export const STRIPE_PUBLIC_KEY = "pk_test_51Skhw6DBFpLcNWfC7FGnloX7wxSbKiS10v5xRk3RhRmPYUa7yM9OLdnwSgZCYyVqsOB4jURykWmt8HF2FPBikuqm00a2ni2Ilu";

export const PAYMENT_ACCOUNT = "amor.de.luna.mp";

export const LUNAR_GIFTS = [
  { id: 'rose', name: 'Rosa de Cristal', cost: 10, icon: '🌹', effect: 'shine' },
  { id: 'star', name: 'Estrella Fugaz', cost: 25, icon: '💫', effect: 'orbit' },
  { id: 'nebula', name: 'Nebulosa Privada', cost: 50, icon: '🌌', effect: 'nebula' },
  { id: 'heart', name: 'Núcleo de Pulsar', cost: 100, icon: '💖', effect: 'pulse' },
];

export const ANTIMATERIA_PACKAGES: (AntimateriaPackage & { stripeLink: string })[] = [
  { id: 'am_50', amount: 50, price: 49, label: '50 Antimateria', stripeLink: 'https://buy.stripe.com/fZudR8aDV5HGdFkccZ9MY04' },
  { id: 'am_120', amount: 120, price: 99, label: '120 Antimateria', stripeLink: 'https://buy.stripe.com/fZu6oGeUb0nmbxca4R9MY05' },
  { id: 'am_300', amount: 300, price: 199, label: '300 Antimateria', stripeLink: 'https://buy.stripe.com/aFadR827pgmkgRw4Kx9MY06' },
  { id: 'am_700', amount: 700, price: 399, label: '700 Antimateria', stripeLink: 'https://buy.stripe.com/fZu8wOh2j6LKfNsfpb9MY07' },
  { id: 'am_1500', amount: 1500, price: 699, label: '1500 Antimateria', stripeLink: 'https://buy.stripe.com/9B6eVc5jB8TS58O4Kx9MY08' },
];

export const PLANS_CONFIG: Record<string, any> = {
  LUNA_NUEVA: {
    id: 'plan_free',
    name: 'Luna Nueva',
    price: 0,
    features: ['Swipes limitados (10/día)', 'Chats bloqueados', 'Funciones básicas'],
    antimateriaMonthly: 0,
    stripeLink: null
  },
  LUNA_LLENA: {
    id: 'plan_premium_mxn',
    name: 'Luna Llena',
    price: 149,
    features: ['Swipes ilimitados', 'Chat libre', 'Ver quién te vio', '50 Antimateria mensual'],
    antimateriaMonthly: 50,
    stripeLink: 'https://buy.stripe.com/7sY4gy5jBgmk30G5OB9MY01'
  },
  ECLIPSE: {
    id: 'plan_vip_mxn',
    name: 'Eclipse',
    price: 299,
    features: ['Todo Luna Llena', 'Perfil destacado', 'Boost semanal', '150 Antimateria mensual', 'Insignia de oro'],
    antimateriaMonthly: 150,
    stripeLink: 'https://buy.stripe.com/aFa7sKdQ79XWcBg2Cp9MY02'
  },
  ECLIPSE_INFINITO: {
    id: 'plan_vip_anual_mxn',
    name: 'Eclipse Infinito',
    price: 2999,
    features: ['Todo Eclipse (12 meses)', '2000 Antimateria inmediata', 'Ahorro del 20%', 'Soporte prioritario'],
    antimateriaMonthly: 2000,
    stripeLink: 'https://buy.stripe.com/00wfZgdQ79XWfNsa4R9MY03'
  }
};

export const MOCK_PROFILES = [
  {
    id: '1',
    name: 'Alba Estelar',
    age: 24,
    isOnline: true,
    educationSummary: 'Grado en Astrofísica',
    bio: 'Buscando alguien para ver la lluvia de estrellas y compartir una conexión real.',
    avatarUrl: 'https://picsum.photos/seed/alba/400/400',
    coverUrl: 'https://picsum.photos/seed/alba_cover/800/400',
    cornerPhotos: ['https://picsum.photos/200/200?1','https://picsum.photos/200/200?2','https://picsum.photos/200/200?3','https://picsum.photos/200/200?4']
  }
];