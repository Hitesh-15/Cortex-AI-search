/**
 * Cortex Declarative Tool Registry & Execution Protocol
 * Inspired by Google ADK (Agent Development Kit), OpenAI Agents SDK, and Grok Build tools crate.
 * Decouples tool execution, validation, and schemas from model inference.
 */

class CortexToolRegistry {
    constructor() {
        this.tools = new Map();
    }

    /**
     * Register a new tool definition
     * @param {Object} def - Tool definition: { name, description, parameters, execute }
     */
    register(def) {
        if (!def.name || typeof def.execute !== 'function') {
            throw new Error(`[CortexToolRegistry] Invalid tool definition: 'name' and 'execute' are required.`);
        }
        this.tools.set(def.name, {
            name: def.name,
            description: def.description || '',
            parameters: def.parameters || { type: 'object', properties: {} },
            execute: def.execute
        });
    }

    has(name) {
        return this.tools.has(name);
    }

    get(name) {
        return this.tools.get(name);
    }

    list() {
        return Array.from(this.tools.values()).map(t => ({
            name: t.name,
            description: t.description,
            parameters: t.parameters
        }));
    }

    /**
     * Execute a registered tool with telemetry and event tracking
     */
    async execute(name, params = {}) {
        const tool = this.tools.get(name);
        if (!tool) {
            throw new Error(`[CortexToolRegistry] Tool '${name}' is not registered.`);
        }

        const startTime = performance.now();
        if (window.CortexEvents) {
            window.CortexEvents.emit('tool:start', { name, params });
        }

        try {
            const result = await tool.execute(params);
            const durationMs = Math.round(performance.now() - startTime);

            if (window.CortexEvents) {
                window.CortexEvents.emit('tool:finish', { name, params, result, durationMs });
            }

            return {
                status: 'success',
                name,
                result,
                durationMs
            };
        } catch (error) {
            const durationMs = Math.round(performance.now() - startTime);
            if (window.CortexEvents) {
                window.CortexEvents.emit('tool:error', { name, params, error: error.message, durationMs });
            }
            return {
                status: 'error',
                name,
                error: error.message,
                durationMs
            };
        }
    }
}

// Global Singleton
window.CortexTools = new CortexToolRegistry();
