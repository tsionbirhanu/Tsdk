"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { T, IMG } from "@/lib/theme";
import { P } from "@/lib/icons";
import Hero from "@/components/ui/Hero";
import Card from "@/components/ui/Card";
import Ico from "@/components/ui/Ico";
import Fld from "@/components/ui/Fld";
import { GoldBtn, Ghost } from "@/components/ui/Buttons";

interface FormState {
  title: string; goal: string; ends: string;
  description: string; category: string; imageUrl: string;
}

const categories = ["Tithes & Offerings","Building & Maintenance","Education","Youth Ministry","Community Outreach","Events & Celebrations","Equipment","Other"];

export default function PageCreateCampaign() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    title: "", goal: "", ends: "", description: "", category: "Building & Maintenance", imageUrl: "",
  });
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [step, setStep] = useState<1 | 2>(1);
  const [submitted, setSubmitted] = useState(false);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const validateStep1 = () => {
    const e: Partial<FormState> = {};
    if (!form.title.trim())       e.title = "Campaign title is required";
    if (!form.goal || +form.goal <= 0) e.goal = "Enter a valid goal amount";
    if (!form.ends)               e.ends = "End date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Partial<FormState> = {};
    if (!form.description.trim()) e.description = "Please describe this campaign";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => { if (validateStep1()) setStep(2); };
  const back = () => setStep(1);

  const submit = () => {
    if (!validateStep2()) return;
    setSubmitted(true);
    setTimeout(() => router.push("/admin/campaigns"), 1800);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] fade-up">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ background: `${T.gold}20`, border: `2px solid ${T.gold}` }}>
          <Ico d={P.check} c="w-10 h-10" style={{ color: T.gold }} />
        </div>
        <h2 className="text-2xl font-black cinzel mb-2" style={{ color: T.cream }}>Campaign Created!</h2>
        <p className="text-sm crimson italic mb-6" style={{ color: T.muted }}>Redirecting to campaigns list...</p>
        <div className="w-48 h-1 rounded-full overflow-hidden" style={{ background: T.border }}>
          <div className="h-full rounded-full animate-pulse" style={{ background: T.gold, width: "100%" }} />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 fade-up">
      <Hero
        img={IMG.altar}
        pre="New Campaign"
        title="Create Campaign"
        sub="Set up a new fundraising campaign for the church"
        op={55}
        action={
          <Ghost onClick={() => router.push("/admin/campaigns")}>
            <Ico d={P.chevRight} c="w-4 h-4 rotate-180" />
            Back to Campaigns
          </Ghost>
        }
      />

      {/* Step indicator */}
      <div className="flex items-center gap-3 px-1">
        {[
          { n: 1, label: "Basic Info"   },
          { n: 2, label: "Details"      },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold cinzel transition-all"
                style={step >= s.n
                  ? { background: T.gold, color: T.bg }
                  : { background: T.border, color: T.mutedDk }}>
                {step > s.n ? <Ico d={P.check} c="w-4 h-4" /> : s.n}
              </div>
              <span className="text-xs font-semibold cinzel hidden sm:block"
                style={{ color: step >= s.n ? T.gold : T.mutedDk }}>{s.label}</span>
            </div>
            {i < 1 && (
              <div className="w-16 h-0.5 rounded-full"
                style={{ background: step > s.n ? T.gold : T.border }} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <Card>
              <h3 className="font-bold cinzel mb-5 flex items-center gap-2" style={{ color: T.cream }}>
                Campaign Details
              </h3>
              <div className="space-y-4">
                <div>
                  <Fld label="Campaign Title" value={form.title} onChange={set("title")}
                    ph="e.g. Church Roof Repair Fund" className="text-xl" />
                  {errors.title && <p className="text-base mt-1" style={{ color: "#f5e6c8" }}>{errors.title}</p>}
                </div>
                <Fld label="Category">
                  <select value={form.category} onChange={set("category")}
                    className="w-full rounded-xl px-4 py-3 text-xl outline-none"
                    style={{ background: T.border2, border: `1px solid ${T.border}`, color: T.cream }}>
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </Fld>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Fld label="Fundraising Goal (ETB)" type="number"
                      value={form.goal} onChange={set("goal")} ph="500000" className="text-xl" />
                    {errors.goal && <p className="text-base mt-1" style={{ color: "#f5e6c8" }}>{errors.goal}</p>}
                  </div>
                  <div>
                    <Fld label="End Date" type="date" value={form.ends} onChange={set("ends")} className="text-xl" />
                    {errors.ends && <p className="text-base mt-1" style={{ color: "#f5e6c8" }}>{errors.ends}</p>}
                  </div>
                </div>
                <Fld label="Cover Image URL (optional)" value={form.imageUrl} onChange={set("imageUrl")}
                  ph="https://..." />
              </div>
            </Card>
          </div>

          {/* Preview card */}
          <div className="space-y-4">
            <Card>
              <h3 className="font-bold cinzel mb-4 text-xs uppercase tracking-widest" style={{ color: T.mutedDk }}>Preview</h3>
              <div className="rounded-xl overflow-hidden mb-3 h-24 relative"
                style={{ background: T.border2 }}>
                {form.imageUrl
                  ? <img src={form.imageUrl} alt="" className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center">
                      <Ico d={P.campaign} c="w-8 h-8" style={{ color: T.mutedDk }} />
                    </div>}
              </div>
              <p className="font-bold cinzel text-lg mb-1" style={{ color: T.cream }}>
                {form.title || <span style={{ color: T.cream }} className="text-xl">Campaign title...</span>}
              </p>
              <p className="text-xs crimson italic mb-3" style={{ color: T.muted }}>{form.category}</p>
              {form.goal && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="cinzel" style={{ color: T.cream }}>ETB 0</span>
                    <span className="cinzel font-bold" style={{ color: T.gold }}>0%</span>
                  </div>
                  <div className="h-1.5 rounded-full" style={{ background: T.border2 }}>
                    <div className="h-full w-0 rounded-full" style={{ background: T.gold }} />
                  </div>
                  <p className="text-xs mt-1" style={{ color: T.mutedDk }}>
                    Goal: ETB {Number(form.goal || 0).toLocaleString()}
                  </p>
                </div>
              )}
            </Card>
            <Card>
              <h3 className="font-bold cinzel mb-3 text-xs uppercase tracking-widest" style={{ color: T.mutedDk }}>
                Tips
              </h3>
              {[
                "Use a specific, descriptive title",
                "Set a realistic but ambitious goal",
                "Choose a clear end date to create urgency",
                "Add a cover image to attract donors",
              ].map((tip, i) => (
                <div key={i} className="flex items-start gap-2 mb-2">
                  <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: `${T.gold}20`, color: T.gold }}>
                    <Ico d={P.check} c="w-2.5 h-2.5" />
                  </span>
                  <p className="text-base crimson" style={{ color: T.cream }}>{tip}</p>
                </div>
              ))}
            </Card>
          </div>
        </div>
      )}

      {/* Step 2: Details & Description */}
      {step === 2 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <Card>
              <h3 className="font-bold cinzel mb-5 flex items-center gap-2" style={{ color: T.cream }}>
                Campaign Story
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5 cinzel" style={{ color: T.muted }}>
                    Description *
                  </label>
                  <textarea value={form.description} onChange={set("description")} rows={6}
                    placeholder="Tell your congregation why this campaign matters. Describe the need, the plan, and the impact their giving will have..."
                    className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none crimson"
                    style={{ background: T.border2, border: `1px solid ${T.border}`, color: T.cream, lineHeight: "1.7" }} />
                  {errors.description && <p className="text-xs mt-1" style={{ color: "#d07070" }}>{errors.description}</p>}
                  <p className="text-xs mt-1 text-right crimson" style={{ color: T.mutedDk }}>
                    {form.description.length} characters
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-bold cinzel mb-4" style={{ color: T.cream }}>Visibility & Notifications</h3>
              {[
                { label:"Show on public giving page",    desc:"Members can see and donate directly",        on:true  },
                { label:"Send launch notification",      desc:"Notify all members via email when published", on:true  },
                { label:"Enable automatic updates",      desc:"Post weekly progress to Telegram channel",   on:false },
                { label:"Allow anonymous donations",     desc:"Donors can give without account login",      on:true  },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between py-3"
                  style={{ borderBottom: i < 3 ? `1px solid ${T.border2}` : "none" }}>
                  <div>
                    <p className="text-sm crimson" style={{ color: T.cream }}>{row.label}</p>
                    <p className="text-xs crimson italic" style={{ color: T.mutedDk }}>{row.desc}</p>
                  </div>
                  <div className="relative w-11 h-6 rounded-full flex-shrink-0"
                    style={{ background: row.on ? T.gold : T.border }}>
                    <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${row.on ? "translate-x-5" : "translate-x-0.5"}`} />
                  </div>
                </div>
              ))}
            </Card>
          </div>

          {/* Summary */}
          <div>
            <Card>
              <h3 className="font-bold cinzel mb-4 text-xs uppercase tracking-widest" style={{ color: T.mutedDk }}>
                Campaign Summary
              </h3>
              {[
                { l: "Title",    v: form.title    },
                { l: "Category", v: form.category },
                { l: "Goal",     v: `ETB ${Number(form.goal||0).toLocaleString()}` },
                { l: "Ends",     v: form.ends     },
              ].map(row => (
                <div key={row.l} className="flex items-start justify-between py-2.5"
                  style={{ borderBottom: `1px solid ${T.border2}` }}>
                  <span className="text-xs cinzel" style={{ color: T.mutedDk }}>{row.l}</span>
                  <span className="text-xs font-semibold crimson text-right ml-4" style={{ color: T.cream }}>
                    {row.v || <span style={{ color: T.mutedDk }}>—</span>}
                  </span>
                </div>
              ))}
              <div className="mt-4 p-3 rounded-xl" style={{ background: `${T.gold}10`, border: `1px solid ${T.gold}30` }}>
                <p className="text-xs crimson italic" style={{ color: T.gold }}>
                  ✝ This campaign will be reviewed and published to your congregation immediately.
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-2">
        <Ghost onClick={() => step === 1 ? router.push("/admin/campaigns") : back()}>
          <Ico d={P.chevRight} c="w-4 h-4 rotate-180" />
          {step === 1 ? "Cancel" : "Back"}
        </Ghost>
        <div className="flex gap-3">
          {step === 1 && <GoldBtn onClick={next} className="text-lg">Next: Campaign Story <Ico d={P.chevRight} c="w-4 h-4" /></GoldBtn>}
          {step === 2 && <GoldBtn onClick={submit}><Ico d={P.check} c="w-4 h-4" />Launch Campaign</GoldBtn>}
        </div>
      </div>
    </div>
  );
}