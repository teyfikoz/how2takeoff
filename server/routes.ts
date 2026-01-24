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

interface AIPricingInput {
  routeType: string;
  capacityUtilization: number;
  seasonIndex: number;
  daysUntilDeparture: number;
  basePrice: number;
}

interface AIPricingResult {
  multiplier: number;
  confidence: number;
  reasoning: string;
  source: "huggingface" | "rule-based";
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
 * Get AI pricing - tries HuggingFace first, falls back to rule-based
 */
async function getAIPricing(input: AIPricingInput): Promise<AIPricingResult> {
  // Try HuggingFace if enabled and configured
  if (AI_CONFIG.USE_HF && AI_CONFIG.HF_API_TOKEN) {
    const hfResult = await callHuggingFace(input);
    if (hfResult) {
      return hfResult;
    }
    console.log("HF failed, falling back to rule-based");
  }

  // Fallback to rule-based
  return calculateRuleBasedMultiplier(input);
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
  app.post('/api/pricing/ai', async (req, res) => {
    const { routeType, capacityUtilization, seasonIndex, daysUntilDeparture, basePrice } = req.body;

    // Validate required fields
    if (!routeType || capacityUtilization === undefined || seasonIndex === undefined ||
        daysUntilDeparture === undefined || basePrice === undefined) {
      res.status(400).json({
        error: "Missing required fields",
        required: ["routeType", "capacityUtilization", "seasonIndex", "daysUntilDeparture", "basePrice"]
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

    try {
      // Get AI pricing (HuggingFace if enabled, else rule-based)
      const result = await getAIPricing({
        routeType,
        capacityUtilization,
        seasonIndex,
        daysUntilDeparture,
        basePrice
      });

      res.json({
        aiMultiplier: result.multiplier,
        confidence: result.confidence,
        reasoning: result.reasoning,
        source: result.source,
      });
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
