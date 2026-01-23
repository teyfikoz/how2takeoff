/**
 * Dynamic Pricing Domain Logic
 *
 * Pure, deterministic pricing calculations.
 * AI multiplier is injected externally - this module doesn't know about AI.
 *
 * @module domain/pricing/dynamicPricing
 */

// ============ TYPES ============

export type RouteType = "domestic" | "shortHaul" | "mediumHaul" | "longHaul" | "intercontinental";
export type CargoCategory = "general" | "perishable" | "dangerous" | "valuable" | "express" | "economy";
export type SeasonType = "low" | "shoulder" | "peak";

export interface PricingInput {
  routeType: RouteType;
  cargoCategory: CargoCategory;
  season: SeasonType;
  chargeableWeight: number;
  fuelSurchargePercent: number;
  securitySurcharge: number;
  handlingFee: number;
}

export interface PricingFactors {
  capacityUtilization: number;    // 0-100
  daysUntilDeparture: number;     // booking window
  seasonIndex: number;            // 0.85-1.30 (derived from season)
}

export interface PricingOutput {
  baseRate: number;
  adjustedRate: number;
  baseCharge: number;
  fuelSurcharge: number;
  securityCharge: number;
  handlingFee: number;
  totalCharge: number;
  effectiveRatePerKg: number;
}

export interface AIMultiplierResult {
  multiplier: number;
  confidence: number;
  reasoning?: string;
}

// ============ CONSTANTS ============

export const BASE_RATES: Record<RouteType, { min: number; max: number; typical: number }> = {
  domestic: { min: 0.30, max: 1.50, typical: 0.75 },
  shortHaul: { min: 0.50, max: 2.50, typical: 1.25 },
  mediumHaul: { min: 1.00, max: 3.50, typical: 2.00 },
  longHaul: { min: 1.50, max: 4.50, typical: 2.75 },
  intercontinental: { min: 2.00, max: 5.50, typical: 3.50 },
};

export const CATEGORY_MULTIPLIERS: Record<CargoCategory, number> = {
  economy: 0.85,
  general: 1.00,
  perishable: 1.25,
  dangerous: 1.50,
  valuable: 1.75,
  express: 2.00,
};

export const SEASON_MULTIPLIERS: Record<SeasonType, number> = {
  low: 0.85,
  shoulder: 1.00,
  peak: 1.30,
};

// ============ PURE FUNCTIONS ============

/**
 * Get base rate for a route type
 */
export function getBaseRate(routeType: RouteType): number {
  return BASE_RATES[routeType].typical;
}

/**
 * Get season index (multiplier) from season type
 */
export function getSeasonIndex(season: SeasonType): number {
  return SEASON_MULTIPLIERS[season];
}

/**
 * Calculate rule-based multiplier (deterministic, no AI)
 * This is the fallback when AI is unavailable
 */
export function calculateRuleBasedMultiplier(factors: PricingFactors): number {
  // Capacity factor: higher utilization = higher price
  const capacityFactor = factors.capacityUtilization > 80
    ? 1 + ((factors.capacityUtilization - 80) * 0.02)
    : factors.capacityUtilization < 40
    ? 0.85 + (factors.capacityUtilization * 0.00375)
    : 1.0;

  // Urgency factor: last-minute = premium
  const urgencyFactor = factors.daysUntilDeparture < 3
    ? 1.35
    : factors.daysUntilDeparture < 7
    ? 1.15
    : factors.daysUntilDeparture > 30
    ? 0.90
    : 1.0;

  return capacityFactor * urgencyFactor * factors.seasonIndex;
}

/**
 * Calculate final price with optional AI multiplier
 * If AI multiplier is provided, it overrides the rule-based calculation
 */
export function calculatePrice(
  input: PricingInput,
  factors: PricingFactors,
  aiMultiplier?: AIMultiplierResult
): PricingOutput {
  const baseRate = getBaseRate(input.routeType);
  const categoryMultiplier = CATEGORY_MULTIPLIERS[input.cargoCategory];

  // Use AI multiplier if available, otherwise use rule-based
  const dynamicMultiplier = aiMultiplier?.multiplier ?? calculateRuleBasedMultiplier(factors);

  const adjustedRate = baseRate * categoryMultiplier * dynamicMultiplier;
  const baseCharge = input.chargeableWeight * adjustedRate;
  const fuelSurcharge = baseCharge * (input.fuelSurchargePercent / 100);
  const securityCharge = input.chargeableWeight * input.securitySurcharge;
  const totalCharge = baseCharge + fuelSurcharge + securityCharge + input.handlingFee;
  const effectiveRatePerKg = totalCharge / input.chargeableWeight;

  return {
    baseRate,
    adjustedRate: round(adjustedRate),
    baseCharge: round(baseCharge),
    fuelSurcharge: round(fuelSurcharge),
    securityCharge: round(securityCharge),
    handlingFee: input.handlingFee,
    totalCharge: round(totalCharge),
    effectiveRatePerKg: round(effectiveRatePerKg),
  };
}

/**
 * Determine pricing recommendation label
 */
export function getPricingRecommendation(multiplier: number): "discount" | "standard" | "premium" | "surge" {
  if (multiplier < 0.90) return "discount";
  if (multiplier <= 1.10) return "standard";
  if (multiplier <= 1.30) return "premium";
  return "surge";
}

/**
 * Calculate urgency score (0-100) based on days until departure
 */
export function calculateUrgencyScore(daysUntilDeparture: number): number {
  return Math.round((1 / Math.max(daysUntilDeparture, 1)) * 100);
}

// ============ HELPERS ============

function round(value: number, decimals: number = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

// ============ CONTRACT FOR AI SERVICE ============

/**
 * Input contract for AI pricing service
 * This is what the AI endpoint expects
 */
export interface AIPricingRequest {
  routeType: RouteType;
  capacityUtilization: number;   // 0-100
  seasonIndex: number;           // 0.85-1.30
  daysUntilDeparture: number;
  basePrice: number;
}

/**
 * Output contract from AI pricing service
 */
export interface AIPricingResponse {
  aiMultiplier: number;          // 0.85-1.60
  confidence: number;            // 0-1
  reasoning?: string;            // optional explanation
}
