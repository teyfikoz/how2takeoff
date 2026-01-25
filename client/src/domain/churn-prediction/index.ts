/**
 * Churn Prediction Domain Module
 * @module domain/churn-prediction
 */

// ============ TYPES ============

export type LoyaltyTier = "none" | "bronze" | "silver" | "gold" | "platinum";
export type BookingChannel = "direct" | "ota" | "corporate" | "mixed";
export type FarePreference = "economy" | "premium" | "business" | "mixed";
export type RiskLevel = "low" | "medium" | "high" | "critical";
export type CustomerValue = "low" | "medium" | "high" | "vip";

export interface ChurnPredictionRequest {
  customerId?: string;
  // Recency
  daysSinceLastBooking: number;
  daysSinceLastFlight: number;
  // Frequency
  bookingsLast12Months: number;
  bookingsLast24Months: number;
  flightsLast12Months: number;
  // Monetary
  totalSpendLast12Months: number;
  averageTicketPrice: number;
  // Behavioral
  loyaltyTier?: LoyaltyTier;
  loyaltyPointsBalance?: number;
  preferredBookingChannel?: BookingChannel;
  farePreference?: FarePreference;
  // Engagement
  emailOpenRate?: number;
  appUsageLast30Days?: number;
  complaintsLast12Months?: number;
  // Route patterns
  topRouteFrequency?: number;
  uniqueDestinations?: number;
}

export interface ChurnRiskFactor {
  factor: string;
  impact: "high" | "medium" | "low";
  direction: "increases_risk" | "decreases_risk";
  score: number;
  description: string;
}

export interface ChurnPredictionResponse {
  churnProbability: number;
  riskLevel: RiskLevel;
  confidence: number;
  predictedChurnWindow: string;
  factors: ChurnRiskFactor[];
  recommendations: string[];
  customerValue: CustomerValue;
  retentionPriority: number;
}

// ============ CONSTANTS ============

export const LOYALTY_TIER_LABELS: Record<LoyaltyTier, string> = {
  none: "No Loyalty Status",
  bronze: "Bronze Member",
  silver: "Silver Member",
  gold: "Gold Member",
  platinum: "Platinum Member",
};

export const LOYALTY_TIER_COLORS: Record<LoyaltyTier, string> = {
  none: "bg-gray-100 text-gray-700",
  bronze: "bg-amber-100 text-amber-800",
  silver: "bg-slate-200 text-slate-800",
  gold: "bg-yellow-100 text-yellow-800",
  platinum: "bg-purple-100 text-purple-800",
};

export const RISK_LEVEL_LABELS: Record<RiskLevel, { label: string; color: string; bgColor: string }> = {
  low: { label: "Low Risk", color: "text-green-700", bgColor: "bg-green-100" },
  medium: { label: "Medium Risk", color: "text-yellow-700", bgColor: "bg-yellow-100" },
  high: { label: "High Risk", color: "text-orange-700", bgColor: "bg-orange-100" },
  critical: { label: "Critical Risk", color: "text-red-700", bgColor: "bg-red-100" },
};

export const CUSTOMER_VALUE_LABELS: Record<CustomerValue, { label: string; color: string }> = {
  low: { label: "Low Value", color: "text-gray-600" },
  medium: { label: "Medium Value", color: "text-blue-600" },
  high: { label: "High Value", color: "text-green-600" },
  vip: { label: "VIP Customer", color: "text-purple-600" },
};

export const BOOKING_CHANNEL_LABELS: Record<BookingChannel, string> = {
  direct: "Direct (Website/App)",
  ota: "OTA (Online Travel Agency)",
  corporate: "Corporate/TMC",
  mixed: "Mixed Channels",
};

export const FARE_PREFERENCE_LABELS: Record<FarePreference, string> = {
  economy: "Economy Class",
  premium: "Premium Economy",
  business: "Business Class",
  mixed: "Mixed Classes",
};

// ============ HELPER FUNCTIONS ============

/**
 * Format churn probability as percentage
 */
