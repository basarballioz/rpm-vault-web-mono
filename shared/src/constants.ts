// API endpoints configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || process.env.EXPO_PUBLIC_API_URL,
  ENDPOINTS: {
    BIKES: '/api/bikes',
    BIKE_DETAILS: (id: string) => `/api/bikes/${id}`,
    STATS: '/api/stats',
  },
};

// Common constants
export const CATEGORIES = [
  'Sport',
  'Cruiser', 
  'Adventure',
  'Naked',
  'Touring',
  'Enduro',
  'Scooter',
  'Electric',
] as const;

export const BRANDS = [
  'Honda',
  'Yamaha', 
  'Kawasaki',
  'Suzuki',
  'BMW',
  'Ducati',
  'KTM',
  'Harley-Davidson',
] as const;