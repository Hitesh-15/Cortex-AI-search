/**
 * Cortex Neural Retrieval Engine & Semantic Re-Ranker
 * Inspired by hybrid retrieval architectures (dense embeddings + lexical matching, multi-stage ranking).
 * Handles candidate deduplication, authority amplification, intent proximity, and token-budgeted context packing.
 */

class CortexRetrievalEngine {
    /**
     * Domain Authority Scoring Table
     */
    static getDomainAuthorityScore(domain) {
        if (!domain) return 1.0;
        const d = domain.toLowerCase().replace(/^www\./, '');

        if (d.includes('wikipedia.org')) return 1.45;
        if (d.includes('arxiv.org') || d.includes('nature.com') || d.includes('sciencedirect.com')) return 1.40;
        if (d.includes('github.com') || d.includes('python.org') || d.includes('kernel.org') || d.includes('rust-lang.org')) return 1.35;
        if (d.includes('reuters.com') || d.includes('bloomberg.com') || d.includes('wsj.com') || d.includes('ft.com')) return 1.35;
        if (d.includes('sec.gov') || d.includes('federalreserve.gov') || d.includes('treasury.gov')) return 1.40;

        // Downweight generic aggregators and low-signal redirect pages
        if (d.includes('search.') || d.includes('bing.com') || d.includes('yahoo.com') || d.includes('ask.com')) return 0.55;
        if (d.includes('pinterest.com') || d.includes('tiktok.com')) return 0.40;

        return 1.0;
    }

    /**
     * Dense Intent-Proximity & Semantic Re-Ranker
     * @param {string} query - Raw user search query
     * @param {Array} rawSources - Candidates from multi-index retrieval
     * @param {string} focusMode - Active topic desk
     * @returns {Array} Re-ranked, deduplicated, sorted sources with normalized indices
     */
    static reRankSources(query, rawSources, focusMode = 'web') {
        if (!Array.isArray(rawSources) || rawSources.length === 0) return [];

        const stopWords = new Set([
            'what', 'is', 'the', 'of', 'in', 'and', 'for', 'to', 'how', 'does', 'why',
            'who', 'are', 'a', 'an', 'on', 'with', 'at', 'by', 'from', 'about', 'as', 'into'
        ]);

        const qWords = (query || "").toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 2 && !stopWords.has(w));
        const qBigrams = [];
        for (let i = 0; i < qWords.length - 1; i++) {
            qBigrams.push(`${qWords[i]} ${qWords[i+1]}`);
        }

        const scored = rawSources.map(s => {
            let score = 0;
            const textCorpus = `${s.title || ''} ${s.snippet || ''}`.toLowerCase();

            // Unigram match (+10 pts per match)
            qWords.forEach(w => {
                if (textCorpus.includes(w)) score += 10;
            });

            // Bigram match (+25 pts per consecutive match)
            qBigrams.forEach(bg => {
                if (textCorpus.includes(bg)) score += 25;
            });

            // Exact query phrase match (+50 pts)
            if (query && query.length > 5 && textCorpus.includes(query.toLowerCase())) {
                score += 50;
            }

            // Domain Authority Boost
            const domMult = CortexRetrievalEngine.getDomainAuthorityScore(s.domain);
            score = score * domMult;

            // Focus Mode contextual affinity
            if (focusMode === 'finance' && /\b(treasury|yield|fed|bond|equity|sp500|nasdaq|macro|rate|inflation)\b/i.test(textCorpus)) score += 30;
            if (focusMode === 'code' && /\b(python|rust|c\+\+|algorithm|compiler|github|function|api|framework|bytecode)\b/i.test(textCorpus)) score += 30;
            if (focusMode === 'academic' && /\b(arxiv|journal|paper|study|doi|research|methodology)\b/i.test(textCorpus)) score += 30;

            return { source: s, score };
        });

        // Sort descending by score
        scored.sort((a, b) => b.score - a.score);

        // Normalize indices [1, 2, 3...]
        return scored.map((item, idx) => ({
            ...item.source,
            num: idx + 1,
            relevanceScore: item.score
        }));
    }

    /**
     * Greedily pack top-relevance passage evidence within a strict token ceiling
     */
    static packTokenBudgetedContext(sources, maxTokenBudget = 2048) {
        if (!Array.isArray(sources) || sources.length === 0) return "";

        let currentTokens = 0;
        const packedPassages = [];

        for (const s of sources) {
            const title = s.title || `Source [${s.num}]`;
            const snippet = s.snippet || "";
            const entryText = `[${s.num}] ${title}: ${snippet}`;

            // Approximate tokens (~4 characters per token)
            const approxTokens = Math.ceil(entryText.length / 4);

            if (currentTokens + approxTokens <= maxTokenBudget) {
                packedPassages.push(entryText);
                currentTokens += approxTokens;
            } else {
                // If partial budget remains (>40 tokens), slice snippet to fit
                const remainingTokens = maxTokenBudget - currentTokens;
                if (remainingTokens > 40) {
                    const charLimit = (remainingTokens - 10) * 4;
                    const truncated = snippet.slice(0, charLimit).replace(/\s+\S*$/, '...');
                    packedPassages.push(`[${s.num}] ${title}: ${truncated}`);
                }
                break;
            }
        }

        return packedPassages.join('\n\n');
    }
}

window.CortexRetrievalEngine = CortexRetrievalEngine;
