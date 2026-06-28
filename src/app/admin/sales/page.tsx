'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, TrendingUp, X, Printer, Gem } from 'lucide-react';
import { getSales, addSale, deleteSale, getCustomers, fmt } from '@/lib/db';
import type { Sale, Customer } from '@/lib/supabase';

const EMPTY = {
  date: '', customer_name: '', customer_id: '',
  weight: '', karat: 18, price_per_gram: '', wage: '', tax: '',
  buy_price_per_gram: '', notes: '', invoice_number: ''
};

function genInvoice() {
  return 'INV-' + Date.now().toString().slice(-8);
}

export default function SalesPage() {
  const [items, setItems] = useState<Sale[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [invoice, setInvoice] = useState<Sale | null>(null);
  const [form, setForm] = useState({ ...EMPTY, invoice_number: genInvoice() });
  const [saving, setSaving] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const load = () => {
    Promise.all([getSales(), getCustomers()])
      .then(([s, c]) => { setItems(s); setCustomers(c); })
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const goldTotal = Number(form.weight) * Number(form.price_per_gram);
  const wageN = Number(form.wage || 0);
  const taxN = Number(form.tax || 0);
  const total = goldTotal + wageN + taxN;
  const buyTotal = Number(form.weight) * Number(form.buy_price_per_gram || 0);
  const profit = total - buyTotal - wageN;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const s = {
        invoice_number: form.invoice_number,
        customer_id: form.customer_id || undefined,
        customer_name: form.customer_name,
        date: form.date,
        weight: Number(form.weight),
        karat: form.karat,
        price_per_gram: Number(form.price_per_gram),
        total_gold_price: goldTotal,
        wage: wageN,
        tax: taxN,
        total_price: total,
        buy_price_per_gram: Number(form.buy_price_per_gram) || undefined,
        profit: form.buy_price_per_gram ? profit : undefined,
        notes: form.notes,
      };
      await addSale(s);
      setForm({ ...EMPTY, invoice_number: genInvoice() });
      setShowForm(false);
      load();
    } catch { /* ignore */ }
    setSaving(false);
  };

  const del = async (id: string) => {
    if (!confirm('حذف شود؟')) return;
    await deleteSale(id);
    load();
  };

  const print = () => window.print();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-[#E8C96A]">فروش و فاکتور</h1>
          <p className="text-[#FAF7F0]/40 text-xs mt-1">ثبت فروش و صدور فاکتور</p>
        </div>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setShowForm(true)}
          className="gold-gradient text-[#0D0B08] font-bold text-sm px-4 py-2.5 rounded-xl flex items-center gap-2">
          <Plus size={16} /> فروش جدید
        </motion.button>
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
              className="fixed inset-x-4 top-4 bottom-4 z-50 max-w-md mx-auto bg-[#110E09] border border-[#C9A84C]/30 rounded-2xl p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[#E8C96A] font-bold flex items-center gap-2">
                  <TrendingUp size={18} /> ثبت فروش جدید
                </h2>
                <button onClick={() => setShowForm(false)} className="text-[#FAF7F0]/40"><X size={20} /></button>
              </div>

              <form onSubmit={save} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Field label="شماره فاکتور">
                    <input value={form.invoice_number} onChange={e => setForm(f => ({ ...f, invoice_number: e.target.value }))} className={inputCls} dir="ltr" />
                  </Field>
                  <Field label="تاریخ" required>
                    <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required className={inputCls} dir="ltr" />
                  </Field>
                </div>

                <Field label="مشتری">
                  {customers.length > 0 ? (
                    <select value={form.customer_id} onChange={e => {
                      const c = customers.find(x => x.id === e.target.value);
                      setForm(f => ({ ...f, customer_id: e.target.value, customer_name: c?.name ?? '' }));
                    }} className={inputCls}>
                      <option value="">انتخاب مشتری...</option>
                      {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  ) : (
                    <input value={form.customer_name} onChange={e => setForm(f => ({ ...f, customer_name: e.target.value }))} placeholder="نام مشتری" className={inputCls} />
                  )}
                </Field>

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
                  <Field label="قیمت فروش هر گرم" required>
                    <input type="number" value={form.price_per_gram} onChange={e => setForm(f => ({ ...f, price_per_gram: e.target.value }))} required placeholder="۰" className={inputCls} dir="ltr" />
                  </Field>
                  <Field label="قیمت خرید هر گرم (اختیاری)">
                    <input type="number" value={form.buy_price_per_gram} onChange={e => setForm(f => ({ ...f, buy_price_per_gram: e.target.value }))} placeholder="برای محاسبه سود" className={inputCls} dir="ltr" />
                  </Field>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="اجرت">
                    <input type="number" value={form.wage} onChange={e => setForm(f => ({ ...f, wage: e.target.value }))} placeholder="۰" className={inputCls} dir="ltr" />
                  </Field>
                  <Field label="مالیات">
                    <input type="number" value={form.tax} onChange={e => setForm(f => ({ ...f, tax: e.target.value }))} placeholder="۰" className={inputCls} dir="ltr" />
                  </Field>
                </div>

                <Field label="یادداشت">
                  <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={2} className={inputCls + ' resize-none'} />
                </Field>

                {form.weight && form.price_per_gram && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-xl p-4 space-y-2">
                    <Row label="مبلغ طلا" val={fmt(goldTotal)} />
                    <Row label="اجرت" val={fmt(wageN)} />
                    <Row label="مالیات" val={fmt(taxN)} />
                    <div className="border-t border-[#C9A84C]/20 pt-2">
                      <Row label="مبلغ کل" val={fmt(total)} gold />
                    </div>
                    {form.buy_price_per_gram && (
                      <div className="border-t border-[#C9A84C]/20 pt-2">
                        <Row label="سود تخمینی" val={fmt(profit)} gold={profit > 0} />
                      </div>
                    )}
                  </motion.div>
                )}

                <button type="submit" disabled={saving} className="w-full gold-gradient py-3 rounded-xl text-[#0D0B08] font-bold text-sm">
                  {saving ? 'در حال ذخیره...' : 'ذخیره و صدور فاکتور'}
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Invoice Modal */}
      <AnimatePresence>
        {invoice && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 z-50" onClick={() => setInvoice(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-x-4 top-8 bottom-8 z-50 max-w-sm mx-auto bg-white rounded-2xl overflow-hidden"
            >
              <div className="bg-[#0D0B08] p-4 flex items-center justify-between print:hidden">
                <button onClick={print} className="gold-gradient text-[#0D0B08] font-bold text-sm px-4 py-2 rounded-xl flex items-center gap-2">
                  <Printer size={16} /> چاپ / PDF
                </button>
                <button onClick={() => setInvoice(null)} className="text-[#FAF7F0]/60"><X size={20} /></button>
              </div>
              <div ref={printRef} className="p-6 text-right" dir="rtl">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Gem size={24} className="text-[#C9A84C]" />
                    <h2 className="text-xl font-bold text-[#0D0B08]">آسنا گلدن</h2>
                  </div>
                  <p className="text-gray-500 text-sm">فاکتور فروش</p>
                  <p className="text-xs text-gray-400 mt-1">شماره: {invoice.invoice_number}</p>
                </div>
                <div className="border-t border-b border-gray-200 py-4 mb-4 space-y-2">
                  <InvRow label="مشتری" val={invoice.customer_name ?? '—'} />
                  <InvRow label="تاریخ" val={new Date(invoice.date).toLocaleDateString('fa-IR')} />
                  <InvRow label="وزن" val={`${invoice.weight} گرم — ${invoice.karat} عیار`} />
                  <InvRow label="قیمت هر گرم" val={`${fmt(invoice.price_per_gram)} تومان`} />
                  <InvRow label="اجرت" val={`${fmt(invoice.wage)} تومان`} />
                  <InvRow label="مالیات" val={`${fmt(invoice.tax)} تومان`} />
                </div>
                <div className="bg-amber-50 rounded-xl p-4 text-center">
                  <p className="text-gray-500 text-xs mb-1">مبلغ کل</p>
                  <p className="text-2xl font-bold text-[#C9A84C]">{fmt(invoice.total_price)} تومان</p>
                </div>
                {invoice.notes && (
                  <p className="text-gray-500 text-xs mt-4 text-center">{invoice.notes}</p>
                )}
                <p className="text-center text-gray-400 text-xs mt-6">با تشکر از خرید شما — آسنا گلدن</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* List */}
      {loading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="skeleton-box h-20 rounded-2xl" />)}</div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-[#FAF7F0]/30 text-sm">هنوز فروشی ثبت نشده</div>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-[#110E09] border border-[#C9A84C]/15 rounded-2xl p-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/10 flex items-center justify-center shrink-0">
                  <TrendingUp size={18} className="text-[#C9A84C]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[#FAF7F0] text-sm font-medium">{item.customer_name || 'مشتری ناشناس'}</span>
                    <span className="text-[#FAF7F0]/30 text-xs">{item.invoice_number}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-1">
                    <span className="text-[#FAF7F0]/50 text-xs">{item.weight}گ — {item.karat}ع</span>
                    <span className="text-[#E8C96A] text-sm font-bold">{fmt(item.total_price)} ت</span>
                    {item.profit != null && (
                      <span className={`text-xs font-medium ${item.profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        سود: {fmt(item.profit)} ت
                      </span>
                    )}
                    <span className="text-[#FAF7F0]/30 text-xs mr-auto">{new Date(item.date).toLocaleDateString('fa-IR')}</span>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => setInvoice(item)} className="text-[#C9A84C]/60 hover:text-[#C9A84C]">
                    <Printer size={16} />
                  </button>
                  <button onClick={() => del(item.id)} className="text-red-400/60 hover:text-red-400">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
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

function Row({ label, val, gold }: { label: string; val: string; gold?: boolean }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-[#FAF7F0]/60">{label}</span>
      <span className={gold ? 'text-[#E8C96A] font-bold' : 'text-[#FAF7F0]'}>{val} ت</span>
    </div>
  );
}

function InvRow({ label, val }: { label: string; val: string }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-800 font-medium">{label}</span>
      <span className="text-gray-600">{val}</span>
    </div>
  );
}
