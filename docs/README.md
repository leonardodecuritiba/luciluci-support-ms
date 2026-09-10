# docs

Documentação operacional do `support-ms`.

- `architecture/`: identidade materializada e desenho S1.
- `openapi/`: contrato operacional de Support.
- `asyncapi/`: ausência explícita de mensageria no S1.
- `runbooks/`: execução local com PostgreSQL.
- `workflows/support-bootstrap-plan.md`: inventário, evidência e passagem
  para W1.
- `workflows/support-development-branch-policy.md`: política de `main` e branches
  após RF01.
- `reports/`: avaliações por onda.

S1, RF01 e RF02 estão `IMPLEMENTED_AND_PROVEN` nesta branch; veja os
[reports de RF01](reports/REPORT-SUPPORT-RF01-20260910-174742.md),
[RF02](reports/REPORT-SUPPORT-RF02-20260910-185500.md) e o
[fechamento S1](reports/REPORT-SUPPORT-S1-CLOSURE-20260910-163634.md).
O prompt `prompts/support-main-baseline-publication-prompt.md` publica o baseline
bootstrap + RF01 com guardas Git. Os prompts de correção e RF01 são históricos.
O prompt RF02 foi executado na branch `feat/support-rf02-update-department`.
RF03–RF13 continuam bloqueadas.

A documentação canônica de negócio fica em `../luciluci-docs/support/`.
O anexo de revisão não contém esse submódulo; verificar sua revisão real local.
