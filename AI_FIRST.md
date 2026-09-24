# AI_FIRST

## Estado de trabalho

Este checkout é `support-ms`. Profile foi retirado, a base operacional foi
materializada; RF01–RF04 estão `IMPLEMENTED_AND_PROVEN` em
`MAIN_BASELINE_RF04`. RF05 tem contrato 0.7 congelado e runtime não integrado
a `main`. RF06 está em checkpoint documental bloqueado por decisões; não há
runtime RF06 nem revisão Support 0.8.
DEC-SUP-01/03/06/08/09/10/12 estão fechadas
somente para RF04. A revisão pós-S1 reabriu o fechamento por
`DRIFT-SUP-S1-001`, agora `RESOLVED / PROVEN`.

## Ordem de leitura

1. `AGENTS.md`, `ACTUAL_STATE.md` e `DRIFT_REPORT.md`.
2. `README.md` e `docs/workflows/support-bootstrap-plan.md`.
3. O drift encerrado e o report de fechamento S1.
4. A identidade e o código reais.
5. `luciluci-docs/support/notes.md` para decisões por recorte de RF.
6. `luciluci-docs/support/` na revisão local fixada, sem `--remote`.
7. Para referência do lote RF02 executado, `docs/prompts/support-rf02-implementation-prompt.md`.

## Limites

Não reexecutar o drift ou RF01. O checkpoint RF02 já está fechado e a implementação
foi limitada à branch própria, após conferir o contrato 0.4 real.
Não reintroduzir Profile ou mensageria.
Seed de domínio continua fora do escopo salvo decisão explícita do lote.
Proteger bancos/volumes existentes; qualquer prova futura exige recursos
descartáveis exclusivos e ownership demonstrado.

Correlação, envelope de erro e contratos operacionais seguem preservados.
Os prompts de bootstrap e S1 são históricos. O estado das decisões funcionais
deve ser conferido no submódulo real; não assumir aprovação pelo report ou por
aplicar este patch.

## Git após a integração RF04 e checkpoint RF06

RF04 integrou `main` no merge `04f4f8eb0f9c741fae7947a370fb50c121d8a624`
(`MAIN_BASELINE_RF04`). Support 0.7 foi publicado em
`cc9a4399d210114e3c8261f3c153f8339c049ffb` como contrato RF05. Esta branch
documental RF06 não altera runtime nem retoma RF05. Resolver as perguntas no report RF06 e no commit documental local `2f3dfec`
(sem push por falha de autenticação) antes de congelar 0.8. Implementação RF06 exige
base Git estável com RF05, preferencialmente `MAIN_BASELINE_RF05`.
