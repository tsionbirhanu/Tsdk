import { ReactNode } from "react";
import { T } from "@/lib/theme";

interface HeroProps { img: string; pre: string; title: string; sub: string; action?: ReactNode; op?: number; }

export default function Hero({ img, pre, title, sub, action, op = 55 }: HeroProps) {
  return (
    <div className="relative rounded-2xl overflow-hidden h-40 fade-up"
      style={{ border: `1px solid ${T.border}` }}>
      <img src={img} alt="" className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: op / 100 }} />
      <div className="absolute inset-0"
        style={{ background: `linear-gradient(105deg,${T.bg}ee 0%,${T.surface}cc 50%,${T.bg}88 100%)` }} />
      <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl"
        style={{ background: `linear-gradient(180deg,${T.gold},${T.goldDk})` }} />
      <div className="relative z-10 flex items-center justify-between h-full px-8">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] mb-1 cinzel"
            style={{ color: T.goldLt }}>{pre}</p>
          <h2 className="text-2xl font-bold leading-tight cinzel" style={{ color: T.cream }}>{title}</h2>
          <p className="text-sm mt-0.5 crimson italic" style={{ color: T.muted }}>{sub}</p>
        </div>
        {action}
      </div>
      {/* decorative cross removed */}
    </div>
  );
}