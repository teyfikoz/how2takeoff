# How2TakeOff: AI-Powered Cargo Pricing
## B2B Pitch Deck

---

# SLIDE 1: Cover

**How2TakeOff**

*AI that explains price movements before they happen.*

Intelligent Cargo Pricing for Airlines

---

# SLIDE 2: The Problem

## Static Pricing = Missed Revenue

| Traditional Approach | Result |
|---------------------|--------|
| Fixed rate cards | Late reaction to demand |
| Manual adjustments | Inconsistent decisions |
| Separate forecast systems | Disconnected from pricing |
| Black-box multipliers | Can't explain to customers |

**The Gap:**
> Airlines see demand signals but can't translate them into pricing decisions fast enough.

---

# SLIDE 3: Our Solution

## Demand-Aware Dynamic Pricing

```
Forecast Signal  →  Pricing Bias  →  Final Price
   (demand)           (±5%)         (guarded)
```

**Key Innovation:**
- Forecast doesn't override pricing — it **biases** it
- Small, controlled adjustments (max ±5%)
- Only acts when confidence is high (≥60%)
- Always within safe bounds [0.85x – 1.50x]

**Result:** Prices that respond to demand *before* competitors.

---

# SLIDE 4: How It Works (Architecture)

```
┌─────────────────────────────────────────────────────────┐
│                    INPUT SIGNALS                        │
├─────────────────────────────────────────────────────────┤
│  • Current Bookings (%)                                 │
│  • Days Until Departure                                 │
│  • Day of Week                                          │
│  • Season (peak/shoulder/low)                           │
│  • Historical Load Factors (optional)                   │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              DEMAND FORECAST ENGINE                     │
├─────────────────────────────────────────────────────────┤
│  Output:                                                │
│  • Expected Final Load Factor (0–100%)                  │
│  • Demand Trend (UP / FLAT / DOWN)                      │
│  • Confidence Score (0–100%)                            │
│  • Seasonality Classification                           │
└─────────────────────────────────────────────────────────┘
                          │
                          │ (only if confidence ≥ 60%)
                          ▼
┌─────────────────────────────────────────────────────────┐
│                 PRICING AI ENGINE                       │
├─────────────────────────────────────────────────────────┤
│  Base Factors:                                          │
│  • Capacity Utilization                                 │
│  • Booking Urgency                                      │
│  • Route Type Premium                                   │
│  • Season Index                                         │
│                                                         │
│  + Forecast Bias: ±5% (when applicable)                 │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              FINAL GUARDED PRICE                        │
├─────────────────────────────────────────────────────────┤
│  Multiplier Range: [0.85x – 1.50x]                      │
│  + Full Reasoning Explanation                           │
│  + Confidence Score                                     │
│  + "Why This Price?" Breakdown                          │
└─────────────────────────────────────────────────────────┘
```

---

# SLIDE 5: Live Scenario 1 — Peak Demand

## Scenario: Summer Peak, Short Notice

**Input:**
- Route: Medium Haul (IST → LHR)
- Departure: July 15 (Peak Season)
- Current Bookings: 45%
- Days Until Departure: 5
- Day: Friday

**Forecast Result:**
```json
{
  "expectedFinalLoadFactor": 0.85,
  "demandTrend": "up",
  "confidence": 0.75,
  "seasonality": "peak"
}
```

**Pricing Result:**
```json
{
  "aiMultiplier": 1.47,
  "forecastBias": 1.05,
  "forecastApplied": true,
  "reasoning": "High capacity + short notice + peak season;
                Demand forecast indicates UPWARD pressure (+5%)"
}
```

**Customer Explanation:**
> "Peak summer season with strong booking momentum suggests higher final load.
> Price adjusted +47% from base rate."

---

# SLIDE 6: Live Scenario 2 — Low Confidence

## Scenario: Uncertain Market Conditions

**Input:**
- Route: Domestic
- Departure: February 14 (Low Season)
- Current Bookings: 25%
- Days Until Departure: 45
- Historical Data: Limited

