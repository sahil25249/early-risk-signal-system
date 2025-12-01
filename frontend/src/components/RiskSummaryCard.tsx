import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskSummaryCardProps {
  level: "High" | "Medium" | "Low";
  count: number;
}

export const RiskSummaryCard = ({ level, count }: RiskSummaryCardProps) => {
  const config = {
    High: {
      icon: AlertTriangle,
      bgColor: "bg-risk-high-bg",
      iconColor: "text-risk-high",
      borderColor: "border-l-risk-high",
    },
    Medium: {
      icon: TrendingUp,
      bgColor: "bg-risk-medium-bg",
      iconColor: "text-risk-medium",
      borderColor: "border-l-risk-medium",
    },
    Low: {
      icon: CheckCircle,
      bgColor: "bg-risk-low-bg",
      iconColor: "text-risk-low",
      borderColor: "border-l-risk-low",
    },
  };

  const { icon: Icon, bgColor, iconColor, borderColor } = config[level];

  return (
    <Card className={cn("border-l-4 shadow-card", borderColor)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {level} Risk Customers
        </CardTitle>
        <div className={cn("p-2 rounded-lg", bgColor)}>
          <Icon className={cn("h-5 w-5", iconColor)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground mt-1">
          {level === "High" && "Requires immediate attention"}
          {level === "Medium" && "Monitor closely"}
          {level === "Low" && "Performing well"}
        </p>
      </CardContent>
    </Card>
  );
};
