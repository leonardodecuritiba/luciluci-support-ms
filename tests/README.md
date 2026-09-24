# tests

As suítes cobrem S1 e RF01–RF07: identidade, ausência de Profile, kernel HTTP, Department, Ticket RF05/RF06/RF07, OpenAPI, seed bloqueada e mensageria inativa.

- `unit/`: kernel, Department, criação RF05 e sequência de locks/no-op RF06.
- `integration/`: Express e SQLite em memória, incluindo ACL, transferência, status, no-op e validação RF06; ownership, membership atual, filtros, datas UTC e paginação RF07.
- `contract/`: OpenAPI operacional e RF01–RF07.
- `scripts/prove-rf06-postgres.js`: processo compilado e PostgreSQL exclusivo descartável; prova rollback, lock de Ticket e revalidação de Department. SQLite não comprova locks PostgreSQL.

- `scripts/prove-rf07-postgres.js`: processo compilado e banco PostgreSQL descartável; comprova ACL, filtros, datas UTC, paginação e ausência de escritas RF07.

RF08–RF13 permanecem ausentes.
