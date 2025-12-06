import pandas as pd

def run_risk_engine(df_input: pd.DataFrame) -> pd.DataFrame:
    """
    Take a dataframe with the original customer behaviour columns
    and return a new dataframe with:
    - Risk flags (F1..F6)
    - Total_Risk_Flags
    - Risk_Level
    - Engineered scores + categories
    - Risk_Reasons_Text
    """
    df = df_input.copy()
    # ========================
    # Column cleaning block
    # ========================
    print("Original columns:", list(df.columns))

    df.columns = (
        df.columns
        .str.strip()
        .str.replace('\u00A0', ' ', regex=False)
        .str.replace('\u200b', '', regex=False)
    )

    EXPECTED_COLS = {
        "customer id": "Customer ID",
        "credit limit": "Credit Limit",
        "utilisation %": "Utilisation %",
        "avg payment ratio": "Avg Payment Ratio",
        "min due paid frequency": "Min Due Paid Frequency",
        "merchant mix index": "Merchant Mix Index",
        "cash withdrawal %": "Cash Withdrawal %",
        "recent spend change %": "Recent Spend Change %",
        "dpd bucket next month": "DPD Bucket Next Month",
    }

    df = df.rename(columns=lambda x: EXPECTED_COLS.get(x.lower(), x.strip()))
    print("Cleaned & mapped columns:", list(df.columns))




    # Target column only if present (for analysis, not required at prediction time)
    if 'DPD Bucket Next Month' in df.columns:
        df['Delinquent_Flag'] = (df['DPD Bucket Next Month'] >= 1).astype(int)

    # F1–F6 flags
    df['F1_PaymentLow'] = (df['Avg Payment Ratio'] < 50).astype(int)
    df['F2_SpendDrop'] = (df['Recent Spend Change %'] < -15).astype(int)
    df['F3_HighMerchantRisk'] = (df['Merchant Mix Index'] > 0.70).astype(int)

    df['F4_HighUtilisation'] = (
        (df['Utilisation %'] > 75) &
        ((df['F1_PaymentLow'] == 1) | (df['F2_SpendDrop'] == 1))
    ).astype(int)

    df['F5_PaymentStress'] = (
        (df['Avg Payment Ratio'] < 50) &
        (df['Min Due Paid Frequency'] > 50)
    ).astype(int)

    df['F6_CashWithdrawRisk'] = (
        (df['Cash Withdrawal %'] > 20) &
        (df['Avg Payment Ratio'] < 50)
    ).astype(int)

    flag_columns = [
        'F1_PaymentLow', 'F2_SpendDrop', 'F3_HighMerchantRisk',
        'F4_HighUtilisation', 'F5_PaymentStress', 'F6_CashWithdrawRisk'
    ]

    df['Total_Risk_Flags'] = df[flag_columns].sum(axis=1)

    # Risk level from flags
    df['Risk_Level'] = df['Total_Risk_Flags'].apply(
        lambda x: 'High' if x >= 3 else ('Medium' if x == 2 else 'Low')
    )

    # Engineered scores
    df['Payment_Stress_Score'] = (
        (100 - df['Avg Payment Ratio']) * (df['Min Due Paid Frequency'] / 100)
    )

    df['Behaviour_Risk_Score'] = (
        0.3 * df['Utilisation %'] +
        0.3 * (100 - df['Avg Payment Ratio']) +
        0.2 * df['Min Due Paid Frequency'] +
        0.1 * df['Cash Withdrawal %'] +
        0.1 * (df['Merchant Mix Index'] * 100)
    )

    # Score categories
    df['Behaviour_Risk_Category'] = df['Behaviour_Risk_Score'].apply(
        lambda x: 'High' if x >= 50 else ('Medium' if x >= 45 else 'Low')
    )

    df['Payment_Stress_Category'] = df['Payment_Stress_Score'].apply(
        lambda x: 'High' if x >= 25 else ('Medium' if x >= 15 else 'Low')
    )

    # Reasons text
    def get_risk_reasons(row):
        reasons = []
        if row['F1_PaymentLow'] == 1:
            reasons.append("Low Payment Ratio")
        if row['F2_SpendDrop'] == 1:
            reasons.append("Recent Spend Drop")
        if row['F3_HighMerchantRisk'] == 1:
            reasons.append("High-Risk Merchant Spending")
        if row['F4_HighUtilisation'] == 1:
            reasons.append("High Utilisation")
        if row['F5_PaymentStress'] == 1:
            reasons.append("Payment Stress")
        if row['F6_CashWithdrawRisk'] == 1:
            reasons.append("High Cash Withdrawal")
        return ", ".join(reasons) if reasons else "Stable behaviour"

    df['Risk_Reasons_Text'] = df.apply(get_risk_reasons, axis=1)
    
    # Delinquency (Next Month) Flag
    # If DPD Bucket Next Month > 0 → considered delinquent in next cycle
    if "DPD Bucket Next Month" in df.columns:
        df["Delinquent_NextMonth_Flag"] = (df["DPD Bucket Next Month"] > 0).astype(int)
        df["Delinquent_NextMonth_Label"] = df["Delinquent_NextMonth_Flag"].map(
            {1: "Delinquent Next Month", 0: "Not Delinquent Next Month"}
        )
    else:
        # If column missing (e.g., manual input without DPD), default to non-delinquent
        df["Delinquent_NextMonth_Flag"] = 0
        df["Delinquent_NextMonth_Label"] = "Not Delinquent Next Month"

    return df
