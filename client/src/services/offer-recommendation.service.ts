/**
 * AI Offer Recommendation Service
 *
 * Handles offer recommendation API calls.
 * Connects churn prediction output → offer recommendation input.
 *
 * @module services/offer-recommendation
 */

import { useState, useCallback } from "react";
import type {
  OfferRecommendationRequest,
  OfferRecommendationResponse,
} from "@/domain/offer-recommendation";

// ============ CONFIGURATION ============

const API_BASE_URL = "/api/crm";
const OFFER_RECOMMEND_ENDPOINT = `${API_BASE_URL}/offer/recommend`;

const DEFAULT_TIMEOUT = 10000;

// ============ TYPES ============

export interface OfferRecommendationResult {
  success: boolean;
  data?: OfferRecommendationResponse;
  error?: string;
}

// ============ API FUNCTIONS ============

/**
 * Get AI offer recommendation for a customer
 */
export async function getOfferRecommendation(
  request: OfferRecommendationRequest
): Promise<OfferRecommendationResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), DEFAULT_TIMEOUT);

    const response = await fetch(OFFER_RECOMMEND_ENDPOINT, {
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

    const data: OfferRecommendationResponse = await response.json();

    // Validate response
    if (!data.recommendedOfferType ||
        !data.offerIntensity ||
        typeof data.confidence !== "number") {
      return {
        success: false,
        error: "Invalid response format from offer recommendation service",
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

export interface UseOfferRecommendationReturn {
  loading: boolean;
  result: OfferRecommendationResult | null;
  recommend: (request: OfferRecommendationRequest) => Promise<void>;
  reset: () => void;
}

/**
 * React hook for offer recommendation
 */
export function useOfferRecommendation(): UseOfferRecommendationReturn {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OfferRecommendationResult | null>(null);

  const recommend = useCallback(async (request: OfferRecommendationRequest) => {
    setLoading(true);
    try {
      const response = await getOfferRecommendation(request);
      setResult(response);
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { loading, result, recommend, reset };
}
