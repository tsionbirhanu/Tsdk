"use client";
import { useState } from "react";
import { T, IMG } from "@/lib/theme";
import { P } from "@/lib/icons";
import { captions } from "@/lib/data";
import Hero from "@/components/ui/Hero";
import Card from "@/components/ui/Card";
import Ico from "@/components/ui/Ico";
import { GoldBtn, Ghost } from "@/components/ui/Buttons";

type Tab = "captions";

export default function PageAI() {
  const [caps,     setCaps]     = useState<string[]>(captions.slice(0, 3));
  const [loading,  setLoading]  = useState(false);
  const [copied,   setCopied]   = useState<number | null>(null);
  const [tone,     setTone]     = useState("Inspirational");
  const [lang,     setLang]     = useState("English");
  const [platform, setPlatform] = useState("Telegram");
  const [prompt,   setPrompt]   = useState("");
  const [tab,      setTab]      = useState<Tab>("captions");

  const generate = () => {
    setLoading(true);
    setTimeout(() => { setCaps([...captions].sort(() => Math.random() - 0.5).slice(0, 4)); setLoading(false); }, 1400);
  };
  const copy = (i: number, text: string) => {
    try { navigator.clipboard?.writeText(text); } catch (_) {}
    setCopied(i); setTimeout(() => setCopied(null), 2000);
  };

  const selects = [
    { label:"Tone",     value:tone,     set:setTone,     opts:["Inspirational","Formal","Urgent","Devotional","Announcement"] },
    { label:"Language", value:lang,     set:setLang,     opts:["English","Amharic","Afaan Oromo","Mixed (EN+አማ)"]           },
    { label:"Platform", value:platform, set:setPlatform, opts:["Telegram","Facebook","Instagram","SMS","All Platforms"]       },
  ];

  return (
    <div className="space-y-5 fade-up">
      <Hero img={IMG.altar} pre="AI Generator" title="Content & AI Generator"
        sub="Generate captions, posts, and campaign messaging" op={55}
        action={
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl"
            style={{ background:`${T.gold}18`, border:`1px solid ${T.gold}44` }}>
            <Ico d={P.sparkle} c="w-5 h-5"/>
            <span className="font-bold text-base cinzel" style={{ color:T.gold }}>AI Powered</span>
          </div>
        }/>

      <div className="flex gap-2" style={{ borderBottom:`1px solid ${T.border}` }}>
        {([{id:"captions",label:"📝 Caption Generator"}] as {id:Tab;label:string}[]).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="px-5 py-3 text-base font-bold border-b-2 transition-all -mb-px cinzel"
            style={{ borderBottomColor: tab===t.id ? T.gold : "transparent", color: tab===t.id ? T.gold : T.mutedDk }}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === "captions" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <h3 className="font-bold flex items-center gap-2 mb-4 cinzel" style={{ color:T.cream }}>
              <Ico d={P.settings} c="w-4 h-4" style={{ color:T.gold }}/>Settings
            </h3>
            {selects.map(s => (
              <div key={s.label} className="mb-3">
                <label className="block text-base font-semibold mb-1.5 cinzel" style={{ color:T.muted }}>{s.label}</label>
                <select value={s.value} onChange={e => s.set(e.target.value)}
                  className="w-full rounded-xl px-4 py-2.5 text-base outline-none"
                  style={{ background:T.border2, border:`1px solid ${T.border}`, color:T.cream }}>
                  {s.opts.map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            ))}
            <div className="mb-4">
              <label className="block text-xs font-semibold mb-1.5 cinzel" style={{ color:T.muted }}>Topic (optional)</label>
              <textarea value={prompt} onChange={e => setPrompt(e.target.value)} rows={3}
                placeholder="e.g. Christmas tithe drive..."
                className="w-full rounded-xl px-4 py-3 text-base outline-none resize-none"
                style={{ background:T.border2, border:`1px solid ${T.border}`, color:T.cream }}/>
            </div>
            <GoldBtn onClick={generate}>
              {loading
                ? <><Ico d={P.refresh} c="w-5 h-5 animate-spin"/>Generating...</>
                : <><Ico d={P.sparkle} c="w-5 h-5"/>Generate</>}
            </GoldBtn>
          </Card>

          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-bold cinzel" style={{ color:T.cream }}>Generated Captions</h3>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 rounded-2xl"
                style={{ border:`1px solid ${T.border}`, background:T.card }}>
                <div className="w-12 h-12 rounded-full border-2 animate-spin mb-4"
                  style={{ borderColor:`${T.gold}44`, borderTopColor:T.gold }}/>
                <p className="text-base crimson italic" style={{ color:T.muted }}>Generating captions...</p>
              </div>
            ) : (
              caps.map((cap, i) => (
                <div key={i} className="rounded-2xl p-5 card-hover"
                  style={{ border:`1px solid ${T.border}`, background:T.card }}>
                  <div className="flex items-start justify-between gap-4">
                    <p className="text-base leading-relaxed flex-1 crimson" style={{ color:T.cream }}>{cap}</p>
                    <button onClick={() => copy(i, cap)}
                      className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-base font-medium border transition-all cinzel"
                      style={copied === i
                        ? { background:"rgba(50,120,70,0.1)", borderColor:"rgba(50,120,70,0.3)", color:"#6aab7a" }
                        : { background:T.border2, borderColor:T.border, color:T.muted }}>
                      <Ico d={copied === i ? P.check : P.copy} c="w-4 h-4"/>
                      {copied === i ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {[{l:tone,c:T.gold},{l:platform,c:"#5a9ad0"},{l:lang,c:"#9080d0"}].map(x => (
                      <span key={x.l} className="text-sm px-2 py-0.5 rounded-full border cinzel"
                        style={{ background:`${x.c}15`, color:x.c, borderColor:`${x.c}40` }}>{x.l}</span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}