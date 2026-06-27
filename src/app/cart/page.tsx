"use client";
import { useCart } from "@/context/CartContext";
import { ArrowRight, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import Link from "next/link";

function fmt(n: number) {
  return n.toLocaleString("fa-IR");
}

export default function CartPage() {
  const { items, remove, update, total, clear } = useCart();

  if (items.length === 0) {
    return (
      <div style={{ background: "#0D0B08", minHeight: "100dvh" }} className="flex flex-col items-center justify-center gap-4 px-6">
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
          style={{ background: "rgba(201,168,76,0.08)", border: "1px solid rgba(201,168,76,0.2)" }}
        >
          🛒
        </div>
        <h2 className="text-xl font-bold" style={{ color: "#FAF7F0" }}>سبد خرید خالیه!</h2>
        <p style={{ color: "rgba(250,247,240,0.45)", fontSize: "13px" }} className="text-center">
          محصولات طلا رو ببین و به سبد اضافه کن
        </p>
        <Link
          href="/"
          className="gold-gradient px-8 py-3 rounded-full font-bold text-sm"
          style={{ color: "#0D0D0D" }}
        >
          رفتن به فروشگاه
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: "#0D0B08", minHeight: "100dvh", paddingBottom: "120px" }}>
      {/* Header */}
      <header
        className="sticky top-0 z-20 flex items-center justify-between px-4 py-3"
        style={{ background: "rgba(13,11,8,0.97)", borderBottom: "1px solid rgba(201,168,76,0.15)", backdropFilter: "blur(14px)" }}
      >
        <Link href="/" className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(201,168,76,0.08)" }}>
          <ArrowRight size={18} color="#C9A84C" />
        </Link>
        <div>
          <h1 className="font-bold text-center" style={{ color: "#FAF7F0", fontSize: "16px" }}>سبد خرید</h1>
          <p className="text-center" style={{ fontSize: "10px", color: "rgba(250,247,240,0.4)" }}>
            {items.length} محصول
          </p>
        </div>
        <button
          onClick={clear}
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: "rgba(207,111,111,0.1)" }}
        >
          <Trash2 size={16} color="#cf6f6f" />
        </button>
      </header>

      {/* Items */}
      <div className="px-4 pt-4 flex flex-col gap-3">
        {items.map(({ product, qty }) => (
          <div
            key={product.id}
            className="rounded-2xl overflow-hidden fade-in-up"
            style={{ background: "#161616", border: "1px solid rgba(201,168,76,0.12)" }}
          >
            <div className="flex gap-3 p-3">
              {/* Image */}
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={e => {
                    e.currentTarget.style.display = "none";
                    e.currentTarget.parentElement!.innerHTML = '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:28px;background:rgba(201,168,76,0.06)">💍</div>';
                  }}
                />
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col gap-1.5">
                <p className="font-semibold leading-5" style={{ fontSize: "12px", color: "#FAF7F0" }}>
                  {product.name}
                </p>
                <div className="flex gap-1.5">
                  <span className="px-2 py-0.5 rounded-full" style={{ background: "rgba(201,168,76,0.1)", color: "#C9A84C", fontSize: "9px" }}>
                    {product.karat}
                  </span>
                  <span className="px-2 py-0.5 rounded-full" style={{ background: "rgba(201,168,76,0.06)", color: "rgba(250,247,240,0.45)", fontSize: "9px" }}>
                    {product.weight}
                  </span>
                </div>
                <p className="font-bold shimmer-text" style={{ fontSize: "12px" }}>
                  {fmt(product.price)} تومان
                </p>

                {/* Qty controls */}
                <div className="flex items-center justify-between mt-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => update(product.id, qty - 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center active:scale-90 transition-transform"
                      style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}
                    >
                      <Minus size={12} color="#C9A84C" />
                    </button>
                    <span className="font-bold" style={{ color: "#FAF7F0", fontSize: "14px", minWidth: "20px", textAlign: "center" }}>
                      {qty}
                    </span>
                    <button
                      onClick={() => update(product.id, qty + 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center active:scale-90 transition-transform"
                      style={{ background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.2)" }}
                    >
                      <Plus size={12} color="#C9A84C" />
                    </button>
                  </div>
                  <button
                    onClick={() => remove(product.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center active:scale-90"
                    style={{ background: "rgba(207,111,111,0.1)" }}
                  >
                    <Trash2 size={12} color="#cf6f6f" />
                  </button>
                </div>
              </div>
            </div>

            {/* Subtotal */}
            <div
              className="px-3 py-2 flex justify-between items-center"
              style={{ borderTop: "1px solid rgba(201,168,76,0.08)" }}
            >
              <span style={{ fontSize: "10px", color: "rgba(250,247,240,0.4)" }}>جمع این محصول:</span>
              <span className="font-bold" style={{ fontSize: "11px", color: "#C9A84C" }}>
                {fmt(product.price * qty)} تومان
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mx-4 mt-4 rounded-2xl p-4" style={{ background: "#161616", border: "1px solid rgba(201,168,76,0.15)" }}>
        <div className="flex justify-between mb-2">
          <span style={{ fontSize: "12px", color: "rgba(250,247,240,0.5)" }}>جمع کل:</span>
          <span className="font-bold shimmer-text" style={{ fontSize: "14px" }}>{fmt(total)} تومان</span>
        </div>
        <div className="flex justify-between mb-3">
          <span style={{ fontSize: "11px", color: "rgba(250,247,240,0.4)" }}>هزینه ارسال:</span>
          <span className="font-bold" style={{ fontSize: "11px", color: "#6fcf6f" }}>رایگان ✓</span>
        </div>
        <div
          className="flex justify-between pt-3"
          style={{ borderTop: "1px solid rgba(201,168,76,0.1)" }}
        >
          <span className="font-bold" style={{ fontSize: "13px", color: "#FAF7F0" }}>مبلغ قابل پرداخت:</span>
          <span className="font-bold shimmer-text" style={{ fontSize: "15px" }}>{fmt(total)} تومان</span>
        </div>
      </div>

      {/* Trust */}
      <div className="mx-4 mt-3 flex gap-2">
        {["🛡️ ضمانت اصالت", "🚚 ارسال رایگان", "↩️ بازگشت ۷ روزه"].map(b => (
          <div key={b} className="flex-1 text-center py-2 rounded-xl" style={{ background: "rgba(201,168,76,0.06)", border: "1px solid rgba(201,168,76,0.1)" }}>
            <p style={{ fontSize: "9px", color: "rgba(250,247,240,0.5)" }}>{b}</p>
          </div>
        ))}
      </div>

      {/* Checkout button - fixed bottom */}
      <div className="fixed bottom-0 left-0 right-0 p-4" style={{ background: "rgba(13,11,8,0.97)", borderTop: "1px solid rgba(201,168,76,0.15)" }}>
        <Link
          href="/checkout"
          className="w-full py-4 rounded-2xl flex items-center justify-center gap-2 font-bold text-base gold-gradient active:scale-98 transition-transform"
          style={{ color: "#0D0D0D", display: "flex" }}
        >
          <ShoppingBag size={18} />
          ثبت سفارش — {fmt(total)} تومان
        </Link>
      </div>
    </div>
  );
}
