import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertAircraftSchema, insertCalculationSchema, insertUserSchema } from "@shared/schema";
import { requireAdmin } from "./middleware/auth";
import bcrypt from "bcryptjs";

// ============ AI PRICING CONFIGURATION ============

const AI_CONFIG = {
  // Production-safe bounds
  MULTIPLIER_FLOOR: 0.85,
  MULTIPLIER_CAP: 1.50,
  // HuggingFace router settings - using Together AI provider
  HF_PROVIDER: "together",
  HF_MODEL: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
  HF_TIMEOUT_MS: 20000,
  HF_MAX_RETRIES: 1,
  // Feature flag
  USE_HF: process.env.USE_HF === "true",
  HF_API_TOKEN: process.env.HF_API_TOKEN,
};

// ============ AI PRICING TYPES ============

// Optional forecast signal for pricing bias
interface ForecastSignal {
  expectedFinalLoadFactor: number;  // 0-1
  demandTrend: "up" | "flat" | "down";
  confidence: number;               // 0-1
}

interface AIPricingInput {
  routeType: string;
  capacityUtilization: number;
  seasonIndex: number;
  daysUntilDeparture: number;
  basePrice: number;
  // Optional: forecast signal for demand-based bias
  forecastSignal?: ForecastSignal;
}

interface AIPricingResult {
  multiplier: number;
  confidence: number;
  reasoning: string;
  source: "huggingface" | "rule-based";
  // New: forecast integration info
  forecastBias?: number;
  forecastApplied?: boolean;
}

interface HFChatResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: string;
}

// ============ HUGGINGFACE INFERENCE ============

/**
 * Build system prompt for pricing AI
 */
function buildSystemPrompt(): string {
  return `You are an airline cargo pricing assistant. You calculate pricing multipliers based on market conditions.

Rules:
- High capacity (>80%) = increase price
- Low capacity (<40%) = decrease price
- Short notice (<7 days) = increase price
- Advance booking (>30 days) = decrease price
- Peak season (index > 1.1) = increase price
- Low season (index < 0.9) = decrease price

IMPORTANT: Return ONLY a single number between 0.85 and 1.50. No explanation.`;
}

/**
 * Build user message for pricing request
 */
function buildUserMessage(input: AIPricingInput): string {
  return `Calculate multiplier for:
- Route: ${input.routeType}
- Capacity: ${input.capacityUtilization}%
- Season index: ${input.seasonIndex}
- Days until departure: ${input.daysUntilDeparture}

Reply with ONLY the number.`;
}

/**
 * Parse response to extract multiplier
 */
function parseMultiplierResponse(response: string): number | null {
  const cleaned = response.trim();
  const numberMatch = cleaned.match(/(\d+\.?\d*)/);
  if (!numberMatch) return null;

  const value = parseFloat(numberMatch[1]);
  if (isNaN(value) || value < 0.5 || value > 2.0) return null;

  return value;
}

/**
 * Call HuggingFace via OpenAI-compatible router
 */
async function callHuggingFace(input: AIPricingInput): Promise<AIPricingResult | null> {
  if (!AI_CONFIG.HF_API_TOKEN) {
    console.warn("HF_API_TOKEN not configured");
    return null;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), AI_CONFIG.HF_TIMEOUT_MS);

  try {
    const response = await fetch(
      `https://router.huggingface.co/${AI_CONFIG.HF_PROVIDER}/v1/chat/completions`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${AI_CONFIG.HF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: AI_CONFIG.HF_MODEL,
          messages: [
            { role: "system", content: buildSystemPrompt() },
            { role: "user", content: buildUserMessage(input) },
          ],
          max_tokens: 10,
          temperature: 0.1,
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("HF API error:", response.status, errorText);
      return null;
    }

    const data = await response.json() as HFChatResponse;

    if (data.error) {
      console.error("HF inference error:", data.error);
      return null;
    }

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      console.error("HF: No content in response");
      return null;
    }

    const multiplier = parseMultiplierResponse(content);
    if (multiplier === null) {
      console.warn("HF: Could not parse multiplier from:", content);
      return null;
    }

    // Clamp to production-safe bounds
    const clampedMultiplier = Math.max(
      AI_CONFIG.MULTIPLIER_FLOOR,
      Math.min(AI_CONFIG.MULTIPLIER_CAP, multiplier)
    );

    // Build reasoning based on factors
    const factors: string[] = [];
    if (input.capacityUtilization > 80) factors.push(`High capacity (${input.capacityUtilization}%)`);
    if (input.capacityUtilization < 40) factors.push(`Low capacity (${input.capacityUtilization}%)`);
    if (input.daysUntilDeparture <= 3) factors.push("Last-minute booking");
    if (input.daysUntilDeparture > 30) factors.push("Advance booking");
    if (input.seasonIndex > 1.1) factors.push("Peak season");
    if (input.seasonIndex < 0.9) factors.push("Low season");

    const reasoning = factors.length > 0
      ? `AI analysis: ${factors.join(", ")} → ${clampedMultiplier > 1 ? "+" : ""}${((clampedMultiplier - 1) * 100).toFixed(0)}% adjustment`
      : "AI analysis: Standard market conditions";

    return {
      multiplier: Math.round(clampedMultiplier * 100) / 100,
      confidence: 0.92,
      reasoning,
      source: "huggingface",
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      console.warn("HF request timeout");
    } else {
      console.error("HF request failed:", error);
    }
    return null;
  }
}

/**
 * Calculate rule-based pricing multiplier (fallback)
 * Used when HuggingFace is unavailable or disabled
 */
function calculateRuleBasedMultiplier(input: AIPricingInput): AIPricingResult {
  const factors: string[] = [];
  let confidence = 0.85; // Base confidence for rule-based

  // Capacity factor: higher utilization = higher price
  let capacityMultiplier = 1.0;
  if (input.capacityUtilization > 85) {
    capacityMultiplier = 1 + ((input.capacityUtilization - 85) * 0.025);
    factors.push(`High capacity utilization (${input.capacityUtilization}%) → premium pricing`);
  } else if (input.capacityUtilization > 70) {
    capacityMultiplier = 1 + ((input.capacityUtilization - 70) * 0.01);
    factors.push(`Good capacity utilization (${input.capacityUtilization}%)`);
  } else if (input.capacityUtilization < 40) {
    capacityMultiplier = 0.85 + (input.capacityUtilization * 0.00375);
    factors.push(`Low capacity (${input.capacityUtilization}%) → discount recommended`);
    confidence -= 0.05;
  }

  // Urgency factor: last-minute = premium
  let urgencyMultiplier = 1.0;
  if (input.daysUntilDeparture <= 2) {
    urgencyMultiplier = 1.40;
    factors.push("Last-minute booking (≤2 days) → surge pricing");
  } else if (input.daysUntilDeparture <= 5) {
    urgencyMultiplier = 1.25;
    factors.push("Short notice (3-5 days) → premium pricing");
  } else if (input.daysUntilDeparture <= 10) {
    urgencyMultiplier = 1.10;
    factors.push("Near-term booking (6-10 days)");
  } else if (input.daysUntilDeparture > 30) {
    urgencyMultiplier = 0.92;
    factors.push("Advance booking (>30 days) → early bird discount");
  }

  // Season index already provided
  factors.push(`Season index: ${input.seasonIndex.toFixed(2)}`);

  // Route type adjustment
  let routeMultiplier = 1.0;
  switch (input.routeType) {
    case "intercontinental":
      routeMultiplier = 1.05;
      factors.push("Intercontinental route premium");
      break;
    case "longHaul":
      routeMultiplier = 1.02;
      break;
    case "domestic":
      routeMultiplier = 0.98;
      break;
  }

  // Calculate final multiplier
  const rawMultiplier = capacityMultiplier * urgencyMultiplier * input.seasonIndex * routeMultiplier;

  // Clamp to production-safe bounds
  const clampedMultiplier = Math.max(
    AI_CONFIG.MULTIPLIER_FLOOR,
    Math.min(AI_CONFIG.MULTIPLIER_CAP, rawMultiplier)
  );

  // Adjust confidence based on how extreme the multiplier is
  if (clampedMultiplier > 1.4 || clampedMultiplier < 0.9) {
    confidence -= 0.10;
  }

  // Generate reasoning
  const reasoning = factors.length > 0
    ? `Pricing factors: ${factors.join("; ")}`
    : "Standard market conditions";

  return {
    multiplier: Math.round(clampedMultiplier * 100) / 100,
    confidence: Math.round(confidence * 100) / 100,
    reasoning,
    source: "rule-based",
  };
}

/**
 * Calculate forecast bias based on demand signal
 * RULE: Max ±5% bias, only when confidence >= 0.6
 */
function calculateForecastBias(signal: ForecastSignal | undefined): { bias: number; applied: boolean; explanation: string } {
  // No signal = no bias
  if (!signal) {
    return { bias: 1.0, applied: false, explanation: "" };
  }

  // Low confidence = no bias (signal not trustworthy)
  if (signal.confidence < 0.6) {
    return {
      bias: 1.0,
      applied: false,
      explanation: `Forecast confidence too low (${(signal.confidence * 100).toFixed(0)}% < 60%)`
    };
  }

  // Apply bias based on demand trend
  // MAX ±5% to prevent forecast from overriding pricing logic
  const FORECAST_BIAS_MAX = 0.05;

  let bias = 1.0;
  let explanation = "";

  switch (signal.demandTrend) {
    case "up":
      bias = 1.0 + FORECAST_BIAS_MAX; // +5%
      explanation = `Demand forecast indicates UPWARD pressure (+5%)`;
      break;
    case "down":
      bias = 1.0 - FORECAST_BIAS_MAX; // -5%
      explanation = `Demand forecast indicates DOWNWARD pressure (-5%)`;
      break;
    case "flat":
      bias = 1.0;
      explanation = `Demand forecast indicates STABLE conditions (no adjustment)`;
      break;
  }

  return { bias, applied: bias !== 1.0, explanation };
}

/**
 * Get AI pricing - tries HuggingFace first, falls back to rule-based
 * Applies forecast bias if forecastSignal is provided
 */
