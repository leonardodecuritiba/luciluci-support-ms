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

RF01 e RF02 estão `IMPLEMENTED_AND_PROVEN` nesta branch. O checkpoint canônico
0.4 fecha DEC-SUP-01, 03, 06, 08, 09, 10 e 12 somente no recorte RF02.
RF03–RF13 e decisões fora desses recortes permanecem abertas.

Não há drift técnico aberto conhecido após S1/RF01/RF02. A implementação isolada
de RF02 está nesta branch; não iniciar novo bootstrap, RF03 ou mensageria.

## Fechamento de baseline e continuidade

Não há drift técnico aberto conhecido no recorte S1 + RF01 + RF02. A branch
`feat/support-rf02-update-department` contém a implementação comprovada de RF02;
`main` continua sendo a baseline `MAIN_BASELINE_RF01` até integração posterior.
RF03–RF13 permanecem `NOT_IMPLEMENTED` e suas rotas devem continuar ausentes.

A RF02 está publicada em `feat/support-rf02-update-department` e aberta na PR
[#1](https://github.com/leonardodecuritiba/luciluci-support-ms/pull/1), sem drift
técnico novo conhecido. O commit canônico de `luciluci-docs` que contém Support
0.4 foi publicado como `7cc153fab92b634c898727b983078c4c696d3ea9` e está
registrado no gitlink da feature.

Quando a revisão RF02 estiver integrada em `main`, ela define `MAIN_BASELINE_RF02`.
RF03–RF13 continuam fora do escopo e sem rotas; RF03 só pode começar após checkpoint
contratual próprio em branch derivada de `main` sincronizada. A política operacional
está em `docs/workflows/support-development-branch-policy.md`.
