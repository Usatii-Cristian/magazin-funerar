const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const posts = [
  {
    title: "Cum alegem un monument funerar potrivit",
    slug: "cum-alegem-un-monument-funerar-potrivit",
    excerpt:
      "Alegerea unui monument funerar este o decizie importantă, încărcată de emoție. Iată câteva criterii esențiale care vă pot ghida.",
    content: `<h2>De ce contează alegerea monumentului</h2>
<p>Un monument funerar reprezintă mai mult decât o piatră — este o mărturie permanentă a vieții celui drag și un loc de reculegere pentru familie. Alegerea potrivită aduce liniște sufletească și onorează memoria celui dispărut.</p>

<h2>Tipuri de monumente</h2>
<ul>
  <li><strong>Monumente standard</strong> — Clasice, din granit sau marmură, potrivite pentru orice cimitir.</li>
  <li><strong>Monumente duble</strong> — Destinate cuplurilor, cu inscripții pentru ambii soți.</li>
  <li><strong>Monumente VIP</strong> — Lucrări artistice personalizate, cu gravuri fine și accesorii premium.</li>
  <li><strong>Monumente pentru copii</strong> — Modele discrete, cu simboluri blânde și inscripții speciale.</li>
</ul>

<h2>Materialele disponibile</h2>
<p>Granitul este cel mai popular material datorită durabilității și rezistenței la intemperii. Marmura conferă eleganță, iar betonul armat oferă soliditate la costuri reduse.</p>

<h2>Dimensiunile și spațiul disponibil</h2>
<p>Înainte de a comanda, verificați regulamentul cimitirului privind dimensiunile admise. Un monument prea mare poate crea probleme administrative, iar unul prea mic poate părea nepotrivit față de locul de înhumare.</p>

<h2>Bugetul</h2>
<p>La PrimNord Granit oferim soluții pentru orice buget, de la monumente simple la complexe ornamentale. Contactați-ne pentru o ofertă personalizată.</p>`,
    published: true,
  },
  {
    title: "Granit vs. marmură — care material este mai potrivit?",
    slug: "granit-vs-marmura-care-material-este-mai-potrivit",
    excerpt:
      "Granitul și marmura sunt cele mai utilizate materiale pentru monumente funerare. Aflați care sunt diferențele și avantajele fiecăruia.",
    content: `<h2>Granitul</h2>
<p>Granitul este o rocă magmatică extrem de dură, disponibilă în nuanțe de negru, gri, roșu și albastru. Principalele avantaje:</p>
<ul>
  <li>Rezistență excepțională la umiditate, îngheț și UV</li>
  <li>Suprafață lustruită care se menține decenii</li>
  <li>Gravuri clare și de durată</li>
  <li>Preț accesibil raportat la calitate</li>
</ul>

<h2>Marmura</h2>
<p>Marmura este o rocă metamorfică cu aspect elegant și culori calde (alb, crem, veinat). Avantaje:</p>
<ul>
  <li>Aspect rafinat, artistic</li>
  <li>Se prelucrează ușor, permițând detalii fine</li>
  <li>Tradiție de secole în arta funerară</li>
</ul>
<p>Dezavantaje: mai poroasă decât granitul, necesită întreținere periodică pentru a rezista în timp.</p>

<h2>Recomandarea noastră</h2>
<p>Pentru monumentele expuse la climă aspră (ierni geroase, ploi frecvente), granitul negru sau gri este alegerea ideală. Marmura rămâne perfectă pentru monumente amplasate în spații acoperite sau în zone cu climă blândă.</p>`,
    published: true,
  },
  {
    title: "Ghid complet pentru organizarea serviciului funerar",
    slug: "ghid-complet-pentru-organizarea-serviciului-funerar",
    excerpt:
      "Organizarea unui serviciu funerar poate fi copleșitoare în momente de doliu. Acest ghid pas cu pas vă ajută să navigați prin toate etapele necesare.",
    content: `<h2>Primii pași după deces</h2>
<ol>
  <li>Contactați medicul de familie sau urgența pentru certificatul de deces</li>
  <li>Notificați starea civilă pentru eliberarea actelor necesare</li>
  <li>Contactați o firmă de servicii funerare pentru transport și pregătire</li>
</ol>

<h2>Alegerea locului de înhumare</h2>
<p>În Republica Moldova, înhumarea se face de regulă în cimitirul parohiei sau cel mai apropiat cimitir municipal. Verificați în prealabil disponibilitatea locurilor și costurile concesiunii.</p>

<h2>Slujba religioasă</h2>
<p>Contactați preotul parohiei pentru programarea slujbei de înmormântare. De obicei, aceasta are loc la 3 zile de la deces, conform tradiției ortodoxe.</p>

<h2>Monumentul funerar</h2>
<p>Comanda monumentului se poate face imediat după înhumare. La PrimNord Granit, termenul standard de execuție este de 30–60 de zile, în funcție de complexitate.</p>

<h2>Parastasele</h2>
<p>Conform tradiției, parastasele se organizează la 3 zile, 9 zile, 40 de zile, 6 luni și 1 an. Monumentul trebuie instalat, de regulă, înainte de parastas de 40 de zile.</p>`,
    published: true,
  },
  {
    title: "Întreținerea monumentului funerar — sfaturi practice",
    slug: "intretinerea-monumentului-funerar-sfaturi-practice",
    excerpt:
      "Un monument bine întreținut păstrează aspectul estetic pentru zeci de ani. Iată cum să curățați și să protejați granitul și marmura.",
    content: `<h2>Curățarea regulată</h2>
<p>Cel mai bun moment pentru curățare este primăvara, după topirea zăpezii, și toamna, înainte de prima îngheț. Folosiți:</p>
<ul>
  <li>Apă caldă și un burete moale sau o perie cu peri moi</li>
  <li>Săpun neutru (pH 7) — evitați produsele acide sau abrazive</li>
  <li>Clătiți abundent cu apă curată</li>
</ul>

<h2>Îndepărtarea petelor de licheni și mușchi</h2>
<p>Lichenii apar frecvent pe monumente vechi. Soluție: aplicați un biocid specializat pentru piatră naturală, lăsați să acționeze 15–20 minute, apoi periați ușor și clătiți.</p>

<h2>Protecția suprafețelor</h2>
<p>Pentru granit lustruit, aplicați anual un strat subțire de ceară pentru piatră naturală. Aceasta repelează apa și previne pătrundera impurităților în porii pietrei.</p>

<h2>Ce să evitați</h2>
<ul>
  <li>Oțet, soluții de clor sau detergenți agresivi</li>
  <li>Jet de apă la presiune înaltă pe marmură</li>
  <li>Obiecte metalice ascuțite pentru îndepărtarea depunerilor</li>
</ul>

<h2>Reparații</h2>
<p>Dacă observați crăpături sau deteriorări ale inscripțiilor, contactați-ne pentru o evaluare gratuită. Reparăm și renovăm monumente indiferent de producător.</p>`,
    published: true,
  },
  {
    title: "Tradiții funerare în Republica Moldova",
    slug: "traditii-funerare-in-republica-moldova",
    excerpt:
      "Moldova păstrează vii obiceiurile funerare ortodoxe, îmbinate cu tradiții locale unice. Descoperiti principalele practici și semnificațiile lor.",
    content: `<h2>Priveghi</h2>
<p>În tradiția moldovenească, priveghi se organizează în noaptea dinaintea înmormântării, la casa familiei. Rudele și vecinii se adună pentru rugăciune, cântece de jale și amintiri despre cel decedat.</p>

<h2>Coliva</h2>
<p>Coliva (grâu fiert cu miere și nuci) este preparată de familie pentru a fi sfințită la slujbă și împărțită participanților. Ea simbolizează învierea — grăuntele de grâu care moare pentru a aduce rod nou.</p>

<h2>Crucea și monumentul</h2>
<p>Imediat după înhumare se plantează o cruce de lemn. Monumentul din granit sau marmură se instalează după ce pământul s-a tasat — de regulă la 6 luni până la 1 an.</p>

<h2>Parastasele</h2>
<p>Familia organizează mese comemorative la datele stabilite de tradiție. La aceste ocazii se aduc la cimitir flori, lumânări și se servesc colivă și colaci.</p>

<h2>Sâmbetele morților</h2>
<p>De-a lungul anului există mai multe "sâmbete ale morților" (Moșii de vară, Moșii de toamnă etc.) — zile în care creștinii vizitează cimitirul și aduc ofrande pentru sufletele celor adormiți.</p>`,
    published: true,
  },
  {
    title: "Gravuri și inscripții pe monumente — tot ce trebuie să știți",
    slug: "gravuri-si-inscriptii-pe-monumente-tot-ce-trebuie-sa-stiti",
    excerpt:
      "Inscripția de pe monument este mesajul care rămâne pentru generații. Aflați cum se aleg textele, fonturile și simbolurile potrivite.",
    content: `<h2>Informații de bază</h2>
<p>Pe orice monument se inscripționează, de regulă:</p>
<ul>
  <li>Numele complet al defunctului</li>
  <li>Data nașterii și data decesului</li>
  <li>Un citat biblic, o poezie sau un mesaj de familie</li>
</ul>

<h2>Tehnici de gravură</h2>
<p><strong>Gravura cu sablare</strong> — cea mai comună, obține litere adânci și clare, vizibile de la distanță. Potrivită pentru granit negru.</p>
<p><strong>Gravura cu laser</strong> — permite detalii fine, portrete și imagini complexe. Ideală pentru fotografii gravate pe granit lucios.</p>

<h2>Fotografii gravate</h2>
<p>La PrimNord Granit oferim gravura fotografiei pe granit sau ceramică. Fotografia digitală se procesează și se gravează direct pe suprafața piesei, rezistând la intemperii zeci de ani.</p>

<h2>Citate și versete recomandate</h2>
<blockquote><em>"Eu sunt învierea și viața; cel ce crede în Mine, chiar dacă va muri, va trăi." — Ioan 11:25</em></blockquote>
<blockquote><em>"Amintirea ta va trăi în inimile noastre."</em></blockquote>
<blockquote><em>"Nu mori cât timp trăiești în inima celor care te iubesc."</em></blockquote>

<h2>Sfaturi practice</h2>
<ul>
  <li>Verificați cu atenție ortografia înainte de confirmare — corecturile ulterioare sunt costisitoare</li>
  <li>Furnizați o fotografie digitală de calitate înaltă (minim 300 DPI)</li>
  <li>Discutați cu noi despre dimensiunile optime ale inscripției în raport cu piesa</li>
</ul>`,
    published: true,
  },
];

async function main() {
  console.log("Seeding blog posts...");
  let created = 0;
  for (const post of posts) {
    const existing = await prisma.blogPost.findUnique({ where: { slug: post.slug } });
    if (!existing) {
      await prisma.blogPost.create({ data: post });
      console.log(`  + ${post.title}`);
      created++;
    } else {
      console.log(`  ~ skipped (exists): ${post.title}`);
    }
  }
  console.log(`Done. ${created} post(s) created.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
