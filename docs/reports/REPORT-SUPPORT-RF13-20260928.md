# REPORT — Implementação e prova RF13 (Ticket History)

> Revisão posterior: [REPORT-SUPPORT-RF13-REVIEW-20260928.md](REPORT-SUPPORT-RF13-REVIEW-20260928.md). A revisão reforçou a prova temporal e de paginação sem alterar o runtime RF13. As evidências abaixo são deste lote de implementação.

- **status:** `RF13 IMPLEMENTED_AND_PROVEN` somente na branch funcional; `ALL_RF_IMPLEMENTED_LOCALLY`
- **generated_by:** Codex
- **generated_at:** 2026-09-28T14:44:41Z
- **review_mode:** final local
- **microservice:** support-ms
- **repository_ref:** `feat/support-rf13-history`, base documental `7f041fdcda4add42e21025583c91c316f579489e`, `main=origin/main=1e243d386dbca3e2d4dbf14fec7d29c8e5d1b366`
- **documentation_ref:** Support 0.15, gitlink canônico publicado `14efcdfdc70d774c4343e2ec47662b7b5c8b691b`
- **report_file:** `docs/reports/REPORT-SUPPORT-RF13-20260928.md`
- **reviewer:** não designado

# 1. Resumo executivo

RF01–RF12 permanecem integradas e provadas em `MAIN_BASELINE_RF12` (`1e243d3`). RF13, última RF do ciclo, foi implementada e provada localmente nesta branch funcional. As 14 operações previstas no PRD, contando RF07a/RF07b separadamente, estão materializadas nesta branch. Nenhum commit funcional, push, PR, merge em `main` ou deploy foi feito neste lote.

Inventário local: 14 operações documentadas, 14 implementadas, zero parciais, zero não encontradas e zero ambíguas. As 14 têm evidência unit/integration/functional acumulada; RF13 foi executada neste lote e as provas funcionais RF01–RF12 foram reexecutadas. `/health`, `/metrics` e `/api-docs*` são superfícies operacionais, não RFs.

`GET /api/support/tickets/history` valida os três headers, query estrita e ausência de body. Sem `ticketId`, consulta AuditLog sob membership atual de Department para admin ou ownership para requester. Com `ticketId`, distingue 404 de 403 antes de listar. Requester vê criação/status e apenas `nova_mensagem` de `backoffice|cd` escrita pelo dono; auditorias de admin são filtradas no SQL antes de count, ordem e paginação. A consulta projeta oito campos, lê `Ticket.number`, ordena `datetime DESC,id DESC` e roda em transação PostgreSQL `REPEATABLE READ`. Não consulta TicketMessage para inferir visibility.

# 2. Escopo e fontes analisadas

- Autoridade: `luciluci-docs/support/{README,prd,notes,tdd,tp,dependencies}.md` em Support 0.15. `sources/prd-original.md` preservado, SHA-256 `7d5e26647bcecc93cfb9df52d5c87bfa882e9d140ceb55632d527e15fa5b1c03`.
- Base: `origin/main` ancestral de `origin/docs/support-rf13-history-checkpoint`; delta documental da base sem executável; branch funcional criada diretamente de `7f041fd`.
- Código/contrato: rota, middleware, parser, controller, use case, interface/repositório TypeORM, OpenAPI exportada e `api.http`.
- Testes: unit, integração HTTP/SQLite, contrato, processo compilado/PostgreSQL descartável, regressão RF01–RF12 e imagem Docker.
- CI remota RF13: **ausente**. Workflow foi alterado localmente e não publicado. Presença do workflow não é execução remota.

# 3. Matriz principal RF x implementação

| RF        | Estado nesta branch            | Código/contrato                             | Prova                                                                       |
| --------- | ------------------------------ | ------------------------------------------- | --------------------------------------------------------------------------- |
| RF01–RF12 | Integradas em `main`           | Baseline `1e243d3`                          | Provas PostgreSQL RF01–RF12 reexecutadas; suíte completa verde              |
| RF13      | Implementada/provada na branch | `GET /tickets/history`, OpenAPI, `api.http` | Unit, integração, contrato, PostgreSQL físico/concorrência, smoke da imagem |

# 4. Checklist consolidado por PRD

