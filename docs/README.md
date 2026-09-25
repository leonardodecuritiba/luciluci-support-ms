# docs

Documentação operacional do `support-ms`.

Nesta branch funcional, RF12 foi implementada e provada sobre Support 0.14;
ver [report RF12](reports/REPORT-SUPPORT-RF12-20260925.md). O estado contratual
abaixo descreve o checkpoint documental anterior à implementação.

- `architecture/`: identidade materializada e desenho S1.
- `openapi/`: contrato operacional de Support.
- `asyncapi/`: ausência explícita de mensageria no S1.
- `runbooks/`: execução local com PostgreSQL.
- `workflows/support-bootstrap-plan.md`: inventário, evidência e passagem
  para W1.
- `workflows/support-development-branch-policy.md`: política de `main` e branches
  após RF01.
- `reports/`: avaliações por onda.

O [fechamento RF12](reports/REPORT-SUPPORT-RF12-CONTRACT-20260925-185019.md)
congela somente a listagem de mensagens em Support 0.14 (`820b2a8`), publicado
e fixado no gitlink. Estado `RF12_CONTRACT_CHECKPOINT_READY /
RF12_CONTRACT_FROZEN / NOT_IMPLEMENTED`; RF13 continua pendente.
RF12/RF13 não possuem runtime nem testes executados neste lote.

### Fotografia histórica — checkpoint RF12 bloqueado

O [checkpoint RF12](reports/REPORT-SUPPORT-RF12-CHECKPOINT-20260925-182925.md)
registra `RF12_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION`. A fonte fixa rota GET,
filtro opcional, paginação e ACL geral; a projeção segura de mensagens internas
e o total para solicitante ainda exigiam decisão. Naquela fotografia, Support
0.14 não estava congelado, o gitlink continuava Support 0.13 (`4958fd1`) e RF12/RF13 não tinham
runtime. A PR documental #13 foi integrada no merge `7724382`.

RF11 está implementada/provada e integrada em `main` com contrato Support 0.13
fixo. RF12/RF13 não possuem runtime. A
[PR #12](https://github.com/leonardodecuritiba/luciluci-support-ms/pull/12)
foi integrada no merge `9387b3d`, estabelecendo `MAIN_BASELINE_RF11` após
`ci / quality` no run `36169743450`.
O [report RF11](reports/REPORT-SUPPORT-RF11-20260925.md) registra a evidência
local anterior à publicação.

S1 e RF01–RF11 estão implementadas/provadas e integradas em `main` no
`MAIN_BASELINE_RF11` (PR #12, merge `9387b3d`). RF07a/RF07b possuem contrato
Support 0.9; RF08 possui contrato Support 0.10 e runtime integrado.
RF09–RF11 estão integradas; RF12/RF13 permanecem sem runtime. O contrato RF09 Support
0.11 está congelado e publicado, com DEC-SUP-01/08/09 resolvidas somente nesse
recorte. O contrato RF10 Support 0.12 está congelado e publicado em `85c7e95`,
com runtime ausente no momento do congelamento contratual. O checkpoint bloqueado anterior é histórico. Reports
e checkpoints históricos estão em `reports/`.

RF10 foi provada em PostgreSQL descartável, suíte HTTP/SQLite, smoke da imagem
e CI remota (`36156561044`) antes do merge da PR #10.

A documentação canônica de negócio fica em `../luciluci-docs/support/`; o
gitlink da baseline RF11 apontava à revisão 0.13 publicada (`4958fd1`);
o gitlink desta branch aponta a Support 0.14 (`820b2a8`).

O [fechamento RF11](reports/REPORT-SUPPORT-RF11-CONTRACT-20260925-165105.md)
congelou somente a edição de visibilidade. Naquela revisão RF11 ainda não tinha
runtime; RF12/RF13 permanecem pendentes.

O [checkpoint RF11 anterior](reports/REPORT-SUPPORT-RF11-CHECKPOINT-20260925-161025.md)
registrou decisões abertas antes de Support 0.13; é uma fotografia histórica.
