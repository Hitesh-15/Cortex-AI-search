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
            'who', 'are', 'a', 'an', 'on', 'with', 'at', 'by', 'from', 'about', 'as', 'into',
            'has', 'more', 'than', 'before', 'after', 'that', 'this', 'tell', 'me', 'explain', 'show',
            'search', 'find', 'provide', 'compare', 'difference', 'between', 'new', 'latest', 'recent'
        ]);

        const genericWords = new Set([
            'discovery', 'overview', 'analysis', 'impact', 'guide', 'review', 'history',
            'future', 'status', 'release', 'announcement', 'development', 'report', 'study',
            'details', 'summary', 'breakdown', 'understanding', 'features'
        ]);

        const entityAnalysis = CortexRetrievalEngine.extractSearchEntities(query);
        const primaryEntityLower = (entityAnalysis.primaryEntity || "").toLowerCase();

        const words = (query || "").toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/);
        const qWords = words.filter(w => w.length > 2 && !stopWords.has(w));
        const coreTerms = qWords.filter(w => !genericWords.has(w));
        const effectiveCoreTerms = coreTerms.length > 0 ? coreTerms : qWords;

        const qBigrams = [];
        for (let i = 0; i < qWords.length - 1; i++) {
            qBigrams.push(`${qWords[i]} ${qWords[i+1]}`);
        }

        const scored = rawSources.map(s => {
            let score = 0;
            const textCorpus = `${s.title || ''} ${s.snippet || ''}`.toLowerCase();

            // Check how many core terms are matched
            let coreMatches = 0;
            effectiveCoreTerms.forEach(term => {
                if (textCorpus.includes(term)) {
                    score += 20;
                    coreMatches++;
                }
            });

            // Primary entity match bonus
            if (primaryEntityLower && primaryEntityLower.length >= 2 && textCorpus.includes(primaryEntityLower)) {
                score += 35;
                coreMatches++;
            }

            // Bigram match (+30 pts per consecutive match)
            qBigrams.forEach(bg => {
                if (textCorpus.includes(bg)) score += 30;
            });

            // Exact query phrase match (+60 pts)
            if (query && query.length > 5 && textCorpus.includes(query.toLowerCase())) {
                score += 60;
            }

            // Severe penalty if ZERO core terms or primary entity matched
            if (coreMatches === 0 && !textCorpus.includes(query.toLowerCase())) {
                score = 0;
            } else {
                // Domain Authority Boost (only applied to relevant documents!)
                const domMult = CortexRetrievalEngine.getDomainAuthorityScore(s.domain);
                score = score * domMult;

                // Focus Mode contextual affinity
                if (focusMode === 'finance' && /\b(treasury|yield|fed|bond|equity|sp500|nasdaq|macro|rate|inflation)\b/i.test(textCorpus)) score += 30;
                if (focusMode === 'code' && /\b(python|rust|c\+\+|algorithm|compiler|github|function|api|framework|bytecode)\b/i.test(textCorpus)) score += 30;
                if (focusMode === 'academic' && /\b(arxiv|journal|paper|study|doi|research|methodology)\b/i.test(textCorpus)) score += 30;
            }

            return { source: s, score };
        });

        // Filter out sources with 0 score if we have any relevant sources
        const hasRelevantSources = scored.some(item => item.score > 0);
        const filtered = hasRelevantSources ? scored.filter(item => item.score > 0) : scored;

        // Sort descending by score
        filtered.sort((a, b) => b.score - a.score);

        // Normalize indices [1, 2, 3...]
        return filtered.map((item, idx) => ({
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

    /**
     * Extract Core Entities and Targeted Keywords from User Query
     * @param {string} query - Raw query
     * @returns {Object} { primaryEntity, keywords, targetedQuery, namedEntities }
     */
    static extractSearchEntities(query) {
        if (!query) return { primaryEntity: "", keywords: [], targetedQuery: "", namedEntities: [] };

        const stopWords = new Set([
            'what', 'is', 'the', 'of', 'in', 'and', 'for', 'to', 'how', 'does', 'why',
            'who', 'are', 'a', 'an', 'on', 'with', 'at', 'by', 'from', 'about', 'as', 'into',
            'has', 'more', 'than', 'before', 'after', 'that', 'this', 'tell', 'me', 'explain', 'show',
            'search', 'find', 'provide', 'compare', 'difference', 'between', 'new', 'latest', 'recent'
        ]);

        const genericWords = new Set([
            'discovery', 'overview', 'analysis', 'impact', 'guide', 'review', 'history',
            'future', 'status', 'release', 'announcement', 'development', 'report', 'study',
            'details', 'summary', 'breakdown', 'understanding', 'features', 'role', 'effects',
            'meaning', 'definition', 'list', 'top', 'best', 'working', 'instances'
        ]);

        const knownEntities = [
            'OpenAI', 'Google', 'Apple', 'Microsoft', 'Nvidia', 'Meta', 'Amazon', 'Anthropic',
            'DeepSeek', 'Tesla', 'Nitter', 'Twitter', 'Linux', 'Python', 'Rust', 'Docker',
            'Kubernetes', 'TypeScript', 'JavaScript', 'FastAPI', 'PyTorch', 'TensorFlow', 'Ethereum',
            'Bitcoin', 'Tim Cook', 'Satya Nadella', 'Sam Altman', 'Jensen Huang', 'Elon Musk',
            'Sycamore', 'OpenRouter'
        ];

        // 1. Check for recognized high-priority knowledge entities
        let detectedPrimary = "";
        for (const ent of knownEntities) {
            const regex = new RegExp(`\\b${ent.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
            if (regex.test(query)) {
                detectedPrimary = ent;
                break;
            }
        }

        const words = query.trim().split(/\s+/);
        const keyTerms = words
            .map(w => w.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, ''))
            .filter(w => w.length > 1 && !stopWords.has(w.toLowerCase()));

        // 2. Extract named entity candidates, excluding generic sentence-initial words
        const namedEntities = [];
        let currentGroup = [];
        for (let idx = 0; idx < words.length; idx++) {
            const cleanW = words[idx].replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, '');
            if (!cleanW) continue;

            const isFirstWord = (idx === 0);
            const isGenericFirst = isFirstWord && genericWords.has(cleanW.toLowerCase());
            const isCamelOrAcronym = /[a-z][A-Z]/.test(cleanW) || (/^[A-Z]{2,6}$/.test(cleanW) && !stopWords.has(cleanW.toLowerCase()));
            const isCapitalized = /^[A-Z]/.test(cleanW) && !stopWords.has(cleanW.toLowerCase()) && !isGenericFirst;

            if (isCamelOrAcronym || isCapitalized) {
                currentGroup.push(cleanW);
            } else {
                if (currentGroup.length > 0) {
                    namedEntities.push(currentGroup.join(' '));
                    currentGroup = [];
                }
            }
        }
        if (currentGroup.length > 0) {
            namedEntities.push(currentGroup.join(' '));
        }

        const primaryEntity = detectedPrimary || namedEntities[0] || keyTerms[0] || query.trim();

        // 3. Form targeted search query by removing introductory fluff and stopwords
        const meaningfulTerms = words
            .map(w => w.replace(/^[^a-zA-Z0-9]+|[^a-zA-Z0-9]+$/g, ''))
            .filter((w, idx) => {
                if (!w || w.length <= 1) return false;
                const lower = w.toLowerCase();
                if (stopWords.has(lower)) return false;
                if (idx === 0 && genericWords.has(lower)) return false;
                return true;
            });

        const targetedQuery = meaningfulTerms.length > 0 ? meaningfulTerms.join(' ') : query.trim();

        return {
            primaryEntity,
            keywords: keyTerms,
            targetedQuery,
            namedEntities
        };
    }
}

window.CortexRetrievalEngine = CortexRetrievalEngine;
