# Local Development

## Estado e provas RF01/RF02

`DRIFT-SUP-S1-001` foi encerrado: o build de produção emite `dist/main.js` e
os runners em `dist/shared/...`, verificados por `npm run build:check`. Não
tratar `npm run dev` ou testes in-process como prova da cadeia compilada.

As provas versionadas são `npm run proof:rf01:postgres` e
`npm run proof:rf02:postgres` (requerem todos os
`S1_PROOF_DB_*`, `S1_PROOF_ADMIN_DB` e `S1_PROOF_SERVER_PORT` explícitos) e
`npm run proof:s1:image`. Os compose files normais têm nomes fixos e volume
persistente; não usá-los como ambiente de prova isolado.

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
Não execute `npm run seed`; o comando bloqueia antes de conectar ou gravar
até a massa determinística de W1 ser definida.

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
