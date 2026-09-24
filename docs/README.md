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

S1 e RF01–RF04 estão `IMPLEMENTED_AND_PROVEN` e compõem
`MAIN_BASELINE_RF04`; RF05 tem contrato 0.7 publicado e runtime não integrado. Veja os
[reports de RF01](reports/REPORT-SUPPORT-RF01-20260910-174742.md),
[RF02](reports/REPORT-SUPPORT-RF02-20260910-185500.md) e o
[fechamento S1](reports/REPORT-SUPPORT-S1-CLOSURE-20260910-163634.md).
O prompt `prompts/support-main-baseline-publication-prompt.md` publica o baseline
bootstrap + RF01 com guardas Git. Os prompts de correção e RF01 são históricos.
O prompt RF02 foi executado na branch `feat/support-rf02-update-department` e a
PR #1 foi integrada em `main`. A PR #2 integrou RF03, com CI remoto aprovado; a PR #3 integrou RF04 e
estabeleceu `MAIN_BASELINE_RF04`. O contrato RF05 0.7 foi publicado
separadamente. O contrato RF06 0.8 foi congelado/publicado; RF06–RF13 não têm runtime
na baseline. A implementação RF06 aguarda base Git estável com RF05.

A documentação canônica de negócio fica em `../luciluci-docs/support/`.
O anexo de revisão não contém esse submódulo; verificar sua revisão real local.
