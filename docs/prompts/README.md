# docs/prompts

Prompts operacionais do serviço de Suporte, derivado do template LuciLuci.

## Publicação da baseline bootstrap + RF01

[`support-main-baseline-publication-prompt.md`](support-main-baseline-publication-prompt.md)
fecha o trabalho acumulado e publica a baseline em `main` com guardas de
fast-forward, submódulo, staging e validação. O prompt considera `luciluci-docs` um
repositório independente e não permite que um submódulo sujo seja ocultado no
commit do serviço. Depois de uma publicação comprovada, esse prompt vira histórico.

## S1 encerrado

`DRIFT-SUP-S1-001` foi corrigido e provado; S1 e RF01 estão
`IMPLEMENTED_AND_PROVEN`. O
[prompt S1](support-s1-dist-and-proof-prompt.md) é evidência operacional
histórica, não instrução para repetir as provas.

Os prompts bootstrap/startup/S1 preservam os lotes históricos, não são
instrução para repetir derivação ou provas.

## Próxima execução funcional: checkpoint de RF02

O checkpoint documental 0.3 resolveu DEC-SUP-01, 03, 08, 09 e 10 apenas no
recorte RF01, já entregue. O
[prompt RF01](support-rf01-implementation-prompt.md) permanece como histórico
de evidência. Não inicie RF02 sem seu contrato congelado e sem criar uma branch
própria a partir de `main` sincronizada.

Os mesmos IDs de decisão podem permanecer abertos para outras RFs; não
generalize o recorte.

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
