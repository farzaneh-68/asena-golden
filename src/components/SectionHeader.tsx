export default function SectionHeader({
  title,
  sub,
  cta,
}: {
  title: string;
  sub?: string;
  cta?: string;
}) {
  return (
    <div className="flex items-end justify-between px-4 mb-4">
      <div>
        <h2 className="text-lg font-bold" style={{ color: "#FAF7F0" }}>
          {title}
        </h2>
        {sub && (
          <p className="text-xs mt-0.5" style={{ color: "rgba(250,247,240,0.4)" }}>
            {sub}
          </p>
        )}
      </div>
      {cta && (
        <button
          className="text-xs font-medium pb-0.5"
          style={{ color: "#C9A84C", borderBottom: "1px solid rgba(201,168,76,0.4)" }}
        >
          {cta}
        </button>
      )}
    </div>
  );
}
