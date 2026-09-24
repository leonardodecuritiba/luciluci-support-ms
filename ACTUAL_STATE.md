# ACTUAL_STATE

## Estado atual — MAIN_BASELINE_RF07 e checkpoint contratual RF08

- serviço `support-ms`; domínio `support`;
- S1 `BOOTSTRAP_IMPLEMENTED_AND_PROVEN`; drift `DRIFT-SUP-S1-001 / RESOLVED / PROVEN`;
- RF01–RF07b `IMPLEMENTED_AND_PROVEN` e integradas em `main`;
- baseline atual `MAIN_BASELINE_RF07`, merge da PR #7 `43a556ab1c70f5de9a63e3e6ab651445fa462173`; baseline de origem RF06 `0387167cfe02416c5d05cf3b8288350dd5ba682b`;
- RF08–RF13 `NOT_IMPLEMENTED`; `feat/support-rf08-resolve-ticket` não foi criada;
- RF07a/RF07b `RF07A_RF07B_CONTRACT_FROZEN` em Support 0.9; implementação e prova PostgreSQL local concluídas;
- contrato RF06 congelado em Support 0.8, commit canônico `4650ec671c948a4fa8fb04fa33b300d8fd255ae4` de `luciluci-docs`;
- decisões RF06 DEC-SUP-01/03/05/06/08/09/10/12 resolvidas somente nesse recorte; DEC-SUP-01/02/07/08/09 estão `RESOLVED_FOR_RF07` somente para RF07a/RF07b, conforme `luciluci-docs/support/notes.md`;
- gitlink canônico Support 0.9 `1583a586793437a7b7c0569581637ee8ddac5ae5`, publicado em `luciluci-docs`; `RF07_IMPLEMENTATION_BASELINE = MAIN_BASELINE_RF06`.

## Superfície implementada

RF01–RF04 operam Department e RF05 cria Ticket, mensagem inicial, mídias e uma auditoria em transação. RF06 expõe `PATCH /api/support/tickets/{ticketId}` para `priority`, `departmentId` e `adminStatus`, com headers de ator e correlação obrigatórios, ACL por membership do Department atual para admin ou ownership para backoffice/cd, validação do target ativo, no-op sem write e auditoria `alteracao_status` somente em mudança efetiva de `adminStatus`.

O update RF06 bloqueia Ticket antes dos Departments, estes em ordem lexical de UUID, revalida autorização e estado sob lock e executa update e eventual AuditLog em uma única transação. A migration RF05 já suporta os valores de status e origem de auditoria necessários; RF06 não adiciona migration. Não há evento, outbox ou idempotência HTTP para RF06. Seed W1 permanece bloqueada até massa determinística aprovada.

## Evidência RF06 e estado remoto

- `npm run build`, `npm run lint`, testes unitários RF06 (2), integração RF06 (29), contrato OpenAPI (2) passaram.
- `npm run proof:rf06:postgres` passou em PostgreSQL 16, banco exclusivo `support_s1_proof_rf06_20260924` criado e descartado pelo script. A prova exercitou processo compilado, ACL, no-op, auditoria, rollback induzido na auditoria, espera pelo lock do Ticket e revalidação do target após lock de Department.
- A suíte completa passou com 21 suítes/177 testes. Cobertura: 98,17% statements, 85,18% branches, 98,31% functions e 98,38% lines. OpenAPI export/check e compatibilidade contra RF05, build/check e `messaging:check` passaram. O teste RF04 historicamente fixado em RF06=404 foi atualizado para verificar apenas RF07–RF13.
- Replay local das seis provas PostgreSQL RF01–RF06 passou em PostgreSQL 16, cada uma com banco exclusivo criado e descartado. O workflow ganhou step RF06; as provas antigas foram alinhadas à nova rota.
- PR #5 `MERGED`: https://github.com/leonardodecuritiba/luciluci-support-ms/pull/5. Head `204ab0c9cfa09052539db9272dd03e4c47aa9084`; CI final `36032135712` aprovada; merge `0387167cfe02416c5d05cf3b8288350dd5ba682b` verificado em `main`/`origin/main` e na página da PR. A página ainda mostra `No reviews`; nenhuma revisão formal foi observada. O merge ocorreu fora deste checkpoint, sem ação de integração nesta branch.

