import { useState, useEffect } from "react";
import { uid } from "../utils/codeGenerators.js";

const STORAGE_KEY = "signal-env";

export function useEnvironment() {
  const [env, setEnv] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return stored && stored.length ? stored : [{ id: uid(), key: "", value: "" }];
    } catch {
      return [{ id: uid(), key: "", value: "" }];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(env));
  }, [env]);

  const addVar = () => setEnv((rows) => [...rows, { id: uid(), key: "", value: "" }]);
  const updateVar = (id, field, val) =>
    setEnv((rows) => rows.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  const removeVar = (id) => setEnv((rows) => rows.filter((r) => r.id !== id));

  /** Replace every {{name}} occurrence in str with its env value. */
  const interpolate = (str) => {
    let out = str;
    env.forEach((e) => {
      if (e.key) out = out.replaceAll(`{{${e.key}}}`, e.value);
    });
    return out;
  };

  return { env, addVar, updateVar, removeVar, interpolate };
}
