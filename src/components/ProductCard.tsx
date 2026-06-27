"use client";
import { useState } from "react";
import { Heart, ShoppingBag, Star, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";

function fmt(n: number) {
  return n.toLocaleString("fa-IR") + " تومان";
}

export default function ProductCard({ product }: { product: Product }) {
  const { add } = useCart();
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [imgError, setImgError] = useState(false);

  const handleAdd = () => {
    add(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  const hasMultiple = product.images.length > 1;

  return (
    <div
      className="relative rounded-2xl overflow-hidden flex flex-col product-card-anim"
      style={{ background: "#161616", border: "1px solid rgba(201,168,76,0.12)" }}
    >
      {/* Image area */}
      <div className="relative overflow-hidden" style={{ height: "170px" }}>
        {!imgError ? (
          <img
            src={product.images[imgIdx]}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ objectPosition: "center top" }}
            onError={() => setImgError(true)}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: "radial-gradient(ellipse at center, rgba(201,168,76,0.08) 0%, transparent 70%)" }}
          >
            <span style={{ fontSize: "60px" }}>💍</span>
          </div>
        )}

        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(22,22,22,0.7) 0%, transparent 50%)" }}
        />

        {hasMultiple && !imgError && (
          <>
            <button
              onClick={e => { e.stopPropagation(); setImgIdx(i => (i + 1) % product.images.length); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: "rgba(13,13,13,0.7)" }}
            >
              <ChevronLeft size={12} color="#C9A84C" />
            </button>
            <button
              onClick={e => { e.stopPropagation(); setImgIdx(i => (i - 1 + product.images.length) % product.images.length); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: "rgba(13,13,13,0.7)" }}
            >
              <ChevronRight size={12} color="#C9A84C" />
            </button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
              {product.images.map((_, i) => (
                <div key={i} className="rounded-full transition-all"
                  style={{ width: i === imgIdx ? "14px" : "5px", height: "5px", background: i === imgIdx ? "#C9A84C" : "rgba(201,168,76,0.4)" }} />
              ))}
            </div>
          </>
        )}

        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {discount && (
            <span className="font-bold px-2 py-0.5 rounded-full" style={{ background: "#C9A84C", color: "#0D0D0D", fontSize: "9px" }}>
              {discount}٪
            </span>
          )}
          {product.isNew && (
            <span className="font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(201,168,76,0.15)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.3)", fontSize: "9px" }}>
              جدید
            </span>
          )}
        </div>

        {product.inStock <= 3 && (
          <div className="absolute bottom-2 right-2">
            <span className="px-2 py-0.5 rounded-full" style={{ background: "rgba(207,111,111,0.15)", color: "#cf6f6f", border: "1px solid rgba(207,111,111,0.3)", fontSize: "9px" }}>
              فقط {product.inStock} عدد
            </span>
          </div>
        )}

        <button
          onClick={() => setLiked(l => !l)}
          className="absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center active:scale-90 transition-transform"
          style={{ background: "rgba(13,13,13,0.7)", backdropFilter: "blur(4px)" }}
        >
          <Heart size={13} fill={liked ? "#C9A84C" : "none"} color={liked ? "#C9A84C" : "rgba(201,168,76,0.6)"} />
        </button>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-full" style={{ background: "rgba(201,168,76,0.1)", color: "#C9A84C", fontSize: "9px" }}>
            {product.karat}
          </span>
          <span className="px-2 py-0.5 rounded-full" style={{ background: "rgba(201,168,76,0.06)", color: "rgba(250,247,240,0.45)", fontSize: "9px" }}>
            {product.weight}
          </span>
        </div>

        <p className="font-semibold leading-5 line-clamp-2" style={{ color: "#FAF7F0", fontSize: "12px" }}>
          {product.name}
        </p>

        <div className="flex items-center gap-1">
          <Star size={10} fill="#C9A84C" color="#C9A84C" />
          <span style={{ fontSize: "10px", color: "#C9A84C", fontWeight: 600 }}>{product.rating}</span>
          <span style={{ fontSize: "10px", color: "rgba(250,247,240,0.3)" }}>({product.reviews})</span>
        </div>

        <div className="mt-auto">
          {product.originalPrice && (
            <p className="line-through" style={{ color: "rgba(250,247,240,0.28)", fontSize: "10px" }}>
              {fmt(product.originalPrice)}
            </p>
          )}
          <p className="font-bold shimmer-text" style={{ fontSize: "12px" }}>{fmt(product.price)}</p>
        </div>

        <button
          onClick={handleAdd}
          className="w-full py-2 rounded-xl flex items-center justify-center gap-1.5 font-bold transition-all active:scale-95"
          style={
            added
              ? { background: "rgba(111,207,111,0.12)", color: "#6fcf6f", border: "1px solid #6fcf6f", fontSize: "11px" }
              : { background: "linear-gradient(135deg, #A07830, #C9A84C)", color: "#0D0D0D", fontSize: "11px" }
          }
        >
          <ShoppingBag size={12} />
          {added ? "✓ افزوده شد" : "افزودن به سبد"}
        </button>
      </div>
    </div>
  );
}
