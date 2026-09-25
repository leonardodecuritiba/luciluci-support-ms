# DRIFT_REPORT

## RF11 — contrato 0.13 congelado, sem runtime

As lacunas do checkpoint RF11 foram fechadas por decisão expressa específica
em Support 0.13 (`4958fd1`), publicado no repositório canônico. O gitlink
atual aponta a essa revisão. A ausência da rota permanece esperada:
`RF11_CONTRACT_FROZEN / NOT_IMPLEMENTED`, sem drift técnico novo atribuído ao
runtime RF01–RF10. O checkpoint bloqueado `85b3adb` e o relatório anterior
são históricos. [Fechamento RF11](docs/reports/REPORT-SUPPORT-RF11-CONTRACT-20260925-165105.md).

## Checkpoint RF11 — lacuna contratual, sem drift técnico novo

O checkpoint RF11 sobre `MAIN_BASELINE_RF10` está
`RF11_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION`. O PRD original não resolve a
política de alteração de visibilidade por tipo/autoria de mensagem nem os
efeitos e respostas da operação. A ausência da rota RF11, inclusive o `404`
esperado nas provas históricas, é coerente com `NOT_IMPLEMENTED`; não é
regressão da RF10. Naquela fotografia, Support 0.12 e o gitlink `85c7e95`
permaneciam fixados.
Detalhes em
[REPORT-SUPPORT-RF11-CHECKPOINT-20260925-161025.md](docs/reports/REPORT-SUPPORT-RF11-CHECKPOINT-20260925-161025.md).

## RF10 integrada em MAIN_BASELINE_RF10

RF10 foi implementada e provada em `feat/support-rf10-create-message` sobre o
contrato Support 0.12, e integrada pela PR #10 no merge `8827c0b`. O check
remoto `ci / quality` passou no run `36156561044`. A migration RF05 suporta `type=admin`, mídias
posicionais e as duas auditorias; não surgiu drift de schema nem foi criada
migration nova. Os quatro fault injections RF10 reverteram mensagem, mídia,
Ticket e auditorias; as quatro concorrências terminaram sem lost update ou
deadlock. O primeiro comando de cobertura encontrou `listen EPERM` no sandbox;
repetido com bind local permitido, passou. A primeira prova RF10 teve erro de
cleanup de processo já encerrado, corrigido e repetido com exit 0 e descarte do
banco. O primeiro replay RF02 usou fuso local e falhou na comparação histórica
de timestamp; com `TZ=UTC`, RF02–RF09 passaram. Nenhum drift técnico novo fica
aberto no recorte RF10.

As seções abaixo preservam fotografias dos checkpoints anteriores.

## Drift encerrado

| ID                                                                     | Estado            | Impacto                                                                 | Próxima ação                             |
| ---------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------- | ---------------------------------------- |
| [DRIFT-SUP-S1-001](.codex/drifts/DRIFT-SUP-S1-001-dist-entrypoints.md) | RESOLVED / PROVEN | Build emite os entrypoints declarados; gates e provas isoladas passaram | Não reabrir sem nova reprodução objetiva |

O estado global permanece `BOOTSTRAP_IMPLEMENTED_AND_PROVEN`. A correção e as
provas históricas estão no
[report S1](docs/reports/REPORT-SUPPORT-S1-CLOSURE-20260910-163634.md).

## Escopo atual

RF01–RF10 estão `IMPLEMENTED_AND_PROVEN` em `main`, na baseline
`MAIN_BASELINE_RF10` (merge da PR #10 `8827c0b2f6d0b7597984f5131d4f1ec7b658084f`).
As decisões foram fechadas apenas em cada recorte; RF07a/RF07b têm contrato
Support 0.9 congelado e runtime implementado/provado na PR #7. RF08 foi
integrada pela PR #8; RF09 foi integrada pela PR #9; RF10 pela PR #10. RF11–RF13 permanecem
fora do runtime. O checkpoint RF10 bloqueado é histórico; decisões posteriores
congelaram Support 0.12 em `85c7e95`, sem novo drift técnico identificado. O
checkpoint RF08 bloqueado era uma lacuna contratual; decisões posteriores a
fecharam em Support 0.10, sem drift técnico novo do runtime existente.

Não há drift técnico aberto conhecido em S1/RF01–RF06. O checkpoint RF03
inicialmente registrou uma lacuna contratual, não um defeito de runtime; ela foi
fechada antes da implementação. As provas não reproduziram regressão: RF01 e
RF02 passaram novamente em PostgreSQL real. No lote RF04, RF01–RF03 passaram
novamente e RF05–RF13 permaneceram `404`.

## Continuidade

O merge `0387167cfe02416c5d05cf3b8288350dd5ba682b` define
`MAIN_BASELINE_RF06`; a PR #5 e sua CI estão concluídas. O checkpoint RF07a/RF07b
registrou lacunas contratuais históricas, resolvidas para RF07a/RF07b em
Support 0.9. A PR documental #6 foi integrada no merge `939b991`; o gitlink da
PR #7 aponta para `1583a586793437a7b7c0569581637ee8ddac5ae5`. A prova
funcional RF07 passou em PostgreSQL 16 com banco exclusivo descartado pelo script.
O checkpoint RF08 bloqueado no commit `a8714a8` permanece histórico. As decisões
de body, response, no-op, auditoria, identidade e concorrência foram registradas
no contrato canônico Support 0.10, publicado em `93edf66d6ed0002a2af537339da315db1285a779`.
O gitlink desta branch aponta a essa revisão. O checkpoint documental
`RF08_CONTRACT_CHECKPOINT_READY / RF08_CONTRACT_FROZEN` permanece válido.
A branch funcional implementou RF08 sem alterar o contrato ou criar migration.
A prova PostgreSQL 16 descartável passou após alinhamento UTC do cliente de
prova, incluindo rollback de AuditLog e concorrência RF08×RF08/RF06×RF08.
Nenhum drift técnico novo foi identificado. O checkpoint RF09 em
`docs/reports/REPORT-SUPPORT-RF09-CHECKPOINT-20260924-223334.md` registra
DEC-SUP-01/08/09 então abertas; a aprovação posterior as fechou somente para
RF09 em Support 0.11 (`a198b46`). A primeira tentativa de publicação remota
foi bloqueada pela revisão automática; depois de autorização específica,
o SHA canônico e a branch do serviço foram publicados e conferidos. Não há
drift técnico novo do runtime naquele checkpoint; RF09–RF13 ainda estavam
ausentes naquela fotografia anterior à branch funcional.

## RF09 integrada e RF10 documental

Contrato Support 0.11 preservado historicamente; gitlink avançado para Support
0.12 `85c7e95` após publicação canônica. A prova PostgreSQL 16 com banco próprio
descartado, suíte HTTP/SQLite, contrato e smoke da imagem não
reproduziram drift técnico. A falha inicial da prova histórica RF02 sob fuso
local foi de interpretação de timestamp pelo cliente de prova; o replay com
`TZ=UTC` passou. A PR #9 foi integrada em `393af3e` após CI `quality` aprovada
no run `36145983860`. O checkpoint RF10 bloqueado documenta decisões então
abertas; elas foram resolvidas somente para RF10 em Support 0.12. A ausência de
rota RF10 é esperada, não drift técnico da baseline RF09. Nenhum teste RF10 foi
executado no fechamento documental.
