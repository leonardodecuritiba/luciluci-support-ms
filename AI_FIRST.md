# AI_FIRST

## Contrato RF12 — Support 0.14

RF12 está `RF12_CONTRACT_CHECKPOINT_READY / RF12_CONTRACT_FROZEN /
NOT_IMPLEMENTED` em Support 0.14 (`820b2a8`), publicado e fixado no gitlink.
O checkpoint bloqueado `98efe16` permanece histórico. Admin autorizado vê
mensagens visíveis/internas; requester dono vê só as visíveis, com total
restrito. Filtro requester `false` retorna `200` vazio/total zero. Ordem
cronológica, shape de oito campos, mídia posicional em lote e fotografia
`REPEATABLE READ` estão no
`docs/reports/REPORT-SUPPORT-RF12-CONTRACT-20260925-185019.md`.
RF12/RF13 não têm runtime; RF13 não herda essas decisões.

## Fotografia histórica — checkpoint RF12 bloqueado

A PR #13 documental foi integrada no merge `7724382`, consolidando
`MAIN_BASELINE_RF11`. Naquele checkpoint, o gitlink permanecia Support 0.13
(`4958fd1`). RF12 `GET /api/support/tickets/{ticketId}/messages` estava
`RF12_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION`: a fonte deixa aberta a
visibilidade de mensagens internas para requester, filtro omitido/`false` e
total, além de detalhes de paginação, resposta e validação. Naquela revisão,
Support 0.14 não estava congelado; RF12/RF13 não tinham runtime. Ver
`docs/reports/REPORT-SUPPORT-RF12-CHECKPOINT-20260925-182925.md` antes de
qualquer lote funcional RF12.

## Estado atual — MAIN_BASELINE_RF11

