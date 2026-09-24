# AI_FIRST

## Estado de trabalho

Este checkout é `support-ms`. Profile foi retirado, a base operacional foi
materializada; RF01–RF06 estão `IMPLEMENTED_AND_PROVEN` em
`MAIN_BASELINE_RF06`, contra a revisão canônica 0.8, e RF07a/RF07b
e RF08–RF13 permanecem `NOT_IMPLEMENTED`. A revisão pós-S1 reabriu o fechamento por
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

## Git após a integração RF06

A baseline RF06 é o ponto estável de `main`, no merge da PR #5
`0387167cfe02416c5d05cf3b8288350dd5ba682b`. O contrato RF05 0.7 está
publicado em `cc9a4399d210114e3c8261f3c153f8339c049ffb`; o contrato RF06
0.8 está publicado em `4650ec671c948a4fa8fb04fa33b300d8fd255ae4`.
A PR #5 integrou RF06 com CI aprovada; a página da PR não registra revisão
formal. RF07a/RF07b seguem sem runtime e com checkpoint contratual bloqueado
por decisões abertas. Não iniciar implementação antes de congelar o contrato
e não usar force-push em `main`.
