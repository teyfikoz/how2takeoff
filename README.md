# How2TakeOff

**Aviation Business Intelligence & AI Decision Support Platform**

> "Hangi müşteriye, hangi tip teklifin, hangi yoğunlukta ve neden önerildiğini açıklayabilen bir AI CRM çekirdeği."

🌐 **Live:** https://how2takeoff.com

---

## Overview

How2TakeOff is an enterprise-grade aviation analytics platform combining traditional business intelligence with AI-powered decision support. Built for airline revenue management and CRM teams who need actionable insights, not data overload.

---

## Features

### Core Analytics
- **Flight Estimator** - Route planning, fuel calculations, passenger/cargo capacity
- **Aircraft Database** - Comprehensive aircraft specifications and comparisons
- **Revenue Management** - Pricing strategies, yield optimization concepts
- **Basic Aviation** - Passenger weight standards (EASA), cargo weight calculations

### AI Decision Support Engine (v1.0)

#### Faz A: Revenue Intelligence
- **AI Route Demand Forecasting** - Predict demand patterns by route, season, day
- **AI Ticket Pricing** - Dynamic pricing with travel purpose detection
- **Price Elasticity Analysis** - Business vs Leisure vs VFR sensitivity

#### Faz B: Customer Risk Intelligence
- **AI Churn Prediction** - RFM-based risk scoring
- **Customer Value Segmentation** - Low → Medium → High → VIP
- **Retention Priority Scoring** - Actionable prioritization (1-10)

#### Faz C: Action Intelligence
- **AI Offer Recommendation** - Policy-driven, explainable suggestions
- **6 Controlled Offer Types:**
  - `discount_light` - 5-10% discount
  - `flexibility_upgrade` - Free change/refund
  - `loyalty_bonus` - 2x-3x miles/points
  - `ancillary_bundle` - Seat + baggage + lounge
  - `priority_service` - Fast track, priority boarding
  - `no_offer` - AI maturity indicator (no intervention needed)

---

## AI Philosophy

**"The goal is not automation. The goal is better decisions."**

What we deliberately do NOT automate:
- Campaign copy generation (brand voice needs human craft)
- Auto-send offers (human approval required)
- Final pricing decisions (regulatory and strategic context)
- VIP customer handling (relationship nuance)

Every recommendation includes:
- Primary reasoning
- Secondary factors
- Guardrails applied
- Confidence score
- "What would change this decision"

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Vite, TypeScript, TailwindCSS, shadcn/ui |
| Backend | Express.js, Node.js |
| Database | SQLite (Drizzle ORM) |
| AI | Together AI (Llama 3.3 70B) |
| Hosting | Hetzner Cloud (Ubuntu 24.04) |
| Process Manager | PM2 |

---

## API Endpoints

### AI Decision Support

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/passenger/demand/forecast` | POST | Route demand forecasting |
| `/api/passenger/pricing/ai` | POST | AI ticket pricing |
| `/api/crm/churn/predict` | POST | Churn risk prediction |
| `/api/crm/offer/recommend` | POST | Offer recommendation |

### Core APIs

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/aircraft` | GET | Aircraft database |
| `/api/calculations` | POST | Fuel/distance calculations |
| `/api/health` | GET | Health check |

---

## Project Structure

```
how2takeoff/
├── client/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── domain/         # Domain types & constants
│   │   │   ├── churn-prediction/
│   │   │   ├── offer-recommendation/
│   │   │   └── passenger-pricing/
│   │   ├── pages/          # Route pages
│   │   ├── services/       # API service hooks
│   │   └── lib/            # Utilities
│   └── index.html
├── server/
│   ├── routes.ts           # API endpoints
│   ├── storage.ts          # Database operations
│   └── index.ts            # Server entry
├── docs/
│   ├── AI_PLATFORM_NARRATIVE.md
│   ├── AI_EXPLAINABILITY.md
│   ├── WHAT_WE_DO_NOT_AUTOMATE.md
│   └── ...
└── README.md
```

---

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## Deployment

```bash
# Deploy to Hetzner
ssh root@46.62.164.198 'cd /var/www/how2takeoff && git pull origin main && npm run build && pm2 restart how2takeoff'
```

---

## Documentation

- [AI Platform Narrative](docs/AI_PLATFORM_NARRATIVE.md) - Single-page overview
- [AI Explainability](docs/AI_EXPLAINABILITY.md) - How reasoning works
- [What We Don't Automate](docs/WHAT_WE_DO_NOT_AUTOMATE.md) - Design philosophy
- [Technical Assurance](docs/TECHNICAL_ASSURANCE.md) - Architecture decisions

---

## Status

| Component | Status |
|-----------|--------|
| Core Analytics | ✅ Production |
| AI Faz A (Pricing) | ✅ Production |
| AI Faz B (Churn) | ✅ Production |
| AI Faz C (Offers) | ✅ Production |
| Platform Level | Enterprise Decision Support Prototype |

---

## License

Proprietary - All Rights Reserved

---

## Contact

**Website:** https://how2takeoff.com

---

*How2TakeOff: Where aviation expertise meets AI intelligence.*
