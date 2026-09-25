# tests

As suítes cobrem S1 e RF01–RF09: identidade, ausência de Profile, kernel HTTP, Department, Ticket RF05–RF09, OpenAPI, seed bloqueada e mensageria inativa.

- `unit/`: kernel, Department, criação RF05, sequência de locks/no-op RF06 e transição/no-op/autorização RF08.
- `integration/`: Express e SQLite em memória, incluindo ACL, transferência, status, no-op e validação RF06; ownership, membership atual, filtros, datas UTC e paginação RF07.
- `contract/`: OpenAPI operacional e RF01–RF09, incluindo ausência de requestBody RF08/RF09 e projeção exata RF09.
- `scripts/prove-rf06-postgres.js`: processo compilado e PostgreSQL exclusivo descartável; prova rollback, lock de Ticket e revalidação de Department. SQLite não comprova locks PostgreSQL.

- `scripts/prove-rf07-postgres.js`: processo compilado e banco PostgreSQL descartável; comprova ACL, filtros, datas UTC, paginação e ausência de escritas RF07.

`scripts/prove-rf08-postgres.js` prova o processo compilado, rollback de AuditLog,
no-op e concorrências RF08×RF08/RF06×RF08 com lock PostgreSQL real em banco
descartável. RF10–RF13 permanecem ausentes.

`scripts/prove-rf09-postgres.js` prova ACL atual, leitura de Department inativo,
resposta exata e snapshots físicos sem escrita de seis tabelas em banco descartável.
