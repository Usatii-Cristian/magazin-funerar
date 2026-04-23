import { companyInfo } from "@/lib/data";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact — PrimNord Granit",
  description:
    "Contactați PrimNord Granit. Suntem disponibili 24/7 pentru orice nevoie urgentă.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-stone-900 px-6 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-gold-400">
            Suntem disponibili
          </p>
          <h1 className="font-display text-4xl font-semibold text-white sm:text-5xl">
            Luați legătura cu noi
          </h1>
          <p className="mt-5 text-base leading-relaxed text-stone-400">
            Suntem alături de dumneavoastră 24 de ore din 24, 7 zile din 7.
            Nu ezitați să ne contactați.
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="bg-cream-50 px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact info */}
            <div>
              <h2 className="mb-8 font-display text-2xl font-semibold text-stone-900">
                Informații de contact
              </h2>

              <div className="space-y-6">
                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-gold-500/10 p-3 text-gold-600">
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={1.8}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                      Telefon (24/7)
                    </p>
                    <a
                      href={`tel:${companyInfo.phone}`}
                      className="mt-1 block font-display text-xl font-semibold text-stone-900 hover:text-gold-600"
                    >
                      {companyInfo.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Hours note */}
              <div className="mt-8 rounded-xl bg-stone-900 p-6 text-center">
                <p className="font-display text-lg font-semibold text-white">
                  Disponibili 24/7
                </p>
                <p className="mt-2 text-sm text-stone-400">
                  Înțelegem că situațiile de urgență nu au program. Suntem
                  mereu disponibili, indiferent de oră.
                </p>
              </div>
            </div>

            {/* Form */}
            <div>
              <h2 className="mb-8 font-display text-2xl font-semibold text-stone-900">
                Trimiteți un mesaj
              </h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="h-80 w-full">
        <iframe
          src="https://maps.google.com/maps?q=PrimNord+Granit&output=embed"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Locație PrimNord Granit"
        />
      </section>
    </>
  );
}