async function getAIPricing(input: AIPricingInput): Promise<AIPricingResult> {
  // Step 1: Get base pricing (HF or rule-based)
  let baseResult: AIPricingResult;

  if (AI_CONFIG.USE_HF && AI_CONFIG.HF_API_TOKEN) {
    const hfResult = await callHuggingFace(input);
    if (hfResult) {
      baseResult = hfResult;
    } else {
      console.log("HF failed, falling back to rule-based");
      baseResult = calculateRuleBasedMultiplier(input);
    }
  } else {
    baseResult = calculateRuleBasedMultiplier(input);
  }

  // Step 2: Calculate forecast bias (if signal provided)
  const forecastBiasResult = calculateForecastBias(input.forecastSignal);

  // Step 3: Apply bias to multiplier
  const biasedMultiplier = baseResult.multiplier * forecastBiasResult.bias;

  // Step 4: Re-apply global guards [0.85, 1.50]
  const finalMultiplier = Math.max(
    AI_CONFIG.MULTIPLIER_FLOOR,
    Math.min(AI_CONFIG.MULTIPLIER_CAP, biasedMultiplier)
  );

  // Step 5: Update reasoning with forecast info
  let reasoning = baseResult.reasoning;
  if (forecastBiasResult.explanation) {
    reasoning += `; ${forecastBiasResult.explanation}`;
  }

  return {
    multiplier: Math.round(finalMultiplier * 100) / 100,
    confidence: baseResult.confidence,
    reasoning,
    source: baseResult.source,
    forecastBias: forecastBiasResult.bias !== 1.0 ? Math.round(forecastBiasResult.bias * 100) / 100 : undefined,
    forecastApplied: forecastBiasResult.applied,
  };
}

// ============ DEMAND FORECASTING TYPES ============
// NOTE: This is a SIGNAL generator only. Does NOT calculate prices.

type RouteIdentifier =
  | { type: "routeType"; value: string }
  | { type: "origin-destination"; origin: string; destination: string };

interface DemandForecastInput {
  route: RouteIdentifier;
  departureDate: string;           // ISO date string
  currentBookings: number;         // 0-100 (percentage)
  aircraftCapacity: number;        // total seats
  dayOfWeek: number;               // 0-6 (Sunday-Saturday)
  // Optional historical data
  historicalLoadFactors?: number[]; // normalized LF for same route/type
}

interface DemandForecastOutput {
  expectedFinalLoadFactor: number;  // 0-1
  demandTrend: "up" | "flat" | "down";
  confidence: number;               // 0-1
  seasonality: "low" | "shoulder" | "peak";
  // Debug info (non-pricing)
  factors: string[];
}

// ============ DEMAND FORECASTING CONSTANTS ============

// Day-of-week demand multipliers (business + leisure mix)
const DAY_OF_WEEK_FACTORS: Record<number, number> = {
  0: 0.95,  // Sunday - moderate
  1: 1.05,  // Monday - business peak
  2: 1.00,  // Tuesday - normal
  3: 1.00,  // Wednesday - normal
  4: 1.08,  // Thursday - business peak
  5: 1.12,  // Friday - highest (business + leisure)
  6: 0.90,  // Saturday - leisure only
};

// Booking curve: maps (days before departure, current booking %) → expected final LF
// Based on typical airline booking patterns
const BOOKING_CURVE_MULTIPLIERS: Record<string, number> = {
  "early-low": 1.8,      // >30 days, <30% booked → high growth potential
  "early-medium": 1.4,   // >30 days, 30-60% → good growth
  "early-high": 1.15,    // >30 days, >60% → limited growth
  "mid-low": 1.5,        // 14-30 days, <30% → moderate growth
  "mid-medium": 1.25,    // 14-30 days, 30-60% → normal
  "mid-high": 1.10,      // 14-30 days, >60% → filling up
  "late-low": 1.3,       // 7-14 days, <30% → some growth
  "late-medium": 1.15,   // 7-14 days, 30-60% → moderate
  "late-high": 1.05,     // 7-14 days, >60% → nearly full
  "urgent-low": 1.15,    // <7 days, <30% → limited time
  "urgent-medium": 1.08, // <7 days, 30-60% → slight growth
  "urgent-high": 1.02,   // <7 days, >60% → almost done
};

// Peak period dates (simplified - would be more comprehensive in production)
const PEAK_PERIODS = [
  { start: "12-20", end: "01-05" }, // Christmas/New Year
  { start: "06-15", end: "08-31" }, // Summer
  { start: "04-10", end: "04-20" }, // Easter period
];

const SHOULDER_PERIODS = [
  { start: "03-01", end: "04-09" },
  { start: "09-01", end: "10-31" },
  { start: "05-01", end: "06-14" },
];

// ============ DEMAND FORECASTING LOGIC ============

/**
 * Determine seasonality from date
 */
