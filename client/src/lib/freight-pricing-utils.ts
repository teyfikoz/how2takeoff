// Air Freight Pricing & Chargeable Weight Utilities
// Based on IATA and TACT (The Air Cargo Tariff) standards

// ============ CHARGEABLE WEIGHT CALCULATION ============

// IATA standard volumetric divisor
export const IATA_VOLUMETRIC_DIVISOR = 6000; // cm³ per kg

// Alternative divisors used by different carriers
export const VOLUMETRIC_DIVISORS = {
  iata: 6000,
  dhl: 5000,
  fedex: 5000,
  ups: 5000,
  sea: 1000,
} as const;

export interface CargoMeasurements {
  length: number;
  width: number;
  height: number;
  grossWeight: number;
}

export interface ChargeableWeightResult {
  volumetricWeight: number;
  grossWeight: number;
  chargeableWeight: number;
  chargeType: "volumetric" | "gross";
  volumeFactor: number;
  actualVolume: number;
}

// Calculate chargeable weight
export function calculateChargeableWeight(
  cargo: CargoMeasurements,
  divisor: number = IATA_VOLUMETRIC_DIVISOR
): ChargeableWeightResult {
  const volumeCm3 = cargo.length * cargo.width * cargo.height;
  const volumeM3 = volumeCm3 / 1000000;
  const volumetricWeight = volumeCm3 / divisor;
  
  const chargeableWeight = Math.max(volumetricWeight, cargo.grossWeight);
  const chargeType: "volumetric" | "gross" = volumetricWeight > cargo.grossWeight ? "volumetric" : "gross";
  const volumeFactor = volumetricWeight / cargo.grossWeight;

  return {
    volumetricWeight: Math.round(volumetricWeight * 100) / 100,
    grossWeight: cargo.grossWeight,
    chargeableWeight: Math.round(chargeableWeight * 100) / 100,
    chargeType,
    volumeFactor: Math.round(volumeFactor * 100) / 100,
    actualVolume: Math.round(volumeM3 * 1000) / 1000,
  };
}

// Calculate volumetric weight from m³
export function volumetricWeightFromM3(volumeM3: number): number {
  return volumeM3 * 167;
}

// ============ AIR FREIGHT PRICING MODELS ============

export type RouteType = "domestic" | "shortHaul" | "mediumHaul" | "longHaul" | "intercontinental";
export type CargoCategory = "general" | "perishable" | "dangerous" | "valuable" | "express" | "economy";
export type SeasonType = "low" | "shoulder" | "peak";

// Base rates per kg by route type (USD)
export const BASE_RATES: Record<RouteType, { min: number; max: number; typical: number }> = {
  domestic: { min: 0.30, max: 1.50, typical: 0.75 },
  shortHaul: { min: 0.50, max: 2.50, typical: 1.25 },
  mediumHaul: { min: 1.00, max: 3.50, typical: 2.00 },
  longHaul: { min: 1.50, max: 4.50, typical: 2.75 },
  intercontinental: { min: 2.00, max: 5.50, typical: 3.50 },
};

// Category multipliers
export const CATEGORY_MULTIPLIERS: Record<CargoCategory, number> = {
  economy: 0.85,
  general: 1.00,
  perishable: 1.25,
  dangerous: 1.50,
  valuable: 1.75,
  express: 2.00,
};

// Season multipliers
export const SEASON_MULTIPLIERS: Record<SeasonType, number> = {
  low: 0.85,
  shoulder: 1.00,
  peak: 1.30,
};

export interface FreightPricingParams {
  chargeableWeight: number;
  routeType: RouteType;
  cargoCategory: CargoCategory;
  season: SeasonType;
  fuelSurchargePercent: number;
  securitySurcharge: number;
  handlingFee: number;
  customRate?: number;
}

