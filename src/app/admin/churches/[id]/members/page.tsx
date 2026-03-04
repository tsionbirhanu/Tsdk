"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Hero from '@/components/ui/Hero';
import { IMG } from '@/lib/theme';
import Ico from '@/components/ui/Ico';
import Fld from '@/components/ui/Fld';
import Modal from '@/components/ui/Modal';
import { GoldBtn, Ghost } from '@/components/ui/Buttons';
import { P } from '@/lib/icons';
import { T } from '@/lib/theme';

export default function PageMembers({ params }: { params: { id: string } }) {
  const churchId = Number(params.id);
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });

  const fetchMembers = async () => {
    setLoading(true);
    const res = await fetch(`/api/churches/${churchId}/members`, { headers: { authorization: 'Bearer user' } });
    if (res.ok) {
      const j = await res.json(); setMembers(j.members || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchMembers(); }, [churchId]);

  const createMember = async () => {
    const res = await fetch(`/api/churches/${churchId}/members`, { method: 'POST', headers: { 'content-type':'application/json', authorization:'Bearer admin' }, body: JSON.stringify(form) });
    if (res.ok) { await fetchMembers(); setShowNew(false); setForm({ name:'', email:'' }); }
  };

  const deleteMember = async (id:number) => {
    if (!confirm('Delete member?')) return;
    const res = await fetch(`/api/churches/${churchId}/members`, { method: 'DELETE', headers: { 'content-type':'application/json', authorization:'Bearer admin' }, body: JSON.stringify({ id }) });
    if (res.ok) await fetchMembers();
  };

  return (
    <div className="space-y-6 fade-up">
      <Hero img={IMG.altar} pre="Members" title="Church Members" sub="Manage church members" op={55} action={<GoldBtn onClick={() => setShowNew(true)}><Ico d={P.plus} c="w-4 h-4"/>New</GoldBtn>} />

      <div className="rounded-2xl p-4" style={{ border:`1px solid ${T.border}`, background:T.card }}>
        {loading ? <div>Loading...</div> : (
          <div className="space-y-3">
            {members.length === 0 && <div className="text-sm" style={{ color:T.muted }}>No members yet.</div>}
            {members.map(m => (
              <div key={m.id} className="flex items-center justify-between p-2 rounded hover:bg-white/3">
                <div>
                  <div className="font-semibold">{m.name}</div>
                  <div className="text-sm" style={{ color:T.muted }}>{m.email}</div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => deleteMember(m.id)} className="text-sm crimson" style={{ color:T.muted }}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={showNew} onClose={() => setShowNew(false)} title="New Member">
        <div className="space-y-4 mb-4">
          <Fld label="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} />
          <Fld label="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} type="email" />
        </div>
        <div className="flex gap-3">
          <GoldBtn onClick={createMember}><Ico d={P.check} c="w-4 h-4"/>Create</GoldBtn>
          <Ghost onClick={()=>setShowNew(false)}>Cancel</Ghost>
        </div>
      </Modal>
    </div>
  );
}