RF01–RF11 estão implementadas/provadas e integradas em `main` sobre
Support 0.13 (`4958fd1`). A
[PR #12](https://github.com/leonardodecuritiba/luciluci-support-ms/pull/12)
foi integrada no merge `9387b3d`, estabelecendo `MAIN_BASELINE_RF11`.
O check remoto `ci / quality` passou no run `36169743450`.
RF12/RF13 não têm runtime; não houve deploy.
Ver `docs/reports/REPORT-SUPPORT-RF11-20260925.md` para a prova local
anterior à publicação.
As seções seguintes preservam fotografias anteriores à implementação.

## Fotografias históricas anteriores à implementação RF11

O checkpoint RF11 bloqueado no commit `85b3adb` é histórico. Decisões
posteriores congelaram Support 0.13 em `4958fd1`, publicado no remoto
canônico e fixado no gitlink: `RF11_CONTRACT_CHECKPOINT_READY /
RF11_CONTRACT_FROZEN / NOT_IMPLEMENTED`. RF01–RF10 estão integradas em
`MAIN_BASELINE_RF10`; RF12/RF13 permanecem `NOT_IMPLEMENTED`. O runtime RF11
foi aberto posteriormente em lote funcional próprio. Ver o report RF11 contratual.

O checkpoint documental RF11 inicial, criado de `MAIN_BASELINE_RF10`, estava
`RF11_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION`. A revisão canônica fixa segue
naquela fotografia em Support 0.12 (`85c7e95`). As decisões do report foram
resolvidas depois, apenas para RF11, em Support 0.13. Naquele checkpoint,
RF11–RF13 seguiam `NOT_IMPLEMENTED`.

Este checkout é `support-ms`. Profile foi retirado, a base operacional foi
materializada; RF01–RF10 estão `IMPLEMENTED_AND_PROVEN` em
`MAIN_BASELINE_RF10` (PR #10, merge `8827c0b`). Naquela fotografia, RF11–RF13 permaneciam
`NOT_IMPLEMENTED`;
o contrato RF08 está congelado em Support 0.10 (`RF08_CONTRACT_CHECKPOINT_READY`).
O checkpoint RF09 bloqueado é histórico; DEC-SUP-01/08/09 foram aprovadas
somente para RF09 e congeladas em Support 0.11, publicado no remoto canônico.
A criação de mensagem RF10 está congelada em Support 0.12 (`85c7e95`),
publicada no remoto canônico; o checkpoint bloqueado
anterior permanece histórico.
A revisão pós-S1 reabriu o fechamento por
`DRIFT-SUP-S1-001`, agora `RESOLVED / PROVEN`.

## Ordem de leitura

1. `AGENTS.md`, `ACTUAL_STATE.md` e `DRIFT_REPORT.md`.
2. `README.md` e `docs/workflows/support-bootstrap-plan.md`.
3. O drift encerrado e o report de fechamento S1.
4. A identidade e o código reais.
5. `luciluci-docs/support/notes.md` para decisões por recorte de RF.
6. `luciluci-docs/support/` na revisão local fixada, sem `--remote`.
7. Para referência do lote RF02 executado, `docs/prompts/support-rf02-implementation-prompt.md`.

## Limites

Não reexecutar o drift ou RF01. O checkpoint RF02 já está fechado e a implementação
foi limitada à branch própria, após conferir o contrato 0.4 real.
Não reintroduzir Profile ou mensageria.
Seed de domínio continua fora do escopo salvo decisão explícita do lote.
Proteger bancos/volumes existentes; qualquer prova futura exige recursos
descartáveis exclusivos e ownership demonstrado.

Correlação, envelope de erro e contratos operacionais seguem preservados.
Os prompts de bootstrap e S1 são históricos. O estado das decisões funcionais
deve ser conferido no submódulo real; não assumir aprovação pelo report ou por
aplicar este patch.

## Git após a integração RF07

A baseline RF06 foi o ponto estável de `main` após o merge da PR #5
`0387167cfe02416c5d05cf3b8288350dd5ba682b`. O contrato RF05 0.7 está
publicado em `cc9a4399d210114e3c8261f3c153f8339c049ffb`; o contrato RF06
0.8 está publicado em `4650ec671c948a4fa8fb04fa33b300d8fd255ae4`.
A PR #5 integrou RF06 com CI aprovada; a página da PR não registra revisão
formal. Support 0.9 congela RF07a/RF07b no commit canônico
`1583a586793437a7b7c0569581637ee8ddac5ae5`; o gitlink da PR #7
aponta a ele. A PR documental #6 foi integrada em `main` no merge `939b991`;
RF07a/RF07b estão implementadas/provadas no código da PR #7.
`RF07_IMPLEMENTATION_BASELINE = MAIN_BASELINE_RF06`. Não usar force-push em `main`.

A PR #7 foi integrada em `main` no merge
`43a556ab1c70f5de9a63e3e6ab651445fa462173`, estabelecendo
`MAIN_BASELINE_RF07`. O checkpoint RF08 bloqueado `a8714a8` é histórico. As
decisões específicas de RF08 congelaram Support 0.10 no commit canônico
`93edf66d6ed0002a2af537339da315db1285a779`, publicado com SHA local/remoto
igual; o gitlink documental aponta a ele. RF08 foi implementada/provada na
branch `feat/support-rf08-resolve-ticket` e integrada pela PR #8 no merge
`45be90318bdb71e67532482364933cb49e6660e9`; o check `quality` do head
passou no run `36065884933`. Naquele momento, `main` era `MAIN_BASELINE_RF08`. O report
`docs/reports/REPORT-SUPPORT-RF09-CHECKPOINT-20260924-223334.md` registra a
fotografia bloqueada anterior. O fechamento 0.11 publicado está em
`docs/reports/REPORT-SUPPORT-RF09-CONTRACT-20260925-125528.md`, com gitlink
`a198b46c62d4b5cd1a4aa0ced8eb171b2e6ef3b2`, confirmado por `ls-remote`.
A primeira tentativa de push foi bloqueada pela revisão automática; a
autorização específica posterior permitiu publicar as branches canônica e do
serviço. A implementação RF09 posterior foi integrada pela PR #9 no merge
`393af3ed50c35fb541825c1822cecaa3b8005a29`, após CI `quality` aprovada.
O checkpoint RF10 bloqueado na branch documental própria foi preservado no
commit `8498620`. As decisões posteriores congelaram Support 0.12 em
`85c7e958adb0cbb9fa43842de7f990260f2bc0ee`, publicado e fixado no gitlink.
Estado contratual `RF10_CONTRACT_CHECKPOINT_READY / RF10_CONTRACT_FROZEN`.
Posteriormente, a branch funcional implementou RF10 e passou em testes,
PostgreSQL descartável e smoke da imagem. A PR #10 integrou RF10 em `main`
após o check `quality` aprovado no run `36156561044`; não houve deploy.
