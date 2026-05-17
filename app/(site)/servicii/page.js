import Image from "next/image";
import Link from "next/link";
import { services, companyInfo } from "@/lib/data";
import { safeJsonLd } from "@/lib/jsonLd";
import { SITE_URL, SITE_NAME, ORG_PHONE } from "@/lib/site";

export const metadata = {
  title: "Servicii Funerare Complete Bălți — Organizare, Transport, Monumente",
  description:
    "Servicii funerare complete în Bălți și Moldova: organizare ceremonie, transport funerar local, monumente granit și marmură, disponibili 24/7. Sunați acum: 079 175 383.",
  keywords: ["servicii funerare Bălți", "pompe funebre Moldova", "organizare înmormântare", "transport funerar", "monumente granit"],
  alternates: { canonical: "/servicii" },
  openGraph: {
    title: "Servicii Funerare Complete Bălți | GranitNord Elit CV — 24/7",
    description:
      "Organizare ceremonie, transport funerar local, monumente granit și marmură în Bălți și toată Moldova. Disponibili 24/7 la 079 175 383.",
    url: "/servicii",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Servicii funerare GranitNord Elit CV" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Servicii Funerare Complete Bălți | GranitNord Elit CV",
    description: "Organizare ceremonie, transport funerar, monumente granit în Bălți și Moldova. 24/7.",
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
        areaServed: { "@type": "City", name: "Bălți" },
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
      {/* Page hero */}
      <section className="bg-stone-900 px-6 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-gold-400">
            Ce oferim
          </p>
          <h1 className="font-display text-4xl font-semibold text-white sm:text-5xl">
            Servicii Funerare
          </h1>
          <p className="mt-5 text-base leading-relaxed text-stone-400">
            Gestionăm fiecare detaliu cu grijă, astfel încât familia să poată
            fi prezentă în totalitate alături de cei dragi.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="bg-cream-50 px-6 py-20">
        <div className="mx-auto max-w-5xl space-y-8">
          {services.map((s, i) => (
            <div
              key={s.id}
              className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-stone-100"
            >
              <div className="grid md:grid-cols-2">
                {/* Content */}
                <div className={`p-8 ${i % 2 === 1 ? "md:order-2" : ""}`}>
                  <span className="text-xs font-semibold uppercase tracking-widest text-gold-500">
                    Serviciu 0{i + 1}
                  </span>
                  <h2 className="mt-2 font-display text-2xl font-semibold text-stone-900">
                    {s.title}
                  </h2>
                  <p className="mt-3 leading-relaxed text-stone-500">
                    {s.description}
                  </p>
                  <ul className="mt-6 space-y-2.5">
                    {s.includes.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-sm text-stone-700"
                      >
                        <CheckIcon />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Image panel */}
                <div
                  className={`relative min-h-48 sm:min-h-64 overflow-hidden ${i % 2 === 1 ? "md:order-1" : ""}`}
                >
                  <Image
                    src={s.image}
                    alt={s.imageAlt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-stone-900/30" />
                </div>
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
