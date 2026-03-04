"use client";
import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { T, IMG } from "@/lib/theme";
import { P } from "@/lib/icons";
import { initCamps, txData, Campaign } from "@/lib/data";
import Ico from "@/components/ui/Ico";
import Badge from "@/components/ui/Badge";
import Prog from "@/components/ui/Prog";
import Card from "@/components/ui/Card";
import Fld from "@/components/ui/Fld";
import TxTable from "@/components/ui/TxTable";
import { GoldBtn, Ghost } from "@/components/ui/Buttons";

type ManageTab = "overview" | "donors" | "settings";

const milestones = [
  { pct: 25,  label: "Quarter Way",  reached: true  },
  { pct: 50,  label: "Halfway",      reached: true  },
  { pct: 75,  label: "Three Quarter",reached: false },
  { pct: 100, label: "Goal Reached", reached: false },
];

const recentDonors = [
  { name:"Abebe Kebede",   amount:"ETB 5,000",  date:"2 hours ago",   initials:"AK" },
  { name:"Tigist Haile",   amount:"ETB 10,000", date:"5 hours ago",   initials:"TH" },
  { name:"Mekdes Alemu",   amount:"ETB 2,500",  date:"Yesterday",     initials:"MA" },
  { name:"Biruk Mengistu", amount:"ETB 1,000",  date:"2 days ago",    initials:"BM" },
  { name:"Anonymous",      amount:"ETB 3,000",  date:"3 days ago",    initials:"AN" },
];

