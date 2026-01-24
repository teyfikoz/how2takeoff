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
  // HuggingFace settings - using Novita provider with Llama
  HF_PROVIDER: "novita",
  HF_MODEL: "meta-llama/Llama-3.3-70B-Instruct",
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
