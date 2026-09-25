# DRIFT_REPORT

## Drift encerrado

| ID                                                                     | Estado            | Impacto                                                                 | Próxima ação                             |
| ---------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------- | ---------------------------------------- |
| [DRIFT-SUP-S1-001](.codex/drifts/DRIFT-SUP-S1-001-dist-entrypoints.md) | RESOLVED / PROVEN | Build emite os entrypoints declarados; gates e provas isoladas passaram | Não reabrir sem nova reprodução objetiva |

O estado global permanece `BOOTSTRAP_IMPLEMENTED_AND_PROVEN`. A correção e as
provas históricas estão no
[report S1](docs/reports/REPORT-SUPPORT-S1-CLOSURE-20260910-163634.md).

## Escopo atual

RF01–RF08 estão `IMPLEMENTED_AND_PROVEN` em `main`, na baseline
`MAIN_BASELINE_RF08` (merge da PR #8 `45be90318bdb71e67532482364933cb49e6660e9`).
As decisões foram fechadas apenas em cada recorte; RF07a/RF07b têm contrato
Support 0.9 congelado e runtime implementado/provado na PR #7. RF08 foi
integrada pela PR #8; RF09 está implementada/provada somente na branch
`feat/support-rf09-get-ticket`; RF10–RF13 permanecem fora do runtime. O checkpoint RF08 bloqueado era uma lacuna
contratual; decisões posteriores a fecharam em Support 0.10, sem drift técnico
novo do runtime existente.

Não há drift técnico aberto conhecido em S1/RF01–RF06. O checkpoint RF03
inicialmente registrou uma lacuna contratual, não um defeito de runtime; ela foi
fechada antes da implementação. As provas não reproduziram regressão: RF01 e
RF02 passaram novamente em PostgreSQL real. No lote RF04, RF01–RF03 passaram
novamente e RF05–RF13 permaneceram `404`.

## Continuidade

O merge `0387167cfe02416c5d05cf3b8288350dd5ba682b` define
`MAIN_BASELINE_RF06`; a PR #5 e sua CI estão concluídas. O checkpoint RF07a/RF07b
registrou lacunas contratuais históricas, resolvidas para RF07a/RF07b em
Support 0.9. A PR documental #6 foi integrada no merge `939b991`; o gitlink da
PR #7 aponta para `1583a586793437a7b7c0569581637ee8ddac5ae5`. A prova
funcional RF07 passou em PostgreSQL 16 com banco exclusivo descartado pelo script.
O checkpoint RF08 bloqueado no commit `a8714a8` permanece histórico. As decisões
de body, response, no-op, auditoria, identidade e concorrência foram registradas
no contrato canônico Support 0.10, publicado em `93edf66d6ed0002a2af537339da315db1285a779`.
O gitlink desta branch aponta a essa revisão. O checkpoint documental
`RF08_CONTRACT_CHECKPOINT_READY / RF08_CONTRACT_FROZEN` permanece válido.
A branch funcional implementou RF08 sem alterar o contrato ou criar migration.
A prova PostgreSQL 16 descartável passou após alinhamento UTC do cliente de
prova, incluindo rollback de AuditLog e concorrência RF08×RF08/RF06×RF08.
Nenhum drift técnico novo foi identificado. O checkpoint RF09 em
`docs/reports/REPORT-SUPPORT-RF09-CHECKPOINT-20260924-223334.md` registra
DEC-SUP-01/08/09 então abertas; a aprovação posterior as fechou somente para
RF09 em Support 0.11 (`a198b46`). A primeira tentativa de publicação remota
foi bloqueada pela revisão automática; depois de autorização específica,
o SHA canônico e a branch do serviço foram publicados e conferidos. Não há
drift técnico novo do runtime naquele checkpoint; RF09–RF13 ainda estavam
ausentes naquela fotografia anterior à branch funcional.

## RF09 na branch funcional

Contrato Support 0.11 e gitlink canônico preservados. A prova PostgreSQL 16 com
banco próprio descartado, suíte HTTP/SQLite, contrato e smoke da imagem não
reproduziram drift técnico. A falha inicial da prova histórica RF02 sob fuso
local foi de interpretação de timestamp pelo cliente de prova; o replay com
`TZ=UTC` passou. RF09 permanece fora de `main`; CI remota e PR não executadas.
