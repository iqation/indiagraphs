import he from "he";

/**
 * Clean and normalize WordPress HTML output globally.
 */
export function cleanWP(html: string = ""): string {
  if (!html) return "";

  let out = html;

  // Decode all HTML entities: &#8211; &nbsp; &amp; &quot; etc.
  out = he.decode(out);

  // WordPress adds <p> wrappers to excerpts — remove them
  out = out.replace(/^<p>/, "").replace(/<\/p>$/, "");

  // Remove empty paragraphs
  out = out.replace(/<p>\s*<\/p>/g, "");

  return out.trim();
}