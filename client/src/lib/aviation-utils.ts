// Aviation calculation utilities

// Route Optimization
export const calculateFuelConsumption = (
  distance: number,
  aircraftType: string,
  payload: number
): number => {
  // Simplified fuel consumption calculation
  const baseConsumption = {
    'narrow-body': 0.033, // kg per seat per km
    'wide-body': 0.039,
    'regional': 0.029
  };
  
  const consumption = baseConsumption[aircraftType as keyof typeof baseConsumption] || 0.035;
  return distance * consumption * payload;
};

// Emissions Calculations
export const calculateCO2Emissions = (fuelConsumption: number): number => {
  const CO2_PER_KG_FUEL = 3.16; // kg CO2 per kg fuel
  return fuelConsumption * CO2_PER_KG_FUEL;
};

export const calculateCarbonFootprint = (
  distance: number,
  passengerCount: number,
  aircraftType: string
): number => {
  const fuelConsumption = calculateFuelConsumption(distance, aircraftType, passengerCount);
  return calculateCO2Emissions(fuelConsumption);
};

// Decision Support
export interface RouteDecision {
  route: string;
  score: number;
  recommendation: string;
}

export const analyzeRoute = (
  distance: number,
  demand: number,
  competition: number
): RouteDecision => {
  let score = 0;
  
  // Simple scoring algorithm
  score += demand > 100000 ? 30 : demand > 50000 ? 20 : 10;
  score += distance > 5000 ? 20 : distance > 2000 ? 15 : 10;
  score += competition < 2 ? 30 : competition < 4 ? 20 : 10;

  let recommendation = '';
  if (score >= 70) recommendation = 'Highly recommended route';
  else if (score >= 50) recommendation = 'Consider with caution';
  else recommendation = 'Not recommended at this time';

  return {
    route: `${distance}km route`,
    score,
    recommendation
  };
};

// Data Export Utilities
export const formatExportData = (data: any, format: 'csv' | 'json'): string => {
  if (format === 'csv') {
    // Simple CSV conversion
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map((item: any) => Object.values(item).join(',')).join('\n');
    return `${headers}\n${rows}`;
  }
  return JSON.stringify(data, null, 2);
};
