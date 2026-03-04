import { ReactNode } from "react";
import { T } from "@/lib/theme";

interface ModalProps { open: boolean; onClose?: () => void; title?: string; wide?: boolean; children?: ReactNode; yOffset?: number }

export default function Modal({ open, onClose, title, wide, children, yOffset }: ModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ paddingTop: yOffset || 0 }}>
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose} />
      <div className={`relative rounded-2xl p-6 z-10 ${wide ? "w-11/12 max-w-4xl" : "w-full max-w-2xl"}`}
        style={{ background: T.card, border: `1px solid ${T.border}` }}>
        {title && <h3 className="font-bold cinzel mb-4" style={{ color: T.cream }}>{title}</h3>}
        <div>
          {children}
        </div>
        <button onClick={onClose} className="absolute top-4 right-4 text-sm" style={{ color: T.muted }}>Close</button>
      </div>
    </div>
  );
}
