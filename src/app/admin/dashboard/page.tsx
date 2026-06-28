'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Scale, Receipt, DollarSign, RefreshCw } from 'lucide-react';
import { getStats, fmt } from '@/lib/db';
import { todayJalali } from '@/lib/date';

type Stats = {
  totalBought: number; totalSold: number; totalProfit: number;
  totalGoldBought: number; totalGoldSold: number; salesCount: number;
};

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
});

function StatCard({ label, value, sub, icon: Icon, accent, delay }: {
  label: string; value: string; sub?: string;
  icon: React.ElementType; accent: string; delay: number;
}) {
  return (
    <motion.div {...fadeUp(delay)}
      className="bg-[#110E09] border border-[#C9A84C]/12 rounded-2xl p-3 md:p-4 relative overflow-hidden group hover:border-[#C9A84C]/30 transition-colors min-h-[100px] flex flex-col justify-between">
      <div className="absolute -top-6 -left-6 w-20 h-20 rounded-full blur-2xl opacity-20 transition-opacity group-hover:opacity-40"
        style={{ background: accent }} />
      <div className="flex items-center justify-between mb-2">
        <p className="text-[#FAF7F0]/40 text-[11px] leading-tight">{label}</p>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: accent + '18' }}>
          <Icon size={15} style={{ color: accent }} />
        </div>
      </div>
      <div>
        <p className="text-[#E8C96A] font-bold text-base leading-tight break-all">{value}</p>
        {sub && <p className="text-[#FAF7F0]/30 text-[10px] mt-0.5">{sub}</p>}
      </div>
    </motion.div>
  );
}

