"use client";
import { Home, Search, ShoppingBag, PiggyBank, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";

const items = [
  { id: "home",    href: "/",      icon: Home,        label: "خانه"    },
  { id: "search",  href: "/",      icon: Search,      label: "جستجو"   },
  { id: "cart",    href: "/cart",  icon: ShoppingBag, label: "سبد"     },
  { id: "qolk",    href: "/qolk",  icon: PiggyBank,   label: "قلک طلا", special: true },
  { id: "profile", href: "/",      icon: User,        label: "پروفایل" },
];

export default function BottomNav() {
  const pathname = usePathname();
  const { count } = useCart();

  return (
    <nav
      className="fixed bottom-0 right-0 left-0 z-50 flex items-center justify-around py-2 px-1"
      style={{
        background: "rgba(13,11,8,0.97)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(201,168,76,0.15)",
        paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom))",
      }}
    >
      {items.map(({ id, href, icon: Icon, label, special }) => {
        const active = id === "home"
          ? pathname === "/"
          : id === "search" || id === "profile"
          ? false
          : pathname === href;

        return (
          <Link
            key={id}
            href={href}
            className="flex flex-col items-center gap-0.5 py-1 rounded-xl transition-all duration-200 active:scale-90"
            style={{ minWidth: "52px" }}
          >
            {special ? (
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center -mt-4 relative"
                style={{
                  background: active ? "linear-gradient(135deg, #A07830, #C9A84C)" : "linear-gradient(135deg, #2a1800, #3d2200)",
                  border: "2px solid rgba(201,168,76,0.4)",
                  boxShadow: active ? "0 4px 20px rgba(201,168,76,0.4)" : "0 2px 10px rgba(201,168,76,0.15)",
                }}
              >
                <Icon size={20} color={active ? "#0D0D0D" : "#C9A84C"} strokeWidth={2} />
              </div>
            ) : (
              <div className="relative">
                {active ? (
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #A07830, #C9A84C)" }}>
                    <Icon size={18} color="#0D0D0D" strokeWidth={2.5} />
                  </div>
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center">
                    <Icon size={20} color="rgba(250,247,240,0.3)" />
                  </div>
                )}
                {/* Cart badge */}
                {id === "cart" && count > 0 && (
                  <span
                    className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center font-bold"
                    style={{ background: "#C9A84C", color: "#0D0D0D", fontSize: "9px" }}
                  >
                    {count}
                  </span>
                )}
              </div>
            )}
            <span style={{ fontSize: "9px", color: active ? "#C9A84C" : "rgba(250,247,240,0.3)", fontWeight: active ? 700 : 400 }}>
              {label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
