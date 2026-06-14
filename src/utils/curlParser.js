import { uid } from "./codeGenerators.js";

/**
 * Parse a cURL command string into a request config object.
 * Returns null if no URL could be found.
 */
export function parseCurl(cmd) {
  const out = { method: "GET", url: "", headers: [], body: "" };

  const urlMatch =
    cmd.match(/curl\s+(?:-X\s+\S+\s+)?'?([^'\s]+)'?/) ||
    cmd.match(/curl\s+['"]([^'"]+)['"]/);
  if (urlMatch) out.url = urlMatch[1];

  const methodMatch = cmd.match(/-X\s+(\w+)/i);
  if (methodMatch) out.method = methodMatch[1].toUpperCase();

  const headerRe = /-H\s+'([^:]+):\s*([^']*)'|-H\s+"([^:]+):\s*([^"]*)"/g;
  let m;
  while ((m = headerRe.exec(cmd))) {
    const k = m[1] || m[3];
    const v = m[2] || m[4];
    out.headers.push({ id: uid(), key: k.trim(), value: v.trim(), enabled: true });
  }

  const dataMatch =
    cmd.match(/(?:-d|--data)\s+'([^']*)'/) || cmd.match(/(?:-d|--data)\s+"([^"]*)"/);
  if (dataMatch) {
    out.body = dataMatch[1];
    if (out.method === "GET") out.method = "POST";
  }

  if (!out.url) return null;
  return out;
}