function getSeasonality(dateStr: string): "low" | "shoulder" | "peak" {
  const date = new Date(dateStr);
  const monthDay = `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

  for (const period of PEAK_PERIODS) {
    if (isInPeriod(monthDay, period.start, period.end)) {
      return "peak";
    }
  }

  for (const period of SHOULDER_PERIODS) {
    if (isInPeriod(monthDay, period.start, period.end)) {
      return "shoulder";
    }
  }

  return "low";
}

function isInPeriod(date: string, start: string, end: string): boolean {
  // Handle year-wrap (e.g., Dec 20 - Jan 5)
  if (start > end) {
    return date >= start || date <= end;
  }
  return date >= start && date <= end;
}

/**
 * Get booking curve phase
 */
function getBookingPhase(daysUntilDeparture: number): string {
  if (daysUntilDeparture > 30) return "early";
  if (daysUntilDeparture > 14) return "mid";
  if (daysUntilDeparture > 7) return "late";
  return "urgent";
}

/**
 * Get booking level category
 */
function getBookingLevel(currentBookings: number): string {
  if (currentBookings < 30) return "low";
  if (currentBookings < 60) return "medium";
  return "high";
}

/**
 * Calculate demand trend based on historical data or heuristics
 */
function calculateDemandTrend(
  currentBookings: number,
  daysUntilDeparture: number,
  seasonality: "low" | "shoulder" | "peak",
  historicalLFs?: number[]
): "up" | "flat" | "down" {
  // If we have historical data, use it
  if (historicalLFs && historicalLFs.length >= 3) {
    const recentAvg = historicalLFs.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const olderAvg = historicalLFs.slice(0, -3).reduce((a, b) => a + b, 0) / Math.max(1, historicalLFs.length - 3);

    if (recentAvg > olderAvg * 1.05) return "up";
    if (recentAvg < olderAvg * 0.95) return "down";
    return "flat";
  }

  // Heuristic-based trend
  // Peak season + early booking + low current = upward trend
  if (seasonality === "peak" && daysUntilDeparture > 14 && currentBookings < 50) {
    return "up";
  }

  // Low season + late booking + low current = downward trend
  if (seasonality === "low" && daysUntilDeparture < 14 && currentBookings < 40) {
    return "down";
  }

  return "flat";
}

/**
 * Calculate expected final load factor
 * NOTE: This is a SIGNAL only - does NOT determine prices
 */
function calculateExpectedLoadFactor(input: DemandForecastInput): DemandForecastOutput {
  const factors: string[] = [];
  let confidence = 0.75; // Base confidence for heuristic

  // Get seasonality
  const seasonality = getSeasonality(input.departureDate);
  factors.push(`Seasonality: ${seasonality}`);

  // Calculate days until departure
  const departureDate = new Date(input.departureDate);
  const today = new Date();
  const daysUntilDeparture = Math.max(0, Math.ceil((departureDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
  factors.push(`Days until departure: ${daysUntilDeparture}`);

  // Get booking curve multiplier
  const phase = getBookingPhase(daysUntilDeparture);
  const level = getBookingLevel(input.currentBookings);
  const curveKey = `${phase}-${level}`;
  const curveMultiplier = BOOKING_CURVE_MULTIPLIERS[curveKey] || 1.0;
  factors.push(`Booking curve: ${phase}/${level} → ${curveMultiplier}x`);

  // Day of week factor
  const dowFactor = DAY_OF_WEEK_FACTORS[input.dayOfWeek] || 1.0;
  factors.push(`Day of week (${input.dayOfWeek}): ${dowFactor}x`);

  // Seasonality factor
  const seasonFactor = seasonality === "peak" ? 1.15 : seasonality === "shoulder" ? 1.0 : 0.90;
  factors.push(`Season factor: ${seasonFactor}x`);

  // Base expected LF from current bookings
  let expectedLF = (input.currentBookings / 100) * curveMultiplier * dowFactor * seasonFactor;

  // Blend with historical if available
  if (input.historicalLoadFactors && input.historicalLoadFactors.length > 0) {
    const historicalAvg = input.historicalLoadFactors.reduce((a, b) => a + b, 0) / input.historicalLoadFactors.length;
    // Blend: 60% heuristic, 40% historical
    expectedLF = expectedLF * 0.6 + historicalAvg * 0.4;
    confidence += 0.10; // Higher confidence with historical data
    factors.push(`Historical blend: avg ${(historicalAvg * 100).toFixed(0)}%`);
  }

  // Clamp to realistic bounds [0.2, 0.98]
  expectedLF = Math.max(0.20, Math.min(0.98, expectedLF));

  // Calculate demand trend
  const demandTrend = calculateDemandTrend(
    input.currentBookings,
    daysUntilDeparture,
    seasonality,
    input.historicalLoadFactors
  );
  factors.push(`Demand trend: ${demandTrend}`);

  // Adjust confidence based on data quality
  if (daysUntilDeparture < 3) {
    confidence += 0.10; // More certain close to departure
  } else if (daysUntilDeparture > 60) {
    confidence -= 0.15; // Less certain far out
  }

  confidence = Math.max(0.40, Math.min(0.95, confidence));

  return {
    expectedFinalLoadFactor: Math.round(expectedLF * 100) / 100,
    demandTrend,
    confidence: Math.round(confidence * 100) / 100,
    seasonality,
    factors,
  };
}

export function registerRoutes(app: Express) {
  app.get('/api/aircraft', async (_req, res) => {
    const aircraft = await storage.getAllAircraft();
    res.json(aircraft);
  });

  // Authentication routes
  app.get('/api/auth/user', (req, res) => {
    res.json(req.user || null);
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: "Email and password are required" });
      return;
    }

    try {
      const user = await storage.getUserByEmail(email);
      if (!user || !(await bcrypt.compare(password, user.password))) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      // Update analytics
      await storage.updateUserLoginStats(user.id, {
        lastLogin: new Date(),
        visitCount: (user.visitCount || 0) + 1
      });

      // Set user in session
      req.session.userId = user.id;
      res.json({ success: true });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post('/api/auth/logout', (req, res) => {
    req.session.destroy(() => {
      res.json({ success: true });
    });
  });

  // Admin routes
  app.post('/api/admin/aircraft', requireAdmin, async (req, res) => {
    const parsed = insertAircraftSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error });
      return;
    }

    const aircraft = await storage.createAircraft(parsed.data);
    res.json(aircraft);
  });

  app.post('/api/calculations', async (req, res) => {
    const parsed = insertCalculationSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error });
      return;
    }

    const calculation = await storage.saveCalculation(parsed.data);
    res.json(calculation);
  });

  // Analytics routes - fail gracefully to avoid 5xx errors
  app.post('/api/analytics/pageview', async (req, res) => {
    const userId = req.session.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const { path, duration, deviceType, browser } = req.body;
    try {
      await storage.saveAnalytics({
        userId,
        path,
        duration,
        deviceType,
        browser,
        isAuthenticated: true
      });
    } catch (error) {
      // Log but don't fail - analytics is non-critical
      console.warn("Analytics save failed (non-critical):", error instanceof Error ? error.message : error);
    }
    res.json({ success: true });
  });

  app.post('/api/analytics/profile-click', async (req, res) => {
    const userId = req.session.userId;
    const { type } = req.body;

    if (!type || !['linkedin', 'email'].includes(type)) {
      res.status(400).json({ error: "Invalid click type" });
      return;
    }

    try {
      await storage.saveProfileClick({
        userId: userId || undefined,
        clickType: type,
        isAuthenticated: !!userId
      });
    } catch (error) {
      // Log but don't fail - analytics is non-critical
      console.warn("Profile click save failed (non-critical):", error instanceof Error ? error.message : error);
    }
    res.json({ success: true });
  });

  // ============ AI PRICING ENDPOINT ============
  // POST /api/pricing/ai - Get AI-powered pricing multiplier
  // Now supports optional forecastSignal for demand-based bias
  app.post('/api/pricing/ai', async (req, res) => {
    const {
      routeType,
      capacityUtilization,
      seasonIndex,
      daysUntilDeparture,
      basePrice,
      forecastSignal  // Optional: demand forecast signal for bias
    } = req.body;

    // Validate required fields
    if (!routeType || capacityUtilization === undefined || seasonIndex === undefined ||
        daysUntilDeparture === undefined || basePrice === undefined) {
      res.status(400).json({
        error: "Missing required fields",
        required: ["routeType", "capacityUtilization", "seasonIndex", "daysUntilDeparture", "basePrice"],
        optional: ["forecastSignal"]
      });
      return;
    }

    // Validate ranges
    if (capacityUtilization < 0 || capacityUtilization > 100) {
      res.status(400).json({ error: "capacityUtilization must be 0-100" });
      return;
    }

    if (seasonIndex < 0.5 || seasonIndex > 2.0) {
      res.status(400).json({ error: "seasonIndex must be 0.5-2.0" });
      return;
    }

    // Validate forecastSignal if provided
    if (forecastSignal !== undefined) {
      if (typeof forecastSignal !== "object" || forecastSignal === null) {
        res.status(400).json({ error: "forecastSignal must be an object" });
        return;
      }

      const { expectedFinalLoadFactor, demandTrend, confidence } = forecastSignal;

      if (expectedFinalLoadFactor === undefined || demandTrend === undefined || confidence === undefined) {
        res.status(400).json({
          error: "Invalid forecastSignal",
          required: ["expectedFinalLoadFactor", "demandTrend", "confidence"]
        });
        return;
      }

      if (expectedFinalLoadFactor < 0 || expectedFinalLoadFactor > 1) {
        res.status(400).json({ error: "forecastSignal.expectedFinalLoadFactor must be 0-1" });
        return;
      }

      if (!["up", "flat", "down"].includes(demandTrend)) {
        res.status(400).json({ error: "forecastSignal.demandTrend must be 'up', 'flat', or 'down'" });
        return;
      }

      if (confidence < 0 || confidence > 1) {
        res.status(400).json({ error: "forecastSignal.confidence must be 0-1" });
        return;
      }
    }

    try {
      // Get AI pricing with optional forecast bias
      const result = await getAIPricing({
        routeType,
        capacityUtilization,
        seasonIndex,
        daysUntilDeparture,
        basePrice,
        forecastSignal: forecastSignal as ForecastSignal | undefined,
      });

      // Build response
      const response: Record<string, unknown> = {
        aiMultiplier: result.multiplier,
        confidence: result.confidence,
        reasoning: result.reasoning,
        source: result.source,
      };

      // Include forecast info if applicable
      if (result.forecastApplied !== undefined) {
        response.forecastApplied = result.forecastApplied;
      }
      if (result.forecastBias !== undefined) {
        response.forecastBias = result.forecastBias;
      }

      res.json(response);
    } catch (error) {
      console.error("AI pricing error:", error);
      res.status(500).json({ error: "AI pricing calculation failed" });
    }
  });

  // ============ DEMAND FORECASTING ENDPOINT ============
  // POST /api/demand/forecast - Get demand signal (NOT pricing)
  // NOTE: This endpoint returns a DEMAND SIGNAL only.
  // It does NOT calculate prices or return pricing multipliers.
  // Pricing AI will consume this signal separately.
  app.post('/api/demand/forecast', (req, res) => {
    const {
      route,
      departureDate,
      currentBookings,
      aircraftCapacity,
      dayOfWeek,
      historicalLoadFactors,
    } = req.body;

    // Validate required fields
    if (!route || !departureDate || currentBookings === undefined ||
        aircraftCapacity === undefined || dayOfWeek === undefined) {
      res.status(400).json({
        error: "Missing required fields",
        required: ["route", "departureDate", "currentBookings", "aircraftCapacity", "dayOfWeek"],
        optional: ["historicalLoadFactors"]
      });
      return;
    }

    // Validate route format
    const isRouteType = typeof route === "string" || (route.type === "routeType" && route.value);
    const isOriginDest = route.type === "origin-destination" && route.origin && route.destination;
    if (!isRouteType && !isOriginDest) {
      res.status(400).json({
        error: "Invalid route format",
        expected: "string (routeType) OR { type: 'routeType', value: string } OR { type: 'origin-destination', origin: string, destination: string }"
      });
      return;
    }

    // Validate ranges
    if (currentBookings < 0 || currentBookings > 100) {
      res.status(400).json({ error: "currentBookings must be 0-100" });
      return;
    }

    if (aircraftCapacity < 1) {
      res.status(400).json({ error: "aircraftCapacity must be positive" });
      return;
    }

    if (dayOfWeek < 0 || dayOfWeek > 6) {
      res.status(400).json({ error: "dayOfWeek must be 0-6 (Sunday-Saturday)" });
      return;
    }

    // Validate optional historical data
    if (historicalLoadFactors !== undefined) {
      if (!Array.isArray(historicalLoadFactors)) {
        res.status(400).json({ error: "historicalLoadFactors must be an array of numbers" });
        return;
      }
      if (historicalLoadFactors.some((lf: unknown) => typeof lf !== "number" || lf < 0 || lf > 1)) {
        res.status(400).json({ error: "historicalLoadFactors values must be numbers between 0 and 1" });
        return;
      }
    }

    // Validate departure date
    const depDate = new Date(departureDate);
    if (isNaN(depDate.getTime())) {
      res.status(400).json({ error: "Invalid departureDate format (expected ISO date string)" });
      return;
    }

    try {
      // Normalize route input
      const normalizedRoute: RouteIdentifier = typeof route === "string"
        ? { type: "routeType", value: route }
        : route;

      const forecast = calculateExpectedLoadFactor({
        route: normalizedRoute,
        departureDate,
        currentBookings,
        aircraftCapacity,
        dayOfWeek,
        historicalLoadFactors,
      });

      // Return demand signal ONLY (no pricing data)
      res.json({
        expectedFinalLoadFactor: forecast.expectedFinalLoadFactor,
        demandTrend: forecast.demandTrend,
        confidence: forecast.confidence,
        seasonality: forecast.seasonality,
        // Debug info (can be removed in production)
        _debug: {
          factors: forecast.factors,
        },
      });
    } catch (error) {
      console.error("Demand forecast error:", error);
      res.status(500).json({ error: "Demand forecast calculation failed" });
    }
  });

  // ============ PASSENGER PRICING TYPES ============

  type TravelPurpose = "business" | "leisure" | "vfr" | "mixed";
  type FareClass = "economy" | "premiumEconomy" | "business" | "first";

  interface PassengerDemandInput {
    originIATA: string;
    destinationIATA: string;
    departureDate: string;
    returnDate?: string;
    departureDay: string;        // Monday, Tuesday, etc.
    departureTime: string;       // dawn, morning, afternoon, evening, night
    currentBookings: number;     // 0-100 percentage
    aircraftCapacity: number;
    travelPurpose?: TravelPurpose;
    fareClass?: FareClass;
  }

  interface PassengerDemandOutput {
    expectedFinalLoadFactor: number;
    demandTrend: "up" | "flat" | "down";
    confidence: number;
    seasonality: "low" | "shoulder" | "peak";
    travelPurposeMix: {
      business: number;
      leisure: number;
      vfr: number;
    };
    priceElasticity: "low" | "medium" | "high";
    factors: string[];
  }

  interface PassengerPricingInput {
    originIATA: string;
    destinationIATA: string;
    distance: number;
    fareClass: FareClass;
    travelPurpose: TravelPurpose;
    capacityUtilization: number;
    seasonIndex: number;
    daysUntilDeparture: number;
    basePrice: number;
    forecastSignal?: ForecastSignal;
  }

  // ============ PASSENGER PRICING CONSTANTS ============

  // Business hub cities for travel purpose detection
  const BUSINESS_HUBS = new Set([
    'JFK', 'LGA', 'EWR', 'LHR', 'LGW', 'LCY', 'HND', 'NRT', 'HKG', 'SIN',
    'FRA', 'ZRH', 'GVA', 'CDG', 'ORY', 'AMS', 'DXB', 'SFO', 'LAX', 'ORD',
    'DFW', 'IAH', 'BOS', 'SEA', 'MUC', 'IST', 'ICN', 'PEK', 'PVG', 'SYD'
  ]);

  // Leisure destination cities
  const LEISURE_DESTINATIONS = new Set([
    'CUN', 'MIA', 'MCO', 'LAS', 'HNL', 'BCN', 'PMI', 'AGP', 'FCO', 'VCE',
    'ATH', 'DPS', 'BKK', 'HKT', 'MLE', 'MRU', 'AKL', 'SXM', 'MBJ', 'PUJ',
    'SJD', 'OGG', 'NCE', 'SPU', 'DBV', 'AYT', 'DLM', 'BJV', 'SSH', 'HRG'
  ]);

  // Day of week passenger demand factors
  const PASSENGER_DOW_FACTORS: Record<string, { business: number; leisure: number }> = {
    'Monday': { business: 1.15, leisure: 0.85 },
    'Tuesday': { business: 1.05, leisure: 0.90 },
    'Wednesday': { business: 1.00, leisure: 0.95 },
    'Thursday': { business: 1.10, leisure: 0.95 },
    'Friday': { business: 1.05, leisure: 1.20 },
    'Saturday': { business: 0.70, leisure: 1.25 },
    'Sunday': { business: 0.85, leisure: 1.15 },
  };

  // Time of day factors
  const TIME_OF_DAY_FACTORS: Record<string, { business: number; leisure: number }> = {
    'dawn': { business: 1.20, leisure: 0.80 },    // 4-6 AM
    'morning': { business: 1.15, leisure: 1.00 }, // 6-12 PM
    'afternoon': { business: 0.90, leisure: 1.10 }, // 12-5 PM
    'evening': { business: 1.10, leisure: 0.95 }, // 5-9 PM
    'night': { business: 0.85, leisure: 0.90 },   // 9 PM+
  };

  // Fare class base price multipliers
  const FARE_CLASS_MULTIPLIERS: Record<FareClass, number> = {
    economy: 1.0,
    premiumEconomy: 1.45,
    business: 3.5,
    first: 6.0,
  };

  // Travel purpose price elasticity (how sensitive to price changes)
  const PRICE_ELASTICITY: Record<TravelPurpose, { elasticity: "low" | "medium" | "high"; multiplierRange: [number, number] }> = {
    business: { elasticity: "low", multiplierRange: [0.95, 1.60] },      // Less price sensitive
    leisure: { elasticity: "high", multiplierRange: [0.80, 1.35] },      // Very price sensitive
    vfr: { elasticity: "medium", multiplierRange: [0.85, 1.40] },        // Moderate sensitivity
    mixed: { elasticity: "medium", multiplierRange: [0.85, 1.50] },
  };

  // ============ PASSENGER DEMAND FORECASTING LOGIC ============

  /**
   * Detect travel purpose mix based on route characteristics
   */
  function detectTravelPurposeMix(
    origin: string,
    destination: string,
    departureDay: string,
    departureTime: string,
    seasonality: "low" | "shoulder" | "peak"
  ): { business: number; leisure: number; vfr: number } {
    let business = 33, leisure = 34, vfr = 33;

    // Route-based detection
    const isBusinessRoute = BUSINESS_HUBS.has(origin) && BUSINESS_HUBS.has(destination);
    const isLeisureRoute = LEISURE_DESTINATIONS.has(destination);

    if (isBusinessRoute) {
      business = 60;
      leisure = 25;
      vfr = 15;
    } else if (isLeisureRoute) {
      business = 15;
      leisure = 65;
      vfr = 20;
    }

    // Day of week adjustment
    const dowFactor = PASSENGER_DOW_FACTORS[departureDay] || { business: 1, leisure: 1 };
    business = Math.round(business * dowFactor.business);
    leisure = Math.round(leisure * dowFactor.leisure);

    // Time of day adjustment
    const todFactor = TIME_OF_DAY_FACTORS[departureTime] || { business: 1, leisure: 1 };
    business = Math.round(business * todFactor.business);
    leisure = Math.round(leisure * todFactor.leisure);

    // Season adjustment
    if (seasonality === "peak") {
      leisure = Math.round(leisure * 1.3);
      business = Math.round(business * 0.85);
    } else if (seasonality === "low") {
      leisure = Math.round(leisure * 0.7);
      business = Math.round(business * 1.1);
    }

    // Normalize to 100%
    const total = business + leisure + vfr;
    return {
      business: Math.round((business / total) * 100),
      leisure: Math.round((leisure / total) * 100),
      vfr: Math.round((vfr / total) * 100),
    };
  }

  /**
   * Calculate passenger demand forecast
   */
  function calculatePassengerDemand(input: PassengerDemandInput): PassengerDemandOutput {
    const factors: string[] = [];
    let confidence = 0.70;

    // Get seasonality
    const seasonality = getSeasonality(input.departureDate);
    factors.push(`Seasonality: ${seasonality}`);

    // Calculate days until departure
    const departureDate = new Date(input.departureDate);
    const today = new Date();
    const daysUntilDeparture = Math.max(0, Math.ceil((departureDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)));
    factors.push(`Days until departure: ${daysUntilDeparture}`);

    // Detect travel purpose mix
    const purposeMix = detectTravelPurposeMix(
      input.originIATA,
      input.destinationIATA,
      input.departureDay,
      input.departureTime,
      seasonality
    );
    factors.push(`Travel mix: B${purposeMix.business}%/L${purposeMix.leisure}%/V${purposeMix.vfr}%`);

    // Booking curve phase
    const phase = getBookingPhase(daysUntilDeparture);
    const level = getBookingLevel(input.currentBookings);
    const curveKey = `${phase}-${level}`;
    const curveMultiplier = BOOKING_CURVE_MULTIPLIERS[curveKey] || 1.0;
    factors.push(`Booking curve: ${phase}/${level} → ${curveMultiplier}x`);

    // Day of week impact
    const dowFactor = PASSENGER_DOW_FACTORS[input.departureDay];
    const weightedDowFactor = dowFactor
      ? (dowFactor.business * purposeMix.business + dowFactor.leisure * purposeMix.leisure) / 100
      : 1.0;
    factors.push(`Day factor: ${weightedDowFactor.toFixed(2)}x`);

    // Season factor
    const seasonFactor = seasonality === "peak" ? 1.20 : seasonality === "shoulder" ? 1.0 : 0.85;
    factors.push(`Season factor: ${seasonFactor}x`);

    // Calculate expected load factor
    let expectedLF = (input.currentBookings / 100) * curveMultiplier * weightedDowFactor * seasonFactor;

    // Business routes tend to fill later
    if (purposeMix.business > 50 && daysUntilDeparture > 7) {
      expectedLF *= 1.15; // Business travelers book later
      factors.push("Business route: late booking boost");
    }

    // Clamp to realistic bounds
    expectedLF = Math.max(0.25, Math.min(0.98, expectedLF));

    // Calculate demand trend
    const demandTrend = calculateDemandTrend(
      input.currentBookings,
      daysUntilDeparture,
      seasonality,
      undefined
    );
    factors.push(`Demand trend: ${demandTrend}`);

    // Determine price elasticity based on dominant travel purpose
    const dominantPurpose = purposeMix.business > purposeMix.leisure ? "business" : "leisure";
    const priceElasticity = PRICE_ELASTICITY[dominantPurpose].elasticity;
    factors.push(`Price elasticity: ${priceElasticity} (${dominantPurpose} dominant)`);

    // Adjust confidence
    if (daysUntilDeparture < 3) confidence += 0.15;
    else if (daysUntilDeparture > 45) confidence -= 0.15;

    if (purposeMix.business > 60 || purposeMix.leisure > 60) {
      confidence += 0.05; // Clear purpose = higher confidence
    }

    confidence = Math.max(0.45, Math.min(0.95, confidence));

    return {
      expectedFinalLoadFactor: Math.round(expectedLF * 100) / 100,
      demandTrend,
      confidence: Math.round(confidence * 100) / 100,
      seasonality,
      travelPurposeMix: purposeMix,
      priceElasticity,
      factors,
    };
  }

  // ============ PASSENGER PRICING LOGIC ============

  /**
   * Build system prompt for passenger ticket pricing
   */
  function buildPassengerSystemPrompt(): string {
    return `You are an airline revenue management AI for PASSENGER ticket pricing.

Rules:
- High load factor (>80%) = increase price
- Low load factor (<40%) = consider discount
- Business travelers (dawn/morning flights, weekdays, business hubs) = less price sensitive, can increase more
- Leisure travelers (weekend, holiday destinations) = more price sensitive, moderate increases only
- Short notice (<7 days) = premium pricing (especially business)
- Advance booking (>30 days) = early bird opportunities
- Peak season = higher prices for leisure, stable for business
- Business class = less elastic, can optimize more aggressively
- Economy class = more elastic, careful with increases

IMPORTANT: Return ONLY a single number between 0.80 and 1.60. No explanation.`;
  }

  /**
   * Build user message for passenger pricing
   */
  function buildPassengerUserMessage(input: PassengerPricingInput): string {
    return `Calculate ticket price multiplier for:
- Route: ${input.originIATA} → ${input.destinationIATA} (${input.distance}km)
- Fare class: ${input.fareClass}
- Travel purpose: ${input.travelPurpose}
- Capacity: ${input.capacityUtilization}%
- Season index: ${input.seasonIndex}
- Days until departure: ${input.daysUntilDeparture}

Reply with ONLY the number.`;
  }

  /**
   * Call HuggingFace for passenger pricing
   */
  async function callPassengerPricingHF(input: PassengerPricingInput): Promise<AIPricingResult | null> {
    if (!AI_CONFIG.HF_API_TOKEN) {
      return null;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), AI_CONFIG.HF_TIMEOUT_MS);

    try {
      const response = await fetch(
        `https://router.huggingface.co/${AI_CONFIG.HF_PROVIDER}/v1/chat/completions`,
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${AI_CONFIG.HF_API_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: AI_CONFIG.HF_MODEL,
            messages: [
              { role: "system", content: buildPassengerSystemPrompt() },
              { role: "user", content: buildPassengerUserMessage(input) },
            ],
            max_tokens: 10,
            temperature: 0.1,
          }),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        return null;
      }

      const data = await response.json() as HFChatResponse;
      const content = data.choices?.[0]?.message?.content;
      if (!content) return null;

      const multiplier = parseMultiplierResponse(content);
      if (multiplier === null) return null;

      // Apply travel purpose bounds
      const bounds = PRICE_ELASTICITY[input.travelPurpose].multiplierRange;
      const clampedMultiplier = Math.max(bounds[0], Math.min(bounds[1], multiplier));

      // Build reasoning
      const factors: string[] = [];
      if (input.capacityUtilization > 80) factors.push(`High demand (${input.capacityUtilization}%)`);
      if (input.capacityUtilization < 40) factors.push(`Low demand (${input.capacityUtilization}%)`);
      if (input.daysUntilDeparture <= 3) factors.push("Last-minute booking");
      if (input.daysUntilDeparture > 30) factors.push("Advance booking");
      if (input.travelPurpose === "business") factors.push("Business traveler (low elasticity)");
      if (input.travelPurpose === "leisure") factors.push("Leisure traveler (high elasticity)");

      return {
        multiplier: Math.round(clampedMultiplier * 100) / 100,
        confidence: 0.88,
        reasoning: factors.length > 0 ? `AI: ${factors.join(", ")}` : "AI: Standard conditions",
        source: "huggingface",
      };
    } catch {
      clearTimeout(timeoutId);
      return null;
    }
  }

  /**
   * Rule-based passenger pricing (fallback)
   */
  function calculatePassengerRuleBasedMultiplier(input: PassengerPricingInput): AIPricingResult {
    const factors: string[] = [];
    let confidence = 0.80;

    // Base multiplier from capacity
    let capacityMultiplier = 1.0;
    if (input.capacityUtilization > 85) {
      capacityMultiplier = 1 + ((input.capacityUtilization - 85) * 0.03);
      factors.push(`High load (${input.capacityUtilization}%) → premium`);
    } else if (input.capacityUtilization < 40) {
      capacityMultiplier = 0.85 + (input.capacityUtilization * 0.00375);
      factors.push(`Low load (${input.capacityUtilization}%) → stimulate demand`);
    }

    // Urgency factor
    let urgencyMultiplier = 1.0;
    if (input.daysUntilDeparture <= 2) {
      urgencyMultiplier = input.travelPurpose === "business" ? 1.45 : 1.25;
      factors.push("Last-minute premium");
    } else if (input.daysUntilDeparture <= 7) {
      urgencyMultiplier = input.travelPurpose === "business" ? 1.25 : 1.10;
      factors.push("Short notice");
    } else if (input.daysUntilDeparture > 30) {
      urgencyMultiplier = 0.90;
      factors.push("Early bird opportunity");
    }

    // Travel purpose adjustment
    let purposeMultiplier = 1.0;
    if (input.travelPurpose === "business") {
      purposeMultiplier = 1.08;
      factors.push("Business traveler (lower elasticity)");
    } else if (input.travelPurpose === "leisure" && input.seasonIndex > 1.1) {
      purposeMultiplier = 1.12;
      factors.push("Peak leisure season");
    }

    // Fare class adjustment
    let fareClassMultiplier = 1.0;
    if (input.fareClass === "business" || input.fareClass === "first") {
      fareClassMultiplier = 1.05;
      factors.push("Premium cabin pricing");
    }

    // Calculate raw multiplier
    const rawMultiplier = capacityMultiplier * urgencyMultiplier * input.seasonIndex * purposeMultiplier * fareClassMultiplier;

    // Apply travel purpose bounds
    const bounds = PRICE_ELASTICITY[input.travelPurpose].multiplierRange;
    const clampedMultiplier = Math.max(bounds[0], Math.min(bounds[1], rawMultiplier));

    factors.push(`Season: ${input.seasonIndex.toFixed(2)}`);

    return {
      multiplier: Math.round(clampedMultiplier * 100) / 100,
      confidence: Math.round(confidence * 100) / 100,
      reasoning: `Factors: ${factors.join("; ")}`,
      source: "rule-based",
    };
  }

  /**
   * Get passenger pricing (HF or rule-based)
   */
  async function getPassengerPricing(input: PassengerPricingInput): Promise<AIPricingResult> {
    let baseResult: AIPricingResult;

    if (AI_CONFIG.USE_HF && AI_CONFIG.HF_API_TOKEN) {
      const hfResult = await callPassengerPricingHF(input);
      if (hfResult) {
        baseResult = hfResult;
      } else {
        baseResult = calculatePassengerRuleBasedMultiplier(input);
      }
    } else {
      baseResult = calculatePassengerRuleBasedMultiplier(input);
    }

    // Apply forecast bias if provided
    const forecastBiasResult = calculateForecastBias(input.forecastSignal);

    const biasedMultiplier = baseResult.multiplier * forecastBiasResult.bias;

    // Re-apply bounds
    const bounds = PRICE_ELASTICITY[input.travelPurpose].multiplierRange;
    const finalMultiplier = Math.max(bounds[0], Math.min(bounds[1], biasedMultiplier));

    let reasoning = baseResult.reasoning;
    if (forecastBiasResult.explanation) {
      reasoning += `; ${forecastBiasResult.explanation}`;
    }

    return {
      multiplier: Math.round(finalMultiplier * 100) / 100,
      confidence: baseResult.confidence,
      reasoning,
      source: baseResult.source,
      forecastBias: forecastBiasResult.bias !== 1.0 ? Math.round(forecastBiasResult.bias * 100) / 100 : undefined,
      forecastApplied: forecastBiasResult.applied,
    };
  }

  // ============ PASSENGER DEMAND FORECAST ENDPOINT ============

  app.post('/api/passenger/demand/forecast', (req, res) => {
    const {
      originIATA,
      destinationIATA,
      departureDate,
      returnDate,
      departureDay,
      departureTime,
      currentBookings,
      aircraftCapacity,
      travelPurpose,
      fareClass,
    } = req.body;

    // Validate required fields
    if (!originIATA || !destinationIATA || !departureDate || !departureDay ||
        !departureTime || currentBookings === undefined || aircraftCapacity === undefined) {
      res.status(400).json({
        error: "Missing required fields",
        required: ["originIATA", "destinationIATA", "departureDate", "departureDay", "departureTime", "currentBookings", "aircraftCapacity"],
        optional: ["returnDate", "travelPurpose", "fareClass"]
      });
      return;
    }

    // Validate ranges
    if (currentBookings < 0 || currentBookings > 100) {
      res.status(400).json({ error: "currentBookings must be 0-100" });
      return;
    }

    try {
      const forecast = calculatePassengerDemand({
        originIATA,
        destinationIATA,
        departureDate,
        returnDate,
        departureDay,
        departureTime,
        currentBookings,
        aircraftCapacity,
        travelPurpose,
        fareClass,
      });

      res.json({
        expectedFinalLoadFactor: forecast.expectedFinalLoadFactor,
        demandTrend: forecast.demandTrend,
        confidence: forecast.confidence,
        seasonality: forecast.seasonality,
        travelPurposeMix: forecast.travelPurposeMix,
        priceElasticity: forecast.priceElasticity,
        _debug: {
          factors: forecast.factors,
        },
      });
    } catch (error) {
      console.error("Passenger demand forecast error:", error);
      res.status(500).json({ error: "Passenger demand forecast failed" });
    }
  });

  // ============ PASSENGER PRICING ENDPOINT ============

  app.post('/api/passenger/pricing/ai', async (req, res) => {
    const {
      originIATA,
      destinationIATA,
      distance,
      fareClass = "economy",
      travelPurpose = "mixed",
      capacityUtilization,
      seasonIndex,
      daysUntilDeparture,
      basePrice,
      forecastSignal,
    } = req.body;

    // Validate required fields
    if (!originIATA || !destinationIATA || distance === undefined ||
        capacityUtilization === undefined || seasonIndex === undefined ||
        daysUntilDeparture === undefined || basePrice === undefined) {
      res.status(400).json({
        error: "Missing required fields",
        required: ["originIATA", "destinationIATA", "distance", "capacityUtilization", "seasonIndex", "daysUntilDeparture", "basePrice"],
        optional: ["fareClass", "travelPurpose", "forecastSignal"]
      });
      return;
    }

    // Validate ranges
    if (capacityUtilization < 0 || capacityUtilization > 100) {
      res.status(400).json({ error: "capacityUtilization must be 0-100" });
      return;
    }

    if (seasonIndex < 0.5 || seasonIndex > 2.0) {
      res.status(400).json({ error: "seasonIndex must be 0.5-2.0" });
      return;
    }

    // Validate fare class
    const validFareClasses = ["economy", "premiumEconomy", "business", "first"];
    if (!validFareClasses.includes(fareClass)) {
      res.status(400).json({ error: `fareClass must be one of: ${validFareClasses.join(", ")}` });
      return;
    }

    // Validate travel purpose
    const validPurposes = ["business", "leisure", "vfr", "mixed"];
    if (!validPurposes.includes(travelPurpose)) {
      res.status(400).json({ error: `travelPurpose must be one of: ${validPurposes.join(", ")}` });
      return;
    }

    try {
      const result = await getPassengerPricing({
        originIATA,
        destinationIATA,
        distance,
        fareClass: fareClass as FareClass,
        travelPurpose: travelPurpose as TravelPurpose,
        capacityUtilization,
        seasonIndex,
        daysUntilDeparture,
        basePrice,
        forecastSignal: forecastSignal as ForecastSignal | undefined,
      });

      // Calculate recommended prices
      const fareClassMultiplier = FARE_CLASS_MULTIPLIERS[fareClass as FareClass];
      const recommendedPrice = Math.round(basePrice * fareClassMultiplier * result.multiplier);

      res.json({
        aiMultiplier: result.multiplier,
        confidence: result.confidence,
        reasoning: result.reasoning,
        source: result.source,
        forecastApplied: result.forecastApplied,
        forecastBias: result.forecastBias,
        // Additional passenger-specific data
        fareClassMultiplier,
        recommendedPrice,
        priceRange: {
          min: Math.round(recommendedPrice * 0.90),
          max: Math.round(recommendedPrice * 1.10),
        },
      });
    } catch (error) {
      console.error("Passenger pricing error:", error);
      res.status(500).json({ error: "Passenger pricing calculation failed" });
    }
  });

  // ============ CRM CHURN PREDICTION TYPES ============

  type LoyaltyTier = "none" | "bronze" | "silver" | "gold" | "platinum";
  type BookingChannel = "direct" | "ota" | "corporate" | "mixed";
  type FarePreference = "economy" | "premium" | "business" | "mixed";

  interface ChurnPredictionInput {
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
    loyaltyTier: LoyaltyTier;
    loyaltyPointsBalance: number;
    preferredBookingChannel: BookingChannel;
    farePreference: FarePreference;
    // Engagement
    emailOpenRate: number;       // 0-100
    appUsageLast30Days: number;  // number of sessions
    complaintsLast12Months: number;
    // Route patterns
    topRouteFrequency: number;   // times flown most frequent route
    uniqueDestinations: number;
  }

  interface ChurnRiskFactor {
    factor: string;
    impact: "high" | "medium" | "low";
    direction: "increases_risk" | "decreases_risk";
    score: number;
    description: string;
  }

  interface ChurnPredictionOutput {
    churnProbability: number;    // 0-1
    riskLevel: "low" | "medium" | "high" | "critical";
    confidence: number;          // 0-1
    predictedChurnWindow: string; // "30 days", "90 days", "180 days"
    factors: ChurnRiskFactor[];
    recommendations: string[];
    customerValue: "low" | "medium" | "high" | "vip";
    retentionPriority: number;   // 1-10
  }

  // ============ CHURN PREDICTION CONSTANTS ============

  // RFM scoring weights (Recency, Frequency, Monetary)
  const RFM_WEIGHTS = {
    recency: 0.35,
    frequency: 0.30,
    monetary: 0.20,
    engagement: 0.15,
  };

  // Recency thresholds (days)
  const RECENCY_THRESHOLDS = {
    active: 90,      // <90 days = active
    atRisk: 180,     // 90-180 days = at risk
    dormant: 365,    // 180-365 days = dormant
    churned: 730,    // >730 days = churned (24 months)
  };

  // Loyalty tier retention impact
  const LOYALTY_RETENTION_FACTORS: Record<LoyaltyTier, number> = {
    none: 0.0,
    bronze: 0.10,
    silver: 0.20,
    gold: 0.35,
    platinum: 0.50,
  };

  // ============ CHURN PREDICTION LOGIC ============

  /**
   * Calculate customer value segment
   */
  function calculateCustomerValue(
    totalSpend: number,
    frequency: number,
    loyaltyTier: LoyaltyTier
  ): "low" | "medium" | "high" | "vip" {
    const spendScore = totalSpend > 10000 ? 3 : totalSpend > 3000 ? 2 : totalSpend > 1000 ? 1 : 0;
    const freqScore = frequency > 12 ? 3 : frequency > 6 ? 2 : frequency > 2 ? 1 : 0;
    const loyaltyScore = loyaltyTier === "platinum" ? 3 : loyaltyTier === "gold" ? 2 : loyaltyTier === "silver" ? 1 : 0;

    const totalScore = spendScore + freqScore + loyaltyScore;

    if (totalScore >= 7) return "vip";
    if (totalScore >= 5) return "high";
    if (totalScore >= 3) return "medium";
    return "low";
  }

  /**
   * Calculate churn probability and risk factors
   */
  function calculateChurnPrediction(input: ChurnPredictionInput): ChurnPredictionOutput {
    const factors: ChurnRiskFactor[] = [];
    let baseChurnRisk = 0.15; // Base 15% churn risk

    // ========== RECENCY ANALYSIS ==========
    const daysSinceActivity = Math.min(input.daysSinceLastBooking, input.daysSinceLastFlight);

    if (daysSinceActivity > RECENCY_THRESHOLDS.churned) {
      baseChurnRisk += 0.50;
      factors.push({
        factor: "Inactivity",
        impact: "high",
        direction: "increases_risk",
        score: 50,
        description: `No activity for ${Math.round(daysSinceActivity / 30)} months - likely already churned`
      });
    } else if (daysSinceActivity > RECENCY_THRESHOLDS.dormant) {
      baseChurnRisk += 0.35;
      factors.push({
        factor: "Dormancy",
        impact: "high",
        direction: "increases_risk",
        score: 35,
        description: `No activity for ${Math.round(daysSinceActivity / 30)} months - high churn risk`
      });
    } else if (daysSinceActivity > RECENCY_THRESHOLDS.atRisk) {
      baseChurnRisk += 0.20;
      factors.push({
        factor: "At-Risk Period",
        impact: "medium",
        direction: "increases_risk",
        score: 20,
        description: `${Math.round(daysSinceActivity / 30)} months since last activity - intervention needed`
      });
    } else if (daysSinceActivity < 30) {
      baseChurnRisk -= 0.10;
      factors.push({
        factor: "Recent Activity",
        impact: "medium",
        direction: "decreases_risk",
        score: -10,
        description: "Active within last 30 days - engaged customer"
      });
    }

    // ========== FREQUENCY ANALYSIS ==========
    const yearlyFrequency = input.bookingsLast12Months;
    const frequencyTrend = input.bookingsLast12Months / Math.max(1, input.bookingsLast24Months - input.bookingsLast12Months);

    if (yearlyFrequency === 0) {
      baseChurnRisk += 0.25;
      factors.push({
        factor: "Zero Bookings",
        impact: "high",
        direction: "increases_risk",
        score: 25,
        description: "No bookings in last 12 months"
      });
    } else if (yearlyFrequency < 2) {
      baseChurnRisk += 0.10;
      factors.push({
        factor: "Low Frequency",
        impact: "medium",
        direction: "increases_risk",
        score: 10,
        description: "Only 1 booking in last 12 months"
      });
    } else if (yearlyFrequency >= 6) {
      baseChurnRisk -= 0.15;
      factors.push({
        factor: "High Frequency",
        impact: "medium",
        direction: "decreases_risk",
        score: -15,
        description: `${yearlyFrequency} bookings/year - loyal customer`
      });
    }

    // Declining frequency trend
    if (frequencyTrend < 0.5 && input.bookingsLast24Months > 2) {
      baseChurnRisk += 0.15;
      factors.push({
        factor: "Declining Activity",
        impact: "high",
        direction: "increases_risk",
        score: 15,
        description: "Booking frequency dropped significantly"
      });
    }

    // ========== MONETARY VALUE ==========
    if (input.totalSpendLast12Months > 10000) {
      baseChurnRisk -= 0.10;
      factors.push({
        factor: "High Value",
        impact: "medium",
        direction: "decreases_risk",
        score: -10,
        description: "High-spending customer"
      });
    } else if (input.totalSpendLast12Months < 500 && input.bookingsLast12Months > 0) {
      baseChurnRisk += 0.05;
      factors.push({
        factor: "Low Spend",
        impact: "low",
        direction: "increases_risk",
        score: 5,
        description: "Price-sensitive customer - may switch for deals"
      });
    }

    // ========== LOYALTY PROGRAM ==========
    const loyaltyRetention = LOYALTY_RETENTION_FACTORS[input.loyaltyTier];
    baseChurnRisk -= loyaltyRetention;

    if (input.loyaltyTier !== "none") {
      factors.push({
        factor: "Loyalty Status",
        impact: loyaltyRetention > 0.25 ? "high" : "medium",
        direction: "decreases_risk",
        score: Math.round(-loyaltyRetention * 100),
        description: `${input.loyaltyTier.charAt(0).toUpperCase() + input.loyaltyTier.slice(1)} member - ${Math.round(loyaltyRetention * 100)}% retention boost`
      });
    }

    // Points about to expire or low balance with high tier
    if (input.loyaltyPointsBalance > 50000) {
      baseChurnRisk -= 0.05;
      factors.push({
        factor: "Points Balance",
        impact: "low",
        direction: "decreases_risk",
        score: -5,
        description: "Significant points balance - invested in program"
      });
    }

    // ========== ENGAGEMENT ANALYSIS ==========
    if (input.emailOpenRate < 5) {
      baseChurnRisk += 0.08;
      factors.push({
        factor: "Low Email Engagement",
        impact: "medium",
        direction: "increases_risk",
        score: 8,
        description: "Not engaging with communications"
      });
    } else if (input.emailOpenRate > 30) {
      baseChurnRisk -= 0.05;
      factors.push({
        factor: "High Email Engagement",
        impact: "low",
        direction: "decreases_risk",
        score: -5,
        description: "Actively reading communications"
      });
    }

    if (input.appUsageLast30Days === 0 && input.bookingsLast12Months > 0) {
      baseChurnRisk += 0.05;
      factors.push({
        factor: "No App Usage",
        impact: "low",
        direction: "increases_risk",
        score: 5,
        description: "Not using mobile app - less engaged"
      });
    } else if (input.appUsageLast30Days > 10) {
      baseChurnRisk -= 0.05;
      factors.push({
        factor: "Active App User",
        impact: "low",
        direction: "decreases_risk",
        score: -5,
        description: "Regular app user - digitally engaged"
      });
    }

    // ========== COMPLAINTS ==========
    if (input.complaintsLast12Months >= 3) {
      baseChurnRisk += 0.20;
      factors.push({
        factor: "Multiple Complaints",
        impact: "high",
        direction: "increases_risk",
        score: 20,
        description: `${input.complaintsLast12Months} complaints - service recovery needed`
      });
    } else if (input.complaintsLast12Months === 1 || input.complaintsLast12Months === 2) {
      baseChurnRisk += 0.08;
      factors.push({
        factor: "Recent Complaint",
        impact: "medium",
        direction: "increases_risk",
        score: 8,
        description: "Has unresolved issues"
      });
    }

    // ========== ROUTE PATTERNS ==========
    if (input.uniqueDestinations === 1 && input.topRouteFrequency > 4) {
      // Single route commuter - stable but at risk if route changes
      factors.push({
        factor: "Route Dependency",
        impact: "medium",
        direction: "increases_risk",
        score: 5,
        description: "Flies only one route - vulnerable to competition"
      });
      baseChurnRisk += 0.05;
    } else if (input.uniqueDestinations > 5) {
      baseChurnRisk -= 0.05;
      factors.push({
        factor: "Diverse Traveler",
        impact: "low",
        direction: "decreases_risk",
        score: -5,
        description: "Multiple destinations - versatile customer"
      });
    }

    // ========== FINAL CALCULATIONS ==========
    // Clamp probability
    const churnProbability = Math.max(0.01, Math.min(0.99, baseChurnRisk));

    // Determine risk level
    let riskLevel: "low" | "medium" | "high" | "critical";
    if (churnProbability >= 0.75) riskLevel = "critical";
    else if (churnProbability >= 0.50) riskLevel = "high";
    else if (churnProbability >= 0.25) riskLevel = "medium";
    else riskLevel = "low";

    // Predicted churn window
    let predictedChurnWindow: string;
    if (churnProbability >= 0.75) predictedChurnWindow = "30 days";
    else if (churnProbability >= 0.50) predictedChurnWindow = "90 days";
    else if (churnProbability >= 0.25) predictedChurnWindow = "180 days";
    else predictedChurnWindow = "12+ months";

    // Calculate customer value
    const customerValue = calculateCustomerValue(
      input.totalSpendLast12Months,
      input.flightsLast12Months,
      input.loyaltyTier
    );

    // Retention priority (1-10) - higher value + higher risk = higher priority
    const valueScore = customerValue === "vip" ? 4 : customerValue === "high" ? 3 : customerValue === "medium" ? 2 : 1;
    const riskScore = riskLevel === "critical" ? 4 : riskLevel === "high" ? 3 : riskLevel === "medium" ? 2 : 1;
    const retentionPriority = Math.min(10, Math.round((valueScore * 1.5 + riskScore * 1.0) * 1.25));

    // Calculate confidence based on data completeness
    let confidence = 0.75;
    if (input.bookingsLast24Months > 5) confidence += 0.10;
    if (input.emailOpenRate > 0) confidence += 0.05;
    if (input.appUsageLast30Days > 0) confidence += 0.05;
    confidence = Math.min(0.95, confidence);

    // Generate recommendations
    const recommendations: string[] = [];

    if (riskLevel === "critical" || riskLevel === "high") {
      if (input.complaintsLast12Months > 0) {
        recommendations.push("Immediate service recovery outreach - address complaints personally");
      }
      if (customerValue === "vip" || customerValue === "high") {
        recommendations.push("Assign dedicated account manager for personalized retention");
      }
      recommendations.push("Offer exclusive win-back promotion (e.g., bonus miles, upgrade)");
    }

    if (riskLevel === "medium") {
      recommendations.push("Send personalized re-engagement email with targeted offer");
      if (input.loyaltyPointsBalance > 10000) {
        recommendations.push("Remind about points balance and redemption opportunities");
      }
    }

    if (input.emailOpenRate < 10) {
      recommendations.push("Test alternative communication channels (SMS, push notifications)");
    }

    if (input.loyaltyTier === "none" && input.bookingsLast12Months >= 2) {
      recommendations.push("Invite to loyalty program with sign-up bonus");
    }

    if (input.uniqueDestinations === 1) {
      recommendations.push("Promote new destinations with introductory pricing");
    }

    // Sort factors by impact
    factors.sort((a, b) => Math.abs(b.score) - Math.abs(a.score));

    return {
      churnProbability: Math.round(churnProbability * 100) / 100,
      riskLevel,
      confidence: Math.round(confidence * 100) / 100,
      predictedChurnWindow,
      factors: factors.slice(0, 6), // Top 6 factors
      recommendations: recommendations.slice(0, 4), // Top 4 recommendations
      customerValue,
      retentionPriority,
    };
  }

  // ============ CHURN PREDICTION ENDPOINT ============

  app.post('/api/crm/churn/predict', (req, res) => {
    const {
      customerId,
      daysSinceLastBooking,
      daysSinceLastFlight,
      bookingsLast12Months,
      bookingsLast24Months,
      flightsLast12Months,
      totalSpendLast12Months,
      averageTicketPrice,
      loyaltyTier = "none",
      loyaltyPointsBalance = 0,
      preferredBookingChannel = "mixed",
      farePreference = "economy",
      emailOpenRate = 15,
      appUsageLast30Days = 0,
      complaintsLast12Months = 0,
      topRouteFrequency = 0,
      uniqueDestinations = 1,
    } = req.body;

    // Validate required fields
    if (daysSinceLastBooking === undefined || daysSinceLastFlight === undefined ||
        bookingsLast12Months === undefined || bookingsLast24Months === undefined ||
        flightsLast12Months === undefined || totalSpendLast12Months === undefined ||
        averageTicketPrice === undefined) {
      res.status(400).json({
        error: "Missing required fields",
        required: [
          "daysSinceLastBooking", "daysSinceLastFlight", "bookingsLast12Months",
          "bookingsLast24Months", "flightsLast12Months", "totalSpendLast12Months",
          "averageTicketPrice"
        ],
        optional: [
          "customerId", "loyaltyTier", "loyaltyPointsBalance", "preferredBookingChannel",
          "farePreference", "emailOpenRate", "appUsageLast30Days", "complaintsLast12Months",
          "topRouteFrequency", "uniqueDestinations"
        ]
      });
      return;
    }

    // Validate loyalty tier
    const validTiers = ["none", "bronze", "silver", "gold", "platinum"];
    if (!validTiers.includes(loyaltyTier)) {
      res.status(400).json({ error: `loyaltyTier must be one of: ${validTiers.join(", ")}` });
      return;
    }

    try {
      const prediction = calculateChurnPrediction({
        customerId,
        daysSinceLastBooking,
        daysSinceLastFlight,
        bookingsLast12Months,
        bookingsLast24Months,
        flightsLast12Months,
        totalSpendLast12Months,
        averageTicketPrice,
        loyaltyTier: loyaltyTier as LoyaltyTier,
        loyaltyPointsBalance,
        preferredBookingChannel: preferredBookingChannel as BookingChannel,
        farePreference: farePreference as FarePreference,
        emailOpenRate,
        appUsageLast30Days,
        complaintsLast12Months,
        topRouteFrequency,
        uniqueDestinations,
      });

      res.json(prediction);
    } catch (error) {
      console.error("Churn prediction error:", error);
      res.status(500).json({ error: "Churn prediction failed" });
    }
  });

  // ============ AI OFFER RECOMMENDATION TYPES ============

  type OfferType =
    | "discount_light"      // 5-10% discount
    | "flexibility_upgrade" // change/refund flexibility
    | "loyalty_bonus"       // bonus miles/points
    | "ancillary_bundle"    // seat + baggage + lounge
    | "priority_service"    // fast track, priority boarding
    | "no_offer";           // AI recommends NOT making an offer

  type OfferIntensity = "low" | "medium" | "high";
  type TravelPurposeMixInput = { business: number; leisure: number; vfr: number };
  type PriceSensitivityLevel = "low" | "medium" | "high";

  interface OfferRecommendationInput {
    // From Churn Prediction (Faz B output)
    churnRiskScore: number;        // 0-1
    riskLevel: "low" | "medium" | "high" | "critical";
    customerValue: "low" | "medium" | "high" | "vip";
    loyaltyTier: LoyaltyTier;
    // Additional context
    travelPurposeMix: TravelPurposeMixInput;
    priceSensitivity: PriceSensitivityLevel;
    lastOfferAccepted?: boolean;
    daysSinceLastOffer?: number;
  }

  interface OfferRecommendationOutput {
    recommendedOfferType: OfferType;
    offerIntensity: OfferIntensity;
    confidence: number;
    reasoning: string[];
    doNotRecommend: OfferType[];
    alternativeOffer?: OfferType;
    expectedRetentionLift: number;  // percentage points
    costEfficiencyScore: number;    // 1-10
  }

  // ============ OFFER DECISION MATRIX ============

  // Offer type labels and descriptions
  const OFFER_TYPE_INFO: Record<OfferType, { label: string; cost: "low" | "medium" | "high"; description: string }> = {
    discount_light: { label: "Light Discount (5-10%)", cost: "medium", description: "Small price reduction to incentivize booking" },
    flexibility_upgrade: { label: "Flexibility Upgrade", cost: "low", description: "Free change/cancellation policy upgrade" },
    loyalty_bonus: { label: "Loyalty Bonus", cost: "low", description: "Bonus miles or points multiplier" },
    ancillary_bundle: { label: "Ancillary Bundle", cost: "medium", description: "Seat selection + baggage + lounge access" },
    priority_service: { label: "Priority Service", cost: "low", description: "Fast track, priority boarding, dedicated support" },
    no_offer: { label: "No Offer", cost: "low", description: "Customer doesn't need intervention" },
  };

  // Decision matrix: churn risk × customer value → base offer strategy
  const OFFER_DECISION_MATRIX: Record<string, { offer: OfferType; intensity: OfferIntensity; doNotOffer: OfferType[] }> = {
    // LOW CHURN RISK
    "low-vip": { offer: "no_offer", intensity: "low", doNotOffer: ["discount_light"] },
    "low-high": { offer: "no_offer", intensity: "low", doNotOffer: ["discount_light"] },
    "low-medium": { offer: "loyalty_bonus", intensity: "low", doNotOffer: [] },
    "low-low": { offer: "no_offer", intensity: "low", doNotOffer: ["ancillary_bundle", "priority_service"] },

    // MEDIUM CHURN RISK
    "medium-vip": { offer: "priority_service", intensity: "medium", doNotOffer: ["discount_light"] },
    "medium-high": { offer: "flexibility_upgrade", intensity: "medium", doNotOffer: [] },
    "medium-medium": { offer: "loyalty_bonus", intensity: "medium", doNotOffer: [] },
    "medium-low": { offer: "discount_light", intensity: "low", doNotOffer: ["ancillary_bundle", "priority_service"] },

    // HIGH CHURN RISK
    "high-vip": { offer: "ancillary_bundle", intensity: "high", doNotOffer: ["discount_light"] },
    "high-high": { offer: "flexibility_upgrade", intensity: "high", doNotOffer: [] },
    "high-medium": { offer: "discount_light", intensity: "medium", doNotOffer: [] },
    "high-low": { offer: "discount_light", intensity: "low", doNotOffer: ["ancillary_bundle", "priority_service"] },

    // CRITICAL CHURN RISK
    "critical-vip": { offer: "ancillary_bundle", intensity: "high", doNotOffer: [] },
    "critical-high": { offer: "flexibility_upgrade", intensity: "high", doNotOffer: [] },
    "critical-medium": { offer: "discount_light", intensity: "high", doNotOffer: [] },
    "critical-low": { offer: "discount_light", intensity: "medium", doNotOffer: ["ancillary_bundle", "priority_service"] },
  };

  // Travel purpose adjustments
  const PURPOSE_OFFER_PREFERENCES: Record<string, OfferType[]> = {
    business: ["flexibility_upgrade", "priority_service", "ancillary_bundle"],
    leisure: ["discount_light", "ancillary_bundle", "loyalty_bonus"],
    vfr: ["discount_light", "loyalty_bonus"],
  };

  // ============ OFFER RECOMMENDATION LOGIC ============

  /**
   * Calculate AI-powered offer recommendation
   */
  function calculateOfferRecommendation(input: OfferRecommendationInput): OfferRecommendationOutput {
    const reasoning: string[] = [];
    let confidence = 0.75;

    // Step 1: Get base offer from decision matrix
    const matrixKey = `${input.riskLevel}-${input.customerValue}`;
    const baseDecision = OFFER_DECISION_MATRIX[matrixKey] || {
      offer: "loyalty_bonus" as OfferType,
      intensity: "medium" as OfferIntensity,
      doNotOffer: [] as OfferType[],
    };

    let recommendedOffer = baseDecision.offer;
    let intensity = baseDecision.intensity;
    const doNotRecommend = [...baseDecision.doNotOffer];

    // Add base reasoning
    if (recommendedOffer === "no_offer") {
      reasoning.push(`${input.customerValue.toUpperCase()} value + ${input.riskLevel} churn risk → No intervention needed`);
    } else {
      reasoning.push(`${input.riskLevel.toUpperCase()} churn risk + ${input.customerValue.toUpperCase()} value → ${OFFER_TYPE_INFO[recommendedOffer].label}`);
    }

    // Step 2: Adjust based on travel purpose
    const dominantPurpose = input.travelPurposeMix.business > input.travelPurposeMix.leisure
      ? "business"
      : input.travelPurposeMix.leisure > input.travelPurposeMix.vfr
      ? "leisure"
      : "vfr";

    const preferredOffers = PURPOSE_OFFER_PREFERENCES[dominantPurpose];

    // If current offer doesn't match purpose preference, consider switching
    if (recommendedOffer !== "no_offer" && !preferredOffers.includes(recommendedOffer)) {
      const alternativeOffer = preferredOffers.find(o => !doNotRecommend.includes(o));
      if (alternativeOffer && dominantPurpose === "business" && input.travelPurposeMix.business > 0.5) {
        // Strong business traveler preference
        if (recommendedOffer === "discount_light") {
          recommendedOffer = "flexibility_upgrade";
          reasoning.push(`Business traveler (${Math.round(input.travelPurposeMix.business * 100)}%) → Flexibility over discount`);
        }
      }
    }

    // Business travelers: never recommend discount as primary
    if (dominantPurpose === "business" && input.travelPurposeMix.business > 0.6) {
      if (!doNotRecommend.includes("discount_light")) {
        doNotRecommend.push("discount_light");
        reasoning.push("Business-heavy profile → Discount not recommended");
      }
    }

    // Step 3: Adjust based on price sensitivity
    if (input.priceSensitivity === "high" && recommendedOffer !== "no_offer") {
      if (recommendedOffer !== "discount_light" && !doNotRecommend.includes("discount_light")) {
        // High price sensitivity - discount might be more effective
        if (input.customerValue !== "vip") {
          reasoning.push("High price sensitivity → Discount may be effective");
        }
      }
    } else if (input.priceSensitivity === "low") {
      // Low price sensitivity - avoid discounts, prefer service
      if (recommendedOffer === "discount_light" && input.customerValue !== "low") {
        recommendedOffer = "priority_service";
        reasoning.push("Low price sensitivity → Service over discount");
      }
    }

    // Step 4: Loyalty tier adjustments
    if (input.loyaltyTier === "platinum" || input.loyaltyTier === "gold") {
      if (!doNotRecommend.includes("discount_light")) {
        doNotRecommend.push("discount_light");
      }
      if (recommendedOffer === "discount_light") {
        recommendedOffer = "priority_service";
        reasoning.push(`${input.loyaltyTier.charAt(0).toUpperCase() + input.loyaltyTier.slice(1)} member → Premium service preferred`);
      }
      confidence += 0.05;
    }

    // Step 5: Offer fatigue check
    if (input.lastOfferAccepted === false && input.daysSinceLastOffer !== undefined && input.daysSinceLastOffer < 30) {
      // Recent rejected offer - be careful
      intensity = intensity === "high" ? "medium" : intensity === "medium" ? "low" : "low";
      reasoning.push("Recent offer rejected → Reduced intensity");
      confidence -= 0.10;
    }

    // Step 6: Calculate expected retention lift
    let expectedRetentionLift = 0;
    if (recommendedOffer !== "no_offer") {
      const baseRetention = input.riskLevel === "critical" ? 15 :
                           input.riskLevel === "high" ? 10 :
                           input.riskLevel === "medium" ? 5 : 2;
      const intensityMultiplier = intensity === "high" ? 1.3 : intensity === "medium" ? 1.0 : 0.7;
      expectedRetentionLift = Math.round(baseRetention * intensityMultiplier);
    }

    // Step 7: Calculate cost efficiency score (1-10)
    const offerCost = OFFER_TYPE_INFO[recommendedOffer].cost;
    const costScore = offerCost === "low" ? 9 : offerCost === "medium" ? 6 : 3;
    const valueMultiplier = input.customerValue === "vip" ? 1.2 :
                           input.customerValue === "high" ? 1.1 :
                           input.customerValue === "medium" ? 1.0 : 0.8;
    const costEfficiencyScore = Math.min(10, Math.round(costScore * valueMultiplier));

    // Step 8: Determine alternative offer
    let alternativeOffer: OfferType | undefined;
    if (recommendedOffer !== "no_offer") {
      const alternatives = preferredOffers.filter(o => o !== recommendedOffer && !doNotRecommend.includes(o));
      if (alternatives.length > 0) {
        alternativeOffer = alternatives[0];
      }
    }

    // Clamp confidence
    confidence = Math.max(0.50, Math.min(0.95, confidence));

    // Format reasoning as structured object for frontend
    const primaryDriver = reasoning[0] || "Decision matrix applied based on churn risk and customer value";
    const secondaryFactors = reasoning.slice(1).filter(r => !r.includes("guardrail") && !r.includes("excluded"));
    const guardrailsApplied = reasoning.filter(r => r.includes("guardrail") || r.includes("excluded") || r.includes("Discount excluded"));

    return {
      recommendedOfferType: recommendedOffer,
      offerIntensity: intensity,
      confidence: Math.round(confidence * 100) / 100,
      reasoning: {
        primaryDriver,
        secondaryFactors,
        guardrailsApplied,
      },
      doNotRecommend,
      alternativeOffer,
      expectedRetentionLift,
      costEfficiencyScore,
    };
  }

  // ============ OFFER RECOMMENDATION ENDPOINT ============

  app.post('/api/crm/offer/recommend', (req, res) => {
    const {
      churnRiskScore,
      riskLevel,
      customerValue,
      loyaltyTier = "none",
      travelPurposeMix: rawTravelPurposeMix,
      priceSensitivity = "medium",
      lastOfferAccepted,
      daysSinceLastOffer,
      lastOfferDate,
    } = req.body;

    // Convert travelPurposeMix from string to object if needed
    let travelPurposeMix: { business: number; leisure: number; vfr: number };
    if (typeof rawTravelPurposeMix === "string") {
      // Convert string format to object
      switch (rawTravelPurposeMix) {
        case "business":
          travelPurposeMix = { business: 0.7, leisure: 0.2, vfr: 0.1 };
          break;
        case "leisure":
          travelPurposeMix = { business: 0.2, leisure: 0.7, vfr: 0.1 };
          break;
        case "mixed":
        default:
          travelPurposeMix = { business: 0.33, leisure: 0.34, vfr: 0.33 };
      }
    } else {
      travelPurposeMix = rawTravelPurposeMix || { business: 0.33, leisure: 0.34, vfr: 0.33 };
    }

    // Calculate daysSinceLastOffer from lastOfferDate if provided
    let calculatedDaysSinceLastOffer = daysSinceLastOffer;
    if (lastOfferDate && !daysSinceLastOffer) {
      const offerDate = new Date(lastOfferDate);
      const today = new Date();
      calculatedDaysSinceLastOffer = Math.floor((today.getTime() - offerDate.getTime()) / (1000 * 60 * 60 * 24));
    }

    // Validate required fields
    if (churnRiskScore === undefined || !riskLevel || !customerValue) {
      res.status(400).json({
        error: "Missing required fields",
        required: ["churnRiskScore", "riskLevel", "customerValue"],
        optional: ["loyaltyTier", "travelPurposeMix", "priceSensitivity", "lastOfferAccepted", "daysSinceLastOffer"]
      });
      return;
    }

    // Validate risk level
    const validRiskLevels = ["low", "medium", "high", "critical"];
    if (!validRiskLevels.includes(riskLevel)) {
      res.status(400).json({ error: `riskLevel must be one of: ${validRiskLevels.join(", ")}` });
      return;
    }

    // Validate customer value
    const validValues = ["low", "medium", "high", "vip"];
    if (!validValues.includes(customerValue)) {
      res.status(400).json({ error: `customerValue must be one of: ${validValues.join(", ")}` });
      return;
    }

    // Validate loyalty tier
    const validTiers = ["none", "bronze", "silver", "gold", "platinum"];
    if (!validTiers.includes(loyaltyTier)) {
      res.status(400).json({ error: `loyaltyTier must be one of: ${validTiers.join(", ")}` });
      return;
    }

    try {
      const recommendation = calculateOfferRecommendation({
        churnRiskScore,
        riskLevel: riskLevel as "low" | "medium" | "high" | "critical",
        customerValue: customerValue as "low" | "medium" | "high" | "vip",
        loyaltyTier: loyaltyTier as LoyaltyTier,
        travelPurposeMix,
        priceSensitivity: priceSensitivity as PriceSensitivityLevel,
        lastOfferAccepted,
        daysSinceLastOffer: calculatedDaysSinceLastOffer,
      });

      res.json({
        ...recommendation,
        offerDetails: OFFER_TYPE_INFO[recommendation.recommendedOfferType],
      });
    } catch (error) {
      console.error("Offer recommendation error:", error);
      res.status(500).json({ error: "Offer recommendation failed" });
    }
  });

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.get('/api/admin/analytics', requireAdmin, async (_req, res) => {
    try {
      const [analytics, profileClicks] = await Promise.all([
        storage.getAnalytics(),
        storage.getProfileClicks()
      ]);

      // Process profile clicks data
      const profileClicksStats = {
        linkedin: profileClicks.filter(click => click.clickType === 'linkedin').length,
        email: profileClicks.filter(click => click.clickType === 'email').length,
        authenticatedClicks: profileClicks.filter(click => click.isAuthenticated).length,
        totalClicks: profileClicks.length
      };

      res.json({
        analytics,
        profileClicksStats
      });
    } catch (error) {
      console.error("Analytics fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
