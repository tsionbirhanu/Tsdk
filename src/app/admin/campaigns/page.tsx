"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { T, IMG } from "@/lib/theme";
import { P } from "@/lib/icons";
import { initCamps, Campaign } from "@/lib/data";
import Hero from "@/components/ui/Hero";
import Ico from "@/components/ui/Ico";
import Badge from "@/components/ui/Badge";
import Prog from "@/components/ui/Prog";
import { GoldBtn, Ghost } from "@/components/ui/Buttons";

const statusColors: Record<string, string> = {
  Active:    "#6aab7a",
  Paused:    "#e0a030",
  Completed: "#70a0e0",
  Closed:    "#888",
};

export default function PageCampaigns() {
  const router = useRouter();
  const [camps, setCamps] = useState<Campaign[]>(initCamps);
  const [filter, setFilter] = useState<string>("All");

  const statuses = ["All", "Active", "Paused", "Completed", "Closed"];
  const filtered = filter === "All" ? camps : camps.filter(c => c.status === filter);

  const setStatus = (id: number, status: string) =>
    setCamps(c => c.map(x => x.id === id ? { ...x, status } : x));

  const totalRaised = camps.reduce((s, c) => s + c.raised, 0);
  const totalGoal   = camps.reduce((s, c) => s + c.goal,   0);
  const activeCnt   = camps.filter(c => c.status === "Active").length;

  return (
    <div className="space-y-5 fade-up">
      <Hero
        img={IMG.altar}
        pre="Campaign Management"
        title="Fundraising Campaigns"
        sub="Create, monitor and manage all church campaigns"
        op={10}
        action={
          <Link href="/admin/campaigns/create">
          <GoldBtn>
            <Ico d={P.plus} c="w-4 h-4" />
            New Campaign
          </GoldBtn>
        </Link>
        }
      />

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Campaigns", value: camps.length,                    sub: `${activeCnt} active`,                   c: T.gold    },
          { label: "Total Raised",    value: `ETB ${totalRaised.toLocaleString()}`, sub: `of ETB ${totalGoal.toLocaleString()} goal`, c: "#6aab7a" },
          { label: "Total Members",   value: camps.reduce((s,c) => s+c.members,0), sub: "across all campaigns",              c: "#9080d0" },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl p-5"
            style={{ background: T.card, border: `1px solid ${T.border}` }}>
            <div className="h-0.5 -mx-5 -mt-5 mb-4 rounded-t-2xl" style={{ background: s.c }} />
            <p className="text-4xl font-black cinzel" style={{ color: T.cream }}>{s.value}</p>
            <p className="text-lg uppercase tracking-widest mt-1 cinzel" style={{ color: T.cream }}>{s.label}</p>
            <p className="text-base crimson italic mt-0.5" style={{ color: s.c }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2" style={{ borderBottom: `1px solid ${T.border}` }}>
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className="px-4 py-2.5 text-lg font-bold border-b-2 transition-all -mb-px cinzel"
            style={{
              borderBottomColor: filter === s ? T.gold : "transparent",
              color: filter === s ? T.gold : T.mutedDk,
            }}>
            {s}
            <span className="ml-1.5 text-xs px-2 py-1 rounded-full"
              style={{ background: `${T.border}`, color: T.muted }}>
              {s === "All" ? camps.length : camps.filter(c => c.status === s).length}
            </span>
          </button>
        ))}
      </div>

      {/* Campaign grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map(c => (
          <div key={c.id} className="relative overflow-hidden rounded-2xl card-hover"
            style={{ background: T.card, border: `1px solid ${T.border}` }}>
            {/* status color stripe */}
            <div className="absolute top-0 left-0 right-0 h-0.5"
              style={{ background: statusColors[c.status] ?? T.border }} />
            <div className="relative z-10 p-5">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${T.gold}18`, color: T.gold }}>
                  <Ico d={P.campaign} c="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-xl truncate cinzel" style={{ color: T.cream }}>{c.title}</h4>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <Badge status={c.status} />
                    <span className="text-sm flex items-center gap-1 crimson" style={{ color: T.cream }}>
                      <Ico d={P.calendar} c="w-4 h-4" />{c.ends}
                    </span>
                    <span className="text-sm crimson" style={{ color: T.cream }}>{c.members} members</span>
                  </div>
                </div>
              </div>

              <Prog value={c.raised} max={c.goal} />

              <div className="flex gap-2 mt-4 flex-wrap">
                {/* Manage → detail route */}
                <GoldBtn sm onClick={() => router.push(`/admin/campaigns/${c.id}`)}>
                  <Ico d={P.edit} c="w-3.5 h-3.5" />Edit
                </GoldBtn>

                {c.status === "Active" && (
                  <button onClick={() => setStatus(c.id, "Paused")}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all cinzel"
                    style={{ background: "rgba(180,120,0,0.1)", color: "#e0a030", borderColor: "rgba(180,120,0,0.3)" }}>
                    <Ico d={P.pause} c="w-4 h-4" />Pause
                  </button>
                )}
                {c.status === "Paused" && (
                  <button onClick={() => setStatus(c.id, "Active")}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all cinzel"
                    style={{ background: "rgba(50,120,70,0.1)", color: "#6aab7a", borderColor: "rgba(50,120,70,0.3)" }}>
                    <Ico d={P.play} c="w-4 h-4" />Resume
                  </button>
                )}
                {c.status !== "Closed" && c.status !== "Completed" && (
                  <button onClick={() => setStatus(c.id, "Closed")}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium border transition-all cinzel"
                    style={{ background: "rgba(140,40,40,0.1)", color: "#d07070", borderColor: "rgba(140,40,40,0.3)" }}>
                    <Ico d={P.stop} c="w-4 h-4" />Close
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-2 flex flex-col items-center justify-center py-20 rounded-2xl"
            style={{ border: `1px solid ${T.border}`, background: T.card }}>
            <Ico d={P.campaign} c="w-10 h-10 mb-3" />
            <p className="text-sm crimson italic" style={{ color: T.muted }}>No {filter} campaigns found</p>
            <Link href="/admin/campaigns/create">
              <GoldBtn sm>
                <Ico d={P.plus} c="w-3.5 h-3.5" />Create one
              </GoldBtn>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}