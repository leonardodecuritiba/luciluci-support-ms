# REPORT — Implementação e prova local RF11

- **status:** `IMPLEMENTED_AND_PROVEN` local, fora de `main`
- **generated_by:** Codex
- **generated_at:** 2026-09-25T17:40:32Z
- **review_mode:** final
- **microservice:** support-ms
- **repository_ref:** `feat/support-rf11-message-visibility`, base documental `886bf714dae97fb5973eee74127b0f1b4257b13b`
- **documentation_ref:** Support 0.13 `4958fd1840042200fd1a87e45d6a7f69d4011dcd`
- **report_file:** `docs/reports/REPORT-SUPPORT-RF11-20260925.md`
- **reviewer:** não identificado

# 1. Resumo executivo

RF11 altera a visibilidade de uma mensagem administrativa do Ticket por
`PATCH /api/support/tickets/{ticketId}/messages/{messageId}/visibility`.
Foi implementada e provada localmente sobre `MAIN_BASELINE_RF10` mais o
checkpoint documental Support 0.13. RF01–RF10 continuam integradas em
`main`; RF11 permanece somente nesta branch; RF12/RF13 não têm runtime.
Das 14 operações do PRD, 12 estão implementadas e duas permanecem fora do
runtime. Não houve commit, push, PR, CI remota ou deploy neste lote.

O risco central é atualização acidental no no-op ou efeito colateral em Ticket,
mídias e auditorias. A prova PostgreSQL observou `xmin` igual, nenhuma
chamada à trigger contadora de UPDATE no no-op, rollback completo sob falha
injetada e serialização sob lock Ticket→Department→Message.

# 2. Escopo e fontes analisadas

Autoridade de negócio: `luciluci-docs/support/{README,prd,notes,tdd,tp,dependencies}.md`
e `sources/prd-original.md` na revisão canônica 0.13. Base funcional:
`origin/main=734ba5de74e544b1e8dc2a31c135cb2bb54d20e1`; o checkpoint
documental `886bf71` é descendente e seu delta contém só documentação e
gitlink. Fonte de execução: `src/features/ticket/**`,
`src/features/department/**`, `src/shared/openapi/swagger.ts`, testes,
scripts e `.github/workflows/ci.yml`. O submódulo permaneceu limpo em `4958fd1`.

O workflow CI recebeu a prova RF11, mas não existe run remoto desta branch.
As provas locais usaram PostgreSQL 16 em contêiner exclusivo; cada script
verificou que seu banco `support_s1_proof_rfNN_*` não existia, criou-o e o
removeu após a execução. O smoke da imagem tem rede, banco, imagem e
contêineres próprios. Nenhum banco padrão ou preexistente foi usado.

# 3. Matriz principal RF x implementação

| RF          | Superfície          | Estado                            | Código/contrato                                                          | Teste/prova                                             |
| ----------- | ------------------- | --------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------- |
| RF01–RF04   | Department          | Integradas em `main`              | `src/features/department/**`                                             | Unit/integration; provas PostgreSQL RF01–RF04 repetidas |
| RF05        | Criar Ticket        | Integrada em `main`               | `src/features/ticket/**`                                                 | Unit/integration; prova PostgreSQL RF05 repetida        |
| RF06        | Editar Ticket       | Integrada em `main`               | `update-ticket.use-case.ts`                                              | Unit/integration; prova RF06 e concorrência RF11×RF06   |
| RF07a/RF07b | Listar Tickets      | Integradas em `main`              | `list-tickets.use-case.ts`                                               | Unit/integration; prova RF07 repetida                   |
| RF08        | Resolver Ticket     | Integrada em `main`               | `resolve-ticket.use-case.ts`                                             | Unit/integration; prova RF08 e concorrência RF11×RF08   |
| RF09        | Buscar Ticket       | Integrada em `main`               | `get-ticket.use-case.ts`                                                 | Unit/integration; prova RF09 repetida                   |
| RF10        | Criar mensagem      | Integrada em `main`               | `create-ticket-message.use-case.ts`                                      | Unit/integration; prova RF10 e concorrência RF11×RF10   |
| RF11        | Editar visibilidade | Implementada/provada nesta branch | `update-message-visibility.use-case.ts`, controller, repository, OpenAPI | Unit, HTTP/SQLite, contrato e `prove-rf11-postgres.js`  |
| RF12–RF13   | Listagem/histórico  | Não encontradas no runtime        | Rotas ausentes                                                           | 404 e OpenAPI ausente                                   |

