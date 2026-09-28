# REPORT — Fechamento contratual RF13 (List History)

- **status:** `RF13_CONTRACT_CHECKPOINT_READY / RF13_CONTRACT_FROZEN / NOT_IMPLEMENTED`
- **generated_by:** Codex
- **generated_at:** 2026-09-28T14:12:33Z
- **review_mode:** final documental
- **microservice:** support-ms
- **repository_ref:** `docs/support-rf13-history-checkpoint`, sobre checkpoints históricos `58fcea6` e `39028ec`
- **documentation_ref:** Support 0.15, `luciluci-docs` `14efcdfdc70d774c4343e2ec47662b7b5c8b691b`, branch `docs/support-rf13-history-contract`
- **report_file:** `docs/reports/REPORT-SUPPORT-RF13-CONTRACT-20260928-141233.md`
- **reviewer:** não designado

# 1. Resumo executivo

As decisões expressas de 2026-09-28 fecharam os blockers independentes registrados no [checkpoint RF13](REPORT-SUPPORT-RF13-CHECKPOINT-20260925-195255.md) e no [report de visibilidade](REPORT-SUPPORT-RF13-VISIBILITY-20260925-203223.md). Support 0.15 congela **somente** `GET /api/support/tickets/history`; os dois reports e commits anteriores permanecem fotografias históricas. Não surgiu contradição material nova. RF01–RF12 estão `IMPLEMENTED_AND_PROVEN` em `MAIN_BASELINE_RF12` (`main=origin/main=1e243d3`), enquanto RF13 continua `NOT_IMPLEMENTED` e `/tickets/history` retorna 404.

O contrato preserva `ticketId` opcional **na query**, ACL de Ticket, visibilidade por action decidida anteriormente, `total` sem vazamento, ordem `datetime DESC,id DESC`, item exato de oito campos, envelope paginado e leitura PostgreSQL `REPEATABLE READ`. Não há migration, evento, AuditLog de leitura, teste RF13 executado, OpenAPI funcional ou deploy neste lote. O gitlink foi avançado somente após publicar e confirmar o SHA canônico.

# 2. Escopo e fontes analisadas

