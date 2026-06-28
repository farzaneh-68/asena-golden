'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getPurchases, getSales, getBankings, fmt } from '@/lib/db';
import type { Purchase, Sale, Banking } from '@/lib/supabase';

const GOLD = ['#E8C96A', '#C9A84C', '#A07830', '#7a5a20'];

export default function ReportsPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [bankings, setBankings] = useState<Banking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getPurchases(), getSales(), getBankings()])
      .then(([p, s, b]) => { setPurchases(p); setSales(s); setBankings(b); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="space-y-4">{[...Array(4)].map((_, i) => <div key={i} className="skeleton-box h-32 rounded-2xl" />)}</div>;
  }

  const totalBought = purchases.reduce((s, p) => s + p.total_price, 0);
  const totalSold = sales.reduce((s, p) => s + p.total_price, 0);
  const salesProfit = sales.reduce((s, p) => s + (p.profit ?? 0), 0);
  const bankingProfit = bankings.reduce((s, p) => s + p.profit, 0);
  const totalProfit = salesProfit + bankingProfit;

  const totalGoldBought = purchases.reduce((s, p) => s + p.weight, 0);
  const totalGoldSold = sales.reduce((s, p) => s + p.weight, 0);
  const goldBalance = totalGoldBought - totalGoldSold;

  // Monthly chart data
  const monthlyMap: Record<string, { month: string; buy: number; sell: number; profit: number }> = {};
  [...purchases].forEach(p => {
    const m = p.date.slice(0, 7);
    if (!monthlyMap[m]) monthlyMap[m] = { month: m, buy: 0, sell: 0, profit: 0 };
    monthlyMap[m].buy += p.total_price;
  });
  [...sales].forEach(s => {
    const m = s.date.slice(0, 7);
    if (!monthlyMap[m]) monthlyMap[m] = { month: m, buy: 0, sell: 0, profit: 0 };
    monthlyMap[m].sell += s.total_price;
    monthlyMap[m].profit += s.profit ?? 0;
  });
  const chartData = Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month)).slice(-6);

  const pieData = [
    { name: 'سود فروش', value: Math.max(0, salesProfit) },
    { name: 'سود بنکداری', value: Math.max(0, bankingProfit) },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-xl font-bold text-[#E8C96A]">گزارشات مالی</h1>
        <p className="text-[#FAF7F0]/40 text-xs mt-1">تحلیل کامل خرید، فروش و سود</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'کل خرید', val: fmt(totalBought) + ' ت', color: 'text-blue-400', sub: `${totalGoldBought.toFixed(2)} گرم` },
          { label: 'کل فروش', val: fmt(totalSold) + ' ت', color: 'text-green-400', sub: `${totalGoldSold.toFixed(2)} گرم` },
          { label: 'موجودی طلا', val: `${goldBalance.toFixed(2)} گرم`, color: 'text-orange-400' },
          { label: 'سود کل', val: fmt(totalProfit) + ' ت', color: 'text-[#E8C96A]' },
        ].map((c, i) => (
          <motion.div key={c.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="bg-[#110E09] border border-[#C9A84C]/15 rounded-2xl p-4">
            <p className="text-[#FAF7F0]/50 text-xs mb-2">{c.label}</p>
            <p className={`font-bold text-base ${c.color}`}>{c.val}</p>
            {c.sub && <p className="text-[#FAF7F0]/30 text-xs mt-1">{c.sub}</p>}
          </motion.div>
        ))}
      </div>

      {/* Monthly Chart */}
      {chartData.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-[#110E09] border border-[#C9A84C]/15 rounded-2xl p-5">
          <p className="text-[#FAF7F0]/60 text-sm mb-4">خرید و فروش ماهانه</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <XAxis dataKey="month" tick={{ fill: '#FAF7F0', fontSize: 10, opacity: 0.4 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#1a1510', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 12, fontSize: 12 }}
                labelStyle={{ color: '#C9A84C' }}
                formatter={(val) => [fmt(Number(val)) + ' ت']}
              />
              <Bar dataKey="buy" name="خرید" fill="#60a5fa" radius={[4, 4, 0, 0]} opacity={0.7} />
              <Bar dataKey="sell" name="فروش" fill="#4ade80" radius={[4, 4, 0, 0]} opacity={0.7} />
              <Bar dataKey="profit" name="سود" fill="#E8C96A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Profit Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pieData.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-[#110E09] border border-[#C9A84C]/15 rounded-2xl p-5">
            <p className="text-[#FAF7F0]/60 text-sm mb-4">ترکیب سود</p>
            <div className="flex items-center gap-4">
              <PieChart width={120} height={120}>
                <Pie data={pieData} cx={55} cy={55} outerRadius={50} innerRadius={30} dataKey="value" strokeWidth={0}>
                  {pieData.map((_, i) => <Cell key={i} fill={GOLD[i]} />)}
                </Pie>
              </PieChart>
              <div className="space-y-2">
                {pieData.map((d, i) => (
                  <div key={d.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: GOLD[i] }} />
                    <div>
                      <p className="text-[#FAF7F0]/60 text-xs">{d.name}</p>
                      <p className="font-bold text-sm" style={{ color: GOLD[i] }}>{fmt(d.value)} ت</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Top Stats */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="bg-[#110E09] border border-[#C9A84C]/15 rounded-2xl p-5">
          <p className="text-[#FAF7F0]/60 text-sm mb-4">آمار کلی</p>
          <div className="space-y-3">
            {[
              { label: 'تعداد خرید', val: `${purchases.length} فقره` },
              { label: 'تعداد فروش', val: `${sales.length} فقره` },
              { label: 'تعداد بنکداری', val: `${bankings.length} فقره` },
              { label: 'میانگین فروش', val: sales.length ? `${fmt(totalSold / sales.length)} ت` : '—' },
              { label: 'میانگین سود فروش', val: sales.filter(s => s.profit != null).length ? `${fmt(salesProfit / sales.filter(s => s.profit != null).length)} ت` : '—' },
            ].map(item => (
              <div key={item.label} className="flex justify-between text-sm border-b border-[#C9A84C]/10 pb-2 last:border-0">
                <span className="text-[#FAF7F0]/50">{item.label}</span>
                <span className="text-[#E8C96A] font-medium">{item.val}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
