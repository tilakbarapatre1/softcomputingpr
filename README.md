# Smart Inventory & Procurement Optimizer using AI-Driven Demand Forecasting and Decision Intelligence

> **Final-Year Soft Computing & AIML Capstone Project**  
> *A transparent, explainable decision-support and procurement optimization system for modern retail enterprises.*

---

## 📌 Executive Summary

Traditional commercial platforms (such as Zoho Inventory, SAP, Odoo, Oracle NetSuite, and Square for Retail) provide robust transaction ledgers, product cataloging, and basic inventory tracking. However, retail decision-makers frequently face significant cognitive friction when attempting to synthesize historical sales volatility, multi-vendor lead times, price fluctuations, seasonality, promotional spikes, Minimum Order Quantities (MOQ), and capital budget limits into unified, actionable procurement decisions.

### 🎯 The Core Business Question
> **"What should I purchase, how much should I purchase, when should I purchase it, and which supplier should I purchase from?"**

Our system bridges this gap through a unified mathematical and AI decision pipeline:

```
Historical Sales Data (12+ Months)
                ↓
Feature Engineering (Lags, Rolling Stats, Cyclical Encodings)
                ↓
Machine Learning Multi-Model Demand Forecasting (XGBoost, Random Forest, Ridge, Exp. Smoothing)
                ↓
Inventory Health & Risk Analysis (Stockout Probability, Overstock, Dead Stock)
                ↓
Multi-Criteria Supplier Intelligence Scoring (On-Time %, Quality %, Reliability %)
                ↓
Google OR-Tools Mixed-Integer Linear Programming (MILP) Procurement Optimizer
                ↓
Explainable AI (XAI) Recommendation Rationale ("Why buy this?")
                ↓
Automated Purchase Order Lifecycle & Inventory Ledger Sync
```

---

## 🌟 Key Differentiators & Highlights

1. **Not Just a CRUD App**: Transforms static inventory databases into an automated decision-support system.
2. **Real Machine Learning Pipeline**: Evaluates multiple time-series regressors on genuine holdout test sets and calculates authentic **MAE, RMSE, MAPE, and $R^2$ scores**.
3. **Google OR-Tools Mathematical Optimization**: Formulates and solves **Mixed-Integer Linear Programming (MILP)** models with binary indicator variables to enforce supplier MOQs, lead-time caps, and total procurement budget constraints.
4. **Explainable AI (XAI)**: Generates human-understandable, transparent decision factors explaining exactly *why* a purchase recommendation was triggered.
5. **Interactive ABC-XYZ Matrix**: 3x3 strategic classification combining Pareto annual turnover value ($A/B/C$) with demand volatility ($X/Y/Z$).
6. **Dynamic What-If Stress Simulator**: Simulates demand shocks ($+20\%$), vendor port delays ($+3$ days), and price inflation ($+5\%$) with before-and-after vulnerability comparisons.
7. **Contextual AI Copilot**: Natural language assistant strictly grounded in live database queries (never hallucinating metrics).
8. **Modern SaaS UI/UX**: Inspired by refined fintech dashboard designs featuring dark/light modes, KPI cards, and responsive data visualizations.

---

## 🏗️ System Architecture

```
smart-inventory-ai/
├── backend/
│   ├── app/
│   │   ├── api/                 # Modular FastAPI REST routes
│   │   │   ├── auth.py          # JWT authentication & demo logins
│   │   │   ├── dashboard.py     # Executive KPI metrics & live insights
│   │   │   ├── products.py      # Product catalog, filters & CSV import/export
│   │   │   ├── forecast.py      # ML model training, metrics & point forecasts
│   │   │   ├── procurement.py   # AI recommendations & OR-Tools MILP optimizer
│   │   │   ├── suppliers.py     # Supplier directory & composite scoring
│   │   │   ├── purchase_orders.py # PO lifecycle & automatic stock receipts
│   │   │   ├── analytics.py     # ABC, XYZ, Stockout Risk & Overstock APIs
│   │   │   ├── simulation.py    # What-If sensitivity simulation engine
│   │   │   ├── ai_assistant.py  # Grounded natural language AI copilot
│   │   │   ├── inventory.py     # Real-time alerts & quick stock adjustments
│   │   │   └── reports.py       # Audit-ready CSV data export hub
│   │   ├── auth/                # Cryptographic hashing & RBAC security
│   │   ├── config.py            # Pydantic environment configuration
│   │   ├── database/            # SQLAlchemy session management (SQLite / Postgres)
│   │   ├── models/              # Relational database schema models
│   │   ├── schemas/             # Pydantic request / response schemas
│   │   ├── services/            # Core business logic & dataset seeder (100+ SKUs)
│   │   └── main.py              # Application entrypoint & startup lifespans
├── ml/
│   ├── evaluation/              # MAE, RMSE, MAPE calculation engine
│   ├── forecasting/             # Multi-model demand forecaster (XGBoost, RF, Ridge)
│   ├── optimization/            # Google OR-Tools Mixed-Integer Linear Optimizer
│   ├── preprocessing/           # Time-series feature engineering & lag generators
│   └── models/                  # Serialized ML model artifacts (.joblib)
├── frontend/
│   ├── src/
│   │   ├── components/          # Sidebar, Header, KPI Cards, Modals
│   │   ├── context/             # AuthContext with 1-click demo accounts
│   │   ├── pages/               # 12+ Specialized intelligence dashboard views
│   │   ├── services/            # Axios client with JWT interceptors
│   │   ├── types/               # TypeScript interfaces
│   │   ├── App.tsx              # Router setup
│   │   └── index.css            # Tailwind design system & tokens
├── data/                        # Local SQLite database & raw extracts
├── start_backend.bat            # 1-Click Windows backend launcher
├── start_frontend.bat           # 1-Click Windows frontend launcher
└── docker-compose.yml           # Container orchestration
```

