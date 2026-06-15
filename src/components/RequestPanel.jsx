import React from "react";
import { Plus, X, Server } from "lucide-react";
import { beautifyJson, minifyJson, validateJson } from "../utils/jsonUtils.js";
import { uid } from "../utils/codeGenerators.js";

const inputClass =
  "flex-1 px-2.5 py-1.5 rounded border text-xs font-mono outline-none focus:border-cyan-400 " +
  "bg-white dark:bg-signal-panel border-light-border dark:border-signal-border " +
  "text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-zinc-500";

/* ---- Key/value row editor (used for params + headers) ---- */
export function RowEditor({ rows, setRows, placeholder1, placeholder2 }) {
  const update = (id, field, val) =>
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, [field]: val } : r)));
  const remove = (id) => setRows((rs) => rs.filter((r) => r.id !== id));
  const add = () => setRows((rs) => [...rs, { id: uid(), key: "", value: "", enabled: true }]);

  return (
    <div className="space-y-2">
      {rows.map((r) => (
        <div key={r.id} className="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={r.enabled}
            onChange={(e) => update(r.id, "enabled", e.target.checked)}
            className="accent-cyan-400"
          />
          <input value={r.key} onChange={(e) => update(r.id, "key", e.target.value)} placeholder={placeholder1} className={inputClass} />
          <input value={r.value} onChange={(e) => update(r.id, "value", e.target.value)} placeholder={placeholder2} className={inputClass} />
          <button onClick={() => remove(r.id)} className="text-slate-400 dark:text-signal-muted hover:text-rose-400">
            <X size={13} />
          </button>
        </div>
      ))}
      <button onClick={add} className="text-xs font-mono text-cyan-500 dark:text-cyan-400 hover:opacity-80 flex items-center gap-1">
        <Plus size={12} /> Add row
      </button>
    </div>
  );
}

/* ---- Body editor with JSON validation ---- */
export function BodyEditor({ body, setBody }) {
  const { valid, error } = validateJson(body);

  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className={`text-[11px] font-mono uppercase tracking-wide ${valid ? "text-emerald-500 dark:text-emerald-400" : "text-rose-500 dark:text-rose-400"}`}>
          {body.trim() ? (valid ? "Valid JSON" : `Invalid JSON: ${error}`) : "Empty body"}
        </span>
        <div className="flex gap-2 text-xs font-mono text-cyan-500 dark:text-cyan-400">
          <button onClick={() => setBody(beautifyJson(body))} className="hover:opacity-80">Beautify</button>
          <button onClick={() => setBody(minifyJson(body))} className="hover:opacity-80">Minify</button>
        </div>
      </div>
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={'{\n  "key": "value"\n}'}
        rows={8}
        spellCheck={false}
        className={`w-full px-3 py-2 rounded border text-xs font-mono outline-none focus:border-cyan-400 resize-y
          bg-white dark:bg-signal-panel text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-zinc-500
          ${valid ? "border-light-border dark:border-signal-border" : "border-rose-400"}`}
      />
    </div>
  );
}

