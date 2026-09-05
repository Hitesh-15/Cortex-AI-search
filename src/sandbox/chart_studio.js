/**
 * Cortex In-Answer Chart Studio & SVG Visualization Engine
 * Generates lightweight, zero-dependency, responsive SVG vector charts (Line, Bar, Sparklines)
 * embedded directly within synthesized research answers.
 */

class CortexChartStudio {
    /**
     * Generate an interactive SVG Line Chart for time-series or trend data
     * @param {Array<{label: string, value: number}>} dataPoints
     * @param {Object} options - { title, yUnit, color }
     */
    static renderLineChart(dataPoints, options = {}) {
        if (!Array.isArray(dataPoints) || dataPoints.length < 2) return '';

        const width = 580;
        const height = 220;
        const padX = 50;
        const padY = 35;

        const values = dataPoints.map(d => d.value);
        const minVal = Math.min(...values);
        const maxVal = Math.max(...values);
        const valRange = maxVal === minVal ? 1 : maxVal - minVal;

        // Map values to coordinates
        const stepX = (width - 2 * padX) / (dataPoints.length - 1);
        const coords = dataPoints.map((d, i) => {
            const x = padX + i * stepX;
            const normY = (d.value - minVal) / valRange;
            const y = height - padY - (normY * (height - 2 * padY));
            return { x, y, label: d.label, value: d.value };
        });

        // Construct SVG smooth path
        let pathD = `M ${coords[0].x} ${coords[0].y}`;
        for (let i = 1; i < coords.length; i++) {
            pathD += ` L ${coords[i].x} ${coords[i].y}`;
        }

        // Gradient area under curve
        const areaD = `${pathD} L ${coords[coords.length - 1].x} ${height - padY} L ${coords[0].x} ${height - padY} Z`;

        const chartId = `chart_${Math.random().toString(36).substr(2, 8)}`;
        const lineColor = options.color || '#38bdf8';
        const unit = options.yUnit || '';

        const pointsSvg = coords.map((c, i) => `
            <g class="chart-point-group">
                <circle cx="${c.x}" cy="${c.y}" r="4.5" fill="${lineColor}" stroke="#0f172a" stroke-width="2" />
                <text x="${c.x}" y="${c.y - 10}" text-anchor="middle" fill="#f8fafc" font-size="11" font-weight="600" font-family="sans-serif">${c.value}${unit}</text>
                <text x="${c.x}" y="${height - 12}" text-anchor="middle" fill="#94a3b8" font-size="10.5" font-family="sans-serif">${c.label}</text>
            </g>
        `).join('');

        const gridSvg = `
            <line x1="${padX}" y1="${padY}" x2="${width - padX}" y2="${padY}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3,3" />
            <line x1="${padX}" y1="${(height)/2}" x2="${width - padX}" y2="${(height)/2}" stroke="rgba(255,255,255,0.06)" stroke-dasharray="3,3" />
            <line x1="${padX}" y1="${height - padY}" x2="${width - padX}" y2="${height - padY}" stroke="rgba(255,255,255,0.15)" stroke-width="1.5" />
        `;

        return `
            <div class="cortex-chart-card">
                <div class="cortex-chart-header">
                    <div class="cortex-chart-title-group">
                        <i class="fa-solid fa-chart-line text-cyan"></i>
                        <span class="cortex-chart-title">${options.title || 'Temporal Trend Analysis'}</span>
                    </div>
                    <span class="cortex-chart-badge">SVG Vector</span>
                </div>
                <div class="cortex-chart-svg-container">
                    <svg viewBox="0 0 ${width} ${height}" class="cortex-chart-svg" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <linearGradient id="${chartId}_grad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stop-color="${lineColor}" stop-opacity="0.32" />
                                <stop offset="100%" stop-color="${lineColor}" stop-opacity="0.0" />
                            </linearGradient>
                        </defs>
                        ${gridSvg}
                        <path d="${areaD}" fill="url(#${chartId}_grad)" />
                        <path d="${pathD}" fill="none" stroke="${lineColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />
                        ${pointsSvg}
                    </svg>
                </div>
            </div>
        `;
    }

    /**
     * Generate an interactive SVG Comparison Bar Chart
     * @param {Array<{label: string, value: number, category?: string}>} items
     * @param {Object} options - { title, yUnit }
     */
    static renderBarChart(items, options = {}) {
        if (!Array.isArray(items) || items.length === 0) return '';

        const maxVal = Math.max(...items.map(it => it.value), 1);
        const barsHtml = items.map((it, idx) => {
            const pct = Math.round((it.value / maxVal) * 100);
            const colorClass = idx === 0 ? 'c-cyan' : (idx === 1 ? 'c-emerald' : (idx === 2 ? 'c-amber' : 'c-purple'));
            return `
                <div class="cortex-bar-row">
                    <div class="cortex-bar-label-col">
                        <span class="cortex-bar-label">${it.label}</span>
                    </div>
                    <div class="cortex-bar-track">
                        <div class="cortex-bar-fill ${colorClass}" style="width: ${pct}%;"></div>
                    </div>
                    <div class="cortex-bar-val-col">
                        <strong>${it.value}${options.yUnit || ''}</strong>
                    </div>
                </div>
            `;
        }).join('');

        return `
            <div class="cortex-chart-card">
                <div class="cortex-chart-header">
                    <div class="cortex-chart-title-group">
                        <i class="fa-solid fa-chart-column text-emerald"></i>
                        <span class="cortex-chart-title">${options.title || 'Comparative Benchmark Metrics'}</span>
                    </div>
                    <span class="cortex-chart-badge">Comparative Telemetry</span>
                </div>
                <div class="cortex-bar-container">
                    ${barsHtml}
                </div>
            </div>
        `;
    }
}

// Register tool with registry
if (window.CortexTools) {
    window.CortexTools.register({
        name: 'cortex_chart_generator',
        description: 'Generates interactive SVG line and bar charts for numerical or comparative data.',
        parameters: {
            type: 'object',
            properties: {
                chartType: { type: 'string', enum: ['line', 'bar'], description: 'Type of chart' },
                data: { type: 'array', description: 'Data array with label and value properties' },
                options: { type: 'object', description: 'Visual styling options' }
            },
            required: ['chartType', 'data']
        },
        execute: async (params) => {
            if (params.chartType === 'line') {
                return CortexChartStudio.renderLineChart(params.data, params.options);
            }
            return CortexChartStudio.renderBarChart(params.data, params.options);
        }
    });
}

window.CortexChartStudio = CortexChartStudio;