- [x] Histórico inclui criação, nova mensagem e alteração de status, com `Ticket.number` e oito campos exatos.
- [x] Admin com membership atual vê todo AuditLog no seu escopo, inclusive mensagens admin públicas ou internas; Department inativo e `type` não alteram ACL.
- [x] Requester dono vê criação/status e só mensagem própria `origin=backoffice|cd`, mesmo quando `ticket.origin` difere do papel atual.
- [x] `ticketId` opcional diferencia inexistência (404), falta de ACL (403) e UUID inválido (422).
- [x] Sem migration, evento Support, auditoria de leitura ou mudança de documentação canônica.

# 5. Checklist consolidado por TDD

- [x] Query whitelist `ticketId/page/size`, defaults 1/20, size máximo 100, sem aliases/repetição/body.
- [x] Actor scope e filtro de `nova_mensagem` no SQL antes de `COUNT` e offset; nenhum total ou posição vaza auditoria oculta.
- [x] `datetime DESC,id DESC` com desempate determinístico; página além do fim retorna 200 vazio e total preservado.
- [x] Projeção de oito campos, `statusType/newStatus` presentes como `null` fora de alteração de status.
- [x] Ticket/ACL, count, página e number lidos no mesmo `REPEATABLE READ` PostgreSQL. SQLite usa transação sem nível explícito.
- [x] Nenhum lock pessimista, write ou consulta a TicketMessage para visibility.

# 6. Checklist consolidado por TP

- [x] Unit para parser, escopo, ACL e envelope.
- [x] Integração HTTP/SQLite para admin/requester, Department inativo, ACL, contagem compactada, desempate, oito campos, read-only lógico e matriz HTTP.
- [x] Contrato OpenAPI verifica 14 operações, `/history`, query, ausência de requestBody, item e erros.
- [x] Prova PostgreSQL descartável verifica processo compilado, snapshots físicos de seis tabelas, ausência de lookup TicketMessage e concorrências RF13×RF10/RF06/RF08/RF11.
- [x] Smoke da imagem com histórico admin/requester e mudança RF11 sem ampliar histórico do requester.

## 6.1 Matriz RF → unit / integration / functional

| RF        | Unit                                                     | Integration/contract                                                                                      | Functional                                                    | Estado              |
| --------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------- |
| RF01–RF12 | Suítes anteriores                                        | Suítes anteriores                                                                                         | `proof:rf01`–`proof:rf12:postgres` reexecutadas               | Regressão verde     |
| RF13      | `tests/unit/ticket/list-ticket-history.use-case.spec.ts` | `tests/integration/ticket/list-ticket-history.spec.ts`, `tests/contract/openapi/openapi.contract.test.ts` | `scripts/prove-rf13-postgres.js`, `scripts/prove-s1-image.js` | Completa localmente |

# 7. Inventário, segurança, read-only e concorrência

| Método | Path                           | Handler                         | Estado                 |
| ------ | ------------------------------ | ------------------------------- | ---------------------- |
| GET    | `/api/support/tickets/history` | `ticket.controller#listHistory` | Implementado na branch |

## Endpoints operacionais / contratos

`/health`, `/metrics`, `/api-docs` e `/api-docs-json` continuam operacionais; nenhum deles conta como RF. `docs/openapi/v1/support-api.json` materializa as 14 operações funcionais e preserva as anteriores. `api.http` inclui exemplos admin/requester, ACL, validação e body proibido.

O repositório usa join AuditLog→Ticket e `EXISTS` em `department_allowed_users` para admin, ou `ticket.requester_id` para requester. O predicado de `nova_mensagem` restringe requester a `origin IN ('backoffice','cd') AND audit.author_id=ticket.requester_id`. O preload da prova registrou queries e confirmou que leituras RF13 não consultam `ticket_messages`; RF11 não alterou o resultado do requester. Não há correlação heurística com Message.

A prova física comparou `row_to_json(t)` e `xmin` de `departments`, `department_allowed_users`, `tickets`, `ticket_messages`, `ticket_message_media` e `ticket_audit_logs` antes/depois de leituras válidas e inválidas. As seis coleções foram idênticas. O banco `support_s1_proof_rf13_20260928c` foi criado somente para a prova e removido no `finally`. O contêiner PostgreSQL temporário é externo ao script e foi removido ao fim do lote.

O harness pausou RF13 após o count dentro da transação, permitiu o commit concorrente e retomou a página. A resposta em andamento reteve integralmente `data` e `total` da fotografia anterior; a próxima leitura mostrou a mudança. Não houve timeout/deadlock.

