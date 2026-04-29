"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { companyInfo } from "@/lib/data";

const WHATSAPP_TEXT = encodeURIComponent(
  "Bună ziua, vă scriu de pe site-ul PrimNord Granit. Aș dori mai multe informații."
);

function WhatsAppIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function ViberIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.04 2C6.79 2 2.5 6.29 2.5 11.54c0 1.75.49 3.41 1.34 4.83L2.5 22l5.78-1.32c1.36.74 2.92 1.16 4.59 1.16h.01c5.24 0 9.54-4.29 9.54-9.54.01-2.55-.99-4.95-2.79-6.76A9.59 9.59 0 0012.04 2zm.01 1.83c2.05 0 3.97.79 5.42 2.24a7.654 7.654 0 012.25 5.43c0 4.23-3.45 7.66-7.67 7.66-1.5 0-2.95-.42-4.21-1.21l-.3-.18-3.13.82.84-3.05-.2-.31a7.66 7.66 0 01-1.18-4.05c.01-4.22 3.44-7.66 7.66-7.66h.01zM8.85 7.16c-.16 0-.41.06-.63.29-.21.23-.81.79-.81 1.92 0 1.13.83 2.22.94 2.38.12.16 1.6 2.55 3.92 3.48 1.93.77 2.32.62 2.74.58.42-.04 1.36-.55 1.55-1.09.19-.54.19-1 .14-1.09-.06-.1-.21-.16-.45-.27-.24-.12-1.36-.67-1.57-.74-.21-.08-.36-.12-.51.12-.16.23-.59.74-.72.89-.13.15-.26.16-.5.04-.24-.12-1.01-.37-1.93-1.19-.71-.63-1.19-1.41-1.33-1.65-.13-.24-.01-.36.1-.48.11-.11.24-.27.36-.41.12-.13.16-.23.24-.39.08-.16.04-.3-.02-.42-.06-.12-.5-1.27-.71-1.74-.18-.41-.36-.42-.5-.43-.13 0-.27 0-.41 0z"/>
    </svg>
  );
}

function PhoneIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

export default function StickyContact() {
  const pathname = usePathname();
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 800);
    return () => clearTimeout(t);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  const waHref = `https://wa.me/${companyInfo.whatsapp}?text=${WHATSAPP_TEXT}`;
  const viberHref = `viber://chat?number=${companyInfo.phoneIntl}`;
  const telHref = `tel:${companyInfo.phoneIntl}`;

  return (
    <>
      {/* Floating buttons — desktop */}
      <div
        className={`fixed bottom-6 right-6 z-40 hidden flex-col gap-3 transition-opacity md:flex ${
          shown ? "opacity-100" : "opacity-0"
        }`}
      >
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Scrieți pe WhatsApp"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all hover:scale-110 hover:bg-[#1ebe5c]"
        >
          <WhatsAppIcon className="h-7 w-7" />
        </a>
        <a
          href={viberHref}
          aria-label="Scrieți pe Viber"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[#7360F2] text-white shadow-lg transition-all hover:scale-110 hover:bg-[#5d4dcf]"
        >
          <ViberIcon className="h-7 w-7" />
        </a>
      </div>

      {/* Mobile sticky bottom bar */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-stone-200 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.08)] md:hidden ${
          shown ? "translate-y-0" : "translate-y-full"
        } transition-transform duration-300`}
      >
        <a
          href={telHref}
          aria-label="Sunați acum"
          className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-xs font-semibold text-stone-800 active:bg-stone-50"
        >
          <PhoneIcon className="h-5 w-5 text-gold-500" />
          Sunați
        </a>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="flex flex-col items-center justify-center gap-0.5 bg-[#25D366] py-2.5 text-xs font-semibold text-white active:bg-[#1ebe5c]"
        >
          <WhatsAppIcon className="h-5 w-5" />
          WhatsApp
        </a>
        <a
          href={viberHref}
          aria-label="Viber"
          className="flex flex-col items-center justify-center gap-0.5 bg-[#7360F2] py-2.5 text-xs font-semibold text-white active:bg-[#5d4dcf]"
        >
          <ViberIcon className="h-5 w-5" />
          Viber
        </a>
      </div>

      {/* Spacer so mobile content isn't hidden by the bar */}
      <div className="h-14 md:hidden" aria-hidden="true" />
    </>
  );
}
