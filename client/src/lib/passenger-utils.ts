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
  distanceInMiles: number;
  numberOfFlights: number;
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
  // Calculate optimal overbooking level based on no-show rate and desired load factor
  const baseOverbooking = totalSeats * (1 + historicalNoShowRate);
  const targetBookings = totalSeats * desiredLoadFactor;
  return Math.ceil(Math.max(baseOverbooking, targetBookings));
};

export const calculateRASM = (params: RASMParams): number => {
  const { totalRevenue, availableSeats, distanceInMiles, numberOfFlights } = params;
  const totalASM = availableSeats * distanceInMiles * numberOfFlights;
  return totalRevenue / totalASM;
};

export const calculateBreakEvenLoadFactor = (params: BreakEvenParams): number => {
  const { fixedCosts, averageTicketPrice, variableCostPerPassenger, totalSeats } = params;
  // Break-even load factor = Fixed Costs / (Total Seats * (Ticket Price - Variable Cost))
  const contributionMarginPerSeat = averageTicketPrice - variableCostPerPassenger;
  const breakEvenPassengers = fixedCosts / contributionMarginPerSeat;
  return (breakEvenPassengers / totalSeats) * 100;
};
