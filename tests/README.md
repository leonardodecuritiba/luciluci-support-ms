# tests

As suítes provam S1 e RF01–RF05: identidade, ausência de Profile, mensageria
inativa, kernel HTTP, Department, criação atômica de Ticket, OpenAPI, seed
bloqueada e idempotência genérica.

- `unit/`: kernel, Department e regras puras da RF05.
- `integration/`: superfície HTTP com Express e SQLite em memória, incluindo RF01–RF05.
- `contract/`: OpenAPI operacional e RF01–RF05.

RF01–RF05 têm provas funcionais em processo compilado/PostgreSQL. Semântica de
sequence, rollback e lock RF04×RF05 é afirmada somente pela proof PostgreSQL;
o smoke da imagem cobre o CMD real. RF06–RF13 permanecem ausentes.
