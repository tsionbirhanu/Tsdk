"use client";

import React, { useState } from "react";
import { initCamps } from "@/lib/data";
import { IMG } from "@/lib/theme";
import Hero from "@/components/ui/Hero";
import Modal from "@/components/ui/Modal";
import Fld from "@/components/ui/Fld";
import Badge from "@/components/ui/Badge";
import Prog from "@/components/ui/Prog";
import { GoldBtn, Ghost } from "@/components/ui/Buttons";
import Ico from "@/components/ui/Ico";
import { P } from "@/lib/icons";

type Camp = (typeof initCamps)[number];

export default function CampaignManagePage() {
  const [camps, setCamps] = useState<Camp[]>(initCamps as Camp[]);
  const [editC, setEditC] = useState<Camp | null>(null);

  const setStatus = (id: number, status: Camp["status"]) =>
    setCamps((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));

  const save = () => {
    if (!editC) return;
    setCamps((prev) => prev.map((c) => (c.id === editC.id ? editC : c)));
    setEditC(null);
  };

  return (
    <div className="space-y-6">
      <Hero
        img={IMG.altar}
        pre="Campaigns"
        title="Manage Campaigns"
        sub="Edit • Pause • Resume • Close"
        op={55}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {camps.map((c) => (
          <div
            key={c.id}
            className="rounded-2xl border border-[#1e1e2e] bg-[#0d0d18] p-5 hover:border-[#d4a017]/25 transition-all"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-[#d4a017]/10 flex items-center justify-center flex-shrink-0">
                <Ico d={P.campaign} c="w-6 h-6 text-[#d4a017]" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-bold text-base truncate">
                  {c.title}
                </h4>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <Badge status={c.status} />
                  <span className="text-xs text-gray-500">{c.ends}</span>
                  <span className="text-xs text-gray-500">
                    {c.members} members
                  </span>
                </div>
              </div>
            </div>

            <Prog value={c.raised} max={c.goal} />

            <div className="flex gap-2 mt-4 flex-wrap">
              <button
                onClick={() => setEditC({ ...c })}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-[#1a1a2a] text-gray-300 border border-[#2a2a3a] hover:border-[#d4a017]/40 hover:text-[#d4a017] transition-all"
              >
                <Ico d={P.edit} c="w-3.5 h-3.5" />
                Edit
              </button>

              {c.status === "Active" && (
                <button
                  onClick={() => setStatus(c.id, "Paused")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
                >
                  <Ico d={P.pause} c="w-3.5 h-3.5" />
                  Pause
                </button>
              )}

              {c.status === "Paused" && (
                <button
                  onClick={() => setStatus(c.id, "Active")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
                >
                  <Ico d={P.play} c="w-3.5 h-3.5" />
                  Resume
                </button>
              )}

              {c.status !== "Closed" && c.status !== "Completed" && (
                <button
                  onClick={() => setStatus(c.id, "Closed")}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all"
                >
                  <Ico d={P.stop} c="w-3.5 h-3.5" />
                  Close
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal open={!!editC} onClose={() => setEditC(null)} title="Edit Campaign" wide>
        {editC && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
              <div className="md:col-span-2">
                <Fld
                  label="Campaign Title"
                  value={editC.title}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setEditC({ ...editC, title: e.target.value })
                  }
                />
              </div>
              <Fld
                label="Goal (ETB)"
                type="number"
                value={editC.goal}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditC({ ...editC, goal: Number(e.target.value) } as Camp)
                }
              />
              <Fld
                label="End Date"
                value={editC.ends}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setEditC({ ...editC, ends: e.target.value })
                }
              />
            </div>

            <div className="flex gap-3">
              <GoldBtn onClick={save}>
                <Ico d={P.check} c="w-4 h-4" />
                Save Changes
              </GoldBtn>
              <Ghost onClick={() => setEditC(null)}>Cancel</Ghost>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}