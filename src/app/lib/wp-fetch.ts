import he from "he";

export async function wpFetch(url: string, options: any = {}) {
  const res = await fetch(url, options);
  const json = await res.json();

  function walk(node: any): any {
    if (node === null || node === undefined) return node;

    // Decode HTML entities for all strings
    if (typeof node === "string") return he.decode(node);

    // Recursively process arrays
    if (Array.isArray(node)) return node.map(walk);

    // Recursively process objects
    if (typeof node === "object") {
      const cleaned: any = {};
      for (const key in node) {
        cleaned[key] = walk(node[key]);
      }
      return cleaned;
    }

    return node;
  }

  return walk(json);
}