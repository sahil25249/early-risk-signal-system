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


if __name__ == "__main__":
    app.run(debug=True)
