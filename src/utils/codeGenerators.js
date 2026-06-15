export const uid = () => Math.random().toString(36).slice(2, 9);

export function buildHeaderObj(headers) {
  const o = {};
  headers.forEach((h) => h.enabled && h.key.trim() && (o[h.key.trim()] = h.value));
  return o;
}

export function generateCurl({ method, url, headers, body }) {
  let cmd = `curl -X ${method} '${url}'`;
  headers.forEach(
    (h) => h.enabled && h.key.trim() && (cmd += ` \\\n  -H '${h.key}: ${h.value}'`)
  );
  if (body && method !== "GET" && method !== "DELETE") {
    cmd += ` \\\n  -d '${body.replace(/'/g, "'\\''")}'`;
  }
  return cmd;
}

export function generateFetch({ method, url, headers, body }) {
  const h = buildHeaderObj(headers);
  let s = `fetch("${url}", {\n  method: "${method}",`;
  if (Object.keys(h).length) {
    s += `\n  headers: ${JSON.stringify(h, null, 2).replace(/\n/g, "\n  ")},`;
  }
  if (body && method !== "GET" && method !== "DELETE") {
    s += `\n  body: ${JSON.stringify(body)},`;
  }
  s += `\n})\n  .then(res => res.json())\n  .then(data => console.log(data));`;
  return s;
}

export function generateAxios({ method, url, headers, body }) {
  const h = buildHeaderObj(headers);
  let s = `axios({\n  method: "${method.toLowerCase()}",\n  url: "${url}",`;
  if (Object.keys(h).length) {
    s += `\n  headers: ${JSON.stringify(h, null, 2).replace(/\n/g, "\n  ")},`;
  }
  if (body && method !== "GET" && method !== "DELETE") {
    try {
      s += `\n  data: ${JSON.stringify(JSON.parse(body), null, 2).replace(/\n/g, "\n  ")},`;
    } catch {
      s += `\n  data: ${JSON.stringify(body)},`;
    }
  }
  s += `\n}).then(res => console.log(res.data));`;
  return s;
}

export function generatePython({ method, url, headers, body }) {
  const h = buildHeaderObj(headers);
  let s = `import requests\n\n`;
  if (Object.keys(h).length) s += `headers = ${JSON.stringify(h, null, 4)}\n\n`;
  if (body && method !== "GET" && method !== "DELETE") s += `payload = ${body}\n\n`;
  s += `response = requests.${method.toLowerCase()}(\n    "${url}"`;
  if (Object.keys(h).length) s += `,\n    headers=headers`;
  if (body && method !== "GET" && method !== "DELETE") s += `,\n    json=payload`;
  s += `\n)\nprint(response.status_code)\nprint(response.json())`;
  return s;
}

export function generateAllSnippets(config) {
  return {
    cURL: generateCurl(config),
    Fetch: generateFetch(config),
    Axios: generateAxios(config),
    Python: generatePython(config),
  };
}
