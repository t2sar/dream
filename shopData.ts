import { ShopItem, ShopItemCategory, ShopItemTier } from './types';

// The Economy Pricing Matrix (Rebalanced for 120-Day challenging model, x20)
const PRICING_MATRIX = {
  1: { minPrice: 4000, maxPrice: 7500, unlockLevel: 1 },
  2: { minPrice: 10000, maxPrice: 20000, unlockLevel: 5 },
  3: { minPrice: 60000, maxPrice: 125000, unlockLevel: 15 }
};

const CATEGORY_MULTIPLIERS: Record<ShopItemCategory, number> = {
  pot: 0.8,
  decoration: 1.0,
  boost: 1.2,
  fence: 1.5,
  seed: 1.0, 
  seasonal: 1.8,
  background: 2.0
};

// Deterministic pricing and level calculation
function applyPricingEngine(item: Omit<ShopItem, 'price' | 'requiredLevel'> & { price?: number, requiredLevel?: number }): ShopItem {
  // Hardcoded premium exceptions
  if (item.id === 'bg_default') {
    return { ...item, price: 0, requiredLevel: 1, tier: 1 };
  }
  if (item.id === 'dec_nakshi_kantha') {
     return { ...item, price: 60000, requiredLevel: 15, tier: 3 };
  }
  if (item.id === 'bg_zamindar_palace') {
     return { ...item, price: 90000, requiredLevel: 25, tier: 3 };
  }
  if (item.id === 'dec_golden_rickshaw') {
     return { ...item, price: 125000, requiredLevel: 35, tier: 3 };
  }
  if (item.price !== undefined) {
     return { ...item, price: item.price, requiredLevel: item.requiredLevel || 1 } as ShopItem;
  }

  const tier: ShopItemTier = item.tier || 1;
  const config = PRICING_MATRIX[tier];
  
  // Create deterministic pseudo-random variation based on item ID
  let hash = 0;
  for (let i = 0; i < item.id.length; i++) hash = (Math.imul(31, hash) + item.id.charCodeAt(i)) | 0;
  const variation = (Math.abs(hash) % 100) / 100; // 0.0 to 1.0
  
  // Base calculation applying category multiplier
  const baseAvg = (config.minPrice + config.maxPrice) / 2;
  let calculatedPrice = baseAvg * CATEGORY_MULTIPLIERS[item.type];
  
  // Add variation
  calculatedPrice = calculatedPrice * (0.8 + (variation * 0.4)); // +/- 20%
  
  // Round to nearest 10
  calculatedPrice = Math.round(calculatedPrice / 10) * 10;
  
  // Clamp to tier boundaries
  calculatedPrice = Math.max(config.minPrice, Math.min(config.maxPrice, calculatedPrice));

  const reqLevel = item.requiredLevel ?? config.unlockLevel;

  return {
    ...item,
    price: calculatedPrice,
    requiredLevel: reqLevel
  };
}

