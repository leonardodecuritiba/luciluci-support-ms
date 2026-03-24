# docs

Documentação complementar do template.

Leia nesta ordem:

1. `architecture/overview.md`
2. `runbooks/local-development.md`
3. `runbooks/infra-access.md`
4. Atualize `./luciluci-docs/` com `git submodule update --remote --recursive`
5. `reports/README.md`
6. `reports/REPORT-TEMPLATE.md`
7. `prompts/bootstrap-prompt.md`
8. `prompts/report-completeness-prompt.md` (usa `.codex/skills/report-review.md` + `reports/REPORT-TEMPLATE.md`)
9. `prompts/report-completeness-short-prompt.md` (atalho agnóstico ao microserviço para colar na IDE)
10. `prompts/drift-execution-short-prompt.md` (atalho agnóstico ao microserviço para executar `.codex/drifts/<NOME_DO_DRIFT>.md`)
11. `asyncapi/README.md`
12. `openapi/README.md`