---

## 🔬 AIML & Mathematical Methodologies

### 1. Demand Forecasting Pipeline
- **Feature Engineering**:
  - Temporal lags: $\text{lag}_1, \text{lag}_2, \text{lag}_7, \text{lag}_{14}, \text{lag}_{21}, \text{lag}_{30}$
  - Rolling window statistics: $7\text{d}, 14\text{d}, 30\text{d}$ rolling means, standard deviations, min, and max
  - Cyclical calendar features: $\sin(2\pi \cdot \text{month}/12)$, $\cos(2\pi \cdot \text{month}/12)$, day-of-week encodings
  - Interaction flags: Promotional discount indicators and weekend sales uplifts
- **Model Comparison**:
  - **XGBoost Regressor**: Gradient-boosted decision trees with shrinkage
  - **Random Forest Regressor**: Ensembled bootstrap aggregation
  - **Ridge Regression**: L2-regularized linear baseline
  - **Exponential Smoothing / Moving Average**: Baseline benchmark
- **Validation Metrics**:
  $$\text{MAE} = \frac{1}{n} \sum_{t=1}^n |y_t - \hat{y}_t|, \quad \text{RMSE} = \sqrt{\frac{1}{n} \sum_{t=1}^n (y_t - \hat{y}_t)^2}, \quad \text{MAPE} = \frac{100\%}{n} \sum_{t=1}^n \left|\frac{y_t - \hat{y}_t}{y_t}\right|$$

---

### 2. Google OR-Tools Procurement Optimization (MILP)
Let $i \in \{1, \dots, N\}$ index the products needing reorder, and $s \in \{1, \dots, S_i\}$ index eligible suppliers for product $i$.

**Decision Variables**:
- $x_{i,s} \ge 0$: Integer quantity of product $i$ to order from supplier $s$
- $y_{i,s} \in \{0, 1\}$: Binary variable indicating whether supplier $s$ is selected for product $i$

**Objective Function**:
$$\min \sum_{i} \sum_{s} \left[ \text{Cost}_{i,s} + \text{RiskPenalty}_{i,s} \right] \cdot x_{i,s}$$
where $\text{RiskPenalty}_{i,s} = \text{Cost}_{i,s} \cdot (1 - \text{Reliability}_{i,s}) \cdot 0.5 + 0.5 \cdot \text{LeadTime}_{i,s}$.

**Constraints**:
1. **Demand Satisfaction**: $\sum_{s} x_{i,s} \ge \text{Deficit}_i \quad \forall i$
2. **Minimum Order Quantity (MOQ)**: $\text{MOQ}_{i,s} \cdot y_{i,s} \le x_{i,s} \le M \cdot y_{i,s} \quad \forall i, s$
3. **Total Budget Constraint**: $\sum_{i} \sum_{s} \text{Cost}_{i,s} \cdot x_{i,s} \le \text{BudgetLimit}$

---

### 3. Inventory Risk & Classification Formulations
- **Reorder Point ($ROP$)**:
  $$ROP = (\bar{d} \times L) + SS$$
  where $\bar{d}$ is average daily demand, $L$ is vendor lead time, and $SS$ is dynamic safety stock:
  $$SS = Z_{\alpha} \times \sigma_d \times \sqrt{L}$$
- **ABC Pareto Classification**:
  - **Class A**: Top $75\%$ cumulative annual consumption value (Strict control)
  - **Class B**: Next $17\%$ cumulative value (Automated standard control)
  - **Class C**: Remaining $8\%$ cumulative value (Bulk batch orders)
