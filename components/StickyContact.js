"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { companyInfo } from "@/lib/data";

const WHATSAPP_TEXT = encodeURIComponent(
  "Bună ziua, vă scriu de pe site-ul GranitNord Elit CV. Aș dori mai multe informații."
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
      <path d="M11.4 0C9.473.028 5.333.344 3.02 2.467 1.302 4.187.696 6.7.633 9.817.57 12.933.488 18.776 6.12 20.36h.003l-.004 2.416s-.037.977.61 1.177c.777.242 1.234-.5 1.98-1.302.407-.44.972-1.084 1.397-1.58 3.85.326 6.812-.416 7.15-.525.776-.252 5.176-.816 5.892-6.657.74-6.02-.36-9.83-2.34-11.546C20.262 1.75 17.852 0 12.483-.023c0 0-.395-.025-1.037-.017zm.058 1.693c.545-.004.88.017.88.017 4.542.02 6.717 1.388 7.222 1.846 1.675 1.435 2.53 4.868 1.906 9.897v.002c-.604 4.878-4.174 5.184-4.832 5.395-.28.09-2.882.737-6.153.524 0 0-2.436 2.94-3.197 3.704-.12.12-.26.167-.352.144-.13-.033-.166-.188-.165-.414l.02-4.018c-4.762-1.32-4.485-6.292-4.43-8.895.054-2.604.543-4.738 1.996-6.173 1.96-1.773 5.474-2.018 7.11-2.03zm.38 2.602c-.167 0-.303.135-.304.302 0 .167.133.303.3.305 1.624.01 2.946.537 4.028 1.592 1.073 1.046 1.62 2.468 1.633 4.334.002.167.14.3.307.3.166-.002.3-.138.3-.304-.014-1.984-.618-3.596-1.816-4.764-1.19-1.16-2.692-1.753-4.447-1.765zm-3.96.695c-.19-.032-.4.005-.616.117l-.01.002c-.43.247-.816.562-1.146.932-.002.004-.006.004-.008.008-.267.323-.42.638-.46.948-.008.046-.01.093-.007.14 0 .136.022.27.065.4l.013.01c.135.48.473 1.276 1.205 2.604.42.768.903 1.5 1.446 2.186.27.344.56.673.87.984l.132.132c.31.308.64.6.984.87.686.543 1.418 1.027 2.186 1.447 1.328.733 2.126 1.07 2.604 1.206l.01.014c.13.042.265.064.402.063.046.002.092 0 .138-.008.31-.036.627-.19.948-.46.004 0 .003-.002.008-.005.37-.33.683-.72.93-1.148l.003-.01c.225-.432.15-.842-.18-1.12-.004 0-.698-.58-1.037-.83-.36-.255-.73-.492-1.113-.71-.51-.285-1.032-.106-1.248.174l-.447.564c-.23.283-.657.246-.657.246-3.12-.796-3.955-3.955-3.955-3.955s-.037-.426.248-.656l.563-.448c.277-.215.456-.737.17-1.248-.217-.383-.454-.756-.71-1.115-.25-.34-.826-1.033-.83-1.035-.137-.165-.31-.265-.502-.297zm4.49.88c-.158.002-.29.124-.3.282-.01.167.115.312.282.324 1.16.085 2.017.466 2.645 1.15.63.688.93 1.524.906 2.57-.002.168.13.306.3.31.166.003.305-.13.31-.297.025-1.175-.334-2.193-1.067-2.994-.74-.81-1.777-1.253-3.05-1.346h-.024zm.463 1.63c-.16.002-.29.127-.3.287-.008.167.12.31.288.32.523.028.875.175 1.113.422.24.245.388.62.416 1.164.01.167.15.295.318.287.167-.008.295-.15.287-.317-.03-.644-.215-1.178-.58-1.557-.367-.378-.893-.574-1.52-.607h-.018z"/>
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

function ChatIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
  );
}

export default function StickyContact() {
  const pathname = usePathname();
  const [shown, setShown] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => setShown(true), 800);
    return () => clearTimeout(t);
  }, []);

  // Close panel when route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    function onClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    function onEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  if (pathname?.startsWith("/admin")) return null;

  const waHref = `https://wa.me/${companyInfo.whatsapp}?text=${WHATSAPP_TEXT}`;
  const viberHref = `viber://chat?number=${companyInfo.phoneIntl}`;
  const telHref = `tel:${companyInfo.phoneIntl}`;

  const options = [
    {
      label: "Telefon",
      sublabel: companyInfo.phone,
      href: telHref,
      bg: "bg-stone-900 hover:bg-stone-800",
      icon: <PhoneIcon className="h-5 w-5 text-gold-400" />,
      external: false,
    },
    {
      label: "WhatsApp",
      sublabel: "Răspuns rapid",
      href: waHref,
      bg: "bg-[#25D366] hover:bg-[#1ebe5c]",
      icon: <WhatsAppIcon className="h-5 w-5 text-white" />,
      external: true,
    },
    {
      label: "Viber",
      sublabel: "Mesaj direct",
      href: viberHref,
      bg: "bg-[#7360F2] hover:bg-[#5d4dcf]",
      icon: <ViberIcon className="h-5 w-5 text-white" />,
      external: false,
    },
  ];

  return (
    <>
      {/* Desktop: collapsible "Contactați-ne" panel */}
      <div
        ref={ref}
        className={`fixed bottom-6 right-6 z-40 hidden md:block ${
          shown ? "opacity-100" : "pointer-events-none opacity-0"
        } transition-opacity`}
      >
        {/* Expanded panel */}
        <div
          className={`mb-3 origin-bottom-right overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 transition-all ${
            open
              ? "scale-100 opacity-100 translate-y-0"
              : "pointer-events-none scale-95 opacity-0 translate-y-2"
          }`}
        >
          <div className="border-b border-stone-100 bg-stone-950 px-5 py-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold-400">
              Contactați-ne
            </p>
            <p className="mt-0.5 text-sm text-stone-300">
              Disponibili 24/7
            </p>
          </div>
          <div className="flex flex-col p-2">
            {options.map((opt) => (
              <a
                key={opt.label}
                href={opt.href}
                target={opt.external ? "_blank" : undefined}
                rel={opt.external ? "noopener noreferrer" : undefined}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left text-white transition ${opt.bg}`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/15">
                  {opt.icon}
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-sm font-semibold">{opt.label}</span>
                  <span className="text-xs text-white/80">{opt.sublabel}</span>
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Toggle button */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label={open ? "Închideți" : "Contactați-ne"}
          className="ml-auto flex items-center gap-2 rounded-full bg-gold-500 px-5 py-3 text-sm font-semibold text-white shadow-lg ring-1 ring-black/5 transition hover:bg-gold-600"
        >
          {open ? (
            <svg className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <ChatIcon className="h-5 w-5" />
          )}
          <span>{open ? "Închide" : "Contactați-ne"}</span>
        </button>
      </div>

      {/* Mobile sticky bottom bar */}
      <div
        className={`fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-stone-200 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.08)] md:hidden ${
          shown ? "translate-y-0" : "translate-y-full"
        } transition-transform duration-300`}
      >
        <a
          href={telHref}
          aria-label="Telefon"
          className="flex flex-col items-center justify-center gap-0.5 py-2.5 text-xs font-semibold text-stone-800 active:bg-stone-50"
        >
          <PhoneIcon className="h-5 w-5 text-gold-500" />
          Telefon
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
      <div className="h-16 md:hidden" aria-hidden="true" />
    </>
  );
}
