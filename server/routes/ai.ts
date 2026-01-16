// AI Routes for aircraft recommendations
import { Router } from "express";
import { DecisionEngine } from "../ai/decision-engine";

const router = Router();

/**
 * POST /api/ai/recommend
 * Simple aircraft recommendation endpoint
 *
 * Body: {
 *   origin: "IST",
 *   destination: "SIN",
 *   passengers: 280,
 *   cargo: 10000 (optional)
 * }
 */
router.post("/recommend", async (req, res) => {
  try {
    const { origin, destination, passengers, cargo = 0 } = req.body;

    // Validate inputs
    if (!origin || !destination || !passengers) {
      return res.status(400).json({
        error: "Missing required fields: origin, destination, passengers"
      });
    }

    // Initialize decision engine
    const engine = new DecisionEngine();

    // Get recommendations
    const recommendations = await engine.recommend(
      origin,
      destination,
      Number(passengers),
      Number(cargo)
    );

    // Generate simple explanation
    const top = recommendations[0];
    const second = recommendations[1];

    let explanation = `The ${top.aircraft} is the best choice for your route. `;

    if (second) {
      const profitDiff = Math.round(((top.profit - second.profit) / second.profit) * 100);
      const fuelDiff = Math.round(((second.fuelEfficiency - top.fuelEfficiency) / second.fuelEfficiency) * 100);

      explanation += `Compared to ${second.aircraft}, it offers `;
      if (profitDiff > 0) {
        explanation += `${profitDiff}% higher profitability `;
      }
      if (fuelDiff > 0) {
        explanation += `and ${fuelDiff}% better fuel efficiency. `;
      }
    }

    explanation += `Expected profit: $${Math.round(top.profit).toLocaleString()} per flight at 80% load factor.`;

    res.json({
      success: true,
      recommendations: recommendations.slice(0, 5),
      explanation,
      route: {
        origin,
        destination,
        passengers,
        cargo
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
