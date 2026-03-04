"use client";

import { useState } from "react";
import { T, IMG }  from "@/lib/theme";
import { P }       from "@/lib/icons";
import Hero        from "@/components/ui/Hero";
import Card        from "@/components/ui/Card";
import Ico         from "@/components/ui/Ico";

/* ── Types ──────────────────────────────────────────── */
interface Settings {
  churchName:   string;
  amharicName:  string;
  email:        string;
  phone:        string;
  address:      string;
  timezone:     string;
  currency:     string;
  language:     string;
  emailNotif:   boolean;
  smsNotif:     boolean;
  autoReceipt:  boolean;
  twoFA:        boolean;
}

interface ToggleRowProps {
  on:       boolean;
  onToggle: () => void;
  label:    string;
  desc?:    string;
}

/* ── ToggleRow ───────────────────────────────────────── */
function ToggleRow({ on, onToggle, label, desc }: ToggleRowProps) {
  return (
    <div
      className="flex items-center justify-between py-4"
      style={{ borderBottom: `1px solid ${T.border2}` }}
    >
      {/* Text */}
      <div className="flex-1 min-w-0 pr-4">
        <p
          className="text-base font-medium crimson"
          style={{ color: T.cream }}
        >
          {label}
        </p>
        {desc && (
          <p
            className="text-sm crimson italic mt-0.5"
            style={{ color: T.muted }}
          >
            {desc}
          </p>
        )}
      </div>

      {/* Toggle control */}
      <div className="flex items-center gap-3 flex-shrink-0">

        {/* Track */}
        <button
          onClick={onToggle}
          aria-pressed={on}
          className="relative flex-shrink-0 rounded-full focus:outline-none"
          style={{
            width:      "52px",
            height:     "28px",
            background:  on ? T.gold : "#3a2e1a",
            border:     `1px solid ${on ? T.gold : T.border}`,
            transition: "background 0.3s ease, border-color 0.3s ease",
          }}
        >
          {/* Knob */}
          <span
            className="absolute rounded-full bg-white shadow-md"
            style={{
              width:      "22px",
              height:     "22px",
              top:        "2px",
              left:       "2px",
              transform:   on ? "translateX(24px)" : "translateX(0px)",
              transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow:  "0 1px 4px rgba(0,0,0,0.4)",
            }}
          />
        </button>

        {/* Label */}
        <span
          className="text-sm font-bold uppercase cinzel"
          style={{
            width:      "28px",
            color:       on ? T.gold : T.muted,
            transition: "color 0.3s ease",
          }}
        >
          {on ? "ON" : "OFF"}
        </span>
      </div>
    </div>
  );
}
/* ── Page ────────────────────────────────────────────── */
export default function PageSettings() {
  const [s, setS] = useState<Settings>({
    churchName:  "",
    amharicName: "",
    email:       "admin@holytrinityeotc.org",
    phone:       "+251 11 123 4567",
    address:     "Addis Ababa, Ethiopia",
    timezone:    "Africa/Addis_Ababa",
    currency:    "ETB",
    language:    "English",
    emailNotif:  true,
    smsNotif:    false,
    autoReceipt: true,
    twoFA:       false,
  });

  const [saved, setSaved] = useState(false);

  const tog  = (k: keyof Settings) =>
    setS(x => ({ ...x, [k]: !x[k] }));

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const textFields: { k: keyof Settings; l: string }[] = [
    { k: "email",   l: "Admin Email" },
    { k: "phone",   l: "Phone"       },
    { k: "address", l: "Address"     },
  ];

  const selectFields: { k: keyof Settings; l: string; opts: string[] }[] = [
    { k: "timezone", l: "Timezone", opts: ["Africa/Addis_Ababa", "Africa/Nairobi", "UTC"] },
    { k: "currency", l: "Currency", opts: ["ETB", "USD", "EUR"]                           },
  ];

  return (
    <div className="space-y-5 fade-up">
      <Hero
        img={IMG.altar}
        pre="Configuration"
        title="Admin Settings"
        sub="Manage church info, notifications, and security"
        op={55}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Left: Church Info ── */}
        <Card>
          <h3
            className="font-bold flex items-center gap-2 mb-5 cinzel"
            style={{ color: T.cream }}
          >
            Church Information
          </h3>

          {/* Text inputs */}
          {textFields.map(f => (
            <div key={f.k as string} className="mb-3">
              <label
                className="block text-sm font-semibold mb-1.5 cinzel"
                style={{ color: T.muted }}
              >
                {f.l}
              </label>
              <input
                value={s[f.k] as string}
                onChange={e => setS({ ...s, [f.k]: e.target.value })}
                className="w-full rounded-xl px-4 py-2.5 text-base outline-none
                           transition-all focus:ring-1"
                style={{
                  background: T.border2,
                  border:     `1px solid ${T.border}`,
                  color:      T.cream,
                }}
              />
            </div>
          ))}

          {/* Select dropdowns */}
          <div className="grid grid-cols-2 gap-3 mt-3">
            {selectFields.map(f => (
              <div key={f.k as string}>
                <label
                  className="block text-sm font-semibold mb-1.5 cinzel"
                  style={{ color: T.muted }}
                >
                  {f.l}
                </label>
                <select
                  value={s[f.k] as string}
                  onChange={e => setS({ ...s, [f.k]: e.target.value })}
                  className="w-full rounded-xl px-3 py-2.5 text-base outline-none"
                  style={{
                    background: T.border2,
                    border:     `1px solid ${T.border}`,
                    color:      T.cream,
                  }}
                >
                  {f.opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
          </div>
        </Card>

        {/* ── Right: Notifications + Save ── */}
        <div className="space-y-4">
          <Card>
            <h3
              className="font-bold mb-1 flex items-center gap-2 cinzel"
              style={{ color: T.cream }}
            >
              <Ico d={P.bell} c="w-4 h-4" style={{ color: T.gold }}/>
              Notifications
            </h3>

            <ToggleRow
              on={s.emailNotif}
              onToggle={() => tog("emailNotif")}
              label="Email Notifications"
              desc="Send email alerts for new donations"
            />
            <ToggleRow
              on={s.smsNotif}
              onToggle={() => tog("smsNotif")}
              label="SMS Notifications"
              desc="Send SMS on large donations"
            />
            <ToggleRow
              on={s.autoReceipt}
              onToggle={() => tog("autoReceipt")}
              label="Auto Receipts"
              desc="Automatically email receipt to donors"
            />
          </Card>

          {/* Save button */}
          <button
            onClick={save}
            className="w-full py-3.5 rounded-2xl text-base font-bold
                       transition-all flex items-center justify-center gap-2 cinzel"
            style={
              saved
                ? {
                    background: "#2d6e3a",
                    color:      "#a0e0b0",
                    boxShadow:  "0 4px 20px rgba(45,110,58,0.3)",
                  }
                : {
                    background: `linear-gradient(135deg,${T.gold},${T.goldDk})`,
                    color:      T.bg,
                    boxShadow:  `0 4px 24px ${T.gold}44`,
                  }
            }
          >
            {saved ? (
              <>
                <Ico d={P.check} c="w-5 h-5"/>
                Settings Saved!
              </>
            ) : (
              "Save All Settings"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}