# DRIFT_REPORT

## Drift encerrado

| ID                                                                     | Estado            | Impacto                                                                 | Próxima ação                             |
| ---------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------- | ---------------------------------------- |
| [DRIFT-SUP-S1-001](.codex/drifts/DRIFT-SUP-S1-001-dist-entrypoints.md) | RESOLVED / PROVEN | Build emite os entrypoints declarados; gates e provas isoladas passaram | Não reabrir sem nova reprodução objetiva |

O estado global permanece `BOOTSTRAP_IMPLEMENTED_AND_PROVEN`. A correção e as
provas históricas estão no
[report S1](docs/reports/REPORT-SUPPORT-S1-CLOSURE-20260910-163634.md).

## Escopo atual

RF01–RF03 estão `IMPLEMENTED_AND_PROVEN` em `main`. RF04 está
`IMPLEMENTED_AND_PROVEN` na branch `feat/support-rf04-delete-department`, com
contrato canônico 0.6 publicado.
DEC-SUP-01/03/06/08/09/10/12 foram resolvidas somente no recorte RF04 e
continuam abertas para RFs posteriores quando aplicável. RF05–RF13 permanecem
fora do runtime.

Não há drift técnico aberto conhecido em S1/RF01/RF02/RF03/RF04. O checkpoint RF03
inicialmente registrou uma lacuna contratual, não um defeito de runtime; ela foi
fechada antes da implementação. As provas não reproduziram regressão: RF01 e
RF02 passaram novamente em PostgreSQL real. No lote RF04, RF01–RF03 passaram
novamente e RF05–RF13 permaneceram `404`.

## Continuidade

O merge `0ca1eab9fcc74a4254b710fd12342d761234e9ff` define
`MAIN_BASELINE_RF03`. A PR #2 está `MERGED` e o CI remoto do head RF03 concluiu
com sucesso. O gitlink local referencia a documentação RF04 publicada em
`864e02a9885852a6c6f6a385c3301e9a757edb60`. Nenhum drift novo foi aberto. A
feature RF04 está pronta para revisão; publicação/PR devem ser conferidas no
GitHub e nenhuma integração é inferida deste arquivo.
