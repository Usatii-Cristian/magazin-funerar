import { Lora, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  ORG_PHONE,
  ORG_EMAIL,
  ORG_LOCALE,
  ORG_COUNTRY,
} from "@/lib/site";
import { safeJsonLd } from "@/lib/jsonLd";
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Servicii Funerare & Monumente din Granit`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  generator: "Next.js",
  keywords: [
    "servicii funerare Soroca",
    "servicii funerare Moldova",
    "pompe funebre Soroca",
    "pompe funebre Moldova",
    "monumente funerare granit",
    "monumente funerare marmură",
    "monument funerar la comandă",
    "monument funerar preț",
    "granit negru monument",
    "cruce granit personalizată",
    "sicrie lemn masiv",
    "coroane funerare",
    "transport funerar Moldova",
    "organizare înmormântare",
    "asistență acte deces",
    "cimitir Soroca",
    "GranitNord Elit CV",
    "înmormântare Moldova",
    "gravură monument granit",
    "monument funerar ieftin",
    "monument funerar dublu",
    "accesorii mormânt",
    "gard mormânt granit",
    "fundație mormânt",
    "fotografie porțelan monument",
  ],
  category: "funeral services",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: ORG_LOCALE,
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Servicii Funerare & Monumente din Granit`,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Servicii Funerare`,
    description: SITE_DESCRIPTION,
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    other: [
      { rel: "mask-icon", url: "/favicon-48x48.png" },
      { rel: "msapplication-TileImage", url: "/mstile-150x150.png" },
      { rel: "manifest", url: "/site.webmanifest" },
    ],
  },
};

export const viewport = {
  themeColor: "#0c0a09",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#organization`,
  name: SITE_NAME,
  alternateName: "GranitNord Elit CV",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  image: `${SITE_URL}/opengraph-image`,
  description: SITE_DESCRIPTION,
  telephone: ORG_PHONE,
  email: ORG_EMAIL,
  address: {
    "@type": "PostalAddress",
    addressCountry: ORG_COUNTRY,
    addressLocality: "Soroca",
    addressRegion: "Soroca",
    postalCode: "3000",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "48.1578",
    longitude: "28.2879",
  },
  areaServed: [
    { "@type": "City", name: "Soroca" },
    { "@type": "Country", name: "Republica Moldova" },
  ],
  hasMap: "https://maps.google.com/?q=Soroca,Moldova",
  currenciesAccepted: "MDL",
  paymentAccepted: "Cash, Card bancar",
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
  ],
  priceRange: "$$",
  sameAs: [],
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Cât costă un monument funerar din granit?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Prețurile pentru monumente funerare din granit încep de la 2.800 lei și variază în funcție de dimensiuni, tip de granit și gravuri. Oferim consultanță gratuită și ofertă personalizată. Contactați-ne la 079 175 383.",
      },
    },
    {
      "@type": "Question",
      name: "Cât durează execuția unui monument funerar?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Termenul standard de execuție este 30–60 de zile de la confirmarea comenzii, în funcție de complexitatea lucrării. Includem gravura, montajul și toate finisajele.",
      },
    },
    {
      "@type": "Question",
      name: "Oferiți servicii funerare disponibile 24/7?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Da, suntem disponibili 24 de ore din 24, 7 zile din 7. Puteți suna oricând la 079 175 383 pentru asistență urgentă.",
      },
    },
    {
      "@type": "Question",
      name: "Livrați și montați monumente în toată Moldova?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Da, oferim servicii de livrare și montaj profesionist în toată Republica Moldova. Echipa noastră se deplasează la locul indicat.",
      },
    },
    {
      "@type": "Question",
      name: "Puteți grava o fotografie pe monument?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Da, gravăm fotografii pe granit sau ceramică (porțelan) direct pe monument. Fotografia trebuie să fie în format digital la rezoluție bună. Gravura rezistă zeci de ani la intemperii.",
      },
    },
    {
      "@type": "Question",
      name: "Ce garanție oferă GranitNord Elit CV?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Oferim garanție pentru toate lucrările executate. Folosim granit și marmură de calitate superioară, iar montajul este realizat de echipe specializate cu experiență de peste 15 ani.",
      },
    },
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  inLanguage: "ro-RO",
  publisher: { "@id": `${SITE_URL}/#organization` },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ro" className={`${lora.variable} ${inter.variable}`}>
      <body className="flex min-h-screen flex-col bg-cream-50 text-stone-900 antialiased">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: safeJsonLd(faqJsonLd) }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
