# docs

O [checkpoint de readiness/UAT](reports/REPORT-SUPPORT-DEPLOYMENT-READINESS-20260929-132805.md)
registra `main=5caa771`, CD como publicador de imagem sem deploy, matriz UAT
das 14 operações, decisões DEPLOY-01..18, blockers e critérios GO/NO-GO.
Nenhuma tag, release ou implantação ocorreu; os textos abaixo são históricos.

O [fechamento W1](reports/REPORT-SUPPORT-SEED-W1-MERGE-CLOSURE-20260928.md)
registra a PR #17 integrada em `main` (`1c1348d`), CI `ci / quality` verde
no run `36478828865` e seed segura disponível somente para DB descartável
local/CI. Support 0.15 e RF01–RF13 permanecem integrados; não houve deploy.
Os parágrafos abaixo são fotografias anteriores.

O [report funcional W1](reports/REPORT-SUPPORT-SEED-W1-20260928-193318.md)
registra seed implementada e provada localmente em banco descartável, sem
commit ou publicação. O fechamento documental abaixo é histórico.

O [fechamento da definição W1](reports/REPORT-SUPPORT-SEED-W1-DEFINITION-20260928-184122.md)
aprova a seed canônica do domínio completo (6/16/44/80) e seus gates.
`SEED_W1_DEFINITION_READY / SEED_W1_NOT_IMPLEMENTED`: a implementação e
prova ainda pertencem a um lote futuro. O checkpoint bloqueado abaixo é
fotografia anterior.

O [checkpoint da seed W1](reports/REPORT-SUPPORT-SEED-W1-CHECKPOINT-20260928-182459.md)
registra a decisão de escopo ainda aberta e uma proposta de massa, safety e
provas futuras. É documentação apenas; a seed segue indisponível.

## Estado corrente

O [fechamento final](reports/REPORT-SUPPORT-FINAL-CLOSURE-20260928-174429.md)
registra `MAIN_BASELINE_RF13` no merge `2aacc5554c9c2c4f25415dd8b170f5ff73b6d189`:
RF01–RF13 implementadas, provadas e integradas, 14 operações HTTP, contrato
Support 0.15 fixo em `14efcdfdc70d774c4343e2ec47662b7b5c8b691b` e CI
remota RF13 verde. Não houve deploy; naquela fotografia a seed W1 seguia sem
massa definida.
Os parágrafos abaixo preservam fotografias de lotes anteriores, não o estado
corrente do serviço.

O [review independente RF13](reports/REPORT-SUPPORT-RF13-REVIEW-20260928.md)
registra a auditoria do diff local, correções do harness e revalidação em dois
fusos. A branch permanece sem publicação; o report funcional abaixo é a
evidência do lote anterior.

O [report funcional RF13](reports/REPORT-SUPPORT-RF13-20260928.md) registra a
implementação local do histórico, as provas executadas e os limites de
integração/CI. O contrato canônico segue Support 0.15; os checkpoints abaixo
são históricos.

O [fechamento RF13](reports/REPORT-SUPPORT-RF13-CONTRACT-20260928-141233.md)
registra Support 0.15 publicado/fixado, contrato
`RF13_CONTRACT_CHECKPOINT_READY / RF13_CONTRACT_FROZEN` e runtime ainda ausente.
As seções abaixo preservam os checkpoints anteriores.

O [report de visibilidade RF13](reports/REPORT-SUPPORT-RF13-VISIBILITY-20260925-203223.md)
registra a decisão expressa sobre `nova_mensagem` e os blockers contratuais
independentes ainda abertos. Support 0.14 e a reserva 404 permanecem. O
checkpoint abaixo é histórico.

O [checkpoint RF13](reports/REPORT-SUPPORT-RF13-CHECKPOINT-20260925-195255.md)
parte de `MAIN_BASELINE_RF12` (`1e243d3`), após merge e CI aprovada da PR #14.
RF13 permanece bloqueada por decisões contratuais e sem runtime. Support 0.14
continua fixado; o histórico abaixo descreve etapas anteriores.

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
