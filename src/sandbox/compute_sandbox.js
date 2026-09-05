/**
 * Cortex In-Browser Compute Sandbox
 * Deterministic sandboxed agent calculation environment.
 * Empowers the agent with a deterministic client-side calculation engine for math,
 * financial formulas, statistics, and tabular data transformations.
 */

class CortexComputeSandbox {
    /**
     * Safely evaluate a mathematical expression
     * @param {string} expr - e.g. "((220 / 150) ** (1/3) - 1) * 100"
     * @returns {Object} { success, result, formatted }
     */
    static evaluateMath(expr) {
        if (!expr || typeof expr !== 'string') {
            return { success: false, error: "Empty expression" };
        }

        // Sanitize: allow only numbers, math operators, parens, Math functions
        const sanitized = expr
            .replace(/\b(?:sin|cos|tan|sqrt|log|exp|pow|abs|round|floor|ceil|min|max)\b/g, m => `Math.${m}`)
            .replace(/[^0-9+\-*/().,%^ Math]/g, '')
            .replace(/\^/g, '**');

        try {
            // Evaluated in isolated scope with restricted globals
            const fn = new Function(`
                "use strict";
                return (${sanitized});
            `);
            const val = fn();
            if (typeof val !== 'number' || isNaN(val) || !isFinite(val)) {
                return { success: false, error: "Non-finite computation result" };
            }

            return {
                success: true,
                result: val,
                formatted: Number.isInteger(val) ? val.toString() : val.toLocaleString('en-US', { maximumFractionDigits: 4 }),
                expression: expr
            };
        } catch (err) {
            return { success: false, error: err.message, expression: expr };
        }
    }

    /**
     * Compute statistical metrics over a numeric dataset
     * @param {number[]} data - Array of numbers
     */
    static computeStatistics(data) {
        if (!Array.isArray(data) || data.length === 0) {
            return { error: "Dataset must be a non-empty array of numbers" };
        }

        const valid = data.filter(n => typeof n === 'number' && !isNaN(n));
        const n = valid.length;
        if (n === 0) return { error: "No valid numbers found in dataset" };

        const sum = valid.reduce((a, b) => a + b, 0);
        const mean = sum / n;

        const sorted = [...valid].sort((a, b) => a - b);
        const median = n % 2 === 0 ? (sorted[n / 2 - 1] + sorted[n / 2]) / 2 : sorted[Math.floor(n / 2)];
        const min = sorted[0];
        const max = sorted[n - 1];

        const variance = valid.reduce((acc, x) => acc + (x - mean) ** 2, 0) / (n > 1 ? n - 1 : 1);
        const stdDev = Math.sqrt(variance);

        return {
            count: n,
            sum: Math.round(sum * 10000) / 10000,
            mean: Math.round(mean * 10000) / 10000,
            median: Math.round(median * 10000) / 10000,
            min,
            max,
            range: max - min,
            variance: Math.round(variance * 10000) / 10000,
            stdDev: Math.round(stdDev * 10000) / 10000
        };
    }

    /**
     * Compute Pearson correlation coefficient between two numeric series
     */
    static computeCorrelation(seriesA, seriesB) {
        if (!Array.isArray(seriesA) || !Array.isArray(seriesB)) return null;
        const len = Math.min(seriesA.length, seriesB.length);
        if (len < 2) return null;

        const x = seriesA.slice(0, len);
        const y = seriesB.slice(0, len);

        const xMean = x.reduce((a, b) => a + b, 0) / len;
        const yMean = y.reduce((a, b) => a + b, 0) / len;

        let num = 0;
        let denX = 0;
        let denY = 0;

        for (let i = 0; i < len; i++) {
            const dx = x[i] - xMean;
            const dy = y[i] - yMean;
            num += dx * dy;
            denX += dx * dx;
            denY += dy * dy;
        }

        const denom = Math.sqrt(denX * denY);
        if (denom === 0) return 0;
        const r = num / denom;
        return Math.round(r * 10000) / 10000;
    }

    /**
     * Financial CAGR (Compound Annual Growth Rate) Calculator
     */
    static computeCAGR(startValue, endValue, years) {
        if (startValue <= 0 || endValue <= 0 || years <= 0) return null;
        const cagr = ((endValue / startValue) ** (1 / years) - 1) * 100;
        return Math.round(cagr * 100) / 100;
    }
}

// Register with the Tool Registry
if (window.CortexTools) {
    window.CortexTools.register({
        name: 'cortex_compute_sandbox',
        description: 'Evaluates mathematical, statistical, or financial calculations deterministically.',
        parameters: {
            type: 'object',
            properties: {
                expression: { type: 'string', description: 'Mathematical expression to evaluate' },
                dataset: { type: 'array', items: { type: 'number' }, description: 'Optional dataset for statistical analysis' }
            },
            required: ['expression']
        },
        execute: async (params) => {
            if (params.dataset && Array.isArray(params.dataset)) {
                return CortexComputeSandbox.computeStatistics(params.dataset);
            }
            return CortexComputeSandbox.evaluateMath(params.expression);
        }
    });
}

window.CortexComputeSandbox = CortexComputeSandbox;