- Fonte funcional: `luciluci-docs/support/sources/prd-original.md`, preservada byte a byte (SHA-256 `7d5e26647bcecc93cfb9df52d5c87bfa882e9d140ceb55632d527e15fa5b1c03`). PRD transposto, notes, TDD, TP, README e dependencies foram confrontados. Apenas os cinco arquivos permitidos `support/{README,prd,notes,tdd,tp}.md` mudaram no repositório canônico.
- Decisões expressas: prompt do usuário de 2026-09-28, tópicos RF13-01–RF13-16; política de visibilidade do prompt anterior preservada. `DEC-SUP-01/02/04/08/09/12` resolvidas **somente** para RF13; DEC-SUP-11 não se aplica.
- Serviço: `AGENTS.md`, `AI_FIRST.md`, `ACTUAL_STATE.md`, `DRIFT_REPORT.md`, `README.md`, política de branches e os dois reports RF13 históricos. Inventário read-only de router, AuditLog, OpenAPI e `api.http`.
- Git: `main=origin/main=1e243d386dbca3e2d4dbf14fec7d29c8e5d1b366`; branch documental do serviço preserva `58fcea6` e `39028ec`. Support 0.15 publicado em `docs/support-rf13-history-contract` com `HEAD`, tracking e `ls-remote` iguais a `14efcdfdc70d774c4343e2ec47662b7b5c8b691b` antes do avanço do gitlink.
- CI remota da [PR #14](https://github.com/leonardodecuritiba/luciluci-support-ms/pull/14): run [36181786738](https://github.com/leonardodecuritiba/luciluci-support-ms/actions/runs/36181786738) `success` para RF12. Não é prova RF13.

# 3. Matriz principal RF x implementação

| RF          | Estado                                       | Código/contrato                                   | Evidência e limite                        |
| ----------- | -------------------------------------------- | ------------------------------------------------- | ----------------------------------------- |
| RF01–RF06   | Implementadas/provadas                       | Rotas e contratos integrados                      | Reports históricos; não repetidos         |
| RF07a/RF07b | Implementadas/provadas                       | Duas listagens de Ticket                          | PR #7 e prova histórica                   |
| RF08–RF12   | Implementadas/provadas                       | Ticket/Message; Support até 0.14                  | PRs #8–#10/#12/#14; CI RF12 aprovada      |
| RF13        | Contrato Support 0.15 congelado, sem runtime | `/tickets/history` reservado 404; OpenAPI ausente | TP planejado, nenhum teste RF13 executado |

# 4. Checklist consolidado por PRD

- [x] Método/path literal `GET /api/support/tickets/history`, com `ticketId` opcional **na query**, `page` e `size` preservados.
- [x] Sem `ticketId`, histórico somente dos Tickets acessíveis; com ID, validar existência e ACL. Admin por membership atual; requester por ownership; `Department.type` não autoriza e inatividade não remove histórico.
- [x] Três actions originais preservadas. Requester nunca recebe `nova_mensagem` de admin; audit de própria mensagem requester exige origin backoffice/cd e authorId do dono. `criacao_ticket`/`alteracao_status` seguem ACL geral.
- [x] Item público mantém os oito campos da fonte, com nullability explícita posterior. Leitura não cria AuditLog.
- [x] PRD original intacto; defaults, ordem, envelope e erros são decisões pós-PRD identificadas.

# 5. Checklist consolidado por TDD

- [x] Headers de correlação/ator/role e whitelist `ticketId,page,size` fechados; path estático antes de `/:ticketId`.
- [x] Ticket ACL → `ticketId` opcional → visibilidade de AuditLog → count → ordem → página, em SQL antes de offset. Sem correlação heurística AuditLog↔Message.
- [x] Ordenação `datetime DESC,id DESC`, `totalPages=0` no vazio e item de oito campos, com `number` do Ticket no mesmo snapshot.
- [x] Ticket/ACL, total, página e `number` em uma transação PostgreSQL `REPEATABLE READ`, sem lock pessimista nem bloqueio de writers.
- [x] RF06/RF08/RF10 concorrentes entram inteiros antes do snapshot ou não entram; RF11 não audita nem muda projeção RF13.
- [x] `NO_NEW_MIGRATION_RF13`, `NO_WRITE`, `NO_AUDIT`, `NO_EVENT`, `NO_OUTBOX`, `NO_MESSAGING`.
- [ ] Handler, use case, repositório, OpenAPI e `api.http` RF13 permanecem ausentes por estágio.

# 6. Checklist consolidado por TP

- [x] `TC-SUP-RF13` agora planeja escopo global/por Ticket, nota interna, contagem sem vazamento, paginação/ordem, item, headers/erros, read-only físico e concorrências RF06/RF08/RF10/RF11.
- [ ] Testes unitários, de integração, contrato e funcionais RF13 **não foram criados ou executados** nesta revisão documental.

## 6.1 Matriz RF → unit / integration / functional

| RF        | Unit                                                      | Integration                                                        | Functional                               | Estado da evidência                       |
| --------- | --------------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------- | ----------------------------------------- |
| RF01–RF11 | Suítes dedicadas anteriores                               | HTTP/SQLite e PostgreSQL anteriores                                | Provas por RF anteriores                 | Reports históricos; não repetidas aqui    |
| RF12      | `tests/unit/ticket/list-ticket-messages.use-case.spec.ts` | `tests/integration/ticket/list-ticket-messages.spec.ts` e contrato | `scripts/prove-rf12-postgres.js`, smoke  | Report RF12/CI PR #14; não repetidos aqui |
| RF13      | `UT-SUP-RF13` planejado                                   | `INT-SUP-RF13` planejado                                           | `FU-SUP-01..06`/`CT-SUP-RF13` planejados | `PLANNED / NOT_RUN`                       |

# 7. Inventário e decisões RF13

| Tema               | Decisão final                                                                                             | Natureza                       | Estado         |
| ------------------ | --------------------------------------------------------------------------------------------------------- | ------------------------------ | -------------- |
| Headers            | `X-Correlation-ID`, `X-Performed-By`, `X-Performed-By-Type=admin\|backoffice\|cd`; inválidos/ausentes 400 | DEC-SUP-01, transporte pós-PRD | Resolvido RF13 |
| Actor scope        | Admin por membership atual, requester por ownership; sem `ticketId`, só Tickets acessíveis                | Fonte e clarificação RF13      | Resolvido RF13 |
| Ticket ID          | Query opcional UUID v4; inválido 422, inexistente 404, existente sem ACL 403                              | DEC-SUP-08/09 posterior        | Resolvido RF13 |
| Query/body         | Só ticketId/page/size; desconhecida, repetida, vazia ou body presente 422                                 | DEC-SUP-08 posterior           | Resolvido RF13 |
| Paginação          | Defaults 1/20, page>=1, size 1..100, decimal seguro; além do fim 200 vazio                                | DEC-SUP-02/08 posterior        | Resolvido RF13 |
| Ordem              | `datetime DESC,id DESC`, desempate interno, sem sort                                                      | DEC-SUP-02 posterior           | Resolvido RF13 |
| Item/nullability   | Oito campos exatos; statusType/newStatus `null` fora de alteração_status                                  | Fonte + DEC-SUP-08 posterior   | Resolvido RF13 |
| Envelope           | `200 {data,pagination:{page,size,total,totalPages}}`; zero com totalPages=0                               | DEC-SUP-08 posterior           | Resolvido RF13 |
| Visibilidade       | Admin todas; requester sem `nova_mensagem` admin, com auditoria de própria mensagem                       | DEC-SUP-04, decisão anterior   | Resolvido RF13 |
| Total              | Escopo e visibilidade no SQL antes de count/ordem/offset; ocultas não afetam metadata                     | DEC-SUP-02/04/08               | Resolvido RF13 |
| Read-only          | Sem write, AuditLog, touch, idempotência, evento/outbox/messaging, lock pessimista                        | GET/DEC-SUP-11 N/A             | Resolvido RF13 |
| Snapshot           | `REPEATABLE READ` para ACL, total, página e Ticket.number                                                 | DEC-SUP-12 posterior           | Resolvido RF13 |
| Concorrência       | RF06/RF08/RF10 antes ou depois da fotografia; RF11 não audita                                             | DEC-SUP-12 posterior           | Resolvido RF13 |
| Department inativo | Histórico preservado sob membership/ownership atual; type não autoriza                                    | P1/P6                          | Resolvido RF13 |
| Erros              | 200/400/403/404/422/500; sem 401/409                                                                      | DEC-SUP-08 posterior           | Resolvido RF13 |

Matriz de visibilidade: admin autorizado vê `nova_mensagem` de admin e requester; requester dono **não** vê `nova_mensagem` de admin, mas vê a de `backoffice|cd` quando `authorId=ticket.requesterId`. É `SECURITY_INVARIANT_RF13` não correlacionar AuditLog a Message por hora, autor, ordem, UUID, contagem ou posição. RF12 pode mostrar Message admin pública sem AuditLog correspondente para requester; é consequência deliberada.

# 8. Fronteira NFR e capacidades transversais

ACL fina, correlação, count sem vazamento e PostgreSQL são responsabilidades locais da futura implementação RF13. AuthN/RBAC amplo e rate limit permanecem upstream/plataforma; tracing distribuído é compartilhado. RabbitMQ, DLQ, redrive e Schema Registry não são requisitos locais RF13 porque não há evento Support. `/health`, `/metrics` e `/api-docs*` são operacionais, não RFs. Não há gap técnico local novo neste lote documental.

# 9. Cobertura e validação real

- Git de admissão: `git fetch origin --prune` passou; branch documental limpa; `main=origin/main=1e243d3`; gitlink anterior `820b2a8`; commits `58fcea6` e `39028ec` preservados.
- Repositório canônico: `support/{README,prd,notes,tdd,tp}.md` somente; `git -C luciluci-docs diff --check`, `git -C luciluci-docs show --check HEAD` e Prettier passaram; SHA-256 do original preservado.
- Publicação canônica: `git -C luciluci-docs push -u origin docs/support-rf13-history-contract` passou sem force; `ls-remote`, HEAD local e tracking ref coincidiram em `14efcdfdc70d774c4343e2ec47662b7b5c8b691b`.
- Serviço: `git diff --check`, `npm run format:check` e `git show --check HEAD` passaram após formatar apenas este report. O delta deste lote contra `39028ec` contém somente documentação e gitlink; **nenhum executável** mudou.
- Testes RF13, PostgreSQL, imagem e deploy: **não executados**. Evidências RF12 são históricas e não são atribuídas à RF13.

# 10. Divergências

## 10.1 Documentação prevê, código não comprova

RF13 está congelada em Support 0.15, mas o runtime ainda retorna 404 e a OpenAPI não anuncia a rota. É o intervalo esperado entre contrato e implementação; não é drift da RF12.

## 10.2 Código existe, documentação não comprova

Nenhum comportamento RF13 adicional. A reserva literal 404 evita colisão com a rota RF09 por ID.

## 10.3 `ACTUAL_STATE.md` afirma, código não comprova

Nenhuma alegação de RF13 implementada. O estado corrente distingue contrato congelado de runtime ausente.

## 10.4 PRD / TDD / TP divergem entre si

Nenhuma contradição material nova após alinhar Support 0.15. O PRD original permanece inalterado; os detalhes pós-PRD estão identificados como decisões expressas nos três documentos.

## 10.5 Ambiguidades que impedem conclusão segura

**Nenhum blocker contratual RF13 residual** para o congelamento. Provas e artefatos executáveis continuam necessários no lote funcional; ausência deles não invalida o checkpoint documental.

# 11. Conclusão

`RF13_CONTRACT_CHECKPOINT_READY / RF13_CONTRACT_FROZEN / NOT_IMPLEMENTED` em Support 0.15, publicado no commit canônico `14efcdfdc70d774c4343e2ec47662b7b5c8b691b` e fixado no gitlink da branch documental do serviço. Sem migration, runtime RF13, branch funcional, testes executados, evento ou deploy. Próximo lote explícito: implementar e provar RF13 em `feat/support-rf13-history`, a partir da baseline RF12 e do contrato 0.15 publicado.
