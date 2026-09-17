# tests

As suítes provam S1 e RF01–RF03: identidade, ausência de Profile, mensageria
inativa, kernel HTTP, Department, OpenAPI, seed bloqueada e idempotência genérica.

- `unit/`: kernel e invariantes de bootstrap.
- `integration/`: superfície HTTP com Express e SQLite em memória, incluindo RF01–RF03.
- `contract/`: OpenAPI operacional e RF01–RF03.

RF03 também tem prova funcional em processo compilado/PostgreSQL e smoke de
imagem; RF04–RF13 permanecem ausentes.
