# 🛡️ GigShield v2 — Income Insurance for Gig Workers

AI-Powered Parametric Insurance platform. **No MongoDB required** — uses a built-in in-memory database with automatic JSON file persistence.

---

## ⚡ Quick Start (VS Code)

### Prerequisites
- **Node.js 18+** → https://nodejs.org

### 1. Install dependencies
```bash
npm install
```

### 2. Seed demo data (optional but recommended)
```bash
npm run seed
```

### 3. Start the server
```bash
npm run dev
```

The terminal will show:
```
╔══════════════════════════════════════════════╗
║         🛡️  GigShield Server Running          ║
╠══════════════════════════════════════════════╣
║  Local:   http://localhost:5000               ║
║  Mode:    development                         ║
║  DB:      In-Memory + data/db.json            ║
╚══════════════════════════════════════════════╝
```

**Click `http://localhost:5000`** → opens the app in your browser.

---

## 🔑 Demo Credentials

| Role   | Login                        | Password       |
|--------|------------------------------|----------------|
| Admin  | admin@gigshield.in           | GigAdmin@2024  |
| Worker | Any 10-digit mobile number   | OTP in terminal|

Worker OTP flow: enter any mobile → OTP appears in VS Code terminal → paste it in the app.

---

## 📁 Project Structure

```
gigshield/
├── server.js              # Express entry point
├── package.json
├── .env                   # Config (port, JWT secret)
├── data/
│   └── db.json            # Auto-created — persisted data
├── src/
│   ├── middleware/
│   │   └── auth.js        # JWT auth middleware
│   ├── routes/
│   │   ├── auth.js        # OTP login, KYC
│   │   ├── policy.js      # Insurance plans
│   │   ├── triggers.js    # Weather/event triggers
│   │   ├── payout.js      # Claim payouts
│   │   ├── analytics.js   # Dashboard stats
│   │   ├── fraud.js       # Fraud detection
│   │   └── admin.js       # Admin panel
│   └── utils/
│       ├── db.js          # In-memory database engine
│       └── seed.js        # Demo data seeder
└── public/                # Frontend (HTML/CSS/JS)
    ├── index.html
    ├── css/style.css
    └── js/app.js
```

---

## 🗄️ Database

No external database needed. Data is stored:
- **In memory** while the server runs (fast)
- **Persisted to `data/db.json`** automatically on every write

Data survives server restarts. To reset, run `npm run seed` again.

---

## 🚀 Scripts

| Command        | Description                    |
|----------------|--------------------------------|
| `npm start`    | Start production server        |
| `npm run dev`  | Start with auto-reload (nodemon)|
| `npm run seed` | Populate demo data             |
