# 🛡️ GigShield — AI-Powered Parametric Income Insurance for Food Delivery Partners

> *Protecting the last mile. Automatically. Instantly. Fairly.*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Status: Phase 1](https://img.shields.io/badge/Status-Phase%201%20Ideation-blue)]()
[![Platform: Mobile](https://img.shields.io/badge/Platform-Mobile%20Android-green)]()
[![Pricing: Weekly](https://img.shields.io/badge/Pricing-Weekly%20%E2%82%B949--99-red)]()
[![AI Powered](https://img.shields.io/badge/AI-Powered-purple)]()

---

## 📌 Table of Contents

1. [Executive Summary](#-executive-summary)
2. [The Problem](#-the-problem)
3. [Our Solution](#-our-solution)
4. [Persona Definition](#-persona-definition)
5. [Persona-Based Scenarios](#-persona-based-scenarios)
6. [Application Workflow](#-application-workflow)
7. [Weekly Premium Model](#-weekly-premium-model)
8. [Parametric Triggers](#-parametric-triggers)
9. [Platform Justification](#-platform-justification-mobile-vs-web)
10. [AI/ML Integration Plan](#-aiml-integration-plan)
11. [Fraud Detection System](#-fraud-detection-system)
12. [Tech Stack](#-tech-stack)
13. [System Architecture](#-system-architecture)
14. [Development Plan & Roadmap](#-development-plan--roadmap)
15. [Analytics Dashboard](#-analytics-dashboard)
16. [Innovation Highlights](#-innovation-highlights)
17. [Risk & Mitigation](#-risk--mitigation)
18. [Team](#-team)

---

## 🎯 Executive Summary

India has over **5 million food delivery partners** working on Zomato and Swiggy — yet not a single insurance product exists to protect their income when external disruptions like heavy rain, extreme heat, or civic unrest make it impossible to work.

**GigShield** is an AI-enabled parametric income insurance platform built exclusively for food delivery partners. When a qualifying disruption occurs, GigShield automatically detects it, validates the worker's presence in the affected zone, and sends a UPI payout directly to their account — within 2 hours. No claim forms. No paperwork. No waiting.

Workers subscribe on a **weekly basis** (₹49–₹99/week), aligned with their weekly earning cycle. Premiums are dynamically priced by an ML engine based on city risk, season, working hours, and forecasted disruption probability for the coming week.

> ⚠️ **Coverage Scope:** Income loss from external disruptions ONLY.
> Health, life, accident, and vehicle repair coverage are strictly excluded.

---

## ❗ The Problem

Food delivery partners in India face a silent financial crisis:

- They earn **₹15,000–₹25,000/month** with zero income guarantee
- External disruptions reduce earnings by **20–30% every month**
- They have **no savings buffer** — living week-to-week
- **No insurance product** addresses gig worker income loss from environmental disruptions
- Traditional insurance is too expensive, too complex, and built for salaried employees

When it rains heavily in Mumbai, Ravi can't deliver. He earns ₹0 for 4 hours. No one compensates him. **GigShield changes that.**

---

## 💡 Our Solution

GigShield is a **parametric income insurance platform** — payouts are triggered automatically by measurable external events (rainfall intensity, AQI levels, civic disruptions), not by manual claim filing.

- ✅ Worker pays ₹49–₹99/week — less than the cost of a single lost delivery slot
- ✅ Disruption detected automatically via real-time APIs
- ✅ Worker location and activity validated via GPS
- ✅ UPI payout processed within 2 hours — no human intervention needed
- ✅ AI dynamically adjusts premium every week based on upcoming risk
- ✅ Multilingual support — Hindi, Tamil, Telugu, Kannada, English

---

## 👤 Persona Definition

### Primary Persona — "The Urban Food Delivery Partner"

| Attribute | Details |
|-----------|---------|
| **Representative Name** | Ravi Kumar |
| **Age** | 22–35 years |
| **Cities** | Mumbai, Delhi, Bengaluru, Chennai, Hyderabad, Pune |
| **Platform** | Zomato / Swiggy |
| **Working Hours** | 8–12 hrs/day, 6 days/week |
| **Monthly Earnings** | ₹15,000–₹25,000 |
| **Daily Earnings** | ₹500–₹900 |
| **Device** | Budget Android smartphone (₹6,000–₹12,000) |
| **Payment Method** | UPI (PhonePe / GPay / Paytm) |
| **Tech Literacy** | Moderate — comfortable with apps, UPI, WhatsApp |
| **Financial Buffer** | Less than 2 weeks of expenses saved |
| **Insurance Awareness** | Very low — has never purchased any insurance product |

**Key Pain Points:**
- Loses 3–6 working hours during rain or heat events with zero compensation
- No way to predict or plan around income shocks
- Platform support does not compensate for disruption-related income loss
- Existing loan/microfinance products worsen debt rather than solving income gaps

---

## 📖 Persona-Based Scenarios

### Scenario 1 — Heavy Monsoon Rain (Mumbai)

**Context:** July, 6:00 PM. Ravi starts his Swiggy shift in Andheri, Mumbai.

| Timeline | Event |
|----------|-------|
| 6:00 PM | Ravi logs into Swiggy, starts accepting orders |
| 6:45 PM | Rainfall crosses 12mm/hr in Andheri zone |
| 6:47 PM | GigShield detects threshold breach via OpenWeatherMap API |
| 6:48 PM | GPS confirms Ravi is within the affected zone ✅ |
| 6:49 PM | App session confirms Ravi was logged in but orders dropped 75% ✅ |
| 6:50 PM | Fraud detection passes — event is city-wide, not isolated ✅ |
| 9:00 PM | **₹380 credited to Ravi's UPI.** SMS + app notification sent |

**Without GigShield:** Ravi loses ₹400–500 of expected earnings with no recourse.
**With GigShield:** Ravi receives ₹380 automatically. He didn't file anything.

---

### Scenario 2 — Extreme Heat Advisory (Delhi)

**Context:** May, 2:00 PM. Delhi temperature reaches 44°C. IMD issues heat advisory.

- Outdoor riding becomes physically dangerous (heat exhaustion risk)
- Zomato order volume drops 60% during afternoon peak
- Ravi's logged hours: 1.5 hrs vs his typical 5 hrs

**GigShield Response:**
- Temperature >42°C sustained for 2+ hours in Ravi's zone → **trigger activated**
- Logged hours vs historical average confirms significant drop ✅
- Prorated payout of **₹220** processed automatically
- Weekly risk score updated upward for upcoming summer weeks

---

### Scenario 3 — Severe Air Pollution Episode (Delhi/NCR)

**Context:** November. Delhi AQI spikes to 387 — Severe category.

- Government advisory issued against outdoor physical activity
- Delivery partners voluntarily reduce working hours
- Ravi earns ₹80 for the day vs his typical ₹650

**GigShield Response:**
- AQICN API reports AQI >300 sustained for 4+ hours in Ravi's zone ✅
- Zone-level order data confirms city-wide delivery slowdown ✅
- Fraud check: Event verified as city-wide — no anomaly flagged ✅
- Payout of **₹280** triggered and credited automatically

---

### Scenario 4 — Unplanned Bandh / Curfew (Bengaluru)

**Context:** Overnight, a sudden political bandh is announced — effective 6:00 AM.

- Roads blocked; restaurant and pickup zones shut down
- Delivery operations halted across the city
- Ravi loses an entire working day (~₹700 expected)

**GigShield Response:**
- News API + traffic data detects civic disruption in Bengaluru ✅
- Municipal advisory cross-reference confirms bandh ✅
- GPS confirms Ravi is within the affected zone ✅
- Maximum daily payout of **₹500** processed — no individual claim needed
- All active, verified workers in affected zones compensated automatically

---

## 🔄 Application Workflow

```
╔══════════════════════════════════════════════════════════════╗
║                  GIGSHIELD — CORE WORKFLOW                   ║
╚══════════════════════════════════════════════════════════════╝

┌─────────────────────┐
│   1. ONBOARDING     │  Phone → OTP → Aadhaar (DigiLocker)
│                     │  → UPI ID → Platform delivery ID link
└────────┬────────────┘
         ▼
┌─────────────────────┐
│  2. AI RISK         │  ML model analyses: city, zone, season,
│     PROFILING       │  working hours, historical weather risk
└────────┬────────────┘
         ▼
┌─────────────────────┐
│  3. POLICY          │  3 weekly tiers shown (Basic / Standard /
│     SELECTION       │  Premium) → Worker selects → UPI AutoPay
└────────┬────────────┘  consent activated
         ▼
┌─────────────────────┐
│  4. WEEKLY          │  Every Monday: premium auto-debited via UPI
│     AUTO-DEBIT      │  Coverage active: Mon 00:00 → Sun 23:59
└────────┬────────────┘
         ▼
┌─────────────────────┐
│  5. REAL-TIME       │  Monitoring engine polls every 15 mins:
│     MONITORING      │  Weather API → AQI API → Traffic API
│     (24 × 7)        │  → News/Events API
└────────┬────────────┘
         │ Threshold breached?
         ▼ YES
┌─────────────────────┐
│  6. TRIGGER         │  Identify affected zones → match active
│     EVALUATION      │  workers in zone → run 3-layer validation
│                     │  → calculate fraud risk score
└────────┬────────────┘
         │ Fraud score < 30?
         ▼ YES (auto-approve)
┌─────────────────────┐
│  7. AUTOMATIC       │  Payout = Daily earning × Duration factor
│     PAYOUT          │  × Severity multiplier × Plan cap
│                     │  → UPI transfer within 2 hours
└────────┬────────────┘
         ▼
┌─────────────────────┐
│  8. DASHBOARD       │  Worker: policy status, payout history
│     & ANALYTICS     │  Admin: disruption map, fraud flags,
│                     │  zone risk heatmap, financial metrics
└─────────────────────┘
```

---

## 💰 Weekly Premium Model — How It Works

### Why Weekly Pricing?

Delivery partners operate in a **weekly income cycle**. A monthly premium feels like a large lump-sum expense — creating friction and drop-off. A weekly premium of ₹49–₹99 is psychologically and financially aligned with how gig workers manage their money.

> *"₹79 a week is less than what Ravi loses in one rain-cancelled delivery slot."*

---

### Premium Tiers

| Plan | Weekly Premium | Max Weekly Payout | Max Single-Event Payout | Target User |
|------|:---:|:---:|:---:|---|
| **Basic** | ₹49 | ₹800 | ₹300 | Low-risk cities, part-time workers |
| **Standard** | ₹79 | ₹1,200 | ₹500 | Metro cities, full-time workers |
| **Premium** | ₹99 | ₹1,500 | ₹700 | High-risk zones, monsoon season |

---

### Dynamic Premium Calculation

```
Weekly Premium = Base Rate
              × City Risk Multiplier      (0.8x – 1.4x)
              × Seasonal Risk Multiplier  (1.0x – 1.4x)
              × Worker Activity Score     (0.9x – 1.1x)
              × Claims History Factor     (0.9x – 1.2x)
```

| Factor | Low | High | Example |
|--------|:---:|:---:|---------|
| City Risk | 0.8x (Tier-2) | 1.4x (Mumbai/Delhi) | Pune = 1.0x |
| Season | 1.0x (Winter) | 1.4x (Monsoon peak) | July Mumbai = 1.4x |
| Activity Score | 0.9x (part-time) | 1.1x (10+ hrs/day) | 8 hrs/day = 1.05x |
| Claims History | 0.9x (no claims) | 1.2x (frequent claims) | 3 prior = 1.1x |

> Premiums are **recalculated every Sunday night** for the upcoming week. Workers are notified 24 hours before Monday auto-debit of any change.

---

### Payout Calculation Formula

```
Event Payout = Base Daily Earning × Duration Factor × Severity Multiplier
               (capped at selected plan's max single-event payout)
```

| Duration | Factor | Payout (₹700/day base) |
|----------|:------:|:---------------------:|
| 1–2 hours | 0.25x | ₹175 |
| 2–4 hours | 0.50x | ₹350 |
| 4–6 hours | 0.75x | ₹525 |
| 6+ hours (full day) | 1.0x | ₹700 (capped at plan max) |

| Severity | Multiplier | Example |
|----------|:----------:|---------|
| Moderate | 1.0x | Rain 8–15mm/hr, AQI 201–300 |
| Severe | 1.2x | Rain >15mm/hr, AQI 301–400, Heat >42°C |
| Extreme | 1.5x | Rain >30mm/hr, AQI >400, Verified bandh |

---

## ⚡ Parametric Triggers — Definitions & Thresholds

Parametric insurance pays automatically when a **pre-defined, objectively measurable threshold** is crossed — no human judgment required.

### Trigger Table

| Trigger | Data Source | Threshold | Min Duration | Validation |
|---------|-------------|-----------|:---:|---------|
| **Heavy Rain** | OpenWeatherMap | >8mm/hr | 2 hrs | Zone GPS + active login |
| **Extreme Rain** | OpenWeatherMap | >20mm/hr | 1 hr | Zone GPS match |
| **Flood Alert** | IMD / OpenWeatherMap | Official flood warning | Event | District-level alert confirmed |
| **Extreme Heat** | OpenWeatherMap | Temperature >42°C | 2 hrs | Zone + active login |
| **Severe Pollution** | AQICN / IQAir | AQI >300 | 4 hrs | City-level trigger |
| **Very Poor AQI** | AQICN / IQAir | AQI 201–300 | 6 hrs | Zone-level trigger |
| **Civic Disruption** | NewsAPI + Traffic | Verified curfew/bandh | Event | Govt advisory confirmed |
| **Zone Lockdown** | HERE Traffic API | Road access <20% | 3 hrs | Cross-ref with order data |

### 3-Layer Trigger Validation

```
LAYER 1 — EVENT VALIDATION
Did the measurable event actually occur in this specific zone?
→ API data cross-checked with minimum 2 independent sources
→ Zone boundary matched to worker's last known GPS location

LAYER 2 — WORKER ACTIVITY VALIDATION
Was the worker actively working or trying to work during the event?
→ GPS confirms worker was within the affected zone during the event window
→ App session confirms worker was logged into the delivery platform

LAYER 3 — FRAUD & ANOMALY VALIDATION
Is this claim consistent with the worker's historical behaviour?
→ AI anomaly detection calculates fraud risk score (0–100)
→ Score 0–30:  Auto-approved instantly ✅
→ Score 31–60: Approved with GPS log audit
→ Score 61+:   Held for manual review ⚠️
```

---

## 📱 Platform Justification: Mobile vs Web

**Decision: Mobile-First Android Application (+ Web Admin Dashboard)**

### Why Mobile for Workers?

| Factor | Mobile ✅ | Web ❌ |
|--------|----------|--------|
| Device reality | 98% of delivery partners use Android exclusively | No laptop/desktop access in the field |
| UPI AutoPay | Native UPI mandate integration, seamless | Clunky web UPI flows, low trust |
| GPS & Location | Real-time zone validation via native GPS | Unreliable on mobile browsers |
| Push Notifications | Instant FCM payout alerts | Web push has very low engagement |
| Offline Access | Policy info cached for low-connectivity | Requires constant internet |
| Aadhaar / DigiLocker | Native SDK integration | API-only, higher friction |
| User Trust | Workers use Zomato/Swiggy apps daily | Web interface feels unfamiliar |
| Regional Language | System-level language support built in | Extra implementation overhead |

> **Admin Dashboard:** A responsive **web dashboard** will be built separately for operations, risk monitoring, fraud review, and financial analytics — better suited to wide-screen usage.

---

## 🤖 AI/ML Integration Plan

### 1. Dynamic Premium Calculation Engine

**Model:** XGBoost (Gradient Boosted Decision Trees)

**Why XGBoost?** Handles mixed categorical and numerical features, highly interpretable, performs well on tabular data, and has low inference latency for production serving.

**Input Features:**
```
Categorical:  city, delivery_zone, season, plan_tier
Numerical:    avg_weekly_active_hours, historical_rain_days_30d,
              avg_aqi_30d, prior_claims_count_90d,
              forecasted_disruption_risk_score_7d
```
**Output:** Recommended weekly premium (₹) + Risk tier (Low / Medium / High)

**Model Retraining:** Monthly, using updated claims data and weather history.

---

### 2. Predictive Risk Modeling

**Purpose:** Forecast disruption probability for the upcoming week to proactively adjust premiums and alert workers before disruptions arrive.

- **7-day weather risk:** OpenWeatherMap + IMD forecast feeds
- **Seasonal patterns:** ARIMA time-series on historical disruption frequency by city/month
- **Zone risk heatmap:** DBSCAN spatial clustering on historical trigger events

**Outputs:** Daily disruption probability score per zone (0–1) → "High Risk Week" alerts to workers 48 hrs in advance.

---

### 3. NLP-Powered Onboarding Assistant

**Purpose:** Guide low-literacy users through onboarding in their native language and answer policy FAQs.

- **Languages:** Hindi, Tamil, Telugu, Kannada, English
- **Handles:** *"What is covered?", "When will I get paid?", "How much will I receive?"*
- **Implementation:** Rule-based NLP with intent classification (Phase 2) → fine-tuned lightweight LLM (Phase 3+)

---

## 🔒 Fraud Detection System

### 4-Layer AI Fraud Engine

**Layer A — GPS Location Anomaly Detection**
- Method: Isolation Forest on GPS coordinates during event window
- Detects: Worker claims zone X but GPS consistently shows movement in zone Y

**Layer B — Behavioural Pattern Analysis**
- Method: Z-score analysis on individual historical earnings and activity
- Detects: Worker who earns ₹700/day logs zero activity for 5 consecutive trigger events

**Layer C — Collective / Network Fraud Detection**
- Method: Graph-based clustering analysis on claim patterns
- Detects: Abnormal claim spike from a residential building or non-delivery zone

**Layer D — Duplicate Claim Prevention**
- Method: Rule-based deduplication + API-level idempotency
- Detects: Same worker submitting multiple payouts for the same event window

### Fraud Risk Scoring

| Score | Action | Processing Time |
|:-----:|--------|:---:|
| 0–30 | Auto-approved ✅ | < 2 hours |
| 31–60 | Approved with GPS log audit | 2–6 hours |
| 61–100 | Held for manual review ⚠️ | 24–48 hours |

---

## 🛠️ Tech Stack

### Mobile Application (Worker-Facing)

| Layer | Technology | Reason |
|-------|-----------|--------|
| Framework | React Native (Expo) | Cross-platform, fast iteration, large ecosystem |
| Language | TypeScript | Type safety and maintainability |
| State Management | Redux Toolkit | Predictable state for complex insurance flows |
| UI Components | React Native Paper | Material Design, accessible, customizable |
| Maps / GPS | Expo Location + React Native Maps | Zone validation and real-time tracking |
| Payments | Razorpay React Native SDK | UPI AutoPay, sandbox available |
| Notifications | Firebase Cloud Messaging | Reliable push notifications, free tier |
| Local Storage | AsyncStorage | Cache policy info for offline access |

### Backend (API Server)

| Layer | Technology | Reason |
|-------|-----------|--------|
| Framework | FastAPI (Python 3.11) | High performance, async, auto-generates API docs |
| Database | PostgreSQL | ACID-compliant, ideal for financial records |
| Cache / Queue | Redis | Real-time trigger state, low latency |
| Task Queue | Celery + Redis | Background polling and monitoring jobs |
| Authentication | JWT + OTP (MSG91) | Stateless, mobile-optimized |
| File Storage | AWS S3 / Cloudflare R2 | KYC document storage |

### AI / ML

| Component | Technology |
|-----------|-----------|
| Premium Calculation | XGBoost (scikit-learn pipeline) |
| Fraud Detection | Isolation Forest, DBSCAN (scikit-learn) |
| Risk Forecasting | Prophet / ARIMA |
| NLP Assistant | Rasa Open Source / Rule-based NLP |
| Model Serving | FastAPI endpoints (joblib serialized models) |
| Model Tracking | MLflow |

### Admin Dashboard (Web)

| Layer | Technology |
|-------|-----------|
| Framework | React.js (Vite) |
| UI Library | Ant Design / Tremor |
| Charts | Recharts + Chart.js |
| Maps / Heatmap | Leaflet.js |
| Hosting | Vercel (free tier) |

### Infrastructure & DevOps

| Component | Technology |
|-----------|-----------|
| Cloud | AWS Free Tier / Railway.app |
| Containerization | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Monitoring | UptimeRobot (free tier) |
| Version Control | GitHub (this repository) |

---

## 🏗️ System Architecture

```
  ┌──────────────┐         ┌────────────────────────────────────┐
  │  Mobile App  │◄───────►│          FastAPI Backend            │
  │ (React Native│         │  ┌─────────────┐  ┌─────────────┐  │
  │   Android)   │         │  │ Auth Service│  │ Policy APIs │  │
  └──────────────┘         │  └─────────────┘  └─────────────┘  │
                           │  ┌─────────────┐  ┌─────────────┐  │
  ┌──────────────┐         │  │  ML Engine  │  │  Monitoring │  │
  │  Admin Web   │◄───────►│  │  (XGBoost + │  │  Engine     │  │
  │  Dashboard   │         │  │  Fraud AI)  │  │  (Celery)   │  │
  │  (React.js)  │         │  └─────────────┘  └──────┬──────┘  │
  └──────────────┘         └────────────────────────┬─┴─────────┘
                                                    │
              ┌─────────────────────────────────────┼─────────────────┐
              ▼                                     ▼                 ▼
  ┌───────────────────┐        ┌───────────────────────┐  ┌─────────────────┐
  │  OpenWeatherMap   │        │   AQICN / IQAir API   │  │  NewsAPI +      │
  │  (Rain, Temp)     │        │   (Pollution / AQI)   │  │  Traffic API    │
  └───────────────────┘        └───────────────────────┘  └─────────────────┘
              │
              ▼
  ┌──────────────────────────────────────────────┐
  │         PostgreSQL + Redis                    │
  │  Workers | Policies | Claims | Trigger Logs  │
  └──────────────────────────────────────────────┘
              │
              ▼
  ┌──────────────────────────┐
  │  Razorpay UPI Sandbox    │   ← Payout processing
  └──────────────────────────┘
```

---

## 📅 Development Plan & Roadmap

### Phase 1 — Ideation & Foundation (Weeks 1–2) ← *Current Phase*

- [x] Problem research and delivery partner persona definition
- [x] Parametric trigger design and threshold definition
- [x] Weekly premium model and payout formula design
- [x] Tech stack finalization and architecture design
- [ ] GitHub repository setup with README documentation
- [ ] Figma wireframes for core mobile screens (6–8 screens)
- [ ] 2-minute strategy and prototype video

### Phase 2 — Core Backend & ML Models (Weeks 3–4)

- [ ] FastAPI scaffold with PostgreSQL schema
- [ ] Worker onboarding and KYC mock APIs
- [ ] UPI AutoPay integration (Razorpay sandbox)
- [ ] Premium calculation ML model v1 (XGBoost)
- [ ] Disruption monitoring engine (weather + AQI polling every 15 mins)
- [ ] Parametric trigger evaluation and zone-matching logic
- [ ] Fraud detection Layers A + B
- [ ] Payout simulation endpoints + unit tests

### Phase 3 — Frontend & Full Integration (Week 5)

- [ ] React Native app — Onboarding, KYC, UPI linking screens
- [ ] Policy selection and weekly plan activation UI
- [ ] Push notification system (FCM)
- [ ] Worker dashboard (active policy, payout history)
- [ ] Admin web dashboard (disruption map, analytics, fraud queue)
- [ ] End-to-end integration testing across all 4 disruption scenarios

### Phase 4 — Testing, Refinement & Final Demo (Week 6)

- [ ] Full scenario simulation (all 4 disruption scenarios end-to-end)
- [ ] Fraud detection stress testing with synthetic edge cases
- [ ] Performance benchmarking — API latency, payout processing time
- [ ] UI/UX refinement and regional language testing
- [ ] Final demo preparation and documentation

### Milestones

| Milestone | Target Date | Deliverable |
|-----------|:-----------:|-------------|
| Phase 1 Submission | March 20 | README + Repo + 2-min Video |
| Backend v1 Live | April 3 | Core APIs on staging |
| ML Models Integrated | April 10 | Premium + Fraud detection live |
| Mobile App Beta | April 17 | Testable APK on Android |
| Full End-to-End Demo | April 24 | All 4 scenarios demonstrated |

---

## 📊 Analytics Dashboard

The admin-facing web dashboard will surface the following metrics in real time:

| Metric | Description |
|--------|-------------|
| **Active Policies** | Total weekly active policies by city and plan tier |
| **Live Disruption Map** | Real-time zone-level disruption status across covered cities |
| **Triggers Fired Today** | Count and type of parametric events activated in last 24 hours |
| **Payouts Processed** | Total ₹ disbursed today, this week, and this month |
| **Average Payout Time** | Time from trigger detection to UPI credit (target: <2 hours) |
| **Fraud Flags** | Claims flagged for review with score distribution |
| **Zone Risk Heatmap** | Colour-coded risk levels by city and delivery zone |
| **Premium vs Payout Ratio** | Financial health and sustainability of the insurance pool |
| **Worker Retention Rate** | Weekly plan renewal percentage — key engagement metric |

---

## 💡 Innovation Highlights

**1. Zero-Claim Architecture**
Workers never file a claim. The system detects, validates, and pays entirely autonomously — eliminating the biggest pain point of traditional insurance and building deep trust with low-literacy users.

**2. Micro-Zone Risk Mapping**
Rather than city-level risk (too broad), GigShield maps risk at the **ward/pincode delivery zone level** — enabling more accurate trigger validation, fairer premium pricing, and reduced false positives.

**3. Predictive Premium Alerts**
Workers are notified 48 hours before a forecasted high-risk week (e.g., IMD predicts heavy monsoon) and offered the opportunity to upgrade their plan tier before the disruption arrives.

**4. Regional Language Support**
Full onboarding, notifications, and policy communications in Hindi, Tamil, Telugu, Kannada, and English — ensuring the platform is accessible to non-English-speaking delivery partners.

**5. WhatsApp Bot Integration (Phase 3)**
For workers reluctant to download a new app, a WhatsApp-based interface will allow policy activation, payout notifications, and FAQ support — meeting workers on a platform they already use daily.

---

## ⚠️ Risk & Mitigation

| Risk | Likelihood | Impact | Mitigation Strategy |
|------|:---:|:---:|---------------------|
| API data inaccuracy (wrong zone weather) | Medium | High | Cross-validate with 2+ independent sources |
| High fraud rate exploiting city-wide triggers | Medium | High | Multi-layer AI fraud engine + GPS validation |
| Low adoption due to trust deficit | High | High | Zero-claim model + transparent payout notifications |
| Premium pool unsustainability | Medium | High | Conservative thresholds + reinsurance model planning |
| IRDAI regulatory compliance | High | High | Engage IRDAI sandbox; partner with licensed insurer |
| UPI AutoPay deduction failures | Low | Medium | Retry logic + SMS alert + grace period before lapse |

---

## 👥 Team

| Name | Role | Responsibilities |
|------|------|-----------------|
| [Member 1] | AI/ML Engineer | Premium model, fraud detection, risk forecasting, model deployment |
| [Member 2] | Backend Engineer | FastAPI server, PostgreSQL, trigger engine, API integrations |
| [Member 3] | Frontend Engineer | React Native mobile app, admin web dashboard |
| [Member 4] | Product & Research | Persona research, business model, documentation, demo video |

---

## 📎 Resources & Links

- 📹 [Strategy & Demo Video](#) *(Link to be added)*
- 🎨 [Figma Wireframes](#) *(Link to be added)*
- 📊 [Premium Model Spreadsheet](#) *(Link to be added)*

---

<div align="center">

**Built with ❤️ for India's 5 million food delivery partners**

*GigShield — Because every delivery partner deserves a safety net.*

---

*Hackathon Project · Phase 1 Submission · March 2025*

</div>
