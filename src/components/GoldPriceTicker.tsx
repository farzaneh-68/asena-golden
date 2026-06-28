"use client";
import { useEffect, useState } from "react";
import { TrendingUp, RefreshCw } from "lucide-react";

interface GoldData {
  gold18: number;
  gold24: number;
  live: boolean;
}

const FALLBACK: GoldData = { gold18: 4_850_000, gold24: 6_470_000, live: false };

function fmt(n: number) {
  return n.toLocaleString("fa-IR");
}

async function fetchGoldPrice(): Promise<GoldData> {
  try {
    // try our API route first (works on Liara/local)
    const res = await fetch("/api/gold", { cache: "no-store", signal: AbortSignal.timeout(4000) });
    if (res.ok) return await res.json();
  } catch {}

  try {
    // fallback: direct TGJU call (works if CORS allowed)
    const [r18, r24] = await Promise.all([
      fetch("https://api.tgju.org/v1/market/indicator/summary-table-data/geram18", { signal: AbortSignal.timeout(4000) }),
      fetch("https://api.tgju.org/v1/market/indicator/summary-table-data/price_gold_24k", { signal: AbortSignal.timeout(4000) }),
    ]);
    const [d18, d24] = await Promise.all([r18.json(), r24.json()]);
    const p18 = Math.round(parseInt(String(d18?.data?.[0]?.[1] ?? "0").replace(/,/g, ""), 10) / 10);
    const p24 = Math.round(parseInt(String(d24?.data?.[0]?.[1] ?? "0").replace(/,/g, ""), 10) / 10);
    if (p18 > 0) return { gold18: p18, gold24: p24, live: true };
  } catch {}

  return FALLBACK;
}

export default function GoldPriceTicker() {
  const [data, setData] = useState<GoldData | null>(null);
  const [prev18, setPrev18] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);

  const load = async () => {
    const d = await fetchGoldPrice();
    setData(prev => { if (prev) setPrev18(prev.gold18); return d; });
    setFlash(true);
    setTimeout(() => setFlash(false), 800);
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 3 * 60 * 1000);
    return () => clearInterval(t);
  }, []);

  const trend = prev18 && data
    ? data.gold18 > prev18 ? "up" : data.gold18 < prev18 ? "down" : "same"
    : "same";

  return (
    <div
      className="mx-4 my-3 rounded-2xl overflow-hidden relative"
      style={{ background: "linear-gradient(135deg, #0f0900 0%, #1e1400 50%, #0f0900 100%)", border: "1px solid rgba(201,168,76,0.35)" }}
    >
      <div className="ticker-shimmer-line" />
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(201,168,76,0.15)" }}>
            <TrendingUp size={14} color="#C9A84C" />
          </div>
          <div>
            <p className="font-bold" style={{ color: "#C9A84C", fontSize: "11px" }}>نرخ لحظه‌ای طلا</p>
            <p style={{ color: "rgba(250,247,240,0.35)", fontSize: "9px" }}>
              {data ? (data.live ? "● زنده" : "● تقریبی") : "در حال دریافت..."} — هر گرم
            </p>
          </div>
        </div>

        {data ? (
          <div className="flex gap-3">
            <div
              className="text-center px-3 py-1.5 rounded-xl transition-all duration-300"
              style={{ background: flash ? "rgba(201,168,76,0.15)" : "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.2)" }}
            >
              <p style={{ color: "rgba(250,247,240,0.45)", fontSize: "8px" }}>طلا ۱۸ عیار</p>
              <p className="font-bold" style={{ fontSize: "12px", color: trend === "up" ? "#6fcf6f" : trend === "down" ? "#cf6f6f" : "#C9A84C" }}>
                {fmt(data.gold18)}
              </p>
              <p style={{ color: "rgba(250,247,240,0.3)", fontSize: "8px" }}>تومان</p>
            </div>
            <div className="text-center px-3 py-1.5 rounded-xl" style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.2)" }}>
              <p style={{ color: "rgba(250,247,240,0.45)", fontSize: "8px" }}>طلا ۲۴ عیار</p>
              <p className="font-bold shimmer-text" style={{ fontSize: "12px" }}>{fmt(data.gold24)}</p>
              <p style={{ color: "rgba(250,247,240,0.3)", fontSize: "8px" }}>تومان</p>
            </div>
          </div>
        ) : (
          <div className="flex gap-3">
            <div className="skeleton-box w-20 h-12 rounded-xl" />
            <div className="skeleton-box w-20 h-12 rounded-xl" />
          </div>
        )}

        <button onClick={load} className="w-7 h-7 rounded-lg flex items-center justify-center active:scale-90" style={{ background: "rgba(201,168,76,0.08)" }}>
          <RefreshCw size={12} color="rgba(201,168,76,0.6)" />
        </button>
      </div>
    </div>
  );
}
