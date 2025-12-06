const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export type RiskCounts = {
  High?: number;
  Medium?: number;
  Low?: number;
};

export async function scoreFile(file: File): Promise<{
  risk_counts: RiskCounts;
  customers: any[];
}> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/api/score`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to score file");
  }

  return res.json();
}

export async function fetchCustomer(id: string): Promise<any> {
  const res = await fetch(`${API_BASE_URL}/api/customer/${id}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch customer");
  }
  return res.json();
}

/* ---------- Manual input scoring ---------- */

export type ManualInputPayload = {
  credit_limit: number;
  utilisation_pct: number;
  avg_payment_ratio: number;
  min_due_paid_frequency: number;
  merchant_mix_index: number;
  cash_withdrawal_pct: number;
  recent_spend_change_pct: number;
};

/**
 * Original function you already had – kept as-is so nothing breaks.
 */
export async function scoreManualCustomer(
  payload: ManualInputPayload
): Promise<{
  customer: any;
  risk_counts: RiskCounts;
}> {
  const res = await fetch(`${API_BASE_URL}/api/score-manual`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to score manual customer");
  }

  return res.json();
}

/**
 * New helper used by ManualRiskCheck page.
 * Just calls the existing scoreManualCustomer under the hood.
 */
export async function scoreManual(
  payload: ManualInputPayload
): Promise<{
  customer: any;
  risk_counts: RiskCounts;
}> {
  return scoreManualCustomer(payload);
}
