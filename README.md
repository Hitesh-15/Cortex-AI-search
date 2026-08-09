# Ambulkar Cortex 🧠

> **Frontier AI Search Engine & Multi-Model Neural Gateway**  
> Custom Domain: [cortex.ambulkar.com](https://cortex.ambulkar.com)

[![License: MIT](https://img.shields.io/badge/License-MIT-purple.svg)](LICENSE)
[![Stack: Vanilla JS](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20JS-blue.svg)](https://developer.mozilla.org/)
[![AI: Frontier LLMs](https://img.shields.io/badge/AI-Multi--Model%20Gateway-cyan.svg)](#-features)
[![Vibe Coding](https://img.shields.io/badge/Vibe%20Coding-AI%20Pair%20Programmed-emerald.svg)](#-vibe-coding--architectural-highlights)

Ambulkar Cortex is a state-of-the-art AI search engine and reasoning gateway. It aggregates real-time web citations, agentic deep reasoning, and cost-aware multi-model execution across frontier LLMs.

---

## 🏗 Architecture & Agentic Workflow

```mermaid
flowchart TD
    User([User Prompt]) --> Classifier[Effort & Query Classifier Agent]
    Classifier --> FocusMode{Focus Mode Routing}
    
    FocusMode -->|Web Search| ExtractDDG[DuckDuckGo Citation Extractor]
    FocusMode -->|Academic/Code/Finance| FilterSources[Context-Aware Web Scraper]
    
    ExtractDDG --> MultiModelGateway[Multi-Model Provider Router]
    FilterSources --> MultiModelGateway
    
    MultiModelGateway -->|Local Free| HybridEngine[Ambulkar Engine]
    MultiModelGateway -->|Gemini API| Gemini3[Google Gemini 3.6 / 3.1 Pro]
    MultiModelGateway -->|OpenAI API| GPT5[OpenAI GPT-5.6 Sol / Terra]
    MultiModelGateway -->|Claude API| Claude5[Anthropic Claude 5 Sonnet / Opus]
    
    HybridEngine --> Telemetry[Token & USD Spend Telemetry Engine]
    Gemini3 --> Telemetry
    GPT5 --> Telemetry
    Claude5 --> Telemetry
    
    Telemetry --> UI[Interactive Citation & Response View]
```

---

## ✨ Key Features

- 🧠 **Frontier AI Models**: Native routing for GPT-5.6 (Sol / Terra), Gemini 3.6 Flash / 3.1 Pro, Claude 5 (Sonnet / Opus), Kimi K3, GLM 5.2, Grok 4.5, and Nemotron 3 Ultra.
- ⚡ **Ambulkar Hybrid Engine**: 100% free local hybrid processing engine.
- 🌐 **Real-Time Web Citations**: Automated web source extraction with numbered citation badges (`[1]`, `[2]`).
- 🎯 **Focus Search Modes**: All Web, Academic Papers, Code Repos, and Financial Markets.
- 💰 **Cost & Token Telemetry**: Real-time USD spend ticker tracking exact token consumption across queries.
- 🔒 **100% Privacy & Local Key Storage**: All provider API keys are saved exclusively in the browser's `localStorage`.

---

## ⚡ Vibe Coding & Architectural Highlights

This repository was designed and engineered as a showcase of modern **Vibe Coding** and **GenAI Software Architecture**:
- **Zero Heavy Framework Bloat**: Built purely with high-performance Vanilla HTML5, CSS3, and ES6+ JS for instant load times (<50ms).
- **Automated Testing Suite**: Includes an automated Microsoft Edge Selenium test suite (`test_edge_automation.py`) validating DOM interactions and browser state.
- **Client-Side Privacy Architecture**: Solves cloud security by leveraging local browser `localStorage` encryption for API keys.

---

## 🚀 Quick Start

1. Clone or open the repository:
   ```bash
   git clone https://github.com/<your-username>/ambulkar-cortex.git
   cd ambulkar-cortex
   ```
2. Serve locally with any static web server:
   ```bash
   python -m http.server 8000
   ```
3. Open `http://localhost:8000/` in your browser.

---

## 🛠 Tech Stack

- **Frontend**: Vanilla HTML5, Modern CSS3 (Dark Glassmorphism UI), Vanilla JavaScript (ES6+).
- **Icons & Typography**: Font Awesome 6 (Free License), Google Fonts (*Outfit*, *Plus Jakarta Sans*, *JetBrains Mono* - Open Font License).
- **Testing**: Selenium Edge Automated Testing Suite.

---

## 🔒 Security & API Key Privacy

- **Zero Hardcoded Keys**: No API keys or secrets exist in the source code or Git history.
- **Client-Side Storage**: All API keys entered in the UI are saved strictly in the user's local browser `localStorage`.
- **Direct API Calls**: API calls are made directly from the user's browser to the official provider endpoints (Google Gemini, OpenAI, Anthropic, OpenRouter). No intermediate server stores or sees your keys.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE) — free to use, modify, and showcase for personal portfolios, educational demos, and open-source contributions.
