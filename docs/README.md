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

S1 e RF01–RF10 estão implementadas/provadas e integradas em `main` no
`MAIN_BASELINE_RF10` (PR #10, merge `8827c0b`). RF07a/RF07b possuem contrato
Support 0.9; RF08 possui contrato Support 0.10 e runtime integrado.
RF09 e RF10 estão integradas; RF11–RF13 permanecem sem runtime. O contrato RF09 Support
0.11 está congelado e publicado, com DEC-SUP-01/08/09 resolvidas somente nesse
recorte. O contrato RF10 Support 0.12 está congelado e publicado em `85c7e95`,
com runtime ausente no momento do congelamento contratual. O checkpoint bloqueado anterior é histórico. Reports
e checkpoints históricos estão em `reports/`.

RF10 foi provada em PostgreSQL descartável, suíte HTTP/SQLite, smoke da imagem
e CI remota (`36156561044`) antes do merge da PR #10. RF11–RF13 permanecem sem runtime.

A documentação canônica de negócio fica em `../luciluci-docs/support/`; o
gitlink integrado aponta à revisão 0.12 publicada (`85c7e95`).
