# tests

As suítes provam S1 e RF01: identidade, ausência de Profile, mensageria inativa,
kernel HTTP, Department, OpenAPI, seed bloqueada e idempotência genérica.

- `unit/`: kernel e invariantes de bootstrap.
- `integration/`: superfície HTTP com Express e SQLite em memória, incluindo RF01.
- `contract/`: OpenAPI operacional e RF01.

RF02–RF13 e fluxos funcionais/E2E permanecem ausentes.