export function formatChurnProbability(probability: number): string {
  return `${Math.round(probability * 100)}%`;
}

/**
 * Get risk level color classes
 */
export function getRiskLevelStyle(riskLevel: RiskLevel): { text: string; bg: string; border: string } {
  switch (riskLevel) {
    case "critical":
      return { text: "text-red-700", bg: "bg-red-50", border: "border-red-300" };
    case "high":
      return { text: "text-orange-700", bg: "bg-orange-50", border: "border-orange-300" };
    case "medium":
      return { text: "text-yellow-700", bg: "bg-yellow-50", border: "border-yellow-300" };
    case "low":
      return { text: "text-green-700", bg: "bg-green-50", border: "border-green-300" };
  }
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Get priority urgency label
 */
export function getPriorityLabel(priority: number): string {
  if (priority >= 9) return "Urgent";
  if (priority >= 7) return "High";
  if (priority >= 5) return "Medium";
  if (priority >= 3) return "Low";
  return "Minimal";
}

/**
 * Sample customer data for demo purposes
 */
export const SAMPLE_CUSTOMERS: Array<{
  name: string;
  description: string;
  data: ChurnPredictionRequest;
}> = [
  {
    name: "Frequent Business Traveler",
    description: "Gold member, flies weekly, high spend",
    data: {
      daysSinceLastBooking: 15,
      daysSinceLastFlight: 7,
      bookingsLast12Months: 24,
      bookingsLast24Months: 45,
      flightsLast12Months: 36,
      totalSpendLast12Months: 28000,
      averageTicketPrice: 780,
      loyaltyTier: "gold",
      loyaltyPointsBalance: 125000,
      preferredBookingChannel: "corporate",
      farePreference: "business",
      emailOpenRate: 45,
      appUsageLast30Days: 12,
      complaintsLast12Months: 0,
      topRouteFrequency: 18,
      uniqueDestinations: 8,
    },
  },
  {
    name: "At-Risk Leisure Traveler",
    description: "Was active, no bookings in 8 months",
    data: {
      daysSinceLastBooking: 245,
      daysSinceLastFlight: 210,
      bookingsLast12Months: 1,
      bookingsLast24Months: 5,
      flightsLast12Months: 2,
      totalSpendLast12Months: 1200,
      averageTicketPrice: 450,
      loyaltyTier: "bronze",
      loyaltyPointsBalance: 8500,
      preferredBookingChannel: "ota",
      farePreference: "economy",
      emailOpenRate: 5,
      appUsageLast30Days: 0,
      complaintsLast12Months: 1,
      topRouteFrequency: 3,
      uniqueDestinations: 2,
    },
  },
  {
    name: "Churned Customer",
    description: "No activity for 14 months, complaints",
    data: {
      daysSinceLastBooking: 425,
      daysSinceLastFlight: 420,
      bookingsLast12Months: 0,
      bookingsLast24Months: 3,
      flightsLast12Months: 0,
      totalSpendLast12Months: 0,
      averageTicketPrice: 380,
      loyaltyTier: "silver",
      loyaltyPointsBalance: 22000,
      preferredBookingChannel: "direct",
      farePreference: "economy",
      emailOpenRate: 0,
      appUsageLast30Days: 0,
      complaintsLast12Months: 2,
      topRouteFrequency: 2,
      uniqueDestinations: 1,
    },
  },
  {
    name: "New Customer",
    description: "First booking 2 months ago",
    data: {
      daysSinceLastBooking: 60,
      daysSinceLastFlight: 45,
      bookingsLast12Months: 1,
      bookingsLast24Months: 1,
      flightsLast12Months: 2,
      totalSpendLast12Months: 850,
      averageTicketPrice: 425,
      loyaltyTier: "none",
      loyaltyPointsBalance: 0,
      preferredBookingChannel: "ota",
      farePreference: "economy",
      emailOpenRate: 25,
      appUsageLast30Days: 2,
      complaintsLast12Months: 0,
      topRouteFrequency: 1,
      uniqueDestinations: 1,
    },
  },
];
