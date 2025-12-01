// Mock data simulating Flask backend response

export interface Customer {
  "Customer ID": string;
  "Customer Name": string;
  "Risk_Level": "High" | "Medium" | "Low";
  "Total_Risk_flags": number;
  "Behaviour_Risk_Score": number;
  "Behaviour_Risk_Category": "High" | "Medium" | "Low";
  "Payment_Stress_Score": number;
  "Payment_Stress_Category": "High" | "Medium" | "Low";
  "Risk_Reasons_Text": string;
  "Account Balance": number;
  "Monthly Income": number;
  "Outstanding Loans": number;
  "Credit Score": number;
  "Late Payments (12M)": number;
  "Account Age (Years)": number;
}

export const mockCustomers: Customer[] = [
  {
    "Customer ID": "CUST001",
    "Customer Name": "Sarah Johnson",
    "Risk_Level": "High",
    "Total_Risk_flags": 5,
    "Behaviour_Risk_Score": 82,
    "Behaviour_Risk_Category": "High",
    "Payment_Stress_Score": 78,
    "Payment_Stress_Category": "High",
    "Risk_Reasons_Text": "Multiple late payments, high debt-to-income ratio, declining account balance",
    "Account Balance": 1250,
    "Monthly Income": 3500,
    "Outstanding Loans": 45000,
    "Credit Score": 580,
    "Late Payments (12M)": 6,
    "Account Age (Years)": 3
  },
  {
    "Customer ID": "CUST002",
    "Customer Name": "Michael Chen",
    "Risk_Level": "Low",
    "Total_Risk_flags": 0,
    "Behaviour_Risk_Score": 15,
    "Behaviour_Risk_Category": "Low",
    "Payment_Stress_Score": 12,
    "Payment_Stress_Category": "Low",
    "Risk_Reasons_Text": "Excellent payment history, strong income, low debt ratio",
    "Account Balance": 45000,
    "Monthly Income": 8500,
    "Outstanding Loans": 12000,
    "Credit Score": 780,
    "Late Payments (12M)": 0,
    "Account Age (Years)": 8
  },
  {
    "Customer ID": "CUST003",
    "Customer Name": "Emily Rodriguez",
    "Risk_Level": "Medium",
    "Total_Risk_flags": 2,
    "Behaviour_Risk_Score": 48,
    "Behaviour_Risk_Category": "Medium",
    "Payment_Stress_Score": 52,
    "Payment_Stress_Category": "Medium",
    "Risk_Reasons_Text": "Occasional late payments, moderate debt level",
    "Account Balance": 8200,
    "Monthly Income": 5200,
    "Outstanding Loans": 28000,
    "Credit Score": 650,
    "Late Payments (12M)": 2,
    "Account Age (Years)": 5
  },
  {
    "Customer ID": "CUST004",
    "Customer Name": "David Thompson",
    "Risk_Level": "Low",
    "Total_Risk_flags": 1,
    "Behaviour_Risk_Score": 22,
    "Behaviour_Risk_Category": "Low",
    "Payment_Stress_Score": 25,
    "Payment_Stress_Category": "Low",
    "Risk_Reasons_Text": "Good payment history, stable income",
    "Account Balance": 22000,
    "Monthly Income": 6800,
    "Outstanding Loans": 18000,
    "Credit Score": 720,
    "Late Payments (12M)": 1,
    "Account Age (Years)": 6
  },
  {
    "Customer ID": "CUST005",
    "Customer Name": "Lisa Anderson",
    "Risk_Level": "High",
    "Total_Risk_flags": 4,
    "Behaviour_Risk_Score": 75,
    "Behaviour_Risk_Category": "High",
    "Payment_Stress_Score": 71,
    "Payment_Stress_Category": "High",
    "Risk_Reasons_Text": "High outstanding loans, frequent overdrafts, declining credit score",
    "Account Balance": 850,
    "Monthly Income": 4200,
    "Outstanding Loans": 52000,
    "Credit Score": 595,
    "Late Payments (12M)": 5,
    "Account Age (Years)": 4
  },
  {
    "Customer ID": "CUST006",
    "Customer Name": "James Wilson",
    "Risk_Level": "Medium",
    "Total_Risk_flags": 3,
    "Behaviour_Risk_Score": 55,
    "Behaviour_Risk_Category": "Medium",
    "Payment_Stress_Score": 48,
    "Payment_Stress_Category": "Medium",
    "Risk_Reasons_Text": "Moderate debt levels, some payment delays",
    "Account Balance": 5600,
    "Monthly Income": 4800,
    "Outstanding Loans": 32000,
    "Credit Score": 640,
    "Late Payments (12M)": 3,
    "Account Age (Years)": 4
  }
];

export const getRiskCounts = (customers: Customer[]) => {
  return customers.reduce((acc, customer) => {
    acc[customer.Risk_Level] = (acc[customer.Risk_Level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

export const getCustomerById = (id: string): Customer | undefined => {
  return mockCustomers.find(c => c["Customer ID"] === id);
};
