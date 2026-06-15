export const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"];

export const METHOD_COLOR = {
  GET: "#34d399",
  POST: "#60a5fa",
  PUT: "#fbbf24",
  PATCH: "#c084fc",
  DELETE: "#fb7185",
};

export const ACCENT = "#00d4ff";

export const uid = () => Math.random().toString(36).slice(2, 9);

export const emptyRow = () => ({ id: uid(), key: "", value: "", enabled: true });

export const defaultAuth = () => ({
  type: "none",
  token: "",
  username: "",
  password: "",
  key: "",
  value: "",
  loc: "header",
});
