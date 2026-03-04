"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { T, IMG } from "@/lib/theme";
import { P } from "@/lib/icons";
import { trends, txData } from "@/lib/data";
import Hero from "@/components/ui/Hero";
import Card from "@/components/ui/Card";
import Ico from "@/components/ui/Ico";
import Tip from "@/components/ui/Tip";
import TxTable from "@/components/ui/TxTable";
import { Ghost } from "@/components/ui/Buttons";

const summaryCards = [
  { label:"Total Income", v:"ETB 873,000", ch:"+18%",    c:T.gold    },
  { label:"This Month",   v:"ETB 94,000",  ch:"+15%",    c:"#6aab7a" },
  { label:"Pending",      v:"ETB 12,500",  ch:"3 items", c:"#e0a030" },
  { label:"Failed Txns",  v:"12",          ch:"-3%",     c:"#d07070" },
];
const barSeries = [
  { key:"aserat", name:"Aserat", color:T.gold    },
  { key:"selet",  name:"Selet",  color:"#c87c3a" },
  { key:"gbir",   name:"Gbir",   color:"#6aab7a" },
];

export default function PageFinancial() {
  return (
    <div className="space-y-5 fade-up">
      <Hero img={IMG.altar} pre="Financial Overview" title="Income & Reports"
        sub="Track all donations, tithes, and church income" op={55}
        action={<></>} />
      {/* export PDF removed */}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((s, i) => (
          <Card key={i}>
            <div className="h-0.5 -mx-5 -mt-5 mb-4 rounded-t-2xl" style={{ background:s.c }}/>
            <p className="text-3xl font-black cinzel" style={{ color:T.cream }}>{s.v}</p>
            <p className="text-sm uppercase tracking-widest mt-1 cinzel" style={{ color:T.cream }}>{s.label}</p>
            <span className="mt-2 inline-block text-xs font-semibold px-2 py-0.5 rounded-full cinzel"
              style={{ background:`${s.c}20`, color:s.c }}>{s.ch}</span>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="font-bold cinzel mb-1 text-xl" style={{ color:T.cream }}>Monthly Giving — All Categories</h3>
        <p className="text-sm crimson italic mb-5" style={{ color:T.cream }}>Jan–Dec 2024</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={trends} barGap={3} barSize={8}>
            <CartesianGrid strokeDasharray="3 3" stroke={`${T.border}66`} vertical={false}/>
            <XAxis dataKey="m" tick={{ fill:T.cream, fontSize:13, fontFamily:"Cinzel" }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fill:T.cream, fontSize:12 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}k`}/>
            <Tooltip content={<Tip/>}/>
            {barSeries.map(({ key, name, color }) => (
              <Bar key={key} dataKey={key} name={name} fill={color} radius={[3,3,0,0]}/>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold cinzel text-xl" style={{ color:T.cream }}>All Transactions</h3>
          <Ghost><Ico d={P.download} c="w-4 h-4"/>CSV Export</Ghost>
        </div>
        <TxTable data={txData}/>
      </Card>
    </div>
  );
}