# ACTUAL_STATE

## Estado atual — baseline RF06 e checkpoint RF07a/RF07b

- serviço `support-ms`; domínio `support`;
- S1 `BOOTSTRAP_IMPLEMENTED_AND_PROVEN`; drift `DRIFT-SUP-S1-001 / RESOLVED / PROVEN`;
- RF01–RF06 `IMPLEMENTED_AND_PROVEN` e integradas em `main`;
- baseline estável `MAIN_BASELINE_RF06`, merge da PR #5 `0387167cfe02416c5d05cf3b8288350dd5ba682b`;
- RF07a/RF07b e RF08–RF13 `NOT_IMPLEMENTED`;
- RF07a/RF07b `CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION`; Support 0.9 não está congelado;
- contrato RF06 congelado em Support 0.8, commit canônico `4650ec671c948a4fa8fb04fa33b300d8fd255ae4` de `luciluci-docs`;
- decisões RF06 DEC-SUP-01/03/05/06/08/09/10/12 resolvidas somente nesse recorte; RF07a/RF07b ainda dependem de DEC-SUP-02/07/08 e detalhes de filtros/ordenação conforme `luciluci-docs/support/notes.md`.

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

RF07a preserva `GET /api/support/tickets/requester/{requesterId}` para próprios tickets. RF07b preserva `GET /api/support/tickets/admin/{adminId}` e restringe o escopo por `allowedUserIds` do Department. Ambos são leituras paginadas sem AuditLog. O checkpoint documental classifica identidade, ACL, projeção e IDs; mantém abertas a política de paginação/envelope, datas, ordenação e semântica completa dos filtros. Nenhuma rota, migration, OpenAPI executável, teste ou script RF07 foi criado.

## Continuidade

Resolver somente as decisões RF07a/RF07b registradas em `luciluci-docs/support/notes.md` e no report de checkpoint antes de congelar Support 0.9 ou criar branch funcional RF07. RF08 permanece fora deste slice.