Reports anteriores registram as provas S1 e RF01–RF05. A prova RF05 anterior cobriu schema, rollback, sequence, concorrência e imagem. Nenhuma prova de RF06 é atribuída retroativamente às outras RFs.

## Checkpoint RF07a/RF07b

RF07a preserva `GET /api/support/tickets/requester/{requesterId}` para próprios tickets. RF07b preserva `GET /api/support/tickets/admin/{adminId}` e restringe o escopo por membership atual em `allowedUserIds` do Department. O contrato 0.9 fecha headers/roles, ACL no banco, filtros AND, `DD/MM/YYYY` em dias UTC de `Ticket.createdAt`, paginação com defaults `page=1,size=20`, ordem `createdAt DESC,id DESC`, envelope, item de oito campos e matriz de erros. Ambos são leituras sem AuditLog ou efeitos de escrita. A branch funcional inclui as rotas, consulta, testes unitários/de integração, OpenAPI executável, `api.http` e prova PostgreSQL/processo compilado. Nenhuma migration RF07 foi criada.

A prova PostgreSQL 16 RF07 passou em banco exclusivo descartado pelo script, com ACL, filtros, limites UTC, paginação, projeção exata, OpenAPI e snapshots de Ticket/mensagem/auditoria sem escrita. A repetição com processo em `TZ=America/Sao_Paulo` detectou e depois comprovou a correção da conversão de `timestamp` sem fuso do driver `pg`; `createdAt` e filtros agora preservam os dias UTC independentemente do fuso do processo. `npm run lint`, `build`, `build:check`, export/check/compatibilidade OpenAPI contra RF06, `messaging:check`, 23 suítes/201 testes e `coverage:check` passaram. Cobertura: 97,94% statements, 87,05% branches, 98,47% functions, 98,34% lines. Regressões PostgreSQL RF01–RF06 passaram em bancos exclusivos descartados; os clientes de prova históricos foram executados com `TZ=UTC`. A PR #7 foi aberta e marcada Ready for Review; sua CI remota inicial passou no run `36047611567`, job `quality`, head `65029bd691c004612a47599aac44ebaef1e1a661`, incluindo prova RF07, regressões RF01–RF06, imagem, contrato e cobertura. Nenhuma revisão humana foi observada.

## Continuidade

O checkpoint bloqueado anterior é histórico. A revisão 0.9 está congelada e publicada no repositório canônico; a PR documental #6 foi integrada em `main` no merge `939b991`. A PR #7 integrou a implementação RF07 após CI remota aprovada no head conciliado. O merge do checkpoint documental não mudou o contrato 0.9 nem o gitlink.

## Checkpoint contratual RF08

O merge da PR #7 em `43a556ab1c70f5de9a63e3e6ab651445fa462173` estabelece `MAIN_BASELINE_RF07`; a CI `quality` do head conciliado passou no run `36049802944`. A página da PR mostrou `No reviews`, discrepância processual histórica que não reabre RF07. O gitlink permanece em Support 0.9 `1583a586793437a7b7c0569581637ee8ddac5ae5`.

O PRD determina `POST /api/support/tickets/{ticketId}/resolve`, exclusivo do solicitante dono, com alteração apenas de `requesterStatus` para `resolvido` e auditoria `alteracao_status` de requester. Não define body, resposta ou repetição quando já resolvido. O checkpoint está `RF08_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION`, em especial DEC-SUP-06/08/10 para no-op, payload, response e idempotência. Candidatos de lock, concorrência e matriz de erros constam no report RF08, sem congelamento canônico. Não há Support 0.10, alteração de gitlink, rota, OpenAPI executável, teste ou prova RF08.
