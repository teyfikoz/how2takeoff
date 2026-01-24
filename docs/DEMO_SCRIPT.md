# How2TakeOff Demo Script
## 1-Minute Live Demo (Two Scenarios)

---

## Setup
- Terminal or API client open
- Two tabs: one for forecast, one for pricing
- Duration: ~60 seconds total

---

## SCENARIO 1: Peak Demand Response (~30 seconds)

### Narration:
> "Let's see how the system handles a peak season scenario with strong demand signals."

### Step 1: Get Demand Forecast

```bash
curl -X POST https://how2takeoff.com/api/demand/forecast \
  -H "Content-Type: application/json" \
  -d '{
    "route": "mediumHaul",
    "departureDate": "2026-07-15",
    "currentBookings": 45,
    "aircraftCapacity": 180,
    "dayOfWeek": 5
  }'
```

### Expected Response:
```json
{
  "expectedFinalLoadFactor": 0.81,
  "demandTrend": "up",
  "confidence": 0.75,
  "seasonality": "peak"
}
```

### Narration:
> "Forecast shows upward demand trend with 75% confidence. Peak season, Friday departure."

### Step 2: Get AI Pricing with Forecast

```bash
curl -X POST https://how2takeoff.com/api/pricing/ai \
  -H "Content-Type: application/json" \
  -d '{
    "routeType": "mediumHaul",
    "capacityUtilization": 45,
    "seasonIndex": 1.3,
    "daysUntilDeparture": 5,
    "basePrice": 2.0,
    "forecastSignal": {
      "expectedFinalLoadFactor": 0.81,
      "demandTrend": "up",
      "confidence": 0.75
    }
  }'
```

### Expected Response:
```json
{
  "aiMultiplier": 1.47,
  "confidence": 0.92,
  "reasoning": "AI analysis: Short notice, Peak season → +47% adjustment; Demand forecast indicates UPWARD pressure (+5%)",
  "source": "huggingface",
  "forecastApplied": true,
  "forecastBias": 1.05
}
```

### Narration:
> "System applies 5% upward bias from forecast, resulting in 1.47x multiplier.
> Notice the full reasoning explanation — this is what the customer sees."

---

## SCENARIO 2: Low Confidence Safety (~30 seconds)

### Narration:
> "Now let's see what happens when forecast confidence is low."

### Step 1: Get Demand Forecast (Low Confidence)

```bash
curl -X POST https://how2takeoff.com/api/demand/forecast \
  -H "Content-Type: application/json" \
  -d '{
    "route": "domestic",
    "departureDate": "2026-02-14",
    "currentBookings": 25,
    "aircraftCapacity": 150,
    "dayOfWeek": 6
  }'
```

### Expected Response:
```json
{
  "expectedFinalLoadFactor": 0.30,
  "demandTrend": "flat",
  "confidence": 0.55,
  "seasonality": "low"
}
```

### Narration:
> "Confidence is only 55% — below our 60% threshold."

### Step 2: Get AI Pricing with Low Confidence Forecast

```bash
curl -X POST https://how2takeoff.com/api/pricing/ai \
  -H "Content-Type: application/json" \
  -d '{
    "routeType": "domestic",
    "capacityUtilization": 25,
    "seasonIndex": 0.85,
    "daysUntilDeparture": 21,
    "basePrice": 0.75,
    "forecastSignal": {
      "expectedFinalLoadFactor": 0.30,
      "demandTrend": "up",
      "confidence": 0.55
    }
  }'
```

### Expected Response:
```json
{
  "aiMultiplier": 0.92,
  "confidence": 0.85,
  "reasoning": "Pricing factors: Low season, advance booking discount; Forecast confidence too low (55% < 60%)",
  "source": "huggingface",
  "forecastApplied": false
}
```

### Narration:
> "Even though forecast suggested upward trend, the system ignores it because confidence is too low.
> This is our safety mechanism — we don't act on unreliable signals.
> The reasoning clearly explains why forecast bias was NOT applied."

---

## Closing (~10 seconds)

### Narration:
> "That's How2TakeOff: AI that explains price movements before they happen.
> Every price is explainable, every decision is auditable, and safety guardrails are always active."

---

## Demo Checklist

- [ ] API endpoints responding
- [ ] HuggingFace model active
- [ ] Both scenarios tested beforehand
- [ ] Terminal font size readable for screen share

---

## Backup: If API is Slow

Have screenshots ready of:
1. Peak scenario response
2. Low confidence response
3. "Why this price?" UI (if available)

---

## Key Points to Emphasize

1. **Forecast → Pricing link** (not separate systems)
2. **Confidence gating** (safety built-in)
3. **Full reasoning** (explainable to customers)
4. **Controlled bias** (max ±5%)
5. **Production-ready** (live API, not demo)
