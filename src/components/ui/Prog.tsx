import { T } from "@/lib/theme";

interface ProgProps { value: number; max: number; color?: string; }

export default function Prog({ value, max, color = T.gold }: ProgProps) {
  const p = Math.min(100, Math.round((value / max) * 100));
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1.5">
        <span className="font-semibold" style={{ color: T.cream }}>ETB {value.toLocaleString()}</span>
        <span className="font-bold" style={{ color }}>{p}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: T.border2 }}>
        <div className="h-full rounded-full transition-all"
          style={{ width: `${p}%`, background: `linear-gradient(90deg,${color}99,${color})` }} />
      </div>
      <p className="text-xs mt-1" style={{ color: T.mutedDk }}>Goal: ETB {max.toLocaleString()}</p>
    </div>
  );
}