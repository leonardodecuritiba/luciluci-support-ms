# DRIFT_REPORT

## Drift encerrado

| ID                                                                     | Estado            | Impacto                                                                 | Próxima ação                             |
| ---------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------- | ---------------------------------------- |
| [DRIFT-SUP-S1-001](.codex/drifts/DRIFT-SUP-S1-001-dist-entrypoints.md) | RESOLVED / PROVEN | Build emite os entrypoints declarados; gates e provas isoladas passaram | Não reabrir sem nova reprodução objetiva |

O estado global permanece `BOOTSTRAP_IMPLEMENTED_AND_PROVEN`. A correção e as
provas históricas estão no
[report S1](docs/reports/REPORT-SUPPORT-S1-CLOSURE-20260910-163634.md).

## Escopo atual

RF01–RF07b estão `IMPLEMENTED_AND_PROVEN` em `main`, na baseline
`MAIN_BASELINE_RF07` (merge da PR #7 `43a556ab1c70f5de9a63e3e6ab651445fa462173`).
As decisões foram fechadas apenas em cada recorte; RF07a/RF07b têm contrato
Support 0.9 congelado e runtime implementado/provado na PR #7. RF08 está
implementada/provada localmente nesta branch; RF09–RF13 permanecem fora do
runtime. O checkpoint RF08 bloqueado era uma lacuna
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
A branch funcional implementa RF08 sem alterar o contrato ou criar migration.
A prova PostgreSQL 16 descartável passou após alinhamento UTC do cliente de
prova, incluindo rollback de AuditLog e concorrência RF08×RF08/RF06×RF08.
Nenhum drift técnico novo foi identificado; RF09–RF13 continuam ausentes.