const RAW_SHOP_ITEMS: (Omit<ShopItem, 'price' | 'requiredLevel'> & { price?: number, requiredLevel?: number })[] = [
  {
    id: 'bg_default',
    name: 'Default Green Garden',
    type: 'background',
    description: 'The standard green garden.',
    iconName: 'Layout',
    tier: 1
  },
  {
    id: 'pot_clay_basic',
    name: 'Basic Clay Pot',
    type: 'pot',
    description: 'A simple, traditional clay pot.',
    iconName: 'PackageOpen',
    tier: 1
  },
  {
    id: 'pot_clay_colorful',
    name: 'Colorful Clay Pot',
    type: 'pot',
    description: 'A painted pot inspired by local art.',
    iconName: 'Package',
    tier: 1
  },
  {
    id: 'pot_bamboo_basket',
    name: 'Bamboo Basket Pot',
    type: 'pot',
    description: 'A traditional woven bamboo basket.',
    iconName: 'Archive',
    tier: 1
  },
  {
    id: 'pot_rooftop_tub',
    name: 'Rooftop Tub',
    type: 'pot',
    description: 'A common half-drum rooftop tub.',
    iconName: 'Database',
    tier: 1
  },
  {
    id: 'fence_bamboo',
    name: 'Bamboo Fence',
    type: 'fence',
    description: 'A traditional bamboo fence for your garden.',
    iconName: 'AlignJustify',
    tier: 2
  },
  {
    id: 'fence_wooden',
    name: 'Wooden Fence',
    type: 'fence',
    description: 'A sturdier border fence for the garden.',
    iconName: 'AlignJustify',
    tier: 2
  },
  {
    id: 'fence_clay_wall',
    name: 'Clay Wall Border',
    type: 'fence',
    description: 'A low earthen wall border around the plot.',
    iconName: 'Square',
    tier: 2
  },
  {
    id: 'dec_fruit_basket',
    name: 'Fruit Basket',
    type: 'decoration',
    description: 'A woven basket for your harvest.',
    iconName: 'ShoppingBasket',
    tier: 1
  },
  {
    id: 'dec_mango_basket',
    name: 'Mango Basket',
    type: 'decoration',
    description: 'A basket full of ripe mangos.',
    iconName: 'Apple',
    tier: 1
  },
  {
    id: 'dec_butterfly',
    name: 'Butterfly',
    type: 'decoration',
    description: 'A colorful butterfly visiting your garden.',
    iconName: 'Feather',
    tier: 1
  },
  {
    id: 'dec_bird',
    name: 'Bird',
    type: 'decoration',
    description: 'A small cheerful bird.',
    iconName: 'Twitter',
    tier: 1
  },
  {
    id: 'dec_small_pond',
    name: 'Small Pond',
    type: 'decoration',
    description: 'A small tranquil pond with water lilies.',
    iconName: 'Droplet',
    tier: 2
  },
  {
    id: 'dec_clay_lamp',
    name: 'Clay Lamp',
    type: 'decoration',
    description: 'A glowing traditional matir prodip.',
    iconName: 'Sun',
    tier: 1
  },
  {
    id: 'dec_rickshaw_sign',
    name: 'Rickshaw Art Sign',
    type: 'decoration',
    description: 'A colorful rickshaw art signboard.',
    iconName: 'Camera',
    tier: 2
  },
  {
    id: 'dec_kolshi',
    name: 'Kolshi Water Pot',
    type: 'decoration',
    description: 'A rounded pitcher for carrying water.',
    iconName: 'Coffee',
    tier: 1
  },
  {
    id: 'bg_rooftop',
    name: 'Rooftop Garden',
    type: 'background',
    description: 'A beautiful city rooftop garden background.',
    iconName: 'Building',
    tier: 3
  },
  {
    id: 'bg_village',
    name: 'Village Garden',
    type: 'background',
    description: 'A peaceful village garden background.',
    iconName: 'Home',
    tier: 3
  },
  {
    id: 'bg_morning_sun',
    name: 'Morning Sun Garden',
    type: 'background',
    description: 'A warm sunrise illuminating the garden.',
    iconName: 'Sun',
    tier: 3
  },
  {
    id: 'bg_monsoon',
    name: 'Monsoon Garden',
    type: 'background',
    description: 'A lush garden during the rainy season.',
    iconName: 'CloudRain',
    tier: 3
  },
  {
    id: 'seasonal_boishakh',
    name: 'Boishakh Banner',
    type: 'seasonal',
    description: 'A festive red and white banner.',
    iconName: 'Flag',
    tier: 2
  },
  {
    id: 'seasonal_eid_lights',
    name: 'Eid Lights',
    type: 'seasonal',
    description: 'Sparkling festive lights.',
    iconName: 'Zap',
    tier: 2
  },
  {
    id: 'seasonal_ramadan_lantern',
    name: 'Ramadan Lantern',
    type: 'seasonal',
    description: 'A beautiful crescent lantern.',
    iconName: 'Moon',
    tier: 2
  },
  {
    id: 'seasonal_rain_cloud',
    name: 'Rain Cloud',
    type: 'seasonal',
    description: 'A small shower cloud hovering above.',
    iconName: 'CloudRain',
    tier: 2
  },
  {
    id: 'seasonal_winter_sun',
    name: 'Winter Sun',
    type: 'seasonal',
    description: 'A gentle, warm winter sun.',
    iconName: 'Sun',
    tier: 2
  },
  {
    id: 'boost_fertilizer',
    name: 'Fertilizer',
    type: 'boost',
    description: '+20 Plant XP to one plant. (Cap: 3, 1/day)',
    iconName: 'Sprout',
    isConsumable: true,
    maxCapacity: 3,
    cooldownHours: 24,
    tier: 2
  },
  {
    id: 'boost_sunlight',
    name: 'Sunlight Boost',
    type: 'boost',
    description: '+10 Bonus XP on next habit completion. (Cap: 3, 1/day)',
    iconName: 'Sun',
    isConsumable: true,
    maxCapacity: 3,
    cooldownHours: 24,
    tier: 2
  },
  {
    id: 'boost_rain',
    name: 'Rain Boost',
    type: 'boost',
    description: 'Restores +10 health to all plants today. (Cap: 2, 1/48hrs)',
    iconName: 'CloudRain',
    isConsumable: true,
    maxCapacity: 2,
    cooldownHours: 48,
    tier: 2
  },
  {
    id: 'boost_recovery_water',
    name: 'Recovery Water',
    type: 'boost',
    description: 'Adds +20 health to a wilting or critical plant.',
    iconName: 'Droplets',
    isConsumable: true,
    tier: 2
  },
  {
    id: 'item_streak_freeze',
    name: 'Streak Freeze',
    type: 'boost',
    description: "Protects your garden's streak for one full day of missed habits.",
    price: 1500,
    iconName: 'Snowflake',
    isConsumable: true,
    maxCapacity: 2,
    tier: 3
  },
  {
    id: 'boost_streak_repair',
    name: 'Streak Repair',
    type: 'boost',
    description: 'Retroactively restore a broken streak within the last 3 days.',
    iconName: 'Wrench',
    isConsumable: true,
    tier: 2
  },
  {
    id: 'dec_nakshi_kantha',
    name: 'Embroidered Nakshi Kantha Mat',
    type: 'decoration',
    description: 'A beautiful traditional embroidered mat for the garden. Requires Level 15.',
    iconName: 'Box',
    tier: 3
  },
  {
    id: 'bg_zamindar_palace',
    name: 'Zamindar Palace Rooftop',
    type: 'background',
    description: 'A majestic historical palace rooftop view. Requires Level 25.',
    iconName: 'Building',
    requiredLevel: 25,
    tier: 3
  },
  {
    id: 'dec_golden_rickshaw',
    name: 'Golden Rickshaw Art Sign',
    type: 'decoration',
    description: 'A premium golden rickshaw art sign. Requires Level 35.',
    iconName: 'Star',
    requiredLevel: 35,
    tier: 3
  }
];

