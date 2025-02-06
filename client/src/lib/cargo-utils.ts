// Cargo calculation utilities
import { z } from "zod";

export interface CargoCalculationParams {
  aircraft: {
    maxTakeoffWeight: number;
    emptyWeight: number;
    fuelCapacity: number;
    cargoVolume?: number;
  };
  cargo: {
    weight: number;
    volume?: number;
  };
  distance: number;
  fuelLoad: number;
}

export interface ULDParams {
  uldCapacity: number;
  cargoWeight: number;
  cargoVolume: number;
  maxVolume: number;
}

export interface FreightRevenueParams {
  cargoWeight: number; // in tons
  distance: number; // in km
  revenuePerFTK: number; // revenue per freight ton-kilometer
}

// Maximum payload calculation
export const calculateMaxPayload = (params: CargoCalculationParams): number => {
  const { maxTakeoffWeight, emptyWeight } = params.aircraft;
  const { fuelLoad } = params;
  return maxTakeoffWeight - emptyWeight - fuelLoad;
};

// Cargo volume utilization
export const calculateVolumeUtilization = (cargoVolume: number, maxVolume: number): number => {
  return (cargoVolume / maxVolume) * 100;
};

// Cargo load factor (weight-based)
export const calculateLoadFactor = (actualWeight: number, maxCapacity: number): number => {
  return (actualWeight / maxCapacity) * 100;
};

// Freight Ton Kilometers (FTK)
export const calculateFTK = (params: FreightRevenueParams): number => {
  return params.cargoWeight * params.distance;
};

// Revenue calculation
export const calculateCargoRevenue = (params: FreightRevenueParams): number => {
  const ftk = calculateFTK(params);
  return ftk * params.revenuePerFTK;
};

// Break-even load factor
export const calculateBELF = (operatingCost: number, maxRevenue: number): number => {
  return (operatingCost / maxRevenue) * 100;
};

// ULD (Unit Load Device) optimization
export const calculateULDLoadFactor = (params: ULDParams): {
  weightLoadFactor: number;
  volumeLoadFactor: number;
  isOptimal: boolean;
} => {
  const weightLoadFactor = (params.cargoWeight / params.uldCapacity) * 100;
  const volumeLoadFactor = (params.cargoVolume / params.maxVolume) * 100;
  
  // Consider load optimal if both weight and volume utilization are above 80%
  const isOptimal = weightLoadFactor >= 80 && volumeLoadFactor >= 80;
  
  return {
    weightLoadFactor,
    volumeLoadFactor,
    isOptimal
  };
};

// Dynamic cargo pricing
export interface DynamicPricingParams {
  baseRate: number; // USD per kg
  fuelSurcharge: number; // percentage
  demandFactor: number; // percentage
}

export const calculateDynamicPrice = (params: DynamicPricingParams): number => {
  const { baseRate, fuelSurcharge, demandFactor } = params;
  return baseRate * (1 + fuelSurcharge/100) * (1 + demandFactor/100);
};

// Fuel efficiency metrics
export const calculateFuelEfficiency = (
  fuelBurn: number,
  cargoWeight: number,
  distance: number
): number => {
  // Returns fuel burn per ton-kilometer
  return (fuelBurn / (cargoWeight * distance)) * 1000; // Convert to grams per ton-km
};
