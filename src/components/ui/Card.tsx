import { ReactNode } from "react";
import { T } from "@/lib/theme";

interface CardProps { children: ReactNode; className?: string; }

export default function Card({ children, className = "" }: CardProps) {
  return (
    <div className={`rounded-2xl card-hover p-5 ${className}`}
      style={{ background: T.card, border: `1px solid ${T.border}` }}>
      {children}
    </div>
  );
}