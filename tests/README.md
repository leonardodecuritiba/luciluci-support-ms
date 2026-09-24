# tests

As suítes cobrem S1 e RF01–RF06: identidade, ausência de Profile, kernel HTTP, Department, Ticket RF05/RF06, OpenAPI, seed bloqueada e mensageria inativa.

- `unit/`: kernel, Department, criação RF05 e sequência de locks/no-op RF06.
- `integration/`: Express e SQLite em memória, incluindo ACL, transferência, status, no-op e validação RF06.
- `contract/`: OpenAPI operacional e RF01–RF06.
- `scripts/prove-rf06-postgres.js`: processo compilado e PostgreSQL exclusivo descartável; prova rollback, lock de Ticket e revalidação de Department. SQLite não comprova locks PostgreSQL.

RF07a/RF07b e RF08–RF13 permanecem ausentes.
