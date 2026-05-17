import Image from "next/image";
import Link from "next/link";
import { services, companyInfo } from "@/lib/data";
import { safeJsonLd } from "@/lib/jsonLd";
import { SITE_URL, SITE_NAME, ORG_PHONE } from "@/lib/site";

export const metadata = {
  title: "Servicii Funerare Complete Soroca — Organizare, Transport, Monumente",
  description:
    "Servicii funerare complete în Soroca și Moldova: organizare ceremonie, transport funerar local, monumente granit și marmură, disponibili 24/7. Sunați acum: 079 175 383.",
  keywords: ["servicii funerare Soroca", "pompe funebre Moldova", "organizare înmormântare", "transport funerar", "monumente granit"],
  alternates: { canonical: "/servicii" },
  openGraph: {
    title: "Servicii Funerare Complete Soroca | GranitNord Elit CV — 24/7",
    description:
      "Organizare ceremonie, transport funerar local, monumente granit și marmură în Soroca și toată Moldova. Disponibili 24/7 la 079 175 383.",
    url: "/servicii",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Servicii funerare GranitNord Elit CV" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Servicii Funerare Complete Soroca | GranitNord Elit CV",
    description: "Organizare ceremonie, transport funerar, monumente granit în Soroca și Moldova. 24/7.",
    images: ["/og-image.jpg"],
  },
};

function CheckIcon() {
  return (
    <svg
      className="mt-0.5 h-4 w-4 shrink-0 text-gold-500"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

const servicesJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Servicii Funerare GranitNord Elit CV",
  itemListElement: [
    {
      "@type": "ListItem", position: 1,
      item: {
        "@type": "Service",
        name: "Organizare Funerară",
        description: "Suport complet în organizarea ceremoniei funerare: consiliere 24/7, aranjamente florale, coordonare religioasă.",
        provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL, telephone: ORG_PHONE },
        areaServed: { "@type": "Country", name: "Republica Moldova" },
        url: `${SITE_URL}/servicii`,
      },
    },
    {
      "@type": "ListItem", position: 2,
      item: {
        "@type": "Service",
        name: "Transport Funerar Local",
        description: "Transport funerar cu vehicule specializate moderne, echipă profesionistă, disponibilitate 24/7.",
        provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL, telephone: ORG_PHONE },
        areaServed: { "@type": "City", name: "Soroca" },
        url: `${SITE_URL}/servicii`,
      },
    },
    {
      "@type": "ListItem", position: 3,
      item: {
        "@type": "Service",
        name: "Monumente și Cruci Funerare",
        description: "Confecționăm și montăm monumente funerare din granit și marmură, personalizate cu gravuri și inscripții.",
        provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL, telephone: ORG_PHONE },
        areaServed: { "@type": "Country", name: "Republica Moldova" },
        url: `${SITE_URL}/produse`,
      },
    },
  ],
};

export default function ServicesPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(servicesJsonLd) }} />
      {/* Services */}
      <section className="bg-cream-50 px-6 py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-gold-500">
            Ce oferim
          </p>
          <h1 className="font-display text-4xl font-semibold text-stone-900 sm:text-5xl">
            Servicii Funerare
          </h1>
          <p className="mt-5 text-base leading-relaxed text-stone-500">
            Gestionăm fiecare detaliu cu grijă, astfel încât familia să poată
            fi prezentă în totalitate alături de cei dragi.
          </p>
        </div>
        <div className="mx-auto max-w-5xl grid gap-6 sm:grid-cols-3">
          {services.map((s, i) => (
            <div
              key={s.id}
              className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-stone-100"
            >
              {/* Image */}
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={s.image}
                  alt={s.imageAlt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-stone-900/30" />
                <span className="absolute left-4 top-4 text-xs font-semibold uppercase tracking-widest text-white/70">
                  Serviciu 0{i + 1}
                </span>
              </div>

              {/* Content */}
              <div className="p-6">
                <h2 className="font-display text-xl font-semibold text-stone-900">
                  {s.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-stone-500">
                  {s.description}
                </p>
                <ul className="mt-4 space-y-2">
                  {s.includes.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-stone-700"
                    >
                      <CheckIcon />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-cream-200 px-6 py-16 text-center">
        <div className="mx-auto max-w-xl">
          <h2 className="font-display text-2xl font-semibold text-stone-900">
            Aveți nevoie de ajutor?
          </h2>
          <p className="mt-3 text-stone-500">
            Suntem disponibili 24/7. Nu ezitați să ne contactați — vom răspunde
            cât mai rapid posibil.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <a
              href={`tel:${companyInfo.phone}`}
              className="flex items-center gap-2 rounded bg-gold-500 px-6 py-3 text-sm font-medium text-white hover:bg-gold-600"
            >
              {companyInfo.phone}
            </a>
            <Link
              href="/contact"
              className="rounded border border-stone-400 px-6 py-3 text-sm text-stone-700 hover:border-stone-600"
            >
              Formular de contact
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
