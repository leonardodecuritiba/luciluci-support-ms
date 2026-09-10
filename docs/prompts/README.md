# docs/prompts

Prompts operacionais do serviço de Suporte, derivado do template LuciLuci.

## Publicação da baseline bootstrap + RF01

[`support-main-baseline-publication-prompt.md`](support-main-baseline-publication-prompt.md)
fecha o trabalho acumulado e publica a baseline em `main` com guardas de
fast-forward, submódulo, staging e validação. O prompt considera `luciluci-docs` um
repositório independente e não permite que um submódulo sujo seja ocultado no
commit do serviço. Depois de uma publicação comprovada, esse prompt vira histórico.

## S1 encerrado

`DRIFT-SUP-S1-001` foi corrigido e provado; S1, RF01 e RF02 estão
`IMPLEMENTED_AND_PROVEN`. O
[prompt S1](support-s1-dist-and-proof-prompt.md) é evidência operacional
histórica, não instrução para repetir as provas.

Os prompts bootstrap/startup/S1 preservam os lotes históricos, não são
instrução para repetir derivação ou provas.

## Execução funcional RF02

O checkpoint canônico 0.4 congelou RF02 e resolveu DEC-SUP-01, 03, 06, 08, 09,
10 e 12 apenas no recorte `PATCH /api/support/departments/{departmentId}`.
O prompt [support-rf02-implementation-prompt.md](support-rf02-implementation-prompt.md)
foi executado em `feat/support-rf02-update-department`, com evidência no report
RF02. Não iniciar RF03 automaticamente.

O [prompt RF01](support-rf01-implementation-prompt.md) permanece histórico.
Não generalize as decisões RF02 para RF03–RF13 e não inicie RF03 automaticamente.

## Report e drift

Reports usam [report-completeness-prompt.md](report-completeness-prompt.md),
[atalho](report-completeness-short-prompt.md) e o
[REPORT-TEMPLATE](../reports/REPORT-TEMPLATE.md), com evidência real.
Drifts usam [drift-execution-short-prompt.md](drift-execution-short-prompt.md)
e o arquivo específico de `.codex/drifts/`. Corrigir um drift delimitado por
vez. Históricos do template não são bugs ou RFs de Support concluídos.

Fluxo: bootstrap/build → report → drift-fix → report → próxima wave.
Toda execução deve preservar mudanças locais e atualizar ACTUAL_STATE.
N/A de uma capacidade não contratada não equivale a PASS de integração.

## Support — publicação de RF02

- `support-rf02-publication-prompt.md` — fecha a branch RF02, publica documentação canônica e abre PR contra `main` com gates de integração.
