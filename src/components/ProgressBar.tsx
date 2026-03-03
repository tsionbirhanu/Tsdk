import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  size?: "sm" | "md" | "lg";
  showPercentage?: boolean;
  animated?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  className,
  size = "md",
  showPercentage = false,
  animated = true,
}) => {
  const [displayValue, setDisplayValue] = useState(animated ? 0 : value);
  const percentage = Math.min((value / max) * 100, 100);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayValue(value);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [value, animated]);

  const displayPercentage = Math.min(
    ((animated ? displayValue : value) / max) * 100,
    100,
  );

  const sizeClasses = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "bg-[var(--color-surface-2)] rounded-full overflow-hidden",
          sizeClasses[size],
        )}>
        <div
          className="bg-[var(--color-accent)] h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
          style={{ width: `${displayPercentage}%` }}>
          {/* Subtle shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>
      </div>
      {showPercentage && (
        <div className="mt-1 text-right">
          <span className="text-xs font-mono text-[var(--color-text-muted)]">
            {percentage.toFixed(0)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;
