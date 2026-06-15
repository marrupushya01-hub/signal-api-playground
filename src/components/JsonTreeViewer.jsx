import React, { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

function JsonNode({ keyName, value, depth, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen !== undefined ? defaultOpen : depth < 2);
  const isObj = value && typeof value === "object" && !Array.isArray(value);
  const isArr = Array.isArray(value);
  const indent = { paddingLeft: depth * 14 };

  if (!isObj && !isArr) {
    const color =
      typeof value === "string"
        ? "#34d399"
        : typeof value === "number"
        ? "#60a5fa"
        : typeof value === "boolean"
        ? "#fbbf24"
        : "#71717a";
    return (
      <div style={indent} className="flex gap-1.5 py-0.5 text-xs font-mono">
        {keyName !== undefined && <span className="text-cyan-400">"{keyName}":</span>}
        <span style={{ color }}>{value === null ? "null" : JSON.stringify(value)}</span>
      </div>
    );
  }

  const entries = isArr ? value.map((v, i) => [i, v]) : Object.entries(value);
  const bracket = isArr ? ["[", "]"] : ["{", "}"];

  return (
    <div style={indent} className="text-xs font-mono">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 py-0.5 hover:bg-white/5 rounded w-full text-left"
      >
        {open ? (
          <ChevronDown size={11} className="text-zinc-500 shrink-0" />
        ) : (
          <ChevronRight size={11} className="text-zinc-500 shrink-0" />
        )}
        {keyName !== undefined && <span className="text-cyan-400">"{keyName}":</span>}
        <span className="text-zinc-500">
          {bracket[0]}
          {!open && `…${bracket[1]} ${entries.length} items`}
        </span>
      </button>
      {open && (
        <>
          {entries.map(([k, v]) => (
            <JsonNode key={k} keyName={isArr ? undefined : k} value={v} depth={depth + 1} />
          ))}
          <div style={{ paddingLeft: depth * 14 }} className="text-zinc-500">
            {bracket[1]}
          </div>
        </>
      )}
    </div>
  );
}

export default function JsonTreeViewer({ data }) {
  return <JsonNode value={data} depth={0} defaultOpen={true} />;
}
