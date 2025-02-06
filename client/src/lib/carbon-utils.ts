// Carbon emissions calculation utilities

export interface CarbonEmissionParams {
  distance: number;
  unit: 'miles' | 'kilometers';
  passengers: number;
  fuelEfficiency: number; // liters per 100km
}

export interface CarbonOffsetParams extends CarbonEmissionParams {
  offsetPricePerTon: number; // Price in USD per ton of CO2
}

const KM_TO_MILES = 0.621371;
const MILES_TO_KM = 1 / KM_TO_MILES;

// CO2 emissions per liter of jet fuel (in kg)
const CO2_PER_LITER = 2.5;

export const calculateCarbonEmissions = (params: CarbonEmissionParams): number => {
  const { distance, unit, passengers, fuelEfficiency } = params;
  
  // Convert distance to kilometers for calculation
  const distanceInKm = unit === 'miles' ? distance * MILES_TO_KM : distance;
  
  // Calculate total fuel consumption
  const fuelConsumption = (distanceInKm / 100) * fuelEfficiency;
  
  // Calculate total CO2 emissions in kg
  const totalEmissions = fuelConsumption * CO2_PER_LITER;
  
  // Calculate per passenger emissions
  return totalEmissions / passengers;
};

export const calculateOffsetCredits = (params: CarbonOffsetParams): number => {
  const emissions = calculateCarbonEmissions(params);
  // Convert kg to metric tons
  const emissionsInTons = emissions / 1000;
  return emissionsInTons * params.offsetPricePerTon;
};

// Predefined aircraft efficiency data (liters per 100km)
export const AIRCRAFT_EFFICIENCY: Record<string, number> = {
  'Boeing 737-800': 2.9,
  'Airbus A320': 2.7,
  'Boeing 787-9': 3.2,
  'Airbus A350': 3.0,
  'Regional Jet': 3.5
};

// Calculate total environmental impact score (0-100)
export const calculateEnvironmentalScore = (params: CarbonEmissionParams): number => {
  const emissionsPerPassenger = calculateCarbonEmissions(params);
  
  // Benchmark values (in kg CO2 per passenger)
  const bestCase = 50; // Very efficient flight
  const worstCase = 200; // Very inefficient flight
  
  // Convert to 0-100 scale (inverted - lower emissions = higher score)
  const score = 100 - (((emissionsPerPassenger - bestCase) / (worstCase - bestCase)) * 100);
  return Math.max(0, Math.min(100, score));
};
