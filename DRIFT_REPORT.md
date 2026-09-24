# DRIFT_REPORT

## Drift encerrado

| ID                                                                     | Estado            | Impacto                                                                 | Próxima ação                             |
| ---------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------- | ---------------------------------------- |
| [DRIFT-SUP-S1-001](.codex/drifts/DRIFT-SUP-S1-001-dist-entrypoints.md) | RESOLVED / PROVEN | Build emite os entrypoints declarados; gates e provas isoladas passaram | Não reabrir sem nova reprodução objetiva |

O estado global permanece `BOOTSTRAP_IMPLEMENTED_AND_PROVEN`. A correção e as
provas históricas estão no
[report S1](docs/reports/REPORT-SUPPORT-S1-CLOSURE-20260910-163634.md).

## Escopo atual

RF01–RF06 estão `IMPLEMENTED_AND_PROVEN` em `main`, na baseline
`MAIN_BASELINE_RF06` (merge da PR #5 `0387167cfe02416c5d05cf3b8288350dd5ba682b`).
As decisões foram fechadas apenas em cada recorte; RF07a/RF07b ainda têm
checkpoint contratual bloqueado e RF08–RF13 permanecem fora do runtime.

Não há drift técnico aberto conhecido em S1/RF01–RF06. O checkpoint RF03
inicialmente registrou uma lacuna contratual, não um defeito de runtime; ela foi
fechada antes da implementação. As provas não reproduziram regressão: RF01 e
RF02 passaram novamente em PostgreSQL real. No lote RF04, RF01–RF03 passaram
novamente e RF05–RF13 permaneceram `404`.

## Continuidade

O merge `0387167cfe02416c5d05cf3b8288350dd5ba682b` define
`MAIN_BASELINE_RF06`; a PR #5 e sua CI estão concluídas. O checkpoint RF07a/RF07b
registra lacunas contratuais, não drift de runtime. O gitlink de entrada aponta
para Support 0.8 em `4650ec671c948a4fa8fb04fa33b300d8fd255ae4`; nenhuma
prova funcional RF07 foi executada.
