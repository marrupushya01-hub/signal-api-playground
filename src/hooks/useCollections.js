import { useState, useEffect } from "react";
import { uid } from "../utils/codeGenerators.js";

const STORAGE_KEY = "signal-collections";

export function useCollections() {
  const [collections, setCollections] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
  }, [collections]);

  const saveRequest = (req) => {
    const name = `${req.method} ${req.url.slice(0, 40)}`;
    setCollections((c) => [...c, { id: uid(), name, ...req }]);
  };

  const removeRequest = (id) => setCollections((c) => c.filter((x) => x.id !== id));

  const exportCollections = () => {
    const blob = new Blob([JSON.stringify(collections, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "collection.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importCollections = (file) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        setCollections((c) => [...c, ...data]);
      } catch {
        /* ignore invalid file */
      }
    };
    reader.readAsText(file);
  };

  return { collections, saveRequest, removeRequest, exportCollections, importCollections };
}