export const BASE_SHOP_ITEMS: ShopItem[] = RAW_SHOP_ITEMS.map(applyPricingEngine);

import { PLANTS } from './plants';

export const SEED_SHOP_ITEMS: ShopItem[] = PLANTS.map(plant => {
  let tier: ShopItemTier = 1;
  let price = 6000; // base generic
  
  if (plant.unlockStreak <= 10) {
    tier = 1;
  } else if (plant.unlockStreak <= 24) {
    tier = 2;
  } else {
    tier = 3;
  }

  // deterministic price based on string
  let hash = 0;
  for (let i = 0; i < plant.type.length; i++) hash = (Math.imul(31, hash) + plant.type.charCodeAt(i)) | 0;
  const variation = (Math.abs(hash) % 100) / 100;

  if (tier === 1) price = 4000 + variation * 4000; // 4000-8000
  else if (tier === 2) price = 10000 + variation * 10000; // 10000-20000
  else price = 30000 + variation * 20000; // 30000-50000

  price = Math.round(price / 10) * 10;

  return {
    id: `seed_${plant.type}`,
    name: `${plant.englishName} Seed`,
    type: 'seed',
    description: plant.description,
    price: price,
    iconName: 'Leaf',
    isConsumable: false,
    requiredLevel: plant.unlockStreak, // Unlock depends on streak locally, seeds are always "visible" or require their unlock Streak
    tier: tier
  } as ShopItem;
});

export const SHOP_ITEMS: ShopItem[] = [...BASE_SHOP_ITEMS, ...SEED_SHOP_ITEMS];
