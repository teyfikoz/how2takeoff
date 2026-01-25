# AI Explainability Layer

> Every recommendation comes with a "why" and a "what would change it."

---

## Why Explainability Matters

In enterprise AI, a recommendation without reasoning is just a guess. Our explainability layer ensures:

1. **Regulatory Compliance** - GDPR, AI Act, and industry regulations require explainable decisions
2. **Team Learning** - CRM teams improve by understanding AI logic
3. **Trust Building** - Stakeholders accept AI when they understand it
4. **Audit Readiness** - Every decision has a traceable reasoning chain

---

## Explainability Structure

Every How2TakeOff AI response includes three explainability components:

### 1. Primary Driver
The single most important factor in the decision.

```json
{
  "primaryDriver": "High churn probability (72%) indicates immediate intervention needed"
}
```

### 2. Secondary Factors
Supporting factors that shaped the recommendation.

```json
{
  "secondaryFactors": [
    "VIP customer status → Premium service preferred over discount",
    "Business travel pattern (65%) → Flexibility valued",
    "No recent complaints → Relationship not damaged",
    "Gold loyalty tier → Discount excluded by policy"
  ]
}
```

### 3. Guardrails Applied
Policies that constrained or redirected the recommendation.

```json
{
  "guardrailsApplied": [
    "VIP + Low Churn guardrail: Checked but not triggered (churn is high)",
    "Discount exclusion: Applied for Gold+ members",
    "Offer fatigue: No recent offers detected"
  ]
}
```

---

## "What Would Change the Decision?"

For each recommendation, we explain the decision boundaries:

### Example: Current Recommendation is `flexibility_upgrade`

| If This Changed... | New Recommendation Would Be... |
|-------------------|-------------------------------|
| Churn drops below 25% | `no_offer` (relationship stable) |
| Customer value drops to "low" | `discount_light` (cost control) |
| Travel purpose shifts to leisure | `loyalty_bonus` (miles motivation) |
| Recent offer was rejected | Lower intensity, same type |
| Loyalty tier drops to Bronze | `discount_light` becomes available |

### Example: Current Recommendation is `no_offer`

| If This Changed... | New Recommendation Would Be... |
|-------------------|-------------------------------|
| Churn rises above 25% | `loyalty_bonus` or `flexibility_upgrade` |
| Customer value drops from VIP | `priority_service` might apply |
| Engagement drops significantly | `ancillary_bundle` for re-engagement |

---

## Churn Prediction Explainability

### Risk Factors Output

Each churn prediction includes scored factors:

```json
{
  "factors": [
    {
      "factor": "Booking Recency",
      "impact": "high",
      "direction": "increases_risk",
      "score": 25,
      "description": "245 days since last booking - significantly above 90-day threshold"
    },
    {
      "factor": "Engagement Decline",
      "impact": "high",
      "direction": "increases_risk",
      "score": 20,
      "description": "Email open rate dropped to 5% - below 10% engagement threshold"
    },
    {
      "factor": "Loyalty Investment",
      "impact": "medium",
      "direction": "decreases_risk",
      "score": -10,
      "description": "22,000 points balance creates switching cost"
    }
  ]
}
```

### Factor Categories

| Category | Factors Analyzed | Weight |
|----------|------------------|--------|
| Recency | Days since booking, Days since flight | 30% |
| Frequency | Booking trend, Flight frequency | 25% |
| Monetary | Spend trend, Ticket price changes | 20% |
| Engagement | Email opens, App usage, Complaints | 15% |
| Loyalty | Tier, Points balance, Program engagement | 10% |

---

## Pricing Explainability

### Demand Forecast Reasoning

```json
{
  "demandExplanation": {
    "baseScore": 65,
    "adjustments": [
      { "factor": "Peak season", "adjustment": "+15" },
      { "factor": "Business route", "adjustment": "+10" },
      { "factor": "Competitor capacity reduced", "adjustment": "+8" }
    ],
    "finalScore": 98,
    "interpretation": "Very high demand expected - premium pricing justified"
  }
}
```

### Price Elasticity Reasoning

```json
{
  "elasticityExplanation": {
    "travelPurpose": "Business (detected from booking pattern)",
    "elasticity": "Low",
    "implication": "Price increases have minimal impact on demand",
    "recommendedStrategy": "Premium pricing with service differentiation"
  }
}
```

---

## Confidence Calibration

We're honest about uncertainty:

### Confidence Levels

| Level | Range | Meaning | Recommended Action |
|-------|-------|---------|-------------------|
| High | 85-95% | Strong data, clear patterns | Act on recommendation |
| Medium | 70-84% | Good data, some uncertainty | Review before acting |
| Low | 50-69% | Limited data, uncertain patterns | Human judgment needed |

### Confidence Factors

```json
{
  "confidenceBreakdown": {
    "dataCompleteness": 0.85,
    "historicalAccuracy": 0.78,
    "patternClarity": 0.72,
    "finalConfidence": 0.78,
    "limitations": [
      "Only 6 months of booking history available",
      "No app engagement data provided"
    ]
  }
}
```

---

## Audit Trail Format

Every API call generates an audit-ready log:

```json
{
  "timestamp": "2026-01-25T14:32:15Z",
  "requestId": "req_abc123",
  "endpoint": "/api/crm/offer/recommend",
  "input": {
    "churnRiskScore": 0.72,
    "customerValue": "high",
    "loyaltyTier": "gold"
  },
  "output": {
    "recommendedOfferType": "flexibility_upgrade",
    "confidence": 0.78
  },
  "reasoning": ["..."],
  "guardrailsApplied": ["..."],
  "decisionBoundaries": {
    "wouldChangeIf": ["churn < 0.25", "value = low"]
  }
}
```

---

## Human Override Protocol

When humans disagree with AI:

1. **Log Override** - Record human decision with reasoning
2. **No Penalty** - System doesn't "punish" overrides
3. **Learn** - Aggregate overrides inform model improvements
4. **Report** - Monthly override analysis for calibration

---

## Summary

| Component | Purpose | Benefit |
|-----------|---------|---------|
| Primary Driver | Main decision factor | Quick understanding |
| Secondary Factors | Supporting context | Complete picture |
| Guardrails Applied | Policy compliance | Audit readiness |
| Decision Boundaries | "What would change it" | Scenario planning |
| Confidence Score | Uncertainty quantification | Appropriate trust |

---

**Explainable AI is trustworthy AI.**

---

*How2TakeOff: Decisions you can defend, explain, and improve.*
