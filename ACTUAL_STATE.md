# ACTUAL_STATE

## Estado atual — bootstrap + RF01–RF05

- serviço: `support-ms`; domínio: `support`
- S1: `BOOTSTRAP_IMPLEMENTED_AND_PROVEN`
- drift: `DRIFT-SUP-S1-001 / RESOLVED / PROVEN`
- RF01–RF04: `IMPLEMENTED_AND_PROVEN` e integradas em `main`
- baseline estável: `MAIN_BASELINE_RF04`, revisão
  `04f4f8eb0f9c741fae7947a370fb50c121d8a624`
- RF05: `IMPLEMENTED_AND_PROVEN` na branch `feat/support-rf05-create-ticket`;
  ainda não integrada em `main`
- RF06–RF13, incluindo RF07a/RF07b: `NOT_IMPLEMENTED`
- contrato RF04: revisão 0.6 publicada na branch canônica
  `docs/support-rf04-contract`, commit
  `864e02a9885852a6c6f6a385c3301e9a757edb60`
- contrato RF05: revisão 0.7 publicada na branch canônica
  `docs/support-rf05-contract`, commit
  `cc9a4399d210114e3c8261f3c153f8339c049ffb`

## Superfície materializada

Identidade Support, endpoints operacionais, ausência explícita de mensageria e
as quatro operações de Department e a criação de Ticket implementadas:

- RF01: `POST /api/support/departments`;
- RF02: `PATCH /api/support/departments/{departmentId}`;
- RF03: `GET /api/support/departments`.
- RF04: `DELETE /api/support/departments/{departmentId}`.
- RF05: `POST /api/support/tickets`.

RF03 lista somente `active=true`, permite apenas `type`, `page` e `size`, usa
defaults `page=1`/`size=20`, ordena por `name ASC,id ASC` e devolve o shape
completo de Department. Memberships preservam posição e duplicatas. A leitura
não adiciona migration, write, ACL local, auditoria, evento, outbox ou
idempotência. RF04 faz soft delete transacional com lock pessimista, retorna
`204`, preserva memberships e é no-op quando o Department já está inativo.
RF05 cria, em uma transação, Ticket, mensagem inicial, mídias posicionais e um
único AuditLog `criacao_ticket`, depois de bloquear e validar Department. O
`number` vem de sequence PostgreSQL global e gapful. Seed de W1 continua
bloqueada; RF06–RF13, eventos, outbox e mensageria não foram materializados.

## Evidências

S1, RF01 e RF02 permanecem documentadas nos reports históricos. RF03 foi
validada com lint, build, `build:check`, OpenAPI, mensageria inativa, 33 testes
unitários, 64 de integração, 2 de contrato e cobertura total de 99 testes. A
cobertura foi 97,8% statements, 78,76% branches, 97,5% functions e 97,73%
lines.

A implementação RF04 passou em 37 testes unitários, 70 de integração e 2 de
contrato; a cobertura total executou 109 testes e atingiu 97,94% statements,
79,66% branches, 97,64% functions e 97,87% lines.

A implementação RF05 passou em 19 suítes/146 testes. A cobertura total foi
98,18% statements, 83,68% branches, 98,09% functions e 98,13% lines. As provas
PostgreSQL RF01–RF05 passaram em bancos exclusivos e descartados. A prova RF05
confirmou schema/revert/reapply, processo compilado, aggregate, mídia com ordem
e duplicatas, rollbacks induzidos em Message e AuditLog, gap de sequence, oito
creates paralelos e serialização RF04×RF05 nos dois ordenamentos. O smoke da
imagem real também criou Department e Ticket RF05. RF06–RF13 permaneceram 404.

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

O CI remoto da PR #3 passou no head
`e61a6ed2fb9796a202f41c9b00f9188afa7f737b`; a integração criou o merge
`04f4f8eb0f9c741fae7947a370fb50c121d8a624`. O checkpoint RF05 foi somente
documental e não reexecutou nem reatribuiu as 109 provas de RF04.

## Git e continuidade

PR #3 foi integrada em `main` no merge acima; `main` local e `origin/main`
foram conferidas nesse mesmo SHA, que estabelece `MAIN_BASELINE_RF04`. A branch
RF04 é ancestral da baseline. O gitlink local avançou para a revisão canônica
0.7 publicada em `cc9a4399d210114e3c8261f3c153f8339c049ffb`.

As cinco decisões do checkpoint RF05 foram materializadas: sequence gapful,
mensagem inicial visível, `201` somente com Ticket e sem `Location`, Department
inativo `422 department_inactive` e `mediaIds=[]` preservando ordem e duplicatas.
O estado da branch é `RF05_IMPLEMENTED_AND_PROVEN`; `main` continua
`MAIN_BASELINE_RF04` até publicação, PR e integração.