export default function PageManageCampaign() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);

  const original = initCamps.find(c => c.id === id) ?? initCamps[0];
  const [camp, setCamp] = useState<Campaign>({ ...original });
  const [tab, setTab] = useState<ManageTab>("overview");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Campaign>({ ...original });
  const [saved, setSaved] = useState(false);

  const pct = Math.round((camp.raised / camp.goal) * 100);

  const saveEdits = () => {
    setCamp({ ...draft });
    // also update the shared campaigns list so changes are visible on the main page
    const idx = initCamps.findIndex(c => c.id === draft.id);
    if (idx !== -1) {
      initCamps[idx] = { ...draft };
    }
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const setStatus = (status: string) => setCamp(c => ({ ...c, status }));

  const tabs: { id: ManageTab; label: string }[] = [
    { id: "overview", label: " Overview"  },
    { id: "donors",   label: " Donors"    },
    { id: "settings", label: " Settings"  },
  ];

  return (
    <div className="space-y-5 fade-up">
      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden h-44"
        style={{ border: `1px solid ${T.border}` }}>
        <img src={IMG.incense} alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: 0.45 }} />
        <div className="absolute inset-0"
          style={{ background: `linear-gradient(110deg,${T.bg}f5 0%,${T.bg}bb 55%,transparent 100%)` }} />
        <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl"
          style={{ background: `linear-gradient(180deg,${T.goldLt},${T.gold},${T.goldDk})` }} />
        <div className="relative z-10 h-full flex items-center justify-between px-8">
          <div>
            <button onClick={() => router.push("/admin/campaigns")}
              className="flex items-center gap-1.5 text-base mb-3 cinzel transition-all"
              style={{ color: T.cream }}>
              <Ico d={P.chevRight} c="w-5 h-5 rotate-180" />Back to Campaigns
            </button>
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold cinzel" style={{ color: T.gold }}>{camp.title}</h2>
              <Badge status={camp.status} />
            </div>
            <div className="flex items-center gap-4 text-sm crimson" style={{ color: T.cream }}>
              <span className="flex items-center gap-1"><Ico d={P.calendar} c="w-4 h-4" />Ends {camp.ends}</span>
              <span className="flex items-center gap-1"><Ico d={P.users} c="w-4 h-4" />{camp.members} donors</span>
              <span className="flex items-center gap-1"><Ico d={P.finance} c="w-4 h-4" />{pct}% funded</span>
            </div>
          </div>
          <div className="flex gap-3">
            {camp.status === "Active" && (
              <button
                onClick={() => setStatus("Paused")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all cinzel"
                style={{ color: T.muted, border: `1px solid ${T.border}`, background: 'transparent' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = T.cream; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = T.muted; }}>
                <Ico d={P.pause} c="w-5 h-5" />Pause
              </button>
            )}

            {camp.status === "Paused" && (
              <button
                onClick={() => setStatus("Active")}
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold cinzel"
                style={{ background: `linear-gradient(135deg,${T.gold},${T.goldDk})`, color: T.bg, boxShadow: `0 4px 20px ${T.gold}44` }}>
                <Ico d={P.play} c="w-5 h-5" />Resume
              </button>
            )}

            {camp.status !== "Closed" && camp.status !== "Completed" && (
              <button
                onClick={() => setStatus("Closed")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all cinzel"
                style={{ color: '#d07070', border: `1px solid ${T.border}`, background: 'transparent' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#d0707040'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}>
                <Ico d={P.stop} c="w-5 h-5" />Close
              </button>
            )}
          </div>
        </div>
        {/* decorative cross removed */}
      </div>

      {/* Saved toast */}
      {saved && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl cinzel text-sm font-bold"
          style={{ background: T.gold, color: T.bg }}>
          <Ico d={P.check} c="w-5 h-5" />Changes Saved
        </div>
      )}

      {/* Progress bar */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold cinzel" style={{ color: T.cream }}>Fundraising Progress</h3>
            <p className="text-base crimson italic mt-0.5" style={{ color: T.cream }}>
              ETB {camp.raised.toLocaleString()} raised of ETB {camp.goal.toLocaleString()} goal
            </p>
          </div>
          <span className="text-3xl font-black cinzel" style={{ color: T.gold }}>{pct}%</span>
        </div>
        <Prog value={camp.raised} max={camp.goal} />
        {/* Milestones */}
        <div className="flex items-center justify-between mt-5 relative">
          <div className="absolute top-2.5 left-0 right-0 h-0.5"
            style={{ background: T.border }} />
          <div className="absolute top-2.5 left-0 h-0.5 transition-all"
            style={{ background: T.gold, width: `${Math.min(pct, 100)}%` }} />
          {milestones.map((m, i) => (
            <div key={i} className="flex flex-col items-center gap-1 relative z-10">
              <div className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: m.reached ? T.gold : T.border, border: `2px solid ${m.reached ? T.gold : T.border}` }}>
                {m.reached && <Ico d={P.check} c="w-3 h-3" style={{ color: T.bg }} />}
              </div>
              <span className="text-sm cinzel whitespace-nowrap" style={{ color: m.reached ? T.gold : T.mutedDk }}>
                {m.pct}%
              </span>
              <span className="text-sm crimson" style={{ color: T.mutedDk }}>{m.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-2" style={{ borderBottom: `1px solid ${T.border}` }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-5 py-3 text-sm font-bold border-b-2 transition-all -mb-px cinzel"
            style={{
              borderBottomColor: tab === t.id ? T.gold : "transparent",
              color: tab === t.id ? T.gold : T.cream,
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview */}
      {tab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label:"Amount Raised",   value:`ETB ${camp.raised.toLocaleString()}`,  c:T.gold    },
                { label:"Total Donors",    value:camp.members,                            c:"#9080d0" },
                { label:"Days Remaining",  value:"23",                                    c:"#6aab7a" },
              ].map((s, i) => (
                <div key={i} className="rounded-2xl p-4 text-center"
                  style={{ background: T.card, border: `1px solid ${T.border}` }}>
                  <div className="h-0.5 -mx-4 -mt-4 mb-3 rounded-t-2xl" style={{ background: s.c }} />
                  <p className="text-xl font-black cinzel" style={{ color: T.cream }}>{s.value}</p>
                  <p className="text-sm uppercase tracking-widest mt-1 cinzel" style={{ color: T.cream }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Recent activity */}
            <Card>
              <h3 className="font-bold cinzel mb-4" style={{ color: T.cream }}>Recent Donations</h3>
              <TxTable data={txData} />
            </Card>
          </div>

          {/* Sidebar: top donors */}
          <div className="space-y-4">
            <Card>
              <h3 className="font-bold cinzel mb-4" style={{ color: T.cream }}>Top Donors</h3>
              <div className="space-y-3">
                {recentDonors.map((d, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cinzel flex-shrink-0"
                      style={{ background: `linear-gradient(135deg,${T.gold},${T.goldDk})`, color: T.bg }}>
                      {d.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold crimson truncate" style={{ color: T.cream }}>{d.name}</p>
                      <p className="text-xs crimson" style={{ color: T.mutedDk }}>{d.date}</p>
                    </div>
                    <span className="text-xs font-bold cinzel flex-shrink-0" style={{ color: T.gold }}>{d.amount}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="font-bold cinzel mb-3" style={{ color: T.cream }}>Share Campaign</h3>
              {[
                { label: "Telegram Link", icon: P.copy, color: "#5a9ad0" },
                { label: "Facebook Post", icon: P.sparkle, color: "#6080d0" },
                { label: "SMS Blast",     icon: P.campaign, color: T.gold  },
              ].map((btn, i) => (
                <button key={i} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium mb-2 transition-all cinzel"
                  style={{ background: `${btn.color}15`, color: btn.color, border: `1px solid ${btn.color}30` }}>
                  <Ico d={btn.icon} c="w-4 h-4" />{btn.label}
                </button>
              ))}
            </Card>
          </div>
        </div>
      )}

      {/* Tab: Donors */}
      {tab === "donors" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-base crimson italic" style={{ color: T.cream }}>
              {camp.members} total donors · ETB {camp.raised.toLocaleString()} raised
            </p>
            {/* Export CSV removed */}
          </div>
          <Card>
            <div className="space-y-3">
              {recentDonors.map((d, i) => (
                <div key={i} className="flex items-center gap-4 py-3 rounded-xl px-3"
                  style={{ borderBottom: i < recentDonors.length - 1 ? `1px solid ${T.border2}` : "none" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold cinzel flex-shrink-0"
                    style={{ background: `linear-gradient(135deg,${T.gold},${T.goldDk})`, color: T.bg }}>
                    {d.initials}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-sm crimson" style={{ color: T.cream }}>{d.name}</p>
                    <p className="text-xs crimson" style={{ color: T.mutedDk }}>{d.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold cinzel" style={{ color: T.gold }}>{d.amount}</p>
                    <Badge status="Completed" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* Tab: Settings */}
      {tab === "settings" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="font-bold cinzel mb-5 flex items-center gap-2" style={{ color: T.cream }}>
                Edit Campaign
              </h3>
            {editing ? (
              <div className="space-y-4">
                <Fld label="Campaign Title" value={draft.title}
                  onChange={e => setDraft({ ...draft, title: e.target.value })} />
                <Fld label="Goal (ETB)" type="number" value={draft.goal}
                  onChange={e => setDraft({ ...draft, goal: +e.target.value })} />
                <Fld label="End Date" value={draft.ends}
                  onChange={e => setDraft({ ...draft, ends: e.target.value })} />
                <div className="flex gap-3 mt-2">
                  <GoldBtn onClick={saveEdits}><Ico d={P.check} c="w-4 h-4" />Save Changes</GoldBtn>
                  <Ghost onClick={() => { setEditing(false); setDraft({ ...camp }); }}>Cancel</Ghost>
                </div>
              </div>
            ) : (
              <div>
                {[
                  { label: "Title",  value: camp.title },
                  { label: "Goal",   value: `ETB ${camp.goal.toLocaleString()}` },
                  { label: "Ends",   value: camp.ends  },
                  { label: "Status", value: camp.status },
                ].map(row => (
                  <div key={row.label} className="flex items-center justify-between py-3"
                    style={{ borderBottom: `1px solid ${T.border2}` }}>
                    <span className="text-sm cinzel" style={{ color: T.mutedDk }}>{row.label}</span>
                    <span className="text-base crimson font-medium" style={{ color: T.cream }}>{row.value}</span>
                  </div>
                ))}
                <GoldBtn onClick={() => setEditing(true)}>
                  <Ico d={P.edit} c="w-4 h-4" />Edit Campaign
                </GoldBtn>
              </div>
            )}
          </Card>

        </div>
      )}
    </div>
  );
}