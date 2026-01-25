# How2TakeOff Technical Assurance Document
## Enterprise Security, Reliability & Integration Guide

---

## Executive Summary

This document provides technical assurance for airline IT and security teams evaluating How2TakeOff's AI-powered cargo pricing solution. It covers architecture, security controls, data handling, integration patterns, and operational guarantees.

---

## 1. System Architecture

### 1.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT SYSTEMS                          │
│            (Airline Cargo Management / RMS)                 │
└─────────────────────────────┬───────────────────────────────┘
                              │ HTTPS/TLS 1.3
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    API GATEWAY LAYER                        │
│     • Rate Limiting • Authentication • Request Validation   │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                 APPLICATION SERVER                          │
│                    (Express.js)                             │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐    ┌─────────────────┐                 │
│  │ Demand Forecast │    │   Pricing AI    │                 │
│  │     Engine      │───▶│     Engine      │                 │
│  └─────────────────┘    └─────────────────┘                 │
│           │                     │                           │
│           ▼                     ▼                           │
│  ┌─────────────────┐    ┌─────────────────┐                 │
│  │   Heuristic     │    │  Rule-based     │                 │
│  │   Forecasting   │    │   Fallback      │                 │
│  └─────────────────┘    └─────────────────┘                 │
└─────────────────────────────┬───────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              EXTERNAL AI SERVICE (Optional)                 │
│         HuggingFace Router → Together AI Provider           │
│                  (Llama 3.3 70B Instruct)                   │
└─────────────────────────────────────────────────────────────┘
```

### 1.2 Component Overview

| Component | Technology | Purpose |
|-----------|------------|---------|
| API Server | Express.js (Node.js) | Request handling, routing, validation |
| Forecast Engine | TypeScript heuristics | Demand signal generation |
| Pricing Engine | Hybrid AI + Rules | Price multiplier calculation |
| AI Provider | HuggingFace/Together | Advanced AI reasoning (optional) |
| Fallback System | Rule-based algorithms | Guaranteed availability |

---

## 2. Security Controls

### 2.1 Transport Security

- **TLS 1.3** required for all API communications
- HSTS (HTTP Strict Transport Security) enabled
- Certificate pinning supported for mobile/embedded clients

### 2.2 Authentication & Authorization

| Method | Use Case | Support |
|--------|----------|---------|
| API Key | Production integration | ✅ Available |
| OAuth 2.0 | Enterprise SSO | ✅ Available |
| IP Whitelisting | Additional layer | ✅ Configurable |

### 2.3 Data Protection

**Data in Transit:**
- All API traffic encrypted with TLS 1.3
- No sensitive data in URL parameters

**Data at Rest:**
- No customer data stored persistently
- Stateless API design
- Logs retain request metadata only (no payload content)

**Data Retention:**
- Request logs: 30 days (configurable)
- Performance metrics: 90 days
- Audit logs: 1 year

### 2.4 Input Validation

All API inputs are validated using:
- Schema validation (Zod)
- Type coercion with strict bounds
- SQL injection prevention (parameterized queries)
- Request size limits (100KB max)

---

## 3. Reliability & Availability

### 3.1 Fallback Architecture

```
┌───────────────────────────────────────┐
│          Pricing Request              │
└─────────────────┬─────────────────────┘
                  │
                  ▼
┌───────────────────────────────────────┐
│     AI Service Available?             │
│     (HuggingFace/Together)            │
└─────────┬───────────────┬─────────────┘
          │ YES           │ NO
          ▼               ▼
┌─────────────────┐ ┌─────────────────┐
│   AI Pricing    │ │ Rule-based      │
│   Engine        │ │ Pricing Engine  │
└─────────────────┘ └─────────────────┘
          │               │
          └───────┬───────┘
                  ▼
