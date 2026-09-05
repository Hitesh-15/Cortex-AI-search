# Cortex AI Platform Harness Architecture

## 1. Role & Goal
The Cortex Harness is the deterministic operating system surrounding the AI model. It orchestrates query understanding, hybrid multi-index retrieval, client-side code and math sandboxes, and verification guardrails. It ensures every response is grounded in factual evidence, mathematically accurate, and synthesized without conversational pleasantries or synthetic filler.

## 2. Startup Workflow
When a coding agent or engineer begins work on Cortex:
1. Verify git status and active branch (`main`).
2. Run `python scratch/check_js.py` to confirm the baseline is 100% clean of browser errors.
3. Review `CORTEX_V5_ROADMAP.md` for current phase goals.
4. Execute changes within modular boundaries (`src/`) rather than bloating `app.js`.

## 3. Execution Flow
The agent harness operates in a cyclic 4-stage unrolled loop:
```text
┌───────────────────────────────────────────────────────────┐
│                      1. OBSERVE                           │
│ Ingest query, resolve topic desk, fetch multi-index docs  │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│                       2. PLAN                             │
│ Decompose research goals, identify tool call requirements │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│                        3. ACT                             │
│ Execute sandboxed code/math, render charts, synthesize    │
└─────────────────────────────┬─────────────────────────────┘
                              │
                              ▼
┌───────────────────────────────────────────────────────────┐
│                      4. REFLECT                           │
│ Audit citations, highlight passage evidence, format output│
└───────────────────────────────────────────────────────────┘
```

## 4. Component Architecture Map
```text
User Interface (Vanilla HTML5/CSS3)
       │
       ▼
CortexEventBus (src/core/event_bus.js)
       │
       ├─────────────────────────┬─────────────────────────┐
       ▼                         ▼                         ▼
CortexAgentHarness        CortexToolRegistry      CortexRetrievalEngine
(src/core/agent_harness.js) (src/core/tools.js) (src/retrieval/retrieval_engine.js)
       │                         │                         │
       ├─────────────────────────┼─────────────────────────┤
       ▼                         ▼                         ▼
CortexComputeSandbox      CortexCodeSandbox         CortexChartStudio
(src/sandbox/compute_sandbox.js) (src/sandbox/code_sandbox.js) (src/sandbox/chart_studio.js)
       │                         │                         │
       └─────────────────────────┴─────────────────────────┘
                                 │
                                 ▼
                     CortexGuardrails & Verifier
                  (src/verification/guardrails.js)
                                 │
                                 ▼
                 Standard 4-Part Grounded Output
```

## 5. Subsystem Directory Specifications

### A. Core Runtime (`src/core/`)
- `event_bus.js`: Non-blocking, event-driven telemetry (`CortexEventBus`) tracking query latencies, model responses, and tool executions.
- `tools.js`: Formal declarative tool registry (`CortexToolRegistry`) managing typed parameter schemas, execution timeouts, and error isolation.
- `agent_harness.js`: The central runtime loop managing observation, tool dispatch, and answer synthesis.

### B. Sandboxes & Visualization (`src/sandbox/`)
- `code_sandbox.js`: In-browser client-side execution sandbox (`CortexCodeSandbox`) with isolated scope, intercepted `console.log` capture, and stdout terminal drawer.
- `compute_sandbox.js`: Deterministic high-precision computation (`CortexComputeSandbox`) for arithmetic, CAGR, statistics, and financial modeling.
- `chart_studio.js`: Zero-dependency SVG vector charting engine (`CortexChartStudio`) rendering time-series lines and comparative horizontal bars.

### C. Retrieval & Verification (`src/retrieval/`, `src/verification/`)
- `retrieval_engine.js`: Multi-index candidate retrieval, semantic re-ranking, and token-budget context packing (2048 token ceiling).
- `guardrails.js`: Boundary guardrails (`CortexGuardrails`) providing refusal suppression, citation auditing, and passage evidence highlighting.

## 6. Tool Registry & Schemas
All tools registered in `CortexToolRegistry` adhere to standard schemas:
- `cortex_compute_sandbox`: Evaluates math formulas and quantitative questions with exact precision.
- `cortex_code_runner`: Safely runs client-side JavaScript or algorithms and streams output.
- `cortex_chart_generator`: Emits responsive SVG vector charts for tabular or comparative data.
- `cortex_evidence_verifier`: Cross-matches inline citations against retrieved passage text.

## 7. Verification / Definition of Done
The task is only complete when:
1. `python scratch/check_js.py` reports 0 browser syntax or runtime errors.
2. `python scratch/test_modular_runtime.py` passes 100% across all modular engines.
3. `python scratch/test_all_in_one_features.py` passes 100% across sandboxes, charts, and slash commands.
4. `python scratch/test_every_feature.py` passes all 58 UI feature tests.
5. All inline citations `[N]` correctly open or highlight their corresponding source drawer entries.

## 8. Security & Boundary Safeguards
- Zero Server Side Effects: Code runs locally in isolated browser function closures.
- Credentials Isolation: Keys are stored exclusively in client-side encrypted LocalStorage (`cortex_auth_vault`).
- Untrusted Search Text: Retrieved web pages are parsed strictly as text evidence, preventing prompt injection attacks.
- Strict Brand Neutrality: Zero third-party commercial brand names or competitor trademarks are permitted in the codebase or documentation.
