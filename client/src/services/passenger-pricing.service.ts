/**
 * Passenger Pricing Service
 *
 * Handles all passenger-related AI pricing and demand forecasting operations.
 * This service is the ONLY place that communicates with passenger pricing endpoints.
 *
 * @module services/passenger-pricing
 */

import { useState, useCallback } from "react";
import type {
  PassengerDemandRequest,
  PassengerDemandResponse,
  PassengerPricingRequest,
  PassengerPricingResponse,
} from "@/domain/passenger-pricing";

// ============ CONFIGURATION ============

const API_BASE_URL = "/api/passenger";
const DEMAND_FORECAST_ENDPOINT = `${API_BASE_URL}/demand/forecast`;
const PRICING_ENDPOINT = `${API_BASE_URL}/pricing/ai`;

const DEFAULT_TIMEOUT = 15000;

// ============ TYPES ============

export interface PassengerDemandResult {
  success: boolean;
  data?: PassengerDemandResponse;
  error?: string;
}

export interface PassengerPricingResult {
  success: boolean;
  data?: PassengerPricingResponse;
  error?: string;
}

// ============ API FUNCTIONS ============

/**
 * Get passenger demand forecast
 */
export async function getPassengerDemandForecast(
  request: PassengerDemandRequest
): Promise<PassengerDemandResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

    const response = await fetch(DEMAND_FORECAST_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `API error: ${response.status} - ${errorText}`,
      };
    }

    const data: PassengerDemandResponse = await response.json();

    // Validate response
    if (typeof data.expectedFinalLoadFactor !== "number" ||
        typeof data.confidence !== "number") {
      return {
        success: false,
        error: "Invalid response format from demand forecast service",
      };
    }

    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return { success: false, error: "Request timeout" };
      }
      return { success: false, error: error.message };
    }
    return { success: false, error: "Unknown error" };
  }
}

/**
 * Get AI-powered passenger ticket pricing
 */
export async function getPassengerPricing(
  request: PassengerPricingRequest
): Promise<PassengerPricingResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

    const response = await fetch(PRICING_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `API error: ${response.status} - ${errorText}`,
      };
    }

    const data: PassengerPricingResponse = await response.json();

    // Validate response
    if (typeof data.aiMultiplier !== "number" ||
        typeof data.recommendedPrice !== "number") {
      return {
        success: false,
        error: "Invalid response format from pricing service",
      };
    }

    return { success: true, data };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return { success: false, error: "Request timeout" };
      }
      return { success: false, error: error.message };
    }
    return { success: false, error: "Unknown error" };
  }
}

/**
 * Combined demand forecast + pricing in one call
 */
export async function getPassengerDemandAndPricing(
  demandRequest: PassengerDemandRequest,
  pricingBaseRequest: Omit<PassengerPricingRequest, "forecastSignal" | "seasonIndex">
): Promise<{
  demand: PassengerDemandResult;
  pricing: PassengerPricingResult;
}> {
  // First get demand forecast
  const demandResult = await getPassengerDemandForecast(demandRequest);

  // Build pricing request with forecast signal
  const pricingRequest: PassengerPricingRequest = {
    ...pricingBaseRequest,
    seasonIndex: demandResult.success && demandResult.data
      ? (demandResult.data.seasonality === "peak" ? 1.25 : demandResult.data.seasonality === "low" ? 0.85 : 1.0)
      : 1.0,
    forecastSignal: demandResult.success && demandResult.data
      ? {
          expectedFinalLoadFactor: demandResult.data.expectedFinalLoadFactor,
          demandTrend: demandResult.data.demandTrend,
          confidence: demandResult.data.confidence,
        }
      : undefined,
  };

  // Get pricing
  const pricingResult = await getPassengerPricing(pricingRequest);

  return { demand: demandResult, pricing: pricingResult };
}

// ============ REACT HOOKS ============

export interface UsePassengerDemandReturn {
  loading: boolean;
  result: PassengerDemandResult | null;
  fetchDemand: (request: PassengerDemandRequest) => Promise<void>;
  reset: () => void;
}

/**
 * React hook for passenger demand forecasting
 */
export function usePassengerDemand(): UsePassengerDemandReturn {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PassengerDemandResult | null>(null);

  const fetchDemand = useCallback(async (request: PassengerDemandRequest) => {
    setLoading(true);
    try {
      const response = await getPassengerDemandForecast(request);
      setResult(response);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { loading, result, fetchDemand, reset };
}

export interface UsePassengerPricingReturn {
  loading: boolean;
  result: PassengerPricingResult | null;
  fetchPricing: (request: PassengerPricingRequest) => Promise<void>;
  reset: () => void;
}

/**
 * React hook for passenger ticket pricing
 */
export function usePassengerPricing(): UsePassengerPricingReturn {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PassengerPricingResult | null>(null);

  const fetchPricing = useCallback(async (request: PassengerPricingRequest) => {
    setLoading(true);
    try {
      const response = await getPassengerPricing(request);
      setResult(response);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { loading, result, fetchPricing, reset };
}

export interface UsePassengerDemandPricingReturn {
  loading: boolean;
  demandResult: PassengerDemandResult | null;
  pricingResult: PassengerPricingResult | null;
  fetchAll: (
    demandRequest: PassengerDemandRequest,
    pricingBaseRequest: Omit<PassengerPricingRequest, "forecastSignal" | "seasonIndex">
  ) => Promise<void>;
  reset: () => void;
}

/**
 * React hook for combined demand + pricing
 */
export function usePassengerDemandPricing(): UsePassengerDemandPricingReturn {
  const [loading, setLoading] = useState(false);
  const [demandResult, setDemandResult] = useState<PassengerDemandResult | null>(null);
  const [pricingResult, setPricingResult] = useState<PassengerPricingResult | null>(null);

  const fetchAll = useCallback(async (
    demandRequest: PassengerDemandRequest,
    pricingBaseRequest: Omit<PassengerPricingRequest, "forecastSignal" | "seasonIndex">
  ) => {
    setLoading(true);
    try {
      const { demand, pricing } = await getPassengerDemandAndPricing(demandRequest, pricingBaseRequest);
      setDemandResult(demand);
      setPricingResult(pricing);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setDemandResult(null);
    setPricingResult(null);
  }, []);

  return { loading, demandResult, pricingResult, fetchAll, reset };
}
