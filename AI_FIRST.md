# AI_FIRST

## Estado de trabalho

Este checkout é `support-ms`. Profile foi retirado, a base operacional foi
materializada; RF01–RF07b estão `IMPLEMENTED_AND_PROVEN` em
`MAIN_BASELINE_RF07`, contra a revisão canônica Support 0.9 para RF07.
RF08–RF13 permanecem `NOT_IMPLEMENTED`; o checkpoint RF08 está bloqueado por
decisões contratuais. A revisão pós-S1 reabriu o fechamento por
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

## Git após a integração RF07

A baseline RF06 foi o ponto estável de `main` após o merge da PR #5
`0387167cfe02416c5d05cf3b8288350dd5ba682b`. O contrato RF05 0.7 está
publicado em `cc9a4399d210114e3c8261f3c153f8339c049ffb`; o contrato RF06
0.8 está publicado em `4650ec671c948a4fa8fb04fa33b300d8fd255ae4`.
A PR #5 integrou RF06 com CI aprovada; a página da PR não registra revisão
formal. Support 0.9 congela RF07a/RF07b no commit canônico
`1583a586793437a7b7c0569581637ee8ddac5ae5`; o gitlink da PR #7
aponta a ele. A PR documental #6 foi integrada em `main` no merge `939b991`;
RF07a/RF07b estão implementadas/provadas no código da PR #7.
`RF07_IMPLEMENTATION_BASELINE = MAIN_BASELINE_RF06`. Não usar force-push em `main`.

A PR #7 foi integrada em `main` no merge
`43a556ab1c70f5de9a63e3e6ab651445fa462173`, estabelecendo
`MAIN_BASELINE_RF07`. O checkpoint RF08 não congela Support 0.10 e não altera
o gitlink Support 0.9 até decisão explícita dos pontos abertos.
