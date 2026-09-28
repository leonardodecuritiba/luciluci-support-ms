# REPORT — Checkpoint contratual RF13 (List History)

- **status:** `RF13_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION`
- **generated_by:** Codex
- **generated_at:** 2026-09-25T19:52:55Z
- **review_mode:** wave-1 documental
- **microservice:** support-ms
- **repository_ref:** `docs/support-rf13-history-checkpoint`, desde `MAIN_BASELINE_RF12` (`1e243d386dbca3e2d4dbf14fec7d29c8e5d1b366`)
- **documentation_ref:** Support 0.14, gitlink `820b2a8b29819fc52aefd078dc51bfe651a51204`
- **report_file:** `docs/reports/REPORT-SUPPORT-RF13-CHECKPOINT-20260925-195255.md`
- **reviewer:** não designado

# 1. Resumo executivo

O PRD prevê 14 operações HTTP, considerando RF07a/RF07b separadamente. RF01–RF12, 13 operações, estão integradas e provadas em `main`. A [PR #14](https://github.com/leonardodecuritiba/luciluci-support-ms/pull/14) foi mergeada em `1e243d3`; o workflow `ci`, run [36181786738](https://github.com/leonardodecuritiba/luciluci-support-ms/actions/runs/36181786738), concluiu com `success` para o head `160aa1e`. `main` local e `origin/main` coincidem. Não houve deploy neste checkpoint.

RF13 prevê `GET /api/support/tickets/history`, com `ticketId` opcional, paginação, escopo por Ticket e nenhuma auditoria de leitura. O path literal já está reservado com `404`, antes de `/:ticketId`. O contrato continua **bloqueado por decisão**: principalmente a exposição de `nova_mensagem` ao solicitante quando a mensagem pode ser interna. O AuditLog atual não contém `messageId` ou visibilidade. Support 0.15 não foi criado; RF13 permanece `NOT_IMPLEMENTED`. Nenhuma decisão RF12 se estende automaticamente a RF13.

# 2. Escopo e fontes analisadas

Autoridade: `luciluci-docs/support/sources/prd-original.md` §§3–7 (RF13 e auditoria), transposição `support/prd.md` §§4.4, 5.1, 5.2, 7/RF13 e 8, `support/notes.md` DEC-SUP-01/02/04/08/09, `support/tdd.md` RF13, `support/tp.md` TC-SUP-RF13 e `support/dependencies.md`. Inventário: `src/features/ticket/adapters/routes/ticket.routes.ts`, `ticket-audit-log.entity.ts`, `ticket-audit-log.schema.ts`, migration RF05, `src/shared/openapi/swagger.ts`, `docs/openapi/v1/support-api.json`, `api.http`, testes e reports anteriores. `AGENTS.md`, `AI_FIRST.md`, `ACTUAL_STATE.md`, `README.md` e política de branches foram conferidos.

O workflow remoto prova os gates da PR #14, não a RF13. A análise RF13 é estrutural/documental; nenhum teste funcional RF13 ou PostgreSQL foi executado neste lote.

# 3. Matriz principal RF x implementação

| RF          | Fonte e superfície                   | Estado                             | Evidência e limite                                                 |
| ----------- | ------------------------------------ | ---------------------------------- | ------------------------------------------------------------------ |
| RF01–RF06   | PRD/TDD/TP, Department e Ticket      | Implementado e provado             | Rotas, OpenAPI e reports históricos; provas não repetidas aqui     |
| RF07a/RF07b | PRD/TDD/TP, duas listagens de Ticket | Implementado e provado             | PR #7 e prova PostgreSQL histórica                                 |
| RF08–RF12   | PRD/TDD/TP, Ticket/Message           | Implementado e provado             | PRs #8–#10/#12/#14; RF12 no report de implementação e CI da PR #14 |
| RF13        | PRD/TDD/TP, `GET /tickets/history`   | Não implementado; contrato ambíguo | Reserva 404; sem handler, OpenAPI ou testes RF13                   |

# 4. Checklist consolidado por PRD

- [x] Rota genérica com `ticketId` opcional, `page` e `size` identificados; sem `ticketId`, consultar apenas históricos de tickets acessíveis.
- [x] Admin depende de `allowedUserIds` do Department atual; solicitante depende de ownership. `Department.type` não concede acesso.
- [x] Item exemplificado com `ticketId,number,datetime,authorId,origin,action,statusType,newStatus`; campos de status só preenchidos em `alteracao_status`.
- [x] Ações de AuditLog limitadas a `criacao_ticket`, `nova_mensagem`, `alteracao_status`; GET não gera auditoria.
- [!] A fonte não define se `nova_mensagem` de nota interna aparece ao solicitante. Não inferir a resposta da RF12, que filtra a própria Message.
- [!] O PRD não fecha ordenação, shape exato de resposta, erro para `ticketId` inacessível/inexistente nem validação HTTP detalhada.

# 5. Checklist consolidado por TDD

- [x] O TDD exige escopo na query **e no total**, antes da paginação, e `ticket.number` projetado por item.
- [x] A rota literal `/history` precede `/:ticketId` no router; hoje retorna 404 por estágio.
- [x] O schema de AuditLog tem `id,ticketId,datetime,authorId,origin,action,statusType,newStatus`; não tem `messageId`/visibility. Não inventar FK ou migration.
- [!] A decisão de privacidade de `nova_mensagem` pode exigir alteração do desenho de auditoria; essa consequência depende da escolha de negócio.
- [ ] Não há caso de uso, repositório de leitura, controller ou contrato OpenAPI RF13.

# 6. Checklist consolidado por TP

- [x] `TC-SUP-RF13` planeja listagem global e por Ticket, ACL, paginação sem vazamento em `total`, campos de status e precedência da rota.
- [ ] Unit, integration, contract e functional RF13 não existem; casos do TP estão `PLANNED/PENDING_DECISION`, não executados.

## 6.1 Matriz RF → unit / integration / functional

| RF        | Unit                                                      | Integration                                                               | Functional                                        | Evidência/limite                                                  |
| --------- | --------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------- |
| RF01–RF11 | Suítes dedicadas históricas                               | HTTP/SQLite e PostgreSQL históricas                                       | `proof:rf01`–`proof:rf11:postgres`                | Comprovadas em reports anteriores; não repetidas neste checkpoint |
| RF12      | `tests/unit/ticket/list-ticket-messages.use-case.spec.ts` | `tests/integration/ticket/list-ticket-messages.spec.ts`, contrato OpenAPI | `scripts/prove-rf12-postgres.js`, smoke de imagem | Report RF12 e CI da PR #14; não repetidas aqui                    |
| RF13      | Ausente                                                   | Ausente                                                                   | Ausente                                           | 404 reservado não prova a RF                                      |

# 7. Inventário e decisões RF13

| Superfície                           | Estado real                                                               |
| ------------------------------------ | ------------------------------------------------------------------------- |
| `GET /api/support/tickets/history`   | Router retorna 404; OpenAPI e `api.http` não declaram RF13 funcional      |
| `GET /api/support/tickets/:ticketId` | RF09 real; reserva literal de history evita confundir `history` com ID    |
| AuditLog                             | RF05/RF06/RF08/RF10 gravam somente as ações previstas; RF13 seria leitura |

**Fechado pela fonte:** método/path, `ticketId` opcional, paginação, ACL base por Ticket, número do Ticket no item, campos de status apenas em `alteracao_status`, nenhum AuditLog para GET. Department inativo não elimina Ticket histórico; membership atual continua relevante.

| Decisão RF13 pendente                      | Proposta para revisão, sem aprovação                                                                                        | Consequência                                                                                                                                                               |
| ------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DEC-SUP-04: `nova_mensagem` e nota interna | Definir expressamente se requester vê metadados de toda `nova_mensagem`, de nenhuma, ou só de mensagens visíveis            | O AuditLog não aponta para Message; a terceira opção requer vínculo persistido e possível migration/backfill. Excluir todas também oculta auditorias de mensagens públicas |
| DEC-SUP-01/09: identidade e `ticketId`     | Reutilizar três headers das RFs de leitura e UUID v4 para `ticketId`; ator opaco                                            | Contrato específico RF13 ainda necessário; não herdar por analogia                                                                                                         |
| DEC-SUP-02: paginação e ordem              | `page=1,size=20`, limites 1–100, `datetime DESC,id DESC`; total após ACL, antes de `LIMIT`                                  | O PRD só fixa paginação e nomes no exemplo; desempate precisa ser estável                                                                                                  |
| DEC-SUP-08: resposta/erros                 | Envelope `{data,pagination}`; definir se item tem só oito campos do exemplo; 400/403/404/422/500 conforme leitura RF09/RF12 | Em particular, fixar semântica de `ticketId` válido mas inacessível e de body/query extra                                                                                  |
| Leitura concorrente                        | Definir fotografia coerente para Ticket/ACL, total, página e `number`, inclusive RF06/RF10 concorrentes                     | Escopo e total não podem divergir nem expor metadados de outro Department                                                                                                  |

Nenhuma das propostas é decisão de negócio aprovada. A opção de esconder auditorias `nova_mensagem` por visibility **não é implementável fielmente** com o schema atual sem associar cada AuditLog à Message. O campo `authorId` e a proximidade temporal não são identificadores seguros: RF10 de requester grava duas auditorias e operações concorrentes podem compartilhar instantes.

# 8. Fronteira NFR e capacidades transversais

| Tema                                                 | Categoria                           | Conclusão neste checkpoint                                            |
| ---------------------------------------------------- | ----------------------------------- | --------------------------------------------------------------------- |
| ACL fina, correlação, paginação, PostgreSQL, OpenAPI | Responsabilidade local              | Implementada para RFs anteriores; contrato RF13 pendente              |
| AuthN ampla, RBAC geral e rate limit                 | Upstream/plataforma                 | BFF/gateway; ausência local não é gap RF13                            |
| Observabilidade distribuída                          | Compartilhado                       | Sem decisão nova RF13                                                 |
| RabbitMQ, DLQ, redrive, Schema Registry e eventos    | Fora do escopo RF13                 | PRD não especifica evento Support; GET não escreve                    |
| Gap real local RF13                                  | Não classificado como defeito atual | Ausência de rota funcional é estágio planejado, até fechar o contrato |

`/health`, `/metrics` e `/api-docs*` são superfícies operacionais, não RFs. Não ampliar a auditoria de negócio com regras globais genéricas.

# 9. Cobertura e validação real

- PR #14 mergeada: head `160aa1e`, merge `1e243d3`; workflow `ci`, run `36181786738`, `completed/success`, comprovado via GitHub. É evidência da RF12.
- `git fetch origin --prune`, `git merge --ff-only origin/main`: passaram; `main=origin/main=1e243d3` e gitlink Support 0.14 limpo.
- Inspeção estática de PRD original/transposto, notes, TDD, TP, router, AuditLog, OpenAPI e report RF12: realizada.
- Testes RF13, cobertura, PostgreSQL, imagem e deploy: **não executados**; não há runtime RF13 para provar.
- `npm run format:check`, `git diff --check` e `git -C luciluci-docs diff --check` passaram após a edição documental. O submódulo e o gitlink permaneceram limpos.

# 10. Divergências

## 10.1 Documentação prevê, código não comprova

RF13 está no PRD/TDD/TP, mas o path retorna 404 intencionalmente; OpenAPI não o anuncia. É ausência esperada antes do contrato, não regressão RF12.

## 10.2 Código existe, documentação não comprova

Nenhum comportamento RF13 adicional foi encontrado. O placeholder 404 preserva a precedência da rota.

## 10.3 `ACTUAL_STATE.md` afirma, código não comprova

Nenhuma alegação de RF13 implementada. A fotografia anterior à PR #14 será mantida como histórica sob um cabeçalho atual novo.

## 10.4 PRD / TDD / TP divergem entre si

Não há contradição direta: o PRD deixa semânticas abertas, e TDD/TP explicitam as decisões e provas necessárias. A projeção da auditoria interna é lacuna material da fonte.

## 10.5 Ambiguidades que impedem conclusão segura

Visibilidade de `nova_mensagem` para requester; headers e ID; paginação/ordem/shape; matriz de erros e precedência; fotografia coerente sob concorrência. DEC-SUP-01/02/04/08/09 continuam abertas **para RF13**.

# 11. Conclusão

`MAIN_BASELINE_RF12` está integrada e a CI remota da PR #14 passou. RF13 permanece `RF13_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION / NOT_IMPLEMENTED`; Support 0.14 e seu gitlink não mudaram. Próximo passo prioritário: decidir a exposição de `nova_mensagem` de nota interna ao solicitante e o impacto correspondente no modelo AuditLog. Depois, fechar os demais itens RF13 em documentação canônica, publicar essa revisão e só então abrir branch funcional RF13. Nenhuma implantação foi feita.
