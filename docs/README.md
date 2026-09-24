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

S1 e RF01–RF08 estão implementadas/provadas e integradas em `main` no
`MAIN_BASELINE_RF08` (PR #8, merge `45be903`). RF07a/RF07b possuem contrato
Support 0.9; RF08 possui contrato Support 0.10 e runtime integrado.
RF09–RF13 permanecem sem runtime. O checkpoint RF09 está bloqueado por
DEC-SUP-01/08/09; o report correspondente está em `reports/`.

A documentação canônica de negócio fica em `../luciluci-docs/support/`; o
gitlink desta branch aponta à revisão 0.10 publicada (`93edf66`).
