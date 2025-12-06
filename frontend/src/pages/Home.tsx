import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type RiskCounts = {
  High?: number;
  Medium?: number;
  Low?: number;
};

const Home = () => {
  const navigate = useNavigate();

  const [riskCounts, setRiskCounts] = useState<RiskCounts>({});
  const [customerCount, setCustomerCount] = useState<number | null>(null);

  useEffect(() => {
    try {
      const rcRaw = localStorage.getItem("riskCounts");
      const custRaw = localStorage.getItem("customers");

      if (rcRaw) setRiskCounts(JSON.parse(rcRaw));
      if (custRaw) {
        const arr = JSON.parse(custRaw);
        if (Array.isArray(arr)) setCustomerCount(arr.length);
      }
    } catch (e) {
      console.error("Failed to load snapshot from localStorage", e);
    }
  }, []);

  const hasSnapshot = customerCount !== null;

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-6 py-10 space-y-10">
        {/* Hero + primary actions */}
        <section className="flex flex-col lg:flex-row gap-8 lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Early Risk Signal System
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              A lightweight credit-card early warning engine that scores customer
              behaviour and flags potential delinquencies one cycle before they
              happen.
            </p>

            <div className="flex flex-wrap gap-3 pt-3">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90"
                onClick={() => navigate("/upload")}
              >
                Upload Monthly File
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => navigate("/manual")}
              >
                Try Manual Risk Check
              </Button>
            </div>
          </div>

          {/* Snapshot card */}
          <Card className="w-full max-w-sm shadow-card">
            <CardHeader>
              <CardTitle className="text-base">
                Quick Snapshot (current session)
              </CardTitle>
              <CardDescription>
                Overview of the latest uploaded customer cohort.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {hasSnapshot ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Customers scored
                    </span>
                    <span className="font-semibold">{customerCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      High / Medium / Low risk
                    </span>
                    <span className="font-semibold">
                      {riskCounts.High ?? 0} / {riskCounts.Medium ?? 0} /{" "}
                      {riskCounts.Low ?? 0}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full mt-2"
                    onClick={() => navigate("/results")}
                  >
                    View Detailed Results
                  </Button>
                </>
              ) : (
                <p className="text-xs text-muted-foreground">
                  No snapshot yet. Upload a monthly file to see cohort-level
                  risk and delinquency outlook.
                </p>
              )}
            </CardContent>
          </Card>
        </section>

        {/* Feature cards row */}
        <section className="grid gap-6 md:grid-cols-3">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Batch Upload Engine</CardTitle>
              <CardDescription>
                Score 100+ customers at once using Excel.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Upload monthly behaviour data and generate Low / Medium / High
                risk buckets, delinquency outlook, and narrative reasons for
                each customer.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="self-start"
                onClick={() => navigate("/upload")}
              >
                Go to Upload
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Manual Risk Check</CardTitle>
              <CardDescription>
                Test the engine for a hypothetical customer.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Manually tweak utilisation, payment ratio and spend pattern to
                see how the risk level and delinquency flag react.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="self-start"
                onClick={() => navigate("/manual")}
              >
                Open Manual Check
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Customer Drill-down</CardTitle>
              <CardDescription>
                Explainable risk for each account.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                From the results screen, open any customer to see scores, risk
                flags, delinquency outlook and a one-line narrative summary.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="self-start"
                onClick={() => navigate("/results")}
              >
                View Last Results
              </Button>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Home;
