# support-ms

Microsserviço de Support (Suporte) da LuciLuci. RF01–RF08 compõem
`MAIN_BASELINE_RF08` em `main` (merge da PR #8 `45be903`). Support 0.10
(`93edf66`) congela o contrato RF08; Support 0.9 (`1583a58`) congelou RF07a/RF07b. A fonte de verdade de negócio
está em `luciluci-docs/support/`.

## Estado

S1 e RF01–RF08 estão implementadas, provadas e integradas. RF06 implementa
`PATCH /api/support/tickets/{ticketId}` com ACL, transferência, no-op e auditoria
transacional. RF07a/RF07b foram integradas pela PR #7,
com consultas de tickets por ownership e membership atual de Department.
RF08 foi integrada pela PR #8. RF09–RF13 não têm runtime. O contrato RF08 está
`RF08_CONTRACT_FROZEN / RF08_CONTRACT_CHECKPOINT_READY` em Support 0.10.
O checkpoint RF09 permanece bloqueado por DEC-SUP-01/08/09; o checkpoint RF08
bloqueado anterior permanece histórico.
Consulte [ACTUAL_STATE](ACTUAL_STATE.md) e os reports em `docs/reports/`.

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
- `GET /api/support/tickets/requester/{requesterId}`
- `GET /api/support/tickets/admin/{adminId}`
- `POST /api/support/tickets/{ticketId}/resolve`

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
`npm run proof:rf07:postgres` exige as variáveis `S1_PROOF_*`, cria somente
um banco ausente com prefixo permitido, usa processo compilado e descarta o banco.
A prova local RF07 passou em PostgreSQL 16; a CI remota da PR #7 passou no
head de implementação `65029bd` (run `36047611567`).
CI da PR #5 passou nas provas PostgreSQL RF01–RF06 e no smoke da imagem.
Na branch RF08, `npm run proof:rf08:postgres` passou em banco exclusivo
descartado, inclusive rollback de AuditLog e concorrência RF08×RF08/RF06×RF08.
As provas RF01–RF07 e o smoke da imagem foram repetidos localmente. O check
remoto `quality` do head RF08 passou no run `36065884933`; a PR #8 foi integrada
no merge `45be903`. Nenhuma prova RF09 foi executada.

## Fluxo Git por baseline funcional

RF01–RF05 foram integradas nas PRs anteriores; a PR #5 integrou RF06 e
estabeleceu `MAIN_BASELINE_RF06`. O contrato RF06 0.8 foi publicado no
submódulo em `4650ec671c948a4fa8fb04fa33b300d8fd255ae4`; RF07a/RF07b foram
congeladas em Support 0.9, `1583a586793437a7b7c0569581637ee8ddac5ae5`.
RF08 foi congelada documentalmente em Support 0.10,
`93edf66d6ed0002a2af537339da315db1285a779`.
RF08 foi integrada em `MAIN_BASELINE_RF08`. Resolva o checkpoint RF09 antes de
abrir seu runtime; desenvolva as próximas RFs em branches próprias. Consulte
[`docs/workflows/support-development-branch-policy.md`](docs/workflows/support-development-branch-policy.md).

Não execute `npm run infra:down` como limpeza genérica: o script remove volumes.
