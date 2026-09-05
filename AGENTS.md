# AGENTS.md

## Purpose
This repository contains Cortex AI, an all-in-one verified intelligence engine, deterministic computation runtime, and autonomous deliverable studio. The platform executes deep multi-source research, provides in-browser code execution and math sandboxes, and synthesizes 16:9 presentation decks and whitepapers.

## Architecture Map
- `src/core/`: Event bus, tool registry, and autonomous agent harness runtime.
- `src/sandbox/`: Client-side deterministic compute, interactive code sandbox, and SVG chart studio.
- `src/retrieval/`: Multi-source candidate retrieval, re-ranking, and token-budget packing.
- `src/verification/`: Refusal suppression, citation auditing, and passage evidence highlighting.
- `app.js`: UI orchestration, state coordination, keyboard shortcuts, and view controllers.
- `index.html`: Responsive, zero-build client application interface.
- `styles.css`: Complete design system, dark-mode styling, and interactive component transitions.
- `scratch/`: Regression test suites, syntax checkers, and verification scripts.

For detailed runtime architecture, tool definitions, and system boundaries, consult [HARNESS.md](./HARNESS.md).

## Development & Verification Commands
```bash
# Check JavaScript syntax and console cleanliness
python scratch/check_js.py

# Verify modular runtime (EventBus, Tools, Sandboxes, Guardrails)
python scratch/test_modular_runtime.py

# Run exhaustive end-to-end regression test suite (58 checks)
python scratch/test_every_feature.py

# Run concurrency stress and deep reference grounding tests
python scratch/test_cortex_stress_and_references.py
```

## Coding Rules
- Maintain pure browser-native compatibility: zero build steps, zero npm bundle requirement.
- Do not introduce monolithic bloat into `app.js`; place reusable domain logic in `src/`.
- Maintain strict brand neutrality: never reference proprietary third-party tool or company trademarks in release notes or codebase.
- Enforce deterministic 4-part structured responses: executive lead, subheadings, key takeaway card, and citation button grounding.
- Ground all numerical metrics in primary references or computed sandbox steps.
