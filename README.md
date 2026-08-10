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
    User([User Search Prompt]) --> Classifier[Effort & Query Classifier Agent]
    Classifier --> FocusMode{Focus Mode Router}
    
    FocusMode -->|All Web| ExtractDDG[DuckDuckGo Real-Time Search Engine]
    FocusMode -->|Academic Papers| SearchArxiv[Targeted ArXiv, PubMed & Nature Search]
    FocusMode -->|Code & Repos| SearchGithub[Targeted GitHub, StackOverflow & MDN Search]
    FocusMode -->|Financial Markets| SearchSEC[Targeted SEC EDGAR & Yahoo Finance Search]
    FocusMode -->|Writing & Creative| CreativeSynthesizer[Structured Creative Synthesis Engine]
    
    ExtractDDG --> MultiModelGateway[Multi-Model Provider Router]
    SearchArxiv --> MultiModelGateway
    SearchGithub --> MultiModelGateway
    SearchSEC --> MultiModelGateway
    CreativeSynthesizer --> MultiModelGateway
    
    MultiModelGateway -->|Default Free Route| FreeNeuralRoute[Ambulkar Engine (Gemini 3.6 Flash Free Neural)]
    MultiModelGateway -->|Gemini API| Gemini3[Google Gemini 3.6 / 3.1 Pro]
    MultiModelGateway -->|OpenAI API| GPT5[OpenAI GPT-5.6 Sol / Terra]
    MultiModelGateway -->|Claude API| Claude5[Anthropic Claude 5 Sonnet / Opus]
    
    FreeNeuralRoute -->|Quota Busy Fallback| LocalSynthesizer[Local Citation Synthesizer]
    FreeNeuralRoute --> Telemetry[Estimated Token & USD Spend Telemetry]
    LocalSynthesizer --> Telemetry
    Gemini3 --> Telemetry
    GPT5 --> Telemetry
    Claude5 --> Telemetry
    
    Telemetry --> UI[Interactive Citations & Responsive Chat View]
```

---

## ✨ Key Features

- ⚡ **Ambulkar Engine (Free Neural)**: Out-of-the-box 100% free live neural AI search powered by Gemini 3.6 Flash (zero user key required).
- 🧠 **Frontier Multi-Model Router**: Native routing for GPT-5.6 (Sol / Terra), Gemini 3.6 Flash / 3.1 Pro, Claude 5 (Sonnet / Opus), Kimi K3, GLM 5.2, Grok 4.5, and Nemotron 3 Ultra.
- 🎯 **Targeted Focus Search Modes**: Real-time domain search for All Web, Academic Papers (arXiv/PubMed), Code Repos (GitHub/StackOverflow), and Financial Markets (SEC EDGAR/Yahoo Finance).
- 🎨 **Dynamic Hero Query Suggestions**: Interactive, context-aware query suggestion cards that update automatically per Focus Mode.
- 📱 **Ultra-Clean Responsive Mobile UI**: Perplexity-style slide-over navigation drawer, single-row search bar controls, and compact typography scaling for all phone and tablet viewports.
- 💰 **Cost & Token Telemetry**: Real-time estimated USD spend ticker calculated based on published provider rate cards ($ USD / 1M tokens).
- 🔒 **100% Local Privacy Guarantee**: All API keys, search queries, and chat history remain exclusively inside the user's browser `localStorage`. Zero server tracking.

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
