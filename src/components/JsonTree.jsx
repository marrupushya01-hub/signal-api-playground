import React, { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

/**
 * Recursive collapsible JSON tree viewer with syntax-highlighted values.
 */
export default function JsonTree({ keyName, value, depth = 0, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen !== undefined ? defaultOpen : depth < 2);
  const isObj = value && typeof value === "object" && !Array.isArray(value);
  const isArr = Array.isArray(value);
  const indent = { paddingLeft: depth * 14 };

  if (!isObj && !isArr) {
    const valueClass =
      typeof value === "string"
        ? "text-emerald-500 dark:text-emerald-400"
        : typeof value === "number"
        ? "text-blue-500 dark:text-blue-400"
        : typeof value === "boolean"
        ? "text-amber-500 dark:text-amber-400"
        : "text-slate-400 dark:text-zinc-500";
    return (
      <div style={indent} className="flex gap-1.5 py-0.5 text-xs font-mono">
        {keyName !== undefined && (
          <span className="text-cyan-600 dark:text-cyan-400">"{keyName}":</span>
        )}
        <span className={valueClass}>{value === null ? "null" : JSON.stringify(value)}</span>
      </div>
    );
  }

  const entries = isArr ? value.map((v, i) => [i, v]) : Object.entries(value);
  const bracket = isArr ? ["[", "]"] : ["{", "}"];

  return (
    <div style={indent} className="text-xs font-mono">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 py-0.5 hover:bg-black/5 dark:hover:bg-white/5 rounded w-full text-left"
      >
        {open ? (
          <ChevronDown size={11} className="text-slate-400 dark:text-signal-muted shrink-0" />
        ) : (
          <ChevronRight size={11} className="text-slate-400 dark:text-signal-muted shrink-0" />
        )}
        {keyName !== undefined && (
          <span className="text-cyan-600 dark:text-cyan-400">"{keyName}":</span>
        )}
        <span className="text-slate-400 dark:text-signal-muted">
          {bracket[0]}
          {!open && `…${bracket[1]} ${entries.length} items`}
        </span>
      </button>
      {open && (
        <>
          {entries.map(([k, v]) => (
            <JsonTree key={k} keyName={isArr ? undefined : k} value={v} depth={depth + 1} />
          ))}
          <div style={{ paddingLeft: depth * 14 }} className="text-slate-400 dark:text-signal-muted">
            {bracket[1]}
          </div>
        </>
      )}
    </div>
  );
}
