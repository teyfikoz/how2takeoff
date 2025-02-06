// Carbon emissions calculation utilities

export interface CarbonEmissionParams {
  distance: number;
  unit: 'miles' | 'kilometers';
  passengers: number;
  aircraftType: string;
}

export interface CarbonOffsetParams extends CarbonEmissionParams {
  offsetPricePerTon: number; // Price in USD per ton of CO2
}

const KM_TO_MILES = 0.621371;
const MILES_TO_KM = 1 / KM_TO_MILES;

// Updated aircraft efficiency data from database
export const AIRCRAFT_EFFICIENCY: Record<string, {
  fuelBurnPer100kmSeat: number;
  co2EmissionFactor: number;
  fuelEfficiency: number;
  operatingCostPerHour: number;
  turnaroundTime: number;
}> = {
  'Boeing 737-800': {
    fuelBurnPer100kmSeat: 2.4,
    co2EmissionFactor: 2.5,
    fuelEfficiency: 0.024,
    operatingCostPerHour: 3200,
    turnaroundTime: 35
  },
  'Airbus A320': {
    fuelBurnPer100kmSeat: 2.4,
    co2EmissionFactor: 2.5,
    fuelEfficiency: 0.024,
    operatingCostPerHour: 5000,
    turnaroundTime: 40
  },
  'Boeing 787-9': {
    fuelBurnPer100kmSeat: 2.3,
    co2EmissionFactor: 2.5,
    fuelEfficiency: 0.023,
    operatingCostPerHour: 7000,
    turnaroundTime: 50
  },
  'Airbus A350': {
    fuelBurnPer100kmSeat: 2.2,
    co2EmissionFactor: 2.5,
    fuelEfficiency: 0.022,
    operatingCostPerHour: 6800,
    turnaroundTime: 60
  },
  'Regional Jet': {
    fuelBurnPer100kmSeat: 1.8,
    co2EmissionFactor: 2.5,
    fuelEfficiency: 0.018,
    operatingCostPerHour: 2800,
    turnaroundTime: 25
  }
};

export const calculateCarbonEmissions = (params: CarbonEmissionParams): number => {
  const { distance, unit, passengers, aircraftType } = params;
  const aircraft = AIRCRAFT_EFFICIENCY[aircraftType];

  if (!aircraft) {
    throw new Error('Invalid aircraft type');
  }

  // Convert distance to kilometers for calculation
  const distanceInKm = unit === 'miles' ? distance * MILES_TO_KM : distance;

  // Calculate fuel consumption based on aircraft efficiency
  const fuelConsumption = (distanceInKm / 100) * aircraft.fuelBurnPer100kmSeat * passengers;

  // Calculate CO2 emissions using the aircraft's emission factor
  return fuelConsumption * aircraft.co2EmissionFactor;
};

export const calculateOffsetCredits = (params: CarbonOffsetParams): number => {
  const emissions = calculateCarbonEmissions(params);
  // Convert kg to metric tons
  const emissionsInTons = emissions / 1000;
  return emissionsInTons * params.offsetPricePerTon;
};

// Calculate environmental impact score (0-100)
export const calculateEnvironmentalScore = (params: CarbonEmissionParams): number => {
  const emissionsPerPassenger = calculateCarbonEmissions(params) / params.passengers;

  // Benchmark values (in kg CO2 per passenger)
  const bestCase = 50; // Very efficient flight
  const worstCase = 200; // Very inefficient flight

  // Convert to 0-100 scale (inverted - lower emissions = higher score)
  const score = 100 - (((emissionsPerPassenger - bestCase) / (worstCase - bestCase)) * 100);
  return Math.max(0, Math.min(100, score));
};