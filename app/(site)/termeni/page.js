import { companyInfo } from "@/lib/data";

export const metadata = {
  title: "Termeni și condiții",
  description: "Termenii și condițiile de utilizare ale site-ului PrimNord Granit.",
  alternates: { canonical: "/termeni" },
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 font-display text-3xl font-semibold text-stone-900 sm:text-4xl">
          Termeni și condiții
        </h1>
        <p className="mb-8 text-sm text-stone-400">
          Ultima actualizare: {new Date().toLocaleDateString("ro-RO")}
        </p>

        <div className="space-y-8 text-stone-700">
          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-stone-900">
              1. Acceptarea termenilor
            </h2>
            <p className="leading-relaxed">
              Prin accesarea și utilizarea site-ului <strong>{companyInfo.name}</strong>, sunteți de acord cu termenii și condițiile prezentate în continuare. Dacă nu sunteți de acord cu acești termeni, vă rugăm să nu utilizați site-ul.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-stone-900">
              2. Servicii oferite
            </h2>
            <p className="leading-relaxed">
              {companyInfo.name} oferă servicii funerare complete, inclusiv producția și montajul monumentelor funerare din granit și marmură, accesorii, garduri morminte și alte produse asociate. Toate prețurile afișate pe site sunt orientative; oferta finală este confirmată după consultare.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-stone-900">
              3. Comenzi și plăți
            </h2>
            <p className="leading-relaxed">
              Comenzile se fac telefonic, prin formularul de contact sau direct la sediu. După confirmarea comenzii, se stabilește un termen de execuție și modalitatea de plată. Termenii specifici fiecărei comenzi sunt comunicați la confirmare.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-stone-900">
              4. Garanție
            </h2>
            <p className="leading-relaxed">
              Toate lucrările executate de {companyInfo.name} beneficiază de garanție conform legislației în vigoare. Detaliile specifice ale garanției sunt menționate în documentele de comandă.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-stone-900">
              5. Drepturi de autor
            </h2>
            <p className="leading-relaxed">
              Conținutul site-ului — texte, imagini, design, logo — este proprietatea {companyInfo.name} și este protejat de legislația privind drepturile de autor. Reproducerea fără acord scris este interzisă.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-stone-900">
              6. Limitarea răspunderii
            </h2>
            <p className="leading-relaxed">
              {companyInfo.name} depune toate eforturile pentru ca informațiile afișate pe site să fie corecte și actualizate. Cu toate acestea, nu garantăm absența erorilor de tipar sau a informațiilor expirate. Pentru oferte ferme, vă rugăm să ne contactați direct.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-stone-900">
              7. Modificări
            </h2>
            <p className="leading-relaxed">
              Ne rezervăm dreptul de a modifica acești termeni în orice moment. Modificările intră în vigoare la data publicării pe site.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-stone-900">
              8. Contact
            </h2>
            <p className="leading-relaxed">
              Pentru orice întrebări legate de acești termeni, ne puteți contacta la telefonul <a href={`tel:${companyInfo.phoneIntl}`} className="text-gold-600 underline">{companyInfo.phone}</a>.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
