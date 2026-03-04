import React from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action,
  className,
}) => {
  return (
    <div className={cn("flex items-start justify-between mb-8", className)}>
      <div>
        <h1 className="font-display text-3xl font-bold text-[var(--color-text)] mb-2">
          {title}
        </h1>
        {subtitle && (
          <p className="font-body text-[var(--color-text-muted)] text-lg">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0 ml-6">{action}</div>}
    </div>
  );
};

export default PageHeader;
