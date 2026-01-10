import { z } from 'zod';

// Motorcycle types
export const BikeSchema = z.object({
  id: z.string(),
  brand: z.string(),
  model: z.string(),
  year: z.number(),
  category: z.string(),
  engine_size: z.number(),
  power_hp: z.number(),
  weight_kg: z.number(),
  fuel_capacity: z.number(),
  price_usd: z.number().optional(),
  image_url: z.string().optional(),
  description: z.string().optional(),
});

export type Bike = z.infer<typeof BikeSchema>;

// Stats types
export interface Stats {
  totalBikes: number;
  totalBrands: number;
  totalCategories: number;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Filter types
export interface BikeFilters {
  brand?: string;
  category?: string;
  yearMin?: number;
  yearMax?: number;
  engineSizeMin?: number;
  engineSizeMax?: number;
  priceMin?: number;
  priceMax?: number;
  search?: string;
}

export interface Motorcycle {
  _id: string;
  Model: string;
  Year: string;
  Category: string;
  Brand: string;
  Displacement?: string;
  Power?: string;
  EngineType?: string;
  TopSpeed?: string;
  Rating?: string;
  Torque?: string;
  Bore?: string;
  Stroke?: string;
  Compression?: string;
  Ignition?: string;
  ValvesPerCylinder?: string;
  FuelSystem?: string;
  FuelCapacity?: string;
  FuelControl?: string;
  CoolingSystem?: string;
  Starter?: string;
  Electrical?: string;
  Gearbox?: string;
  TransmissionType?: string;
  Clutch?: string;
  FrontBrakes?: string;
  RearBrakes?: string;
  Diameter?: string;
  FrontSuspension?: string;
  RearSuspension?: string;
  FrontWheelTravel?: string;
  RearWheelTravel?: string;
  FrontTire?: string;
  RearTire?: string;
  FrontWheel?: string;
  RearWheel?: string;
  Light?: string;
  OverallLength?: string;
  OverallWidth?: string;
  OverallHeight?: string;
  Wheelbase?: string;
  SeatHeight?: string;
  GroundClearance?: string;
  DryWeight?: string;
  WetWeight?: string;
  FrameType?: string;
  ColorOptions?: string;
  EngineDetails?: string;
  PowerWeightRatio?: string;
  Comments?: string;
  // Allow for dynamic access if needed, though explicit is better
  [key: string]: any;
}