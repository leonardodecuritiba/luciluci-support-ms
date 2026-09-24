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
RF05 tem contrato 0.7 congelado, sem runtime integrado em `main`. RF06 tem
contrato 0.8 congelado e publicado; DEC-SUP-01/03/05/06/08/09/10/12 foram
resolvidas somente nesse recorte. RF06–RF13 permanecem fora do runtime da
baseline, e a implementação RF06 depende de base Git estável com RF05.

Não há drift técnico aberto conhecido em S1/RF01/RF02/RF03/RF04. As lacunas do checkpoint RF06 anterior foram resolvidas documentalmente; não eram defeitos técnicos reproduzidos. O checkpoint RF03
inicialmente registrou uma lacuna contratual, não um defeito de runtime; ela foi
fechada antes da implementação. As provas não reproduziram regressão: RF01 e
RF02 passaram novamente em PostgreSQL real. No lote RF04, RF01–RF03 passaram
novamente e RF05–RF13 permaneceram `404`.

## Continuidade

O merge `04f4f8eb0f9c741fae7947a370fb50c121d8a624` define `MAIN_BASELINE_RF04`. O contrato RF05 0.7 está publicado em `cc9a4399d210114e3c8261f3c153f8339c049ffb`, sem alterar o gitlink da `main`. O contrato RF06 0.8 foi publicado em `4650ec671c948a4fa8fb04fa33b300d8fd255ae4` e não libera runtime antes de base RF05 estável. Nenhum drift técnico novo foi aberto.
