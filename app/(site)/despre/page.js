import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Despre noi — Peste 15 Ani de Experiență",
  description:
    "GranitNord Elit CV — peste 15 ani de experiență în servicii funerare și monumente din granit. Valorile, misiunea și echipa noastră dedicată familiei dumneavoastră.",
  alternates: { canonical: "/despre" },
  openGraph: {
    title: "Despre GranitNord Elit CV — Peste 15 Ani de Experiență",
    description:
      "Peste 15 ani de experiență în servicii funerare și monumente din granit.",
    url: "/despre",
    type: "website",
  },
};

const values = [
  {
    title: "Respect",
    text: "Tratăm fiecare familie și fiecare situație cu maximă considerație. Înțelegem că fiecare viață a fost unică și merită să fie onorată ca atare.",
  },
  {
    title: "Empatie",
    text: "Nu suntem doar prestatori de servicii. Suntem oameni care înțeleg durerea pierderii și care sunt pregătiți să asculte, să sprijine și să fie prezenți.",
  },
  {
    title: "Profesionalism",
    text: "Echipa noastră este formată din specialiști cu experiență, dedicați excelenței în fiecare aspect al activității — de la logistică până la detaliile fine ale ceremoniei.",
  },
  {
    title: "Transparență",
    text: "Comunicăm clar și deschis despre servicii și costuri, fără surprize. Familia trebuie să poată lua decizii informate, fără presiuni.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-stone-900 px-6 py-24 text-center">
        <div className="mx-auto max-w-2xl">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-gold-400">
            Cine suntem
          </p>
          <h1 className="font-display text-4xl font-semibold text-white sm:text-5xl">
            Despre GranitNord Elit CV
          </h1>
          <p className="mt-5 text-base leading-relaxed text-stone-400">
            O echipă umană, angajată să ofere sprijin real în momentele cele
            mai dificile.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="bg-cream-50 px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gold-500">
                Povestea noastră
              </p>
              <h2 className="mb-5 font-display text-3xl font-semibold text-stone-900">
                15 ani în slujba familiilor
              </h2>
              <div className="space-y-4 leading-relaxed text-stone-600">
                <p>
                  GranitNord Elit CV a luat naștere din dorința de a oferi
                  familiilor din regiune servicii funerare demne, complete și
                  accesibile. Am început ca o mică afacere de familie și am
                  crescut an după an, ghidați de un singur principiu: omul în
                  centrul a tot.
                </p>
                <p>
                  De-a lungul anilor, am însoțit sute de familii prin unul
                  dintre cele mai grele momente ale vieții. Fiecare experiență
                  ne-a confirmat că ceea ce facem contează — nu doar logistic,
                  ci profund uman.
                </p>
                <p>
                  Astăzi oferim servicii funerare complete, de la organizarea
                  ceremoniei și transport, până la confecționarea și montarea
                  monumentelor funerare din granit și marmură.
                </p>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1771573391561-ab2bfc7e27a7?w=800&q=80"
                  alt="Meșter cioplitor piatră granit"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-stone-900/20" />
              </div>
              <div className="absolute -bottom-4 -right-4 rounded-xl bg-gold-500 px-6 py-4 text-center text-white shadow-lg">
                <p className="font-display text-2xl font-semibold">15+</p>
                <p className="text-xs opacity-90">ani de experiență</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <p className="mb-2 text-xs font-medium uppercase tracking-widest text-gold-500">
              Ce ne definește
            </p>
            <h2 className="font-display text-3xl font-semibold text-stone-900">
              Valorile noastre
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl bg-cream-100 p-7">
                <div className="mb-3 h-0.5 w-8 bg-gold-400" />
                <h3 className="mb-3 font-display text-xl font-semibold text-stone-900">
                  {v.title}
                </h3>
                <p className="text-sm leading-relaxed text-stone-600">
                  {v.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-stone-900 px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <svg
            className="mx-auto mb-6 h-8 w-8 text-gold-400"
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
          <h2 className="mb-5 font-display text-3xl font-semibold text-white">
            Misiunea noastră
          </h2>
          <p className="text-lg leading-relaxed text-stone-400">
            Să oferim familiilor în doliu o prezență calmă, competentă și
            empatică — astfel încât să se poată concentra pe ceea ce contează
            cu adevărat: a fi împreună și a onora memoria celui pierdut.
          </p>
          <Link
            href="/contact"
            className="mt-10 inline-block rounded bg-gold-500 px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-gold-600"
          >
            Luați legătura cu noi
          </Link>
        </div>
      </section>
    </>
  );
}
