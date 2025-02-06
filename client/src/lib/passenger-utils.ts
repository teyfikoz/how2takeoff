// Passenger aviation calculation utilities

export interface LoadFactorParams {
  passengersBooked: number;
  availableSeats: number;
}

export interface OverbookingParams {
  totalSeats: number;
  historicalNoShowRate: number; // as decimal (e.g., 0.05 for 5%)
  desiredLoadFactor: number; // as decimal
}

export interface RASMParams {
  totalRevenue: number;
  availableSeats: number;
  distance: number;
  numberOfFlights: number;
  unit: 'miles' | 'kilometers';
}

export interface CASMParams {
  totalCost: number;
  availableSeats: number;
  distance: number;
  numberOfFlights: number;
  unit: 'miles' | 'kilometers';
}

export interface BreakEvenParams {
  fixedCosts: number;
  averageTicketPrice: number;
  variableCostPerPassenger: number;
  totalSeats: number;
}

export const calculateLoadFactor = (params: LoadFactorParams): number => {
  const { passengersBooked, availableSeats } = params;
  return (passengersBooked / availableSeats) * 100;
};

export const calculateOverbookingLimit = (params: OverbookingParams): number => {
  const { totalSeats, historicalNoShowRate, desiredLoadFactor } = params;

  // Calculate target number of passengers based on desired load factor
  const targetPassengers = Math.ceil(totalSeats * desiredLoadFactor);

  // Calculate how many bookings we need considering the no-show rate
  // Formula: targetPassengers / (1 - noShowRate)
  const recommendedBookings = Math.ceil(targetPassengers / (1 - historicalNoShowRate));

  // Ensure we don't exceed a safe overbooking limit (e.g., 120% of total seats)
  const maxSafeBookings = Math.ceil(totalSeats * 1.2);

  return Math.min(recommendedBookings, maxSafeBookings);
};

const KM_TO_MILES = 0.621371;

export const calculateRASM = (params: RASMParams): number => {
  const { totalRevenue, availableSeats, distance, numberOfFlights, unit } = params;
  const distanceInMiles = unit === 'kilometers' ? distance * KM_TO_MILES : distance;
  const totalASM = availableSeats * distanceInMiles * numberOfFlights;
  return totalRevenue / totalASM;
};

export const calculateCASM = (params: CASMParams): number => {
  const { totalCost, availableSeats, distance, numberOfFlights, unit } = params;
  const distanceInMiles = unit === 'kilometers' ? distance * KM_TO_MILES : distance;
  const totalASM = availableSeats * distanceInMiles * numberOfFlights;
  return totalCost / totalASM;
};

export const calculateBreakEvenLoadFactor = (params: BreakEvenParams): number => {
  const { fixedCosts, averageTicketPrice, variableCostPerPassenger, totalSeats } = params;
  const contributionMarginPerSeat = averageTicketPrice - variableCostPerPassenger;
  const breakEvenPassengers = fixedCosts / contributionMarginPerSeat;
  return (breakEvenPassengers / totalSeats) * 100;
};