┌───────────────────────────────────────┐
│     Response with source indicator    │
│     ("huggingface" or "rule-based")   │
└───────────────────────────────────────┘
```

**Key Guarantee:** The system ALWAYS returns a valid price, even if AI services are unavailable.

### 3.2 Service Level Indicators

| Metric | Target | Measurement |
|--------|--------|-------------|
| Availability | 99.9% | Monthly uptime |
| P50 Latency | < 200ms | Request to response |
| P99 Latency | < 2000ms | Including AI calls |
| Error Rate | < 0.1% | 5xx responses |

### 3.3 Timeout Handling

| Component | Timeout | Fallback |
|-----------|---------|----------|
| AI Service | 20 seconds | Rule-based pricing |
| Database | 5 seconds | Cached response |
| Total Request | 30 seconds | Error response |

---

## 4. Safety Guardrails

### 4.1 Price Bounds

All pricing outputs are constrained:

```
MINIMUM_MULTIPLIER = 0.85  (15% maximum discount)
MAXIMUM_MULTIPLIER = 1.50  (50% maximum premium)
```

### 4.2 Forecast Confidence Gating

Forecast signals only influence pricing when confidence threshold is met:

```
CONFIDENCE_THRESHOLD = 0.60  (60%)
MAXIMUM_FORECAST_BIAS = ±0.05 (5%)
```

**Behavior:**
- Confidence ≥ 60%: Forecast bias applied (max ±5%)
- Confidence < 60%: Forecast bias NOT applied

### 4.3 Audit Trail

Every pricing decision includes:

```json
{
  "aiMultiplier": 1.35,
  "confidence": 0.85,
  "reasoning": "Full text explanation of pricing factors",
  "source": "huggingface | rule-based",
  "forecastApplied": true,
  "forecastBias": 1.05,
  "timestamp": "ISO-8601",
  "requestId": "uuid"
}
```

---

## 5. API Integration

### 5.1 Endpoints

**Demand Forecast**
```
POST /api/demand/forecast
Content-Type: application/json

Request:
{
  "route": "mediumHaul" | "longHaul" | "domestic" | "shortHaul",
  "departureDate": "YYYY-MM-DD",
  "currentBookings": number (0-100),
  "aircraftCapacity": number,
  "dayOfWeek": number (0-6)
}

Response:
{
  "expectedFinalLoadFactor": number (0-1),
  "demandTrend": "up" | "flat" | "down",
  "confidence": number (0-1),
  "seasonality": "peak" | "shoulder" | "low"
}
```

**AI Pricing**
```
POST /api/pricing/ai
Content-Type: application/json

Request:
{
  "routeType": "domestic" | "shortHaul" | "mediumHaul" | "longHaul",
  "capacityUtilization": number (0-100),
  "seasonIndex": number,
  "daysUntilDeparture": number,
  "basePrice": number,
  "forecastSignal": {  // Optional
    "expectedFinalLoadFactor": number,
    "demandTrend": "up" | "flat" | "down",
    "confidence": number
  }
}

Response:
{
  "aiMultiplier": number,
  "confidence": number,
  "reasoning": string,
  "source": "huggingface" | "rule-based",
  "forecastApplied": boolean,
  "forecastBias": number (optional)
}
```

### 5.2 Rate Limits

| Tier | Requests/minute | Requests/day |
|------|-----------------|--------------|
| Pilot | 60 | 10,000 |
| Standard | 300 | 100,000 |
| Enterprise | Custom | Custom |

### 5.3 Error Handling

| HTTP Status | Meaning | Action |
|-------------|---------|--------|
| 200 | Success | Process response |
| 400 | Invalid request | Fix request format |
| 401 | Unauthorized | Check API key |
| 429 | Rate limited | Implement backoff |
| 500 | Server error | Retry with backoff |
| 503 | Service unavailable | Retry later |

---

## 6. Compliance & Certifications

### 6.1 Data Privacy

- GDPR compliant (no PII stored)
- SOC 2 Type II (in progress)
- ISO 27001 (planned)

### 6.2 Audit Support

- All API calls logged with request ID
- Exportable audit logs (JSON/CSV)
- Pricing decision explanations stored

---

## 7. Deployment Options

### 7.1 Cloud Deployment (Default)

- Hosted on Hetzner Cloud (Germany/EU)
- Multi-region availability
- Managed infrastructure

### 7.2 On-Premise Deployment (Enterprise)

Available for enterprise customers requiring:
- Data residency requirements
- Air-gapped networks
- Custom SLA requirements

---

## 8. Support & Operations

### 8.1 Support Tiers

| Tier | Response Time | Coverage |
|------|---------------|----------|
| Pilot | 24 hours | Business days |
| Standard | 8 hours | Business days |
| Enterprise | 2 hours | 24/7 |

### 8.2 Monitoring

- Real-time health dashboard
- Anomaly detection alerts
- Performance metrics API

---

## 9. Version & Change Management

### 9.1 API Versioning

- Semantic versioning (MAJOR.MINOR.PATCH)
- Backward compatibility maintained within major versions
- Deprecation notice: 90 days minimum

### 9.2 Change Notification

- Security patches: Immediate notification
- Feature releases: 14-day notice
- Breaking changes: 90-day deprecation period

---

## Contact

**Technical Questions:** tech@how2takeoff.com
**Security Issues:** security@how2takeoff.com
**Pilot Program:** pilot@how2takeoff.com

---

*Document Version: 1.0*
*Last Updated: January 2026*
*Classification: Public*
