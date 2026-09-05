/**
 * Cortex Autonomous Agent Harness & Runtime Loop
 * Built on modular agent runtime standards and event-driven harness architecture.
 * Orchestrates multi-step reasoning, tool dispatching, context compaction, and deterministic verification.
 */

class CortexAgentHarness {
    constructor() {
        this.activeRuns = new Map();
    }

    /**
     * Execute an end-to-end agent run with full event telemetry
     */
    async executeRun({
        runId = `run_${Date.now()}`,
        query,
        focusMode = 'web',
        maxSteps = 4,
        onStepUpdate = null,
        onTokenStream = null
    }) {
        const runState = {
            runId,
            query,
            focusMode,
            stepIndex: 0,
            maxSteps,
            status: 'initializing',
            observations: [],
            sources: [],
            computedMetrics: null,
            startTime: performance.now()
        };

        this.activeRuns.set(runId, runState);

        if (window.CortexEvents) {
            window.CortexEvents.emit('agent:start', { runId, query, focusMode });
        }

        try {
            // STEP 1: Intent & Mathematical Detection
            runState.status = 'analyzing_intent';
            if (onStepUpdate) onStepUpdate(runState, "Classifying research intent & computational complexity");

            const mathPattern = /(?:calculate|compute|formula|cagr|ratio|percentage|variance|stddev|standard deviation|correlation|sum|average|mean|median|sqrt)\b/i;
            const hasMath = mathPattern.test(query);

            if (hasMath && window.CortexComputeSandbox) {
                // Extract possible arithmetic expressions or numbers
                const exprMatch = query.match(/(?:(?:compute|calculate)\s+)?([0-9+\-*/().,%^ Math]+)/i);
                if (exprMatch && exprMatch[1] && exprMatch[1].trim().length > 2) {
                    const mathRes = CortexComputeSandbox.evaluateMath(exprMatch[1].trim());
                    if (mathRes.success) {
                        runState.computedMetrics = mathRes;
                        if (window.CortexEvents) {
                            window.CortexEvents.emit('agent:compute_success', { runId, mathRes });
                        }
                    }
                }
            }

            // STEP 2: Multi-Index Retrieval & Semantic Re-Ranking
            runState.status = 'gathering_evidence';
            if (onStepUpdate) onStepUpdate(runState, "Retrieving authoritative multi-index evidence");

            let rawSources = [];
            if (typeof fetchUnifiedSources === 'function') {
                rawSources = await fetchUnifiedSources(query, focusMode);
            } else if (typeof fetchSearchCandidates === 'function') {
                rawSources = await fetchSearchCandidates(query);
            }

            // Semantic Re-Ranking & Token Budgeting
            let rankedSources = rawSources;
            if (typeof cortexSemanticReRanker === 'function') {
                rankedSources = cortexSemanticReRanker(query, rawSources, focusMode);
            }
            runState.sources = rankedSources;

            // STEP 3: Context Compaction & Working Memory Assembly
            runState.status = 'compacting_context';
            if (onStepUpdate) onStepUpdate(runState, "Compacting 5-layer working memory within token ceiling");

            let budgetedContext = "";
            if (typeof buildTokenBudgetedSourceContext === 'function') {
                budgetedContext = buildTokenBudgetedSourceContext(rankedSources, 2048);
            }

            // STEP 4: Model Synthesis & Streaming
            runState.status = 'synthesizing';
            if (onStepUpdate) onStepUpdate(runState, "Synthesizing verified factual intelligence");

            let synthesisOutput = null;
            if (typeof synthesizeAIResponse === 'function') {
                synthesisOutput = await synthesizeAIResponse(
                    query,
                    rankedSources,
                    focusMode,
                    'high',
                    'verified_reasoner',
                    null,
                    onTokenStream
                );
            }

            // STEP 5: Deterministic Verification & Citation Alignment Guardrail
            runState.status = 'verifying';
            if (onStepUpdate) onStepUpdate(runState, "Auditing citation alignment and numeric consistency");

            let finalHtml = (synthesisOutput && synthesisOutput.answerHTML) ? synthesisOutput.answerHTML : "";
            if (window.CortexGuardrails) {
                // Ensure zero refusal disclaimers
                if (CortexGuardrails.isRefusalOrDeficient(finalHtml) && typeof generateLocalSynthesizedAnswer === 'function') {
                    finalHtml = generateLocalSynthesizedAnswer(query, rankedSources, focusMode, 'high');
                }
                // Verify all citation badges point to existing sources
                finalHtml = CortexGuardrails.alignCitations(finalHtml, rankedSources.length);
            }

            const totalDurationMs = Math.round(performance.now() - runState.startTime);
            runState.status = 'completed';

            if (window.CortexEvents) {
                window.CortexEvents.emit('agent:complete', {
                    runId,
                    totalDurationMs,
                    sourcesCount: rankedSources.length,
                    hasMath: Boolean(runState.computedMetrics)
                });
            }

            return {
                runId,
                status: 'success',
                html: finalHtml,
                sources: rankedSources,
                computedMetrics: runState.computedMetrics,
                totalDurationMs
            };
        } catch (error) {
            runState.status = 'failed';
            if (window.CortexEvents) {
                window.CortexEvents.emit('agent:error', { runId, error: error.message });
            }
            throw error;
        } finally {
            this.activeRuns.delete(runId);
        }
    }
}

// Global Singleton
window.CortexHarness = new CortexAgentHarness();
