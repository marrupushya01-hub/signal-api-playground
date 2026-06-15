import React, { useState, useRef, useEffect, useMemo } from "react";
import { Radar, Keyboard, Sun, Moon, Server } from "lucide-react";

import UrlBar, { METHODS } from "./components/UrlBar.jsx";
import RequestPanel from "./components/RequestPanel.jsx";
import ResponsePanel from "./components/ResponsePanel.jsx";
import Sidebar from "./components/Sidebar.jsx";
import { CurlImportModal, ShortcutsModal } from "./components/Modals.jsx";

import { useTheme } from "./hooks/useTheme.js";
import { useHistory } from "./hooks/useHistory.js";
import { useCollections } from "./hooks/useCollections.js";
import { useEnvironment } from "./hooks/useEnvironment.js";

import { generateAllSnippets, buildHeaderObj, uid } from "./utils/codeGenerators.js";
import { parseCurl } from "./utils/curlParser.js";
import { diffLines as computeDiff } from "./utils/jsonUtils.js";
import { encodeRequestConfig } from "./utils/shareableLinks.js";

const emptyRow = () => ({ id: uid(), key: "", value: "", enabled: true });

export default function App() {
  const { isDark, toggleTheme } = useTheme();
  const { history, pushHistory } = useHistory();
  const { collections, saveRequest, removeRequest, exportCollections, importCollections } = useCollections();
  const { env, addVar, updateVar, removeVar, interpolate } = useEnvironment();

  // request state
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/posts/1");
  const [params, setParams] = useState([emptyRow()]);
  const [headers, setHeaders] = useState([{ ...emptyRow(), key: "Accept", value: "application/json" }]);
  const [body, setBody] = useState("");
  const [auth, setAuth] = useState({ type: "none", token: "", username: "", password: "", key: "", value: "", loc: "header" });
  const [graphql, setGraphql] = useState(false);
  const [gqlQuery, setGqlQuery] = useState("");
  const [gqlVars, setGqlVars] = useState("");
  const [mockMode, setMockMode] = useState(false);
  const [mockResponse, setMockResponse] = useState('{\n  "message": "mock response",\n  "status": "ok"\n}');

  // UI state
  const [reqTab, setReqTab] = useState("headers");
  const [resTab, setResTab] = useState("body");
  const [sidebarTab, setSidebarTab] = useState("history");
  const [showCurlModal, setShowCurlModal] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [curlInput, setCurlInput] = useState("");
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(null);
  const [copiedResponse, setCopiedResponse] = useState(false);

  // response state
  const [response, setResponse] = useState(null);
  const [prevResponse, setPrevResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const startRef = useRef(0);

  /* full URL with interpolated query params */
  const fullUrl = useMemo(() => {
    let u = interpolate(url);
    const activeParams = params.filter((p) => p.enabled && p.key.trim());
    if (activeParams.length) {
      const sep = u.includes("?") ? "&" : "?";
      u += sep + activeParams.map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(interpolate(p.value))}`).join("&");
    }
    return u;
  }, [url, params, env]);

  /* headers including auth */
  const effectiveHeaders = useMemo(() => {
    let h = headers.map((x) => ({ ...x }));
    if (auth.type === "bearer" && auth.token) h.push({ id: "auth", key: "Authorization", value: `Bearer ${interpolate(auth.token)}`, enabled: true });
    if (auth.type === "basic" && auth.username) h.push({ id: "auth", key: "Authorization", value: `Basic ${btoa(`${auth.username}:${auth.password}`)}`, enabled: true });
    if (auth.type === "apikey" && auth.loc === "header" && auth.key) h.push({ id: "auth", key: auth.key, value: interpolate(auth.value), enabled: true });
    return h;
  }, [headers, auth, env]);

  /* ---- send request ---- */
  const sendRequest = async () => {
    setLoading(true);
    setError(null);
    setPrevResponse(response);
    setResponse(null);
    startRef.current = performance.now();

    let sendUrl = fullUrl;
    if (auth.type === "apikey" && auth.loc === "query" && auth.key) {
      const sep = sendUrl.includes("?") ? "&" : "?";
      sendUrl += `${sep}${encodeURIComponent(auth.key)}=${encodeURIComponent(interpolate(auth.value))}`;
    }

    let effMethod = method;
    let effBody = body;
    let hdrs = [...effectiveHeaders];

    if (graphql) {
      effMethod = "POST";
      let vars = {};
      try { vars = gqlVars.trim() ? JSON.parse(gqlVars) : {}; } catch {}
      effBody = JSON.stringify({ query: interpolate(gqlQuery), variables: vars });
      hdrs.push({ id: "ct", key: "Content-Type", value: "application/json", enabled: true });
    }

    if (mockMode) {
      await new Promise((r) => setTimeout(r, 300 + Math.random() * 300));
      const elapsed = Math.round(performance.now() - startRef.current);
      let formatted = mockResponse, isJson = false, parsed = null;
      try { parsed = JSON.parse(mockResponse); formatted = JSON.stringify(parsed, null, 2); isJson = true; } catch {}
      const result = { status: 200, statusText: "OK (mock)", ok: true, headers: { "x-mock": "true" }, body: formatted, isJson, parsed, time: elapsed, size: new Blob([formatted]).size };
      setResponse(result);
      pushHistory({ method: effMethod, url: sendUrl, status: 200, ok: true, time: elapsed, response: result, mock: true, snapshot: snapshotConfig() });
      setLoading(false);
      return;
    }

    try {
      const headerObj = buildHeaderObj(hdrs);
      const opts = { method: effMethod, headers: headerObj };
      if (effMethod !== "GET" && effMethod !== "DELETE" && effBody.trim()) opts.body = interpolate(effBody);

      const res = await fetch(sendUrl, opts);
      const elapsed = Math.round(performance.now() - startRef.current);
      const resHeaders = {};
      res.headers.forEach((v, k) => (resHeaders[k] = v));
      const contentType = res.headers.get("content-type") || "";
      const text = await res.text();
      let data = text, isJson = false, parsed = null;
      if (contentType.includes("application/json")) {
        try { parsed = JSON.parse(text); data = JSON.stringify(parsed, null, 2); isJson = true; } catch {}
      }
      const result = { status: res.status, statusText: res.statusText, ok: res.ok, headers: resHeaders, body: data, isJson, parsed, time: elapsed, size: new Blob([text]).size };
      setResponse(result);
      pushHistory({ method: effMethod, url: sendUrl, status: res.status, ok: res.ok, time: elapsed, response: result, snapshot: snapshotConfig() });
    } catch (e) {
      const elapsed = Math.round(performance.now() - startRef.current);
      setError(e.message || "Request failed");
      pushHistory({ method: effMethod, url: sendUrl, status: null, ok: false, time: elapsed, error: e.message, snapshot: snapshotConfig() });
    } finally {
      setLoading(false);
    }
  };

  /* ---- snapshot / restore full request config ---- */
  const snapshotConfig = () => ({ method, url, params, headers, body, auth, graphql, gqlQuery, gqlVars });

  const applyConfig = (cfg) => {
    if (!cfg) return;
    setMethod(cfg.method || "GET");
    setUrl(cfg.url || "");
    setParams((cfg.params || [emptyRow()]).map((p) => ({ ...p, id: uid() })));
    setHeaders((cfg.headers || [emptyRow()]).map((h) => ({ ...h, id: uid() })));
    setBody(cfg.body || "");
    setAuth(cfg.auth || { type: "none", token: "", username: "", password: "", key: "", value: "", loc: "header" });
    setGraphql(!!cfg.graphql);
    setGqlQuery(cfg.gqlQuery || "");
    setGqlVars(cfg.gqlVars || "");
  };

  const loadFromHistory = (entry) => {
    applyConfig(entry.snapshot);
    if (entry.response) { setResponse(entry.response); setError(null); }
    else if (entry.error) { setResponse(null); setError(entry.error); }
  };

  /* ---- collections ---- */
  const handleSaveCollection = () => saveRequest(snapshotConfig());
  const handleLoadCollection = (c) => applyConfig(c);
  const handleImportCollections = (e) => {
    const file = e.target.files[0];
    if (file) importCollections(file);
  };

  /* ---- shareable link ---- */
  const copyShareLink = () => {
    const encoded = encodeRequestConfig(snapshotConfig());
    navigator.clipboard.writeText(encoded);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 1500);
  };

  /* ---- cURL import ---- */
  const applyCurl = () => {
    const parsed = parseCurl(curlInput);
    if (!parsed) return;
    setMethod(parsed.method);
    setUrl(parsed.url);
    setHeaders(parsed.headers.length ? parsed.headers : [emptyRow()]);
    setBody(parsed.body);
    setShowCurlModal(false);
    setCurlInput("");
  };

  /* ---- code snippets ---- */
  const codeSnippets = useMemo(
    () => generateAllSnippets({ method, url: fullUrl, headers: effectiveHeaders, body }),
    [method, fullUrl, effectiveHeaders, body]
  );

  const copyCode = (lang, code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(lang);
    setTimeout(() => setCopiedCode(null), 1200);
  };

  const copyResponseBody = () => {
    if (!response) return;
    navigator.clipboard.writeText(response.body);
    setCopiedResponse(true);
    setTimeout(() => setCopiedResponse(false), 1200);
  };

  /* ---- diff between previous and current response ---- */
  const diff = useMemo(() => {
    if (!response || !prevResponse) return null;
    return computeDiff(prevResponse.body, response.body);
  }, [response, prevResponse]);

  /* ---- keyboard shortcuts ---- */
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); sendRequest(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "/") { e.preventDefault(); setShowShortcuts((s) => !s); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method, fullUrl, headers, body, auth, mockMode, mockResponse, graphql, gqlQuery, gqlVars, response]);

  return (
    <div className="w-full min-h-screen font-sans flex flex-col relative overflow-hidden bg-light-bg dark:bg-signal-bg text-slate-800 dark:text-slate-200">
      {/* animated grid background */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(var(--grid-line) 1px, transparent 1px), linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
          maskImage: "radial-gradient(circle at 50% 0%, black 0%, transparent 70%)",
          "--grid-line": isDark ? "#1e293b" : "#e2e8f0",
        }}
      />

      {/* top bar */}
      <div className="relative z-10 border-b px-5 py-3 flex items-center gap-3 border-light-border dark:border-signal-border">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Radar size={18} className={`text-cyan-400 ${loading ? "animate-spin" : ""}`} />
            {loading && <div className="absolute inset-0 rounded-full animate-ping bg-cyan-400 opacity-30" />}
          </div>
          <span className="text-sm font-bold tracking-widest uppercase">Signal</span>
        </div>
        <span className="text-[11px] uppercase tracking-widest font-mono ml-1 text-slate-400 dark:text-signal-muted">
          api playground
        </span>

        <div className="ml-auto flex items-center gap-3">
          <label className="flex items-center gap-1.5 text-xs cursor-pointer text-slate-500 dark:text-signal-muted">
            <input type="checkbox" checked={graphql} onChange={(e) => setGraphql(e.target.checked)} className="accent-cyan-400" />
            GraphQL
          </label>
          <label className="flex items-center gap-1.5 text-xs cursor-pointer text-slate-500 dark:text-signal-muted">
            <input type="checkbox" checked={mockMode} onChange={(e) => setMockMode(e.target.checked)} className="accent-cyan-400" />
            Mock
          </label>
          <button onClick={() => setShowShortcuts(true)} title="Keyboard shortcuts (Ctrl+/)" className="text-slate-500 dark:text-signal-muted hover:text-cyan-400 transition-colors">
            <Keyboard size={16} />
          </button>
          <button onClick={toggleTheme} className="text-slate-500 dark:text-signal-muted hover:text-cyan-400 transition-colors">
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col lg:flex-row min-h-0">
        {/* main panel */}
        <div className="flex-1 flex flex-col p-5 gap-3 min-w-0">
          <UrlBar
            method={method}
            setMethod={setMethod}
            url={url}
            setUrl={setUrl}
            loading={loading}
            onSend={sendRequest}
            onImportCurl={() => setShowCurlModal(true)}
            onShare={copyShareLink}
            copiedLink={copiedLink}
          />

          {mockMode && (
            <div className="text-xs px-3 py-2 rounded border flex items-center gap-2 border-amber-400 bg-amber-400/10 text-amber-500 dark:text-amber-400">
              <Server size={13} /> Mock mode active — define a fake JSON response in the "Mock" tab instead of hitting a real server.
            </div>
          )}

          <RequestPanel
            reqTab={reqTab}
            setReqTab={setReqTab}
            method={method}
            graphql={graphql}
            mockMode={mockMode}
            params={params}
            setParams={setParams}
            headers={headers}
            setHeaders={setHeaders}
            auth={auth}
            setAuth={setAuth}
            body={body}
            setBody={setBody}
            gqlQuery={gqlQuery}
            setGqlQuery={setGqlQuery}
            gqlVars={gqlVars}
            setGqlVars={setGqlVars}
            mockResponse={mockResponse}
            setMockResponse={setMockResponse}
          />

          <ResponsePanel
            loading={loading}
            error={error}
            response={response}
            resTab={resTab}
            setResTab={setResTab}
            diffLines={diff}
            codeSnippets={codeSnippets}
            copiedCode={copiedCode}
            onCopyCode={copyCode}
            onCopyResponse={copyResponseBody}
            copiedResponse={copiedResponse}
          />
        </div>

        <Sidebar
          sidebarTab={sidebarTab}
          setSidebarTab={setSidebarTab}
          history={history}
          onLoadHistory={loadFromHistory}
          collections={collections}
          onLoadCollection={handleLoadCollection}
          onSaveCollection={handleSaveCollection}
          onRemoveCollection={removeRequest}
          onExportCollections={exportCollections}
          onImportCollections={handleImportCollections}
          env={env}
          onAddEnvVar={addVar}
          onUpdateEnvVar={updateVar}
          onRemoveEnvVar={removeVar}
        />
      </div>

      {showCurlModal && (
        <CurlImportModal
          curlInput={curlInput}
          setCurlInput={setCurlInput}
          onApply={applyCurl}
          onClose={() => setShowCurlModal(false)}
        />
      )}

      {showShortcuts && <ShortcutsModal onClose={() => setShowShortcuts(false)} />}
    </div>
  );
}
