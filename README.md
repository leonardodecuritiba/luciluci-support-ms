# support-ms

Microsserviço de Support (Suporte) da LuciLuci. RF01–RF05 compõem
`MAIN_BASELINE_RF05` em `main` (merge da PR #4 `2cfb637`). RF06 está
implementada e provada localmente na branch `feat/support-rf06-update-ticket`,
contra o contrato canônico Support 0.8 (`4650ec6`). A fonte de verdade de negócio
está em `luciluci-docs/support/`.

## Estado

S1 e RF01–RF05 estão implementadas, provadas e integradas. RF06 implementa
`PATCH /api/support/tickets/{ticketId}` com ACL, transferência, no-op e auditoria
transacional; aguarda revisão e integração. RF07a/RF07b e RF08–RF13 não têm runtime.
Consulte [ACTUAL_STATE](ACTUAL_STATE.md), os reports históricos de RF01–RF05 em
`docs/reports/` e o report RF06 desta branch.

## Executar localmente

```bash
npm ci
test -e .env || cp .env.example .env
npm run infra:up
npm run migration:run
npm run dev
```

O ambiente local requer apenas PostgreSQL. Não execute `npm run seed` nesta
fase: o comando falha de modo explícito até a massa determinística de W1 ser definida.

## Endpoints disponíveis

- `GET /health`
- `GET /metrics`
- `GET /api-docs`
- `GET /api-docs-json`
- `GET /api/support/departments`
- `POST /api/support/departments`
- `PATCH /api/support/departments/{departmentId}`
- `DELETE /api/support/departments/{departmentId}`
- `POST /api/support/tickets`
- `PATCH /api/support/tickets/{ticketId}`

Consulte `api.http`, `docs/runbooks/local-development.md` e
`docs/runbooks/infra-access.md`.

## Validação

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

Antes de provas PostgreSQL, confirme o destino exclusivo e descartável.
`npm run proof:rf06:postgres` exige as variáveis `S1_PROOF_*`, cria somente
um banco ausente com prefixo permitido, usa processo compilado e descarta o banco.
A prova local RF06 passou em PostgreSQL 16. O smoke da imagem RF05 é histórico;
não há prova de imagem RF06 nesta branch.

## Fluxo Git por baseline funcional

RF01–RF04 foram integradas nas PRs anteriores; a PR #4 integrou RF05 e
estabeleceu `MAIN_BASELINE_RF05`. O contrato RF06 0.8 foi publicado no
submódulo em `4650ec671c948a4fa8fb04fa33b300d8fd255ae4`; a branch funcional
RF06 parte do merge RF05. RF06 ainda não está em `main`. Desenvolva as próximas
RFs em branches próprias depois do checkpoint correspondente. Consulte
[`docs/workflows/support-development-branch-policy.md`](docs/workflows/support-development-branch-policy.md).

Não execute `npm run infra:down` como limpeza genérica: o script remove volumes.
