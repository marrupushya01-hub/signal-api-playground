<div align="center">

# ⚡ Signal — API Playground

**A lightweight, browser-based API testing tool. No install. No server. Just signal.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-signal--api--playgrounds.vercel.app-00d4ff?style=for-the-badge&logo=vercel)](https://signal-api-playgrounds.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-marrupushya01--hub-181717?style=for-the-badge&logo=github)](https://github.com/marrupushya01-hub/signal-api-playground)
[![Built with React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)

*Built for Devlynix Buildathon 2.0 — Track 9: API Playground*

</div>

---

## 🚀 Live Demo

👉 **[signal-api-playgrounds.vercel.app](https://signal-api-playgrounds.vercel.app/)**

No login required. Works entirely in your browser. All data saved to localStorage.

---

## 🧩 What is Signal?

Signal is a **Postman alternative** that runs 100% in the browser — no backend, no installation, no account.

Think of it as a lightweight API testing tool with a clean radar-themed UI. Send HTTP requests, inspect responses, save collections, and generate code — all from a single tab.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔵 **HTTP Methods** | GET, POST, PUT, PATCH, DELETE |
| 📋 **Headers & Params** | Add custom headers and query params with a visual editor |
| 🔐 **Auth Panel** | Bearer Token, Basic Auth, API Key - auto-injected into requests |
| 📦 **Body Editor** | JSON editor with validate, beautify, and minify |
| 🌐 **GraphQL Mode** | Query + variables editor with auto Content-Type |
| 🎭 **Mock Mode** | Return a fake response without hitting a real server |
| 🌳 **JSON Tree Viewer** | Collapsible, syntax-highlighted response viewer |
| 🔄 **Request Diffing** | Compare current and previous response side-by-side |
| 💻 **Code Generation** | Auto-generate cURL, Fetch, Axios, or Python code |
| 📥 **cURL Import** | Paste any cURL command and it auto-fills the request |
| 🌍 **Environment Variables** | Define `{{base_url}}` once, use everywhere |
| 📚 **History** | Auto-saves last 50 requests, reload with one click |
| 🗂️ **Collections** | Save, export, and import request collections as JSON |
| 🔗 **Shareable Links** | Encode your request config and share it with a teammate |
| 🌙 **Dark / Light Mode** | Toggle and preference auto-saved |
| ⌨️ **Keyboard Shortcuts** | `Ctrl+Enter` to send, `Ctrl+/` for shortcuts list |

---

## 🖼️ Screenshots

> Try it live at [signal-api-playgrounds.vercel.app](https://signal-api-playgrounds.vercel.app/)

---

## 🛠️ Tech Stack

- **React 18** + **Vite** - fast dev server and build
- **Tailwind CSS** - utility-first styling
- **Native Fetch API** - zero dependency networking
- **localStorage** - persistent history, collections, env vars, and theme
- **Vercel** - zero-config static deployment

---

## 📦 Getting Started (Local)

```bash
# Clone the repo
git clone https://github.com/marrupushya01-hub/signal-api-playground.git
cd signal-api-playground

# Install dependencies
npm install

# Start dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

```bash
# Build for production
npm run build
```

---

## 🗂️ Project Structure

```
src/
├── App.jsx                  # Main orchestrator + layout
├── main.jsx                 # Entry point
├── index.css                # Tailwind directives + custom styles
├── hooks/
│   ├── useTheme.js          # Dark/light theme (persisted)
│   ├── useHistory.js        # Request history (persisted)
│   ├── useCollections.js    # Saved collections (persisted)
│   └── useEnvironment.js    # {{var}} environment variables (persisted)
├── utils/
│   ├── codeGenerators.js    # cURL / Fetch / Axios / Python generators
│   ├── curlParser.js        # Parse cURL → request config
│   ├── jsonUtils.js         # Validate / beautify / minify / diff
│   └── shareableLinks.js    # Encode/decode shareable request configs
└── components/
    ├── UrlBar.jsx            # URL input + method selector + send button
    ├── RequestPanel.jsx      # Params / Headers / Auth / Body / GraphQL / Mock tabs
    ├── ResponsePanel.jsx     # Response / Headers / Code / Diff tabs
    ├── JsonTree.jsx          # Collapsible JSON viewer
    ├── Sidebar.jsx           # History / Collections / Env
    └── Modals.jsx            # cURL import + shortcuts modal
```

---

## ⚠️ Known Limitations

**CORS** - Some APIs block browser-based requests unless they set CORS headers. This is a browser security restriction, not a bug in Signal. To test such APIs locally, you can use a CORS proxy or test APIs that allow browser access (like `jsonplaceholder.typicode.com`).

---

## 👥 Team Signal

Built at **Devlynix Buildathon 2.0**

| Member | GitHub |
|---|---|
| Pushya | [@marrupushya01-hub](https://github.com/marrupushya01-hub) |
| Mousumi | [@mousumi442](https://github.com/mousumi442) |
| Mahesh | [@Mahesh-forcode](https://github.com/Mahesh-forcode) |

---

## 📄 License

MIT — free to use, modify, and distribute.

---

<div align="center">
Made with ⚡ by Team The Byte Alchemists
</div>
