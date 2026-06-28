'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Scale, Receipt, DollarSign, Gem } from 'lucide-react';
import { getStats, fmt } from '@/lib/db';

type Stats = {
  totalBought: number;
  totalSold: number;
  totalProfit: number;
  totalGoldBought: number;
  totalGoldSold: number;
  salesCount: number;
};

function StatCard({
  label, value, sub, icon: Icon, color, delay
}: {
  label: string; value: string; sub?: string;
  icon: React.ElementType; color: string; delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-[#110E09] border border-[#C9A84C]/15 rounded-2xl p-5 relative overflow-hidden"
    >
      <div className={`absolute top-0 left-0 w-24 h-24 rounded-full opacity-10 blur-2xl ${color}`} />
      <div className="flex items-start justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color} bg-opacity-20`}
          style={{ background: 'rgba(201,168,76,0.1)' }}>
          <Icon size={20} className="text-[#E8C96A]" />
        </div>
      </div>
      <p className="text-[#FAF7F0]/50 text-xs mb-1">{label}</p>
      <p className="text-[#E8C96A] text-xl font-bold">{value}</p>
      {sub && <p className="text-[#FAF7F0]/40 text-xs mt-1">{sub}</p>}
    </motion.div>
  );
}

function GoldPriceWidget() {
  const [price, setPrice] = useState<number | null>(null);

  useEffect(() => {
    fetch('https://brsapi.ir/Api/Market/Gold_Currency.php?key=free')
      .then(r => r.json())
      .then(d => {
        const g = d?.gold?.find((x: { name: string; price: number }) => x.name?.includes('18') || x.name?.includes('مثقال'));
        if (g) setPrice(g.price);
      })
      .catch(() => null);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-[#110E09] border border-[#C9A84C]/20 rounded-2xl p-5 col-span-full md:col-span-2"
    >
      <div className="flex items-center gap-2 mb-2">
        <Gem size={16} className="text-[#C9A84C]" />
        <span className="text-[#FAF7F0]/60 text-sm">قیمت لحظه‌ای طلا</span>
        <span className="text-xs text-[#C9A84C]/50 mr-auto">منبع: brsapi.ir</span>
      </div>
      {price ? (
        <div>
          <p className="shimmer-text text-2xl font-bold">{fmt(price)} تومان</p>
          <p className="text-[#FAF7F0]/40 text-xs mt-1">هر گرم طلای ۱۸ عیار</p>
        </div>
      ) : (
        <div className="skeleton-box h-8 w-48 rounded-lg mt-2" />
      )}
    </motion.div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats()
      .then(setStats)
      .catch(() => setStats({ totalBought: 0, totalSold: 0, totalProfit: 0, totalGoldBought: 0, totalGoldSold: 0, salesCount: 0 }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="skeleton-box h-28 rounded-2xl" />
        ))}
      </div>
    );
  }

  const s = stats!;
  const today = new Date().toLocaleDateString('fa-IR');

  return (
    <div>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
        <h1 className="text-xl font-bold text-[#E8C96A]">داشبورد</h1>
        <p className="text-[#FAF7F0]/40 text-sm mt-1">{today}</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
        <StatCard label="کل خرید" value={`${fmt(s.totalBought)} ت`} sub={`${s.totalGoldBought.toFixed(2)} گرم`} icon={TrendingDown} color="text-blue-400" delay={0.1} />
        <StatCard label="کل فروش" value={`${fmt(s.totalSold)} ت`} sub={`${s.totalGoldSold.toFixed(2)} گرم`} icon={TrendingUp} color="text-green-400" delay={0.15} />
        <StatCard label="سود کل" value={`${fmt(s.totalProfit)} ت`} icon={DollarSign} color="text-[#C9A84C]" delay={0.2} />
        <StatCard label="فاکتورها" value={`${s.salesCount} فاکتور`} icon={Receipt} color="text-purple-400" delay={0.25} />
        <StatCard label="موجودی تقریبی" value={`${(s.totalGoldBought - s.totalGoldSold).toFixed(2)} گرم`} icon={Scale} color="text-orange-400" delay={0.3} />
        <GoldPriceWidget />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[#110E09] border border-[#C9A84C]/15 rounded-2xl p-5"
      >
        <p className="text-[#FAF7F0]/50 text-sm mb-4">خلاصه مالی</p>
        <div className="space-y-3">
          {[
            { label: 'درآمد فروش', val: s.totalSold, color: '#4ade80' },
            { label: 'هزینه خرید', val: s.totalBought, color: '#60a5fa' },
            { label: 'سود خالص', val: s.totalProfit, color: '#E8C96A' },
          ].map(item => {
            const max = Math.max(s.totalSold, s.totalBought, s.totalProfit, 1);
            const pct = (item.val / max) * 100;
            return (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#FAF7F0]/60">{item.label}</span>
                  <span style={{ color: item.color }}>{fmt(item.val)} ت</span>
                </div>
                <div className="h-2 bg-[#C9A84C]/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: item.color }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
