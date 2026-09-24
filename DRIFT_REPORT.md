# DRIFT_REPORT

## Drift encerrado

| ID                                                                     | Estado            | Impacto                                                                 | Próxima ação                             |
| ---------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------- | ---------------------------------------- |
| [DRIFT-SUP-S1-001](.codex/drifts/DRIFT-SUP-S1-001-dist-entrypoints.md) | RESOLVED / PROVEN | Build emite os entrypoints declarados; gates e provas isoladas passaram | Não reabrir sem nova reprodução objetiva |

O estado global permanece `BOOTSTRAP_IMPLEMENTED_AND_PROVEN`. A correção e as
provas históricas estão no
[report S1](docs/reports/REPORT-SUPPORT-S1-CLOSURE-20260910-163634.md).

## Escopo atual

RF01–RF04 estão `IMPLEMENTED_AND_PROVEN` em `main`, na baseline
`MAIN_BASELINE_RF04`. RF05 está `IMPLEMENTED_AND_PROVEN` somente na branch
`feat/support-rf05-create-ticket`, contra o contrato canônico 0.7 publicado.
DEC-SUP-01/03/06/08/09/10/12 foram resolvidas somente no recorte RF04 e
continuam abertas para RFs posteriores quando aplicável. RF05 está com contrato
congelado e foi materializado sem ampliar o recorte; RF06–RF13 permanecem fora
do runtime.

Não há drift técnico aberto conhecido em S1/RF01/RF02/RF03/RF04/RF05. O checkpoint RF03
inicialmente registrou uma lacuna contratual, não um defeito de runtime; ela foi
fechada antes da implementação. As provas não reproduziram regressão: RF01 e
RF02 passaram novamente em PostgreSQL real. No lote RF04, RF01–RF03 passaram
novamente e RF05–RF13 permaneceram `404`.

## Continuidade

O merge `04f4f8eb0f9c741fae7947a370fb50c121d8a624` define
`MAIN_BASELINE_RF04`. A PR #3 está `MERGED`, seu CI remoto concluiu com sucesso
e a feature RF04 é ancestral de `main`. O gitlink local aponta para a revisão
RF05 0.7 publicada em `cc9a4399d210114e3c8261f3c153f8339c049ffb`. Nenhum
drift novo foi aberto no checkpoint. Nesta branch, as provas RF05 confirmaram
aderência à revisão 0.7 e nenhum drift novo foi aberto. Isso não altera `main`
nem estabelece `MAIN_BASELINE_RF05`.
