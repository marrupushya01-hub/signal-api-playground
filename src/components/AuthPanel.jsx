import React from "react";

export default function AuthPanel({ auth, setAuth, theme }) {
  const { border, panelBg, text, muted, accent } = theme;

  return (
    <div className="space-y-2 text-xs font-mono">
      <div className="flex gap-2">
        {["none", "bearer", "basic", "apikey"].map((t) => (
          <button
            key={t}
            onClick={() => setAuth({ type: t })}
            style={{
              borderColor: auth.type === t ? accent : border,
              color: auth.type === t ? accent : muted,
              background: panelBg,
            }}
            className="px-3 py-1.5 rounded border capitalize transition-colors"
          >
            {t === "apikey" ? "API Key" : t}
          </button>
        ))}
      </div>

      {auth.type === "bearer" && (
        <input
          value={auth.token}
          onChange={(e) => setAuth({ token: e.target.value })}
          placeholder="Token (supports {{var}})"
          style={{ borderColor: border, background: panelBg, color: text }}
          className="w-full px-2.5 py-1.5 rounded border outline-none focus:border-cyan-400 placeholder:text-zinc-500"
        />
      )}

      {auth.type === "basic" && (
        <div className="flex gap-2">
          <input
            value={auth.username}
            onChange={(e) => setAuth({ username: e.target.value })}
            placeholder="Username"
            style={{ borderColor: border, background: panelBg, color: text }}
            className="flex-1 px-2.5 py-1.5 rounded border outline-none focus:border-cyan-400 placeholder:text-zinc-500"
          />
          <input
            value={auth.password}
            onChange={(e) => setAuth({ password: e.target.value })}
            placeholder="Password"
            type="password"
            style={{ borderColor: border, background: panelBg, color: text }}
            className="flex-1 px-2.5 py-1.5 rounded border outline-none focus:border-cyan-400 placeholder:text-zinc-500"
          />
        </div>
      )}

      {auth.type === "apikey" && (
        <div className="flex gap-2 items-center">
          <input
            value={auth.key}
            onChange={(e) => setAuth({ key: e.target.value })}
            placeholder="Key name"
            style={{ borderColor: border, background: panelBg, color: text }}
            className="flex-1 px-2.5 py-1.5 rounded border outline-none focus:border-cyan-400 placeholder:text-zinc-500"
          />
          <input
            value={auth.value}
            onChange={(e) => setAuth({ value: e.target.value })}
            placeholder="Value"
            style={{ borderColor: border, background: panelBg, color: text }}
            className="flex-1 px-2.5 py-1.5 rounded border outline-none focus:border-cyan-400 placeholder:text-zinc-500"
          />
          <select
            value={auth.loc}
            onChange={(e) => setAuth({ loc: e.target.value })}
            style={{ borderColor: border, background: panelBg, color: text }}
            className="px-2 py-1.5 rounded border outline-none"
          >
            <option value="header">Header</option>
            <option value="query">Query</option>
          </select>
        </div>
      )}

      {auth.type === "none" && <div style={{ color: muted }}>No authentication added to this request.</div>}
    </div>
  );
}
