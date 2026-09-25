# ACTUAL_STATE

## Estado atual — MAIN_BASELINE_RF08 e checkpoint contratual RF09

- serviço `support-ms`; domínio `support`;
- S1 `BOOTSTRAP_IMPLEMENTED_AND_PROVEN`; drift `DRIFT-SUP-S1-001 / RESOLVED / PROVEN`;
- RF01–RF08 `IMPLEMENTED_AND_PROVEN` e integradas em `main`; RF09–RF13 `NOT_IMPLEMENTED`;
- baseline atual `MAIN_BASELINE_RF08`, merge da PR #8 `45be90318bdb71e67532482364933cb49e6660e9`; a baseline RF07 permanece histórica em `43a556ab1c70f5de9a63e3e6ab651445fa462173`;
- RF07a/RF07b `RF07A_RF07B_CONTRACT_FROZEN` em Support 0.9; implementação e prova PostgreSQL local concluídas;
- contrato RF06 congelado em Support 0.8, commit canônico `4650ec671c948a4fa8fb04fa33b300d8fd255ae4` de `luciluci-docs`;
- decisões RF06 DEC-SUP-01/03/05/06/08/09/10/12 resolvidas somente nesse recorte; DEC-SUP-01/02/07/08/09 estão `RESOLVED_FOR_RF07` somente para RF07a/RF07b, conforme `luciluci-docs/support/notes.md`;
- gitlink atual Support 0.11 `a198b46c62d4b5cd1a4aa0ced8eb171b2e6ef3b2`, publicado em `origin/docs/support-rf09-get-ticket-contract` e confirmado por `ls-remote`; a revisão anterior 0.10 `93edf66d6ed0002a2af537339da315db1285a779` foi publicada na branch `docs/support-rf08-resolve-ticket-contract`. O contrato RF07 0.9 permanece histórico em `1583a586793437a7b7c0569581637ee8ddac5ae5`; `RF07_IMPLEMENTATION_BASELINE = MAIN_BASELINE_RF06`.

## Integração RF08 e abertura RF09

