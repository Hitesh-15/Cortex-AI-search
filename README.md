# Cortex 🧠

> **Frontier AI Search Engine, Deep Web Knowledge Aggregator & Parallel Multi-Model Reasoning Gateway**  
> Live App: [cortex.ambulkar.com](https://cortex.ambulkar.com) • [Release Notes](RELEASE_NOTES.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![Stack: Vanilla JS](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20ES6%2B-blue.svg)](https://developer.mozilla.org/)
[![AI: Multi-Model Gateway](https://img.shields.io/badge/AI-Parallel%20Multi--Model%20Routing-cyan.svg)](#-features)
[![Changelog](https://img.shields.io/badge/Changelog-Updated%20v3.6.0-emerald.svg)](RELEASE_NOTES.md)

Cortex is a state-of-the-art AI search engine and executive research memo platform. It synthesizes real-time facts across **10 to 20+ verified web sources**, executes parallel multi-model reasoning across frontier LLMs, and maintains 100% client-side privacy.

---

## 🏗 Architecture & Real-Time Research Pipeline

```mermaid
flowchart TD
    subgraph Ingestion["1. Query Ingestion & Context Routing"]
        UserQ["User Research Query / + New Search\n(@mention Autocomplete • Quick Hints)"]
        TrendingFeeds["Dynamic Trending Feeds\n(Google News • HackerNews • Wikipedia)"]
        Classifier["Effort & Focus Mode Router\n(Market • Financial • Academic • Code • Writing)"]
        UserQ --> Classifier
        TrendingFeeds --> Classifier
    end

    subgraph Crawler["2. Deep Parallel Web Crawler"]
        MultiCrawler["Multi-Engine Parallel Crawler"]
        DDG["DuckDuckGo Instant API"]
        Wiki["Wikipedia OpenSearch API"]
        HN["HackerNews Algolia API"]
        DomainIdx["Global Intelligence Index\n(Reuters, Bloomberg, ArXiv, SEC, Nature, PubMed, GitHub)"]
        
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
        Router{"Dynamic Model Router\n(@opus • @sonnet • @gemini • @thinking • @compare)"}
        Vault["Dual-Lock 2FA Vault\n(AES-256 Client-Side Key Storage)"]
        Vault -.->|Decrypts API Keys Locally| Router
        SourcesAggregator --> Router
        
        Router -->|@thinking Ensemble Tournament| ThinkingTournament["Stage 2: Best-of-N Tournament\n(Claude Opus 5 • Claude Sonnet 5 • Gemini 3.7 Thinking • DeepSeek R1 • o3-mini)"]
        Router -->|@parallel Pipeline| Stage1["Stage 1: Fast Fact Extraction\n(Gemini 3.7 Flash)"]
        Stage1 --> Stage2["Stage 2: Deep Synthesis & Reasoning\n(Claude Sonnet 5)"]
        Router -->|@compare Mode| Compare50["50/50 Dual Split View\n(Gemini 3.7 Flash vs Claude Sonnet 5)"]
        Router -->|Direct Tag Route| SingleModel["Frontier LLMs\n(Claude Opus 5 • Claude Sonnet 5 • Gemini 3.7 Flash • Grok 4.6 • GPT-4o • DeepSeek R1)"]
        Router -->|@free Tier| FreeNeural["Cortex Free Neural Engine"]
    end

    subgraph Processing["4. Synthesis, Telemetry & Post-Processing"]
        MemoAssembler["Executive Research Memo Assembler\n(Natural Inline Citations • 36px Compact Sources Drawer)"]
        Telemetry["Dynamic Model Telemetry & USD Spend Tracker\n(Live Rate Cards • Exact Model Name Resolution)"]
        FollowUps["Entity-Aware Dynamic Follow-up Engine\n(Thread-Aware Non-Repetitive Rotation)"]
        Discord["Autonomous Topic Tracker & Discord Alerts"]
        
        Stage2 --> MemoAssembler
        SingleModel --> MemoAssembler
        FreeNeural --> MemoAssembler
        
        MemoAssembler --> Telemetry
        MemoAssembler --> FollowUps
        MemoAssembler --> Discord
    end

    subgraph Output["5. User Presentation"]
        CleanUI["Content-First Minimalist Workspace\n(100% Top-Visible Memo + Interactive Verified Sources Drawer)"]
        MemoAssembler --> CleanUI
        FollowUps --> CleanUI
        Telemetry --> CleanUI
    end
```

---

## ✨ Key Features

- 🌐 **Deep Web Crawler (20+ Sources per Query)**: Simultaneously crawls and cross-references DuckDuckGo, Wikipedia, HackerNews, Reuters, Bloomberg, ArXiv, MIT Technology Review, Nature, SEC EDGAR, GitHub, StackOverflow, and PubMed.
- 🎨 **Content-First Clean UX**:
  - **Answer-First Viewport**: Executive memos are 100% visible at the top immediately with zero scrolling.
  - **Compact Inline Sources Strip (36px)**: Displays top verified chips alongside an on-demand slide-out sources drawer for all 20+ references.
  - **Natural Inline Citations**: Seamless clickable superscript citation numbers embedded directly in text without bracket clutter.
- ⚡ **Parallel Multi-Model Execution**: Supports chaining fast extraction models (e.g. Gemini 3.7 Flash) into deep reasoning models (e.g. Claude Sonnet 5) with multi-stage execution telemetry.
- 📊 **Dynamic Frontier Model Telemetry**: Dynamically resolves and displays exact frontier model names (e.g. *Gemini 3.7 Flash*, *Claude 3.7 Sonnet*, *Grok 3*), tokens, and calculated USD spend from live rate cards with zero gateway branding.
- 🔒 **Dual-Lock 2FA Vault & Local Privacy**: AES-256 local browser encryption for API keys. Zero server tracking, zero cloud key storage.
- 🔥 **Dynamic Trending Prompt Engine**: Real-time ingestion from Google News, HackerNews, and Wikipedia that auto-updates suggested research prompt cards with live breakthroughs so queries never get stale.
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
