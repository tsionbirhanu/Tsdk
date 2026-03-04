"use client";

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { T, IMG } from "@/lib/theme";
import { P } from "@/lib/icons";
import { trends, pieD, txData } from "@/lib/data";
import Ico from "@/components/ui/Ico";
import Card from "@/components/ui/Card";
import Tip from "@/components/ui/Tip";
import TxTable from "@/components/ui/TxTable";
import { Ghost } from "@/components/ui/Buttons";

const statCards = [
  { label:"Total Donations", value:"ETB 873,000", sub:"Fiscal 2024",       ch:"+18%", img:IMG.gold,    c:T.gold    },
  { label:"Aserat Tithes",   value:"ETB 322,000", sub:"96 active tithers", ch:"+12%", img:IMG.candles, c:"#c87c3a" },
  { label:"Selet Vows",      value:"ETB 198,000", sub:"34 active vows",    ch:"+8%",  img:IMG.incense, c:"#6aab7a" },
  { label:"Gbir Offerings",  value:"ETB 212,000", sub:"Monthly offerings", ch:"+5%",  img:IMG.altar,   c:"#8a7ae0" },
];
const areaSeries = [
  { key:"aserat", name:"Aserat", color:T.gold,    grad:"g1" },
  { key:"selet",  name:"Selet",  color:"#c87c3a", grad:"g2" },
  { key:"gbir",   name:"Gbir",   color:"#6aab7a", grad:"g3" },
];

export default function PageDashboard() {
  return (
    <div className="space-y-5 fade-up">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden h-52" style={{ border:`1px solid ${T.border}` }}>
        <img src={IMG.heroChurch} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity:0.45 }}/>
        <div className="absolute inset-0" style={{ background:`linear-gradient(110deg,${T.bg}f5 0%,${T.bg}bb 55%,transparent 100%)` }}/>
        <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl"
          style={{ background:`linear-gradient(180deg,${T.goldLt},${T.gold},${T.goldDk})` }}/>
        <div className="relative z-10 h-full flex flex-col justify-center px-10">
          <p className="text-base font-bold uppercase tracking-[0.4em] mb-2 cinzel" style={{ color:T.gold }}>Admin Control Center</p>
          <h2 className="text-4xl font-black leading-none cinzel" style={{ color:T.cream }}></h2>
          <h3 className="text-xl font-semibold mt-1 cinzel gold-shimmer"></h3>
          <p className="text-base mt-2 crimson italic" style={{ color:T.muted }}>Holy Trinity Ethiopian Orthodox Tewahedo Church</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <div key={i} className="relative overflow-hidden rounded-2xl card-hover"
            style={{ border:`1px solid ${T.border}`, background:T.card }}>
            <img src={s.img} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ opacity:0.12 }}/>
            <div className="absolute inset-0" style={{ background:`linear-gradient(135deg,${T.card}f0,${T.card}a0)` }}/>
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background:s.c }}/>
            <div className="relative z-10 p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background:`${s.c}20`, color:s.c }}>
                  <Ico d={P.finance}/>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold cinzel" style={{ background:`${s.c}20`, color:s.c }}>{s.ch}</span>
              </div>
              <p className="text-2xl font-black cinzel leading-none" style={{ color:T.cream }}>{s.value}</p>
              <p className="text-lg uppercase tracking-widest mt-1 cinzel" style={{ color:T.cream }}>{s.label}</p>
              <p className="text-lg mt-0.5 crimson italic" style={{ color:T.cream }}>{s.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold cinzel" style={{ color:T.cream }}>Donation Trend — 2024</h3>
              <p className="text-lg crimson italic mt-0.5" style={{ color:T.muted }}>Monthly breakdown by giving type</p>
            </div>
            <div className="flex gap-4 text-lg">
              {areaSeries.map(x => (
                <span key={x.key} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ background:x.color }}/>
                  <span className="crimson" style={{ color:T.muted }}>{x.name}</span>
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={trends}>
              <defs>
                {areaSeries.map(({ grad, color }) => (
                  <linearGradient key={grad} id={grad} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={color} stopOpacity={0}/>
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={`${T.border}88`}/>
              <XAxis dataKey="m" tick={{ fill:T.cream, fontSize:13, fontFamily:"Cinzel" }} axisLine={false} tickLine={false}/>
              <YAxis tick={{ fill:T.cream, fontSize:12 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`}/>
              <Tooltip content={<Tip/>}/>
              {areaSeries.map(({ key, name, color, grad }) => (
                <Area key={key} type="monotone" dataKey={key} name={name}
                  stroke={color} strokeWidth={2} fill={`url(#${grad})`} dot={false}/>
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="font-bold cinzel mb-1" style={{ color:T.cream }}>Giving Breakdown</h3>
          <p className="text-base crimson italic mb-4" style={{ color:T.cream }}>By category · 2024</p>
          <ResponsiveContainer width="100%" height={155}>
            <PieChart>
              <Pie data={pieD} cx="50%" cy="50%" innerRadius={44} outerRadius={68} paddingAngle={4} dataKey="value">
                {pieD.map((e, i) => <Cell key={i} fill={e.color} stroke="transparent"/>)}
              </Pie>
              <Tooltip formatter={(v?: number) => `ETB ${v?.toLocaleString() || 0}`}
                contentStyle={{ background:T.card, border:`1px solid ${T.border}`, borderRadius:10, fontSize:12, color:T.cream }}/>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {pieD.map(d => (
              <div key={d.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background:d.color }}/>
                  <span className="text-lg crimson" style={{ color:T.cream }}>{d.name}</span>
                </span>
                <span className="text-lg font-bold cinzel" style={{ color:T.cream }}>
                  {Math.round((d.value / 873000) * 100)}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Transactions */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold cinzel text-2xl" style={{ color:T.cream }}>Recent Transactions</h3>
            <p className="text-xl crimson italic mt-0.5" style={{ color:T.cream }}>Latest member giving activity</p>
          </div>
          <Ghost><Ico d={P.download} c="w-4 h-4"/>Export</Ghost>
        </div>
        <TxTable data={txData}/>
      </Card>
    </div>
  );
}