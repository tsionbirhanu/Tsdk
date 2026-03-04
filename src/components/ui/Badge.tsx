interface BadgeProps { status: string; }

const cls: Record<string, string> = {
  Active:    "border-yellow-700/40 text-yellow-400 bg-yellow-900/20",
  Completed: "border-emerald-700/40 text-emerald-400 bg-emerald-900/20",
  Paused:    "border-amber-700/40 text-amber-400 bg-amber-900/20",
  Inactive:  "border-stone-700/40 text-stone-400 bg-stone-900/20",
  Pending:   "border-orange-700/40 text-orange-400 bg-orange-900/20",
  Failed:    "border-red-800/40 text-red-400 bg-red-900/20",
  Closed:    "border-stone-700/40 text-stone-400 bg-stone-900/20",
};

export default function Badge({ status }: BadgeProps) {
  return (
    <span className={`text-sm px-2.5 py-0.5 rounded-full border font-medium cinzel ${cls[status] ?? cls.Inactive}`}>
      {status}
    </span>
  );
}