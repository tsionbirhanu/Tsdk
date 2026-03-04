"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Ico from "@/components/ui/Ico";
import { P } from "@/lib/icons";
import { IMG, T } from "@/lib/theme";

const metaFromPath = (p: string) => {
  if (p === "/admin") return { title: "Dashboard", sub: "Overview of all church giving and activity" };
  if (p.startsWith("/admin/campaigns")) return { title: "", sub: "" };
  if (p.startsWith("/admin/financial")) return { title: "Financial", sub: "Income, donations, and financial reports" };
  if (p.startsWith("/admin/users")) return { title: "Users", sub: "Manage members, deacons, and admins" };
  if (p.startsWith("/admin/reports")) return { title: "Reports", sub: "Download and review financial summaries" };
  if (p.startsWith("/admin/ai")) return { title: "AI Generator", sub: "Generate captions and posting schedules" };
  if (p.startsWith("/admin/settings")) return { title: "Settings", sub: "Church configuration and preferences" };
  return { title: "Admin", sub: "Holy Trinity EOTC · Admin Panel" };
};

export default function AdminTopbar() {
  const pathname = usePathname();
  const meta = metaFromPath(pathname);

  return (
    <>
      <header className="relative h-16 flex-shrink-0 flex items-center justify-between px-6 border-b border-white/60 bg-transparent overflow-hidden">
        {/* theme image background */}
        <div className="absolute inset-0 -z-10">
          <img src={IMG.altar} alt="theme" className="w-full h-full object-cover opacity-10" />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(14,8,4,0.25), rgba(14,8,4,0.25))' }} />
        </div>
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-[#3b2411] font-bold text-base leading-tight">
              {meta.title}
            </h1>
            <p className="text-[#8b6a46] text-xs">{meta.sub}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">


          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#c28733] to-[#8b5a1a] flex items-center justify-center text-white text-sm font-bold cursor-pointer">
            DA
          </div>
        </div>
      </header>


    </>
  );
}