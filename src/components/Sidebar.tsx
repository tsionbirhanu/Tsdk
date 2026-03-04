"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Heart,
  Calendar,
  Handshake,
  Coins,
  Bell,
  User,
  LogOut,
  Users,
  BarChart3,
  MessageSquare,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/api/auth-context";

interface SidebarProps {
  isAdmin?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isAdmin = false }) => {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const memberNavItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: Heart, label: "Campaigns", href: "/campaigns" },
    { icon: Calendar, label: "Aserat", href: "/aserat" },
    { icon: Handshake, label: "Selet", href: "/selet" },
    { icon: Coins, label: "Gbir", href: "/gbir" },
    { icon: Bell, label: "Notifications", href: "/notifications" },
    { icon: User, label: "Profile", href: "/profile" },
  ];

  const adminNavItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/admin" },
    { icon: Heart, label: "Campaigns", href: "/admin/campaigns" },
    { icon: Users, label: "Members", href: "/admin/members" },
    { icon: BarChart3, label: "Financial Dashboard", href: "/admin/dashboard" },
    { icon: MessageSquare, label: "AI Captions", href: "/admin/ai-captions" },
  ];

  const navItems = isAdmin ? adminNavItems : memberNavItems;

  const isActive = (href: string) => {
    if (href === "/dashboard" || href === "/admin") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="w-72 bg-[var(--color-primary)] text-white h-screen flex flex-col fixed left-0 top-0 z-50">
      {/* Logo Section */}
      <div className="p-6 border-b border-[var(--color-primary-light)]">
        <Link href="/" className="flex items-center gap-3">
          <div className="font-display text-2xl font-bold tracking-wide">
            TSEDK
          </div>
          <div className="w-2 h-2 rounded-full bg-[var(--color-accent)]" />
        </Link>
        {isAdmin && (
          <p className="text-[var(--color-accent)] text-sm mt-1 font-body">
            Admin Panel
          </p>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-6">
        <ul className="space-y-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg font-body font-medium transition-all duration-200",
                    active
                      ? "bg-[var(--color-primary-light)] text-white border-l-4 border-l-[var(--color-accent)]"
                      : "text-white/80 hover:bg-[var(--color-primary-light)]/50 hover:text-white",
                  )}>
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-[var(--color-primary-light)]">
        {/* User Info */}
        <div className="flex items-center gap-3 mb-4 px-2">
          {user ? (
            <>
              <div className="w-10 h-10 rounded-full bg-[var(--color-accent)] text-[var(--color-primary)] flex items-center justify-center font-display font-bold">
                {user.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body font-semibold text-white truncate">
                  {user.full_name}
                </p>
                <p className="text-xs text-white/70 truncate capitalize">
                  {user.role}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-gray-400 animate-pulse" />
              <div className="flex-1 space-y-1">
                <div className="h-4 bg-gray-400 rounded animate-pulse" />
                <div className="h-3 bg-gray-400 rounded w-3/4 animate-pulse" />
              </div>
            </>
          )}
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-body font-medium text-white/80 hover:bg-[var(--color-primary-light)]/50 hover:text-white transition-all duration-200">
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
