"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowRight, Target, TrendingUp, Gift, Coins, CheckCircle, ChevronDown } from "lucide-react";
import Link from "next/link";
import { products } from "@/data/products";

function fmt(n: number) {
  return Math.round(n).toLocaleString("fa-IR");
}

const GOLD_PER_GRAM = 4_850_000; // Toman per gram (18k)

const goals = [
  { id: 1, label: "ست طلای پاپیون", price: 4_850_000, emoji: "🎀", img: "/products/p1.jpg" },
  { id: 2, label: "ست قلب ظریف", price: 3_900_000, emoji: "💛", img: "/products/p3.jpg" },
  { id: 3, label: "ست سه‌قلب", price: 5_100_000, emoji: "✨", img: "/products/p5.jpg" },
  { id: 4, label: "هدف دلخواه", price: 0, emoji: "🎯", img: null },
];

function GoldCoin({ delay = 0, x = 50, size = 28 }: { delay?: number; x?: number; size?: number }) {
  return (
    <div
      className="coin-float absolute"
      style={{
        right: `${x}%`,
        bottom: "-20px",
        fontSize: `${size}px`,
        animationDelay: `${delay}s`,
        animationDuration: `${3 + Math.random() * 2}s`,
      }}
    >
      🪙
    </div>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(value);

  useEffect(() => {
    ref.current = value;
    let start = display;
    const duration = 600;
    const step = (value - start) / (duration / 16);
    let raf: number;
    const tick = () => {
      start += step;
      if ((step > 0 && start >= value) || (step < 0 && start <= value)) {
        setDisplay(value);
        return;
      }
      setDisplay(Math.round(start));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <span>{fmt(display)}</span>;
}

export default function QolkPage() {
  const [monthly, setMonthly] = useState(1_000_000);
  const [months, setMonths] = useState(6);
  const [selectedGoal, setSelectedGoal] = useState(goals[0]);
  const [customPrice, setCustomPrice] = useState(5_000_000);
  const [saved, setSaved] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);

  const goalPrice = selectedGoal.id === 4 ? customPrice : selectedGoal.price;
  const totalSavings = monthly * months;
  const progress = Math.min(100, Math.round((totalSavings / goalPrice) * 100));
  const grams = totalSavings / GOLD_PER_GRAM;
  const remaining = Math.max(0, goalPrice - totalSavings);
  const remainingMonths = remaining > 0 ? Math.ceil(remaining / monthly) : 0;

  const handleDeposit = () => {
    setSaved(s => s + 500_000);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div style={{ background: "#0D0B08", minHeight: "100dvh", paddingBottom: "100px" }}>
      {/* Header */}
      <header
        style={{ background: "rgba(13,11,8,0.97)", borderBottom: "1px solid rgba(201,168,76,0.15)" }}
        className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3"
      >
        <Link href="/" className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(201,168,76,0.1)" }}>
          <ArrowRight size={16} color="#C9A84C" />
        </Link>
        <div>
          <h1 className="font-bold shimmer-text" style={{ fontSize: "16px", letterSpacing: "0.5px" }}>
            قلک طلا 🪙
          </h1>
          <p style={{ fontSize: "10px", color: "rgba(250,247,240,0.4)" }}>پس‌انداز هوشمند برای خرید طلا</p>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden px-4 pt-8 pb-6 text-center">
        {/* Floating coins */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[15, 35, 55, 70, 85, 25, 60, 80].map((x, i) => (
            <GoldCoin key={i} x={x} delay={i * 0.4} size={20 + (i % 3) * 8} />
          ))}
        </div>

        <div
          className="inline-flex items-center gap-2 mb-4 px-3 py-1.5 rounded-full"
          style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.25)" }}
        >
          <span style={{ fontSize: "10px", color: "#C9A84C" }}>✦ پس‌انداز ماهانه = طلا واقعی ✦</span>
        </div>

        <div className="relative inline-block mb-3">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto qolk-pulse"
            style={{ background: "linear-gradient(135deg, #A07830, #C9A84C)", fontSize: "40px" }}
          >
            🏺
          </div>
          {saved > 0 && (
            <div
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "#C9A84C", color: "#0D0D0D" }}
            >
              {Math.floor(saved / 500_000)}
            </div>
          )}
        </div>

        <h2 className="text-2xl font-bold mb-1" style={{ color: "#FAF7F0" }}>
          طلا جمع کن، <span className="shimmer-text">آرزو بخر</span>
        </h2>
        <p style={{ fontSize: "12px", color: "rgba(250,247,240,0.45)" }}>
          هر ماه یه مقدار کنار بذار، بدون دردسر طلا بخر
        </p>

        {saved > 0 && (
          <div className="mt-3 fade-in-up">
            <p className="text-sm" style={{ color: "#C9A84C" }}>
              موجودی قلک شما: <strong>{fmt(saved)} تومان</strong>
            </p>
          </div>
        )}
      </section>

      {/* Goal Selector */}
      <section className="px-4 mb-4">
        <p className="text-sm font-bold mb-3" style={{ color: "#FAF7F0" }}>هدفت رو انتخاب کن:</p>
        <div className="grid grid-cols-2 gap-2">
          {goals.map(g => (
            <button
              key={g.id}
              onClick={() => setSelectedGoal(g)}
              className="relative rounded-2xl overflow-hidden transition-all active:scale-95 text-right"
              style={{
                background: selectedGoal.id === g.id ? "rgba(201,168,76,0.12)" : "#161616",
                border: selectedGoal.id === g.id ? "2px solid #C9A84C" : "1px solid rgba(201,168,76,0.12)",
                padding: "12px",
              }}
            >
              {g.img && (
                <div className="h-16 rounded-xl overflow-hidden mb-2">
                  <img src={g.img} alt={g.label} className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = "none")} />
                </div>
              )}
              {!g.img && (
                <div className="h-16 rounded-xl flex items-center justify-center mb-2" style={{ background: "rgba(201,168,76,0.06)", fontSize: "28px" }}>
                  {g.emoji}
                </div>
              )}
              <p className="font-semibold" style={{ fontSize: "11px", color: "#FAF7F0" }}>{g.label}</p>
              {g.price > 0 && (
                <p style={{ fontSize: "10px", color: "#C9A84C" }}>{fmt(g.price)} ت</p>
              )}
              {selectedGoal.id === g.id && (
                <div className="absolute top-2 left-2">
                  <CheckCircle size={14} color="#C9A84C" fill="rgba(201,168,76,0.2)" />
                </div>
              )}
            </button>
          ))}
        </div>

        {selectedGoal.id === 4 && (
          <div className="mt-3 fade-in-up">
            <p className="text-xs mb-1.5" style={{ color: "rgba(250,247,240,0.5)" }}>مبلغ هدف (تومان):</p>
            <input
              type="number"
              value={customPrice}
              onChange={e => setCustomPrice(Number(e.target.value))}
              className="w-full rounded-xl px-4 py-2.5 text-sm font-bold"
              style={{
                background: "rgba(201,168,76,0.06)",
                border: "1px solid rgba(201,168,76,0.2)",
                color: "#C9A84C",
                outline: "none",
              }}
            />
          </div>
        )}
      </section>

      {/* Calculator */}
      <section className="mx-4 mb-4 rounded-2xl p-4" style={{ background: "#161616", border: "1px solid rgba(201,168,76,0.12)" }}>
        <p className="text-sm font-bold mb-4 flex items-center gap-2" style={{ color: "#FAF7F0" }}>
          <span className="text-base">🧮</span> ماشین حساب قلک
        </p>

        {/* Monthly amount slider */}
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <label style={{ fontSize: "11px", color: "rgba(250,247,240,0.55)" }}>پس‌انداز ماهانه:</label>
            <span className="font-bold" style={{ fontSize: "11px", color: "#C9A84C" }}>
              {fmt(monthly)} تومان
            </span>
          </div>
          <input
            type="range"
            min={200000}
            max={10000000}
            step={100000}
            value={monthly}
            onChange={e => setMonthly(Number(e.target.value))}
            className="w-full gold-slider"
          />
          <div className="flex justify-between mt-1">
            <span style={{ fontSize: "9px", color: "rgba(250,247,240,0.3)" }}>۲۰۰ هزار</span>
            <span style={{ fontSize: "9px", color: "rgba(250,247,240,0.3)" }}>۱۰ میلیون</span>
          </div>
        </div>

        {/* Months slider */}
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <label style={{ fontSize: "11px", color: "rgba(250,247,240,0.55)" }}>مدت پس‌انداز:</label>
            <span className="font-bold" style={{ fontSize: "11px", color: "#C9A84C" }}>
              {months} ماه
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={24}
            step={1}
            value={months}
            onChange={e => setMonths(Number(e.target.value))}
            className="w-full gold-slider"
          />
          <div className="flex justify-between mt-1">
            <span style={{ fontSize: "9px", color: "rgba(250,247,240,0.3)" }}>۱ ماه</span>
            <span style={{ fontSize: "9px", color: "rgba(250,247,240,0.3)" }}>۲ سال</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex justify-between mb-1.5">
            <span style={{ fontSize: "11px", color: "rgba(250,247,240,0.5)" }}>پیشرفت به هدف</span>
            <span className="font-bold" style={{ fontSize: "11px", color: progress >= 100 ? "#6fcf6f" : "#C9A84C" }}>
              {progress}٪
            </span>
          </div>
          <div className="w-full rounded-full overflow-hidden" style={{ height: "8px", background: "rgba(201,168,76,0.1)" }}>
            <div
              className="h-full rounded-full transition-all duration-700 progress-shimmer"
              style={{
                width: `${Math.min(progress, 100)}%`,
                background: progress >= 100
                  ? "linear-gradient(90deg, #6fcf6f, #a8e6a8)"
                  : "linear-gradient(90deg, #A07830, #C9A84C, #E8C96A)",
              }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          <div className="text-center p-2 rounded-xl" style={{ background: "rgba(201,168,76,0.06)" }}>
            <p style={{ fontSize: "8px", color: "rgba(250,247,240,0.4)" }}>جمع کل</p>
            <p className="font-bold shimmer-text" style={{ fontSize: "11px" }}>
              <AnimatedNumber value={totalSavings} />
            </p>
            <p style={{ fontSize: "8px", color: "rgba(250,247,240,0.3)" }}>تومان</p>
          </div>
          <div className="text-center p-2 rounded-xl" style={{ background: "rgba(201,168,76,0.06)" }}>
            <p style={{ fontSize: "8px", color: "rgba(250,247,240,0.4)" }}>معادل طلا</p>
            <p className="font-bold" style={{ fontSize: "11px", color: "#C9A84C" }}>
              {grams.toFixed(1)}
            </p>
            <p style={{ fontSize: "8px", color: "rgba(250,247,240,0.3)" }}>گرم</p>
          </div>
          <div className="text-center p-2 rounded-xl" style={{ background: "rgba(201,168,76,0.06)" }}>
            <p style={{ fontSize: "8px", color: "rgba(250,247,240,0.4)" }}>باقی‌مانده</p>
            <p className="font-bold" style={{ fontSize: "11px", color: remaining > 0 ? "rgba(250,247,240,0.6)" : "#6fcf6f" }}>
              {remaining > 0 ? `${remainingMonths} ماه` : "✓ رسیدی!"}
            </p>
            <p style={{ fontSize: "8px", color: "rgba(250,247,240,0.3)" }}>{remaining > 0 ? "تا هدف" : "آفرین"}</p>
          </div>
        </div>

        {progress >= 100 && (
          <div
            className="mt-3 rounded-xl p-3 text-center fade-in-up"
            style={{ background: "rgba(111,207,111,0.1)", border: "1px solid rgba(111,207,111,0.3)" }}
          >
            <p className="font-bold" style={{ color: "#6fcf6f", fontSize: "12px" }}>
              🎉 تبریک! می‌تونی الان خریدت رو انجام بدی
            </p>
          </div>
        )}
      </section>

      {/* Deposit button */}
      <section className="px-4 mb-4">
        <button
          onClick={handleDeposit}
          className="w-full py-4 rounded-2xl font-bold text-base relative overflow-hidden active:scale-98 transition-all"
          style={{ background: "linear-gradient(135deg, #A07830, #C9A84C, #E8C96A)", color: "#0D0D0D" }}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            🪙 واریز ۵۰۰,۰۰۰ تومان به قلک
          </span>
        </button>

        {showSuccess && (
          <div className="mt-2 text-center fade-in-up">
            <p style={{ fontSize: "12px", color: "#6fcf6f" }}>✓ ۵۰۰ هزار تومان به قلک اضافه شد!</p>
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="mx-4 mb-4 rounded-2xl p-4" style={{ background: "#161616", border: "1px solid rgba(201,168,76,0.1)" }}>
        <p className="font-bold mb-3 text-sm" style={{ color: "#FAF7F0" }}>چطور کار می‌کنه؟ 💡</p>
        {[
          ["۱", "هدف خریدت رو انتخاب کن", "انگشتر، گردنبند یا هر طلایی"],
          ["۲", "ماهانه پس‌انداز کن", "هر مقدار که بتونی، کم باشه هم عیب نداره"],
          ["۳", "موقع رسیدن، خرید کن", "ما قیمت رو برات نگه می‌داریم"],
        ].map(([num, title, desc]) => (
          <div key={num} className="flex gap-3 mb-3 last:mb-0">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 font-bold"
              style={{ background: "linear-gradient(135deg, #A07830, #C9A84C)", color: "#0D0D0D", fontSize: "12px" }}
            >
              {num}
            </div>
            <div>
              <p className="font-semibold" style={{ fontSize: "12px", color: "#FAF7F0" }}>{title}</p>
              <p style={{ fontSize: "10px", color: "rgba(250,247,240,0.4)" }}>{desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Back to shop */}
      <div className="px-4">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl font-bold text-sm active:scale-95 transition-transform"
          style={{ border: "1px solid rgba(201,168,76,0.3)", color: "#C9A84C" }}
        >
          <ArrowRight size={16} />
          برگشت به فروشگاه
        </Link>
      </div>
    </div>
  );
}
