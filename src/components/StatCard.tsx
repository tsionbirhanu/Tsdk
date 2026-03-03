import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  trend?: {
    value: string;
    type: "up" | "down" | "neutral";
  };
  className?: string;
  accent?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  trend,
  className,
  accent = false,
}) => {
  return (
    <div
      className={cn(
        "bg-white p-6 rounded-lg shadow-warm border border-[var(--color-border)]",
        accent && "border-t-4 border-t-[var(--color-accent)]",
        "hover-lift",
        className,
      )}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 rounded-full bg-[var(--color-surface)]">
          <div className="text-[var(--color-primary)] w-5 h-5 flex items-center justify-center">
            {icon}
          </div>
        </div>
        {trend && (
          <div
            className={cn(
              "text-xs px-2 py-1 rounded-full",
              trend.type === "up" &&
                "bg-[var(--color-success)]/10 text-[var(--color-success)]",
              trend.type === "down" &&
                "bg-[var(--color-danger)]/10 text-[var(--color-danger)]",
              trend.type === "neutral" &&
                "bg-[var(--color-surface-2)] text-[var(--color-text-muted)]",
            )}>
            {trend.type === "up" && "↗"}
            {trend.type === "down" && "↘"}
            {trend.value}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-mono font-bold text-[var(--color-text)]">
          {typeof value === "number" && value >= 1000
            ? `ETB ${value.toLocaleString()}`
            : value}
        </p>
        <p className="text-sm font-body text-[var(--color-text-muted)]">
          {label}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
