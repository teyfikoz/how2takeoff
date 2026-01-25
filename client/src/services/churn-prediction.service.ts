/**
 * Churn Prediction Service
 *
 * Handles all churn prediction operations.
 * This service communicates with the CRM churn prediction endpoint.
 *
 * @module services/churn-prediction
 */

import { useState, useCallback } from "react";
import type {
  ChurnPredictionRequest,
  ChurnPredictionResponse,
} from "@/domain/churn-prediction";

// ============ CONFIGURATION ============

const API_BASE_URL = "/api/crm";
const CHURN_PREDICT_ENDPOINT = `${API_BASE_URL}/churn/predict`;

const DEFAULT_TIMEOUT = 10000;

// ============ TYPES ============

export interface ChurnPredictionResult {
  success: boolean;
  data?: ChurnPredictionResponse;
  error?: string;
}

// ============ API FUNCTIONS ============

/**
 * Get churn prediction for a customer
 */
export async function getChurnPrediction(
  request: ChurnPredictionRequest
): Promise<ChurnPredictionResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

    const response = await fetch(CHURN_PREDICT_ENDPOINT, {
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

    const data: ChurnPredictionResponse = await response.json();

    // Validate response
    if (typeof data.churnProbability !== "number" ||
        typeof data.confidence !== "number" ||
        !data.riskLevel) {
      return {
        success: false,
        error: "Invalid response format from churn prediction service",
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

// ============ REACT HOOKS ============

export interface UseChurnPredictionReturn {
  loading: boolean;
  result: ChurnPredictionResult | null;
  predict: (request: ChurnPredictionRequest) => Promise<void>;
  reset: () => void;
}

/**
 * React hook for churn prediction
 */
export function useChurnPrediction(): UseChurnPredictionReturn {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ChurnPredictionResult | null>(null);

  const predict = useCallback(async (request: ChurnPredictionRequest) => {
    setLoading(true);
    try {
      const response = await getChurnPrediction(request);
      setResult(response);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { loading, result, predict, reset };
}
