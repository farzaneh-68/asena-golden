"use client";
import { useState } from "react";
import { Search, ShoppingBag, Menu, X } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();

  return (
    <>
      <header
        style={{ background: "rgba(13,11,8,0.97)", backdropFilter: "blur(14px)", borderBottom: "1px solid rgba(201,168,76,0.15)" }}
        className="fixed top-0 right-0 left-0 z-50 flex items-center justify-between px-4 py-3"
      >
        <button
          onClick={() => setMenuOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-full"
          style={{ background: "rgba(201,168,76,0.08)" }}
        >
          <Menu size={19} color="#C9A84C" />
        </button>

        <div className="flex flex-col items-center leading-tight">
          <span className="shimmer-text font-bold text-lg tracking-widest">ASENA</span>
          <span style={{ color: "rgba(201,168,76,0.5)", fontSize: "9px", letterSpacing: "4px" }}>GOLDEN</span>
        </div>

        <div className="flex items-center gap-2">
          <button className="w-9 h-9 flex items-center justify-center rounded-full" style={{ background: "rgba(201,168,76,0.08)" }}>
            <Search size={17} color="#C9A84C" />
          </button>
          <Link
            href="/cart"
            className="w-9 h-9 flex items-center justify-center rounded-full relative"
            style={{ background: "rgba(201,168,76,0.08)" }}
          >
            <ShoppingBag size={17} color="#C9A84C" />
            {count > 0 && (
              <span
                className="absolute -top-0.5 -left-0.5 w-4 h-4 rounded-full flex items-center justify-center font-bold"
                style={{ background: "#C9A84C", color: "#0D0D0D", fontSize: "9px" }}
              >
                {count}
              </span>
            )}
          </Link>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1" style={{ background: "rgba(0,0,0,0.6)" }} onClick={() => setMenuOpen(false)} />
          <div className="w-72 flex flex-col py-8 px-6" style={{ background: "#161616", borderLeft: "1px solid rgba(201,168,76,0.2)" }}>
            <div className="flex items-center justify-between mb-8">
              <span className="shimmer-text text-xl font-bold tracking-widest">ASENA GOLDEN</span>
              <button onClick={() => setMenuOpen(false)}>
                <X size={20} color="#C9A84C" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {[
                ["🏠", "صفحه اصلی", "/"],
                ["🛍️", "سبد خرید", "/cart"],
                ["🏺", "قلک طلا", "/qolk"],
                ["🎀", "ست‌های طلا", "/"],
                ["📞", "تماس با ما", "/"],
              ].map(([icon, label, href]) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-3 rounded-xl text-right transition-all"
                  style={{ color: "#FAF7F0" }}
                >
                  <span>{icon}</span>
                  <span style={{ fontSize: "15px" }}>{label}</span>
                </Link>
              ))}
            </nav>
            <div className="mt-auto pt-6" style={{ borderTop: "1px solid rgba(201,168,76,0.15)" }}>
              <p style={{ color: "rgba(201,168,76,0.5)", fontSize: "12px" }} className="text-center">
                ✦ ضمانت اصالت کالا ✦ ارسال رایگان
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
