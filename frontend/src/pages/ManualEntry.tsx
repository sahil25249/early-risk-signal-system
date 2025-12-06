import { useState } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RiskBadge } from "@/components/RiskBadge";
import { toast } from "sonner";
import {
  scoreManualCustomer,
  type ManualInputPayload,
} from "@/lib/api";

/**
 * Manual Risk Check page
 * - Left: form to enter behaviour metrics
 * - Right: result card showing risk level, scores, delinquency, and summary
 */
const ManualRiskCheck = () => {
  // ------- Form state -------
  const [creditLimit, setCreditLimit] = useState<number>(100000);
  const [utilisation, setUtilisation] = useState<number>(50);
  const [avgPaymentRatio, setAvgPaymentRatio] = useState<number>(60);
  const [minDueFreq, setMinDueFreq] = useState<number>(40);
  const [merchantMix, setMerchantMix] = useState<number>(0.6);
  const [cashWithdrawal, setCashWithdrawal] = useState<number>(10);
  const [recentSpendChange, setRecentSpendChange] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // ------- Result state -------
  const [result, setResult] = useState<{
    Risk_Level?: string;
    Behaviour_Risk_Score?: number;
    Behaviour_Risk_Category?: string;
    Payment_Stress_Score?: number;
    Payment_Stress_Category?: string;
    Total_Risk_Flags?: number;
    Risk_Reasons_Text?: string;
    Delinquent_NextMonth_Flag?: number;
  } | null>(null);

  // 🔹 NEW: safely map any Risk_Level string → "High" | "Medium" | "Low"
  const riskLevel: "High" | "Medium" | "Low" =
    result?.Risk_Level === "High"
      ? "High"
      : result?.Risk_Level === "Medium"
      ? "Medium"
      : "Low";

  // Helper for currency
  const formatCurrency = (value: number) => {
    if (value == null || Number.isNaN(value)) return "-";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ---------- Basic validation ----------
    const errors: string[] = [];

    if (creditLimit <= 0) {
      errors.push("Credit limit must be greater than 0.");
    }
    if (utilisation < 0 || utilisation > 100) {
      errors.push("Utilisation must be between 0 and 100.");
    }
    if (avgPaymentRatio < 0 || avgPaymentRatio > 100) {
      errors.push("Avg payment ratio must be between 0 and 100.");
    }
    if (minDueFreq < 0 || minDueFreq > 100) {
      errors.push("Min due paid frequency must be between 0 and 100.");
    }
    if (cashWithdrawal < 0 || cashWithdrawal > 100) {
      errors.push("Cash withdrawal % must be between 0 and 100.");
    }
    if (merchantMix < 0 || merchantMix > 1) {
      errors.push("Merchant mix index must be between 0 and 1.");
    }
    if (recentSpendChange < -100 || recentSpendChange > 100) {
      errors.push("Recent spend change must be between -100 and +100.");
    }

    if (errors.length > 0) {
      toast.error(errors.join("\n"));
      return;
    }

    // ---------- Call backend ----------
    setIsSubmitting(true);
    try {
      const payload: ManualInputPayload = {
        credit_limit: creditLimit,
        utilisation_pct: utilisation,
        avg_payment_ratio: avgPaymentRatio,
        min_due_paid_frequency: minDueFreq,
        merchant_mix_index: merchantMix,
        cash_withdrawal_pct: cashWithdrawal,
        recent_spend_change_pct: recentSpendChange,
      };

      const data = await scoreManualCustomer(payload);
      setResult(data.customer);
      toast.success("Manual risk assessment complete");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to score manual customer");
    } finally {
      setIsSubmitting(false);
    }
  };


  // Convenience for showing delinquency text
  const renderDelinquency = () => {
    if (!result) return "-";
    return result.Delinquent_NextMonth_Flag === 1 ? (
      <span className="font-semibold text-red-600">Yes (Delinquent)</span>
    ) : (
      <span className="font-medium text-green-600">No</span>
    );
  };

  
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-6 py-10">
        {/* Page heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-1">
            Manual Risk Check
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter a single customer&apos;s behaviour metrics to test the early
            risk engine without uploading a file.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* LEFT: Input form */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Input Behaviour Metrics</CardTitle>
              <CardDescription>
                All values are for the latest cycle / recent months.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Credit Limit */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">
                    Credit Limit (₹)
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    value={creditLimit}
                    onChange={(e) => setCreditLimit(Number(e.target.value) || 0)}
                    min={0}
                  />
                </div>

                {/* Utilisation */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">
                    Utilisation % (0–100)
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    value={utilisation}
                    onChange={(e) => setUtilisation(Number(e.target.value) || 0)}
                    min={0}
                    max={100}
                  />
                </div>

                {/* Avg Payment Ratio */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">
                    Avg Payment Ratio % (0–100)
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    value={avgPaymentRatio}
                    onChange={(e) =>
                      setAvgPaymentRatio(Number(e.target.value) || 0)
                    }
                    min={0}
                    max={100}
                  />
                </div>

                {/* Min Due Paid Frequency */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">
                    Min Due Paid Frequency % (0–100)
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    value={minDueFreq}
                    onChange={(e) =>
                      setMinDueFreq(Number(e.target.value) || 0)
                    }
                    min={0}
                    max={100}
                  />
                </div>

                {/* Merchant Mix Index */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">
                    Merchant Mix Index (0–1)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    value={merchantMix}
                    onChange={(e) =>
                      setMerchantMix(Number(e.target.value) || 0)
                    }
                    min={0}
                    max={1}
                  />
                </div>

                {/* Cash Withdrawal % */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">
                    Cash Withdrawal % (0–100)
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    value={cashWithdrawal}
                    onChange={(e) =>
                      setCashWithdrawal(Number(e.target.value) || 0)
                    }
                    min={0}
                    max={100}
                  />
                </div>

                {/* Recent Spend Change */}
                <div className="space-y-1">
                  <label className="text-sm font-medium text-foreground">
                    Recent Spend Change % (−100 to +100)
                  </label>
                  <input
                    type="number"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
                    value={recentSpendChange}
                    onChange={(e) =>
                      setRecentSpendChange(Number(e.target.value) || 0)
                    }
                    min={-100}
                    max={100}
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-4"
                  size="lg"
                >
                  {isSubmitting ? "Running Risk Engine…" : "Run Risk Assessment"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* RIGHT: Result panel */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Result</CardTitle>
              <CardDescription>
                Risk summary for the behaviour profile you entered.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {!result ? (
                <p className="text-sm text-muted-foreground">
                  Enter metrics on the left and click{" "}
                  <span className="font-medium">Run Risk Assessment</span> to
                  see the result.
                </p>
              ) : (
                <>
                  {/* Top row: Risk level & delinquency */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground">
                        Overall Risk Level
                      </p>
                      <div className="mt-1">
                        <RiskBadge level={riskLevel} size="sm" />
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">
                        Delinquent Next Month:{" "}
                      </span>
                      {renderDelinquency()}
                    </div>
                  </div>

                  {/* Scores row */}
                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Behaviour score */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Behaviour Risk Score
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">
                          {result.Behaviour_Risk_Score?.toFixed
                            ? result.Behaviour_Risk_Score.toFixed(1)
                            : result.Behaviour_Risk_Score ?? "-"}
                        </span>
                        {result.Behaviour_Risk_Category && (
                          <RiskBadge
                            level={
                              (result.Behaviour_Risk_Category as "High" | "Medium" | "Low") ?? "Low"
                            }
                            size="sm"
                          />

                        )}
                      </div>
                      <Progress
                        value={result.Behaviour_Risk_Score || 0}
                        className="mt-2 h-2"
                      />
                    </div>

                    {/* Payment stress score */}
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">
                        Payment Stress Score
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-bold">
                          {result.Payment_Stress_Score?.toFixed
                            ? result.Payment_Stress_Score.toFixed(1)
                            : result.Payment_Stress_Score ?? "-"}
                        </span>
                        {result.Payment_Stress_Category && (
                          <RiskBadge
                            level={
                              (result.Payment_Stress_Category as "High" | "Medium" | "Low") ?? "Low"
                            }
                            size="sm"
                          />

                        )}
                      </div>
                      <Progress
                        value={result.Payment_Stress_Score || 0}
                        className="mt-2 h-2"
                      />
                    </div>
                  </div>

                  {/* Flags + key metrics */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2 text-sm">
                      <p className="text-xs font-semibold text-muted-foreground">
                        Credit Limit & Utilisation
                      </p>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Credit Limit
                        </span>
                        <span className="font-semibold">
                          {formatCurrency(creditLimit)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Utilisation
                        </span>
                        <span className="font-semibold">{utilisation}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Total Risk Flags
                        </span>
                        <span className="font-semibold">
                          {result.Total_Risk_Flags ?? 0}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      <p className="text-xs font-semibold text-muted-foreground">
                        Spending & Behaviour
                      </p>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Avg Payment Ratio
                        </span>
                        <span className="font-semibold">
                          {avgPaymentRatio}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Min Due Paid Frequency
                        </span>
                        <span className="font-semibold">{minDueFreq}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Recent Spend Change
                        </span>
                        <span className="font-semibold">
                          {recentSpendChange}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Cash Withdrawal
                        </span>
                        <span className="font-semibold">
                          {cashWithdrawal}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Merchant Mix Index
                        </span>
                        <span className="font-semibold">{merchantMix}</span>
                      </div>
                    </div>
                  </div>

                  {/* Narrative summary */}
                  <div className="pt-4 border-t">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">
                      Narrative Summary
                    </p>
                    <p className="text-sm text-foreground">
                      {result.Risk_Reasons_Text || "Stable behaviour"}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ManualRiskCheck;
