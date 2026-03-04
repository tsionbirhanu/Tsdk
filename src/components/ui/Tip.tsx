import { T } from "@/lib/theme";

interface TipProps {
  active?: boolean;
  payload?: { color: string; name: string; value: number }[];
  label?: string;
}

export default function Tip({ active, payload, label }: TipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl p-3 text-xs shadow-2xl border"
      style={{ background: T.card, borderColor: T.border, color: T.cream }}>
      <p className="font-bold mb-2" style={{ color: T.gold }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>{p.name}: ETB {p.value?.toLocaleString()}</p>
      ))}
    </div>
  );
}