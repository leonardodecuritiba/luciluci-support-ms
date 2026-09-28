# Local Development

## Seed W1 em banco descartável

A seed W1 é tooling local/CI, não comando de produção. Provisione um
PostgreSQL isolado e crie um **banco novo**, sem dados preexistentes, chamado
`support_seed_local_<sufixo>`. Configure `DB_HOST=127.0.0.1` (ou `::1`), `DB_PORT`, `DB_USER`,
`DB_PASSWORD` e `DB_NAME` explicitamente para esse banco. Depois:

```bash
NODE_ENV=development DB_NAME=support_seed_local_<sufixo> npm run migration:run
NODE_ENV=development SUPPORT_SEED_CONFIRM=W1_DISPOSABLE DB_NAME=support_seed_local_<sufixo> npm run seed
```

O comando aceita apenas `EMPTY` migrado com sequence inicial ou
`EXACT_W1`; o segundo caso retorna `ALREADY_SEEDED` sem escrita.
`DIVERGENT` recusa sem reparar dados. A CLI recusa host remoto e exige
`DB_HOST` explícito em loopback antes de carregar o DataSource. Se uma falha consumir a sequence,
descarte e recrie **somente o banco descartável criado para W1**. Nunca
aponte a seed para `support_ms`, DB compartilhado, staging ou produção.
Para a prova automatizada use `npm run proof:seed:w1:postgres` com as
variáveis `S1_PROOF_DB_*`, `S1_PROOF_ADMIN_DB`,
`S1_PROOF_SERVER_PORT` e nome `support_s1_proof_seed_<sufixo>` (CI:
`support_s1_ci_seed_<sufixo>`). O harness cria e descarta apenas bancos
próprios. Detalhes e evidências no
[report W1](../reports/REPORT-SUPPORT-SEED-W1-20260928-193318.md).

## Fotografia histórica — desenvolvimento anterior à W1

## Estado e provas RF01–RF09

`DRIFT-SUP-S1-001` foi encerrado: o build de produção emite `dist/main.js` e
os runners em `dist/shared/...`, verificados por `npm run build:check`. Não
tratar `npm run dev` ou testes in-process como prova da cadeia compilada.

As provas versionadas são `npm run proof:rf01:postgres`,
`npm run proof:rf02:postgres`, `npm run proof:rf03:postgres`,
`npm run proof:rf04:postgres`, `npm run proof:rf05:postgres`,
`npm run proof:rf06:postgres`, `npm run proof:rf07:postgres` e
`npm run proof:rf08:postgres` e `npm run proof:rf09:postgres` (requerem todos os
`S1_PROOF_DB_*`, `S1_PROOF_ADMIN_DB` e `S1_PROOF_SERVER_PORT` explícitos) e
`npm run proof:s1:image`. Os compose files normais têm nomes fixos e volume
persistente; não usá-los como ambiente de prova isolado.
Para RF08, use `S1_PROOF_DB_NAME=support_s1_proof_rf08_<sufixo>` ou
`support_s1_ci_rf08_<sufixo>`, banco previamente ausente. O script cria e
descarta somente esse banco, usa processo compilado e prova rollback/no-op e
locks PostgreSQL. Não aponte as provas para `support_ms` ou outro banco existente.

Para RF09, use `S1_PROOF_DB_NAME=support_s1_proof_rf09_<sufixo>` ou
`support_s1_ci_rf09_<sufixo>`, banco previamente ausente. O script comprova
GET por ID, ACL atual, erros, projeção exata e snapshots físicos sem escrita
de seis tabelas, depois descarta o banco criado.

## Desenvolvimento local (destino previamente conferido)

```bash
npm ci
test -e .env || cp .env.example .env
npm run infra:up
npm run migration:run
npm run dev
```

O compose local inicia somente PostgreSQL. `start:docker` executa migrations,
portanto use apenas banco Support novo e isolado.

Não execute `npm run infra:down` como limpeza genérica: ele remove volumes.
Na [fotografia documental W1](../reports/REPORT-SUPPORT-SEED-W1-DEFINITION-20260928-184122.md),
`npm run seed` ainda bloqueava antes de conectar. A instrução atual de uso
seguro está no início deste runbook.

Validação local:

```bash
npm run lint
npm run build
npm run build:check
npm run openapi:export
npm run openapi:check
npm run messaging:check
npm run test:coverage
npm run coverage:check
```