As quatro superfícies operacionais locais (`/health`, `/metrics`,
`/api-docs`, `/api-docs-json`) não entram na contagem de RF.

# 4. Checklist consolidado por PRD

- [x] Admin membro atual do Department do Ticket, mesmo inativo, pode editar
      qualquer mensagem `type=admin`, inclusive de outro admin.
- [x] Backoffice/cd, admin sem membership e mensagens não administrativas são
      rejeitados sem write. Escopo usa os dois UUIDs e evita vazamento cross-ticket.
- [x] Ambas as transições retornam TicketMessage com oito campos e mídia em
      ordem posicional com duplicatas.
- [x] Mesmo valor retorna 200 sem UPDATE físico; mutação efetiva altera somente
      `ticket_messages.is_visible_to_requester`.
- [x] Ticket, `updatedAt`, mídia, auditoria, eventos e outbox não são tocados.
- [ ] RF12/RF13 seguem para lotes próprios.

# 5. Checklist consolidado por TDD

- [x] DTOs de path UUID v4 e body boolean estrito; query proibida; headers de
      correlação e ator validados; matriz 200/400/403/404/422/500.
- [x] Use case não conhece Express e usa interface focal; controller executa
      transação TypeORM.
- [x] Repositório existente aplica `FOR UPDATE` no Ticket e na Message
      escopada; Department usa seu repositório com lock. Ordem
      Ticket→Department→Message. Update focal, sem `save(message)`.
- [x] OpenAPI exportado e compatível com `origin/main`; `api.http` contém
      22 cenários RF11. Nenhuma migration nova.
- [x] Processo compilado e imagem de produção contemplados nos gates.

# 6. Checklist consolidado por TP

- [x] Testes unitários da ACL, escopo, elegibilidade, duas transições, no-op,
      resposta exata e mídia.
- [x] Integração HTTP/SQLite de criação RF10 seguida de edição RF11,
      validações, membership, preservação de agregados e rotas futuras ausentes.
- [x] Prova funcional PostgreSQL de no-op físico, rollback e concorrência
      controlada. SQLite não é tratado como prova de `FOR UPDATE`.
- [x] Suíte de contrato OpenAPI e smoke da imagem.

## 6.1 Matriz obrigatória RF -> testes

| RF        | Unitário                                                       | Integração                                                   | Funcional/contrato                                                                         | Resultado         |
| --------- | -------------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------ | ----------------- |
| RF01–RF10 | Suíte completa                                                 | Suíte completa                                               | Provas PostgreSQL RF01–RF10 repetidas; smoke                                               | PASS              |
| RF11      | `tests/unit/ticket/update-message-visibility.use-case.spec.ts` | `tests/integration/ticket/update-message-visibility.spec.ts` | `scripts/prove-rf11-postgres.js`, `tests/contract/openapi/openapi.contract.test.ts`, smoke | PASS              |
| RF12/RF13 | Fora desta wave                                                | Ausentes                                                     | Rotas 404; OpenAPI ausente                                                                 | Não implementadas |

A suíte completa teve 31 suítes e 288 testes aprovados. Cobertura: 97,95%
statements (1056/1078), 87,24% branches (301/345), 98,79% functions
(164/166) e 98,52% lines (1003/1018). `coverage:check` passou.

# 7. Inventário de endpoints reais

Novo endpoint RF11: `PATCH /api/support/tickets/{ticketId}/messages/{messageId}/visibility`.
Headers obrigatórios: `X-Correlation-ID`, `X-Performed-By`,
`X-Performed-By-Type`; body estrito com apenas
`isVisibleToRequester:boolean`. `200` devolve TicketMessage completa;
`400/403/404/422/500` usam o envelope do serviço. Sem query e sem
idempotency key. RF12 `GET /tickets/{ticketId}/messages` e RF13
`GET /tickets/history` seguem indisponíveis.

# 8. Fronteira NFR e capacidades transversais

