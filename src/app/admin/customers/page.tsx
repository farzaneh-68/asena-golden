'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Users, X, Phone, MapPin, Search } from 'lucide-react';
import { getCustomers, addCustomer, deleteCustomer } from '@/lib/db';
import type { Customer } from '@/lib/supabase';

const EMPTY = { name: '', phone: '', address: '', notes: '' };

export default function CustomersPage() {
  const [items, setItems] = useState<Customer[]>([]);
  const [filtered, setFiltered] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const load = () => getCustomers().then(d => { setItems(d); setFiltered(d); }).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  useEffect(() => {
    if (!search) { setFiltered(items); return; }
    const q = search.toLowerCase();
    setFiltered(items.filter(c =>
      c.name.toLowerCase().includes(q) || c.phone?.includes(q)
    ));
  }, [search, items]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addCustomer(form);
      setForm(EMPTY);
      setShowForm(false);
      load();
    } catch { /* ignore */ }
    setSaving(false);
  };

  const del = async (id: string) => {
    if (!confirm('این مشتری حذف شود؟')) return;
    await deleteCustomer(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#E8C96A]">مشتریان</h1>
          <p className="text-[#FAF7F0]/40 text-xs mt-1">{items.length} مشتری ثبت شده</p>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowForm(true)}
          className="gold-gradient text-[#0D0B08] font-bold text-sm px-4 py-2.5 rounded-xl flex items-center gap-2">
          <Plus size={16} /> مشتری جدید
        </motion.button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C9A84C]/40" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="جستجو بر اساس نام یا تلفن..."
          className="w-full bg-[#110E09] border border-[#C9A84C]/20 rounded-xl pr-9 pl-4 py-3 text-[#FAF7F0] text-sm outline-none focus:border-[#C9A84C]/50 transition-all placeholder-[#FAF7F0]/20"
        />
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50" onClick={() => setShowForm(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto bg-[#110E09] border border-[#C9A84C]/30 rounded-2xl p-6"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[#E8C96A] font-bold flex items-center gap-2">
                  <Users size={18} /> مشتری جدید
                </h2>
                <button onClick={() => setShowForm(false)} className="text-[#FAF7F0]/40"><X size={20} /></button>
              </div>
              <form onSubmit={save} className="space-y-4">
                <Field label="نام و نام خانوادگی" required>
                  <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required placeholder="نام مشتری" className={inputCls} />
                </Field>
                <Field label="شماره تلفن">
                  <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="09xx-xxx-xxxx" className={inputCls} dir="ltr" />
                </Field>
                <Field label="آدرس">
                  <textarea value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} rows={2} className={inputCls + ' resize-none'} />
                </Field>
                <Field label="یادداشت">
                  <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className={inputCls + ' resize-none'} />
                </Field>
                <button type="submit" disabled={saving} className="w-full gold-gradient py-3 rounded-xl text-[#0D0B08] font-bold text-sm">
                  {saving ? 'در حال ذخیره...' : 'ذخیره'}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton-box h-24 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-[#FAF7F0]/30 text-sm">
          {search ? 'نتیجه‌ای یافت نشد' : 'هنوز مشتری ثبت نشده'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filtered.map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="bg-[#110E09] border border-[#C9A84C]/15 rounded-2xl p-4 flex items-start gap-3">
              <div className="w-11 h-11 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center shrink-0">
                <span className="text-[#E8C96A] font-bold text-lg">{c.name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[#FAF7F0] font-medium text-sm">{c.name}</p>
                {c.phone && (
                  <p className="text-[#FAF7F0]/50 text-xs flex items-center gap-1 mt-1">
                    <Phone size={11} /> {c.phone}
                  </p>
                )}
                {c.address && (
                  <p className="text-[#FAF7F0]/40 text-xs flex items-center gap-1 mt-0.5 line-clamp-2">
                    <MapPin size={11} /> {c.address}
                  </p>
                )}
              </div>
              <button onClick={() => del(c.id)} className="text-red-400/60 hover:text-red-400 shrink-0">
                <Trash2 size={16} />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

const inputCls = 'w-full bg-[#0D0B08] border border-[#C9A84C]/20 rounded-xl px-3 py-2.5 text-[#FAF7F0] text-sm outline-none focus:border-[#C9A84C]/50 transition-all placeholder-[#FAF7F0]/20';
function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="text-xs text-[#C9A84C]/70 mb-1.5 block">{label}{required && ' *'}</label>
      {children}
    </div>
  );
}
