import { ChangeEvent, ReactNode } from "react";
import { T } from "@/lib/theme";

interface FldProps {
  label: string; type?: string; value?: string | number;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  ph?: string; children?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export default function Fld({ label, type = "text", value, onChange, ph, children, size = 'sm' }: FldProps) {
  const labelClass = size === 'lg' ? 'block text-base font-semibold mb-2 cinzel' : size === 'md' ? 'block text-sm font-semibold mb-1.5 cinzel' : 'block text-xs font-semibold mb-1.5 cinzel';
  const inputClass = size === 'lg' ? 'w-full rounded-xl px-4 py-3 text-base outline-none transition-colors' : size === 'md' ? 'w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors' : 'w-full rounded-xl px-4 py-3 text-sm outline-none transition-colors';

  return (
    <div>
      <label className={labelClass} style={{ color: T.cream }}>{label}</label>
      {children ?? (
        <input type={type} value={value} onChange={onChange} placeholder={ph}
          className={inputClass}
          style={{ background: T.border2, border: `1px solid ${T.border}`, color: T.cream }} />
      )}
    </div>
  );
}