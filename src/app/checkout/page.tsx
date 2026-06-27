"use client";
import { useState } from "react";
import { ArrowRight, Phone, User, MapPin, MessageCircle, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

// شماره واتساپ فروشگاه — اینجا تغییر بدید
const WHATSAPP_NUMBER = "989120000000"; // مثال: 989121234567

function fmt(n: number) {
  return n.toLocaleString("fa-IR");
}

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", phone: "", address: "", note: "" });
  const [step, setStep] = useState<"form" | "success">("form");
  const [loading, setLoading] = useState(false);

  if (items.length === 0) {
    return (
      <div style={{ background: "#0D0B08", minHeight: "100dvh" }} className="flex flex-col items-center justify-center gap-4 px-6">
        <p style={{ color: "rgba(250,247,240,0.5)", fontSize: "14px" }}>سبد خرید خالی است</p>
        <Link href="/" className="gold-gradient px-6 py-3 rounded-full font-bold text-sm" style={{ color: "#0D0D0D" }}>
          رفتن به فروشگاه
        </Link>
      </div>
    );
  }

  const buildWhatsAppMessage = () => {
    const lines = [
      "سلام آسنا گلدن 🌟",
      "می‌خوام سفارش بدم:",
      "",
      ...items.map(({ product, qty }) =>
        `• ${product.name} (${product.karat}) × ${qty} — ${fmt(product.price * qty)} تومان`
      ),
      "",
      `━━━━━━━━━━━━━━`,
      `💰 جمع کل: ${fmt(total)} تومان`,
      `🚚 ارسال: رایگان`,
      `━━━━━━━━━━━━━━`,
      "",
      `👤 نام: ${form.name}`,
      `📞 موبایل: ${form.phone}`,
      `📍 آدرس: ${form.address}`,
      form.note ? `📝 توضیحات: ${form.note}` : "",
    ].filter(Boolean).join("\n");

    return encodeURIComponent(lines);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const msg = buildWhatsAppMessage();
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;

    setTimeout(() => {
      setLoading(false);
      setStep("success");
      window.open(url, "_blank");
      clear();
    }, 1000);
  };

  if (step === "success") {
    return (
      <div style={{ background: "#0D0B08", minHeight: "100dvh" }} className="flex flex-col items-center justify-center gap-5 px-6 text-center">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center pulse-gold"
          style={{ background: "linear-gradient(135deg, #A07830, #C9A84C)" }}
        >
          <CheckCircle size={40} color="#0D0D0D" />
        </div>
        <h2 className="text-2xl font-bold fade-in-up" style={{ color: "#FAF7F0" }}>
          سفارش ثبت شد! 🎉
        </h2>
        <p className="fade-in-up" style={{ color: "rgba(250,247,240,0.55)", fontSize: "13px", lineHeight: 1.8 }}>
          پیام شما به واتساپ آسنا گلدن فرستاده شد.
          <br />
          تیم ما در کوتاه‌ترین زمان ممکن پاسخ می‌دهد.
        </p>
        <div className="flex flex-col gap-2 w-full mt-2">
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold"
            style={{ background: "#25D366", color: "#fff", fontSize: "14px" }}
          >
            <MessageCircle size={18} />
            باز کردن واتساپ
          </a>
          <Link
            href="/"
            className="w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold"
            style={{ border: "1px solid rgba(201,168,76,0.3)", color: "#C9A84C", fontSize: "13px" }}
          >
            ادامه خرید
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#0D0B08", minHeight: "100dvh", paddingBottom: "120px" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-20 flex items-center gap-3 px-4 py-3"
        style={{ background: "rgba(13,11,8,0.97)", borderBottom: "1px solid rgba(201,168,76,0.15)", backdropFilter: "blur(14px)" }}
      >
        <Link href="/cart" className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(201,168,76,0.08)" }}>
          <ArrowRight size={18} color="#C9A84C" />
        </Link>
        <div>
          <h1 className="font-bold" style={{ color: "#FAF7F0", fontSize: "16px" }}>ثبت سفارش</h1>
          <p style={{ fontSize: "10px", color: "rgba(250,247,240,0.4)" }}>سفارش از طریق واتساپ</p>
        </div>
      </header>

      {/* Order summary */}
      <div className="mx-4 mt-4 mb-4 rounded-2xl p-4" style={{ background: "#161616", border: "1px solid rgba(201,168,76,0.12)" }}>
        <p className="font-bold mb-3" style={{ color: "#C9A84C", fontSize: "12px" }}>خلاصه سفارش:</p>
        {items.map(({ product, qty }) => (
          <div key={product.id} className="flex justify-between mb-2">
            <span style={{ fontSize: "11px", color: "rgba(250,247,240,0.7)" }}>
              {product.name} × {qty}
            </span>
            <span className="font-bold" style={{ fontSize: "11px", color: "#C9A84C" }}>
              {fmt(product.price * qty)} ت
            </span>
          </div>
        ))}
        <div className="flex justify-between pt-2 mt-2" style={{ borderTop: "1px solid rgba(201,168,76,0.1)" }}>
          <span className="font-bold" style={{ fontSize: "13px", color: "#FAF7F0" }}>جمع:</span>
          <span className="font-bold shimmer-text" style={{ fontSize: "14px" }}>{fmt(total)} تومان</span>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-4 flex flex-col gap-4">
        <p className="font-bold" style={{ color: "#FAF7F0", fontSize: "14px" }}>اطلاعات تحویل:</p>

        {[
          { icon: User, label: "نام و نام خانوادگی", key: "name", type: "text", placeholder: "مثال: زهرا احمدی", required: true },
          { icon: Phone, label: "شماره موبایل", key: "phone", type: "tel", placeholder: "مثال: ۰۹۱۲۱۲۳۴۵۶۷", required: true },
          { icon: MapPin, label: "آدرس کامل", key: "address", type: "text", placeholder: "شهر، خیابان، پلاک، واحد", required: true },
        ].map(({ icon: Icon, label, key, type, placeholder, required }) => (
          <div key={key}>
            <label className="flex items-center gap-1.5 mb-1.5" style={{ fontSize: "12px", color: "rgba(250,247,240,0.6)" }}>
              <Icon size={13} color="#C9A84C" />
              {label}
            </label>
            <input
              type={type}
              value={(form as any)[key]}
              onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
              required={required}
              placeholder={placeholder}
              className="w-full px-4 py-3 rounded-xl text-sm"
              style={{
                background: "rgba(201,168,76,0.04)",
                border: "1px solid rgba(201,168,76,0.2)",
                color: "#FAF7F0",
                outline: "none",
              }}
              dir="rtl"
            />
          </div>
        ))}

        <div>
          <label className="flex items-center gap-1.5 mb-1.5" style={{ fontSize: "12px", color: "rgba(250,247,240,0.6)" }}>
            توضیحات (اختیاری)
          </label>
          <textarea
            value={form.note}
            onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
            placeholder="هر توضیح خاصی درباره سفارش..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl text-sm resize-none"
            style={{
              background: "rgba(201,168,76,0.04)",
              border: "1px solid rgba(201,168,76,0.2)",
              color: "#FAF7F0",
              outline: "none",
            }}
            dir="rtl"
          />
        </div>

        {/* WhatsApp info */}
        <div className="rounded-2xl p-4 flex items-start gap-3" style={{ background: "rgba(37,211,102,0.07)", border: "1px solid rgba(37,211,102,0.2)" }}>
          <span style={{ fontSize: "20px" }}>📱</span>
          <p style={{ fontSize: "11px", color: "rgba(250,247,240,0.6)", lineHeight: 1.7 }}>
            پس از تایید، سفارش شما به‌صورت خودکار در واتساپ آماده می‌شه.
            فقط کافیه <strong style={{ color: "#25D366" }}>ارسال</strong> رو بزنید.
          </p>
        </div>

        {/* Submit fixed bottom */}
        <div className="fixed bottom-0 left-0 right-0 p-4" style={{ background: "rgba(13,11,8,0.97)", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-base transition-all active:scale-98"
            style={{ background: loading ? "rgba(201,168,76,0.3)" : "#25D366", color: "#fff" }}
          >
            <MessageCircle size={18} />
            {loading ? "در حال آماده‌سازی..." : "ثبت سفارش در واتساپ"}
          </button>
        </div>
      </form>
    </div>
  );
}
