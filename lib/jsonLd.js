// JSON.stringify does NOT escape `<`, so a value containing `</script>` would
// break out of an inline JSON-LD <script> block. Escape the HTML-significant
// chars while keeping the result valid JSON.
const REPLACEMENTS = {
  "<": "\\u003c",
  ">": "\\u003e",
  "&": "\\u0026",
};

export function safeJsonLd(obj) {
  return JSON.stringify(obj).replace(/[<>&]/g, (ch) => REPLACEMENTS[ch]);
}
