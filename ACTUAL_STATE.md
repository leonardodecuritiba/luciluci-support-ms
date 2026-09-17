# ACTUAL_STATE

## Estado atual — bootstrap + RF01 + RF02 + RF03

- serviço: `support-ms`; domínio: `support`
- S1: `BOOTSTRAP_IMPLEMENTED_AND_PROVEN`
- drift: `DRIFT-SUP-S1-001 / RESOLVED / PROVEN`
- RF01 e RF02: `IMPLEMENTED_AND_PROVEN` e integradas em `main`
- baseline estável: `MAIN_BASELINE_RF02`, revisão
  `e2dba18a7d0c54577805d6bf2f44adc40ecf0295`
- RF03: `IMPLEMENTED_AND_PROVEN` na branch
  `feat/support-rf03-list-departments`, ainda não integrada
- RF04–RF13, incluindo RF07a/RF07b: `NOT_IMPLEMENTED`
- contrato RF03: revisão 0.5 publicada na branch canônica
  `docs/support-rf03-contract`, commit
  `618afe5f746a8edf02f86ea0de448812e150d065`

## Superfície materializada

Identidade Support, endpoints operacionais, ausência explícita de mensageria e
as três operações de Department implementadas:

- RF01: `POST /api/support/departments`;
- RF02: `PATCH /api/support/departments/{departmentId}`;
- RF03: `GET /api/support/departments`.

RF03 lista somente `active=true`, permite apenas `type`, `page` e `size`, usa
defaults `page=1`/`size=20`, ordena por `name ASC,id ASC` e devolve o shape
completo de Department. Memberships preservam posição e duplicatas. A leitura
não adiciona migration, write, ACL local, auditoria, evento, outbox ou
idempotência. Seed de W1 continua bloqueada; Ticket, TicketMessage e AuditLog de
negócio não foram materializados.

## Evidências

S1, RF01 e RF02 permanecem documentadas nos reports históricos. RF03 foi
validada com lint, build, `build:check`, OpenAPI, mensageria inativa, 33 testes
unitários, 64 de integração, 2 de contrato e cobertura total de 99 testes. A
cobertura foi 97,8% statements, 78,76% branches, 97,5% functions e 97,73%
lines.

A prova RF03 usou PostgreSQL 16 descartável, migrations repetidas, fixtures
diretas, processo compilado e descarte do banco. Também passaram as regressões
PostgreSQL RF01/RF02 e o smoke da imagem com CMD real. A prova RF03 confirmou
RF04–RF13 em `404`. Os comandos, recursos e limitações estão no
[report RF03](docs/reports/REPORT-SUPPORT-RF03-20260917-155713.md).

## Git e continuidade

`main` local/origin foi conferida sincronizada antes da branch, e o merge da PR
#1 de RF02 é ancestral da base. O gitlink da feature aponta para o commit
canônico publicado acima. A branch funcional é o artefato de publicação da RF03;
commit, push, PR e CI remoto não devem ser inferidos deste arquivo e precisam ser
conferidos no GitHub. RF04 não deve ser iniciada antes da integração da RF03 e de
seu próprio checkpoint contratual.
