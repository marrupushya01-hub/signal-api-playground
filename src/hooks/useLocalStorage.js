import { useState, useEffect } from "react";

/**
 * Generic localStorage-backed state hook.
 * Falls back gracefully if localStorage is unavailable.
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // ignore write errors (e.g. storage disabled)
    }
  }, [key, value]);

  return [value, setValue];
}
