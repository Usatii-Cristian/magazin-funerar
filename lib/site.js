export const SITE_URL = "https://granitnord-elitcv.md";

export const SITE_NAME = "GranitNord Elit CV";

export const SITE_DESCRIPTION =
  "Servicii funerare complete cu respect, grijă și profesionalism. Monumente funerare din granit și marmură, organizare ceremonie, transport și asistență acte.";

export const ORG_PHONE = "+37379175383";
export const ORG_PHONE_DISPLAY = "079 175 383";
export const ORG_EMAIL = "contact@granitnord-elitcv.md";
export const ORG_LOCALE = "ro_RO";
export const ORG_COUNTRY = "MD";

export function absUrl(path = "") {
  if (!path) return SITE_URL;
  return path.startsWith("http")
    ? path
    : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
