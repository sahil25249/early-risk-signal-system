# 🚀 ERS – Early Risk Signal System

### _Behaviour-Based Credit Card Delinquency Watch_

Credit Card Behaviour Risk & Delinquency Prediction Platform

> The Early Risk Signal System (ERS) is a full-stack analytics platform that identifies behaviour-based early warning signals, computes risk scores, and predicts next-cycle delinquency for credit card customers.

---

## Project Overview

Financial institutions typically react to **lagging indicators** (missed payments, over-limit cases), which often leads to late intervention.  
This project focuses on **early behavioural signals**, allowing banks to **predict risk before delinquency happens**.

Built as a **full-stack web application** with:

- 📁 Frontend: **React + TypeScript**
- 🧠 Backend: **Flask (Python)**
- 🔬 Logic Derived From: **Data + Domain Analysis**
- 📑 PDF Risk Reports
- 🔐 Login-enabled secure access

---

## Key Features

**1. Excel Upload + Smart Sheet Detection**

```text
  Upload .xlsx / .xls files
  Auto-detects the correct sheet
  Cleans, validates, maps data
  Runs complete risk engine
```

**2. Behaviour & Payment Stress Scoring**

**ERS computes:**

```text
  Behaviour Risk Score
  Payment Stress Score
  Risk Level → High / Medium / Low
  Total Risk Flags
  Narrative risk reasons
```

**3. Delinquency Prediction**

**Predicts:**

```text
  Delinquent_NextMonth_Flag (1/0)
  Delinquent_NextMonth_Label (Delinquent / Not Delinquent)
  Based on utilisation, payment behaviour, cash dependency, spend changes, etc.
```

**4. Interactive Analytics Dashboard**

**Includes:**

```text
  Risk Distribution Pie Chart
  Delinquency Bar Chart
```

**🔍 Filters:**

```text
  By Risk Level
  By Delinquency
```

Customer table
Summary cards

**5. Manual Risk Check Module**

**Enter values manually and instantly get:**

```text
  Risk scores
  Categories
  Total flags
  Delinquency prediction
  Narrative summary
```

**6. Detailed Customer Page + PDF Export**
**Each customer has a rich detail page:**

```text
  Metrics breakdown
  Behaviour & stress visuals
  Delinquency outlook
  Summary & explanations
  Export PDF report
```

**Quick actions:**

```text
Schedule Review (email)
Contact Customer
```

**7. Flask Backend API**
**Endpoints:**

```text
GET  /api/ping
POST /api/score
POST /api/score-manual
GET  /api/customer/:id
```

**8. Modern React UI**
**Built using:**

```text
  React + TypeScript
  Tailwind CSS
  shadcn/ui
  Recharts
  jsPDF
```

---

## 🧠 How It Works (System Flow)

1. User uploads customer behaviour data.
2. Backend reads and processes the data (Pandas).
3. Risk Engine computes:
   - Behaviour Risk Score
   - Payment Stress Score
   - Total flags
   - Delinquency Next Month
4. Results displayed in frontend dashboard.
5. Manual Entry module allows individual risk simulations.

---

## 🎥 Demo Video

`▶️ Video Link: https://drive.google.com/file/d/1zM2A4TZTa3DJqaPKgRJWnFFaBwu01sbf/view?usp=drive_link`

---

## 🛠️ Tech Stack

### **Frontend**

- React + Vite
- TypeScript
- TailwindCSS
- ShadCN
- Recharts

### **Backend**

- Python **3.11.x**
- Flask
- Pandas
- NumPy
- OpenPyXL

---

## 📂Project Structure

```text

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

```

---

## ▶️ How to run the Project Locally

### 1️⃣ Backend Setup

```bash
cd backend
python3.11 -m venv venv
venv\Scripts\activate (Windows)
source venv/bin/activate (Mac/Linux)

pip install -r requirements.txt
python app.py
```

```text
Backend runs at:
http://localhost:5000
```

### 2️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

```text
Frontend runs at:
http://localhost:5173

```

### 🧪 API Test

Open browser:

```bash
http://localhost:5000/ping

```

Expected output:

```bash
{"message": "alive"}

```

**Excel Format Requirements**
**Required columns:**

- Customer ID
- Credit Limit
- Utilisation %
- Avg Payment Ratio
- Min Due Paid Frequency
- Merchant Mix Index
- Cash Withdrawal %
- Recent Spend Change %
  **Optional:**
- DPD Bucket Next Month
- Past Due Flags
  **Exports include:**
- Customer ID
- All behaviour metrics
- Risk scores + levels
- Total risk flags
- Delinquency flag + label
- Narrative summary

## Troubleshooting

### ❌ NumPy/Pandas Installation Error

Use Python 3.11 only.

### ❌ Excel Not Loading

Ensure the file is .xlsx and contains:

- Customer ID
- Credit Limit
- Utilisation %
- Min Due Paid Frequency
- Avg Payment Ratio
- Merchant Mix Index
- Cash Withdrawal %
- Recent Spend Change %

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
| analyst | risk123 |

👤 Author

Md.Sahil
