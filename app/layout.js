import { Lora, Inter } from "next/font/google";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "PrimNord Granit — Servicii Funerare",
  description:
    "Servicii funerare complete cu respect, grijă și profesionalism. Monumente funerare din granit și marmură.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro" className={`${lora.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col bg-cream-50 text-stone-900 antialiased">
        {children}
      </body>
    </html>
  );
}
