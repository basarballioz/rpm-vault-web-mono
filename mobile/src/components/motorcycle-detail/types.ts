export interface Motorcycle {
  _id: string;
  Model: string;
  Year: string;
  Category: string;
  Brand: string;
  Displacement?: string;
  Power?: string;
  'Engine type'?: string;
  'Top speed'?: string;
  Rating?: string;
  Torque?: string;
  'Valves per cylinder'?: string;
  'Fuel system'?: string;
  'Fuel capacity'?: string;
  'Fuel control'?: string;
  'Cooling system'?: string;
  Starter?: string;
  Electrical?: string;
  Gearbox?: string;
  'Transmission type'?: string;
  Clutch?: string;
  'Front brakes'?: string;
  'Rear brakes'?: string;
  Diameter?: string;
  'Front suspension'?: string;
  'Rear suspension'?: string;
  'Front wheel travel'?: string;
  'Rear wheel travel'?: string;
  'Front tire'?: string;
  'Rear tire'?: string;
  Light?: string;
  'Overall length'?: string;
  'Overall width'?: string;
  'Overall height'?: string;
  Wheelbase?: string;
  'Seat height'?: string;
  'Ground clearance'?: string;
  'Dry weight'?: string;
  'Weight incl. oil, gas, etc'?: string;
  'Frame type'?: string;
  'Color options'?: string;
  'Engine details'?: string;
  'Power/weight ratio'?: string;
  [key: string]: any;
}

export const getCategoryEmoji = (category: string): string => {
  switch (category?.toLowerCase()) {
    case 'sport': return '🏁';
    case 'cruiser': return '🛣️';
    case 'adventure': return '🏔️';
    case 'enduro / offroad': return '🏞️';
    case 'scooter': return '🛴';
    case 'touring': return '🗺️';
    case 'naked': return '⚡';
    default: return '🏍️';
  }
};

export const hasDataInSection = (motorcycle: Motorcycle | null, fields: string[]): boolean => {
  if (!motorcycle) return false;
  return fields.some(field => motorcycle[field] && motorcycle[field].toString().trim() !== '');
};
