import React from "react";
import { cn } from "@/lib/utils";

type BadgeVariant =
  | "paid"
  | "active"
  | "partial"
  | "missed"
  | "pending"
  | "confirmed"
  | "fulfilled"
  | "overdue"
  | "closed"
  | "member"
  | "treasurer"
  | "admin";

interface StatusBadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant,
  children,
  className,
}) => {
  const variantClasses = {
    paid: "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20",
    confirmed:
      "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20",
    fulfilled:
      "bg-[var(--color-success)]/10 text-[var(--color-success)] border-[var(--color-success)]/20",
    active:
      "bg-[var(--color-accent)]/10 text-[var(--color-primary)] border-[var(--color-accent)]/30",
    partial:
      "bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20",
    pending:
      "bg-[var(--color-warning)]/10 text-[var(--color-warning)] border-[var(--color-warning)]/20",
    missed:
      "bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]/20",
    overdue:
      "bg-[var(--color-danger)]/10 text-[var(--color-danger)] border-[var(--color-danger)]/20",
    closed:
      "bg-[var(--color-text-muted)]/10 text-[var(--color-text-muted)] border-[var(--color-text-muted)]/20",
    member:
      "bg-[var(--color-surface-2)] text-[var(--color-text)] border-[var(--color-border)]",
    treasurer:
      "bg-[var(--color-accent)]/10 text-[var(--color-primary)] border-[var(--color-accent)]/30",
    admin:
      "bg-[var(--color-primary)]/10 text-[var(--color-primary)] border-[var(--color-primary)]/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium font-body border",
        variantClasses[variant],
        className,
      )}>
      {children}
    </span>
  );
};

export default StatusBadge;
