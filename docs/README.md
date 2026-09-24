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

S1 e RF01–RF06 estão implementadas/provadas e integradas em `main` no
`MAIN_BASELINE_RF06` (PR #5, merge `0387167`), com contrato canônico Support
0.8 no runtime. RF07a/RF07b possuem contrato Support 0.9 congelado e runtime
implementado/provado no código da PR #7; RF08–RF13 permanecem sem runtime.
O checkpoint bloqueado histórico e
o fechamento contratual RF07a/RF07b estão registrados em `reports/`.

A documentação canônica de negócio fica em `../luciluci-docs/support/`; o
gitlink desta branch aponta à revisão 0.9 publicada (`1583a58`).
