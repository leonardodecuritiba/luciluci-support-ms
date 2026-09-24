# DRIFT_REPORT

## Drift encerrado

| ID                                                                     | Estado            | Impacto                                                                 | Próxima ação                             |
| ---------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------- | ---------------------------------------- |
| [DRIFT-SUP-S1-001](.codex/drifts/DRIFT-SUP-S1-001-dist-entrypoints.md) | RESOLVED / PROVEN | Build emite os entrypoints declarados; gates e provas isoladas passaram | Não reabrir sem nova reprodução objetiva |

O estado global permanece `BOOTSTRAP_IMPLEMENTED_AND_PROVEN`. A correção e as
provas históricas estão no
[report S1](docs/reports/REPORT-SUPPORT-S1-CLOSURE-20260910-163634.md).

## Escopo atual

RF01–RF04 estão `IMPLEMENTED_AND_PROVEN` em `MAIN_BASELINE_RF04`.
RF05 tem contrato 0.7 congelado, sem runtime integrado em `main`; RF06 está em
checkpoint documental bloqueado por decisões e sem revisão 0.8. DEC-SUP-03/05
e aspectos de DEC-SUP-01/06/08/10 seguem abertos para RF06. RF06–RF13
permanecem fora do runtime da baseline.

Não há drift técnico aberto conhecido em S1/RF01/RF02/RF03/RF04. As lacunas RF06 são decisões contratuais, não defeitos técnicos reproduzidos. O checkpoint RF03
inicialmente registrou uma lacuna contratual, não um defeito de runtime; ela foi
fechada antes da implementação. As provas não reproduziram regressão: RF01 e
RF02 passaram novamente em PostgreSQL real. No lote RF04, RF01–RF03 passaram
novamente e RF05–RF13 permaneceram `404`.

## Continuidade

O merge `04f4f8eb0f9c741fae7947a370fb50c121d8a624` define `MAIN_BASELINE_RF04`. O contrato RF05 0.7 está publicado em `cc9a4399d210114e3c8261f3c153f8339c049ffb`, sem alterar o gitlink da `main`. O checkpoint RF06 vive em worktree documental isolada e não libera runtime. Nenhum drift técnico novo foi aberto.
