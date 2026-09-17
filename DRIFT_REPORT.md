# DRIFT_REPORT

## Drift encerrado

| ID                                                                     | Estado            | Impacto                                                                 | Próxima ação                             |
| ---------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------- | ---------------------------------------- |
| [DRIFT-SUP-S1-001](.codex/drifts/DRIFT-SUP-S1-001-dist-entrypoints.md) | RESOLVED / PROVEN | Build emite os entrypoints declarados; gates e provas isoladas passaram | Não reabrir sem nova reprodução objetiva |

O estado global permanece `BOOTSTRAP_IMPLEMENTED_AND_PROVEN`. A correção e as
provas históricas estão no
[report S1](docs/reports/REPORT-SUPPORT-S1-CLOSURE-20260910-163634.md).

## Escopo atual

RF01 e RF02 estão `IMPLEMENTED_AND_PROVEN` em `main`. RF03 está
`IMPLEMENTED_AND_PROVEN` na branch funcional, com contrato canônico 0.5
publicado. DEC-SUP-02/08 foram resolvidas apenas no recorte RF03; continuam
abertas quando aplicáveis às listagens posteriores. RF04–RF13 permanecem fora
do runtime.

Não há drift técnico aberto conhecido em S1/RF01/RF02/RF03. O checkpoint RF03
inicialmente registrou uma lacuna contratual, não um defeito de runtime; ela foi
fechada antes da implementação. As provas não reproduziram regressão: RF01 e
RF02 passaram novamente em PostgreSQL real, e RF04–RF13 permaneceram `404`.

## Continuidade

O merge `e2dba18a7d0c54577805d6bf2f44adc40ecf0295` continua definindo
`MAIN_BASELINE_RF02`. O gitlink da feature RF03 referencia documentação
publicada em `618afe5f746a8edf02f86ea0de448812e150d065`. Commit, push, PR e CI da
feature são estado externo de publicação, não drift técnico, e devem ser
conferidos no GitHub. Não iniciar RF04 antes do fechamento da RF03.