A [PR #8](https://github.com/leonardodecuritiba/luciluci-support-ms/pull/8) foi integrada no merge `45be90318bdb71e67532482364933cb49e6660e9`; `main` local e `origin/main` coincidiram após fast-forward. O check `quality` do head `ab43d4e53e0d4fde70a66c42a8f38fc9e66806ad` passou no run remoto `36065884933`. A documentação canônica Support 0.10 é a fotografia anterior ao runtime RF08: seu `NOT_IMPLEMENTED` histórico não descreve o estado atual do serviço. O submódulo está limpo no gitlink fixado.

O checkpoint RF09 histórico está em `docs/reports/REPORT-SUPPORT-RF09-CHECKPOINT-20260924-223334.md`, estado então `RF09_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION`. PRD §5.2/RF09 fixava GET por ID, ACL e leitura sem auditoria; TDD/TP deixavam DEC-SUP-01/08/09 pendentes naquele momento. A rota GET por ID ainda não existe; essa ausência é esperada no lote documental.

## Fechamento contratual RF09 — Support 0.11 publicado

Em 2026-09-25, o usuário aprovou expressamente a proposta do checkpoint RF09. O contrato Support 0.11 foi registrado em `luciluci-docs/support/{README,prd,notes,tdd,tp}.md`, commit canônico `a198b46c62d4b5cd1a4aa0ced8eb171b2e6ef3b2` na branch `docs/support-rf09-get-ticket-contract`; o gitlink desta branch do serviço aponta a esse SHA. DEC-SUP-01/08/09 estão `RESOLVED_FOR_RF09` apenas para GET por ID; `RF09_CONTRACT_CHECKPOINT_READY / RF09_CONTRACT_FROZEN / NOT_IMPLEMENTED`. O report de fechamento está em `docs/reports/REPORT-SUPPORT-RF09-CONTRACT-20260925-125528.md`. O checkpoint bloqueado anterior permanece histórico.

O primeiro push do commit canônico para `git@github.com:lucilucitecnologia/luciluci-docs.git` foi rejeitado pela revisão automática: a aprovação do contrato não foi considerada autorização explícita para publicar documentos naquele remoto. Após autorização específica do usuário, a branch canônica foi publicada e `ls-remote` confirmou `a198b46c62d4b5cd1a4aa0ced8eb171b2e6ef3b2`. A branch do serviço `codex/support-rf09-contract-checkpoint` também foi publicada; `ls-remote` confirmou o head inicial `c586fdba037eb463b0841be9b99e9c8dbdcd0953` com o mesmo gitlink. Nenhuma PR RF09 foi aberta e nenhum arquivo de runtime, OpenAPI executável, `api.http`, migration, teste ou prova RF09 foi criado.

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

O merge da PR #7 em `43a556ab1c70f5de9a63e3e6ab651445fa462173` estabelece `MAIN_BASELINE_RF07`; a CI `quality` do head conciliado passou no run `36049802944`. A página da PR mostrou `No reviews`, discrepância processual histórica que não reabre RF07. O checkpoint documental bloqueado no commit `a8714a86b5b67e9a7e7fafaf194991b0e078e9cb` preserva a fotografia anterior, com gitlink Support 0.9.

As decisões posteriores fecham o contrato RF08 em Support 0.10: POST sem body; headers `X-Correlation-ID`, `X-Performed-By` e `X-Performed-By-Type=backoffice|cd`; somente dono por `ticket.requesterId`, sem comparar role com origin ou verificar Department. Transição `nao_resolvido -> resolvido` altera apenas requesterStatus/updatedAt e cria exatamente um AuditLog `alteracao_status` de requester na mesma transação. Ticket já resolvido retorna `200` e Ticket completo sem write, timestamp ou auditoria novos. Ticket é bloqueado com `FOR UPDATE`; RF08×RF08 e RF06×RF08 serializam sem perda de update. Não há idempotency key, evento/outbox ou mensageria. Matriz de erros: `400` headers, `403` admin/não dono, `404` Ticket inexistente, `422` UUID/body, `500` inesperado. DEC-SUP-01/06/08/09/10/12 estão `RESOLVED_FOR_RF08` somente neste recorte; DEC-SUP-11 é `NOT_APPLICABLE_RF08`. O commit canônico `93edf66d6ed0002a2af537339da315db1285a779` está publicado, e o gitlink desta branch aponta a ele. RF09–RF13 seguem pendentes.

## Implementação RF08 — evidência histórica da branch funcional

`POST /api/support/tickets/{ticketId}/resolve` está materializado em route/controller,
`ResolveTicketUseCase` e capacidade específica `updateRequesterStatus` do repositório.
O controller rejeita qualquer body presente, inclusive `null` e `{}`, valida
headers/path e executa o caso de uso em transação. O caso de uso bloqueia o Ticket
antes de ler ownership/status, permite somente requester owner e não consulta
Department. A transição persiste só `requesterStatus` e `updatedAt`, com um
AuditLog requester de mesmo timestamp; o no-op retorna Ticket completo sem write.
RF06 mantém sua atualização restrita própria. Não há migration nova, evento,
outbox, idempotency key ou branch RF09.

A prova `proof:rf08:postgres` passou em PostgreSQL 16 descartável com processo
compilado: transição, no-op, Department inativo, ACL, falha induzida de AuditLog
com rollback, RF08×RF08 e RF06×RF08 sob lock real, sem lost update ou deadlock.
O primeiro replay falhou por leitura local de `timestamp` sem fuso no cliente da
prova; o script foi alinhado à interpretação UTC do serviço e o replay passou.
Provas RF01–RF07, smoke da imagem e gates finais são registrados no report RF08.
Este resultado local não equivale a CI remota ou integração em `main`.
