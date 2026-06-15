import React from "react";
import { validateJson, beautify, minify } from "../utils/jsonUtils.js";

export default function BodyEditor({ body, setBody, theme }) {
  const { border, panelBg, text, accent } = theme;
  const { valid, error } = validateJson(body);

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span
          className="text-[11px] font-mono uppercase tracking-wide"
          style={{ color: !body.trim() ? "#71717a" : valid ? "#34d399" : "#fb7185" }}
        >
          {!body.trim() ? "Empty body" : valid ? "Valid JSON" : `Invalid JSON: ${error}`}
        </span>
        <div className="flex gap-2 text-xs font-mono" style={{ color: accent }}>
          <button onClick={() => setBody(beautify(body))} className="hover:opacity-80">
            Beautify
          </button>
          <button onClick={() => setBody(minify(body))} className="hover:opacity-80">
            Minify
          </button>
        </div>
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={'{\n  "key": "value"\n}'}
        rows={8}
        style={{ borderColor: !valid ? "#fb7185" : border, background: panelBg, color: text }}
        className="w-full px-3 py-2 rounded border text-xs font-mono outline-none focus:border-cyan-400 resize-y placeholder:text-zinc-500"
        spellCheck={false}
      />
    </div>
  );
}
