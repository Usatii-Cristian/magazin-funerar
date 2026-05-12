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
    "servicii funerare",
    "monumente funerare",
    "granit",
    "marmură",
    "cruci funerare",
    "sicrie",
    "coroane",
    "GranitNord Elit CV",
    "Bălți",
    "Moldova",
    "înmormântare",
    "monument granit",
    "cimitir",
    "pompe funebre",
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
        url: "/opengraph-image",
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
    images: ["/opengraph-image"],
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
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", type: "image/png" }],
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
    addressLocality: "Bălți",
    addressRegion: "Bălți",
  },
  areaServed: {
    "@type": "Country",
    name: "Republica Moldova",
  },
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
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
