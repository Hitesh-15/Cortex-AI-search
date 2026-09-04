# Cortex v5.0 Master Roadmap & Versioned Release Plan

This document outlines the phased, versioned development roadmap for Cortex. Each version is self-contained, with independent Git tags and commits to guarantee clear rollback points, modular testing, and progressive enhancement.

---

## 🗺️ Versioned Release Schedule

| Version | Focus Area | Key Capabilities |
| :--- | :--- | :--- |
| **v5.0** | **Autonomous Deep Research & Multi-Format Compute Studio** | Recursive multi-step exploration agent, live execution stepper, automated executive whitepaper generation, downloadable reports & presentation slide decks (`.pptx`, `.docx`, `.pdf`, markdown). |
| **v5.1** | **Client-Side Code Sandbox & Active Compute Engine** | In-browser Python execution via Pyodide/WebAssembly, client-side dataset math, dynamic charts (Plotly/Chart.js), and live interactive UI artifact previews. |
| **v5.2** | **Dual-Speaker Studio Audio Briefings & Conversational Voice Agent** | Two-host dialogue synthesis, interactive voice Q&A, hands-free Voice Activity Detection (VAD). |
| **v5.3** | **Institutional SEC EDGAR & Financial Intelligence Terminal** | 10-K, 10-Q, 8-K live filing parser, financial statement waterfalls, earnings call transcript analysis. |
| **v5.4** | **Zero-Cost Local AI & Private WebGPU/Ollama Gateway** | In-browser local model inference (WebLLM) and 1-click Ollama / LM Studio connector (`localhost:11434`). |
| **v5.5** | **Infinite Spatial Research Canvas & Knowledge Graph** | 2D node-based canvas, visual relationship mapping, thread clustering, visual export. |
| **v5.6** | **Connected Workspace Ecosystem & Direct Integrations** | Direct 1-click sync to Notion, Obsidian, Google Docs, Slack, and Discord webhooks. |

---

## Detailed Specification: Version 5.0 (Current Target)

### 1. Objective
Transform Cortex from a single-shot search engine into an **Autonomous Deep Research Agent & Executive Document/Report/Deck Generator**. Users can trigger a "Deep Research" workflow or ask Cortex to *"Compute a competitive market report for Q3 with slide deck and executive brief."*

### 2. Architectural Components
1. **Agentic Execution Engine (`DeepResearchAgent`)**:
   - Decomposes queries into 3–5 targeted sub-hypotheses.
   - Concurrently collects and verifies findings across multiple intelligence sources.
   - Synthesizes findings with cross-model validation and real citation tracking.
2. **Interactive Live Stepper UI**:
   - Visual step-by-step progress indicator in the UI:
     `[Decomposing Research Goal] -> [Executing Sub-Queries] -> [Fact-checking Evidence] -> [Assembling Executive Deliverable]`.
3. **Multi-Format Export & Compute Studio**:
   - **Executive Whitepaper / Report**: Richly formatted multi-page research brief with executive summary, tables, and references.
   - **Presentation Slide Deck Generator**: Client-side generation of presentation decks (`.pptx` via `pptxgenjs` or styled HTML presentations) ready for meetings.
   - **Formatted Document Generator**: 1-click download as clean Word document (`.docx`), formatted Markdown (`.md`), or printable PDF.
4. **Safety & Rollback Strategy**:
   - Tagged commit `v4.8.2-stable` before starting.
   - Modular integration into `app.js` and `styles.css` without modifying the core fast-search path.
