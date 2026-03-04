import { T, IMG } from "@/lib/theme";
import { P } from "@/lib/icons";
import { trends, reports } from "@/lib/data";
import Hero from "@/components/ui/Hero";
import Card from "@/components/ui/Card";
import Ico from "@/components/ui/Ico";
import { Ghost } from "@/components/ui/Buttons";

export default function PageReports() {
  return (
    <div className="space-y-5 fade-up">
      <Hero img={IMG.altar} pre="Reports" title="Financial Reports"
        sub="Download and review all financial summaries" op={55}/>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((r, i) => (
          <div key={i} className="relative overflow-hidden rounded-2xl card-hover flex flex-col"
            style={{ background:T.card, border:`1px solid ${T.border}` }}>
            <div className="h-0.5 w-full" style={{ background:r.color }}/>
            <div className="p-5 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm px-3 py-1 rounded-lg font-bold cinzel"
                  style={{ background:`${r.color}18`, color:r.color }}>{r.type}</span>
                <span className="text-sm crimson" style={{ color:T.muted }}>{r.size}</span>
              </div>
              <h4 className="font-semibold mb-1 cinzel text-lg" style={{ color:T.cream }}>{r.title}</h4>
              <p className="text-sm crimson mb-4" style={{ color:T.muted }}>{r.date}</p>
              <button className="mt-auto flex items-center gap-2 justify-center w-full py-2.5 rounded-xl text-sm font-semibold border transition-all cinzel"
                style={{ borderColor:T.border, color:T.muted }}>
                <Ico d={P.download} c="w-4 h-4"/>Download
              </button>
            </div>
          </div>
        ))}
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold cinzel" style={{ color:T.cream }}>Yearly Giving Summary</h3>
          {/* Export CSV removed */}
        </div>
        <div className="overflow-x-auto rounded-xl" style={{ background:`${T.bg}66` }}>
          <table className="w-full text-base">
            <thead>
              <tr className="text-sm uppercase tracking-wider cinzel"
                style={{ borderBottom:`1px solid ${T.border}`, color:T.muted }}>
                {["Month","Aserat","Selet","Gbir","Campaign","Total"].map(h => (
                  <th key={h} className="text-left py-3 px-4 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trends.map(r => (
                <tr key={r.m} style={{ borderBottom:`1px solid ${T.border2}` }}>
                  <td className="py-3 px-4 font-semibold cinzel text-sm" style={{ color:T.cream }}>{r.m}</td>
                  <td className="py-3 px-4 cinzel text-sm"  style={{ color:T.gold    }}>ETB {r.aserat.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm"          style={{ color:"#c87c3a" }}>ETB {r.selet.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm"          style={{ color:"#6aab7a" }}>ETB {r.gbir.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm"          style={{ color:"#9080d0" }}>ETB {(r.total-r.aserat-r.selet-r.gbir).toLocaleString()}</td>
                  <td className="py-3 px-4 font-bold cinzel text-lg" style={{ color:T.cream }}>ETB {r.total.toLocaleString()}</td>
                </tr>
              ))}
              <tr style={{ borderTop:`2px solid ${T.gold}44`, background:`${T.gold}0a` }}>
                <td className="py-3 px-4 font-extrabold cinzel text-lg" style={{ color:T.gold }}>TOTAL</td>
                <td className="py-3 px-4 font-bold cinzel text-lg" style={{ color:T.cream }}>ETB 322,000</td>
                <td className="py-3 px-4 font-bold cinzel text-lg" style={{ color:T.cream }}>ETB 198,000</td>
                <td className="py-3 px-4 font-bold cinzel text-lg" style={{ color:T.cream }}>ETB 212,000</td>
                <td className="py-3 px-4 font-bold cinzel text-lg" style={{ color:T.cream }}>ETB 141,000</td>
                <td className="py-3 px-4 font-extrabold cinzel text-lg" style={{ color:T.gold }}>ETB 873,000</td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}