/* ---- Auth panel ---- */
export function AuthPanel({ auth, setAuth }) {
  const types = [
    { id: "none", label: "None" },
    { id: "bearer", label: "Bearer" },
    { id: "basic", label: "Basic" },
    { id: "apikey", label: "API Key" },
  ];

  return (
    <div className="space-y-2 text-xs font-mono">
      <div className="flex gap-2">
        {types.map((t) => (
          <button
            key={t.id}
            onClick={() => setAuth((a) => ({ ...a, type: t.id }))}
            className={`px-3 py-1.5 rounded border transition-colors bg-white dark:bg-signal-panel
              ${auth.type === t.id
                ? "border-cyan-400 text-cyan-500 dark:text-cyan-400"
                : "border-light-border dark:border-signal-border text-slate-500 dark:text-signal-muted"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {auth.type === "bearer" && (
        <input
          value={auth.token}
          onChange={(e) => setAuth((a) => ({ ...a, token: e.target.value }))}
          placeholder="Token (supports {{var}})"
          className={`w-full ${inputClass}`}
        />
      )}

      {auth.type === "basic" && (
        <div className="flex gap-2">
          <input value={auth.username} onChange={(e) => setAuth((a) => ({ ...a, username: e.target.value }))} placeholder="Username" className={inputClass} />
          <input value={auth.password} onChange={(e) => setAuth((a) => ({ ...a, password: e.target.value }))} placeholder="Password" type="password" className={inputClass} />
        </div>
      )}

      {auth.type === "apikey" && (
        <div className="flex gap-2 items-center">
          <input value={auth.key} onChange={(e) => setAuth((a) => ({ ...a, key: e.target.value }))} placeholder="Key name" className={inputClass} />
          <input value={auth.value} onChange={(e) => setAuth((a) => ({ ...a, value: e.target.value }))} placeholder="Value" className={inputClass} />
          <select
            value={auth.loc}
            onChange={(e) => setAuth((a) => ({ ...a, loc: e.target.value }))}
            className="px-2 py-1.5 rounded border outline-none bg-white dark:bg-signal-panel border-light-border dark:border-signal-border text-slate-800 dark:text-slate-200"
          >
            <option value="header">Header</option>
            <option value="query">Query</option>
          </select>
        </div>
      )}

      {auth.type === "none" && (
        <div className="text-slate-400 dark:text-signal-muted">No authentication added to this request.</div>
      )}
    </div>
  );
}

/* ---- GraphQL editor ---- */
export function GraphQLEditor({ gqlQuery, setGqlQuery, gqlVars, setGqlVars }) {
  return (
    <div className="space-y-2">
      <div className="text-[11px] font-mono uppercase tracking-wide text-slate-400 dark:text-signal-muted">Query</div>
      <textarea
        value={gqlQuery}
        onChange={(e) => setGqlQuery(e.target.value)}
        rows={6}
        placeholder={"query {\n  viewer {\n    login\n  }\n}"}
        spellCheck={false}
        className="w-full px-3 py-2 rounded border text-xs font-mono outline-none focus:border-cyan-400 resize-y
          bg-white dark:bg-signal-panel border-light-border dark:border-signal-border
          text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
      />
      <div className="text-[11px] font-mono uppercase tracking-wide text-slate-400 dark:text-signal-muted">Variables (JSON)</div>
      <textarea
        value={gqlVars}
        onChange={(e) => setGqlVars(e.target.value)}
        rows={3}
        placeholder='{ "id": 1 }'
        spellCheck={false}
        className="w-full px-3 py-2 rounded border text-xs font-mono outline-none focus:border-cyan-400 resize-y
          bg-white dark:bg-signal-panel border-light-border dark:border-signal-border
          text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-zinc-500"
      />
    </div>
  );
}

/* ---- Mock response editor ---- */
export function MockEditor({ mockResponse, setMockResponse }) {
  return (
    <div className="space-y-2">
      <div className="text-[11px] font-mono uppercase tracking-wide text-slate-400 dark:text-signal-muted flex items-center gap-1.5">
        <Server size={12} /> Fake response body (JSON)
      </div>
      <textarea
        value={mockResponse}
        onChange={(e) => setMockResponse(e.target.value)}
        rows={6}
        spellCheck={false}
        className="w-full px-3 py-2 rounded border text-xs font-mono outline-none focus:border-cyan-400 resize-y
          bg-white dark:bg-signal-panel border-light-border dark:border-signal-border text-slate-800 dark:text-slate-200"
      />
    </div>
  );
}

/* ---- Tab bar + content switcher ---- */
export default function RequestPanel({
  reqTab,
  setReqTab,
  method,
  graphql,
  mockMode,
  params,
  setParams,
  headers,
  setHeaders,
  auth,
  setAuth,
  body,
  setBody,
  gqlQuery,
  setGqlQuery,
  gqlVars,
  setGqlVars,
  mockResponse,
  setMockResponse,
}) {
  const tabs = ["params", "headers", "auth"];
  if (!graphql && method !== "GET" && method !== "DELETE") tabs.push("body");
  if (graphql) tabs.push("graphql");
  if (mockMode) tabs.push("mock");

  const paramCount = params.filter((p) => p.key && p.enabled).length;
  const headerCount = headers.filter((h) => h.key && h.enabled).length;

  return (
    <div>
      <div className="flex gap-4 border-b text-xs font-mono border-light-border dark:border-signal-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setReqTab(tab)}
            className={`pb-2 px-1 -mb-px border-b-2 transition-colors capitalize
              ${reqTab === tab
                ? "border-cyan-400 text-cyan-500 dark:text-cyan-400"
                : "border-transparent text-slate-500 dark:text-signal-muted"}`}
          >
            {tab}
            {tab === "headers" && headerCount > 0 && ` (${headerCount})`}
            {tab === "params" && paramCount > 0 && ` (${paramCount})`}
          </button>
        ))}
      </div>

      <div className="pt-3">
        {reqTab === "params" && <RowEditor rows={params} setRows={setParams} placeholder1="Param name" placeholder2="Value" />}
        {reqTab === "headers" && <RowEditor rows={headers} setRows={setHeaders} placeholder1="Header name" placeholder2="Value" />}
        {reqTab === "auth" && <AuthPanel auth={auth} setAuth={setAuth} />}
        {reqTab === "body" && <BodyEditor body={body} setBody={setBody} />}
        {reqTab === "graphql" && (
          <GraphQLEditor gqlQuery={gqlQuery} setGqlQuery={setGqlQuery} gqlVars={gqlVars} setGqlVars={setGqlVars} />
        )}
        {reqTab === "mock" && <MockEditor mockResponse={mockResponse} setMockResponse={setMockResponse} />}
      </div>
    </div>
  );
}
