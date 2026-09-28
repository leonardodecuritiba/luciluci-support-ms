# REPORT — Decisão de visibilidade do histórico RF13

- **status:** `RF13_VISIBILITY_RESOLVED / RF13_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION`
- **generated_by:** Codex
- **generated_at:** 2026-09-25T20:32:23Z
- **review_mode:** wave-1 documental
- **microservice:** support-ms
- **repository_ref:** `docs/support-rf13-history-checkpoint`, após o checkpoint histórico `58fcea63b806c3ea05cd22d4444453b5f469537d`
- **documentation_ref:** Support 0.14, gitlink `820b2a8b29819fc52aefd078dc51bfe651a51204` (inalterado)
- **report_file:** `docs/reports/REPORT-SUPPORT-RF13-VISIBILITY-20260925-203223.md`
- **reviewer:** não designado

# 1. Resumo executivo

A decisão expressa recebida em 2026-09-25 resolve **somente** a exposição de auditorias `nova_mensagem` na RF13. Admin autorizado vê todas as linhas de AuditLog no escopo permitido. Requester dono vê `nova_mensagem` somente quando o próprio AuditLog demonstra `origin IN (backoffice, cd)` e `authorId = ticket.requesterId`; `nova_mensagem` de admin nunca aparece no histórico do requester. `criacao_ticket` e `alteracao_status` permanecem sob a regra geral do PRD para tickets acessíveis.

O checkpoint [RF13 anterior](REPORT-SUPPORT-RF13-CHECKPOINT-20260925-195255.md) registra outros blockers independentes: DEC-SUP-01/09 (headers e ID), DEC-SUP-02 (paginação/ordem), DEC-SUP-08 (resposta/erros) e fotografia de leitura sob concorrência. A decisão recebida **não** os aprova. Portanto RF13 permanece `RF13_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION / NOT_IMPLEMENTED`. Support 0.15 não foi congelado/publicado; o gitlink continua Support 0.14. Nenhuma branch funcional, migration, runtime ou deploy foi criado.

# 2. Escopo e fontes analisadas

Decisão expressa: prompt do usuário “Resolver decisão RF13 de visibilidade do histórico e congelar Support 0.15”, se não houver outro blocker material. Fontes confrontadas: `luciluci-docs/support/{README,prd,notes,tdd,tp,dependencies}.md` e `support/sources/prd-original.md` no gitlink `820b2a8`; `docs/reports/REPORT-SUPPORT-RF13-CHECKPOINT-20260925-195255.md`; report RF12 final; `AGENTS.md`, `AI_FIRST.md`, `ACTUAL_STATE.md`, `DRIFT_REPORT.md`, `README.md`, política de branches, router RF13 e entidade/schema de AuditLog. A fonte original não foi alterada.

