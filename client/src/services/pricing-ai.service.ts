/**
 * Pricing AI Service
 *
 * Handles all AI-related pricing operations.
 * This service is the ONLY place that communicates with the AI endpoint.
 * UI components should use this service, not call the API directly.
 *
 * @module services/pricing-ai
 */

import type { AIPricingRequest, AIPricingResponse } from "@/domain/pricing";

// ============ CONFIGURATION ============

const API_BASE_URL = "/api";
const AI_PRICING_ENDPOINT = `${API_BASE_URL}/pricing/ai`;

// ============ TYPES ============

export interface PricingAIServiceConfig {
  timeout?: number;
  retries?: number;
}

export interface PricingAIResult {
  success: boolean;
  data?: AIPricingResponse;
  error?: string;
  source: "ai" | "fallback";
}

// ============ SERVICE ============

const DEFAULT_CONFIG: PricingAIServiceConfig = {
  timeout: 10000,
  retries: 1,
};

/**
 * Get AI-powered pricing multiplier
 *
 * @param request - Pricing parameters
 * @param config - Optional service configuration
 * @returns AI pricing result with multiplier, confidence, and reasoning
 */
export async function getAIPricing(
  request: AIPricingRequest,
  config: PricingAIServiceConfig = DEFAULT_CONFIG
): Promise<PricingAIResult> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.timeout);

    const response = await fetch(AI_PRICING_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      return {
        success: false,
        error: `API error: ${response.status} - ${errorText}`,
        source: "fallback",
      };
    }

    const data: AIPricingResponse = await response.json();

    // Validate response
    if (typeof data.aiMultiplier !== "number" || typeof data.confidence !== "number") {
      return {
        success: false,
        error: "Invalid response format from AI service",
        source: "fallback",
      };
    }

    // Clamp multiplier to reasonable bounds
    const clampedMultiplier = Math.max(0.5, Math.min(2.0, data.aiMultiplier));

    return {
      success: true,
      data: {
        aiMultiplier: clampedMultiplier,
        confidence: Math.max(0, Math.min(1, data.confidence)),
        reasoning: data.reasoning,
      },
      source: "ai",
    };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        return {
          success: false,
          error: "Request timeout",
          source: "fallback",
        };
      }
      return {
        success: false,
        error: error.message,
        source: "fallback",
      };
    }
    return {
      success: false,
      error: "Unknown error",
      source: "fallback",
    };
  }
}

/**
 * Check if AI pricing service is available
 */
export async function checkAIServiceHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}

// ============ REACT HOOK (Optional) ============

import { useState, useCallback } from "react";

export interface UseAIPricingOptions {
  autoFetch?: boolean;
}

export interface UseAIPricingReturn {
  loading: boolean;
  result: PricingAIResult | null;
  fetchPricing: (request: AIPricingRequest) => Promise<void>;
  reset: () => void;
}

/**
 * React hook for AI pricing
 *
 * @example
 * const { loading, result, fetchPricing } = useAIPricing();
 *
 * useEffect(() => {
 *   fetchPricing({ routeType: "mediumHaul", ... });
 * }, [params]);
 */
export function useAIPricing(): UseAIPricingReturn {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PricingAIResult | null>(null);

  const fetchPricing = useCallback(async (request: AIPricingRequest) => {
    setLoading(true);
    try {
      const response = await getAIPricing(request);
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
