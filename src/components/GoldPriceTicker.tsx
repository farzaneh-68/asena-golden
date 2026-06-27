"use client";
import { useEffect, useState } from "react";
import { TrendingUp, RefreshCw } from "lucide-react";

interface GoldData {
  gold18: number;
  gold24: number;
  updatedAt: string;
  live: boolean;
}

function fmt(n: number) {
  return n.toLocaleString("fa-IR");
}

export default function GoldPriceTicker() {
  const [data, setData] = useState<GoldData | null>(null);
  const [loading, setLoading] = useState(true);
  const [prev18, setPrev18] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/gold", { cache: "no-store" });
      const json: GoldData = await res.json();
      setData(prev => {
        if (prev) setPrev18(prev.gold18);
        return json;
      });
      setFlash(true);
      setTimeout(() => setFlash(false), 800);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const t = setInterval(fetchData, 3 * 60 * 1000); // refresh every 3 min
    return () => clearInterval(t);
  }, []);

  const trend = prev18 && data ? data.gold18 > prev18 ? "up" : data.gold18 < prev18 ? "down" : "same" : "same";

  return (
    <div
      className="mx-4 my-3 rounded-2xl overflow-hidden relative"
      style={{ background: "linear-gradient(135deg, #0f0900 0%, #1e1400 50%, #0f0900 100%)", border: "1px solid rgba(201,168,76,0.35)" }}
    >
      {/* Animated shimmer top line */}
      <div className="ticker-shimmer-line" />

      <div className="flex items-center justify-between px-4 py-3">
        {/* Left: title */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "rgba(201,168,76,0.15)" }}>
            <TrendingUp size={14} color="#C9A84C" />
          </div>
          <div>
            <p className="font-bold" style={{ color: "#C9A84C", fontSize: "11px", letterSpacing: "0.5px" }}>
              نرخ لحظه‌ای طلا
            </p>
            {data && (
              <p style={{ color: "rgba(250,247,240,0.35)", fontSize: "9px" }}>
                {data.live ? "● زنده" : "● تقریبی"} — هر گرم
              </p>
            )}
          </div>
        </div>

        {/* Right: prices */}
        {loading ? (
          <div className="flex gap-3">
            <div className="skeleton-box w-20 h-8 rounded-lg" />
            <div className="skeleton-box w-20 h-8 rounded-lg" />
          </div>
        ) : data ? (
          <div className="flex gap-3">
            {/* 18k */}
            <div
              className="text-center px-3 py-1.5 rounded-xl transition-all duration-300"
              style={{
                background: flash ? "rgba(201,168,76,0.15)" : "rgba(201,168,76,0.07)",
                border: "1px solid rgba(201,168,76,0.2)",
              }}
            >
              <p style={{ color: "rgba(250,247,240,0.45)", fontSize: "8px" }}>طلا ۱۸ عیار</p>
              <p
                className="font-bold"
                style={{
                  fontSize: "12px",
                  color: trend === "up" ? "#6fcf6f" : trend === "down" ? "#cf6f6f" : "#C9A84C",
                }}
              >
                {fmt(data.gold18)}
              </p>
              <p style={{ color: "rgba(250,247,240,0.3)", fontSize: "8px" }}>تومان</p>
            </div>
            {/* 24k */}
            <div
              className="text-center px-3 py-1.5 rounded-xl"
              style={{ background: "rgba(201,168,76,0.07)", border: "1px solid rgba(201,168,76,0.2)" }}
            >
              <p style={{ color: "rgba(250,247,240,0.45)", fontSize: "8px" }}>طلا ۲۴ عیار</p>
              <p className="font-bold shimmer-text" style={{ fontSize: "12px" }}>
                {fmt(data.gold24)}
              </p>
              <p style={{ color: "rgba(250,247,240,0.3)", fontSize: "8px" }}>تومان</p>
            </div>
          </div>
        ) : null}

        {/* Refresh btn */}
        <button
          onClick={fetchData}
          className="w-7 h-7 rounded-lg flex items-center justify-center active:scale-90 transition-transform"
          style={{ background: "rgba(201,168,76,0.08)" }}
        >
          <RefreshCw size={12} color="rgba(201,168,76,0.6)" />
        </button>
      </div>
    </div>
  );
}
