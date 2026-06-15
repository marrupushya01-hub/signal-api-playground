export function validateJson(str) {
  if (!str || !str.trim()) return { valid: true, error: null, parsed: null };
  try {
    return { valid: true, error: null, parsed: JSON.parse(str) };
  } catch (e) {
    return { valid: false, error: e.message, parsed: null };
  }
}

export function beautifyJson(str) {
  try {
    return JSON.stringify(JSON.parse(str), null, 2);
  } catch {
    return str;
  }
}

export function minifyJson(str) {
  try {
    return JSON.stringify(JSON.parse(str));
  } catch {
    return str;
  }
}

/**
 * Naive line-based diff between two strings.
 * Returns an array of { type: "same" | "add" | "remove", text }
 */
export function diffLines(a, b) {
  const linesA = (a || "").split("\n");
  const linesB = (b || "").split("\n");
  const max = Math.max(linesA.length, linesB.length);
  const out = [];
  for (let i = 0; i < max; i++) {
    const la = linesA[i];
    const lb = linesB[i];
    if (la === lb) {
      out.push({ type: "same", text: lb ?? la ?? "" });
    } else if (la === undefined) {
      out.push({ type: "add", text: lb });
    } else if (lb === undefined) {
      out.push({ type: "remove", text: la });
    } else {
      out.push({ type: "remove", text: la });
      out.push({ type: "add", text: lb });
    }
  }
  return out;
}
