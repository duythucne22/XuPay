import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const kpiCardVariants = cva("", {
  variants: {
    color: {
      emerald: "border-emerald-200 dark:border-emerald-800",
      blue: "border-blue-200 dark:border-blue-800",
      amber: "border-amber-200 dark:border-amber-800",
      red: "border-red-200 dark:border-red-800",
    },
  },
  defaultVariants: {
    color: "emerald",
  },
});

interface KPICardProps extends VariantProps<typeof kpiCardVariants> {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    direction: "up" | "down" | "neutral";
    percentage: number;
  };
  color?: "emerald" | "blue" | "amber" | "red";
  isLoading?: boolean;
  className?: string;
}

const colorMap = {
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-950", text: "text-emerald-900 dark:text-emerald-100", icon: "text-emerald-600 dark:text-emerald-400" },
  blue: { bg: "bg-blue-50 dark:bg-blue-950", text: "text-blue-900 dark:text-blue-100", icon: "text-blue-600 dark:text-blue-400" },
  amber: { bg: "bg-amber-50 dark:bg-amber-950", text: "text-amber-900 dark:text-amber-100", icon: "text-amber-600 dark:text-amber-400" },
  red: { bg: "bg-red-50 dark:bg-red-950", text: "text-red-900 dark:text-red-100", icon: "text-red-600 dark:text-red-400" },
};

const trendColors = {
  up: "text-emerald-600 dark:text-emerald-400",
  down: "text-red-600 dark:text-red-400",
  neutral: "text-gray-600 dark:text-gray-400",
};

const KPICard = React.forwardRef<HTMLDivElement, KPICardProps>(
  ({ label, value, icon, trend, color = "emerald", isLoading, className }, ref) => {
    const colorStyles = colorMap[color];

    return (
      <Card
        ref={ref}
        variant="default"
        className={cn(colorStyles.bg, kpiCardVariants({ color }), className)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
              {label}
            </p>
            {isLoading ? (
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-24 mb-2" />
            ) : (
              <p className={cn("text-2xl font-bold", colorStyles.text)}>
                {value}
              </p>
            )}
          </div>
          {icon && (
            <div className={cn("w-8 h-8 flex items-center justify-center", colorStyles.icon)}>
              {icon}
            </div>
          )}
        </div>

        {trend && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex items-center gap-2">
            <Badge
              variant={trend.direction === "up" ? "success" : trend.direction === "down" ? "destructive" : "secondary"}
              className="text-xs"
            >
              {trend.direction === "up" ? "↑" : trend.direction === "down" ? "↓" : "→"}{" "}
              {trend.percentage}%
            </Badge>
            <span className={cn("text-xs font-medium", trendColors[trend.direction])}>
              {trend.direction === "up" ? "Trending up" : trend.direction === "down" ? "Trending down" : "No change"}
            </span>
          </div>
        )}
      </Card>
    );
  }
);
KPICard.displayName = "KPICard";

export { KPICard, kpiCardVariants };
export type { KPICardProps };
