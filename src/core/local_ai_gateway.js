/**
 * Cortex Private Local AI Runtime Gateway
 * Zero-cost ($0.00), 100% private client-to-localhost inference connector.
 * Supports standard localhost:11434 (/api/tags, /api/chat, /v1/chat/completions)
 * and any OpenAI-compatible local model server (e.g., localhost:1234/v1).
 */

class CortexLocalAIGatewayEngine {
    constructor() {
        this.STORAGE_KEY = 'cortex_local_ai_config';
        this.config = this.loadConfig();
    }

    loadConfig() {
        const defaults = {
            enabled: false,
            endpoint: 'http://localhost:11434',
            model: 'qwen2.5:7b'
        };
        try {
            const raw = localStorage.getItem(this.STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                return {
                    enabled: Boolean(parsed.enabled),
                    endpoint: (parsed.endpoint || defaults.endpoint).replace(/\/+$/, ''),
                    model: (parsed.model || defaults.model).trim()
                };
            }
        } catch (e) {
            console.warn('[CortexLocalAI] Failed to parse local AI config:', e);
        }
        return defaults;
    }

    saveConfig(partial = {}) {
        this.config = {
            ...this.config,
            ...partial
        };
        this.config.endpoint = (this.config.endpoint || 'http://localhost:11434').trim().replace(/\/+$/, '');
        this.config.model = (this.config.model || 'qwen2.5:7b').trim();
        this.config.enabled = Boolean(this.config.enabled);

        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.config));
        } catch (e) {
            console.warn('[CortexLocalAI] Failed to save config:', e);
        }

        if (window.CortexEvents) {
            window.CortexEvents.emit('local_ai:config_updated', this.config);
        }
        return this.config;
    }

    getConfig() {
        return { ...this.config };
    }

    isEnabled() {
        return Boolean(this.config.enabled && this.config.endpoint);
    }

    /**
     * Probes the local inference server for reachable endpoints and installed models.
     */
    async detectModels(customEndpoint = null) {
        const base = (customEndpoint || this.config.endpoint || 'http://localhost:11434').trim().replace(/\/+$/, '');
        const cleanBase = base.replace(/\/v1$/, '');
        const start = performance.now();

        // 1. Try native /api/tags endpoint (localhost:11434 style)
        try {
            const res = await fetch(`${cleanBase}/api/tags`, {
                method: 'GET',
                signal: AbortSignal.timeout(1800)
            });
            if (res.ok) {
                const data = await res.json();
                const models = Array.isArray(data.models)
                    ? data.models.map(m => m.name || m.model).filter(Boolean)
                    : [];
                return {
                    reachable: true,
                    protocol: 'native-local',
                    endpoint: cleanBase,
                    models,
                    latencyMs: Math.round(performance.now() - start)
                };
            }
        } catch (e) {
            // Fall through to OpenAI-compatible /v1/models check
        }

        // 2. Try OpenAI-compatible /v1/models endpoint
        try {
            const v1Url = base.endsWith('/v1') ? `${base}/models` : `${base}/v1/models`;
            const res = await fetch(v1Url, {
                method: 'GET',
                signal: AbortSignal.timeout(1800)
            });
            if (res.ok) {
                const data = await res.json();
                const models = Array.isArray(data.data)
                    ? data.data.map(m => m.id).filter(Boolean)
                    : [];
                return {
                    reachable: true,
                    protocol: 'openai-compatible',
                    endpoint: base,
                    models,
                    latencyMs: Math.round(performance.now() - start)
                };
            }
        } catch (e) {
            // Unreachable or CORS disabled on local daemon
        }

        return {
            reachable: false,
            protocol: 'offline',
            endpoint: base,
            models: [],
            latencyMs: Math.round(performance.now() - start),
            hint: 'Ensure your local AI server is running with CORS allowed for browser origins.'
        };
    }

    /**
     * Generates a 4-part grounded Cortex response using the configured local model at $0.00 cost.
     */
    async generateCompletion(query, sources = [], onStreamChunk = null) {
        const base = (this.config.endpoint || 'http://localhost:11434').trim().replace(/\/+$/, '');
        const model = this.config.model || 'qwen2.5:7b';
        const sourceContext = (sources || [])
            .slice(0, 10)
            .map((s, idx) => `[${s.num || idx + 1}] ${s.title}: ${s.snippet || ''}`)
            .join('\n');

        const systemPrompt = [
            'You are Cortex (ai.ambulkar.com), a high-precision, direct AI research engine.',
            'Follow the 4-Part Structure strictly:',
            '1. Direct bottom-line answer in the first 1-2 sentences with inline citations like <span class="citation-ref">[1]</span>.',
            '2. Structured subheading (### ...) with bullet points starting with bold concepts (* **Concept:** Explanation [1]).',
            '3. Context & Implications narrative paragraph.',
            '4. Distinct architectural or strategic takeaway in <div class="cortex-takeaway-card"><div class="cortex-takeaway-label"><i class="fa-solid fa-lightbulb text-amber"></i> Key Takeaway</div><p class="cortex-takeaway-text">...</p></div> (omit for simple factual/math lookups).',
            'Zero meta-commentary or disclaimers.'
        ].join('\n');

        const userPrompt = `Query: "${query}"\n\nVerified Sources:\n${sourceContext}`;
        const v1ChatUrl = base.endsWith('/v1') ? `${base}/chat/completions` : `${base}/v1/chat/completions`;

        try {
            const res = await fetch(v1ChatUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model,
                    temperature: 0.2,
                    max_tokens: 1400,
                    stream: false,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ]
                }),
                signal: AbortSignal.timeout(25000)
            });

            if (res.ok) {
                const data = await res.json();
                const rawText = data.choices?.[0]?.message?.content || '';
                if (rawText && rawText.trim().length > 20) {
                    if (typeof onStreamChunk === 'function') onStreamChunk(rawText);
                    const formatted = typeof formatAIResponseHTML === 'function' ? formatAIResponseHTML(rawText) : rawText;
                    return {
                        success: true,
                        html: formatted,
                        modelUsed: `Local Runtime (${model})`,
                        costUSD: 0
                    };
                }
            }
        } catch (err) {
            // Try native /api/chat fallback
            try {
                const cleanBase = base.replace(/\/v1$/, '');
                const resNative = await fetch(`${cleanBase}/api/chat`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        model,
                        stream: false,
                        messages: [
                            { role: 'system', content: systemPrompt },
                            { role: 'user', content: userPrompt }
                        ]
                    }),
                    signal: AbortSignal.timeout(25000)
                });
                if (resNative.ok) {
                    const dataNative = await resNative.json();
                    const rawText = dataNative.message?.content || '';
                    if (rawText && rawText.trim().length > 20) {
                        if (typeof onStreamChunk === 'function') onStreamChunk(rawText);
                        const formatted = typeof formatAIResponseHTML === 'function' ? formatAIResponseHTML(rawText) : rawText;
                        return {
                            success: true,
                            html: formatted,
                            modelUsed: `Local Runtime (${model})`,
                            costUSD: 0
                        };
                    }
                }
            } catch (innerErr) {
                console.warn('[CortexLocalAI] Local inference server unreachable, falling back:', innerErr.message);
            }
        }

        return {
            success: false,
            html: '',
            modelUsed: model,
            costUSD: 0
        };
    }
}

window.CortexLocalAI = new CortexLocalAIGatewayEngine();

if (window.CortexTools) {
    window.CortexTools.register({
        name: 'cortex_local_ai',
        description: 'Zero-cost private localhost AI runtime connector for local model discovery and inference',
        parameters: {
            type: 'object',
            properties: {
                action: { type: 'string', enum: ['status', 'detect_models', 'configure'] },
                endpoint: { type: 'string' },
                model: { type: 'string' },
                enabled: { type: 'boolean' }
            },
            required: ['action']
        },
        execute: async (params = {}) => {
            const gateway = window.CortexLocalAI;
            if (params.action === 'status') {
                return gateway.getConfig();
            }
            if (params.action === 'detect_models') {
                return await gateway.detectModels(params.endpoint || null);
            }
            if (params.action === 'configure') {
                const next = {};
                if (typeof params.endpoint === 'string') next.endpoint = params.endpoint;
                if (typeof params.model === 'string') next.model = params.model;
                if (typeof params.enabled === 'boolean') next.enabled = params.enabled;
                return gateway.saveConfig(next);
            }
            return { error: 'Unsupported action' };
        }
    });
}
