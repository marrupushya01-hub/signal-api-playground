import React from "react";
import { Copy, Check, GitCompare, Code2 } from "lucide-react";
import JsonTree from "./JsonTree.jsx";

export function statusColor(status, ok) {
  if (!status) return "text-rose-500 dark:text-rose-400";
  if (status >= 200 && status < 300) return "text-emerald-500 dark:text-emerald-400";
  if (status >= 300 && status < 400) return "text-blue-500 dark:text-blue-400";
  if (status >= 400 && status < 500) return "text-amber-500 dark:text-amber-400";
  return "text-rose-500 dark:text-rose-400";
}

export default function ResponsePanel({
  loading,
  error,
  response,
  resTab,
  setResTab,
  diffLines,
  codeSnippets,
  copiedCode,
  onCopyCode,
  onCopyResponse,
  copiedResponse,
}) {
  const tabs = ["body", "headers", "code", ...(diffLines ? ["diff"] : [])];

  return (
    <div className="flex-1 flex flex-col min-h-0 border rounded bg-white dark:bg-signal-panel border-light-border dark:border-signal-border">
      <div className="flex items-center justify-between border-b px-3 py-2 flex-wrap gap-2 border-light-border dark:border-signal-border">
        <div className="flex gap-4 text-xs font-mono">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setResTab(t)}
              className={`pb-1 border-b-2 transition-colors capitalize flex items-center gap-1
                ${resTab === t
                  ? "border-cyan-400 text-cyan-500 dark:text-cyan-400"
                  : "border-transparent text-slate-500 dark:text-signal-muted"}`}
            >
              {t === "diff" && <GitCompare size={11} />}
              {t === "code" && <Code2 size={11} />}
              {t === "body" ? "Response" : t}
            </button>
          ))}
        </div>

        {response && (
          <div className="flex items-center gap-3 text-xs font-mono text-slate-500 dark:text-signal-muted">
            <span className={`font-bold ${statusColor(response.status, response.ok)}`}>
              {response.status} {response.statusText}
            </span>
            <span>{response.time}ms</span>
            <span>{response.size}B</span>
            {response.body && (
              <button onClick={onCopyResponse} className="hover:text-cyan-500 dark:hover:text-cyan-400 flex items-center gap-1">
                {copiedResponse ? <Check size={12} /> : <Copy size={12} />}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto p-3 min-h-[180px]">
        {loading && (
          <div className="space-y-2">
            <div className="text-sm font-mono text-slate-500 dark:text-signal-muted">Sending request…</div>
            <div className="h-0.5 w-full rounded overflow-hidden relative bg-light-border dark:bg-signal-border">
              <div className="h-full w-1/3 absolute bg-cyan-400 animate-scan" />
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="text-sm font-mono">
            <div className="font-bold mb-1 text-rose-500 dark:text-rose-400">Request failed</div>
            <div className="text-slate-500 dark:text-signal-muted">{error}</div>
            <div className="text-xs mt-2 opacity-70 text-slate-500 dark:text-signal-muted">
              This often means the URL is unreachable or the server's CORS policy blocks browser requests.
            </div>
          </div>
        )}

        {!loading && !error && !response && (
          <div className="text-sm font-mono text-slate-400 dark:text-signal-muted">
            Send a request to see the response here.
          </div>
        )}

        {!loading && response && resTab === "body" && (
          response.isJson && response.parsed !== undefined && response.parsed !== null ? (
            <JsonTree value={response.parsed} depth={0} defaultOpen={true} />
          ) : (
            <pre className="text-xs font-mono whitespace-pre-wrap break-all text-slate-800 dark:text-slate-200">
              {response.body || <span className="text-slate-400 dark:text-signal-muted">— empty body —</span>}
            </pre>
          )
        )}

        {!loading && response && resTab === "headers" && (
          <div className="text-xs font-mono space-y-1">
            {Object.entries(response.headers).map(([k, v]) => (
              <div key={k} className="flex gap-2">
                <span className="shrink-0 text-cyan-500 dark:text-cyan-400">{k}:</span>
                <span className="break-all text-slate-500 dark:text-signal-muted">{v}</span>
              </div>
            ))}
          </div>
        )}

        {resTab === "code" && (
          <div className="space-y-3">
            {Object.entries(codeSnippets).map(([lang, code]) => (
              <div key={lang} className="border rounded border-light-border dark:border-signal-border">
                <div className="flex items-center justify-between px-2 py-1 border-b text-xs font-mono border-light-border dark:border-signal-border text-slate-500 dark:text-signal-muted">
                  {lang}
                  <button onClick={() => onCopyCode(lang, code)} className="hover:text-cyan-500 dark:hover:text-cyan-400 flex items-center gap-1">
                    {copiedCode === lang ? <Check size={12} /> : <Copy size={12} />}
                  </button>
                </div>
                <pre className="text-xs font-mono p-2 overflow-x-auto text-slate-800 dark:text-slate-200">{code}</pre>
              </div>
            ))}
          </div>
        )}

        {resTab === "diff" && diffLines && (
          <div className="text-xs font-mono">
            <div className="mb-2 text-slate-400 dark:text-signal-muted">
              Comparing previous response → current response
            </div>
            {diffLines.map((l, i) => (
              <div
                key={i}
                className={`whitespace-pre-wrap break-all px-1 ${
                  l.type === "add"
                    ? "bg-emerald-400/10 text-emerald-500 dark:text-emerald-400"
                    : l.type === "remove"
                    ? "bg-rose-400/10 text-rose-500 dark:text-rose-400"
                    : "text-slate-400 dark:text-signal-muted"
                }`}
              >
                {l.type === "add" ? "+ " : l.type === "remove" ? "- " : "  "}
                {l.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
