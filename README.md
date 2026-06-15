# Signal — API Playground

A lightweight, browser-based API testing tool with a radar/signal visual theme.

## Features
- Method/URL bar with query params, headers, auth (Bearer / Basic / API Key)
- Body editor with JSON validation, beautify/minify
- GraphQL mode (query + variables)
- Mock mode — return a fake response without hitting a real server
- Collapsible JSON tree response viewer
- Response diffing against the previous request
- Code generation: cURL, Fetch, Axios, Python
- cURL import
- History, saved collections (export/import as JSON), environment variables ({{var}})
- Shareable request links (base64-encoded config copied to clipboard)
- Dark/light theme, keyboard shortcuts (Ctrl/Cmd+Enter to send)

## Getting started

```bash
npm install
npm run dev
```

Open the printed local URL (usually http://localhost:5173).

## Project structure

```
src/
├── App.jsx                # Main orchestrator + layout
├── main.jsx                # Entry point
├── index.css               # Tailwind directives + custom styles
├── hooks/
│   ├── useTheme.js          # Dark/light theme (persisted)
│   ├── useHistory.js        # Request history (persisted)
│   ├── useCollections.js     # Saved request collections (persisted)
│   └── useEnvironment.js     # {{var}} environment variables (persisted)
├── utils/
│   ├── codeGenerators.js     # cURL / Fetch / Axios / Python generators
│   ├── curlParser.js         # Parse cURL → request config
│   ├── jsonUtils.js          # Validate / beautify / minify / diff
│   └── shareableLinks.js      # Encode/decode shareable request configs
└── components/
    ├── UrlBar.jsx
    ├── RequestPanel.jsx       # Params / Headers / Auth / Body / GraphQL / Mock tabs
    ├── ResponsePanel.jsx      # Response / Headers / Code / Diff tabs
    ├── JsonTree.jsx           # Collapsible JSON viewer
    ├── Sidebar.jsx            # History / Collections / Env
    └── Modals.jsx             # cURL import + shortcuts
```

All persisted data (theme, history, collections, env vars) is stored in
`localStorage`, so it survives page refreshes.
