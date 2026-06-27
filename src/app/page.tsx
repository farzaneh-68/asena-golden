import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategoryBar from "@/components/CategoryBar";
import ProductCard from "@/components/ProductCard";
import SpecialOffer from "@/components/SpecialOffer";
import TrustBadges from "@/components/TrustBadges";
import SectionHeader from "@/components/SectionHeader";
import BottomNav from "@/components/BottomNav";
import GoldPriceTicker from "@/components/GoldPriceTicker";
import { products } from "@/data/products";

function Divider() {
  return (
    <div
      className="mx-4 my-2"
      style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(201,168,76,0.2), transparent)" }}
    />
  );
}

export default function Home() {
  return (
    <main style={{ background: "#0D0B08", minHeight: "100dvh", paddingBottom: "90px" }}>
      <Navbar />

      {/* Hero */}
      <Hero />

      {/* Live gold price */}
      <GoldPriceTicker />

      {/* Trust */}
      <TrustBadges />

      <Divider />

      {/* Categories */}
      <CategoryBar />

      {/* Special offer */}
      <SpecialOffer />

      <Divider />

      {/* Products */}
      <section className="mt-5">
        <SectionHeader title="محصولات آسنا گلدن" sub="طلای ۱۸ عیار — ضمانت اصالت" cta="مشاهده همه" />
        <div className="grid grid-cols-2 gap-3 px-4">
          {products.map((p, i) => (
            <div key={p.id} style={{ animationDelay: `${i * 0.1}s` }}>
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      </section>

      <Divider />

      {/* Qolk banner */}
      <section className="mx-4 my-5 rounded-2xl overflow-hidden relative">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, #0f0700 0%, #1e1100 40%, #2a1800 100%)" }}
        />
        <div
          className="absolute inset-0 rounded-2xl"
          style={{ border: "1px solid rgba(201,168,76,0.3)" }}
        />
        <div className="relative z-10 p-5 flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 qolk-pulse"
            style={{ background: "linear-gradient(135deg, #A07830, #C9A84C)", fontSize: "28px" }}
          >
            🏺
          </div>
          <div className="flex-1">
            <p className="font-bold text-base shimmer-text mb-1">قلک طلا</p>
            <p className="text-xs mb-2" style={{ color: "rgba(250,247,240,0.5)" }}>
              ماهانه پس‌انداز کن، رویات رو بخر
            </p>
            <a
              href="/qolk"
              className="inline-block px-4 py-1.5 rounded-full text-xs font-bold gold-gradient"
              style={{ color: "#0D0D0D" }}
            >
              شروع کن 🪙
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="mx-4 mt-4 mb-2 rounded-2xl p-5"
        style={{ background: "#161616", border: "1px solid rgba(201,168,76,0.1)" }}
      >
        <div className="text-center mb-4">
          <p className="shimmer-text text-xl font-bold tracking-widest mb-0.5">ASENA GOLDEN</p>
          <p className="text-xs" style={{ color: "rgba(250,247,240,0.3)" }}>طلا و جواهر لاکچری</p>
        </div>
        <div
          className="pt-4 flex flex-col gap-1 text-center"
          style={{ borderTop: "1px solid rgba(201,168,76,0.1)" }}
        >
          <p className="text-xs" style={{ color: "rgba(250,247,240,0.4)" }}>📞 ۰۲۱-۱۲۳۴۵۶۷۸</p>
          <p className="text-xs" style={{ color: "rgba(250,247,240,0.4)" }}>📧 info@asenagolden.ir</p>
          <p className="text-xs mt-2" style={{ color: "rgba(250,247,240,0.18)" }}>
            © ۱۴۰۳ آسنا گلدن — تمامی حقوق محفوظ است
          </p>
        </div>
      </footer>

      <BottomNav />
    </main>
  );
}
