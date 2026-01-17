// AI Routes for aircraft recommendations
import { Router } from "express";
import { DecisionEngine } from "../ai/decision-engine";

const router = Router();

/**
 * POST /api/ai/recommend
 * Aircraft recommendation endpoint with economic parameters
 *
 * Body: {
 *   origin: "IST",
 *   destination: "SIN",
 *   passengers: 280,
 *   cargo: 10000 (optional),
 *   rask: 0.12 (optional - Revenue per ASK),
 *   cask: 0.08 (optional - Cost per ASK),
 *   loadFactor: 0.80 (optional - Expected load factor),
 *   fuelPrice: 0.75 (optional - Fuel price per liter)
 * }
 */
router.post("/recommend", async (req, res) => {
  try {
    const {
      origin,
      destination,
      passengers,
      cargo = 0,
      rask,
      cask,
      loadFactor,
      fuelPrice
    } = req.body;

    // Validate inputs
    if (!origin || !destination || !passengers) {
      return res.status(400).json({
        error: "Missing required fields: origin, destination, passengers"
      });
    }

    // Initialize decision engine
    const engine = new DecisionEngine();

    // Build economic parameters
    const economicParams = {
      rask: rask ? Number(rask) : undefined,
      cask: cask ? Number(cask) : undefined,
      loadFactor: loadFactor ? Number(loadFactor) : undefined,
      fuelPrice: fuelPrice ? Number(fuelPrice) : undefined
    };

    // Get recommendations
    const recommendations = await engine.recommend(
      origin,
      destination,
      Number(passengers),
      Number(cargo),
      undefined, // preferences
      economicParams
    );

    // Generate simple explanation
    const top = recommendations[0];
    const second = recommendations[1];
    const usedLoadFactor = economicParams.loadFactor ?? 0.80;

    let explanation = `The ${top.aircraft} is the best choice for your route. `;

    if (second) {
      const profitDiff = Math.round(((top.profit - second.profit) / Math.abs(second.profit || 1)) * 100);
      const fuelDiff = Math.round(((second.fuelEfficiency - top.fuelEfficiency) / second.fuelEfficiency) * 100);

      explanation += `Compared to ${second.aircraft}, it offers `;
      if (profitDiff > 0) {
        explanation += `${profitDiff}% higher profitability `;
      }
      if (fuelDiff > 0) {
        explanation += `and ${fuelDiff}% better fuel efficiency. `;
      }
    }

    explanation += `Expected profit: $${Math.round(top.profit).toLocaleString()} per flight at ${Math.round(usedLoadFactor * 100)}% load factor.`;

    res.json({
      success: true,
      recommendations: recommendations.slice(0, 5),
      explanation,
      route: {
        origin,
        destination,
        passengers,
        cargo
      },
      economicParams: {
        rask: economicParams.rask ?? 0.12,
        cask: economicParams.cask ?? 0.08,
        loadFactor: usedLoadFactor,
        fuelPrice: economicParams.fuelPrice ?? 0.75
      }
    });

  } catch (error: any) {
    console.error("AI recommendation error:", error);
    res.status(500).json({
      error: error.message || "Failed to generate recommendations"
    });
  }
});

export default router;
