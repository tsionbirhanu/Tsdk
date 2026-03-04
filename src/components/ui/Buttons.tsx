"use client";
import { ReactNode } from "react";
import { T } from "@/lib/theme";

interface GoldBtnProps { children: ReactNode; onClick?: () => void; size?: 'sm' | 'md' | 'lg'; }
interface GhostProps   { children: ReactNode; onClick?: () => void; size?: 'sm' | 'md' | 'lg'; }

export function GoldBtn({ children, onClick, size = 'sm' }: GoldBtnProps) {
  const sizeClass = size === 'lg' ? 'px-6 py-3 text-lg' : size === 'md' ? 'px-5 py-2.5 text-base' : 'px-5 py-2.5 text-xs';
  return (
    <button onClick={onClick}
      className={`flex items-center gap-2 rounded-xl font-semibold transition-all cinzel ${sizeClass}`}
      style={{ background: `linear-gradient(135deg,${T.gold},${T.goldDk})`, color: T.cream, boxShadow: `0 4px 20px ${T.gold}44` }}>
      {children}
    </button>
  );
}

export function Ghost({ children, onClick, size = 'sm' }: GhostProps) {
  const sizeClass = size === 'lg' ? 'px-4 py-2 text-base' : size === 'md' ? 'px-3 py-2 text-sm' : 'px-3 py-2 text-xs';
  return (
    <button onClick={onClick}
      className={`flex items-center gap-2 rounded-xl ${sizeClass} font-medium transition-all`}
      style={{ color: T.cream, border: `1px solid ${T.border}`, background: "transparent" }}>
      {children}
    </button>
  );
}