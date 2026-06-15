import { useReducer, useMemo, useRef, useCallback } from "react";
import { uid, emptyRow, defaultAuth } from "../constants.js";
import { buildHeaderObj } from "../utils/codeGenerators.js";

const initialState = {
  method: "GET",
  url: "https://jsonplaceholder.typicode.com/posts/1",
  params: [emptyRow()],
  headers: [{ id: uid(), key: "Accept", value: "application/json", enabled: true }],
  body: "",
  auth: defaultAuth(),
  graphql: false,
  gqlQuery: "",
  gqlVars: "",
  mockMode: false,
  mockResponse: '{\n  "message": "mock response",\n  "status": "ok"\n}',
  response: null,
  prevResponse: null,
  error: null,
  loading: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_AUTH":
      return { ...state, auth: { ...state.auth, ...action.value } };
    case "ADD_ROW":
      return { ...state, [action.field]: [...state[action.field], emptyRow()] };
    case "REMOVE_ROW":
      return { ...state, [action.field]: state[action.field].filter((r) => r.id !== action.id) };
    case "UPDATE_ROW":
      return {
        ...state,
        [action.field]: state[action.field].map((r) =>
          r.id === action.id ? { ...r, [action.key]: action.value } : r
        ),
      };
    case "START_REQUEST":
      return { ...state, loading: true, error: null, prevResponse: state.response, response: null };
    case "SET_RESPONSE":
      return { ...state, loading: false, response: action.value, error: null };
    case "SET_ERROR":
      return { ...state, loading: false, error: action.value, response: null };
    case "LOAD_REQUEST":
      return {
        ...state,
        ...action.value,
        loading: false,
      };
    case "RESET_RESPONSE_VIEW":
      return { ...state, response: action.response ?? null, error: action.error ?? null };
    default:
      return state;
  }
}

/**
 * Core request-builder state + send logic.
 * `interpolate` comes from useEnvironment so {{vars}} resolve before sending.
 */
export function useRequest(interpolate) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const startRef = useRef(0);

  const setField = (field, value) => dispatch({ type: "SET_FIELD", field, value });
  const setAuth = (value) => dispatch({ type: "SET_AUTH", value });
  const addRow = (field) => dispatch({ type: "ADD_ROW", field });
  const removeRow = (field, id) => dispatch({ type: "REMOVE_ROW", field, id });
  const updateRow = (field, id, key, value) => dispatch({ type: "UPDATE_ROW", field, id, key, value });
  const loadRequest = (value) => dispatch({ type: "LOAD_REQUEST", value });

  const fullUrl = useMemo(() => {
    let u = interpolate(state.url);
    const activeParams = state.params.filter((p) => p.enabled && p.key.trim());
    if (activeParams.length) {
      const sep = u.includes("?") ? "&" : "?";
      u +=
        sep +
        activeParams
          .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(interpolate(p.value))}`)
          .join("&");
    }
    return u;
  }, [state.url, state.params, interpolate]);

  const effectiveHeaders = useMemo(() => {
    let h = state.headers.map((x) => ({ ...x }));
    const { auth } = state;
    if (auth.type === "bearer" && auth.token) {
      h.push({ id: "auth", key: "Authorization", value: `Bearer ${interpolate(auth.token)}`, enabled: true });
    }
    if (auth.type === "basic" && auth.username) {
      h.push({ id: "auth", key: "Authorization", value: `Basic ${btoa(`${auth.username}:${auth.password}`)}`, enabled: true });
    }
    if (auth.type === "apikey" && auth.loc === "header" && auth.key) {
      h.push({ id: "auth", key: auth.key, value: interpolate(auth.value), enabled: true });
    }
    return h;
  }, [state.headers, state.auth, interpolate]);

  const send = useCallback(async (onComplete) => {
    dispatch({ type: "START_REQUEST" });
    startRef.current = performance.now();

    let sendUrl = fullUrl;
    const { auth, graphql, gqlQuery, gqlVars, mockMode, mockResponse, body, method } = state;

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
      try {
        vars = gqlVars.trim() ? JSON.parse(gqlVars) : {};
      } catch {
        /* ignore invalid variables JSON */
      }
      effBody = JSON.stringify({ query: interpolate(gqlQuery), variables: vars });
      hdrs.push({ id: "ct", key: "Content-Type", value: "application/json", enabled: true });
    }

    // Mock mode: simulate a response, no network call
    if (mockMode) {
      await new Promise((r) => setTimeout(r, 300 + Math.random() * 300));
      const elapsed = Math.round(performance.now() - startRef.current);
      let formatted = mockResponse;
      let isJson = false;
      let parsed = null;
      try {
        parsed = JSON.parse(mockResponse);
        formatted = JSON.stringify(parsed, null, 2);
        isJson = true;
      } catch {
        /* leave as raw text */
      }
      const result = {
        status: 200,
        statusText: "OK (mock)",
        ok: true,
        headers: { "x-mock": "true" },
        body: formatted,
        isJson,
        parsed,
        time: elapsed,
        size: new Blob([formatted]).size,
      };
      dispatch({ type: "SET_RESPONSE", value: result });
      onComplete &&
        onComplete({
          method: effMethod,
          url: sendUrl,
          headers: hdrs,
          body: effBody,
          status: 200,
          ok: true,
          time: elapsed,
          response: result,
          mock: true,
        });
      return;
    }

    try {
      const headerObj = buildHeaderObj(hdrs);
      const opts = { method: effMethod, headers: headerObj };
      if (effMethod !== "GET" && effMethod !== "DELETE" && effBody.trim()) {
        opts.body = interpolate(effBody);
      }

      const res = await fetch(sendUrl, opts);
      const elapsed = Math.round(performance.now() - startRef.current);

      const resHeaders = {};
      res.headers.forEach((v, k) => (resHeaders[k] = v));

      const contentType = res.headers.get("content-type") || "";
      const text = await res.text();
      let data = text;
      let isJson = false;
      let parsed = null;
      if (contentType.includes("application/json")) {
        try {
          parsed = JSON.parse(text);
          data = JSON.stringify(parsed, null, 2);
          isJson = true;
        } catch {
          /* not valid JSON despite header */
        }
      }

      const result = {
        status: res.status,
        statusText: res.statusText,
        ok: res.ok,
        headers: resHeaders,
        body: data,
        isJson,
        parsed,
        time: elapsed,
        size: new Blob([text]).size,
      };

      dispatch({ type: "SET_RESPONSE", value: result });
      onComplete &&
        onComplete({
          method: effMethod,
          url: sendUrl,
          headers: hdrs,
          body: effBody,
          status: res.status,
          ok: res.ok,
          time: elapsed,
          response: result,
        });
    } catch (e) {
      const elapsed = Math.round(performance.now() - startRef.current);
      const message = e.message || "Request failed";
      dispatch({ type: "SET_ERROR", value: message });
      onComplete &&
        onComplete({
          method: effMethod,
          url: sendUrl,
          headers: hdrs,
          body: effBody,
          status: null,
          ok: false,
          time: elapsed,
          error: message,
        });
    }
  }, [state, fullUrl, effectiveHeaders, interpolate]);

  return {
    state,
    setField,
    setAuth,
    addRow,
    removeRow,
    updateRow,
    loadRequest,
    fullUrl,
    effectiveHeaders,
    send,
  };
}
