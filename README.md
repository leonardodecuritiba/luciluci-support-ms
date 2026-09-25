# support-ms

## RF12 nesta branch

`feat/support-rf12-list-messages` implementa e prova a listagem
`GET /api/support/tickets/{ticketId}/messages` conforme Support 0.14
(`820b2a8`). `main` permanece `MAIN_BASELINE_RF11`; RF12 ainda não foi
integrada e RF13 segue indisponível. O
[report RF12](docs/reports/REPORT-SUPPORT-RF12-20260925.md) registra testes,
PostgreSQL descartável, concorrência e smoke da imagem. O restante desta página
preserva a fotografia documental anterior.

Microsserviço de Support (Suporte) da LuciLuci. RF01–RF11 compõem
`MAIN_BASELINE_RF11` em `main` (merge da PR #12 `9387b3d`). Support 0.14
(`820b2a8`) congela o contrato RF12; Support 0.13
(`4958fd1`) congela o contrato RF11; Support 0.12 (`85c7e95`) congela o
contrato RF10; Support 0.10 (`93edf66`) congela o contrato RF08; Support 0.9
(`1583a58`) congelou RF07a/RF07b. A fonte de verdade de negócio
está em `luciluci-docs/support/`.

## Estado

RF12 está `RF12_CONTRACT_CHECKPOINT_READY / RF12_CONTRACT_FROZEN /
NOT_IMPLEMENTED` em Support 0.14. A listagem GET de mensagens tem escopo de
visibilidade por papel, paginação, ordem cronológica e leitura coerente
congelados documentalmente. O
[fechamento RF12](docs/reports/REPORT-SUPPORT-RF12-CONTRACT-20260925-185019.md)
registra decisões e publicação canônica; RF13 continua pendente. Não há
runtime RF12/RF13 nem deploy.

### Fotografia histórica — checkpoint RF12 bloqueado

Naquele checkpoint, RF12 estava em estado
`RF12_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION`: falta decidir a visibilidade
segura de mensagens internas por papel, filtro e total, além dos detalhes da
listagem. Support 0.14 ainda não estava congelado e não havia runtime RF12/RF13. O
[report do checkpoint RF12](docs/reports/REPORT-SUPPORT-RF12-CHECKPOINT-20260925-182925.md)
registra fontes e decisões pendentes. A PR documental #13 foi integrada no
merge `7724382`; o gitlink então continuava Support 0.13 (`4958fd1`).

RF11 está implementada, provada e integrada em `main` sob Support 0.13. A rota
PATCH altera apenas `TicketMessage.isVisibleToRequester` de mensagens admin e preserva Ticket,
mídias e auditorias. RF12/RF13 continuam sem runtime. A
[PR #12](https://github.com/leonardodecuritiba/luciluci-support-ms/pull/12)
foi integrada no merge `9387b3d` após `ci / quality` no run `36169743450`.
Não houve deploy.
[Report de implementação local](docs/reports/REPORT-SUPPORT-RF11-20260925.md).

### Fotografia histórica do congelamento contratual

Support 0.13 (`4958fd1`) congelou somente o contrato RF11. Naquele
fechamento documental, o estado era
`RF11_CONTRACT_CHECKPOINT_READY / RF11_CONTRACT_FROZEN / NOT_IMPLEMENTED`.
O [report contratual RF11](docs/reports/REPORT-SUPPORT-RF11-CONTRACT-20260925-165105.md)
registra as decisões, a publicação canônica e o limite documental. RF12/RF13
continuam sem runtime; nenhum deploy foi realizado neste lote.

O checkpoint documental RF11 anterior estava
`RF11_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION`: a política de quais mensagens
podem mudar de visibilidade e outros efeitos da operação exigem decisão
expressa. Esse bloqueio foi resolvido no contrato 0.13; a fotografia histórica
permanece no
[report RF11](docs/reports/REPORT-SUPPORT-RF11-CHECKPOINT-20260925-161025.md).

Na fotografia anterior, RF10 estava implementada, provada e integrada em
`main` pela PR #10. O check remoto `ci / quality` passou no run `36156561044`.
A prova PostgreSQL RF10, regressões RF01–RF09 e smoke da imagem
passaram em recursos descartáveis. Não houve deploy. Veja o report RF10 em
`docs/reports/`.

S1 e RF01–RF11 estão implementadas, provadas e integradas. RF06 implementa
`PATCH /api/support/tickets/{ticketId}` com ACL, transferência, no-op e auditoria
transacional. RF07a/RF07b foram integradas pela PR #7,
com consultas de tickets por ownership e membership atual de Department.
RF08 foi integrada pela PR #8, RF09 pela PR #9, RF10 pela PR #10 e RF11 pela
PR #12. RF12/RF13 não têm runtime.
O contrato RF10 está `RF10_CONTRACT_CHECKPOINT_READY / RF10_CONTRACT_FROZEN`
em Support 0.12; a implementação RF10 foi integrada. O contrato RF08 está
`RF08_CONTRACT_FROZEN / RF08_CONTRACT_CHECKPOINT_READY` em Support 0.10.
DEC-SUP-01/08/09 foram resolvidas exclusivamente para RF09 na revisão canônica
Support 0.11 publicada (`a198b46`).
Os checkpoints bloqueados anteriores de RF09 e RF10 permanecem históricos.
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
- `GET /api/support/tickets/{ticketId}`
- `POST /api/support/tickets/{ticketId}/messages` (RF10)
- `PATCH /api/support/tickets/{ticketId}/messages/{messageId}/visibility` (RF11)

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
no merge `45be903`. A prova RF09 passou em banco descartável com processo
compilado e snapshots físicos sem escrita; regressões e gates constam do report RF09.
O check `quality` da PR #9 passou no run `36145983860`, head `93fd483`, antes
do merge `393af3e`.

## Fluxo Git por baseline funcional

RF01–RF05 foram integradas nas PRs anteriores; a PR #5 integrou RF06 e
estabeleceu `MAIN_BASELINE_RF06`. O contrato RF06 0.8 foi publicado no
submódulo em `4650ec671c948a4fa8fb04fa33b300d8fd255ae4`; RF07a/RF07b foram
congeladas em Support 0.9, `1583a586793437a7b7c0569581637ee8ddac5ae5`.
RF08 foi congelada documentalmente em Support 0.10,
`93edf66d6ed0002a2af537339da315db1285a779`.
RF08 foi integrada em `MAIN_BASELINE_RF08`. O contrato RF09 0.11 foi congelado,
publicado e fixado no gitlink; RF09 foi integrada em `MAIN_BASELINE_RF09`.
O contrato RF10 Support 0.12 foi publicado e fixado no gitlink antes do avanço
para 0.13; a branch funcional foi integrada pela PR #10. O contrato RF11
Support 0.13 foi publicado e fixado no gitlink; a branch funcional foi
integrada pela PR #12.
Desenvolva as próximas RFs em branches próprias. Consulte
[`docs/workflows/support-development-branch-policy.md`](docs/workflows/support-development-branch-policy.md).

Não execute `npm run infra:down` como limpeza genérica: o script remove volumes.
