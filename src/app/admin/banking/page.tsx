'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Landmark, X } from 'lucide-react';
import { getBankings, addBanking, deleteBanking, getCustomers, fmt } from '@/lib/db';
import type { Banking, Customer } from '@/lib/supabase';

const EMPTY = {
  date: '', customer_name: '', customer_id: '',
  weight: '', karat: 18,
  buy_price_per_gram: '', sell_price_per_gram: '', notes: ''
};

export default function BankingPage() {
  const [items, setItems] = useState<Banking[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);

  const load = () => {
    Promise.all([getBankings(), getCustomers()])
      .then(([b, c]) => { setItems(b); setCustomers(c); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const totalBuy = Number(form.weight) * Number(form.buy_price_per_gram);
  const totalSell = Number(form.weight) * Number(form.sell_price_per_gram);
  const profit = totalSell - totalBuy;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addBanking({
        date: form.date,
        customer_id: form.customer_id || undefined,
        customer_name: form.customer_name,
        weight: Number(form.weight),
        karat: form.karat,
        buy_price_per_gram: Number(form.buy_price_per_gram),
        sell_price_per_gram: Number(form.sell_price_per_gram),
        total_buy: totalBuy,
        total_sell: totalSell,
        profit,
        notes: form.notes,
      });
      setForm(EMPTY);
      setShowForm(false);
      load();
    } catch { /* ignore */ }
    setSaving(false);
  };

  const del = async (id: string) => {
    if (!confirm('حذف شود؟')) return;
    await deleteBanking(id);
    load();
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#E8C96A]">بنکداری</h1>
          <p className="text-[#FAF7F0]/40 text-xs mt-1">خرید از بنکدار برای مشتری</p>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowForm(true)}
          className="gold-gradient text-[#0D0B08] font-bold text-sm px-4 py-2.5 rounded-xl flex items-center gap-2">
          <Plus size={16} /> ثبت جدید
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50" onClick={() => setShowForm(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto bg-[#110E09] border border-[#C9A84C]/30 rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[#E8C96A] font-bold flex items-center gap-2">
                  <Landmark size={18} /> ثبت معامله بنکداری
                </h2>
                <button onClick={() => setShowForm(false)} className="text-[#FAF7F0]/40"><X size={20} /></button>
              </div>

              <div className="bg-[#C9A84C]/5 border border-[#C9A84C]/10 rounded-xl p-3 mb-4 text-xs text-[#FAF7F0]/50">
                در بنکداری، شما از بنکدار برای مشتری طلا می‌خرید. سود از تفاوت قیمت خرید و فروش محاسبه می‌شود.
              </div>

              <form onSubmit={save} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="تاریخ" required>
                    <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required className={inputCls} dir="ltr" />
                  </Field>
                  <Field label="مشتری">
                    {customers.length > 0 ? (
                      <select value={form.customer_id} onChange={e => {
                        const c = customers.find(x => x.id === e.target.value);
                        setForm(f => ({ ...f, customer_id: e.target.value, customer_name: c?.name ?? '' }));
                      }} className={inputCls}>
                        <option value="">انتخاب...</option>
                        {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    ) : (
                      <input value={form.customer_name} onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))} placeholder="نام مشتری" className={inputCls} />
                    )}
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

                <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 space-y-3">
                  <p className="text-xs text-blue-400 font-medium">قیمت‌ها</p>
                  <Field label="قیمت خرید از بنکدار (هر گرم)" required>
                    <input type="number" value={form.buy_price_per_gram} onChange={e => setForm(f => ({ ...f, buy_price_per_gram: e.target.value }))} required placeholder="۰" className={inputCls} dir="ltr" />
                  </Field>
                  <Field label="قیمت فروش به مشتری (هر گرم)" required>
                    <input type="number" value={form.sell_price_per_gram} onChange={e => setForm(f => ({ ...f, sell_price_per_gram: e.target.value }))} required placeholder="۰" className={inputCls} dir="ltr" />
                  </Field>
                </div>

                <Field label="یادداشت">
                  <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className={inputCls + ' resize-none'} />
                </Field>

                {form.weight && form.buy_price_per_gram && form.sell_price_per_gram && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-xl p-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#FAF7F0]/60">هزینه خرید از بنکدار</span>
                      <span className="text-blue-400">{fmt(totalBuy)} ت</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#FAF7F0]/60">مبلغ دریافتی از مشتری</span>
                      <span className="text-green-400">{fmt(totalSell)} ت</span>
                    </div>
                    <div className="border-t border-[#C9A84C]/20 pt-2 flex justify-between text-sm">
                      <span className="text-[#FAF7F0]/60">سود شما</span>
                      <span className={`font-bold ${profit >= 0 ? 'text-[#E8C96A]' : 'text-red-400'}`}>{fmt(profit)} ت</span>
                    </div>
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

      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton-box h-20 rounded-2xl" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-[#FAF7F0]/30 text-sm">هنوز معامله بنکداری ثبت نشده</div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="bg-[#110E09] border border-[#C9A84C]/15 rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center shrink-0">
                <Landmark size={18} className="text-[#C9A84C]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[#FAF7F0] text-sm font-medium">{item.customer_name || '—'}</span>
                  <span className="text-[#FAF7F0]/40 text-xs">{item.weight}گ — {item.karat}ع</span>
                </div>
                <div className="flex flex-wrap gap-3 mt-1">
                  <span className="text-blue-400 text-xs">خرید: {fmt(item.total_buy)} ت</span>
                  <span className="text-green-400 text-xs">فروش: {fmt(item.total_sell)} ت</span>
                  <span className={`text-xs font-bold ${item.profit >= 0 ? 'text-[#E8C96A]' : 'text-red-400'}`}>سود: {fmt(item.profit)} ت</span>
                  <span className="text-[#FAF7F0]/30 text-xs mr-auto">{new Date(item.date).toLocaleDateString('fa-IR')}</span>
                </div>
              </div>
              <button onClick={() => del(item.id)} className="text-red-400/60 hover:text-red-400 shrink-0">
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