export interface FreightPricingResult {
  baseCharge: number;
  fuelSurcharge: number;
  securityCharge: number;
  handlingFee: number;
  totalCharge: number;
  ratePerKg: number;
  effectiveRatePerKg: number;
  breakdown: {
    baseRate: number;
    categoryMultiplier: number;
    seasonMultiplier: number;
  };
}

// Calculate air freight price
export function calculateFreightPrice(params: FreightPricingParams): FreightPricingResult {
  const baseRate = params.customRate || BASE_RATES[params.routeType].typical;
  const categoryMultiplier = CATEGORY_MULTIPLIERS[params.cargoCategory];
  const seasonMultiplier = SEASON_MULTIPLIERS[params.season];
  
  const adjustedRate = baseRate * categoryMultiplier * seasonMultiplier;
  const baseCharge = params.chargeableWeight * adjustedRate;
  const fuelSurcharge = baseCharge * (params.fuelSurchargePercent / 100);
  const securityCharge = params.chargeableWeight * params.securitySurcharge;
  
  const totalCharge = baseCharge + fuelSurcharge + securityCharge + params.handlingFee;
  const effectiveRatePerKg = totalCharge / params.chargeableWeight;

  return {
    baseCharge: Math.round(baseCharge * 100) / 100,
    fuelSurcharge: Math.round(fuelSurcharge * 100) / 100,
    securityCharge: Math.round(securityCharge * 100) / 100,
    handlingFee: params.handlingFee,
    totalCharge: Math.round(totalCharge * 100) / 100,
    ratePerKg: Math.round(adjustedRate * 100) / 100,
    effectiveRatePerKg: Math.round(effectiveRatePerKg * 100) / 100,
    breakdown: {
      baseRate,
      categoryMultiplier,
      seasonMultiplier,
    },
  };
}

// ============ DYNAMIC PRICING MODEL ============

export interface DynamicPricingFactors {
  capacityUtilization: number;
  daysUntilDeparture: number;
  competitorPriceIndex: number;
  historicalDemand: number;
}

export interface DynamicPriceResult {
  recommendedRate: number;
  priceMultiplier: number;
  demandScore: number;
  urgencyScore: number;
  recommendation: "discount" | "standard" | "premium" | "surge";
}

export function calculateDynamicPrice(
  baseRate: number,
  factors: DynamicPricingFactors
): DynamicPriceResult {
  // Capacity factor: higher utilization = higher price
  const capacityFactor = factors.capacityUtilization > 80 
    ? 1 + ((factors.capacityUtilization - 80) * 0.02)
    : factors.capacityUtilization < 40
    ? 0.85 + (factors.capacityUtilization * 0.00375)
    : 1.0;

  // Booking window factor: last-minute = premium
  const urgencyFactor = factors.daysUntilDeparture < 3 
    ? 1.35
    : factors.daysUntilDeparture < 7
    ? 1.15
    : factors.daysUntilDeparture > 30
    ? 0.90
    : 1.0;

  // Demand factor
  const demandFactor = factors.historicalDemand > 80
    ? 1.20
    : factors.historicalDemand < 40
    ? 0.85
    : 1 + ((factors.historicalDemand - 50) * 0.004);

  // Competitor alignment
  const competitorFactor = 0.7 + (factors.competitorPriceIndex * 0.3);

  const priceMultiplier = capacityFactor * urgencyFactor * demandFactor * competitorFactor;
  const recommendedRate = baseRate * priceMultiplier;

  // Determine recommendation
  let recommendation: "discount" | "standard" | "premium" | "surge";
  if (priceMultiplier < 0.90) recommendation = "discount";
  else if (priceMultiplier <= 1.10) recommendation = "standard";
  else if (priceMultiplier <= 1.30) recommendation = "premium";
  else recommendation = "surge";

  return {
    recommendedRate: Math.round(recommendedRate * 100) / 100,
    priceMultiplier: Math.round(priceMultiplier * 100) / 100,
    demandScore: Math.round(factors.historicalDemand),
    urgencyScore: Math.round((1 / Math.max(factors.daysUntilDeparture, 1)) * 100),
    recommendation,
  };
}

