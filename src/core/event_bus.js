/**
 * Cortex Event Bus & Lifecycle Protocol
 * Inspired by production event-driven agent harnesses (OpenAI Codex App Server, Grok Build runtime).
 * Decouples agent execution, tool dispatching, and streaming telemetry from UI rendering.
 */

class CortexEventBus {
    constructor() {
        this.listeners = new Map();
        this.history = [];
        this.maxHistory = 100;
    }

    on(event, handler) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, new Set());
        }
        this.listeners.get(event).add(handler);
        return () => this.off(event, handler);
    }

    once(event, handler) {
        const wrapper = (...args) => {
            this.off(event, wrapper);
            handler(...args);
        };
        return this.on(event, wrapper);
    }

    off(event, handler) {
        if (this.listeners.has(event)) {
            this.listeners.get(event).delete(handler);
        }
    }

    emit(event, data = {}) {
        const payload = {
            event,
            data,
            timestamp: Date.now()
        };

        // Record telemetry trace
        this.history.push(payload);
        if (this.history.length > this.maxHistory) {
            this.history.shift();
        }

        // Exact match listeners
        if (this.listeners.has(event)) {
            for (const handler of this.listeners.get(event)) {
                try {
                    handler(data);
                } catch (err) {
                    console.error(`[CortexEventBus] Error in handler for '${event}':`, err);
                }
            }
        }

        // Wildcard match listeners (e.g. 'agent:*')
        const prefix = event.split(':')[0] + ':*';
        if (this.listeners.has(prefix)) {
            for (const handler of this.listeners.get(prefix)) {
                try {
                    handler(event, data);
                } catch (err) {
                    console.error(`[CortexEventBus] Error in wildcard handler for '${prefix}':`, err);
                }
            }
        }
    }

    clear() {
        this.listeners.clear();
        this.history = [];
    }
}

// Global Singleton
window.CortexEvents = new CortexEventBus();
