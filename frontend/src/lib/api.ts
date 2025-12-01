const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

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
