#  Early Risk Signal System – Credit Card Delinquency Watch
Credit Card Behaviour Risk & Delinquency Prediction Platform
> The Early Risk Signal System (ERS) is a full-stack analytics platform that identifies behaviour-based early warning signals, computes risk scores, and predicts next-cycle delinquency for credit card customers.

---

##  Project Overview

Financial institutions typically react to **lagging indicators** (missed payments, over-limit cases), which often leads to late intervention.  
This project focuses on **early behavioural signals**, allowing banks to **predict risk before delinquency happens**.

 Built as a **full-stack web application** with:

- 📁 Frontend: **React + TypeScript**
- 🧠 Backend: **Flask (Python)**
- 🔬 Logic Derived From: **Data + Domain Analysis**
- 📑 PDF Risk Reports
- 🔐 Login-enabled secure access

---

##  Key Features

**1. Excel Upload + Smart Sheet Detection**
  Upload .xlsx / .xls files
  Auto-detects the correct sheet
  Cleans, validates, maps data
  Runs complete risk engine

**2. Behaviour & Payment Stress Scoring**
**ERS computes:**
  Behaviour Risk Score
  Payment Stress Score
  Risk Level → High / Medium / Low
  Total Risk Flags
  Narrative risk reasons

**3. Delinquency Prediction**
**Predicts:**
  Delinquent_NextMonth_Flag (1/0)
  Delinquent_NextMonth_Label (Delinquent / Not Delinquent)
  Based on utilisation, payment behaviour, cash dependency, spend changes, etc.

**4. Interactive Analytics Dashboard**
**Includes:**
  Risk Distribution Pie Chart
  Delinquency Bar Chart
**🔍 Filters:**
  By Risk Level
  By Delinquency
Customer table
Summary cards

**5. Manual Risk Check Module**

**Enter values manually and instantly get:**
  Risk scores
  Categories
  Total flags
  Delinquency prediction
  Narrative summary

Useful for demos & what-if modelling.

**6. Detailed Customer Page + PDF Export**
**Each customer has a rich detail page:**
  Metrics breakdown
  Behaviour & stress visuals
  Delinquency outlook
  Summary & explanations
  Export PDF report
**Quick actions:**
  Schedule Review (email)
  Contact Customer

**7. Flask Backend API**
**Endpoints:**
  GET  /api/ping
  POST /api/score
  POST /api/score-manual
  GET  /api/customer/:id

**8. Modern React UI**
**Built using:**
  React + TypeScript
  Tailwind CSS
  shadcn/ui
  Recharts
  jsPDF

Clean, minimal, banking-grade UI.
---

## 🛠 Tech Stack
**Frontend**
  React + TypeScript
  Tailwind CSS
  shadcn/ui
  Recharts
  jsPDF

**Backend**
  Python Flask
  Pandas
  NumPy
  Flask-CORS

---

##  Project Structure

ERS-System/
│── backend/
│   ├── app.py
│   ├── risk_engine.py
│   └── requirements.txt
│
│── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Upload.tsx
│   │   │   ├── Results.tsx
│   │   │   ├── ManualEntry.tsx
│   │   │   ├── CustomerDetail.tsx
│   │   └── components/
│   │       ├── DashboardHeader.tsx
│   │       ├── RiskBadge.tsx
│   │       ├── RiskSummaryCard.tsx
│   └── package.json
│
└── README.md

---

## How to Run Locally
**Backend**
  cd backend
  pip install -r requirements.txt
  python app.py
Backend runs at → http://localhost:5000
**Frontend**
  cd frontend
  npm install
  npm run dev
Frontend runs at → http://localhost:5173

---

**Excel Format Requirements**
**Required columns:**
  Customer ID
  Credit Limit
  Utilisation %
  Avg Payment Ratio
  Min Due Paid Frequency
  Merchant Mix Index
  Cash Withdrawal %
  Recent Spend Change %
**Optional:**
  DPD Bucket Next Month
  Past Due Flags

**CSV Export Fields**
**Exports include:**
  Customer ID
  All behaviour metrics
  Risk scores + levels
  Total risk flags
  Delinquency flag + label
  Narrative summary

## 🚦 Risk Logic (Rule-Based Approach)

| Feature                | Risk Condition                   |
| ---------------------- | -------------------------------- |
| Utilisation %          | > 75% → Credit dependency        |
| Avg Payment Ratio      | < 50% → Weak repayment           |
| Min Due Paid Frequency | > 60% → Financial stress         |
| Cash Withdrawal %      | > 15% → Liquidity issue          |
| Recent Spend Change    | Sharp decrease → Behavior change |

👉 Each factor assigns **risk flags** → Combined to determine **customer risk level**.

---

🔐 Login Credentials
| Username | Password |
| -------- | -------- |
| analyst  | risk123  |


👤 Author

Md.Sahil
```
