import sanitizeHtml from "sanitize-html";
import { marked } from "marked";

export { safeJsonLd } from "./jsonLd";

marked.setOptions({ gfm: true, breaks: true });

const ALLOWED_TAGS = [
  "h2", "h3", "h4", "h5", "h6",
  "p", "br", "hr",
  "ul", "ol", "li",
  "strong", "em", "b", "i", "u", "s", "small", "sub", "sup", "mark",
  "blockquote", "code", "pre",
  "a",
  "img",
  "figure", "figcaption",
  "table", "thead", "tbody", "tr", "th", "td",
  "span", "div",
];

const ALLOWED_ATTRS = {
  a: ["href", "title", "target", "rel"],
  img: ["src", "alt", "title", "width", "height", "loading"],
  th: ["colspan", "rowspan", "scope"],
  td: ["colspan", "rowspan"],
  "*": ["class"],
};

// Accepts plain text / markdown / mixed-with-HTML and returns safe HTML.
export function renderArticleContent(input) {
  if (typeof input !== "string" || input.length === 0) return "";
  const looksLikeHtml = /<\w+[^>]*>/.test(input);
  // marked passes HTML through untouched, so we run it for both cases.
  const html = looksLikeHtml ? input : marked.parse(input);
  return sanitizeArticleHtml(html);
}

export function sanitizeArticleHtml(dirty) {
  if (typeof dirty !== "string" || dirty.length === 0) return "";
  return sanitizeHtml(dirty, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: ALLOWED_ATTRS,
    allowedSchemes: ["http", "https", "mailto", "tel"],
    allowedSchemesByTag: { img: ["http", "https"] },
    transformTags: {
      a: (tagName, attribs) => ({
        tagName: "a",
        attribs: {
          ...attribs,
          rel: attribs.target === "_blank" ? "noopener noreferrer nofollow" : (attribs.rel || ""),
        },
      }),
    },
    disallowedTagsMode: "discard",
  });
}
