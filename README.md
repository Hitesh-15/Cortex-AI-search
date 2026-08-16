# Cortex 🧠

> **Frontier AI Search Engine, Deep Web Knowledge Aggregator & Parallel Multi-Model Reasoning Gateway**  
> Live App: [cortex.ambulkar.com](https://cortex.ambulkar.com) • [Release Notes](RELEASE_NOTES.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![Stack: Vanilla JS](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20ES6%2B-blue.svg)](https://developer.mozilla.org/)
[![AI: Multi-Model Gateway](https://img.shields.io/badge/AI-Parallel%20Multi--Model%20Routing-cyan.svg)](#-features)
[![Changelog](https://img.shields.io/badge/Changelog-Updated%20v3.8.0-emerald.svg)](RELEASE_NOTES.md)

Cortex is a state-of-the-art AI search engine and executive research memo platform. It synthesizes real-time facts across **10 to 20+ verified web sources**, executes parallel multi-model reasoning across frontier LLMs, and maintains 100% client-side privacy.

---

## 🏗 Architecture & Real-Time Research Pipeline

```mermaid
flowchart TD
    subgraph Ingestion["1. Query Ingestion & Context Routing"]
        UserQ["User Research Query / + New Search<br/>(In-Chat @mention Autocomplete • Quick Hints)"]
        TrendingFeeds["Dynamic Trending Feeds<br/>(Google News • HackerNews • Wikipedia)"]
        Classifier["Effort & Focus Mode Router<br/>(Market • Financial • Academic • Code • Writing)"]
        UserQ --> Classifier
        TrendingFeeds --> Classifier
    end

    subgraph Crawler["2. Deep Parallel Web Crawler"]
        MultiCrawler["Multi-Engine Parallel Crawler"]
        DDG["DuckDuckGo Instant API"]
        Wiki["Wikipedia OpenSearch API"]
        HN["HackerNews Algolia API"]
        DomainIdx["Global Intelligence Index<br/>(Reuters, Bloomberg, ArXiv, SEC, Nature, PubMed, GitHub)"]
        
        Classifier --> MultiCrawler
        MultiCrawler --> DDG
        MultiCrawler --> Wiki
        MultiCrawler --> HN
        MultiCrawler --> DomainIdx
        
        DDG --> SourcesAggregator["20+ Verified Sources Aggregator & Deduplicator"]
        Wiki --> SourcesAggregator
        HN --> SourcesAggregator
        DomainIdx --> SourcesAggregator
    end

    subgraph Gateway["3. Frontier Model & Reasoning Gateway"]
        Router["Dynamic Model Router<br/>(@opus • @sonnet • @gemini • @thinking • @compare)"]
        LocalKeyStorage["Client-Side Key Storage<br/>(100% Local Browser Privacy)"]
        LocalKeyStorage -.-> Router
        SourcesAggregator --> Router
        
        Router -->|"Ensemble Thinking Tournament"| ThinkingTournament["Stage 2: Best-of-N Tournament<br/>(Claude Opus • Claude Sonnet • Gemini Thinking • DeepSeek R1 • o3-mini)"]
        Router -->|"Parallel Pipeline"| Stage1["Stage 1: Fast Fact Extraction<br/>(Gemini 3.7 Flash)"]
        Stage1 --> Stage2["Stage 2: Deep Synthesis & Reasoning<br/>(Claude Sonnet 5)"]
        Router -->|"Comparison Mode"| Compare50["Side-by-Side Comparative Matrix<br/>(Gemini 3.7 Flash vs Claude Sonnet 5)"]
        Router -->|"Direct Model Route"| SingleModel["Frontier LLMs<br/>(Claude Opus • Claude Sonnet • Gemini Flash • Grok • ChatGPT o3 • DeepSeek R1)"]
        Router -->|"Free Built-In Route"| FreeNeural["Cortex Free Neural Engine"]
    end

    subgraph Processing["4. Synthesis, Telemetry & Post-Processing"]
        MemoAssembler["Executive Research Memo Assembler<br/>(Natural Inline Citations • 36px Compact Sources Drawer)"]
        Telemetry["Dynamic Model Telemetry & USD Spend Tracker<br/>(Live Rate Cards • Exact Model Name Resolution)"]
        FollowUps["Dynamic Smart Follow-up Inquiries<br/>(Contextual Sub-Question Drill-Downs)"]
        Discord["Autonomous Topic Tracker & Discord Alerts"]
        
        Stage2 --> MemoAssembler
        SingleModel --> MemoAssembler
        FreeNeural --> MemoAssembler
        
        MemoAssembler --> Telemetry
        MemoAssembler --> FollowUps
        MemoAssembler --> Discord
    end

    subgraph Output["5. User Presentation"]
        CleanUI["Content-First Minimalist Workspace<br/>(100% Top-Visible Memo + Interactive Verified Sources Drawer)"]
        MemoAssembler --> CleanUI
        FollowUps --> CleanUI
        Telemetry --> CleanUI
    end
```

---

## ✨ Key Features

- 🌐 **Deep Web Crawler (20+ Sources per Query)**: Simultaneously crawls and cross-references DuckDuckGo, Wikipedia, HackerNews, Reuters, Bloomberg, ArXiv, MIT Technology Review, Nature, SEC EDGAR, GitHub, StackOverflow, and PubMed.
- ⚖️ **Head-to-Head Comparison Mode**: Compare two technologies, companies, or frameworks side-by-side with structured trade-off matrices (`React vs Vue`, `NVDA vs AMD`).
- 🌅 **3-Section Executive Daily Digest**: Generates instant multi-domain briefings spanning AI Frontier Models, Distributed Cloud Infrastructure, and Capital Markets with concrete metrics and strategic outlooks.
- 📥 **Executive Memo Export Suite**: Instant Markdown (`.md`) download, multi-page clean print/PDF generation, and 1-click rich text clipboard copy.
- 💡 **Dynamic Smart Follow-Ups**: Contextual sub-inquiry chips for 1-click drill-downs into performance, security, and case studies without manual re-typing.
- 🎨 **Content-First Clean UX**:
  - **Answer-First Viewport**: Executive memos are 100% visible at the top immediately with zero scrolling.
  - **Compact Inline Sources Strip (36px)**: Displays top verified chips alongside an on-demand slide-out sources drawer for all 20+ references.
  - **Natural Inline Citations**: Seamless clickable superscript citation numbers embedded directly in text without bracket clutter.
- ⚡ **Parallel Multi-Model Execution**: Supports chaining fast extraction models (e.g. Gemini 3.7 Flash) into deep reasoning models (e.g. Claude Sonnet 5) with multi-stage execution telemetry.
- 📊 **Dynamic Frontier Model Telemetry**: Dynamically resolves and displays exact frontier model names (e.g. *Gemini 3.7 Flash*, *Claude 3.7 Sonnet*, *Grok 3*), tokens, and calculated USD spend from live rate cards with zero gateway branding.
- 🔒 **Client-Side Privacy**: 100% local browser storage for API keys. Zero server tracking, zero cloud key storage.
- 🔥 **Dynamic Trending Prompt Engine**: Real-time ingestion from Google News, HackerNews, and Wikipedia that auto-updates suggested research prompt cards with live breakthroughs so queries never get stale.
- 🔔 **Autonomous Topic Tracker**: Continuous background monitoring that dispatches instant Discord alerts whenever major news or breakthroughs break on your tracked topics.
- 📱 **Responsive Dark Glassmorphic Design**: Built purely with high-performance Vanilla HTML5, CSS3, and ES6+ JavaScript optimized across desktop, tablet, and phone viewports.

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
