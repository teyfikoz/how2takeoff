# How2TakeOff AI Decision Engine

> "Hangi müşteriye, hangi tip teklifin, hangi yoğunlukta ve neden önerildiğini açıklayabilen bir AI CRM çekirdeği."

---

## The Vision

How2TakeOff is not another airline analytics dashboard. It's an **AI-powered decision support platform** designed for airline revenue and CRM teams who need actionable insights, not data overload.

---

## Three-Phase Intelligence Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│                    HOW2TAKEOFF AI ENGINE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   [FAZ A: DEMAND → PRICE]                                       │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│   │   Route     │ → │   Demand    │ → │  Dynamic    │        │
│   │   Data      │    │   Forecast  │    │  Pricing    │        │
│   └─────────────┘    └─────────────┘    └─────────────┘        │
│                                                                 │
│   [FAZ B: CUSTOMER → RISK]                                      │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│   │   RFM       │ → │   Churn     │ → │  Customer   │        │
│   │   Analysis  │    │   Risk      │    │  Value      │        │
│   └─────────────┘    └─────────────┘    └─────────────┘        │
│                                                                 │
│   [FAZ C: RISK → ACTION]                                        │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐        │
│   │   Decision  │ → │   Offer     │ → │  Retention  │        │
│   │   Matrix    │    │   Strategy  │    │  Action     │        │
│   └─────────────┘    └─────────────┘    └─────────────┘        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Faz A: Revenue Intelligence

**Problem:** Airlines lose millions in revenue due to suboptimal pricing.

**Solution:** AI-powered demand forecasting and dynamic ticket pricing.

| Input | AI Processing | Output |
|-------|---------------|--------|
| Route, Date, Season | Demand patterns, Competitor analysis | Demand Score (0-100) |
| Passenger Type, Fare Class | Price elasticity modeling | Optimal Price Range |
| Historical Data | Trend analysis | Confidence Level |

**Key Differentiator:** Travel purpose detection (Business vs Leisure vs VFR) drives pricing strategy.

---

## Faz B: Customer Risk Intelligence

**Problem:** Acquiring a new customer costs 5x more than retaining an existing one.

**Solution:** AI-powered churn prediction using RFM analysis.

| Metric | What We Measure | Why It Matters |
|--------|-----------------|----------------|
| **R**ecency | Days since last booking | Engagement signal |
| **F**requency | Bookings per period | Loyalty indicator |
| **M**onetary | Total spend | Value classification |

**Output:**
- Churn Probability (0-100%)
- Risk Level (Low → Critical)
- Customer Value (Low → VIP)
- Retention Priority Score (1-10)

---

## Faz C: Action Intelligence

**Problem:** CRM teams don't know which offer to send to which customer.

**Solution:** Policy-driven, explainable offer recommendations.

### The Decision Matrix

```
                    Customer Value
                 Low    Medium   High    VIP
            ┌────────┬────────┬────────┬────────┐
    Low     │   -    │   -    │   -    │ NO_OFF │
            ├────────┼────────┼────────┼────────┤
Churn Medium│ Disc   │ Flex   │ Loyalty│ NO_OFF │
Risk        ├────────┼────────┼────────┼────────┤
    High    │ Disc   │ Flex   │ Bundle │ Priority│
            ├────────┼────────┼────────┼────────┤
  Critical  │ Disc   │ Bundle │ Bundle │ Priority│
            └────────┴────────┴────────┴────────┘
```

### Controlled Offer Vocabulary (6 Types)

| Type | Description | Cost | Best For |
|------|-------------|------|----------|
| `discount_light` | 5-10% discount | Low | Price-sensitive leisure |
| `flexibility_upgrade` | Free change/refund | Medium | Business travelers |
| `loyalty_bonus` | 2x-3x miles | Low | Engaged members |
| `ancillary_bundle` | Seat + bag + lounge | High | High-value at-risk |
| `priority_service` | Fast track + boarding | Medium | VIP retention |
| `no_offer` | No intervention needed | Zero | Loyal, low-risk |

---

## Why "no_offer" Matters

Most systems optimize for sending more offers. We optimize for **sending the right offers**.

`no_offer` is our AI maturity indicator:
- VIP + Low Churn → **No offer needed** (relationship is strong)
- Recent offer rejected → **Wait before next contact** (fatigue prevention)
- Already retained → **Don't over-promote** (margin protection)

**This saves money and protects customer relationships.**

---

## Enterprise-Grade Guardrails

| Guardrail | Rule | Business Reason |
|-----------|------|-----------------|
| VIP Protection | VIP + Low Churn = No Offer | Don't discount loyal VIPs |
| Budget Control | Low Value + High Churn = Discount Only | Control acquisition cost |
| Fatigue Prevention | Rejected within 30 days = Lower Intensity | Preserve relationship |
| Channel Fit | Business Traveler = No Discount | Service over price |

---

## Integration Points

```
Airline Systems                How2TakeOff API
┌──────────────┐              ┌────────────────────┐
│ Booking      │─────────────→│ /passenger/pricing │
│ Engine       │              │ /passenger/demand  │
├──────────────┤              ├────────────────────┤
│ CRM          │─────────────→│ /crm/churn/predict │
│ Platform     │              │ /crm/offer/recommend│
├──────────────┤              ├────────────────────┤
│ Marketing    │←─────────────│ Offer Strategy     │
│ Automation   │              │ + Reasoning        │
└──────────────┘              └────────────────────┘
```

---

## Not a Demo. Decision Support.

| What We Are | What We're Not |
|-------------|----------------|
| Decision support system | Fully automated campaign engine |
| Explainable AI | Black-box predictions |
| Policy-driven recommendations | Free-text generation |
| Human-in-the-loop | Replace human judgment |
| Pilot-ready prototype | Production-scaled platform |

---

## Technical Specifications

- **AI Backend:** Together AI (Llama 3.3 70B)
- **Response Time:** < 2 seconds per prediction
- **Confidence Threshold:** ≥ 60% for actionable recommendations
- **API:** RESTful JSON endpoints
- **No PII Storage:** Predictions are stateless

---

## Contact

**Website:** https://how2takeoff.com
**Platform Status:** Enterprise Decision Support Prototype
**Next Phase:** Pilot program with airline partners

---

*How2TakeOff: Where aviation expertise meets AI intelligence.*
