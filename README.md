# 📊 Early Risk Signal System – Credit Card Delinquency Watch

> 🚨 _A proactive behavioral risk assessment system designed to identify early indicators of credit card delinquency, enabling timely intervention before default._

---

## 📌 Project Overview

Financial institutions typically react to **lagging indicators** (missed payments, over-limit cases), which often leads to late intervention.  
This project focuses on **early behavioural signals**, allowing banks to **predict risk before delinquency happens**.

🟢 Built as a **full-stack web application** with:

- 📁 Frontend: **React + TypeScript**
- 🧠 Backend: **Flask (Python)**
- 🔬 Logic Derived From: **Data + Domain Analysis**
- 📑 PDF Risk Reports
- 🔐 Login-enabled secure access

---

## 🎯 Key Features

| Feature              | Description                     |
| -------------------- | ------------------------------- |
| 📤 Excel Upload      | User uploads dataset            |
| ⚙ Risk Score & Level | Computed using behavioral logic |
| 🔍 Risk Flags        | Shows high-risk patterns        |
| 📑 PDF Report        | For individual customer         |
| 🚪 Login/Logout      | Secure access                   |
| 🌐 Dashboard UI      | Bank-style front-end            |
| 📥 Export CSV        | For analyst usage               |

---

## 🛠 Tech Stack

| Component         | Technology                                    |
| ----------------- | --------------------------------------------- |
| Frontend          | React (Vite), TypeScript, Tailwind, Shadcn UI |
| Backend           | Flask, Python, Pandas, NumPy                  |
| Report Generation | ReportLab                                     |
| Analysis          | Jupyter Notebook                              |
| Deployment Ready  | AWS / Docker                                  |

---

## 📁 Project Structure

early-risk-signal-system/
├── backend/
│ ├── app.py
│ ├── risk_engine.py
│ └── requirements.txt
│
├── frontend/
│ ├── src/
│ └── package.json
│
├── notebook/
│ └── risk_logic_exploration.ipynb
│
├── data/
│ └── sample_input.xlsx
│
├── reports/
│ └── sample_customer_report.pdf
│
└── README.md

---

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

## 🚀 How to Run the Project Locally

### 1️⃣ Backend (Flask)

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python app.py
➡ Visit API: http://localhost:5000/api/ping

### 2️⃣ Frontend (React)

cd frontend
npm install
npm run dev
➡ Open UI: http://localhost:5173

🔐 Login Credentials
| Username | Password |
| -------- | -------- |
| analyst  | risk123  |


### 📊 Output Examples

✔ 📍 High/Medium/Low risk summary
✔ 🧾 PDF Report per customer (Download option)
✔ 📈 Risk score by flag count
✔ 📥 CSV export for further analysis

Example files available in reports/ folder.

### 🔍 Future Enhancements

✔ ML-based anomaly detection
✔ Auto email alert to RM team
✔ Multi-period trend comparison
✔ Real-time API integration
✔ Cloud Deployment (AWS)


👤 Author

Md.Sahil


### ⚠ Disclaimer

This project is a prototype developed for educational and demonstration purposes and does not use live banking data.
```
