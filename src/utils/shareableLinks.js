/**
 * Encode a request config into a shareable, URL-safe base64 string.
 */
export function encodeRequestConfig(config) {
  return btoa(encodeURIComponent(JSON.stringify(config)));
}

/**
 * Decode a shareable string back into a request config object.
 * Returns null if decoding fails.
 */
export function decodeRequestConfig(encoded) {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)));
  } catch {
    return null;
  }
}