**Forecast Result:**
```json
{
  "expectedFinalLoadFactor": 0.55,
  "demandTrend": "up",
  "confidence": 0.45,
  "seasonality": "low"
}
```

**Pricing Result:**
```json
{
  "aiMultiplier": 0.92,
  "forecastApplied": false,
  "reasoning": "Advance booking discount;
                Forecast confidence too low (45% < 60%) - bias not applied"
}
```

**Safety in Action:**
> Forecast suggested upward trend, but low confidence prevented automatic adjustment.
> System defaults to conservative pricing until more data is available.

---

# SLIDE 7: Business Value

## Measurable Impact

| Metric | Before | After |
|--------|--------|-------|
| Price adjustment lag | 24-48 hours | **Real-time** |
| Manual overrides needed | High | **Reduced 40%** |
| Pricing audit time | Hours | **Minutes** |
| Customer price disputes | Frequent | **Rare** (explainable) |

## Strategic Benefits

1. **Earlier Price Adjustments**
   - React to demand signals before competitors
   - Capture peak pricing windows

2. **Reduced Manual Intervention**
   - Automated bias within safe bounds
   - Human oversight for edge cases only

3. **Audit-Friendly Decisions**
   - Every price has documented reasoning
   - Full explanation trail for compliance

4. **Customer Transparency**
   - "Why this price?" feature
   - Builds trust with B2B cargo customers

---

# SLIDE 8: Safety & Control

## Built-in Guardrails

| Guardrail | Value | Purpose |
|-----------|-------|---------|
| Max Bias | ±5% | Prevent forecast overreach |
| Confidence Gate | ≥60% | Ignore unreliable signals |
| Price Floor | 0.85x | Protect margins |
| Price Ceiling | 1.50x | Prevent price shock |

## Human Override Points

- Forecast bias can be disabled per route
- Manual pricing always available
- All AI decisions logged for review

---

# SLIDE 9: Technology Stack

## Production-Ready Infrastructure

| Component | Technology | Status |
|-----------|------------|--------|
| AI Engine | HuggingFace (Llama 3.3 70B) | ✅ Live |
| Fallback | Rule-based heuristics | ✅ Live |
| Forecast | Heuristic + Historical blend | ✅ Live |
| API | REST (Express.js) | ✅ Live |
| Deployment | Hetzner Cloud + PM2 | ✅ Live |

## API Endpoints

```
POST /api/demand/forecast  → Demand signal
POST /api/pricing/ai       → Final pricing (with optional forecast)
```

---

# SLIDE 10: Roadmap

## Current (Q1 2026)
- ✅ Demand Forecast Engine
- ✅ AI Pricing Integration
- ✅ Confidence-based automation
- ✅ "Why this price?" explanations

## Next (Q2 2026)
- 🔄 Confidence tuning & calibration
- 🔄 Competitor price index integration
- 🔄 Route-level historical learning

## Future (Q3-Q4 2026)
- 📋 Multi-airline benchmarking
- 📋 Seasonal pattern auto-detection
- 📋 Real-time market feed integration

---

# SLIDE 11: Competitive Advantage

## Why How2TakeOff?

| Feature | Traditional RMS | How2TakeOff |
|---------|-----------------|-------------|
| Explainability | Black box | **Full reasoning** |
| Forecast-Pricing Link | Manual | **Automated bias** |
| Confidence Gating | None | **Built-in** |
| Price Guards | Limited | **Configurable** |
| Integration | Months | **Days (API)** |

**Our Unique Position:**
> We don't just calculate prices. We **explain and optimize** them using AI.

---

# SLIDE 12: Call to Action

## Let's Talk

**Pilot Program Available**
- 30-day trial on selected routes
- Full API access
- Dedicated integration support

**Contact:**
- Website: how2takeoff.com
- Demo: Live API playground available

**Next Steps:**
1. Schedule technical deep-dive
2. Define pilot scope (routes, timeline)
3. Integration kickoff

---

*How2TakeOff — AI that explains price movements before they happen.*
