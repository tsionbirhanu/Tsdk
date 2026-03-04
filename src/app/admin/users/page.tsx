"use client";
import { useState } from "react";
import { T, IMG } from "@/lib/theme";
import { P } from "@/lib/icons";
import { initUsers, User } from "@/lib/data";
import Hero from "@/components/ui/Hero";
import Ico from "@/components/ui/Ico";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import Fld from "@/components/ui/Fld";
import { GoldBtn, Ghost } from "@/components/ui/Buttons";

export default function PageUsers() {
  const [users,  setUsers]  = useState<User[]>(initUsers);
  const [search, setSearch] = useState("");
  const [showA,  setShowA]  = useState(false);
  const [editU,  setEditU]  = useState<User | null>(null);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  // Add member feature removed per admin request

  const saveU = () => {
    if (!editU) return;
    setUsers(u => u.map(x => x.id === editU.id ? editU : x));
    setEditU(null);
  };

  const toggleStatus = (id: number) =>
    setUsers(u => u.map(x => x.id === id ? { ...x, status: x.status === "Active" ? "Inactive" : "Active" } : x));

  return (
    <div className="space-y-5 fade-up">
      <Hero img={IMG.altar} pre="Members" title="User Management"
        sub={`6 registered members`} op={55} />

      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color:T.muted }}>
          <Ico d={P.search} c="w-4 h-4"/>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search members by name or email..."
          className="w-full pl-11 pr-4 py-3 rounded-xl text-base outline-none"
          style={{ background:T.card, border:`1px solid ${T.border}`, color:T.cream }}/>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ border:`1px solid ${T.border}`, background:T.card }}>
        <div className="overflow-x-auto">
          <table className="w-full text-base">
            <thead>
              <tr className="text-sm uppercase tracking-wider cinzel"
                style={{ borderBottom:`1px solid ${T.border}`, color:T.muted, background:`${T.bg}88` }}>
                {["Member","Role","Joined","Total Given","Status","Actions"].map(h => (
                  <th key={h} className="text-left py-3.5 px-5 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} style={{ borderBottom:`1px solid ${T.border2}` }}>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 cinzel"
                        style={{ background:`linear-gradient(135deg,${T.gold},${T.goldDk})`, color:T.bg }}>
                        {u.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-semibold crimson text-base" style={{ color:T.cream }}>{u.name}</p>
                        <p className="text-sm crimson" style={{ color:T.muted }}>{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-5">
                    <span className="text-xs px-2.5 py-1 rounded-full border font-medium cinzel"
                      style={{ background:T.border2, color:T.muted, borderColor:T.border }}>
                      Member
                    </span>
                  </td>
                  <td className="py-4 px-5 text-sm crimson" style={{ color:T.muted }}>{u.joined}</td>
                  <td className="py-4 px-5 font-bold cinzel text-lg" style={{ color:T.gold }}>{u.total}</td>
                  <td className="py-4 px-5"><Badge status={u.status}/></td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setEditU({ ...u })} className="p-1.5 rounded-lg transition-all"
                        style={{ background:T.border2, border:`1px solid ${T.border}`, color:T.muted }}>
                        <Ico d={P.edit} c="w-4 h-4"/>
                      </button>
                      <button onClick={() => toggleStatus(u.id)} className="p-1.5 rounded-lg border transition-all"
                        style={u.status === "Active"
                          ? { background:"rgba(140,40,40,0.1)", borderColor:"rgba(140,40,40,0.3)", color:"#d07070" }
                          : { background:"rgba(50,120,70,0.1)",  borderColor:"rgba(50,120,70,0.3)",  color:"#6aab7a" }}>
                        <Ico d={u.status === "Active" ? P.pause : P.check} c="w-4 h-4"/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add member modal removed per admin request */}

      <Modal open={!!editU} onClose={() => setEditU(null)} title="Edit Member">
        {editU && (
          <>
            <div className="space-y-4 mb-5">
              <Fld label="Full Name" value={editU.name}  onChange={e => setEditU({ ...editU, name:e.target.value  })}/>
              <Fld label="Email"     value={editU.email} onChange={e => setEditU({ ...editU, email:e.target.value })}/>
              <Fld label="Role">
                <div className="text-sm px-3 py-2 rounded-full" style={{ background:T.border2, color:T.muted }}>{"Member"}</div>
              </Fld>
            </div>
            <div className="flex gap-3">
              <GoldBtn onClick={saveU}><Ico d={P.check} c="w-4 h-4"/>Save</GoldBtn>
              <Ghost onClick={() => setEditU(null)}>Cancel</Ghost>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}