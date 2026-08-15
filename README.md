# Cortex 🧠

> **Frontier AI Search Engine, Deep Web Knowledge Aggregator & Parallel Multi-Model Reasoning Gateway**  
> Live App: [cortex.ambulkar.com](https://cortex.ambulkar.com) • [Release Notes](RELEASE_NOTES.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![Stack: Vanilla JS](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20ES6%2B-blue.svg)](https://developer.mozilla.org/)
[![AI: Multi-Model Gateway](https://img.shields.io/badge/AI-Parallel%20Multi--Model%20Routing-cyan.svg)](#-features)
[![Changelog](https://img.shields.io/badge/Changelog-Updated%20v3.2.0-emerald.svg)](RELEASE_NOTES.md)

Cortex is a state-of-the-art AI search engine and executive research memo platform. It synthesizes real-time facts across **10 to 20+ verified web sources**, executes parallel multi-model reasoning across frontier LLMs, and maintains 100% client-side privacy.

---

## 🏗 Architecture & Research Pipeline

```mermaid
flowchart TD
    User(["User Research Query"]) --> Classifier["Effort & Focus Mode Classifier Agent"]
    
    Classifier --> MultiCrawler["Deep Parallel Web Crawler"]
    MultiCrawler --> DDG["DuckDuckGo Instant API"]
    MultiCrawler --> Wiki["Wikipedia Live OpenSearch API"]
    MultiCrawler --> HN["HackerNews / Tech Algolia API"]
    MultiCrawler --> DomainIdx["Global Indices (Reuters, Bloomberg, ArXiv, SEC, Nature, GitHub)"]
    
    DDG --> SourcesAggregator["20+ Verified Sources Aggregator & Deduplicator"]
    Wiki --> SourcesAggregator
    HN --> SourcesAggregator
    DomainIdx --> SourcesAggregator
    
    SourcesAggregator --> Router{"Frontier Model Router"}
    
    Router -->|Parallel Pipeline| Stage1["Stage 1: Fast Factual Extraction (Gemini 3.7 Flash)"]
    Stage1 --> Stage2["Stage 2: Deep Mathematical Reasoning & Synthesis (Claude Sonnet 5)"]
    
    Router -->|Standard Route| SingleModel["Frontier Model (Gemini 3.7 / GPT-4o / Claude 5 / OpenRouter Auto)"]
    Router -->|Free Engine| FreeNeural["Cortex Free Neural Engine"]
    
    Stage2 --> MemoAssembler["Executive Research Memo Assembler"]
    SingleModel --> MemoAssembler
    FreeNeural --> MemoAssembler
    
    MemoAssembler --> CleanUI["Content-First UI (Compact Sources Strip + Natural Inline Citations)"]
    MemoAssembler --> DiscordDispatch["Discord Executive Alert Dispatcher"]
```

---

## ✨ Key Features

- 🌐 **Deep Web Crawler (20+ Sources per Query)**: Simultaneously crawls and cross-references DuckDuckGo, Wikipedia, HackerNews, Reuters, Bloomberg, ArXiv, MIT Technology Review, Nature, SEC EDGAR, GitHub, StackOverflow, and PubMed.
- 🎨 **Content-First Clean UX**:
  - **Answer-First Viewport**: Executive memos are 100% visible at the top immediately with zero scrolling.
  - **Compact Inline Sources Strip (36px)**: Displays top verified chips alongside an on-demand slide-out sources drawer for all 20+ references.
  - **Natural Inline Citations**: Seamless clickable superscript citation numbers embedded directly in text without bracket clutter.
- ⚡ **Parallel Multi-Model Execution**: Supports chaining fast extraction models (e.g. Gemini 3.7 Flash) into deep reasoning models (e.g. Claude Sonnet 5) for ultra-accurate synthesis.
- 📊 **Post-Query Executed Model Telemetry**: Automatically displays the exact model executed by the gateway, prompt/completion tokens, and estimated USD spend calculated from official rate cards.
- 🔒 **Dual-Lock 2FA Vault & Local Privacy**: AES-256 local browser encryption for API keys. Zero server tracking, zero cloud key storage.
- 🔔 **Autonomous Topic Tracker**: Continuous background monitoring that dispatches instant Discord alerts whenever major news or breakthroughs break on your tracked topics.
- 📱 **Ultra-Responsive Dark Glassmorphic Design**: Built purely with high-performance Vanilla HTML5, CSS3, and ES6+ JavaScript for blazing fast load times (<50ms).

---

## 📅 Release Notes & Daily Updates

We maintain a comprehensive changelog documenting all daily, weekly, and monthly improvements:
👉 **[View Full Release Notes & Changelog (RELEASE_NOTES.md)](RELEASE_NOTES.md)**

---

## 🚀 Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/Hitesh-15/Cortex-AI-search.git
   cd Cortex-AI-search
   ```
2. Serve locally with any static web server:
   ```bash
   python -m http.server 5173
   ```
3. Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧪 Automated Testing

Run the automated UI test suite to verify element bindings, DOM structure, and HTTP response:
```bash
python test_cortex_ui.py
```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE) — free to use and modify for open-source contributions and portfolio showcases.
