export interface FlightParams {
  distance: number;
  altitude: number;
  payload: number;
  temperature: number;
  windSpeed: number;
}

export function calculateHighFidelity(aircraft: any, params: FlightParams) {
  // Detailed BADA-based calculations
  const { distance, altitude, payload, temperature, windSpeed } = params;
  
  // Calculate segments
  const takeoffFuel = aircraft.baseFuelFlow * 0.2;
  const climbFuel = aircraft.baseFuelFlow * 0.3 * (altitude / 10000);
  
  // Temperature and wind corrections
  const tempCorrection = 1 + ((temperature - 15) * 0.002);
  const windCorrection = 1 - (windSpeed / 100);
  
  // Cruise calculations
  const cruiseFuel = (distance * aircraft.baseFuelFlow / aircraft.cruiseSpeed) * tempCorrection * windCorrection;
  
  // Payload impact
  const payloadFactor = 1 + (payload / aircraft.maxPayload) * 0.1;
  
  const totalFuel = (takeoffFuel + climbFuel + cruiseFuel) * payloadFactor;
  const co2 = totalFuel * 3.16; // CO2 emission factor
  
  return {
    fuelRequired: totalFuel,
    co2Emissions: co2,
    segments: {
      takeoff: takeoffFuel,
      climb: climbFuel,
      cruise: cruiseFuel
    }
  };
}

export function calculateSimplified(aircraft: any, distance: number) {
  // Quadratic regression model
  const a = 0.0001;
  const b = aircraft.fuelEfficiency;
  const c = aircraft.baseFuelFlow * 0.1;
  
  const fuelRequired = (a * distance * distance) + (b * distance) + c;
  const co2 = fuelRequired * 3.16;
  
  return {
    fuelRequired,
    co2Emissions: co2
  };
}
