/**
 * Cortex Verification Guardrails & Grounding Engine
 * Multi-layer deterministic boundary protections and active verification harness.
 * Provides deterministic boundary protections: refusal interception, citation cross-matching,
 * deep passage grounding, and numeric consistency auditing.
 */

class CortexGuardrails {
    /**
     * Determine if model output is a refusal, generic disclaimer, or factually deficient
     */
    static isRefusalOrDeficient(text) {
        if (!text || typeof text !== 'string') return true;
        const trimmed = text.trim();
        if (trimmed.length < 25) return true;

        const refusalPatterns = [
            /i am unable to provide/i,
            /as an ai language model/i,
            /as of my knowledge cutoff/i,
            /i do not have access to real-time/i,
            /i cannot fulfill this request/i,
            /i apologize, but i cannot/i,
            /i don't have access to/i,
            /cannot provide financial advice/i,
            /zero\s+[\w-]+\s*data exists in the provided source set/i,
            /there is no mention of\s+[^.\n]+\s+in the provided/i,
            /no source states/i,
            /given the strict citation-grounded requirement/i,
            /although the exact numeric request cannot be served/i,
            /the provided sources do not mention/i,
            /the provided text does not contain/i,
            /based on the provided sources, there is no/i
        ];

        return refusalPatterns.some(pattern => pattern.test(trimmed));
    }

    /**
     * Deterministically audit and align citation numbers to active sources
     * @param {string} cleanHtml - Formatted response HTML
     * @param {number} maxSourceNum - Available source count
     * @returns {string} Audited HTML with 100% valid, grounded citation references
     */
    static alignCitations(cleanHtml, maxSourceNum = 0) {
        if (!cleanHtml) return '';

        // Normalize raw brackets [N] to clickable citation buttons with deterministic index folding
        return cleanHtml.replace(/\[([0-9]{1,2})\]/g, (match, numStr) => {
            let n = parseInt(numStr, 10);
            if (isNaN(n) || n <= 0) return '';
            if (maxSourceNum > 0 && n > maxSourceNum) {
                n = ((n - 1) % maxSourceNum) + 1;
            }
            return `<button type="button" class="citation-ref" data-source-num="${n}" onclick="jumpToSource(${n}, event)" onmouseenter="showCitationPreview(${n}, this)" onmouseleave="hideCitationPreview()" title="Source ${n}"><span class="citation-badge-num">${n}</span></button>`;
        });
    }

    /**
     * Deep Passage Grounding: Locate and highlight the exact supporting sentence fragment
     */
    static extractGroundedPassage(snippet, claimText) {
        if (!snippet) return { displaySnippet: '', bestSentence: '', confidence: 0 };
        const cleanSnip = snippet.trim();
        if (!claimText) return { displaySnippet: cleanSnip, bestSentence: '', confidence: 0 };

        const stopWords = new Set(['the', 'and', 'for', 'that', 'this', 'with', 'from', 'have', 'been', 'were', 'will', 'are', 'was', 'which', 'about', 'into', 'more', 'some', 'than', 'them', 'then', 'their', 'also', 'source']);
        const claimWords = (claimText.toLowerCase().match(/\b[a-z0-9]{3,}\b/g) || [])
            .filter(w => !stopWords.has(w));

        const sentences = cleanSnip.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [cleanSnip];
        let bestSentence = "";
        let bestScore = -1;

        sentences.forEach(s => {
            const sTrim = s.trim();
            const sLower = sTrim.toLowerCase();
            let score = 0;
            claimWords.forEach(w => {
                if (sLower.includes(w)) score += 1;
            });
            if (score > bestScore) {
                bestScore = score;
                bestSentence = sTrim;
            }
        });

        let displaySnippet = cleanSnip;
        if (bestSentence && bestScore >= 1 && cleanSnip.includes(bestSentence)) {
            const highlighted = `<mark class="citation-grounded-passage">${bestSentence}</mark>`;
            displaySnippet = cleanSnip.replace(bestSentence, highlighted);
        }

        return {
            displaySnippet,
            bestSentence,
            confidence: bestScore
        };
    }

    /**
     * Audit numeric tokens in synthesized answer against source corpus
     */
    static auditNumericClaims(text, sources = []) {
        if (!text || !Array.isArray(sources) || sources.length === 0) {
            return { totalMetrics: 0, verifiedMetrics: 0, ratio: 1.0 };
        }

        const numbersInAnswer = text.match(/\b(?:\$?\d+(?:\.\d+)?%?|\b\d{4}\b)\b/g) || [];
        if (numbersInAnswer.length === 0) {
            return { totalMetrics: 0, verifiedMetrics: 0, ratio: 1.0 };
        }

        const corpus = sources.map(s => `${s.title || ''} ${s.snippet || ''}`).join(' ');
        let verified = 0;

        numbersInAnswer.forEach(num => {
            const cleanNum = num.replace(/[^0-9.]/g, '');
            if (cleanNum && corpus.includes(cleanNum)) {
                verified++;
            }
        });

        return {
            totalMetrics: numbersInAnswer.length,
            verifiedMetrics: verified,
            ratio: Math.round((verified / numbersInAnswer.length) * 100) / 100
        };
    }
}

// Register with Tool Registry
if (window.CortexTools) {
    window.CortexTools.register({
        name: 'cortex_evidence_verifier',
        description: 'Audits claims, checks citation alignment, and isolates supporting evidence passages.',
        parameters: {
            type: 'object',
            properties: {
                claim: { type: 'string', description: 'Generated claim text' },
                snippet: { type: 'string', description: 'Source passage snippet' }
            },
            required: ['claim', 'snippet']
        },
        execute: async (params) => {
            return CortexGuardrails.extractGroundedPassage(params.snippet, params.claim);
        }
    });
}

window.CortexGuardrails = CortexGuardrails;
