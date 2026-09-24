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

S1 e RF01–RF07b estão implementadas/provadas e integradas em `main` no
`MAIN_BASELINE_RF07` (PR #7, merge `43a556a`). RF07a/RF07b possuem contrato
Support 0.9 congelado e runtime provado; RF08 está implementada/provada nesta
branch funcional, ainda fora de `main`; RF09–RF13 permanecem sem runtime.
O contrato RF08 está congelado em Support 0.10; o checkpoint bloqueado é histórico.
O checkpoint e o fechamento contratual RF08, além dos reports RF07a/RF07b,
estão registrados em `reports/`.

A documentação canônica de negócio fica em `../luciluci-docs/support/`; o
gitlink desta branch aponta à revisão 0.10 publicada (`93edf66`).
