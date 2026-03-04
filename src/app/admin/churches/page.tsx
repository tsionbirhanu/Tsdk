"use client";
import { useState } from "react";
import { T, IMG }  from "@/lib/theme";
import { P }       from "@/lib/icons";
import { initChurches, Church } from "@/lib/data";
import Hero        from "@/components/ui/Hero";
import Ico         from "@/components/ui/Ico";
import Modal       from "@/components/ui/Modal";
import Fld         from "@/components/ui/Fld";
import { GoldBtn, Ghost } from "@/components/ui/Buttons";

export default function PageChurches() {
  const [churches, setChurches] = useState<Church[]>(initChurches);
  const [showForm, setShowForm] = useState(false);
  const [edit,     setEdit]     = useState<Church | null>(null);
  const [form,     setForm]     = useState({
    name: "", address: "", phone: "", email: "", password: "",
  });

  /* ── Save ── */
  const saveChurch = () => {
    if (!form.name) return;
    if (edit) {
      const upd: Church = {
        ...edit,
        ...form,
        password: form.password || edit.password,
      };
      setChurches(c => c.map(x => x.id === edit.id ? upd : x));
      setEdit(null);
    } else {
      setChurches(c => [...c, { id: Date.now(), ...form }]);
    }
    setForm({ name: "", address: "", phone: "", email: "", password: "" });
    setShowForm(false);
  };

  /* ── Begin edit ── */
  const beginEdit = (c: Church) => {
    setEdit(c);
    setForm({
      name:     c.name,
      address:  c.address  || "",
      phone:    c.phone    || "",
      email:    c.email    || "",
      password: "",
    });
    setShowForm(true);
  };

  const closeModal = () => { setShowForm(false); setEdit(null); };

  return (
    <div className="space-y-5 fade-up">

      {/* ── Hero ── */}
      <Hero
        img={IMG.altar}
        pre="Church Accounts"
        title="Manage Churches"
        sub="Create and edit church profiles"
        op={55}
          action={
          <GoldBtn size="md" onClick={() => { setEdit(null); setShowForm(true); }}>
            <Ico d={P.plus} c="w-5 h-5"/>
            <span className="text-base">New Church</span>
          </GoldBtn>
        }
      />

      {/* ── Table card ── */}
      {/* ✅ removed mt-20, space-y-5 above gives natural gap */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          border:     `1px solid ${T.border}`,
          background: T.card,
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-lg">

            {/* Head */}
            <thead>
              <tr
                className="text-base uppercase tracking-wider cinzel"
                style={{
                  borderBottom: `1px solid ${T.border}`,
                  color:        T.muted,
                  background:   `${T.bg}88`,
                }}
              >
                {["Name", "Address", "Phone", "Email", "Actions"].map(h => (
                  <th
                    key={h}
                    className="text-left py-4 px-6 font-semibold"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {churches.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center crimson italic"
                    style={{ color: T.muted }}
                  >
                    No churches yet. Click <strong>New Church</strong> to add one.
                  </td>
                </tr>
              )}

              {churches.map(c => (
                <tr
                  key={c.id}
                  className="transition-colors hover:bg-white/5"
                  style={{ borderBottom: `1px solid ${T.border2}` }}
                >
                  <td className="py-4 px-6">
                    <p
                      className="font-semibold crimson text-xl"
                      style={{ color: T.cream }}
                    >
                      {c.name}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-base crimson" style={{ color: T.muted }}>
                      {c.address || "—"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-base crimson" style={{ color: T.muted }}>
                      {c.phone || "—"}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-base crimson" style={{ color: T.muted }}>
                      {c.email || "—"}
                    </span>
                  </td>
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => beginEdit(c)}
                        className="p-1.5 rounded-lg transition-all hover:opacity-80"
                        style={{
                          background: T.border2,
                          border:     `1px solid ${T.border}`,
                          color:      T.muted,
                        }}
                        title="Edit"
                      >
                        <Ico d={P.edit} c="w-4 h-4"/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={showForm}
        onClose={closeModal}
        title={edit ? "Edit Church" : "New Church"}
        wide
        yOffset={220}
      >
        <div className="space-y-4 mb-5">
          <Fld
            size="lg"
            label="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <Fld
            size="lg"
            label="Address"
            value={form.address}
            onChange={e => setForm({ ...form, address: e.target.value })}
          />
          <Fld
            size="lg"
            label="Phone"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
          />
          <Fld
            size="lg"
            label="Email"
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <Fld
            size="lg"
            label="Password"
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            ph={edit ? "Leave blank to keep existing" : "Set a password"}
          />
        </div>

        <div className="flex gap-3">
          <GoldBtn size="md" onClick={saveChurch}>
            <Ico d={P.check} c="w-5 h-5"/>
            <span className="text-base">{edit ? "Save Changes" : "Create"}</span>
          </GoldBtn>
          <Ghost size="md" onClick={closeModal}>Cancel</Ghost>
        </div>
      </Modal>
    </div>
  );
}