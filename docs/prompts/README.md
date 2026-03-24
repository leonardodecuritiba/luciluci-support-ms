# docs/prompts

Prompts prontos para uso operacional com IA.

## Prompt principal de bootstrap

- `bootstrap-prompt.md`

## Prompt principal de review de completude

- `report-completeness-prompt.md`

## Short-prompts operacionais

- `report-completeness-short-prompt.md`
- `drift-execution-short-prompt.md`

## Regra de uso

### Review de completude

Use em conjunto:

- `.codex/skills/report-review.md`
- `docs/prompts/report-completeness-prompt.md`
- `docs/reports/REPORT-TEMPLATE.md`

O arquivo `report-completeness-short-prompt.md` é apenas um atalho operacional para colar na IDE.

### Execução de drift

Use em conjunto:

- `.codex/skills/drift-fix.md`
- `.codex/drifts/<NOME_DO_DRIFT>.md`

O arquivo `drift-execution-short-prompt.md` é apenas um atalho operacional para colar na IDE.
