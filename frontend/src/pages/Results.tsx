import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { DashboardHeader } from "@/components/DashboardHeader";
import { RiskSummaryCard } from "@/components/RiskSummaryCard";
import { RiskBadge } from "@/components/RiskBadge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight, Download, Filter } from "lucide-react";

type RiskCounts = {
  High?: number;
  Medium?: number;
  Low?: number;
};

const Results = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [riskCounts, setRiskCounts] = useState<RiskCounts>({});
  const [loading, setLoading] = useState(true);

  // 🔹 Filter by Risk Level (High / Medium / Low / All)
  const [riskFilter, setRiskFilter] = useState<"All" | "High" | "Medium" | "Low">(
    "All"
  );

  // 🔹 Filter by Delinquency (All / Delinquent / Not Delinquent)
  const [delinquencyFilter, setDelinquencyFilter] = useState<
    "All" | "Yes" | "No"
  >("All");

  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // 🔹 Apply both filters together: Risk Level + Delinquency
  const filteredCustomers = customers.filter((c) => {
    // Risk filter: if "All", accept all, else match Risk_Level
    const riskOk =
      riskFilter === "All" ? true : c.Risk_Level === riskFilter;

    // Delinquency filter using Delinquent_NextMonth_Flag from backend
    const flag = c.Delinquent_NextMonth_Flag;
    const delinqOk =
      delinquencyFilter === "All"
        ? true
        : delinquencyFilter === "Yes"
        ? flag === 1
        : flag === 0; // "No"

    return riskOk && delinqOk;
  });

  useEffect(() => {
    try {
      const rcRaw = localStorage.getItem("riskCounts");
      const custRaw = localStorage.getItem("customers");

      if (rcRaw) {
        setRiskCounts(JSON.parse(rcRaw));
      }
      if (custRaw) {
        setCustomers(JSON.parse(custRaw));
      }
    } catch (err) {
      console.error("Failed to load results from localStorage", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const formatCurrency = (value: number) => {
    if (value == null || Number.isNaN(value)) return "-";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // 🔹 Export CSV: use CURRENT FILTERED CUSTOMERS and include delinquency fields
  const handleExportCsv = () => {
    if (!filteredCustomers || filteredCustomers.length === 0) return;

    // Define columns (header label + actual field name in data)
    const columns = [
      { header: "Customer ID", field: "Customer ID" },
      { header: "Risk Level", field: "Risk_Level" },
      { header: "Behaviour Risk Score", field: "Behaviour_Risk_Score" },
      { header: "Payment Stress Score", field: "Payment_Stress_Score" },
      { header: "Total Risk Flags", field: "Total_Risk_flags" },
      { header: "Credit Limit", field: "Credit Limit" },
      { header: "Utilisation %", field: "Utilisation %" },
      { header: "Avg Payment Ratio", field: "Avg Payment Ratio" },
      { header: "Min Due Paid Frequency", field: "Min Due Paid Frequency" },
      { header: "Recent Spend Change %", field: "Recent Spend Change %" },
      { header: "Cash Withdrawal %", field: "Cash Withdrawal %" },
      { header: "Merchant Mix Index", field: "Merchant Mix Index" },
      { header: "DPD Bucket Next Month", field: "DPD Bucket Next Month" },
      {
        header: "Delinquent Next Month Flag",
        field: "Delinquent_NextMonth_Flag",
      },
      {
        header: "Delinquent Next Month Label",
        field: "Delinquent_NextMonth_Label",
      },
      { header: "Risk Reasons", field: "Risk_Reasons_Text" },
    ];

    const csvHeader = columns.map((col) => col.header).join(",");
    const csvRows = filteredCustomers.map((row) =>
      columns
        .map((col) => {
          const value = row[col.field] ?? "";
          const str = String(value).replace(/"/g, '""'); // escape double quotes
          return `"${str}"`;
        })
        .join(",")
    );

    const csvContent = [csvHeader, ...csvRows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "early_risk_results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!loading && customers.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardHeader />
        <main className="container mx-auto px-6 py-12">
          <Card className="max-w-xl mx-auto">
            <CardHeader>
              <CardTitle>No results available</CardTitle>
              <CardDescription>
                Please upload a customer data file on the upload screen to run
                the risk engine.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end">
              <Link to="/">
                <Button>Go to Upload</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-6 py-8">
        {/* Header row */}
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Risk Assessment Results
            </h2>
            <p className="text-muted-foreground">
              Comprehensive analysis of {customers.length} customer accounts
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilterPanel((prev) => !prev)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportCsv}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Filter Panel */}
        {showFilterPanel && (
          <div className="mb-6 p-4 border rounded-lg bg-muted/30">
            <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
              {/* Risk Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">
                  Risk Level:
                </span>
                {["All", "High", "Medium", "Low"].map((level) => (
                  <Button
                    key={level}
                    variant={riskFilter === level ? "default" : "outline"}
                    size="sm"
                    onClick={() => setRiskFilter(level as any)}
                  >
                    {level}
                  </Button>
                ))}
              </div>

              {/* Delinquency Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-muted-foreground">
                  Delinquency:
                </span>
                {[
                  { key: "All", label: "All" },
                  { key: "Yes", label: "Delinquent" },
                  { key: "No", label: "Not Delinquent" },
                ].map((item) => (
                  <Button
                    key={item.key}
                    variant={
                      delinquencyFilter === item.key ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() =>
                      setDelinquencyFilter(item.key as "All" | "Yes" | "No")
                    }
                  >
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Risk Summary Cards */}
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <RiskSummaryCard level="High" count={riskCounts.High || 0} />
          <RiskSummaryCard level="Medium" count={riskCounts.Medium || 0} />
          <RiskSummaryCard level="Low" count={riskCounts.Low || 0} />
        </div>

        {/* Customer List */}
        <Card className="shadow-elevated">
          <CardHeader>
            <CardTitle>Customer Risk Profiles</CardTitle>
            <CardDescription>
              Detailed risk assessment for all analyzed accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Customer</TableHead>
                    <TableHead className="font-semibold">Risk Level</TableHead>
                    <TableHead className="font-semibold">
                      Behaviour Score
                    </TableHead>
                    <TableHead className="font-semibold">
                      Delinquent Next Month
                    </TableHead>
                    <TableHead className="font-semibold">
                      Credit Limit
                    </TableHead>
                    <TableHead className="font-semibold">
                      Total Risk Flags
                    </TableHead>
                    <TableHead className="font-semibold text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.map((customer) => (
                    <TableRow
                      key={customer["Customer ID"]}
                      className="hover:bg-muted/30"
                    >
                      {/* Customer info cell */}
                      <TableCell>
                        <div>
                          <div className="font-medium text-foreground">
                            {customer["Customer ID"]}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Utilisation: {customer["Utilisation %"]}%
                          </div>
                        </div>
                      </TableCell>

                      {/* Risk Level */}
                      <TableCell>
                        <RiskBadge level={customer.Risk_Level} size="sm" />
                      </TableCell>

                      {/* Behaviour Risk Score */}
                      <TableCell>
                        <div className="font-mono text-sm">
                          {typeof customer.Behaviour_Risk_Score === "number"
                            ? customer.Behaviour_Risk_Score.toFixed(1)
                            : customer.Behaviour_Risk_Score}
                        </div>
                      </TableCell>

                      {/* Delinquency cell */}
                      <TableCell>
                        {customer.Delinquent_NextMonth_Flag === 1 ? (
                          <span className="text-sm font-semibold text-red-600">
                            Yes (Delinquent)
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            No
                          </span>
                        )}
                      </TableCell>

                      {/* Credit limit cell */}
                      <TableCell>
                        <div className="font-semibold">
                          {formatCurrency(customer["Credit Limit"])}
                        </div>
                      </TableCell>

                      {/* Total Risk Flags */}
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">
                            {customer.Total_Risk_flags}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            flags
                          </span>
                        </div>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <Link to={`/customer/${customer["Customer ID"]}`}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-primary hover:text-primary hover:bg-primary/10"
                          >
                            View Details
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Results;
