# AI_FIRST

## Estado de trabalho

Este checkout é `support-ms`. Profile foi retirado, a base operacional foi
materializada; RF01–RF04 estão `IMPLEMENTED_AND_PROVEN` em
`MAIN_BASELINE_RF04`. RF05 está `IMPLEMENTED_AND_PROVEN` na branch funcional,
contra a revisão canônica 0.7, e RF06–RF13
permanecem `NOT_IMPLEMENTED`. A revisão pós-S1 reabriu o fechamento por
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

## Git após a implementação RF05

A baseline bootstrap + RF01–RF04 é o ponto estável de `main`, no merge
`04f4f8eb0f9c741fae7947a370fb50c121d8a624`. O contrato RF04 continua no
commit canônico `864e02a9885852a6c6f6a385c3301e9a757edb60`. O contrato RF05 0.7 está
publicado em `cc9a4399d210114e3c8261f3c153f8339c049ffb`. A branch
`feat/support-rf05-create-ticket` contém a implementação provada, ainda sem
commit/push/PR/merge. Não iniciar RF06 e não usar force-push.
