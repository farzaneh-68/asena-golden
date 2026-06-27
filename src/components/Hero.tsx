"use client";
import { useState, useEffect } from "react";

const slides = [
  {
    tag: "کلکسیون جدید",
    title: ["زیبایی", "ناب طلا"],
    sub: "جواهراتی که داستان شما را روایت می‌کنند",
    cta: "مشاهده کلکسیون",
    img: "/products/p1.jpg",
    fallback: "🎀",
  },
  {
    tag: "پیشنهاد ویژه",
    title: ["تا ۳۰٪", "تخفیف"],
    sub: "روی منتخب جواهرات تابستانه",
    cta: "دیدن تخفیف‌ها",
    img: "/products/p3.jpg",
    fallback: "💛",
  },
  {
    tag: "جدیدترین طرح‌ها",
    title: ["طراحی", "اختصاصی"],
    sub: "ست‌های دست‌ساز با الهام از طبیعت",
    cta: "کشف کنید",
    img: "/products/p5.jpg",
    fallback: "✨",
  },
];

function SlideImage({ src, fallback, active }: { src: string; fallback: string; active: boolean }) {
  const [err, setErr] = useState(false);

  return err ? (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ fontSize: "80px" }}
    >
      <span className="float-anim">{fallback}</span>
    </div>
  ) : (
    <img
      src={src}
      alt=""
      className="w-full h-full object-cover transition-transform duration-700"
      style={{ transform: active ? "scale(1.05)" : "scale(1)", objectPosition: "center top" }}
      onError={() => setErr(true)}
    />
  );
}

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);

  useEffect(() => {
    const t = setInterval(() => {
      setPrev(current);
      setCurrent(c => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(t);
  }, [current]);

  const slide = slides[current];

  return (
    <section
      className="relative overflow-hidden"
      style={{ height: "440px", marginTop: "56px" }}
    >
      {/* Background image */}
      <div className="absolute inset-0">
        <SlideImage src={slide.img} fallback={slide.fallback} active={true} />
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to top, rgba(13,11,8,1) 0%, rgba(13,11,8,0.7) 40%, rgba(13,11,8,0.3) 100%)",
          }}
        />
        {/* Side vignette */}
        <div
          className="absolute inset-0"
          style={{ background: "radial-gradient(ellipse at center, transparent 40%, rgba(13,11,8,0.6) 100%)" }}
        />
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end px-5 pb-8">
        {/* Tag */}
        <div
          className="inline-flex self-start mb-3 px-3 py-1 rounded-full fade-in-up"
          style={{ background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.35)" }}
        >
          <span style={{ color: "#C9A84C", fontSize: "10px", letterSpacing: "1px" }}>✦ {slide.tag}</span>
        </div>

        {/* Title */}
        <h1 key={current} className="text-4xl font-bold leading-tight mb-2 fade-in-up">
          <span className="shimmer-text">{slide.title[0]}</span>
          <br />
          <span style={{ color: "#FAF7F0" }}>{slide.title[1]}</span>
        </h1>

        {/* Sub */}
        <p className="mb-5 fade-in-up" style={{ color: "rgba(250,247,240,0.6)", fontSize: "13px" }}>
          {slide.sub}
        </p>

        {/* CTA + dots */}
        <div className="flex items-center justify-between">
          <button
            className="gold-gradient px-6 py-3 rounded-full font-bold text-sm pulse-gold active:scale-95 transition-transform"
            style={{ color: "#0D0D0D" }}
          >
            {slide.cta}
          </button>

          <div className="flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: i === current ? "22px" : "6px",
                  height: "6px",
                  background: i === current ? "#C9A84C" : "rgba(201,168,76,0.3)",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: "3px", background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.5), transparent)" }}
      />
    </section>
  );
}
