# Cortex 🧠

> **Frontier AI Search Engine, Deep Web Knowledge Aggregator & Parallel Multi-Model Reasoning Gateway**  
> Live App: [cortex.ambulkar.com](https://cortex.ambulkar.com) • [Release Notes](RELEASE_NOTES.md)

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![Stack: Vanilla JS](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20ES6%2B-blue.svg)](https://developer.mozilla.org/)
[![AI: Multi-Model Gateway](https://img.shields.io/badge/AI-Parallel%20Multi--Model%20Routing-cyan.svg)](#-features)
[![Changelog](https://img.shields.io/badge/Changelog-Updated%20v4.7.0-emerald.svg)](RELEASE_NOTES.md)

Cortex is a state-of-the-art AI search engine and executive research memo platform. It synthesizes real-time facts across **10 to 20+ verified web sources**, executes parallel multi-model reasoning across frontier LLMs (**Claude 3.7 Sonnet, Claude Sonnet 5, Gemini 3.7 Flash, GPT-4o, DeepSeek R1**), and maintains 100% client-side privacy.

---

## 🏗 Architecture & Real-Time Research Pipeline

```mermaid
flowchart TD
    subgraph Security["1. Universal WebCrypto Auth Vault & Zero-Config Multi-Device Sync"]
        UserPin["Master Password / PIN"]
        RawKey["OpenRouter Key (sk-or-v1-...)"]
        PBKDF2["PBKDF2 (100k Rounds + SHA-256)"]
        AESGCM["AES-256-GCM Encryption"]
        LocalVault["Encrypted Vault in localStorage"]
        QRSync["1-Second QR Code Multi-Device Sync"]
        PairCode["6-Digit Device Auto-Sync (CTX-XXXXXX)"]
        
        RawKey & UserPin --> PBKDF2 --> AESGCM --> LocalVault
        LocalVault --> QRSync & PairCode
    end

    subgraph TemporalEngine["2. Real-Time Temporal Grounding Engine"]
        ClockTick["1000ms Interval Clock Counter"]
        TimestampFormat["Live UTC ISO-8601 & Local Timezone"]
        HeaderPulse["Live Pulse Header Clock Badge"]
        PromptAnchor["System Prompt Recency Injector (2026 Grounding)"]
        
        ClockTick --> TimestampFormat --> HeaderPulse & PromptAnchor
    end

    subgraph Ingestion["3. Query Ingestion & Context Routing"]
        UserQ["User Research Query / + New Search<br/>(In-Chat @mention Autocomplete • Quick Hints)"]
        TrendingFeeds["Dynamic Trending Feeds<br/>(Google News • HackerNews • Wikipedia)"]
        Classifier["Effort & Focus Mode Router<br/>(Market • Financial • Academic • Code • Writing)"]
        UserQ --> Classifier
        TrendingFeeds --> Classifier
    end

    subgraph Crawler["4. Deep Parallel Web Crawler"]
        MultiCrawler["Multi-Engine Parallel Crawler"]
        DDG["DuckDuckGo Instant API"]
        Wiki["Wikipedia OpenSearch API"]
        HN["HackerNews Algolia API"]
        DomainIdx["Global Intelligence Index<br/>(Reuters, Bloomberg, ArXiv, SEC, Nature, PubMed, GitHub)"]
        
        Classifier --> MultiCrawler
        MultiCrawler --> DDG & Wiki & HN & DomainIdx
        DDG & Wiki & HN & DomainIdx --> SourcesAggregator["20+ Verified Sources Aggregator & Deduplicator"]
    end

    subgraph Gateway["5. Frontier Model & Reasoning Gateway"]
        Router["Dynamic Model Router<br/>(@opus • @sonnet • @gemini • @thinking • @compare)"]
        LocalVault -.->|PIN Unlock| Router
        PromptAnchor --> Router
        SourcesAggregator --> Router
        
        Router -->|"Ensemble Thinking Tournament"| ThinkingTournament["Stage 2: Best-of-N Tournament<br/>(Claude Opus • Claude Sonnet • Gemini Thinking • DeepSeek R1 • o3-mini)"]
        Router -->|"Parallel Pipeline"| Stage1["Stage 1: Fast Fact Extraction<br/>(Gemini 3.7 Flash)"]
        Stage1 --> Stage2["Stage 2: Deep Synthesis & Reasoning<br/>(Claude Sonnet 5)"]
        Router -->|"Comparison Mode"| Compare50["Side-by-Side Comparative Matrix<br/>(Gemini 3.7 Flash vs Claude Sonnet 5)"]
        Router -->|"Direct Model Route"| SingleModel["Frontier LLMs<br/>(Claude Opus • Claude Sonnet • Gemini Flash • Grok • OpenAI o3-mini • DeepSeek R1)"]
        Router -->|"Free Built-In Route"| FreeNeural["Cortex Free Neural Engine (Dynamic Fact Synthesis)"]
    end

    subgraph Processing["6. Synthesis, Citation Engine & Post-Processing"]
        MemoAssembler["Executive Research Memo Assembler<br/>(Single-Pass [N] Citation Normalizer • Section Standardizer)"]
        Telemetry["Dynamic Model Telemetry & USD Spend Tracker<br/>(Live Rate Cards • Exact Model Name Resolution)"]
        FollowUps["Dynamic Smart Follow-up Inquiries<br/>(Contextual Sub-Question Drill-Downs)"]
        ThreadStore["Thread History Restoration Engine<br/>(Bidirectional Sidebar Switching & Viewport Lock)"]
        Discord["Autonomous Topic Tracker & Discord Alerts"]
        
        Stage2 --> MemoAssembler
        SingleModel --> MemoAssembler
        FreeNeural --> MemoAssembler
        
        MemoAssembler --> Telemetry & FollowUps & ThreadStore & Discord
    end

    subgraph Output["7. Multi-Device Adaptive Presentation Layer"]
        LargeMonitor["Large Monitor & Ultrawide Alignment Engine<br/>(27', 33'/34' Ultrawide, 4K Grid Alignment • Proportional Sidebar)"]
        MobilePWA["Standalone Homescreen PWA Architecture<br/>(iOS Dynamic Island / Notch & Android Safe Areas • 100dvh • 0% Overflow)"]
        ModernUI["OLED Obsidian Canvas + Glassmorphism 2.0<br/>(Floating Spotlight Dock Scrim + Bento Viewport)"]
        
        MemoAssembler --> ModernUI
        ModernUI --> LargeMonitor & MobilePWA
    end
```

---

## ✨ Key Features

- 🖥️ **Large Monitor & Ultrawide Alignment Engine**: Full layout alignment across 27-inch (`1240px`), 33"/34" ultrawide (`1420px`), and 4K displays with synchronized vertical bounding guidelines between header tickers, suggested prompts, memo answers, and search dock.
- 📱 **Standalone Homescreen Bookmark & PWA Architecture**: Native web app experience with full `viewport-fit=cover`, dynamic iOS notch / Dynamic Island safe-area insets (`env(safe-area-inset-top)`), and bottom home swipe indicator / Android gesture nav clearance (`env(safe-area-inset-bottom)`).
- ⏱️ **Live 1-Second Precision Clock & Recency Anchoring**: Continuous 1000ms temporal clock engine injecting live UTC ISO-8601 timestamps and local timezone into all LLM prompts to ground time-sensitive research queries.
- 🔑 **Universal WebCrypto Auth Vault (AES-256-GCM + PBKDF2)**: Bank-grade client-side key encryption. Unlock your frontier models using a memorable PIN on any device without copying raw API keys.
- ☁️ **Zero-Config 6-Digit Auto-Sync & QR Pairing**: Link laptops, desktops, and mobile devices in seconds via memorized 6-digit sync code or QR code scan with 100% client-side end-to-end encryption.
- 🎨 **2026 Modern Design & UI/UX Revamp**:
  - **OLED Void Backdrop (`#030712`)**: Atmospheric radial glow meshes and sleek dark mode aesthetics.
  - **Glassmorphism 2.0**: High-clarity frosted glass blurs (`backdrop-filter: blur(28px) saturate(190%)`), specular inner highlights, and translucent borders.
  - **Floating Spotlight Command Dock**: Multi-line elastic search bar with embedded reasoning effort dials, quick model chips, file attachments, and comparison triggers.
  - **Bento-Box Research Viewport**: Scannable briefing cards, interactive citation badges `[1]`, `[2]`, horizontal sources ribbon with real domain favicons, and unified telemetry.
- ⚡ **Zero-Boilerplate Dynamic Factual Synthesis**: Automatically extracts and synthesizes authentic news quotes, statistics, and domain facts from live crawled web sources in free/offline mode.
- 🌐 **Deep Web Crawler (20+ Sources per Query)**: Simultaneously crawls and cross-references DuckDuckGo, Wikipedia, HackerNews, Reuters, Bloomberg, ArXiv, MIT Technology Review, Nature, SEC EDGAR, GitHub, StackOverflow, and PubMed.
- ⚖️ **Head-to-Head Comparison Mode**: Compare two technologies, companies, or frameworks side-by-side with structured trade-off matrices (`React vs Vue`, `NVDA vs AMD`).
- 🌅 **Executive Daily Digest**: Generates instant multi-domain briefings spanning AI Frontier Models, Distributed Cloud Infrastructure, and Capital Markets with concrete metrics.
- 📥 **Executive Memo Export Suite**: Instant Markdown (`.md`) download, multi-page clean print/PDF generation, and 1-click rich text clipboard copy.
- 🔔 **Autonomous Topic Tracker**: Continuous background monitoring with instant Discord alerts on breaking news.
- 📱 **Responsive Dark Glassmorphic Design**: Built purely with high-performance Vanilla HTML5, CSS3, and ES6+ JavaScript optimized across desktop, ultrawide, tablet, and mobile viewports.

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

Run the automated test suites to verify element bindings, DOM structure, responsiveness, and standalone homescreen mode:
```bash
# 1. Full E2E Multi-Device Desktop, Tablet & Phone Test Suite
python test_cortex_ui.py

# 2. Standalone Homescreen PWA Mobile Viewport Audit
python test_mobile_homescreen.py
```

---

## 📜 License

This project is licensed under the [MIT License](LICENSE) — free to use and modify for open-source contributions and portfolio showcases.
