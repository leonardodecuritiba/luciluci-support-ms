# docs

Documentação complementar do template-base `standard-ms`.

## Papel deste diretório

Este diretório materializa o workflow AI-first do template em três momentos:

1. bootstrap/derivação do microserviço
2. report/review de completude
3. drift-fix por ondas

Fluxo canônico herdado do template:

- `bootstrap/build -> report -> drift-fix -> report -> drift-fix -> wave final`

## Regras base de derivação

- O `standard-ms` é o template base; `profile` existe apenas como feature de exemplo.
- Toda derivação deve partir de `service-identity.json` na raiz como fonte de verdade local da identidade do serviço/template.
- Toda derivação deve começar auditando resíduos de `profile`, `profiles`, `standard-ms` e `standard_ms`.
- Trabalhe RF por RF em lotes pequenos.
- Alinhe no mesmo ciclo: código, testes, contratos, docs, prompts e CI.

## Navegação recomendada

### Bootstrap/derivação do microserviço

1. `.codex/skills/microservice-builder.md`
2. `prompts/bootstrap-prompt.md`
3. `prompts/microservice-builder-prompt.md`
4. `prompts/microservice-builder-short-prompt.md`
5. `../service-identity.json`
6. `architecture/service-identity.md`
7. Atualize `./luciluci-docs/` com `git submodule update --remote --recursive`
8. `architecture/overview.md`
9. `runbooks/local-development.md`
10. `runbooks/infra-access.md`

### Report/review de completude

1. `.codex/skills/report-review.md`
2. `reports/README.md`
3. `reports/REPORT-TEMPLATE.md`
4. `prompts/report-completeness-prompt.md`
5. `prompts/report-completeness-short-prompt.md`

### Drift-fix por ondas

1. `.codex/skills/drift-fix.md`
2. `.codex/drifts/<NOME_DO_DRIFT>.md`
3. `prompts/drift-execution-short-prompt.md`

### Contratos e artefatos auxiliares

1. `asyncapi/README.md`
2. `openapi/README.md`
