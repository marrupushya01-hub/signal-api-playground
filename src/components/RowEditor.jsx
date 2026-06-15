import React from "react";
import { X, Plus } from "lucide-react";
import { emptyRow } from "../constants.js";

/**
 * Generic enable/disable key-value row editor.
 * Used for query params and headers.
 */
export default function RowEditor({
  rows,
  field,
  addRow,
  removeRow,
  updateRow,
  placeholder1,
  placeholder2,
  theme,
}) {
  const { border, panelBg, text, muted, accent } = theme;

  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <div key={r.id} className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={r.enabled}
            onChange={(e) => updateRow(field, r.id, "enabled", e.target.checked)}
            className="accent-cyan-400"
          />
          <input
            value={r.key}
            onChange={(e) => updateRow(field, r.id, "key", e.target.value)}
            placeholder={placeholder1}
            style={{ borderColor: border, background: panelBg, color: text }}
            className="flex-1 px-2.5 py-1.5 rounded border text-xs font-mono outline-none focus:border-cyan-400 placeholder:text-zinc-500"
          />
          <input
            value={r.value}
            onChange={(e) => updateRow(field, r.id, "value", e.target.value)}
            placeholder={placeholder2}
            style={{ borderColor: border, background: panelBg, color: text }}
            className="flex-1 px-2.5 py-1.5 rounded border text-xs font-mono outline-none focus:border-cyan-400 placeholder:text-zinc-500"
          />
          <button onClick={() => removeRow(field, r.id)} style={{ color: muted }} className="hover:text-rose-400">
            <X size={13} />
          </button>
        </div>
      ))}
      <button
        onClick={() => addRow(field)}
        style={{ color: accent }}
        className="text-xs font-mono hover:opacity-80 flex items-center gap-1"
      >
        <Plus size={12} /> Add row
      </button>
    </div>
  );
}
