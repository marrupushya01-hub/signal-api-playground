import React from "react";
import { X } from "lucide-react";

export function Modal({ onClose, title, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="border rounded-lg p-4 w-full max-w-lg bg-white dark:bg-signal-panel border-light-border dark:border-signal-border text-slate-800 dark:text-slate-200"
      >
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-bold font-mono">{title}</span>
          <button onClick={onClose} className="text-slate-400 dark:text-signal-muted hover:text-rose-400">
            <X size={16} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function CurlImportModal({ curlInput, setCurlInput, onApply, onClose }) {
  return (
    <Modal onClose={onClose} title="Import from cURL">
      <textarea
        value={curlInput}
        onChange={(e) => setCurlInput(e.target.value)}
        rows={6}
        placeholder={`curl -X POST 'https://api.example.com/x' -H 'Content-Type: application/json' -d '{"a":1}'`}
        spellCheck={false}
        className="w-full px-3 py-2 rounded border text-xs font-mono outline-none focus:border-cyan-400 resize-y
          bg-light-bg dark:bg-signal-bg border-light-border dark:border-signal-border
          text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
      />
      <button
        onClick={onApply}
        className="mt-3 px-4 py-2 rounded text-sm font-bold transition-opacity hover:opacity-90 bg-cyan-400 text-[#04141a]"
      >
        Import
      </button>
    </Modal>
  );
}

export function ShortcutsModal({ onClose }) {
  const shortcuts = [
    ["Ctrl/Cmd + Enter", "Send request"],
    ["Ctrl/Cmd + /", "Toggle this menu"],
  ];

  return (
    <Modal onClose={onClose} title="Keyboard shortcuts">
      <div className="space-y-2 text-xs font-mono">
        {shortcuts.map(([k, d]) => (
          <div key={k} className="flex justify-between">
            <span className="text-slate-500 dark:text-signal-muted">{d}</span>
            <span className="px-2 py-0.5 rounded border bg-light-bg dark:bg-signal-bg border-light-border dark:border-signal-border">{k}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}
