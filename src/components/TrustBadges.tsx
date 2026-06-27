const badges = [
  { icon: "🛡️", title: "ضمانت اصالت", sub: "طلای استاندارد" },
  { icon: "🚚", title: "ارسال رایگان", sub: "بالای ۵ میلیون" },
  { icon: "↩️", title: "بازگشت ۷ روزه", sub: "بدون قید" },
  { icon: "🔒", title: "پرداخت امن", sub: "درگاه معتبر" },
];

export default function TrustBadges() {
  return (
    <section
      className="mx-4 my-4 rounded-2xl p-4"
      style={{ background: "#161616", border: "1px solid rgba(201,168,76,0.1)" }}
    >
      <div className="grid grid-cols-4 gap-2">
        {badges.map((b) => (
          <div key={b.title} className="flex flex-col items-center text-center gap-1.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
              style={{ background: "rgba(201,168,76,0.08)" }}
            >
              {b.icon}
            </div>
            <p className="font-semibold leading-tight" style={{ color: "#C9A84C", fontSize: "10px" }}>
              {b.title}
            </p>
            <p style={{ color: "rgba(250,247,240,0.4)", fontSize: "9px" }}>{b.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