| Cenário               | `total` da fotografia | Próxima leitura | Resultado                                       |
| --------------------- | --------------------: | --------------: | ----------------------------------------------- |
| RF13 requester × RF10 |                     5 |               7 | Dois AuditLogs da mensagem aparecem juntos      |
| RF13 admin × RF06     |                     9 |              10 | Audit de status inteiro após commit             |
| RF13 requester × RF08 |                     8 |               9 | Audit requester inteiro após commit             |
| RF13 requester × RF11 |                     9 |               9 | Visibility muda sem AuditLog; histórico estável |

# 8. Fronteira NFR e capacidades transversais

| Tema                                                             | Classificação       | Evidência/limite                                         |
| ---------------------------------------------------------------- | ------------------- | -------------------------------------------------------- |
| ACL fina, validação, correlação, read-only e snapshot PostgreSQL | Local               | Implementados/provados na RF13                           |
| AuthN ampla, RBAC geral e rate limit                             | Upstream/plataforma | Fora do handler Support                                  |
| Tracing distribuído                                              | Compartilhado       | Sem requisito local novo RF13                            |
| RabbitMQ, DLQ, redrive e Schema Registry                         | Fora do escopo      | Nenhum evento Support especificado                       |
| Gap real local                                                   | Nenhum identificado | CI remota ainda não executada por ausência de publicação |

Capacidades transversais: `X-Correlation-ID` continua obrigatório no boundary de negócio e propagado na resposta; o histórico não introduz idempotência, tracing novo, evento, outbox ou mensagem. O middleware global de actor e o handler de erro existentes permanecem a base dos códigos 400 e 500.

# 9. Cobertura e validação real

| Gate                                                                             | Resultado                                                                                                                                                                             |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run build`, `build:check`, `lint`                                           | Passaram                                                                                                                                                                              |
| `npm run openapi:export`, `openapi:check`, `openapi:compat` contra `origin/main` | Passaram; artefato versionado sincronizado                                                                                                                                            |
| `npm run messaging:check`                                                        | Passou                                                                                                                                                                                |
| `npm run test:coverage`                                                          | 35 suítes, 310 testes; 97,91% statements, 88,04% branches, 98,93% functions, 98,37% lines                                                                                             |
| `proof:rf01:postgres`–`proof:rf12:postgres`                                      | 12 provas passaram em bancos exclusivos; RF02 exigiu `TZ=UTC` por comparação de horário do harness legado                                                                             |
| `proof:rf13:postgres`                                                            | Passou no banco descartável `support_s1_proof_rf13_20260928c`; primeiras duas tentativas revelaram seleção excessiva de auditorias no próprio harness, corrigida antes da prova final |
| `proof:s1:image`                                                                 | Passou com rede, imagem e PostgreSQL descartáveis; cleanup confirmado                                                                                                                 |
| `npm run coverage:check`, `format:check`, `git diff --check`                     | Passaram após formatar report e expectativas legadas                                                                                                                                  |

A primeira execução agregada de Jest teve um `socket hang up` isolado em RF07; a suíte RF07 isolada e a execução completa de cobertura passaram em seguida. A primeira regressão RF01 exigiu atualizar a lista esperada de paths OpenAPI com RF13. A primeira RF02 falhou por comparação de timestamps sob timezone local; passou com `TZ=UTC`. Essas falhas não foram atribuídas ao runtime RF13.

# 10. Divergências

## 10.1 Documentação prevê, código não comprova

Nenhuma lacuna funcional RF13 identificada nesta branch. Integração em `main` e CI remota ainda não ocorreram.

## 10.2 Código existe, documentação não comprova

OpenAPI, `api.http`, estado, inventários e este report foram alinhados à implementação local.

## 10.3 `ACTUAL_STATE.md` afirma, código não comprova

O estado no topo descreve a branch funcional e separa explicitamente `main`, PR e deploy.

## 10.4 PRD / TDD / TP divergem entre si

Nenhuma contradição material nova após Support 0.15. A fonte original foi preservada.

## 10.5 Ambiguidades que impedem conclusão segura

Nenhum blocker contratual RF13 residual. Publicação, CI remota e integração são passos posteriores, ainda não executados.

# 11. Conclusão

`RF01–RF13 IMPLEMENTED_AND_PROVEN_ON_FEATURE_BRANCH / RF13 NOT_YET_IN_MAIN / NO_DEPLOY`. A branch está preparada para revisão do diff e, em lote autorizado posterior, publicação e PR final RF13. Após integração, cabe o fechamento documental final do support-ms. Este primeiro lote termina sem commit, push ou PR.
