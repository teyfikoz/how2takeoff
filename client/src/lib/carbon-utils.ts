// Carbon emissions calculation utilities
import { z } from "zod";

export interface CarbonEmissionParams {
  distance: number;
  unit: 'miles' | 'kilometers';
  passengers: number;
  aircraftType: string;
  altitude?: number; // Optional altitude in feet
}

export interface CarbonOffsetParams extends CarbonEmissionParams {
  offsetPricePerTon: number; // Price in USD per ton of CO2
}

const KM_TO_MILES = 0.621371;
const MILES_TO_KM = 1 / KM_TO_MILES;

// Air density calculation constants
const P0 = 101325; // Sea level pressure (Pa)
const T0 = 288.15; // Sea level temperature (K)
const L = 0.0065; // Temperature lapse rate (K/m)
const R = 287.05; // Specific gas constant for dry air (J/kg·K)
const g = 9.80665; // Gravity (m/s²)

// Flight phase factors
const PHASE_FACTORS = {
  takeoff: { time: 0.02, power: 1.2 },
  climb: { dist: 0.15, power: 0.9 },
  cruise: { dist: 0.7, power: 0.65 },
  descent: { dist: 0.12, power: 0.4 },
  landing: { time: 0.04, power: 0.3 }
};

// Updated aircraft efficiency data
export const AIRCRAFT_EFFICIENCY: Record<string, {
  fuelBurnPer100kmSeat: number;
  co2EmissionFactor: number;
  noxEmissionRate: number; // g/kg fuel
  fuelEfficiency: number;
  operatingCostPerHour: number;
  turnaroundTime: number;
  cruiseSpeed: number; // knots
  maxAltitude: number; // feet
}> = {
  'Boeing 777-200ER': {
    fuelBurnPer100kmSeat: 2.8,
    co2EmissionFactor: 3.16,
    noxEmissionRate: 16.0,
    fuelEfficiency: 0.025,
    operatingCostPerHour: 7500,
    turnaroundTime: 60,
    cruiseSpeed: 490,
    maxAltitude: 43100
  },
  'Boeing 787-8': {
    fuelBurnPer100kmSeat: 2.3,
    co2EmissionFactor: 3.16,
    noxEmissionRate: 14.5,
    fuelEfficiency: 0.024,
    operatingCostPerHour: 7000,
    turnaroundTime: 50,
    cruiseSpeed: 488,
    maxAltitude: 43100
  },
  'Airbus A320': {
    fuelBurnPer100kmSeat: 2.4,
    co2EmissionFactor: 3.16,
    noxEmissionRate: 14.8,
    fuelEfficiency: 0.023,
    operatingCostPerHour: 3000,
    turnaroundTime: 40,
    cruiseSpeed: 450,
    maxAltitude: 39000
  },
  'Airbus A350-900': {
    fuelBurnPer100kmSeat: 2.2,
    co2EmissionFactor: 3.16,
    noxEmissionRate: 14.0,
    fuelEfficiency: 0.023,
    operatingCostPerHour: 7200,
    turnaroundTime: 55,
    cruiseSpeed: 487,
    maxAltitude: 43100
  },
  'Airbus A380': {
    fuelBurnPer100kmSeat: 3.0,
    co2EmissionFactor: 3.16,
    noxEmissionRate: 16.5,
    fuelEfficiency: 0.023,
    operatingCostPerHour: 9200,
    turnaroundTime: 90,
    cruiseSpeed: 490,
    maxAltitude: 43000
  },
  'Boeing 737-800': {
    fuelBurnPer100kmSeat: 2.4,
    co2EmissionFactor: 3.16,
    noxEmissionRate: 15.2,
    fuelEfficiency: 0.023,
    operatingCostPerHour: 3200,
    turnaroundTime: 35,
    cruiseSpeed: 470,
    maxAltitude: 41000
  },
  'Airbus A319': {
    fuelBurnPer100kmSeat: 2.5,
    co2EmissionFactor: 3.16,
    noxEmissionRate: 14.9,
    fuelEfficiency: 0.023,
    operatingCostPerHour: 2800,
    turnaroundTime: 35,
    cruiseSpeed: 450,
    maxAltitude: 39000
  },
  'Airbus A321': {
    fuelBurnPer100kmSeat: 2.3,
    co2EmissionFactor: 3.16,
    noxEmissionRate: 14.7,
    fuelEfficiency: 0.023,
    operatingCostPerHour: 3400,
    turnaroundTime: 45,
    cruiseSpeed: 450,
    maxAltitude: 39000
  },
  'Boeing 747-8': {
    fuelBurnPer100kmSeat: 3.1,
    co2EmissionFactor: 3.16,
    noxEmissionRate: 16.8,
    fuelEfficiency: 0.023,
    operatingCostPerHour: 10000,
    turnaroundTime: 120,
    cruiseSpeed: 492,
    maxAltitude: 43100
  },
  'Embraer E170': {
    fuelBurnPer100kmSeat: 2.7,
    co2EmissionFactor: 3.16,
    noxEmissionRate: 15.0,
    fuelEfficiency: 0.023,
    operatingCostPerHour: 2200,
    turnaroundTime: 30,
    cruiseSpeed: 430,
    maxAltitude: 41000
  }
};

