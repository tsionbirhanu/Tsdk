// src/components/admin/Sidebar.tsx
"use client";

import Link from "next/link";
import { T } from "@/lib/theme";
import { P } from "@/lib/icons";
import Ico from "@/components/ui/Ico";

export type NavId =
  | "dashboard"
  | "campaigns"
  | "churches"
  | "financial"
  | "users"
  | "reports"
  | "ai"
  | "settings";

interface SidebarProps {
  active: NavId;
  setActive: (id: NavId) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const navItems: Array<{ id: NavId; label: string; href: string; icon: string; badge?: string | number; isNew?: boolean }> = [
  { id: "dashboard", label: "Dashboard", href: "/admin", icon: P.dashboard },
  { id: "campaigns", label: "Campaigns", href: "/admin/campaigns", icon: P.campaign, badge: 5 },
  { id: "churches", label: "Churches", href: "/admin/churches", icon: P.altar },
  { id: "financial", label: "Financial", href: "/admin/financial", icon: P.finance },
  { id: "users", label: "Users", href: "/admin/users", icon: P.users, badge: 6 },
  { id: "reports", label: "Reports", href: "/admin/reports", icon: P.reports },
  { id: "ai", label: "AI Generator", href: "/admin/ai", icon: P.ai },
  { id: "settings", label: "Settings", href: "/admin/settings", icon: P.settings },
];

export default function Sidebar({ active, setActive, open, setOpen }: SidebarProps) {
  const widthClass = open ? "w-60" : "w-20";
  return (
    <aside
      className={`${widthClass} flex-shrink-0 flex flex-col z-20 transition-width duration-200`}
      style={{ background: "#1c1508", borderRight: `1px solid ${T.border}` }}
    >
      <div className="flex items-center justify-between px-4 py-4" style={{ borderBottom: `1px solid ${T.border}` }}>
        <div className="flex items-center gap-3 overflow-hidden">
          {open && (
            <div className="overflow-hidden whitespace-nowrap">
              <div className="flex items-baseline gap-1">
                <span className="text-sm font-black cinzel tracking-wider" style={{ color: T.gold }}>
                  TSEDQ
                </span>
                <span className="text-sm font-black cinzel tracking-wider" style={{ color: T.cream }}>
                  ADMIN
                </span>
              </div>
              <p className="text-[10px] crimson italic" style={{ color: T.mutedDk }}>
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => setOpen(!open)}
          className="p-1 rounded-md hover:bg-white/10"
          title={open ? "Collapse" : "Expand"}
        >
          <Ico d={P.chevRight} c={`w-5 h-5 transform ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
      {open && (
        <p className="text-[9px] uppercase tracking-[0.35em] px-5 pt-5 pb-2 cinzel" style={{ color: T.mutedDk }}>
          Navigation
        </p>
      )}
      <nav className="flex-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            onClick={() => setActive(item.id)}
            className={`flex items-center gap-3 py-2 px-4 hover:bg-white/10 transition-colors whitespace-nowrap ${
              active === item.id ? "bg-white/20 font-semibold" : "text-white"
            }`}
          >
            <Ico d={item.icon} c="w-5 h-5" />
            {open && <span className="flex-1 cinzel text-lg">{item.label}</span>}
            {item.badge && open && (
              <span
                className={`ml-auto text-xs rounded-full px-2 ${
                  item.isNew ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"
                }`}
              >
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </nav>
      {/* profile at bottom */}
      <div className="px-4 py-4 border-t border-white/20 mt-auto">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c28733] to-[#8b5a1a] flex items-center justify-center text-white text-sm font-bold">
            DA
          </div>
          {open && (
            <div className="flex flex-col">
              <span className="text-sm font-medium cinzel" style={{ color: T.cream }}>Super Admin</span>
              <span className="text-xs mt-1 px-2 py-0.5 rounded-full" style={{ background: T.border2, color: T.gold }}>ADMIN</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
