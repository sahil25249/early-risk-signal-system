import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import { DashboardHeader } from "@/components/DashboardHeader";
import { RiskBadge } from "@/components/RiskBadge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, TrendingDown, TrendingUp, AlertCircle, CreditCard } from "lucide-react";
import { Progress } from "@/components/ui/progress";

type Customer = any;

const CustomerDetail = () => {
  const { customerId } = useParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("customers");
      if (raw) {
        const customers: Customer[] = JSON.parse(raw);
        const found = customers.find(
          (c) => c["Customer ID"]?.toString() === (customerId || "").toString()
        );
        if (found) {
          setCustomer(found);
        }
      }
    } catch (err) {
      console.error("Failed to load customers from localStorage", err);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  const formatCurrency = (value: number) => {
    if (value == null || Number.isNaN(value)) return "-";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

    const handleScheduleReview = () => {
    if (!customer) return;

    const subject = encodeURIComponent(
      `Schedule risk review – Customer ${customer["Customer ID"]}`
    );

    const bodyLines = [
      `Please schedule a risk review for the following customer:`,
      ``,
      `Customer ID: ${customer["Customer ID"]}`,
      `Risk Level: ${customer.Risk_Level}`,
      `Behaviour Risk Score: ${customer.Behaviour_Risk_Score}`,
      `Payment Stress Score: ${customer.Payment_Stress_Score}`,
      ``,
      `Key Risk Reasons:`,
      `${customer.Risk_Reasons_Text}`,
      ``,
      `Generated via Early Risk Signal System.`,
    ];

    const body = encodeURIComponent(bodyLines.join("\n"));

    // Opens default email client
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleGenerateReport = () => {
    if (!customer) return;

    // A4 portrait
    const doc = new jsPDF("p", "mm", "a4");

    const primary: [number, number, number] = [25, 118, 210];  // blue
    const danger: [number, number, number] = [211, 47, 47];    // red
    const warning: [number, number, number] = [245, 124, 0];   // orange
    const success: [number, number, number] = [46, 125, 50];   // green


    // ===== Header band =====
    doc.setFillColor(primary[0], primary[1], primary[2]);
    doc.rect(0, 0, 210, 20, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text("Early Risk Signal System", 14, 8);
    doc.setFontSize(11);
    doc.text("Customer Risk Report", 14, 14);

    // Back to black text
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 26);
    doc.text("Prepared by: Early Risk Signal System", 14, 32);

    // ===== Big risk badge on top-right =====
    const riskLevel: string = customer.Risk_Level || "Low";
    let riskColor = success;

    if (riskLevel === "High") riskColor = danger;
    else if (riskLevel === "Medium") riskColor = warning;

    doc.setFillColor(riskColor[0], riskColor[1], riskColor[2]);
    doc.setTextColor(255, 255, 255);
    doc.roundedRect(145, 24, 50, 12, 2, 2, "F");
    doc.setFontSize(11);
    doc.text(`${riskLevel} Risk`, 170, 32, { align: "center" });

    // Restore black text for rest
    doc.setTextColor(0, 0, 0);

    // ===== Customer Overview table =====
    doc.setFontSize(12);
    doc.text("Customer Overview", 14, 44);

    autoTable(doc, {
      startY: 48,
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: {
        fillColor: primary,
        textColor: 255,
        halign: "left",
      },
      head: [["Field", "Value"]],
      body: [
        ["Customer ID", customer["Customer ID"]],
        ["Risk Level", customer.Risk_Level],
        ["Behaviour Risk Score", customer.Behaviour_Risk_Score],
        ["Payment Stress Score", customer.Payment_Stress_Score],
        ["Total Risk Flags", customer.Total_Risk_Flags],
        ["Next Month DPD Bucket", customer["DPD Bucket Next Month"]],
      ],
    });

    // ===== Behaviour & Usage Metrics =====
    const afterOverviewY = (doc as any).lastAutoTable.finalY + 8;
    doc.setFontSize(12);
    doc.text("Behaviour & Usage Metrics", 14, afterOverviewY);

    autoTable(doc, {
    startY: afterOverviewY + 4,
    theme: "grid",
    styles: { fontSize: 10 },
    headStyles: {
      fillColor: primary,
      textColor: 255,
      halign: "left",
    },
    head: [["Metric", "Value"]],
    body: [
      ["Credit Limit", `Rs.${Number(customer["Credit Limit"]).toLocaleString("en-IN")}`],
      ["Utilisation %", `${customer["Utilisation %"]}%`],
      ["Avg Payment Ratio", `${customer["Avg Payment Ratio"]}%`],
      ["Min Due Paid Frequency", `${customer["Min Due Paid Frequency"]}%`],
      ["Recent Spend Change %", `${customer["Recent Spend Change %"]}%`],
      ["Cash Withdrawal %", `${customer["Cash Withdrawal %"]}%`],
      ["Merchant Mix Index", String(customer["Merchant Mix Index"])],
    ],
  });


    // ===== Risk Assessment Summary / narrative =====
    const afterMetricsY = (doc as any).lastAutoTable.finalY + 8;
    doc.setFontSize(12);
    doc.text("Risk Assessment Summary", 14, afterMetricsY);

    doc.setFontSize(10);
    const summaryText =
      customer.Risk_Reasons_Text ||
      "No specific risk reasons recorded for this customer.";
    const split = doc.splitTextToSize(summaryText, 180);
    doc.text(split, 14, afterMetricsY + 6);

    // ===== Save file =====
    const fileName = `RiskReport_${customer["Customer ID"]}.pdf`;
    doc.save(fileName);
  };



  const handleContactCustomer = () => {
    if (!customer) return;

    const subject = encodeURIComponent(
      `Customer outreach – ${customer["Customer ID"]}`
    );

    const bodyLines = [
      `Please reach out to the following customer regarding their credit card usage:`,
      ``,
      `Customer ID: ${customer["Customer ID"]}`,
      `Risk Level: ${customer.Risk_Level}`,
      `Behaviour Risk Score: ${customer.Behaviour_Risk_Score}`,
      `Payment Stress Score: ${customer.Payment_Stress_Score}`,
      ``,
      `Suggested tone: supportive, early-intervention call (not hard collections).`,
      ``,
      `Generated via Early Risk Signal System.`,
    ];

    const body = encodeURIComponent(bodyLines.join("\n"));

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  if (!loading && !customer) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-6 py-12">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Customer not found</p>
              <Link to="/results">
                <Button className="mt-4" variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Results
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!customer) {
    // initial loading state
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-6 py-12">
          <p className="text-center text-muted-foreground">Loading customer details…</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-6 py-8">
        <div className="mb-6">
          <Link to="/results">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Results
            </Button>
          </Link>
        </div>

        {/* Customer Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-1">
                Customer {customer["Customer ID"]}
              </h2>
              <p className="text-muted-foreground">
                Utilisation: {customer["Utilisation %"]}% | Credit Limit:{" "}
                {formatCurrency(customer["Credit Limit"])}
              </p>
            </div>
            <RiskBadge level={customer.Risk_Level} size="lg" />
          </div>

          <Card className="bg-muted/30 border-l-4 border-l-primary">
            <CardContent className="py-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm text-foreground mb-1">
                    Risk Assessment Summary
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {customer.Risk_Reasons_Text}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Risk Metrics */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Behaviour Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {customer.Behaviour_Risk_Score?.toFixed
                    ? customer.Behaviour_Risk_Score.toFixed(1)
                    : customer.Behaviour_Risk_Score}
                </div>
                <Progress value={customer.Behaviour_Risk_Score} className="h-2" />
                <RiskBadge level={customer.Behaviour_Risk_Category} size="sm" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <TrendingDown className="h-4 w-4" />
                Payment Stress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {customer.Payment_Stress_Score?.toFixed
                    ? customer.Payment_Stress_Score.toFixed(1)
                    : customer.Payment_Stress_Score}
                </div>
                <Progress value={customer.Payment_Stress_Score} className="h-2" />
                <RiskBadge level={customer.Payment_Stress_Category} size="sm" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Risk Flags
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">
                {customer.Total_Risk_Flags}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total identified early warning signals
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Delinquency Outlook
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium text-muted-foreground">
                    Next Month DPD Bucket:
                  </span>{" "}
                  <span className="font-bold">{customer["DPD Bucket Next Month"]}</span>
                </p>
                <p>
                  <span className="font-medium text-muted-foreground">
                    Recent Spend Change:
                  </span>{" "}
                  <span className="font-bold">
                    {customer["Recent Spend Change %"]}%
                  </span>
                </p>
                <p>
                  <span className="font-medium text-muted-foreground">
                    Merchant Mix Index:
                  </span>{" "}
                  <span className="font-bold">{customer["Merchant Mix Index"]}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Behaviour & Transaction Details */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Spending & Usage Behaviour</CardTitle>
              <CardDescription>How the customer is using the card</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Credit Limit</span>
                <span className="font-semibold">
                  {formatCurrency(customer["Credit Limit"])}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Utilisation</span>
                <span className="font-semibold">
                  {customer["Utilisation %"]}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Payment Ratio</span>
                <span className="font-semibold">
                  {customer["Avg Payment Ratio"]}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Min Due Paid Frequency</span>
                <span className="font-semibold">
                  {customer["Min Due Paid Frequency"]}%
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Cash & Transaction Patterns</CardTitle>
              <CardDescription>Early risk signals from recent activity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recent Spend Change</span>
                <span className="font-semibold">
                  {customer["Recent Spend Change %"]}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Cash Withdrawal %</span>
                <span className="font-semibold">
                  {customer["Cash Withdrawal %"]}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Merchant Mix Index</span>
                <span className="font-semibold">
                  {customer["Merchant Mix Index"]}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <Card className="shadow-card">
          <CardContent className="py-6">
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                variant="default"
                size="lg"
                className="bg-primary hover:bg-primary/90"
                onClick={handleScheduleReview}
              >
                Schedule Review
              </Button>
              <Button variant="outline" size="lg" onClick={handleGenerateReport}>
                Generate Report
              </Button>
              <Button variant="outline" size="lg" onClick={handleContactCustomer}>
                Contact Customer
              </Button>
            </div>
          </CardContent>
        </Card>

      </main>
    </div>
  );
};

export default CustomerDetail;
