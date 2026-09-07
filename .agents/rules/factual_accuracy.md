# Rule: Strict Factual Accuracy, Query Precision & Architectural Invariance

## Core Directives

### 1. Direct Answer First (Zero Meta-Reporting)
- **Immediate Precision**: The lead paragraph's first sentence must directly, concisely, and authoritatively answer the exact question or event queried.
- **Zero Meta-Commentary**: Never preface an answer with crawler or forum metadata (e.g., *"Community reporting and discussion on Hacker News regarding..."*, *"Verified developer disclosures confirm..."*, *"Live global market telemetry..."*). The user asked for facts, not crawler activity.
- **Action/Event Recognition**: When a query specifies an event or status (e.g. *"...resumes service after legal advice"*, *"...acquires company"*, *"...releases model"*), synthesize the direct outcome into an active, grammatically complete assertion in the lead sentence.
- **Conciseness**: The lead sentence must be focused and devoid of fluff. As a user, the response must answer the query in the first few seconds of reading.

### 2. Strict Homonym Rejection Gate (Zero Historical Homonym Bleed)
- **Category Mismatch Enforcement**: Queries about technology, software, web services, algorithms, or finance must NEVER be polluted by unrelated historical figures who share a surname (e.g. 19th/20th-century physicians, cricketers, politicians, clergymen, noblemen).
- **Secondary Disambiguation Suppression**: When a query targets a known entity (e.g., `Tim Cook`), suppress parenthetical disambiguations (e.g., `Tim Cook (historian)`, `Tim Cook (cricketer)`) if the primary article is present.
- **Rejection Across All Retrieval Stages**: The homonym rejection gate is mandatory in:
  1. Primary API fetch (`fetchWebSources` - generator and list searches)
  2. Neural semantic re-ranking (`cortexSemanticReRanker` / `CortexRetrievalEngine.reRankSources`)
  3. Active source selection (`activeSources` in `generateLocalSynthesizedAnswer`)
  4. Lead sentence selection (`extractGrammaticalLead`)
  5. Narrative sentence extraction (`extractNarrativeSentences`)

### 3. Pure Organic Evidence & Zero Synthetic Snippet Infection
- **Synthetic Stub Rejection**: Search stubs (`/search`, `site-search`) or fallback query echoes must never contribute narrative sentences to bullet points. `extractNarrativeSentences` must immediately return empty arrays for synthetic stubs.
- **Raw Headline Preservation**: When processing forum or news items without body text, use the pristine clean headline without prepending synthetic prefixes like *"Verified developer disclosures..."*.
- **Informative Bullets**: Each bullet item must pair a bold concept label with genuine factual sentences from high-authority sources (Wikipedia, GitHub, ArXiv, official documentation). Never repeat query fragments as bullet points.

### 4. Architectural Invariance Across UI & Design Modifications
- **Design Decoupling**: Modifications to UI components, layout, typography, CSS styling, modal designs, or desktop/mobile structures must NEVER alter, weaken, bypass, or regress the retrieval ranking, homonym rejection filters, or answer synthesis pipeline.
- **Mandatory Pre-Commit Verification**: Before completing any structural, UI, or design task, verify:
  1. `python scratch/check_js.py` (0 syntax or runtime errors)
  2. `python scratch/test_modular_runtime.py` (100% pass on all sandbox/tool engines)
  3. `python scratch/test_diverse_queries.py` (validate lead answers are concise, direct, and free of homonyms)
  4. `python scratch/reproduce_issue.py` (verify Nitter synthesis has zero physician homonym and zero meta-prefix)

### 5. Deterministic Math & Quantitative Integrity
- **Never Guess**: Never estimate CAGR, geometric returns, or statistical metrics. Always compute deterministically via `CortexComputeSandbox`.
- **Exact Version Fidelity**: Preserve exact version numbers (e.g. 5.1 vs 5.0) and model routing specifications.

### 6. Answer vs. Key Takeaway Separation (Zero Repetition, Zero Robotic Fluff)
- **Distinct Value Separation**:
  - The **Answer** section provides the direct factual resolution, incident description, or operational mechanics answering the user's specific query.
  - The **Key Takeaway** card is strictly reserved for high-level architectural trade-offs, cybersecurity/privacy mitigations, or strategic policy implications.
- **Never Repeat the Answer**: A 1-2 sentence answer or bullet point must NEVER be repeated inside the Key Takeaway card. If an answer is self-contained, a takeaway card adds zero signal and must not be shown.
- **Complete Omission on Direct Factual Lookups**: For direct lookups (`who is`, `capital of`, mathematical computations like CAGR, single-fact lookups), the Key Takeaway card must be omitted completely.
- **Zero Robotic Fluff**: Never emit generic boilerplate like *"Authoritative documentation confirms that X is an active, verifiable topic..."*. If no distinct, high-signal actionable takeaway exists, suppress the card entirely.
