import React from "react";

export default function StatCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:border-yellow-500/40 transition-colors">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.18em] text-white/55">
          {label}
        </div>
        {icon ? (
          <div className="rounded-xl bg-yellow-500/10 p-2 text-yellow-300">
            {icon}
          </div>
        ) : null}
      </div>
      <div className="mt-3 text-2xl font-semibold">{value}</div>
      {sub ? <div className="mt-1 text-xs text-white/50">{sub}</div> : null}
    </div>
  );
}