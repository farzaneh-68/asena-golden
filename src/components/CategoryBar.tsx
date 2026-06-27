"use client";
import { useState } from "react";

const categories = [
  { id: "all", label: "همه", icon: "✦" },
  { id: "ring", label: "انگشتر", icon: "💍" },
  { id: "necklace", label: "گردنبند", icon: "📿" },
  { id: "bracelet", label: "دستبند", icon: "⌚" },
  { id: "earring", label: "گوشواره", icon: "👂" },
  { id: "set", label: "ست", icon: "✨" },
];

export default function CategoryBar({
  onSelect,
}: {
  onSelect?: (id: string) => void;
}) {
  const [active, setActive] = useState("all");

  const handleSelect = (id: string) => {
    setActive(id);
    onSelect?.(id);
  };

  return (
    <section className="px-4 py-5">
      <div
        className="flex gap-2 overflow-x-auto pb-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleSelect(cat.id)}
            className="flex-shrink-0 flex flex-col items-center gap-1.5 rounded-2xl px-4 py-2.5 transition-all duration-200 active:scale-95"
            style={
              active === cat.id
                ? {
                    background: "linear-gradient(135deg, #A07830, #C9A84C)",
                    color: "#0D0D0D",
                    boxShadow: "0 4px 15px rgba(201,168,76,0.3)",
                  }
                : {
                    background: "rgba(201,168,76,0.07)",
                    color: "rgba(250,247,240,0.7)",
                    border: "1px solid rgba(201,168,76,0.15)",
                  }
            }
          >
            <span style={{ fontSize: "20px" }}>{cat.icon}</span>
            <span style={{ fontSize: "11px", fontWeight: 500, whiteSpace: "nowrap" }}>
              {cat.label}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