| Capacidade                                | Classificação                | Evidência/limite                                                 |
| ----------------------------------------- | ---------------------------- | ---------------------------------------------------------------- |
| Correlação, erros, ACL, transação e locks | Implementado localmente      | HTTP/SQLite e PostgreSQL compilado RF11                          |
| AuthN e RBAC amplo                        | Upstream/plataforma          | Headers de ator recebidos do boundary; Support aplica membership |
| Observabilidade distribuída               | Compartilhado                | Nenhuma exigência RF11 nova aprovada                             |
| Eventos, outbox, DLQ, Schema Registry     | Fora do escopo desta release | Nenhum evento Support aprovado                                   |
| Seed W1                                   | Gap real local anterior      | Não alterada por RF11; ainda depende de massa determinística     |

# 9. Cobertura de testes, rollback, concorrência e validação

Na prova PostgreSQL RF11, `true→false` e `false→true` atualizaram uma
versão física cada, com Ticket, mídia e auditorias idênticos antes/depois.
Admin B editou mensagem de A; Department inativo não bloqueou membership.
Falhas ACL, tipo, escopo e validação não escreveram. No-op preservou
`xmin` da Message e Ticket, rows e contagem da trigger de UPDATE.
Na execução final, `xmin` da Message foi `747→747`, do Ticket
`742→742`, e a contagem de UPDATEs da Message `2→2`; três rows de mídia e
seis de auditoria permaneceram iguais. Falha injetada em `BEFORE UPDATE`
retornou 500, manteve visibility `true→true` e preservou o snapshot.
A trigger e o banco foram descartados.

| Concorrência              | HTTP    | Observação física/final                                                           |
| ------------------------- | ------- | --------------------------------------------------------------------------------- |
| RF11×RF11 mesmo alvo      | 200/200 | Uma única atualização física; segunda chamada virou no-op                         |
| RF11×RF11 valores opostos | 200/200 | Fila controlada sob Ticket lock; false seguido de true; duas versões e final true |
| RF11×RF10                 | 200/201 | Mensagem nova, mídias duplicadas e audit RF10; Ticket mudou apenas por RF10       |
| RF11×RF08                 | 200/200 | Requester resolvido, audit RF08, visibilidade preservada                          |
| RF11×RF06 transferência   | 200/403 | RF06 mudou Department primeiro; RF11 reavaliou membership novo e não escreveu     |

Gates com exit 0: `lint`, `build`, `build:check`, `openapi:export`,
`openapi:check`, `openapi:compat` contra `origin/main`,
`messaging:check`, `test:unit`, `test:integration`, `test:contract`,
`test:coverage`, `coverage:check`, `format:check`, provas PostgreSQL
RF01–RF11, `proof:s1:image` e `git diff --check`.

A primeira prova RF02 falhou sob fuso local na comparação histórica de
timestamp; RF02–RF10 passaram com `TZ=UTC`. A primeira integração completa
teve um 404 isolado em RF05; sua suíte isolada e a integração completa repetida
passaram. Os logs registram a falha inicial; não houve alteração de runtime
para mascará-la.

# 10. Divergências

## 10.1 Documentação prevê, código não comprova

RF12/RF13 permanecem planejadas e fora deste lote.

## 10.2 Código existe, documentação não comprova

Nenhuma lacuna RF11 identificada após alinhar OpenAPI, `api.http`, estado e
report. A documentação canônica e o gitlink não foram alterados.

## 10.3 `ACTUAL_STATE.md` afirma, código não comprova

O bloco atual distingue implementação local de integração em `main`; os
checkpoints anteriores permanecem explicitamente históricos.

## 10.4 PRD / TDD / TP divergem entre si

Nenhuma divergência material nova foi identificada no recorte congelado 0.13.

## 10.5 Ambiguidades que impedem conclusão segura

Nenhuma para a RF11 local. CI remota e revisão de PR não existem sem publicação
Git posterior.

# 11. Conclusão

`RF11_IMPLEMENTED_AND_PROVEN` localmente, pronta para revisão do diff.
Não houve commit, push, PR, merge ou deploy. O próximo lote pode publicar a
branch funcional e abrir PR após autorização específica.
