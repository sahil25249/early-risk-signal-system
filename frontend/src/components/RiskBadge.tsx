import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RiskBadgeProps {
  level: "High" | "Medium" | "Low";
  size?: "sm" | "default" | "lg";
}

export const RiskBadge = ({ level, size = "default" }: RiskBadgeProps) => {
  const variants = {
    High: "bg-risk-high-bg text-risk-high border-risk-high/20",
    Medium: "bg-risk-medium-bg text-risk-medium border-risk-medium/20",
    Low: "bg-risk-low-bg text-risk-low border-risk-low/20",
  };

  const sizes = {
    sm: "text-xs px-2 py-0.5",
    default: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "font-semibold border",
        variants[level],
        sizes[size]
      )}
    >
      {level} Risk
    </Badge>
  );
};