function GoldPriceWidget() {
  const [price, setPrice] = useState<number | null>(null);
  const [change, setChange] = useState<number | null>(null);
  const [status, setStatus] = useState<'loading' | 'ok' | 'error'>('loading');
  const [lastUpdate, setLastUpdate] = useState('');

  const fetchPrice = async () => {
    setStatus('loading');

    // ۱. TGJU - no-cors mode to check availability
    try {
      const r = await fetch(
        'https://call.tgju.org/api/v1/market/indicator/summary-table-data/current?markets[]=geram18',
        { signal: AbortSignal.timeout(5000) }
      );
      if (r.ok) {
        const d = await r.json();
        const item = d?.current?.geram18;
        if (item?.p) {
          const raw = String(item.p).replace(/,/g, '');
          setPrice(Math.round(Number(raw) / 10));
          if (item.d) setChange(parseFloat(item.d));
          setStatus('ok');
          setLastUpdate(todayJalali());
          return;
        }
      }
    } catch { /* try next */ }

    // ۲. navasan
    try {
      const r = await fetch(
        'https://api.navasan.tech/latest/?item=geram18',
        { signal: AbortSignal.timeout(5000) }
      );
      if (r.ok) {
        const d = await r.json();
        const val = d?.geram18?.value;
        if (val) {
          setPrice(Math.round(Number(val) / 10));
          setStatus('ok');
          setLastUpdate(todayJalali());
          return;
        }
      }
    } catch { /* try next */ }

    // ۳. طلاچارت (no CORS restriction)
    try {
      const r = await fetch(
        'https://api.accesstrade.ir/gold/18k',
        { signal: AbortSignal.timeout(5000) }
      );
      if (r.ok) {
        const d = await r.json();
        const val = d?.price || d?.value || d?.data?.price;
        if (val) {
          setPrice(Math.round(Number(val) / 10));
          setStatus('ok');
          setLastUpdate(todayJalali());
          return;
        }
      }
    } catch { /* fail */ }

    setStatus('error');
  };

  useEffect(() => {
    fetchPrice();
    const t = setInterval(fetchPrice, 5 * 60 * 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <motion.div {...fadeUp(0.35)}
      className="bg-[#110E09] border border-[#C9A84C]/20 rounded-2xl p-4 col-span-2 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#C9A84C]/5 to-transparent pointer-events-none" />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#E8C96A] animate-pulse" />
          <span className="text-[#FAF7F0]/50 text-xs">قیمت لحظه‌ای طلا</span>
        </div>
        <button onClick={fetchPrice} className="text-[#C9A84C]/40 hover:text-[#C9A84C] transition-colors">
          <RefreshCw size={14} />
        </button>
      </div>

      {status === 'loading' && (
        <div className="skeleton-box h-9 w-52 rounded-xl" />
      )}
      {status === 'error' && (
        <div>
          <p className="text-[#FAF7F0]/30 text-xs mb-1.5">قیمت لحظه‌ای در دسترس نیست</p>
          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={fetchPrice} className="text-[#C9A84C] text-xs underline">تلاش مجدد</button>
            <a
              href="https://tgju.org/gold"
              target="_blank"
              rel="noreferrer"
              className="text-[#C9A84C]/60 text-xs border border-[#C9A84C]/20 px-2 py-0.5 rounded-lg hover:border-[#C9A84C]/50 transition-colors"
            >
              مشاهده قیمت در tgju.org
            </a>
          </div>
        </div>
      )}
      {status === 'ok' && price && (
        <div>
          <motion.p
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="shimmer-text text-2xl font-bold"
          >
            {fmt(price)} تومان
          </motion.p>
          <div className="flex items-center gap-3 mt-1.5">
            <p className="text-[#FAF7F0]/30 text-xs">هر گرم طلای ۱۸ عیار</p>
            {change !== null && (
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                change >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
              }`}>
                {change >= 0 ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
              </span>
            )}
          </div>
          {lastUpdate && <p className="text-[#FAF7F0]/20 text-xs mt-1">آخرین بروزرسانی: {lastUpdate}</p>}
        </div>
      )}
    </motion.div>
  );
}

function PageHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <motion.div {...fadeUp(0)} className="mb-6">
      <motion.h1
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="text-xl font-bold text-[#E8C96A]"
      >
        {title}
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-[#FAF7F0]/30 text-xs mt-1"
      >
        {subtitle}
      </motion.p>
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
        {[...Array(6)].map((_, i) => <div key={i} className="skeleton-box h-28 rounded-2xl" />)}
      </div>
    );
  }

  const s = stats!;

  return (
    <div>
      <PageHeader title="داشبورد" subtitle={`امروز — ${todayJalali()}`} />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
        <StatCard label="کل خرید"    value={`${fmt(s.totalBought)} ت`}  sub={`${s.totalGoldBought.toFixed(2)} گرم`} icon={TrendingDown} accent="#60a5fa" delay={0.05} />
        <StatCard label="کل فروش"    value={`${fmt(s.totalSold)} ت`}    sub={`${s.totalGoldSold.toFixed(2)} گرم`}  icon={TrendingUp}   accent="#4ade80" delay={0.1}  />
        <StatCard label="سود کل"     value={`${fmt(s.totalProfit)} ت`}                                             icon={DollarSign}   accent="#C9A84C" delay={0.15} />
        <StatCard label="فاکتورها"   value={`${s.salesCount} فاکتور`}                                             icon={Receipt}      accent="#a78bfa" delay={0.2}  />
        <StatCard label="موجودی"     value={`${(s.totalGoldBought - s.totalGoldSold).toFixed(2)} گرم`}            icon={Scale}        accent="#fb923c" delay={0.25} />
        <GoldPriceWidget />
      </div>

      {/* Bar chart */}
      <motion.div {...fadeUp(0.4)}
        className="bg-[#110E09] border border-[#C9A84C]/12 rounded-2xl p-5">
        <p className="text-[#FAF7F0]/40 text-sm mb-5">خلاصه مالی</p>
        <div className="space-y-4">
          {[
            { label: 'درآمد فروش',  val: s.totalSold,   color: '#4ade80' },
            { label: 'هزینه خرید',  val: s.totalBought, color: '#60a5fa' },
            { label: 'سود خالص',    val: s.totalProfit, color: '#E8C96A' },
          ].map((item, i) => {
            const max = Math.max(s.totalSold, s.totalBought, Math.abs(s.totalProfit), 1);
            const pct = Math.max(0, (item.val / max) * 100);
            return (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#FAF7F0]/50">{item.label}</span>
                  <span style={{ color: item.color }}>{fmt(item.val)} ت</span>
                </div>
                <div className="h-2 bg-[#C9A84C]/8 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.5 + i * 0.1, duration: 0.7, ease: 'easeOut' }}
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
