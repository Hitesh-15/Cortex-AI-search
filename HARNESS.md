# Cortex AI Platform Harness Architecture

## 1. Objective
Cortex is an all-in-one verified intelligence engine, deterministic computation runtime, and autonomous deliverable studio. It grounds every factual claim in verified primary evidence, provides in-browser code and mathematical sandboxes, and synthesizes executive deliverables without conversational pleasantries, robotic boilerplate, or synthetic filler.

## 2. System Boundary
- **In Scope**:
  - Multi-source search retrieval, index federation, and semantic passage ranking.
  - Citation realignment and deep passage evidence grounding (`data-source-num`).
  - Client-side deterministic computation (CAGR, variance, mean, correlation).
  - In-browser sandboxed code execution and standard output streaming.
  - Zero-dependency responsive SVG vector data visualization (Line, Bar).
  - Autonomous 5-stage synthesis of executive whitepapers and 16:9 presentation decks.
- **Out of Scope**:
  - Non-grounded speculative generations without reference anchoring.
  - Destructive filesystem or network writes without explicit user action.
  - Refusal boilerplate, synthetic pleasantries, or apologetic conversational framing.

## 3. Component Architecture Map
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

## 4. Subsystem Specifications

### A. Core Runtime (`src/core/`)
1. **Event Bus (`event_bus.js`)**: Decoupled, non-blocking pub/sub telemetry for queries, tool execution, model latencies, and token counters.
2. **Tool Registry (`tools.js`)**: Declarative JSON schema registry managing permission scopes, input validation, and execution handlers.
3. **Agent Harness (`agent_harness.js`)**: Multi-turn planning, model invocation, tool dispatch, and verification lifecycle.

### B. Sandboxes & Visualization (`src/sandbox/`)
1. **Compute Sandbox (`compute_sandbox.js`)**: High-precision deterministic calculation engine for CAGR, mean, median, standard deviation, and Pearson correlation.
2. **Code Sandbox (`code_sandbox.js`)**: In-browser client-side code runner with isolated console capture, execution timer, and copy/run controls.
3. **Chart Studio (`chart_studio.js`)**: Zero-dependency vector SVG chart engine supporting temporal line graphs, comparative bars, and sparklines.

### C. Retrieval & Verification (`src/retrieval/`, `src/verification/`)
1. **Retrieval Engine (`retrieval_engine.js`)**: Multi-index search retrieval, reciprocal-rank fusion, and token-budget context packing (2048 token ceiling).
2. **Guardrails & Verification (`guardrails.js`)**: Refusal suppression, citation auditing, source alignment, and passage evidence highlighting.

## 5. Security & Isolation Controls
- In-browser code execution runs in sandboxed functions with intercepted console outputs.
- Network credentials (API keys) are persisted strictly in client-side encrypted LocalStorage (`cortex_auth_vault`) and never transmitted to intermediary servers.
- Retrieved web content is parsed as untrusted evidence text, not executable system instructions.

## 6. Verification Protocol
All changes must satisfy:
1. `python scratch/check_js.py`: Zero browser syntax, parse, or uncaught runtime errors.
2. `python scratch/test_modular_runtime.py`: 100% pass rate across event bus, tool registry, compute sandbox, and guardrails.
3. `python scratch/test_every_feature.py`: All 58 UI features, topic desks, prompt cards, and deliverables validated.
