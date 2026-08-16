# 🚀 Cortex Release Notes & Changelog

All notable changes, continuous architectural improvements, and daily/weekly feature updates to **Cortex** ([cortex.ambulkar.com](https://cortex.ambulkar.com)) are documented in this file.

---

## 🌟 [v3.8.1] — 2026-08-16
### **Visual Metric Sparklines, Progressive-Disclosure Accordion Expanders & CSS Screen Media Patch**

#### 📈 Embedded Visual Metric Sparklines
- **Lightweight SVG Trendlines**: Embedded SVG neon trend sparklines directly inside market pills (`S&P +0.62%`, `NASDAQ +0.94%`, `10Y 4.26%`, `Oil $76.80`), displaying asset trajectories at a glance.

#### 📂 Inline Accordion Drawers (`[ ▾ Breakdown / ▴ Collapse ]`)
- **Progressive Disclosure**: Keeps cards at a 5-second scannable height by default, while allowing users to smoothly unfold detailed compute percentages, supply chain deals, and monetary data points directly in place with smooth CSS transitions.

#### 🛠️ CSS Media Query Hierarchy Patch
- **Screen Media Fix**: Ensured global screen stylesheet boundaries are properly closed before `@media print` rules, guaranteeing glassmorphism, responsive grid geometry, and themed glowing borders render reliably across all mobile, tablet, and desktop web engines.

---

## 🌟 [v3.8.0] — 2026-08-16
### **Executive Bento Dashboard, Strategic Deals & M&A Tracker, 1-Click Discovery Chips & Institutional Telemetry**

#### 🍱 Executive 2x2 Bento Dashboard
- **Scannable Institutional Grid**: Replaced long text walls with a balanced, highly responsive 2x2 Bento Grid:
  - **`01` Global Markets & Capital Telemetry**: Real-time asset badges (S&P 500, NASDAQ, 10Y Yields) and semiconductor foundry supply chain rotation (TSMC, ASML, Nvidia CoWoS & HBM4).
  - **`02` Frontier AI & Reasoning**: Hybrid test-time compute benchmarks (Claude 3.7 Sonnet, DeepSeek-R1, OpenAI o3-mini) and open-weight serving economics (Llama 3.3 70B, Qwen 2.5).
  - **`03` Distributed Cloud & Power**: Sub-5ms Graph RAG hallucination reduction and 100kW+ direct-to-chip liquid-cooled rack density.
  - **`04` Strategic Deals, Alliances & M&A**: Amazon's $8B Anthropic/Trainium investment, TSMC 2nm wafer capacity lockups, and hyperscale nuclear power purchase agreements (Constellation Energy Three Mile Island).
- **Themed Glowing Micro-Borders**: Custom glowing glassmorphic hover effects tailored to each research domain (Cyan, Purple, Teal, Amber).

#### 🔍 Interactive Deep Dives & Prompt Discovery Strip
- **Card-Level Exploration Buttons**: Every Bento card features a 1-click **`→ Explore [Topic]`** button to trigger dedicated drill-downs into market specifics without retyping.
- **1-Click Topic Discovery Chips**: Dedicated discovery strip below the grid enabling instant drill-downs into TSMC supply chains, Nuclear PPAs, Reasoning Benchmarks, and Enterprise SaaS M&A.

#### 🏛️ Premier Institutional Source Ingestion
- **Authoritative Desk Prioritization**: Prioritizes premier global reporting outlets across Reuters Global Markets, Bloomberg, MIT Technology Review, Wall Street Journal, Financial Times, ArXiv, Nature Machine Intelligence, and SEC EDGAR.

---

## 🌟 [v3.7.1] — 2026-08-16
### **Executive Daily Digest Engine, Streamlined Settings & Multi-Page Print Layout**

#### 🌅 3-Section Executive Daily Digest
- **Structured Executive Intelligence**: Upgraded the Daily Digest synthesizer to generate a crisp, multi-section briefing:
  - **`01` Frontier AI Models & Reasoning**: Real benchmarks on test-time compute scaling (DeepSeek-R1, Claude 3.7 Sonnet, OpenAI o3-mini) and open-weight efficiency gains.
  - **`02` Distributed Cloud Infrastructure**: Production Graph RAG, sub-5ms HNSW vector retrieval, and dynamic GPU virtualization.
  - **`03` Macroeconomic Policy & CapEx**: Hyperscaler data center/semiconductor expenditure growth and interest rate dynamics.
- **Clean Briefing Titles**: Eliminated raw query echoes in favor of authoritative, clean headings (`Executive Daily Intelligence Briefing`).

#### ⚙️ Streamlined Client-Side Settings Architecture
- **Unified Dialog**: Merged separate redundant "Gateway" and "Vault" modals into a single, focused **Settings Modal**.
- **Transparent Client-Side Storage**: Clarified browser-isolated `localStorage` key management; removed confusing cross-device vault claims and redundant dropdowns.
- **Symmetrical 3-Button Sidebar Footer**: Clean layout featuring `Daily Digest` + 3 high-utility buttons (`[⚙️ Settings]`, `[📜 Release Notes]`, `[🗑️ Clear]`).

#### 🖨️ Multi-Page Print & PDF Architecture
- **Unbounded Multi-Page Flow**: Fixed `@media print` layout rules (`@page { size: letter portrait; margin: 1.5cm; }` and overflow overrides) to eliminate single-page clipping during PDF exports.

#### 🧪 Comprehensive Multi-Device Test Suite
- **100% Automated Coverage**: Validated static bindings, real-time comparisons, dynamic follow-up drill-downs, in-chat `@` model autocomplete, and mobile/tablet drawers across desktop, tablet, and phone viewports.

---

## 🌟 [v3.7.0] — 2026-08-16
### **Head-to-Head Comparison Mode, GitHub Deep Crawlers, One-Click Memo Exports (.MD/PDF) & Dynamic Intelligence**

#### ⚖️ Head-to-Head Comparison Matrix
- **Dual Entity Parallel Search**: Compare two frameworks, companies, or technologies side-by-side (e.g. `React vs Vue`, `NVDA vs AMD`, `FastAPI vs Express`).
- **Dedicated Comparison UI**: Built a clean dual-pill input row (`[A] Entity A vs [B] Entity B`) accessible via the search action bar or `@compare` quick-tag.
- **Comparative Synthesis Schema**: Formats answers into structured comparison sections covering High-Level Architecture, Capability Matrix, Benchmark Differences, and Strategic Verdicts.

#### 🌐 Specialized Deep Crawlers Expansion
- **GitHub Live API Crawler**: Directly queries open-source repositories via GitHub REST API, ranking codebases by star count and extracting architectural summaries into the live research context.
- **SEC EDGAR & Financial Disclosures**: Enhanced financial research queries with direct SEC corporate filings indices.
- **PubMed Biomedical Search**: Integrated peer-reviewed biomedical indices and clinical trials.

#### 📥 Executive Memo Export Suite
- **Download Markdown (.md)**: Instantly exports synthesized research memos as clean `.md` documents with formatted headings, timestamps, and citations.
- **Print & Clean PDF Mode**: Built a dedicated `@media print` stylesheet optimized for white-background, high-contrast, distraction-free PDF executive printing.
- **Rich-Text Clipboard Copy**: Instant 1-click clipboard export.

#### 💡 Dynamic Smart Follow-Up Generator
- **Contextual Inquiries**: Dynamically synthesizes 3 smart, clickable follow-up inquiry chips below each answer, allowing users to drill into specific performance trade-offs, security considerations, or deployment benchmarks with a single click.

---

## 🌟 [v3.6.3] — 2026-08-16
### **Decluttered Mobile Viewport Architecture & Touch-Optimized Swipeable Trays**

#### 📱 Minimalist Mobile Architecture (Web vs Mobile Separation)
- **Swipeable Mobile Hero Pill Tray**: Replaced tall, multi-card grids on mobile devices with a sleek horizontal swipeable action tray. Desktop maintains the full multi-card research view, while mobile gets a fast, zero-clutter interface.
- **Floating Mobile Search Capsule**: Engineered a touch-friendly rounded search capsule with a circular send button (`↑`), streamlined effort pill, and horizontal `@model` quick-tag strip.
- **Spacious Mobile Reading Layout**: Optimized mobile research answer margins, header cards, and source strips with zero horizontal overflow and fluid vertical rhythm.

---

## 🌟 [v3.6.2] — 2026-08-16
### **Bento Executive Memo Layout, Auto-Section Chunking & Welcoming Visual Hierarchy**

#### 🍱 Bento Section Chunking & Visual Hierarchy
- **Auto-Section Chunking Engine**: Automatically transforms raw AI output and markdown sections into distinct, beautifully formatted **Bento Section Cards** with gradient numbered pills (`01`, `02`, `03`), sub-heading badges, and hairline borders.
- **Hero Executive Intelligence Banner**: Renders a dedicated gradient hero card (`.memo-hero-header`) for top-level memo headings with cyan accent badges.
- **Translucent Metadata Strip**: Auto-formats `Date | Prepared for | Classification` into tactile, security-badged meta chips.
- **Strategic Outlook Callout Card**: Auto-detects `Conclusion:` or `Strategic Outlook:` sections and wraps them in an emerald-accented callout box with a chart-line icon.
- **Context Callout Notes**: Highlights `Context note:` statements in clean cyan callouts for effortless executive scanning.

---

## 🌟 [v3.6.1] — 2026-08-16
### **Executive Editorial Workspace, Resilient Dynamic Synthesis & Instant Copy Memo Action**

#### ✍️ Executive Editorial Workspace & Typography
- **Executive Slate Glass Gradient**: Replaced flat monochrome boxes with a vertical slate glass gradient (`rgba(15, 23, 42, 0.75)` to `rgba(10, 15, 29, 0.85)`) crowned by a subtle cyan top-border accent.
- **Reading Rhythm & Contrast**: Increased paragraph line-height to `1.78` and enhanced text contrast (`#cbd5e1` body / `#f8fafc` headings) for effortless long-form reading.
- **Tactile Citation Micro-Chips**: Interactive inline citations (`[1]`, `[2]`) now feature a soft violet glow and smooth hover animations.
- **Clean Executive Research Titles**: Removed leading question mark icons from query headings for a sharp, distraction-free reading experience.

#### ⚡ Resilient Dynamic Evidence Synthesis (Zero Dead Outputs)
- **Real-Time Fact Synthesis**: Replaced static templates with a dynamic research memo synthesizer that transforms live crawled search snippets and domains into structured **Executive Takeaways** and **Key Findings Matrices**.
- **Fail-Safe Briefings**: In the event of upstream API latency or rate limits, Cortex automatically constructs a coherent factual briefing directly from live crawled web sources so users never see *"No response generated."*

#### 📋 One-Click "Copy Memo" Action Toolbar
- **Direct Clipboard Export**: Built an executive `📋 Copy Memo` button directly into the telemetry footer. It automatically strips telemetry pills and copies the clean, formatted research text straight to the user's clipboard with instant `✓ Copied!` feedback.

#### 🧭 "Explore Next Dimensions" Discovery Cards
- **Interactive Follow-up Cards**: Redesigned related questions into interactive discovery cards with cyan left-border accents, subtle hover lifts, and clean arrow indicators `➔`.

---

## 🌟 [v3.6.0] — 2026-08-16
### **Interactive `@` Mention Autocomplete, Explicit `@sonnet`/`@opus` Tagging & Multi-Model Ensemble Thinking Tournament**

#### 🎯 Interactive `@` Mention Autocomplete Popup & Quick-Routing Hints
- **Zero-Friction Search Bar**: Replaced the static dropdown select menu with an interactive floating `@` mention autocomplete popup directly inside the search chatbox with full arrow-key and enter/click selection.
- **Visual Quick-Routing Hint Strip**: Clean interactive buttons (`@opus`, `@sonnet`, `@gemini`, `@compare`, `@parallel`) allow one-click insertion of workflow tags directly into the search bar.

#### 🧠 Explicit Claude Family Model Separation
- **Precise Family Mapping**: Differentiated Claude models so `@sonnet` explicitly routes to **Claude Sonnet 5** (`anthropic/claude-sonnet-5`) and `@opus` explicitly routes to **Claude Opus 5** (`anthropic/claude-opus-5`), eliminating ambiguous parent family tags.

#### 🏆 Multi-Model Ensemble Thinking Tournament (`@thinking`)
- **Parallel Best-of-N Tournament**: Typing `@thinking` (or `@ensemble`, `@best`) simultaneously queries all top 5 frontier reasoning engines (**Claude Opus 5**, **Claude Sonnet 5**, **Gemini 3.7 Flash Thinking**, **DeepSeek R1 MoE**, and **OpenAI o3-mini**) in parallel.

#### 📱 Mobile UI/UX Overhaul & Decluttering
- **Decluttered Mobile Viewport**: Streamlined floating bottom search bar, optimized action row padding, and reduced mobile answer container margins for maximized viewport content visibility.
- **Consolidated Single-Row Telemetry**: Merged spend, tokens, effort level, and model badges into a sleek, unified responsive telemetry strip, removing redundant duplicate boxes on single search runs.
- **Precision Rate Card Sanitization**: Fixed OpenRouter unmetered pricing bug (`-1`) that previously caused negative cost displays on variable-priced models, ensuring 100% accurate, strictly non-negative USD telemetry ($0.00000).

---

## 🌟 [v3.5.0] — 2026-08-16
### **Fluid Responsive 50/50 Dual Split View & Frontier Intelligence Model Refresh**

#### 🖥️ Fluid Responsive Dual Split View (`@compare`)
- **Full Viewport Space Utilization**: Replaced static 40% margin clamps with responsive, fluid workspace boundaries (`max-width: 1440px`), liberating screen real-estate on ultrawide, desktop, laptop, and tablet displays.
- **Exact 50/50 Side-by-Side Grid**: Engineered a non-overflowing two-column CSS grid (`minmax(0, 1fr) minmax(0, 1fr)`) with explicit word-wrapping so both Gemini 3.7 Flash and Claude Sonnet 5 cards receive equal 50% split width without right-edge clipping.
- **Mobile Stack Resilience**: Automatically transitions from two-column side-by-side to stacked/tabbed navigation on devices below 920px width.

#### 🧠 Frontier Intelligence Model Refresh (August 2026)
- **Updated Frontier Catalog**: Synchronized the inline selector, search query tags, and gateway settings with the latest August 2026 model releases:
  - **Claude Opus 5** (`@opus`): Maximum frontier intelligence for deep multi-step reasoning, architectural designs, and complex proofs (`anthropic/claude-opus-5`).
  - **Claude Sonnet 5** (`@sonnet`): Flagship hybrid reasoning, structured memos, and superior instruction-following (`anthropic/claude-sonnet-5`).
  - **Gemini 3.7 Flash** (`@gemini`): Sub-second frontier extraction workhorse with native `:batch` (50% discount) and `:thinking` reasoning modes (`google/gemini-3.7-flash`).
  - **Grok 4.6** (`@grok`): Real-time knowledge indexing, market sentiment analysis, and uncensored perspectives (`x-ai/grok-4.6`).
  - **ChatGPT (OpenAI o3-mini)** (`@chatgpt`): High-precision algorithmic coding and reasoning logic (`openai/o3-mini`, `openai/gpt-4o`).
  - **DeepSeek R1** (`@deepseek`): Open-weights 671B parameter Mixture-of-Experts reasoning engine (`deepseek/deepseek-r1`).
  - **Parallel Pipeline** (`@parallel`): Chained execution (Gemini 3.7 Flash Scraper ➔ Claude Sonnet 5 Thinker).
  - **Live Dynamic Model Sync**: Real-time background sync against OpenRouter model catalog with wildcard `@custom/<slug>` routing.

---

## 🌟 [v3.4.0] — 2026-08-16
### **Direct `@model` Query Tagging, Multi-Model `@compare` Mode & Precision Rate Card**

#### 🎯 Direct `@model` Query Tags & Inline Model Picker
- **Instant Search Tagging**: Directly route individual queries to specific frontier models without opening Settings:
  - `@claude <query>` ➔ Direct execution via **Claude 3.7 Sonnet** (deep mathematical & structured memos).
  - `@gemini <query>` ➔ Direct execution via **Gemini 3.7 Flash** (sub-second factual search).
  - `@grok <query>` ➔ Direct execution via **Grok 3 / Grok 2** (distinct perspective & real-time sentiment).
  - `@gpt4 <query>` ➔ Direct execution via **OpenAI GPT-4o**.
  - `@deepseek <query>` ➔ Direct execution via **DeepSeek R1**.
  - `@parallel <query>` ➔ Chains fast fact scraper into deep reasoning think tank.
  - `@free <query>` ➔ Runs on the **100% Free Neural Engine** ($0.00000).
  - `@custom/<model-slug> <query>` ➔ Target any of 300+ custom OpenRouter model IDs.
- **Search Bar Inline Model Picker**: Quick-select dropdown in the search action row synchronized with `@model` tags.

#### 🔀 Multi-Model Comparison Mode (`@compare`)
- **Side-by-Side Synthesis**: Typing `@compare <query>` simultaneously queries multiple frontier models (e.g. Gemini 3.7 Flash and Claude 3.7 Sonnet) and renders an interactive tabbed comparison workspace (`[⚡ Gemini View]` | `[🧠 Claude View]` | `[🔀 Split View Side-by-Side]`).

#### 💰 Precision Rate Card & Cumulative Cost Calculation
- **Accurate Zero-Cost Handling**: Fixed cumulative cost tracking to ensure free tiers ($0.00000) do not falsely increment thread tracking budgets.
- **Deterministic Gateway Routing**: Resolved model mapping so Deep Reasoning Tier strictly routes to Claude 3.7 Sonnet with tailored fallback chains.

---

## 🌟 [v3.3.0] — 2026-08-16
### **Dynamic Frontier Model Resolution, Contextual Follow-up Search & Streamlined UX**

#### 💡 Dynamic Context-Aware Follow-up Search Generator
- **Content & Entity Extraction**: Replaced static generic questions with a dynamic entity extractor that extracts salient nouns, key institutions, policy mechanisms, and numerical metrics directly from the query and synthesized answer.
- **Prefix Sanitization**: Strips dynamic prompt wrappers (e.g. *"Financial analysis, corporate disclosures, and earnings impact of..."*) to focus follow-ups cleanly on the core subject.
- **Thread-Aware Non-Repetitive Rotation**: Automatically tracks all previously generated follow-ups in the thread and rotates across 6 domain-tailored analytical angles (Macro catalysts, balance sheet impact, algorithmic bottlenecks, regulatory headwinds, comparative historical benchmarks, and forward forecasts) so 10+ repeated searches on the same topic always generate fresh follow-up angles.

#### 🧠 Dynamic Model Resolution & Multi-Model Telemetry
- **Dynamic Model Catalog Ingestion**: Connected Cortex to live API model catalogs, dynamically registering any newly released frontier model with automatic pricing and display name formatting.
- **Zero Gateway Branding**: Eliminated raw gateway strings (`openrouter/auto`) in favor of clean, human-readable frontier model names (e.g. *Gemini 3.7 Flash*, *Claude 3.7 Sonnet*, *Grok 3*, *DeepSeek V3*, *GPT-4o*).
- **Multi-Model Pipeline Telemetry**: Parallel extraction ➔ reasoning pipelines dynamically display the full model execution chain (e.g. `⚡ Gemini 3.7 Flash ➔ 🧠 Claude Sonnet 5`).
- **Novel Model Heuristic Parser**: Intelligent regular expression tokenizer automatically formats any future unmapped model releases (e.g. `mistral-large-3`, `gemini-4.0-pro`, `grok-5`) with clean capitalization and tags.

#### 🔄 Frictionless Desk Navigation & Intuitive "+ New Search"
- **Clean Action Button**: Renamed "+ New Research Desk Memo" to the intuitive **`+ New Search`**.
- **Instant Hero View Reset**: Fixed thread container clearing so clicking **+ New Search** or switching categories immediately clears prior DOM results and presents the clean research desk with category-specific prompt cards.
- **Unified Sidebar Event Handlers**: Deduplicated mobile and desktop navigation bindings for silky smooth category switching across Web, Finance, Academic, Code, and Creative Writing desks.

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

#### 🔥 Dynamic Trending Prompt Engine (Google News, HackerNews & ArXiv)
- **Real-Time Live Web Ingestion**: Connected Cortex suggested prompt cards to live public web feeds (Google News Technology, Google Business & Finance, HackerNews Front Page, and Wikipedia Frontier Science).
- **Auto-Updating Trending Prompts**: Automatically generates 4 fresh, cutting-edge research query cards per desk whenever new technological breakthroughs or market catalysts occur.
- **Smart 3-Hour TTL Caching**: Prompts load with 0ms latency from local cache on repeat visits, while auto-refreshing in the background every 3 hours.
- **Zero-Dependency Resilience**: Seamlessly falls back to curated baseline research templates if network feeds are offline or latency occurs.

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
