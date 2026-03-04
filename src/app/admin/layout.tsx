"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { T } from "@/lib/theme";
import { P } from "@/lib/icons";
import Sidebar, { NavId } from "@/components/admin/Sidebar";
import Ico from "@/components/ui/Ico";
import FontStyles from "@/components/ui/FontStyles";

import PageDashboard from "./page";
import PageCampaigns from "./campaigns/page";
import PageFinancial from "./financial/page";
import PageUsers     from "./users/page";
import PageReports   from "./reports/page";
import PageAI        from "./ai/page";
import PageSettings  from "./settings/page";
import PageChurches  from "./churches/page";

const pageMap: Record<NavId, { title:string; sub:string }> = {
  dashboard: { title:"Dashboard",    sub:"Overview of all church giving and activity"  },
  campaigns: { title:"Campaigns",    sub:"Create and manage fundraising campaigns"     },
  financial: { title:"Financial",    sub:"Income, donations, and financial reports"    },
  users:     { title:"Users",        sub:"Manage members, deacons, and admins"         },
  reports:   { title:"Reports",      sub:"Download and review financial summaries"     },
  ai:        { title:"AI Generator", sub:"Generate captions and posting schedules"     },
  churches:  { title:"Churches",     sub:"Add or modify church accounts"                },
  settings:  { title:"Settings",     sub:"Church configuration and preferences"        },
};

const pages: Record<NavId, React.ReactNode> = {
  dashboard: <PageDashboard />,
  campaigns: <PageCampaigns />,
  financial: <PageFinancial />,
  users:     <PageUsers />,
  reports:   <PageReports />,
  ai:        <PageAI />,
  churches:  <PageChurches />,
  settings:  <PageSettings />,
};


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [active,      setActive]      = useState<NavId>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (pathname.startsWith("/admin/campaigns")) setActive("campaigns");
    else if (pathname.startsWith("/admin/financial")) setActive("financial");
    else if (pathname.startsWith("/admin/users")) setActive("users");
    else if (pathname.startsWith("/admin/reports")) setActive("reports");
    else if (pathname.startsWith("/admin/ai")) setActive("ai");
    else if (pathname.startsWith("/admin/churches")) setActive("churches");
    else if (pathname.startsWith("/admin/settings")) setActive("settings");
    else setActive("dashboard");
  }, [pathname]);

  return (
    <div className="flex h-screen overflow-hidden"
      style={{ background:T.bg, fontFamily:"'Crimson Pro',Georgia,serif" }}>
      <FontStyles />
      <Sidebar active={active} setActive={setActive} open={sidebarOpen} setOpen={setSidebarOpen}/>
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <main className="flex-1 overflow-y-auto p-6" style={{ background:T.bg }}>
          {children}
        </main>
      </div>
    </div>
  );
}