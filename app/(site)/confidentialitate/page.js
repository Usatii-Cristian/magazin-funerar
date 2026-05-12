import { companyInfo } from "@/lib/data";

export const metadata = {
  title: "Politica de confidențialitate",
  description: "Politica de confidențialitate și prelucrare a datelor personale pe site-ul GranitNord Elit CV.",
  alternates: { canonical: "/confidentialitate" },
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 font-display text-3xl font-semibold text-stone-900 sm:text-4xl">
          Politica de confidențialitate
        </h1>
        <p className="mb-8 text-sm text-stone-400">
          Ultima actualizare: {new Date().toLocaleDateString("ro-RO")}
        </p>

        <div className="space-y-8 text-stone-700">
          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-stone-900">
              1. Informații generale
            </h2>
            <p className="leading-relaxed">
              <strong>{companyInfo.name}</strong> respectă confidențialitatea datelor dumneavoastră personale și se angajează să le protejeze conform legislației în vigoare privind prelucrarea datelor cu caracter personal.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-stone-900">
              2. Ce date colectăm
            </h2>
            <p className="mb-2 leading-relaxed">
              Atunci când utilizați formularul de contact, colectăm următoarele date:
            </p>
            <ul className="list-disc space-y-1 pl-6 leading-relaxed">
              <li>Nume și prenume</li>
              <li>Număr de telefon</li>
              <li>Adresa de email (dacă este oferită)</li>
              <li>Mesajul transmis</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-stone-900">
              3. Scopul prelucrării
            </h2>
            <p className="mb-2 leading-relaxed">Datele personale sunt prelucrate exclusiv pentru:</p>
            <ul className="list-disc space-y-1 pl-6 leading-relaxed">
              <li>Răspunsul la solicitarea dumneavoastră</li>
              <li>Furnizarea unei oferte personalizate</li>
              <li>Coordonarea executării comenzii (dacă este cazul)</li>
              <li>Îndeplinirea obligațiilor legale</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-stone-900">
              4. Cui transmitem datele
            </h2>
            <p className="leading-relaxed">
              Datele dumneavoastră nu sunt vândute, schimbate sau transmise terțelor părți, cu excepția cazurilor strict necesare pentru execuția comenzii (de exemplu, transportatori) sau când acest lucru este impus de lege.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-stone-900">
              5. Durata stocării
            </h2>
            <p className="leading-relaxed">
              Datele sunt păstrate pe durata necesară pentru îndeplinirea scopului pentru care au fost colectate sau pentru perioada cerută de legislația aplicabilă.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-stone-900">
              6. Drepturile dumneavoastră
            </h2>
            <p className="mb-2 leading-relaxed">Aveți dreptul:</p>
            <ul className="list-disc space-y-1 pl-6 leading-relaxed">
              <li>de a fi informat despre prelucrarea datelor</li>
              <li>de a accesa datele personale</li>
              <li>de a solicita rectificarea datelor incorecte</li>
              <li>de a solicita ștergerea datelor</li>
              <li>de a vă opune prelucrării</li>
              <li>de a depune plângere la autoritatea competentă</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-stone-900">
              7. Cookie-uri
            </h2>
            <p className="leading-relaxed">
              Site-ul folosește cookie-uri tehnice esențiale pentru funcționare (memorarea preferințelor, sesiuni). Nu utilizăm cookie-uri de profilare sau publicitate țintită.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-stone-900">
              8. Securitate
            </h2>
            <p className="leading-relaxed">
              Implementăm măsuri tehnice și organizatorice rezonabile pentru a proteja datele dumneavoastră personale împotriva accesului neautorizat, modificării sau distrugerii.
            </p>
          </section>

          <section>
            <h2 className="mb-3 font-display text-xl font-semibold text-stone-900">
              9. Contact
            </h2>
            <p className="leading-relaxed">
              Pentru orice întrebare privind politica de confidențialitate, ne puteți contacta la <a href={`tel:${companyInfo.phoneIntl}`} className="text-gold-600 underline">{companyInfo.phone}</a>.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}