// ============ COST-PLUS PRICING MODEL ============

export interface OperatingCosts {
  fuelCostPerKm: number;
  crewCostPerHour: number;
  maintenancePerHour: number;
  handlingPerFlight: number;
  insurancePerFlight: number;
  navigationFees: number;
  landingFees: number;
}

export interface CostPlusPricingParams {
  operatingCosts: OperatingCosts;
  distanceKm: number;
  flightHours: number;
  cargoCapacityKg: number;
  targetLoadFactor: number;
  targetMarginPercent: number;
}

export function calculateCostPlusPrice(params: CostPlusPricingParams): {
  totalOperatingCost: number;
  costPerKg: number;
  recommendedRatePerKg: number;
  breakEvenLoadFactor: number;
  projectedRevenue: number;
  projectedProfit: number;
} {
  const { operatingCosts, distanceKm, flightHours, cargoCapacityKg, targetLoadFactor, targetMarginPercent } = params;

  const totalOperatingCost = 
    (operatingCosts.fuelCostPerKm * distanceKm) +
    (operatingCosts.crewCostPerHour * flightHours) +
    (operatingCosts.maintenancePerHour * flightHours) +
    operatingCosts.handlingPerFlight +
    operatingCosts.insurancePerFlight +
    operatingCosts.navigationFees +
    operatingCosts.landingFees;

  const expectedCargoKg = cargoCapacityKg * targetLoadFactor;
  const costPerKg = totalOperatingCost / expectedCargoKg;
  const recommendedRatePerKg = costPerKg * (1 + targetMarginPercent / 100);
  const breakEvenLoadFactor = (totalOperatingCost / (cargoCapacityKg * recommendedRatePerKg));
  
  const projectedRevenue = expectedCargoKg * recommendedRatePerKg;
  const projectedProfit = projectedRevenue - totalOperatingCost;

  return {
    totalOperatingCost: Math.round(totalOperatingCost * 100) / 100,
    costPerKg: Math.round(costPerKg * 100) / 100,
    recommendedRatePerKg: Math.round(recommendedRatePerKg * 100) / 100,
    breakEvenLoadFactor: Math.round(breakEvenLoadFactor * 1000) / 10,
    projectedRevenue: Math.round(projectedRevenue * 100) / 100,
    projectedProfit: Math.round(projectedProfit * 100) / 100,
  };
}

// ============ REVENUE OPTIMIZATION ============

export interface RevenueOptimizationResult {
  optimalPrice: number;
  expectedDemand: number;
  expectedRevenue: number;
  priceElasticity: number;
  recommendation: string;
}

export function optimizeRevenue(
  currentPrice: number,
  currentDemand: number,
  priceElasticity: number = -1.5
): RevenueOptimizationResult {
  const optimalMultiplier = 1 / (1 + (1 / priceElasticity));
  const optimalPrice = currentPrice / optimalMultiplier;
  
  const priceChange = (optimalPrice - currentPrice) / currentPrice;
  const demandChange = priceChange * priceElasticity;
  const expectedDemand = currentDemand * (1 + demandChange);
  const expectedRevenue = optimalPrice * expectedDemand;

  let recommendation = "";
  if (optimalPrice > currentPrice * 1.05) {
    recommendation = "Consider increasing price - demand is relatively inelastic";
  } else if (optimalPrice < currentPrice * 0.95) {
    recommendation = "Consider reducing price to increase volume";
  } else {
    recommendation = "Current pricing is near optimal";
  }

  return {
    optimalPrice: Math.round(optimalPrice * 100) / 100,
    expectedDemand: Math.round(expectedDemand),
    expectedRevenue: Math.round(expectedRevenue * 100) / 100,
    priceElasticity,
    recommendation,
  };
}
