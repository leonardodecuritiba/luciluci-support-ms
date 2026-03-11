import { Counter, Histogram, Registry, collectDefaultMetrics } from 'prom-client';

export const metricsRegistry = new Registry();

collectDefaultMetrics({ register: metricsRegistry });

export const httpRequestCounter = new Counter({
	name: 'http_requests_total',
	help: 'Total HTTP requests processed by standard-ms.',
	labelNames: ['method', 'route', 'status_code'],
	registers: [metricsRegistry],
});

export const httpRequestDuration = new Histogram({
	name: 'http_request_duration_ms',
	help: 'HTTP request duration in milliseconds.',
	labelNames: ['method', 'route', 'status_code'],
	buckets: [10, 50, 100, 200, 500, 1000, 3000],
	registers: [metricsRegistry],
});
