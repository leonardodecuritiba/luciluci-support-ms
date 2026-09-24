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
`MAIN_BASELINE_RF04`; RF05 está implementada/provada na branch funcional contra
o contrato 0.7. Veja os
[reports de RF01](reports/REPORT-SUPPORT-RF01-20260910-174742.md),
[RF02](reports/REPORT-SUPPORT-RF02-20260910-185500.md) e o
[fechamento RF05](reports/REPORT-SUPPORT-RF05-20260917-153727.md), além do
[fechamento S1](reports/REPORT-SUPPORT-S1-CLOSURE-20260910-163634.md).
O prompt `prompts/support-main-baseline-publication-prompt.md` publica o baseline
bootstrap + RF01 com guardas Git. Os prompts de correção e RF01 são históricos.
O prompt RF02 foi executado na branch `feat/support-rf02-update-department` e a
PR #1 foi integrada em `main`. A PR #2 integrou RF03 e a PR #3 integrou RF04,
ambas com CI remoto aprovado. O merge RF04 estabeleceu `MAIN_BASELINE_RF04`.
RF05 recebeu revisão canônica 0.7 e runtime provado na branch
`feat/support-rf05-create-ticket`; RF06–RF13 continuam sem runtime.

A documentação canônica de negócio fica em `../luciluci-docs/support/`.
O anexo de revisão não contém esse submódulo; verificar sua revisão real local.