- **XYZ Volatility Classification**:
  - **X ($CV < 0.25$)**: Stable demand, high forecast accuracy
  - **Y ($0.25 \le CV < 0.55$)**: Moderate variability with promotional/seasonal peaks
  - **Z ($CV \ge 0.55$)**: Volatile, unpredictable demand bursts

---

## ⚡ Quickstart & Installation

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

### 1. Clone & Setup Backend
```bash
# In project root:
python -m pip install -r backend/requirements.txt
# (or python -m pip install fastapi uvicorn pandas scikit-learn xgboost ortools openpyxl sqlalchemy python-dotenv pyjwt email-validator)
```

### 2. Run the Application
You can start both servers using the provided scripts or manually:

#### Option A: Quick Scripts (Windows)
- Double-click **`start_backend.bat`** (Starts FastAPI backend on `http://localhost:8000`)
- Double-click **`start_frontend.bat`** (Starts React frontend on `http://localhost:5173`)

#### Option B: Manual Commands
```bash
# Terminal 1 - Backend:
python -m uvicorn app.main:app --app-dir backend --host 0.0.0.0 --port 8000 --reload

# Terminal 2 - Frontend:
cd frontend
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 🔑 Demo Credentials

The application includes built-in one-click demo profiles directly on the login screen:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Administrator** | `admin@smartinventory.ai` | `admin123` | Full access to ML models, catalog, budgets & orders |
| **Inventory Manager** | `manager@smartinventory.ai` | `manager123` | Demand forecasting, risk matrices, and optimizer |
| **Procurement Staff** | `staff@smartinventory.ai` | `staff123` | Stock audits, purchase order submissions & alerts |

---

## 📊 Complete Demonstration Workflow

```
1. 🔐 LOGIN
   Select 1-click Admin demo account.

2. 📈 EXECUTIVE DASHBOARD
   Review real-time valuation (₹5.62L+), dynamic AI insights, and ML sales vs forecast charts.

3. 📦 INVENTORY MANAGEMENT
   Inspect 105+ active retail products, filter by Category / ABC / Stock status, perform instant stock adjustments.

4. 🔬 PRODUCT INTELLIGENCE
   Click any SKU to inspect 30-day forecast curves with confidence intervals and vendor quote comparisons.

5. 🤖 DEMAND FORECASTING & ML EVALUATION
   Compare holdout test benchmarks across XGBoost, Random Forest, and Ridge. Trigger live retraining.

6. 🚨 STOCKOUT & OVERSTOCK RISK
   Evaluate days-until-stockout, identify locked working capital, and review dead-stock clearance actions.

7. 🧮 OR-TOOLS PROCUREMENT OPTIMIZER
   Adjust the budget slider (e.g., ₹2,50,000) and max lead times. Solve MILP in ~15 ms to get optimal vendor allocations.

8. 💡 EXPLAINABLE AI (XAI) RECOMMENDATIONS
   Inspect transparent bullet-point rationale for each suggested order and click "Create Purchase Order".

9. 🚚 PURCHASE ORDER LIFECYCLE
   Track order statuses from Submitted → Approved → Ordered → Received (with automatic inventory stock updates).

10. 💬 AI INVENTORY COPILOT
    Ask: "Which products should I reorder today?", "What should I purchase with ₹1 Lakh budget?", or "Which supplier is best for Basmati Rice?".
```

---

## 🎓 Academic Viva Presentation Points

- **Why OR-Tools instead of simple greedy heuristics?**  
  *Greedy heuristics fail to guarantee global cost minimization when handling multi-vendor Minimum Order Quantities (MOQs), joint budget ceilings, and lead-time constraints simultaneously. OR-Tools SCIP/CBC solver finds the mathematically proven optimal integer solution.*
- **How is Explainable AI achieved?**  
  *Rather than acting as a black-box, the recommendation engine extracts the underlying constraint triggers (safety buffer breach, forecasted runrate, lead-time demand, vendor reliability score, and potential cost delta) into plain-language explanation bullets.*
- **How does the system prevent data leakage during ML training?**  
  *A strict temporal holdout split is enforced (earlier sales records for training, the latest 30-day window for holdout testing) to reflect real-world forecasting conditions.*

---

## 🔮 Future Scope
- Integration with live IoT barcode / RFID smart shelf sensors.
- Multi-warehouse transshipment route optimization.
- Real-time commodity market pricing feeds.

---

### Developed for Soft Computing & Artificial Intelligence / Machine Learning Capstone
*Built with React, TypeScript, Tailwind CSS, FastAPI, SQLAlchemy, Scikit-Learn, XGBoost, and Google OR-Tools.*
