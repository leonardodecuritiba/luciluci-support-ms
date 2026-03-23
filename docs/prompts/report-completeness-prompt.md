# report-completeness-prompt

Use este prompt para gerar `docs/reports/REPORT-<timestamp>.md`.

```text
Gere um report de avaliação de completude do microserviço em ondas, usando obrigatoriamente `docs/reports/REPORT-TEMPLATE.md` como esqueleto.

Objetivo:
- comparar documentação canônica (`luciluci-docs/`), código real, contratos locais, testes e CI
- registrar aderência, gaps, ambiguidades, riscos e próximos passos
- produzir um artefato humano de revisão rápida

Regras:
- manter todas as seções do template
- não inventar RF nem requisito
- distinguir claramente os status das RFs: implementado, parcial, não encontrado e ambíguo
- classificar `/health`, `/metrics`, `/api-docs`, `/api-docs-json`, `/events-docs` e `/docs/asyncapi/*` como `superfície operacional local herdada do template`, não como RF do domínio nem como classificação ambígua antiga do template
- citar paths reais de código, testes, contratos e docs
- explicitar quando algo foi inferido e quando foi comprovado
- gerar em modo `wave-1`, `wave-2`, `wave-3` ou `final`
- salvar o arquivo em `docs/reports/REPORT-<timestamp>.md`
- preencher o cabeçalho interno com `generated_by`, `generated_at`, `review_mode`, `microservice`, `repository_ref` e `documentation_ref`
```
