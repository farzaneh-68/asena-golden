import { NextResponse } from "next/server";

async function fetchTGJU(symbol: string) {
  const res = await fetch(
    `https://api.tgju.org/v1/market/indicator/summary-table-data/${symbol}`,
    { next: { revalidate: 180 }, signal: AbortSignal.timeout(5000) }
  );
  if (!res.ok) throw new Error("fetch failed");
  const json = await res.json();
  const row = json?.data?.[0];
  if (!row) throw new Error("no data");
  const raw = String(row[1] ?? row[0] ?? "").replace(/,/g, "");
  return parseInt(raw, 10);
}

function rialToToman(r: number) {
  return Math.round(r / 10);
}

export async function GET() {
  try {
    const [gold18Rial, gold24Rial] = await Promise.all([
      fetchTGJU("geram18"),
      fetchTGJU("price_gold_24k"),
    ]);

    return NextResponse.json({
      gold18: rialToToman(gold18Rial),
      gold24: rialToToman(gold24Rial),
      updatedAt: new Date().toISOString(),
      live: true,
    });
  } catch {
    // Fallback realistic demo prices (per gram, in Tomans)
    return NextResponse.json({
      gold18: 4_850_000,
      gold24: 6_470_000,
      updatedAt: new Date().toISOString(),
      live: false,
    });
  }
}
