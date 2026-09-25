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

Na branch funcional RF11, a edição de visibilidade está implementada/provada
localmente com contrato Support 0.13 fixo. RF12/RF13 não possuem runtime.
O commit `2985ac5` foi publicado na
[PR #12](https://github.com/leonardodecuritiba/luciluci-support-ms/pull/12),
ainda fora de `main`.
O [report RF11](reports/REPORT-SUPPORT-RF11-20260925.md) registra a evidência;
os parágrafos seguintes preservam o estado histórico de `main` e do
checkpoint documental anterior.

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
gitlink desta branch aponta à revisão 0.13 publicada (`4958fd1`).

O [fechamento RF11](reports/REPORT-SUPPORT-RF11-CONTRACT-20260925-165105.md)
congela somente a edição de visibilidade. RF11 continua sem runtime; RF12/RF13
permanecem pendentes.

O [checkpoint RF11 anterior](reports/REPORT-SUPPORT-RF11-CHECKPOINT-20260925-161025.md)
registrou decisões abertas antes de Support 0.13; é uma fotografia histórica.
