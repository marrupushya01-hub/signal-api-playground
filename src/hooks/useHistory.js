import { useState, useEffect } from "react";
import { uid } from "../utils/codeGenerators.js";

const STORAGE_KEY = "signal-history";
const MAX_ITEMS = 50;

export function useHistory() {
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  const pushHistory = (entry) => {
    setHistory((h) => [{ id: uid(), timestamp: Date.now(), ...entry }, ...h].slice(0, MAX_ITEMS));
  };

  const clearHistory = () => setHistory([]);

  return { history, pushHistory, clearHistory };
}
