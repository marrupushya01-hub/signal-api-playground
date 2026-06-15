import React from "react";
import { History, FolderOpen, Server, Download, Upload, Trash2, X } from "lucide-react";
import { METHOD_COLOR } from "./UrlBar.jsx";
import { statusColor } from "./ResponsePanel.jsx";

const TABS = [
  { id: "history", icon: History, label: "History" },
  { id: "collections", icon: FolderOpen, label: "Saved" },
  { id: "env", icon: Server, label: "Env" },
];

export default function Sidebar({
  sidebarTab,
  setSidebarTab,
  history,
  onLoadHistory,
  collections,
  onLoadCollection,
  onSaveCollection,
  onRemoveCollection,
  onExportCollections,
  onImportCollections,
  env,
  onAddEnvVar,
  onUpdateEnvVar,
  onRemoveEnvVar,
}) {
  return (
    <div className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l flex flex-col border-light-border dark:border-signal-border">
      <div className="flex border-b text-xs font-mono border-light-border dark:border-signal-border">
        {TABS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setSidebarTab(id)}
            className={`flex-1 py-2.5 border-b-2 flex items-center justify-center gap-1.5 transition-colors
              ${sidebarTab === id
                ? "border-cyan-400 text-cyan-500 dark:text-cyan-400"
                : "border-transparent text-slate-500 dark:text-signal-muted"}`}
          >
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {sidebarTab === "history" && (
        <div className="flex-1 overflow-auto">
          {history.length === 0 && (
            <div className="px-4 py-6 text-xs font-mono text-slate-400 dark:text-signal-muted">
              Requests you send will show up here.
            </div>
          )}
          {history.map((entry) => (
            <button
              key={entry.id}
              onClick={() => onLoadHistory(entry)}
              className="w-full text-left px-4 py-2.5 border-b hover:bg-black/5 dark:hover:bg-white/5 transition-colors block
                border-light-border dark:border-signal-border"
            >
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className={`font-bold ${METHOD_COLOR[entry.method]?.split(" ")[0]}`}>{entry.method}</span>
                {entry.mock && <Server size={10} className="text-amber-400" />}
                <span className={`ml-auto font-bold ${statusColor(entry.status, entry.ok)}`}>{entry.status || "ERR"}</span>
              </div>
              <div className="text-xs truncate mt-0.5 font-mono text-slate-500 dark:text-signal-muted">{entry.url}</div>
              <div className="text-[10px] mt-1 font-mono opacity-60 text-slate-400 dark:text-signal-muted">
                {new Date(entry.timestamp).toLocaleTimeString()} · {entry.time}ms
              </div>
              <div className="h-1 w-full rounded mt-1.5 overflow-hidden bg-light-border dark:bg-signal-border">
                <div className="h-full bg-cyan-400" style={{ width: `${Math.min(100, (entry.time / 1000) * 100)}%` }} />
              </div>
            </button>
          ))}
        </div>
      )}

      {sidebarTab === "collections" && (
        <div className="flex-1 overflow-auto">
          <div className="p-3 border-b flex gap-2 border-light-border dark:border-signal-border">
            <button
              onClick={onSaveCollection}
              className="flex-1 px-2 py-1.5 rounded border text-xs font-mono transition-colors
                border-cyan-400 text-cyan-500 dark:text-cyan-400 hover:bg-cyan-400/10"
            >
              Save current
            </button>
            <button
              onClick={onExportCollections}
              className="px-2 py-1.5 rounded border transition-colors
                border-light-border dark:border-signal-border text-slate-500 dark:text-signal-muted hover:text-cyan-500 dark:hover:text-cyan-400"
            >
              <Download size={13} />
            </button>
            <label
              className="px-2 py-1.5 rounded border transition-colors cursor-pointer
                border-light-border dark:border-signal-border text-slate-500 dark:text-signal-muted hover:text-cyan-500 dark:hover:text-cyan-400"
            >
              <Upload size={13} />
              <input type="file" accept=".json" onChange={onImportCollections} className="hidden" />
            </label>
          </div>

          {collections.length === 0 && (
            <div className="px-4 py-6 text-xs font-mono text-slate-400 dark:text-signal-muted">
              Save requests to build a collection.
            </div>
          )}
          {collections.map((c) => (
            <div key={c.id} className="px-4 py-2.5 border-b flex items-center gap-2 group border-light-border dark:border-signal-border">
              <button onClick={() => onLoadCollection(c)} className="flex-1 text-left">
                <span className={`text-xs font-bold font-mono ${METHOD_COLOR[c.method]?.split(" ")[0]}`}>{c.method}</span>
                <div className="text-xs truncate font-mono text-slate-500 dark:text-signal-muted">{c.url}</div>
              </button>
              <button
                onClick={() => onRemoveCollection(c.id)}
                className="text-slate-400 dark:text-signal-muted hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      {sidebarTab === "env" && (
        <div className="flex-1 overflow-auto p-3">
          <div className="text-[11px] font-mono uppercase tracking-wide mb-2 text-slate-400 dark:text-signal-muted">
            Use <span className="text-cyan-500 dark:text-cyan-400">{"{{name}}"}</span> in URL, headers, body or auth
          </div>
          {env.map((e) => (
            <div key={e.id} className="flex gap-2 mb-2">
              <input
                value={e.key}
                onChange={(ev) => onUpdateEnvVar(e.id, "key", ev.target.value)}
                placeholder="name"
                className="flex-1 px-2 py-1.5 rounded border text-xs font-mono outline-none focus:border-cyan-400
                  bg-white dark:bg-signal-panel border-light-border dark:border-signal-border
                  text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
              />
              <input
                value={e.value}
                onChange={(ev) => onUpdateEnvVar(e.id, "value", ev.target.value)}
                placeholder="value"
                className="flex-1 px-2 py-1.5 rounded border text-xs font-mono outline-none focus:border-cyan-400
                  bg-white dark:bg-signal-panel border-light-border dark:border-signal-border
                  text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
              />
              <button onClick={() => onRemoveEnvVar(e.id)} className="text-slate-400 dark:text-signal-muted hover:text-rose-400">
                <X size={13} />
              </button>
            </div>
          ))}
          <button onClick={onAddEnvVar} className="text-xs font-mono text-cyan-500 dark:text-cyan-400 hover:opacity-80">
            + Add variable
          </button>
        </div>
      )}
    </div>
  );
}