`main=origin/main=1e243d386dbca3e2d4dbf14fec7d29c8e5d1b366` (`MAIN_BASELINE_RF12`). A PR [#14](https://github.com/leonardodecuritiba/luciluci-support-ms/pull/14) foi mergeada nesse SHA; o run [36181786738](https://github.com/leonardodecuritiba/luciluci-support-ms/actions/runs/36181786738) concluiu com `success` para o head `160aa1e`. Essa CI não comprova RF13.

# 3. Matriz principal RF x implementação

| RF                         | Estado                                                              | Código/contrato                                            | Evidência/limite                                        |
| -------------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------- |
| RF01–RF12, com RF07a/RF07b | `IMPLEMENTED_AND_PROVEN` em `MAIN_BASELINE_RF12`                    | 13 operações integradas                                    | Reports/provas anteriores; PR #14 e CI RF12             |
| RF13                       | `NOT_IMPLEMENTED`; visibilidade resolvida, contrato ainda bloqueado | `/tickets/history` reservado em 404, sem OpenAPI funcional | Nenhum teste funcional RF13; decisão não libera runtime |

# 4. Checklist consolidado por PRD

- [x] Histórico global ou por `ticketId` continua limitado aos tickets acessíveis pelo ator.
- [x] As únicas ações de AuditLog são `criacao_ticket`, `nova_mensagem` e `alteracao_status`; consulta não gera auditoria.
- [x] Exposição de `nova_mensagem` foi decidida para admin e requester neste recorte.
- [x] `criacao_ticket` e `alteracao_status` seguem a regra geral de acesso a Ticket do PRD, sem filtro por visibilidade de Message.
- [!] O PRD não fecha os demais detalhes HTTP/ordenação/consistência apontados no checkpoint anterior.

# 5. Checklist consolidado por TDD

O AuditLog contém `id,ticketId,datetime,authorId,origin,action,statusType,newStatus`; não contém `messageId` ou `isVisibleToRequester`. RF11 pode mudar a visibilidade da Message sem gerar AuditLog. É **`SECURITY_INVARIANT_RF13`** não correlacionar `nova_mensagem` com TicketMessage por timestamp, proximidade temporal, autor, origem, ordem de inserção, ordenação de UUID, contagem ou posição. RF10 concorrente e instantes iguais tornam essas heurísticas inseguras.

| Ator           | AuditLog                                                               | Visível no escopo RF13 autorizado? | Motivo                                                                               |
| -------------- | ---------------------------------------------------------------------- | ---------------------------------- | ------------------------------------------------------------------------------------ |
| Admin          | `nova_mensagem`, `origin=admin`                                        | Sim                                | Admin vê todas as auditorias dos tickets autorizados, inclusive de nota interna      |
| Admin          | `nova_mensagem`, `origin=backoffice/cd`                                | Sim                                | Mesmo escopo administrativo, sem filtro por Message visibility                       |
| Requester dono | `nova_mensagem`, `origin=admin`                                        | **Nunca**                          | AuditLog não distingue mensagem admin pública de interna                             |
| Requester dono | `nova_mensagem`, `origin=backoffice/cd`, `authorId=ticket.requesterId` | Sim                                | RF10 exige ownership, autoria coerente com header e Message requester sempre visível |
| Requester dono | `nova_mensagem`, `origin=backoffice/cd`, outro `authorId`              | Não                                | O próprio AuditLog não prova autoria do dono; não ampliar escopo                     |
| Requester dono | `criacao_ticket` ou `alteracao_status`                                 | Sim, se o Ticket é acessível       | PRD aplica ACL do Ticket; sem filtro derivado de Message visibility                  |

É consequência deliberada que uma Message admin pública apareça na RF12 sem auditoria `nova_mensagem` correspondente na RF13 do requester. RF12 representa conteúdo; RF13 representa histórico de AuditLog seguro com o schema atual. Isso não caracteriza inconsistência de runtime.

# 6. Checklist consolidado por TP

- [x] Regra contratual de segurança definida: ACL do Ticket → visibilidade da action → demais filtros RF13 → `total`, `totalPages`, offset, paginação e ordem. Predicados devem ser aplicados na consulta SQL ou escopo equivalente **antes** de count/page. `nova_mensagem` admin excluída não pode afetar dados, total ou posição (`NO_HIDDEN_AUDIT_COUNT_LEAKAGE`).
- [ ] Testes unitários, de integração, contrato e funcionais RF13 continuam `PLANNED/NOT_RUN`; este lote é documental.

## 6.1 Matriz RF → unit / integration / functional

| RF        | Unit                                                      | Integration                                                        | Functional                                        | Estado da evidência                          |
| --------- | --------------------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------------------- | -------------------------------------------- |
| RF01–RF11 | Suítes dedicadas anteriores                               | HTTP/SQLite e PostgreSQL anteriores                                | Provas `proof:rf01`–`proof:rf11:postgres`         | Reports históricos; não repetidas aqui       |
| RF12      | `tests/unit/ticket/list-ticket-messages.use-case.spec.ts` | `tests/integration/ticket/list-ticket-messages.spec.ts` e contrato | `scripts/prove-rf12-postgres.js`, smoke da imagem | Report RF12/CI PR #14; não repetidos aqui    |
| RF13      | Ausente                                                   | Ausente                                                            | Ausente                                           | Contrato não congelado; runtime não iniciado |

# 7. Inventário de endpoints reais e schema

`GET /api/support/tickets/history` continua reserva literal 404 em `ticket.routes.ts`, antes de `/:ticketId`; OpenAPI executável e `api.http` não anunciam RF13 funcional. O schema atual já suporta a política aprovada por campos do próprio AuditLog e Ticket. Estado **`NO_NEW_MIGRATION_RF13`**: sem `messageId`, snapshot de visibility, nova action, tabela de correlação ou backfill em Support 0.15. Eventual requisito futuro de expor auditorias de mensagens admin visíveis ao requester exigirá evolução explícita do modelo, fora deste recorte.

RF10 mantém cardinalidade: admin grava uma `nova_mensagem`; requester grava `nova_mensagem` mais `alteracao_status`. RF11 continua sem AuditLog para mudança de visibilidade. RF13 controla apenas leitura/projeção.

# 8. Fronteira NFR e capacidades transversais

ACL, correlação, contagem sem vazamento e persistência da leitura RF13 são responsabilidade local **quando** a RF for implementada. AuthN/RBAC amplo e rate limit permanecem upstream/plataforma; tracing distribuído é compartilhado. RabbitMQ, DLQ, redrive e Schema Registry não são requisitos locais RF13 porque não há evento de negócio Support. A ausência da rota funcional é estágio esperado enquanto há blockers contratuais, não drift técnico da baseline RF12.

# 9. Cobertura e validação real

- Revisão de Git: branch documental parte de `MAIN_BASELINE_RF12`, checkpoint `58fcea6` preservado; submódulo limpo e gitlink Support 0.14 inalterado.
- `git diff --check`, `git -C luciluci-docs diff --check`, `npm run format:check` e `git show --check HEAD` passaram; a fonte original manteve SHA-256 `7d5e26647bcecc93cfb9df52d5c87bfa882e9d140ceb55632d527e15fa5b1c03`. O primeiro `format:check` encontrou apenas este report; Prettier foi aplicado e a repetição passou. Nenhum teste RF13 foi executado.
- `NO_EXECUTABLE_CHANGE`: somente documentação do serviço neste lote. Nenhum `src/**`, `tests/**`, `scripts/**`, migration, OpenAPI executável, `api.http`, CI ou package file alterado.

# 10. Divergências

## 10.1 Documentação prevê, código não comprova

RF13 continua 404, sem OpenAPI ou testes próprios. É estágio contratado, não regressão.

## 10.2 Código existe, documentação não comprova

Nenhum comportamento RF13 adicional. O placeholder 404 é reserva de rota.

## 10.3 `ACTUAL_STATE.md` afirma, código não comprova

Nenhuma afirmação de implementação RF13. O estado corrente distingue decisão de visibilidade resolvida de contrato ainda bloqueado.

## 10.4 PRD / TDD / TP divergem entre si

Não há conflito literal novo. O PRD deixa detalhes HTTP/consistência abertos; TDD/TP planejam o comportamento e as provas sem torná-los decisões aprovadas.

## 10.5 Ambiguidades que impedem conclusão segura

**Blockers independentes residuais:** DEC-SUP-01/09, família de headers e validação do `ticketId`; DEC-SUP-02, defaults/limites/ordem e metadados de paginação; DEC-SUP-08, shape exato, body/query e matriz/precedência de erros; política de fotografia para ACL, total, página e Ticket number sob RF06/RF10 concorrentes. Não reutilizar decisões RF09/RF12 por analogia. A visibilidade `nova_mensagem` **não** integra mais esta lista.

# 11. Conclusão

`RF13_VISIBILITY_RESOLVED` e `NO_HIDDEN_AUDIT_COUNT_LEAKAGE` estão documentados como decisão expressa. O veredito global continua **`RF13_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION / NOT_IMPLEMENTED`** pelos blockers independentes da seção 10.5. Support 0.15 não foi congelado ou publicado; o gitlink permanece `820b2a8`. Próximo passo: decisão expressa para os detalhes RF13 residuais, seguida do fechamento no repositório canônico. Só depois cabe uma branch funcional `feat/support-rf13-history`.
