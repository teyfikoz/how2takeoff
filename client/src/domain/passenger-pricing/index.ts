/**
 * Passenger Pricing Domain Module
 * @module domain/passenger-pricing
 */

// ============ TYPES ============

export type TravelPurpose = "business" | "leisure" | "vfr" | "mixed";
export type FareClass = "economy" | "premiumEconomy" | "business" | "first";
export type PriceElasticity = "low" | "medium" | "high";

export interface PassengerDemandRequest {
  originIATA: string;
  destinationIATA: string;
  departureDate: string;
  returnDate?: string;
  departureDay: string;
  departureTime: string;
  currentBookings: number;
  aircraftCapacity: number;
  travelPurpose?: TravelPurpose;
  fareClass?: FareClass;
}

export interface PassengerDemandResponse {
  expectedFinalLoadFactor: number;
  demandTrend: "up" | "flat" | "down";
  confidence: number;
  seasonality: "low" | "shoulder" | "peak";
  travelPurposeMix: {
    business: number;
    leisure: number;
    vfr: number;
  };
  priceElasticity: PriceElasticity;
  _debug?: {
    factors: string[];
  };
}

export interface PassengerPricingRequest {
  originIATA: string;
  destinationIATA: string;
  distance: number;
  fareClass?: FareClass;
  travelPurpose?: TravelPurpose;
  capacityUtilization: number;
  seasonIndex: number;
  daysUntilDeparture: number;
  basePrice: number;
  forecastSignal?: {
    expectedFinalLoadFactor: number;
    demandTrend: "up" | "flat" | "down";
    confidence: number;
  };
}

export interface PassengerPricingResponse {
  aiMultiplier: number;
  confidence: number;
  reasoning: string;
  source: "huggingface" | "rule-based";
  forecastApplied?: boolean;
  forecastBias?: number;
  fareClassMultiplier: number;
  recommendedPrice: number;
  priceRange: {
    min: number;
    max: number;
  };
}

// ============ CONSTANTS ============

export const FARE_CLASS_LABELS: Record<FareClass, string> = {
  economy: "Economy",
  premiumEconomy: "Premium Economy",
  business: "Business",
  first: "First Class",
};

export const FARE_CLASS_MULTIPLIERS: Record<FareClass, number> = {
  economy: 1.0,
  premiumEconomy: 1.45,
  business: 3.5,
  first: 6.0,
};

export const TRAVEL_PURPOSE_LABELS: Record<TravelPurpose, string> = {
  business: "Business",
  leisure: "Leisure",
  vfr: "Visiting Friends & Relatives",
  mixed: "Mixed",
};

export const ELASTICITY_LABELS: Record<PriceElasticity, { label: string; description: string }> = {
  low: { label: "Low", description: "Less price sensitive - can optimize more aggressively" },
  medium: { label: "Medium", description: "Moderate price sensitivity" },
  high: { label: "High", description: "Very price sensitive - careful with increases" },
};

// ============ HELPER FUNCTIONS ============

/**
 * Get season index from seasonality string
 */
export function getSeasonIndex(seasonality: "low" | "shoulder" | "peak"): number {
  switch (seasonality) {
    case "peak": return 1.25;
    case "shoulder": return 1.0;
    case "low": return 0.85;
  }
}

/**
 * Get pricing recommendation label based on multiplier
 */
export function getPricingRecommendation(multiplier: number): "discount" | "standard" | "premium" | "surge" {
  if (multiplier < 0.92) return "discount";
  if (multiplier <= 1.08) return "standard";
  if (multiplier <= 1.25) return "premium";
  return "surge";
}

/**
 * Calculate base ticket price based on distance (simplified model)
 * Uses industry-standard cost per km estimates
 */
export function calculateBaseTicketPrice(distanceKm: number): number {
  // Base pricing model: fixed cost + variable cost per km
  const fixedCost = 50; // Airport fees, handling, etc.
  const variableCostPerKm = 0.08; // Fuel, crew, etc.

  return Math.round(fixedCost + (distanceKm * variableCostPerKm));
}

/**
 * Format price for display
 */
export function formatPrice(price: number, currency: string = "USD"): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
