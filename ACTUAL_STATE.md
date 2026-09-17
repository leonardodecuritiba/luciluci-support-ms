# ACTUAL_STATE

## Estado atual — bootstrap + RF01–RF04

- serviço: `support-ms`; domínio: `support`
- S1: `BOOTSTRAP_IMPLEMENTED_AND_PROVEN`
- drift: `DRIFT-SUP-S1-001 / RESOLVED / PROVEN`
- RF01–RF03: `IMPLEMENTED_AND_PROVEN` e integradas em `main`
- baseline estável: `MAIN_BASELINE_RF03`, revisão
  `0ca1eab9fcc74a4254b710fd12342d761234e9ff`
- RF04: `IMPLEMENTED_AND_PROVEN` na branch
  `feat/support-rf04-delete-department`, ainda não integrada
- RF05–RF13, incluindo RF07a/RF07b: `NOT_IMPLEMENTED`
- contrato RF04: revisão 0.6 publicada na branch canônica
  `docs/support-rf04-contract`, commit
  `864e02a9885852a6c6f6a385c3301e9a757edb60`

## Superfície materializada

Identidade Support, endpoints operacionais, ausência explícita de mensageria e
as quatro operações de Department implementadas:

- RF01: `POST /api/support/departments`;
- RF02: `PATCH /api/support/departments/{departmentId}`;
- RF03: `GET /api/support/departments`.
- RF04: `DELETE /api/support/departments/{departmentId}`.

RF03 lista somente `active=true`, permite apenas `type`, `page` e `size`, usa
defaults `page=1`/`size=20`, ordena por `name ASC,id ASC` e devolve o shape
completo de Department. Memberships preservam posição e duplicatas. A leitura
não adiciona migration, write, ACL local, auditoria, evento, outbox ou
idempotência. RF04 faz soft delete transacional com lock pessimista, retorna
`204`, preserva memberships e é no-op quando o Department já está inativo.
Seed de W1 continua bloqueada; Ticket, TicketMessage e AuditLog de negócio não
foram materializados.

## Evidências

S1, RF01 e RF02 permanecem documentadas nos reports históricos. RF03 foi
validada com lint, build, `build:check`, OpenAPI, mensageria inativa, 33 testes
unitários, 64 de integração, 2 de contrato e cobertura total de 99 testes. A
cobertura foi 97,8% statements, 78,76% branches, 97,5% functions e 97,73%
lines.

A implementação RF04 passou em 37 testes unitários, 70 de integração e 2 de
contrato; a cobertura total executou 109 testes e atingiu 97,94% statements,
79,66% branches, 97,64% functions e 97,87% lines.

A prova RF03 usou PostgreSQL 16 descartável, migrations repetidas, fixtures
diretas, processo compilado e descarte do banco. Também passaram as regressões
PostgreSQL RF01/RF02 e o smoke da imagem com CMD real. A prova RF03 confirmou
RF04–RF13 em `404`. Os comandos, recursos e limitações estão no
[report RF03](docs/reports/REPORT-SUPPORT-RF03-20260917-155713.md). A prova RF04
usou outro PostgreSQL 16 descartável e processo compilado, comprovou soft
delete/no-op, preservação de memberships, exclusão da paginação RF03 e
serialização concorrente RF02/RF04. RF01–RF03 passaram novamente, RF05–RF13
permaneceram `404` e o smoke da imagem real incluiu criar/listar/excluir/listar.
Detalhes estão no report RF04 desta branch.

## Git e continuidade

PR #2 foi integrada em `main` pelo merge
`0ca1eab9fcc74a4254b710fd12342d761234e9ff`; `main` local e `origin/main`
foram conferidas nesse mesmo SHA. O CI remoto do head RF03
`95e720176b1a84933467fab6e64b9c9d83c0cd1e` concluiu com sucesso. O gitlink
local aponta para o contrato RF04 canônico publicado acima. A branch funcional
`feat/support-rf04-delete-department` nasceu dessa baseline e contém a
implementação/provas RF04. Commit, push, PR e CI são estado externo de
publicação e devem ser conferidos no GitHub; RF04 ainda não está integrada.