// Calculate air density at given altitude
const getAirDensity = (altitude: number): number => {
  const altitudeMeters = altitude * 0.3048; // Convert feet to meters
  const temperature = T0 - L * altitudeMeters;
  const pressure = P0 * Math.pow(temperature / T0, g / (R * L));
  return pressure / (R * temperature);
};

// Calculate fuel burn for a specific flight phase
const calculatePhaseFuelBurn = (
  aircraft: typeof AIRCRAFT_EFFICIENCY[keyof typeof AIRCRAFT_EFFICIENCY],
  phase: keyof typeof PHASE_FACTORS,
  distance: number,
  altitude: number
): number => {
  const phaseFactor = PHASE_FACTORS[phase];
  const densityRatio = getAirDensity(altitude) / getAirDensity(0);

  if ('time' in phaseFactor) {
    // Time-based phases (takeoff, landing)
    return aircraft.fuelBurnPer100kmSeat * phaseFactor.power * phaseFactor.time;
  } else {
    // Distance-based phases (climb, cruise, descent)
    const phaseDist = distance * phaseFactor.dist;
    return (aircraft.fuelBurnPer100kmSeat * phaseFactor.power * phaseDist / 100) * densityRatio;
  }
};

export const calculateCarbonEmissions = (params: CarbonEmissionParams) => {
  const { distance, unit, passengers, aircraftType, altitude = 35000 } = params;
  const aircraft = AIRCRAFT_EFFICIENCY[aircraftType];

  if (!aircraft) {
    throw new Error('Invalid aircraft type');
  }

  // Convert distance to kilometers
  const distanceInKm = unit === 'miles' ? distance * MILES_TO_KM : distance;

  // Calculate fuel consumption for each phase
  const phases = ['takeoff', 'climb', 'cruise', 'descent', 'landing'] as const;
  const totalFuelBurn = phases.reduce((total, phase) => 
    total + calculatePhaseFuelBurn(aircraft, phase, distanceInKm, altitude), 0);

  // Calculate emissions
  const emissions = {
    co2: totalFuelBurn * aircraft.co2EmissionFactor * passengers,
    nox: (totalFuelBurn * aircraft.noxEmissionRate / 1000) * (altitude > 35000 ? 1.2 : 1.0) * passengers,
    h2o: totalFuelBurn * 1.23 * passengers // Water vapor emissions
  };

  return emissions;
};

export const calculateOffsetCredits = (params: CarbonOffsetParams): number => {
  const emissions = calculateCarbonEmissions(params);
  // Convert kg to metric tons
  const co2EmissionsInTons = emissions.co2 / 1000;
  return co2EmissionsInTons * params.offsetPricePerTon;
};

// Calculate environmental impact score (0-100)
export const calculateEnvironmentalScore = (params: CarbonEmissionParams): number => {
  const emissions = calculateCarbonEmissions(params);
  const emissionsPerPassenger = emissions.co2 / params.passengers;

  // Updated benchmark values based on ICAO data
  const bestCase = 40; // kg CO2/passenger for most efficient flights
  const worstCase = 250; // kg CO2/passenger for least efficient flights

  const score = 100 - (((emissionsPerPassenger - bestCase) / (worstCase - bestCase)) * 100);
  return Math.max(0, Math.min(100, Math.round(score)));
};

// Helper function to get flight phase descriptions
export const getFlightPhaseInfo = () => ({
  takeoff: {
    name: 'Takeoff',
    description: 'High power phase, typically 2% of total flight time',
    fuelImpact: 'Highest fuel consumption rate'
  },
  climb: {
    name: 'Climb',
    description: 'Ascent to cruise altitude, ~15% of flight distance',
    fuelImpact: 'High fuel consumption due to increasing altitude'
  },
  cruise: {
    name: 'Cruise',
    description: 'Main flight phase, ~70% of flight distance',
    fuelImpact: 'Most efficient phase, optimal fuel consumption'
  },
  descent: {
    name: 'Descent',
    description: 'Controlled descent, ~12% of flight distance',
    fuelImpact: 'Lower fuel consumption due to reduced power'
  },
  landing: {
    name: 'Landing',
    description: 'Final approach and landing, ~4% of total flight time',
    fuelImpact: 'Minimal fuel consumption'
  }
});