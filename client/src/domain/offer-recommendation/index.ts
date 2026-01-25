/**
 * AI Offer Recommendation Domain Module
 * @module domain/offer-recommendation
 *
 * Policy-driven, explainable offer recommendations.
 * NOT a spam engine - produces strategy, not text.
 */

import type { RiskLevel, CustomerValue, LoyaltyTier } from "@/domain/churn-prediction";

// ============ TYPES ============

export type OfferType =
  | "discount_light"      // 5-10% discount on next booking
  | "flexibility_upgrade" // Free change/refund flexibility
  | "loyalty_bonus"       // Bonus miles/points multiplier
  | "ancillary_bundle"    // Seat + baggage + lounge package
  | "priority_service"    // Fast track, priority boarding
  | "no_offer";           // AI recommends NOT making an offer

export type OfferIntensity = "low" | "medium" | "high";

export type TravelPurpose = "business" | "leisure" | "mixed";

export interface OfferRecommendationRequest {
  // From churn prediction output
  churnRiskScore: number;      // 0-1
  riskLevel: RiskLevel;        // low, medium, high, critical
  customerValue: CustomerValue; // low, medium, high, vip

  // Customer context
  loyaltyTier: LoyaltyTier;
  travelPurposeMix: TravelPurpose;
  priceSensitivity: "low" | "medium" | "high";

  // Optional: offer history
  lastOfferDate?: string;
  lastOfferAccepted?: boolean;
}

export interface OfferReasoning {
  primaryDriver: string;
  secondaryFactors: string[];
  guardrailsApplied: string[];
}

export interface OfferRecommendationResponse {
  // Primary recommendation
  recommendedOfferType: OfferType;
  offerIntensity: OfferIntensity;
  confidence: number;           // 0-1

  // Explainability
  reasoning: OfferReasoning;

  // Guardrails
  doNotRecommend: OfferType[];

  // Expected impact
  expectedRetentionLift: number;  // percentage points
  costEfficiencyScore: number;    // 1-10

  // Fatigue check
  offerFatigueWarning?: string;
}

// ============ CONSTANTS ============

export const OFFER_TYPE_LABELS: Record<OfferType, { label: string; description: string; icon: string }> = {
  discount_light: {
    label: "Light Discount",
    description: "5-10% discount on next booking",
    icon: "percent",
  },
  flexibility_upgrade: {
    label: "Flexibility Upgrade",
    description: "Free change/refund flexibility added",
    icon: "refresh-cw",
  },
  loyalty_bonus: {
    label: "Loyalty Bonus",
    description: "2x-3x miles/points on next flight",
    icon: "award",
  },
  ancillary_bundle: {
    label: "Ancillary Bundle",
    description: "Seat + baggage + lounge package",
    icon: "package",
  },
  priority_service: {
    label: "Priority Service",
    description: "Fast track + priority boarding",
    icon: "zap",
  },
  no_offer: {
    label: "No Offer Recommended",
    description: "Customer likely to retain without intervention",
    icon: "check-circle",
  },
};

export const OFFER_INTENSITY_LABELS: Record<OfferIntensity, { label: string; color: string; bgColor: string }> = {
  low: { label: "Low Intensity", color: "text-green-700", bgColor: "bg-green-100" },
  medium: { label: "Medium Intensity", color: "text-yellow-700", bgColor: "bg-yellow-100" },
  high: { label: "High Intensity", color: "text-red-700", bgColor: "bg-red-100" },
};

export const TRAVEL_PURPOSE_LABELS: Record<TravelPurpose, string> = {
  business: "Business Travel",
  leisure: "Leisure Travel",
  mixed: "Mixed Purpose",
};

export const PRICE_SENSITIVITY_LABELS: Record<"low" | "medium" | "high", string> = {
  low: "Low (Price insensitive)",
  medium: "Medium (Somewhat price sensitive)",
  high: "High (Very price sensitive)",
};

// ============ HELPER FUNCTIONS ============

/**
 * Get offer type style for UI
 */
export function getOfferTypeStyle(offerType: OfferType): { text: string; bg: string; border: string } {
  switch (offerType) {
    case "no_offer":
      return { text: "text-green-700", bg: "bg-green-50", border: "border-green-300" };
    case "discount_light":
      return { text: "text-blue-700", bg: "bg-blue-50", border: "border-blue-300" };
    case "flexibility_upgrade":
      return { text: "text-purple-700", bg: "bg-purple-50", border: "border-purple-300" };
    case "loyalty_bonus":
      return { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-300" };
    case "ancillary_bundle":
      return { text: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-300" };
    case "priority_service":
      return { text: "text-pink-700", bg: "bg-pink-50", border: "border-pink-300" };
  }
}

/**
 * Format retention lift as percentage
 */
export function formatRetentionLift(lift: number): string {
  const sign = lift >= 0 ? "+" : "";
  return `${sign}${lift.toFixed(1)}%`;
}

/**
 * Get cost efficiency label
 */
export function getCostEfficiencyLabel(score: number): { label: string; color: string } {
  if (score >= 8) return { label: "Excellent", color: "text-green-600" };
  if (score >= 6) return { label: "Good", color: "text-blue-600" };
  if (score >= 4) return { label: "Moderate", color: "text-yellow-600" };
  return { label: "Low", color: "text-red-600" };
}

/**
 * Format confidence as percentage
 */
export function formatConfidence(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
}
