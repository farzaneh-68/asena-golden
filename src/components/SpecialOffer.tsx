"use client";
import { useEffect, useState } from "react";
import { Timer } from "lucide-react";

function useCountdown(target: Date) {
  const [timeLeft, setTimeLeft] = useState({ h: 0, m: 0, s: 0 });

  useEffect(() => {
    const calc = () => {
      const diff = Math.max(0, target.getTime() - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft({ h, m, s });
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [target]);

  return timeLeft;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function SpecialOffer() {
  const target = new Date(Date.now() + 8 * 3600 * 1000); // 8 hours from now
  const { h, m, s } = useCountdown(target);

  return (
    <section className="mx-4 my-2 rounded-2xl overflow-hidden relative">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #1a0d00 0%, #2a1800 50%, #1a0d00 100%)",
        }}
      />
      {/* Gold border glow */}
      <div
        className="absolute inset-0 rounded-2xl"
        style={{ border: "1px solid rgba(201,168,76,0.35)" }}
      />

      <div className="relative z-10 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Timer size={16} color="#C9A84C" />
          <span className="text-xs font-bold tracking-wider" style={{ color: "#C9A84C" }}>
            پیشنهاد ویژه امروز
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold mb-1" style={{ color: "#FAF7F0" }}>
              ست طلای <span className="shimmer-text">رُزگلد</span>
            </h3>
            <p className="text-xs mb-3" style={{ color: "rgba(250,247,240,0.5)" }}>
              انگشتر + گردنبند + دستبند
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold shimmer-text">۱۲,۵۰۰,۰۰۰ تومان</span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-bold"
                style={{ background: "#C9A84C", color: "#0D0D0D" }}
              >
                ۳۵٪ تخفیف
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            {/* Countdown */}
            <div className="flex gap-1.5">
              {[pad(h), pad(m), pad(s)].map((val, i) => (
                <div key={i} className="flex items-center gap-1">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm"
                    style={{ background: "rgba(201,168,76,0.12)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.25)" }}
                  >
                    {val}
                  </div>
                  {i < 2 && <span style={{ color: "#C9A84C", fontSize: "12px" }}>:</span>}
                </div>
              ))}
            </div>
            <p className="text-xs" style={{ color: "rgba(250,247,240,0.4)" }}>
              ساعت : دقیقه : ثانیه
            </p>
            <button
              className="gold-gradient px-5 py-2 rounded-xl text-xs font-bold active:scale-95 transition-transform"
              style={{ color: "#0D0D0D" }}
            >
              خرید کن
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
