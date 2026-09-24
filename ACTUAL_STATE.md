# ACTUAL_STATE

## Estado atual — MAIN_BASELINE_RF04 e checkpoint RF06

- serviço: `support-ms`; domínio: `support`
- S1: `BOOTSTRAP_IMPLEMENTED_AND_PROVEN`
- drift: `DRIFT-SUP-S1-001 / RESOLVED / PROVEN`
- RF01–RF04: `IMPLEMENTED_AND_PROVEN` e integradas em `main`
- baseline estável: `MAIN_BASELINE_RF04`, revisão
  `04f4f8eb0f9c741fae7947a370fb50c121d8a624`
- RF05: contrato Support 0.7 congelado no commit documental
  `cc9a4399d210114e3c8261f3c153f8339c049ffb`; runtime não integrado
  a `main` nem retomado nesta execução
- RF06: `RF06_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION`; Support 0.8 não
  congelado; runtime `NOT_IMPLEMENTED`
- RF07a/RF07b e RF08–RF13: `NOT_IMPLEMENTED`

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
foram materializados em `MAIN_BASELINE_RF04`. O checkpoint RF06 depende
documentalmente de RF05 0.7, mas não toma esse contrato como prova de runtime.

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
Detalhes estão no report RF04 histórico em `docs/reports/`.

## Git e continuidade

`main` e `origin/main` foram conferidas em `04f4f8eb0f9c741fae7947a370fb50c121d8a624`; a PR #3 integrou RF04. O gitlink de `main` permanece em `864e02a9885852a6c6f6a385c3301e9a757edb60` (Support 0.6). A worktree documental RF06, separada de `main`, materializou explicitamente Support 0.7. A análise canônica está no commit local `2f3dfec` da branch `docs/support-rf06-contract`; seu push falhou por autenticação SSH. O gitlink desta branch de serviço aponta só para Support 0.7 publicado. O report local registra as decisões abertas. O estado remoto RF05 não foi usado como prova; `git ls-remote` não encontrou branch `feat/support-rf05-create-ticket` no origin nesta observação. `RF06_IMPLEMENTATION_DEPENDS_ON_RF05_RUNTIME = YES`; nenhuma branch funcional RF06 foi criada.
