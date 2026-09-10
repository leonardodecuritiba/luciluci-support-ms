# DRIFT_REPORT

## Drift encerrado

| ID                                                                     | Estado            | Impacto                                                                 | Próxima ação                             |
| ---------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------- | ---------------------------------------- |
| [DRIFT-SUP-S1-001](.codex/drifts/DRIFT-SUP-S1-001-dist-entrypoints.md) | RESOLVED / PROVEN | Build emite os entrypoints declarados; gates e provas isoladas passaram | Não reabrir sem nova reprodução objetiva |

O estado global é `BOOTSTRAP_IMPLEMENTED_AND_PROVEN`. A falha original foi de
build/configuração, não de disponibilidade PostgreSQL.

## Correção e evidência

`tsconfig.build.json` passou a compilar somente `src/` com raiz `src`; scripts
continuam a apontar a `dist/main.js` e `dist/shared/...`. `build:check`, teste
de fixture e CI validam esses entrypoints. A prova local usou PostgreSQL novo,
runner compilado e TS, reexecução, revert/reapply, processo real e imagem
isolada. Ver [report de fechamento](docs/reports/REPORT-SUPPORT-S1-CLOSURE-20260910-163634.md).

## Histórico preservado

A retirada de Profile, contratos/eventos ativos, broker e seed de exemplo
permanece materializada. Os gates anteriores estão no
[report original](docs/reports/REPORT-SUPPORT-BOOTSTRAP-20260910-154444.md). O [report de revisão](docs/reports/REPORT-SUPPORT-S1-REVIEW-20260910-161432.md) acrescenta
a reprodução posterior e supera a declaração de ausência de drifts abertos.

## Escopo atual e futuro

RF01 está `IMPLEMENTED_AND_PROVEN` neste HEAD. A documentação canônica 0.3
fechou DEC-SUP-01, 03, 08, 09 e 10 **somente para RF01**, materializada em
`POST /api/support/departments`. RF02–RF13 e as mesmas decisões em seus outros
slices permanecem abertas.

Não há drift técnico aberto conhecido após S1/RF01. O próximo trabalho é o
checkpoint de RF02, não novo bootstrap nem mensageria.

## Fechamento de baseline e continuidade

Não há drift técnico aberto conhecido no recorte S1 + RF01. O estado publicável
é `MAIN_BASELINE_RF01`: bootstrap e RF01 comprovados; RF02–RF13 permanecem
`NOT_IMPLEMENTED` e suas rotas devem continuar ausentes até o respectivo lote.

Após a publicação desta baseline, nenhuma RF funcional nova deve ser desenvolvida
diretamente em `main`. Cada RF deve partir de `main` sincronizada em branch própria,
passar por seu checkpoint documental e retornar a `main` somente após evidência do
recorte. A política operacional está em
`docs/workflows/support-development-branch-policy.md`.
