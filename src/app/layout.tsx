import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

export const metadata: Metadata = {
  title: "آسنا گلدن | طلا و جواهر لاکچری",
  description: "فروشگاه آنلاین طلا و جواهر آسنا گلدن — ست‌های طلای ۱۸ عیار با ضمانت اصالت",
  keywords: "طلا، جواهر، ست طلا، انگشتر طلا، گردنبند طلا، آسنا گلدن",
  openGraph: {
    title: "آسنا گلدن | طلا و جواهر لاکچری",
    description: "ست‌های طلای ۱۸ عیار با ضمانت اصالت",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0D0B08",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
