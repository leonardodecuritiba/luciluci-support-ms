# AI_FIRST

## Estado de trabalho

Este checkout é `support-ms`. Profile foi retirado, a base operacional foi
materializada; RF01–RF03 estão `IMPLEMENTED_AND_PROVEN` em
`MAIN_BASELINE_RF03`. RF04 está `IMPLEMENTED_AND_PROVEN` na branch
`feat/support-rf04-delete-department` e RF05–RF13 permanecem `NOT_IMPLEMENTED`.
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

## Git após a implementação RF04

A baseline bootstrap + RF01–RF03 é o ponto estável de `main`, no merge
`0ca1eab9fcc74a4254b710fd12342d761234e9ff`. O contrato RF04 foi publicado no
commit canônico `864e02a9885852a6c6f6a385c3301e9a757edb60`. RF04 foi implementada
e provada em `feat/support-rf04-delete-department`, sem integração em `main`.
Não iniciar RF05 antes da integração e de checkpoint próprio; não usar
force-push.
