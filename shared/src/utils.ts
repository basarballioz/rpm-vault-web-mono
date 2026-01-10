import { Motorcycle } from './types';

export const transformMotorcycleData = (data: any): Motorcycle => {
  // Handle Bore x Stroke splitting if not already separate
  let bore = data.Bore;
  let stroke = data.Stroke;
  
  if (!bore && !stroke && data["Bore x stroke"]) {
    const parts = data["Bore x stroke"].split(' x ');
    if (parts.length >= 2) {
      bore = String(parts[0]).trim();
      stroke = String(parts[1]).trim();
      // If unit is only on the second part, we might want to append it to the first, 
      // but for now keeping it simple as the UI might handle units or just display raw strings.
      // "40.0 x 39.7 mm" -> bore="40.0", stroke="39.7 mm"
    }
  }

  return {
    ...data, // Preserve original keys for backward compatibility
    _id: data._id,
    Model: data.Model,
    Year: String(data.Year), // Ensure string
    Category: data.Category,
    Brand: data.Brand,
    Displacement: data.Displacement,
    Power: data.Power,
    EngineType: data["Engine type"],
    TopSpeed: data["Top speed"],
    Rating: data.Rating,
    Torque: data.Torque,
    Bore: bore,
    Stroke: stroke,
    Compression: data.Compression,
    Ignition: data.Ignition,
    ValvesPerCylinder: data["Valves per cylinder"],
    FuelSystem: data["Fuel system"],
    FuelCapacity: data["Fuel capacity"],
    FuelControl: data["Fuel control"],
    CoolingSystem: data["Cooling system"],
    Starter: data.Starter,
    Electrical: data.Electrical,
    Gearbox: data.Gearbox,
    TransmissionType: data["Transmission type"],
    Clutch: data.Clutch,
    FrontBrakes: data["Front brakes"],
    RearBrakes: data["Rear brakes"],
    Diameter: data.Diameter,
    FrontSuspension: data["Front suspension"],
    RearSuspension: data["Rear suspension"],
    FrontWheelTravel: data["Front wheel travel"],
    RearWheelTravel: data["Rear wheel travel"],
    FrontTire: data["Front tire"],
    RearTire: data["Rear tire"],
    FrontWheel: data["Front wheel"],
    RearWheel: data["Rear wheel"],
    Light: data.Light,
    OverallLength: data["Overall length"],
    OverallWidth: data["Overall width"],
    OverallHeight: data["Overall height"],
    Wheelbase: data.Wheelbase,
    SeatHeight: data["Seat height"],
    GroundClearance: data["Ground clearance"],
    DryWeight: data["Dry weight"],
    WetWeight: data["Weight incl. oil, gas, etc"],
    FrameType: data["Frame type"],
    ColorOptions: data["Color options"],
    EngineDetails: data["Engine details"],
    PowerWeightRatio: data["Power/weight ratio"],
    Comments: data.Comments,
  };
};
