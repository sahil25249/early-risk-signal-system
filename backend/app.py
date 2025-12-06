from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from risk_engine import run_risk_engine

app = Flask(__name__)
CORS(app)  # allow React (different port) to call this API

scored_df_global = None  # keep last uploaded data in memory

@app.route("/api/ping", methods=["GET"])
def ping():
    return {"status": "ok"}


@app.route("/api/score", methods=["POST"])
def api_score():
    global scored_df_global

    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    print("Received file:", file.filename)

    # Try all sheets in the workbook
    try:
        xls = pd.ExcelFile(file)
    except Exception as e:
        return jsonify({"error": "Unable to read Excel file", "details": str(e)}), 400

    required_columns = [
        "Customer ID",
        "Credit Limit",
        "Utilisation %",
        "Avg Payment Ratio",
        "Min Due Paid Frequency",
        "Merchant Mix Index",
        "Cash Withdrawal %",
        "Recent Spend Change %",
    ]

    scored_df = None
    chosen_sheet = None
    last_columns = None

    for sheet_name in xls.sheet_names:
        print(f"Trying sheet: {sheet_name}")
        df_sheet = pd.read_excel(xls, sheet_name=sheet_name)
        print("Raw columns from this sheet:", list(df_sheet.columns))
        last_columns = list(df_sheet.columns)

        try:
            # run_risk_engine does cleaning + mapping internally
            temp_scored = run_risk_engine(df_sheet)

            # Check that required columns exist after cleaning/mapping
            missing_after = [col for col in required_columns if col not in temp_scored.columns]
            if missing_after:
                print(f"Sheet {sheet_name} skipped (missing after cleaning):", missing_after)
                continue

            # If we reach here, this sheet is valid
            scored_df = temp_scored
            chosen_sheet = sheet_name
            break

        except KeyError as e:
            print(f"Sheet {sheet_name} failed with KeyError:", e)
            continue

    if scored_df is None:
        return jsonify({
            "error": "No valid data sheet found in workbook.",
            "hint": "Please upload the sheet that contains customer-level behavioural data.",
            "sheets_found": xls.sheet_names,
            "last_sheet_columns": last_columns,
        }), 400

    print("Using sheet:", chosen_sheet)

    scored_df_global = scored_df

    risk_counts = scored_df["Risk_Level"].value_counts().to_dict()
    customers = scored_df.to_dict(orient="records")

    return jsonify({
        "risk_counts": risk_counts,
        "customers": customers
    })

@app.route("/api/customer/<cust_id>", methods=["GET"])
def api_customer_detail(cust_id):
    global scored_df_global
    if scored_df_global is None:
        return jsonify({"error": "No data available"}), 400

    row = scored_df_global[scored_df_global["Customer ID"] == cust_id]
    if row.empty:
        return jsonify({"error": "Customer not found"}), 404

    customer = row.to_dict(orient="records")[0]
    return jsonify(customer)

@app.route("/api/score-manual", methods=["POST"])
def api_score_manual():
    """
    Score a single manually-entered customer.
    Expects JSON with fields in a friendly format, e.g.:
    {
      "credit_limit": 120000,
      "utilisation_pct": 75,
      "avg_payment_ratio": 40,
      "min_due_paid_frequency": 80,
      "merchant_mix_index": 0.7,
      "cash_withdrawal_pct": 15,
      "recent_spend_change_pct": -10
    }
    """
    data = request.get_json()
    if not data:
        return jsonify({"error": "No JSON body received"}), 400

    # Map from incoming keys to engine's expected column names
    col_map = {
        "credit_limit": "Credit Limit",
        "utilisation_pct": "Utilisation %",
        "avg_payment_ratio": "Avg Payment Ratio",
        "min_due_paid_frequency": "Min Due Paid Frequency",
        "merchant_mix_index": "Merchant Mix Index",
        "cash_withdrawal_pct": "Cash Withdrawal %",
        "recent_spend_change_pct": "Recent Spend Change %",
    }

    # Create DataFrame with one row
    df = pd.DataFrame([data])

    # Rename columns to match existing engine
    df = df.rename(columns=col_map)

    # Ensure all required columns exist (fill missing with 0 or sensible defaults)
    required_cols = [
        "Credit Limit",
        "Utilisation %",
        "Avg Payment Ratio",
        "Min Due Paid Frequency",
        "Merchant Mix Index",
        "Cash Withdrawal %",
        "Recent Spend Change %",
    ]
    for col in required_cols:
        if col not in df.columns:
            df[col] = 0

    # For manual entry, we do NOT have actual DPD, so set as 0 by default
    df["DPD Bucket Next Month"] = 0

    # Run the same risk engine
    scored_df = run_risk_engine(df)
    
     # For consistency with /api/score, compute risk_counts here
    risk_counts = {
        "High": int((scored_df["Risk_Level"] == "High").sum()),
        "Medium": int((scored_df["Risk_Level"] == "Medium").sum()),
        "Low": int((scored_df["Risk_Level"] == "Low").sum()),
    }

    # Single record → convert row to dict
    row = scored_df.iloc[0].to_dict()

    return jsonify({
        "customer": row,
        "risk_counts": risk_counts
    })


if __name__ == "__main__":
    app.run(debug=True)
