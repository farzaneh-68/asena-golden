'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, ShoppingCart, X } from 'lucide-react';
import { getPurchases, addPurchase, deletePurchase, fmt } from '@/lib/db';
import type { Purchase } from '@/lib/supabase';
import DateInput from '@/components/admin/DateInput';
import { toJalaliLong, todayJalali, toGregorian } from '@/lib/date';

const EMPTY = { date: toGregorian(todayJalali()), supplier: '', weight: '', karat: 18, price_per_gram: '', wage: '', notes: '' };

export default function PurchasesPage() {
  const [items, setItems] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => getPurchases().then(setItems).finally(() => setLoading(false));
  useEffect(() => { load(); }, []);

  const total = Number(form.weight) * Number(form.price_per_gram) + Number(form.wage || 0);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const p = {
        date: form.date,
        supplier: form.supplier,
        weight: Number(form.weight),
        karat: form.karat,
        price_per_gram: Number(form.price_per_gram),
        total_price: total,
        wage: Number(form.wage || 0),
        notes: form.notes,
      };
      await addPurchase(p);
      setForm(EMPTY);
      setShowForm(false);
      load();
    } catch { /* ignore */ }
    setSaving(false);
  };

  const del = async (id: string) => {
    if (!confirm('حذف شود؟')) return;
    await deletePurchase(id);
    load();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#E8C96A]">خرید طلا</h1>
          <p className="text-[#FAF7F0]/40 text-xs mt-1">ثبت طلاهای خریداری شده</p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowForm(true)}
          className="gold-gradient text-[#0D0B08] font-bold text-sm px-4 py-2.5 rounded-xl flex items-center gap-2"
        >
          <Plus size={16} />
          خرید جدید
        </motion.button>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50" onClick={() => setShowForm(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto bg-[#110E09] border border-[#C9A84C]/30 rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[#E8C96A] font-bold flex items-center gap-2">
                  <ShoppingCart size={18} /> ثبت خرید جدید
                </h2>
                <button onClick={() => setShowForm(false)} className="text-[#FAF7F0]/40">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={save} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="تاریخ" required>
                    <DateInput value={form.date} onChange={d => setForm(f => ({ ...f, date: d }))} required className={inputCls} />
                  </Field>
                  <Field label="فروشنده">
                    <input value={form.supplier} onChange={e => setForm(f => ({ ...f, supplier: e.target.value }))} placeholder="نام بنکدار/فروشنده" className={inputCls} />
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="وزن (گرم)" required>
                    <input type="number" step="0.01" value={form.weight} onChange={e => setForm(f => ({ ...f, weight: e.target.value }))} required placeholder="۰.۰۰" className={inputCls} dir="ltr" />
                  </Field>
                  <Field label="عیار">
                    <select value={form.karat} onChange={e => setForm(f => ({ ...f, karat: Number(e.target.value) }))} className={inputCls}>
                      {[18, 24, 21, 14].map(k => <option key={k} value={k}>{k} عیار</option>)}
                    </select>
                  </Field>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="قیمت هر گرم (تومان)" required>
                    <input type="number" value={form.price_per_gram} onChange={e => setForm(f => ({ ...f, price_per_gram: e.target.value }))} required placeholder="۰" className={inputCls} dir="ltr" />
                  </Field>
                  <Field label="اجرت (تومان)">
                    <input type="number" value={form.wage} onChange={e => setForm(f => ({ ...f, wage: e.target.value }))} placeholder="۰" className={inputCls} dir="ltr" />
                  </Field>
                </div>
                <Field label="یادداشت">
                  <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className={inputCls + ' resize-none'} />
                </Field>

                {form.weight && form.price_per_gram && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-xl p-4">
                    <p className="text-xs text-[#FAF7F0]/50 mb-1">مبلغ کل</p>
                    <p className="text-[#E8C96A] font-bold text-lg">{fmt(total)} تومان</p>
                  </motion.div>
                )}

                <button type="submit" disabled={saving} className="w-full gold-gradient py-3 rounded-xl text-[#0D0B08] font-bold text-sm">
                  {saving ? 'در حال ذخیره...' : 'ذخیره'}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* List */}
      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton-box h-20 rounded-2xl" />)}</div>
      ) : items.length === 0 ? (
        <Empty label="هنوز خریدی ثبت نشده" />
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#110E09] border border-[#C9A84C]/15 rounded-2xl p-4 flex items-center gap-4"
            >
              <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center shrink-0">
                <ShoppingCart size={18} className="text-[#C9A84C]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[#FAF7F0] text-sm font-medium">{item.weight} گرم — {item.karat} عیار</span>
                  {item.supplier && <span className="text-[#FAF7F0]/40 text-xs">از {item.supplier}</span>}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[#E8C96A] text-sm font-bold">{fmt(item.total_price)} ت</span>
                  <span className="text-[#FAF7F0]/30 text-xs">{fmt(item.price_per_gram)} ت/گرم</span>
                  <span className="text-[#FAF7F0]/30 text-xs mr-auto">{toJalaliLong(item.date)}</span>
                </div>
              </div>
              <button onClick={() => del(item.id)} className="text-red-400/60 hover:text-red-400 transition-colors shrink-0">
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

function Empty({ label }: { label: string }) {
  return (
    <div className="text-center py-16 text-[#FAF7F0]/30">
      <p className="text-sm">{label}</p>
    </div>
  );
}
