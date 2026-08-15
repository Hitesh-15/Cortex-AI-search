# 🚀 Cortex Release Notes & Changelog

All notable changes, continuous architectural improvements, and daily/weekly feature updates to **Cortex** ([cortex.ambulkar.com](https://cortex.ambulkar.com)) are documented in this file.

---

## 🌟 [v3.2.0] — 2026-08-15
### **Deep Web Knowledge Aggregation & Content-First UX Redesign**

#### 🌐 Deep Web Crawler & 20+ Multi-Index Ingestion
- **Parallel Multi-Index Ingestion**: Upgraded web source extraction to query multiple live web indices simultaneously:
  - **DuckDuckGo API**: Real-time topic extraction & semantic abstracts.
  - **Wikipedia Live OpenSearch API**: Live encyclopedic definitions and historical background.
  - **HackerNews / Tech Algolia API**: Active engineering discussions, developer evaluations, and tech breaking news.
  - **Global Intelligence Domain Catalog**: Automatic domain expansion across Reuters, Bloomberg, MIT Technology Review, Nature, ArXiv, TechCrunch, SEC EDGAR, GitHub, StackOverflow, Yahoo Finance, MarketWatch, PubMed, and Federal Reserve Data.
- **Effort-Scaled Research Depth**:
  - **High Effort (Deep Research)**: Aggregates 20+ verified live sources.
  - **Medium Effort**: Aggregates 12+ verified sources.
  - **Low Effort**: Aggregates 8+ verified sources.

#### 🎨 Content-First Clean UX Redesign
- **Answer-First Viewport**: Eliminated full-page source card grids. The synthesized research memo is now 100% visible at the top of the screen immediately upon completion with zero scrolling required.
- **Compact Inline Sources Strip (Height: 36px)**: Displays top verified source chips (such as Reuters, Bloomberg, and ArXiv) alongside an expandable sources counter.
- **On-Demand Sources Drawer**: Added an expandable slide-out overlay drawer displaying all 20+ sources with their snippets, titles, and direct external links.
- **Natural Inline Citations**: Replaced heavy bracket clusters with subtle, clickable superscript citation numbers embedded smoothly into sentences.

#### ⚡ Parallel Frontier Multi-Model Routing
- **Two-Stage Parallel Reasoning**: Introduced parallel multi-model routing capability:
  - **Stage 1 (Fast Extraction)**: Uses *Gemini 3.7 Flash* or *Nemotron 3.5 Lightning* for rapid factual extraction.
  - **Stage 2 (Deep Reasoning)**: Uses *Claude Sonnet 5* or *DeepSeek V4 Pro* for complex mathematical analysis and executive synthesis.
- **Post-Query Executed Model Telemetry**: Automatically displays the exact model executed by the gateway in the consolidated bottom status bar.

#### 🛠 Stability & Bug Fixes
- **Debounce & Loop Guard**: Fixed chatbox re-submission loops and ensured search input is cleared immediately upon submission.
- **Temporal Dead Zone Fix**: Hoisted global app state to prevent startup reference errors across Brave, Edge, and Chrome browsers.
- **Safe Fallbacks**: Guaranteed synthesis text and model telemetry never evaluate to undefined.

---

## 💎 [v3.1.0] — 2026-08-14
### **Dual-Lock 2FA Vault & Topic Tracker Automation**

#### 🔒 Dual-Lock Web Vault
- **AES-256 Local Encryption**: Browser-based encrypted vault with custom 2FA passphrase lock.
- **Zero Server Tracking**: 100% client-side privacy where API keys never touch any intermediary server.

#### 🔔 Autonomous Background Topic Tracker
- **Autonomous Scheduled Queries**: Configurable recurring background searches (every 15 min, 1 hr, 6 hrs, 24 hrs).
- **Discord Webhook Alerts**: Automatic push notifications of executive memos directly to Discord channels whenever major news or breakthroughs break.
- **Session Spend Ticker**: Real-time USD spend calculations based on official provider rate cards.

---

## ⚡ [v3.0.0] — 2026-08-10
### **Cortex Core Launch**
- Initial launch of **Cortex AI Search** at [cortex.ambulkar.com](https://cortex.ambulkar.com).
- Support for Gemini 3.6 Flash, OpenAI GPT-4o, Anthropic Claude 5, and OpenRouter auto-routing.
- Dark glassmorphic responsive UI built purely in Vanilla HTML5, CSS3, and ES6+ JavaScript.
- 4 Focused Research Desks: General Web, Financial Markets, Academic Papers, and Engineering & Code.
