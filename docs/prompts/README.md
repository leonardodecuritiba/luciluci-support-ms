# docs/prompts

Prompts prontos para uso operacional com IA no template-base `standard-ms`.

## Três momentos operacionais

1. bootstrap/derivação do microserviço
2. report/review de completude
3. drift-fix por ondas

Fluxo canônico herdado do template:

- `bootstrap/build -> report -> drift-fix -> report -> drift-fix -> wave final`

## Bootstrap/derivação do microserviço

Use em conjunto:

- `.codex/skills/microservice-builder.md`
- `docs/prompts/bootstrap-prompt.md`
- `docs/prompts/microservice-builder-prompt.md`

Atalho operacional:

- `docs/prompts/microservice-builder-short-prompt.md`

Papéis:

- `bootstrap-prompt.md`: preflight e enquadramento da derivação
- `microservice-builder-prompt.md`: execução da wave de bootstrap/implementação
- `microservice-builder-short-prompt.md`: atalho curto para IDE/Chat

Regras:

- comece a partir de `service-identity.json` como fonte de verdade local da identidade do serviço/template
- audite resíduos `profile`, `profiles`, `standard-ms` e `standard_ms` antes de implementar RF
- implemente RF por RF em pequenos lotes
- mantenha alinhados no mesmo ciclo: código, testes, OpenAPI, AsyncAPI, `api.http`, `ACTUAL_STATE.md`, docs, prompts e CI

## Report/review de completude

Use em conjunto:

- `.codex/skills/report-review.md`
- `docs/prompts/report-completeness-prompt.md`
- `docs/reports/REPORT-TEMPLATE.md`

Atalho operacional:

- `docs/prompts/report-completeness-short-prompt.md`

Regras:

- use `wave-1`, `wave-2`, `wave-3` ou `final` conforme o estágio real
- compare template, código, testes, contratos, runbooks e CI
- registre o que foi comprovado, inferido ou bloqueado por ambiente

## Drift-fix por ondas

Use em conjunto:

- `.codex/skills/drift-fix.md`
- `.codex/drifts/<NOME_DO_DRIFT>.md`

Atalho operacional:

- `docs/prompts/drift-execution-short-prompt.md`

Regras:

- corrija um drift por vez
- implemente apenas o necessário para fechar o drift informado
- valide com evidência objetiva antes da próxima wave
