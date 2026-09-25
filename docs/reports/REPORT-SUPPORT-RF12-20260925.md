# REPORT — Implementação e prova RF12 (List Ticket Messages)

- **status:** `RF12 IMPLEMENTED_AND_PROVEN` na branch; ainda fora de `main`
- **generated_by:** Codex
- **generated_at:** 2026-09-25T19:21:02Z
- **review_mode:** final local
- **microservice:** support-ms
- **repository_ref:** `feat/support-rf12-list-messages`, base documental `4a47e01e1090627c447bb7e531ad9f5efb2cbdef`
- **documentation_ref:** Support 0.14, gitlink `820b2a8b29819fc52aefd078dc51bfe651a51204`
- **report_file:** `docs/reports/REPORT-SUPPORT-RF12-20260925.md`
- **reviewer:** não designado

# 1. Resumo executivo

RF01–RF11 permanecem implementadas e integradas em `MAIN_BASELINE_RF11` (`7724382`). RF12 está implementada e provada somente nesta branch funcional; RF13 permanece não implementada. São 14 operações previstas no PRD (RF07a/RF07b separadas), com 13 implementadas nesta branch. A ausência de RF12 no checkpoint documental era esperada por estágio e foi encerrada neste lote, sem novo drift técnico identificado. Não houve PR, push, merge ou deploy.

`GET /api/support/tickets/{ticketId}/messages` valida headers, UUID v4, query estrita e ausência de body. Admin com membership atual vê todas ou filtra por visibility. Requester owner vê apenas visíveis; filtro explícito `false` retorna 200 vazio sem consultar mensagens. O repositório aplica scope no SQL antes de count/página, ordena `createdAt ASC,id ASC` e carrega mídias em uma consulta. ACL, total, página e mídias são lidos na mesma transação PostgreSQL `REPEATABLE READ`, sem lock ou escrita.

# 2. Escopo e fontes analisadas

- Autoridade: `luciluci-docs/support/{README,prd,notes,tdd,tp,dependencies}.md` em Support 0.14; fonte `sources/prd-original.md` preservada (SHA-256 `7d5e26647bcecc93cfb9df52d5c87bfa882e9d140ceb55632d527e15fa5b1c03`).
- Código: `src/features/ticket/**`, middleware de body em `src/app.ts`, OpenAPI, `api.http`, testes e scripts de prova.
- Baseline: `main=origin/main=7724382245545c5918262ebb66aff0d696b0a2b2`; branch criada sobre `origin/docs/support-rf12-list-messages-checkpoint=4a47e01`, descendente de `main`. O delta da base documental contém apenas documentação/report/gitlink.
- CI remota RF12: **ausente**; workflow `.github/workflows/ci.yml` alterado localmente, não publicado neste lote. Um workflow versionado não é execução remota.

# 3. Matriz principal RF x implementação

| RF        | Estado nesta branch              | Código/contrato                                            | Prova                                                                                                         |
| --------- | -------------------------------- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| RF01–RF11 | Integradas e provadas em `main`  | Baseline anterior                                          | Provas PostgreSQL RF01–RF11 reexecutadas neste lote                                                           |
| RF12      | Implementada e provada na branch | Controller, use case, repository, OpenAPI GET e `api.http` | 8 unitários dedicados, 6 integrações dedicadas, contrato, processo compilado/PostgreSQL, concorrência e smoke |
| RF13      | Não implementada                 | `/history` reservado retorna 404                           | 404 confirmado; fora do recorte                                                                               |

# 4. Checklist consolidado por PRD

- [x] Rota, ACL geral, filtro opcional, paginação e ausência de auditoria preservados.
- [x] Escopo do requester nunca inclui mensagens internas em `data`, `total` ou posição de página.
- [x] Department inativo não remove acesso por membership atual ou ownership; `Department.type` não autoriza.
- [x] RF13 não foi antecipada; fonte original e gitlink Support 0.14 não foram alterados.

# 5. Checklist consolidado por TDD

- [x] Controller valida headers/body/path/query e usa transação PostgreSQL `REPEATABLE READ`.
- [x] Use case separa ACL, shortcut requester `false`, paginação, projeção de oito campos e mídia.
- [x] Repository usa predicado SQL de visibilidade antes de count e page, com `createdAt ASC,id ASC`.
- [x] Uma query de mídia para a página, com `position ASC` e duplicatas preservadas.
- [x] Sem migration, escrita, AuditLog, idempotência, evento/outbox, mensageria ou lock pessimista.
- [x] SQLite de teste usa transação sem isolamento explícito; consistência `REPEATABLE READ` foi comprovada no PostgreSQL real.

# 6. Checklist consolidado por TP

- [x] Testes unitários de ACL, escopo, filtro e parser RF12.
- [x] Integração HTTP/SQLite de admin/requester, paginação, oito campos, mídia, matriz de erros e snapshots lógicos.
- [x] Contrato OpenAPI de parâmetros permitidos, ausência de requestBody, envelope e RF13 ausente.
- [x] Prova funcional com processo compilado e PostgreSQL descartável, incluindo snapshots físicos (`xmin`) e concorrências RF10/RF11.
- [x] Smoke da imagem com admin all e requester sem nota interna.

## 6.1 Matriz RF → testes

| RF        | Unit                                                      | Integration                                                               | Functional                                                    | Estado                                    |
| --------- | --------------------------------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------- | ----------------------------------------- |
| RF01–RF11 | Suítes anteriores                                         | Suítes anteriores                                                         | `proof:rf01`–`proof:rf11:postgres`, reexecutadas              | Provadas historicamente e regressão verde |
| RF12      | `tests/unit/ticket/list-ticket-messages.use-case.spec.ts` | `tests/integration/ticket/list-ticket-messages.spec.ts`; contrato OpenAPI | `scripts/prove-rf12-postgres.js`, `scripts/prove-s1-image.js` | Completa nesta branch                     |
| RF13      | Ausente                                                   | Ausente                                                                   | 404 reservado, sem implementação                              | Fora do recorte                           |

# 7. Inventário, read-only, N+1 e concorrência

| Método | Path                                      | Handler                          | RF   | Estado                 |
| ------ | ----------------------------------------- | -------------------------------- | ---- | ---------------------- |
| GET    | `/api/support/tickets/:ticketId/messages` | `ticket.controller#listMessages` | RF12 | Implementado na branch |
| GET    | `/api/support/tickets/history`            | reserva literal 404              | RF13 | Não implementado       |

`/health`, `/metrics`, `/api-docs` e `/api-docs-json` são superfícies operacionais, não RFs. AuthN ampla e rate limit permanecem upstream/plataforma. Correlação, ACL fina e PostgreSQL são responsabilidade local; observabilidade distribuída é compartilhada. RabbitMQ, DLQ e Schema Registry não são exigências locais de RF12. Não foi identificado gap real local no recorte.

## 7.1 Prova física de leitura

O harness capturou `row_to_json` **e `xmin`** de `departments`, `department_allowed_users`, `tickets`, `ticket_messages`, `ticket_message_media` e `ticket_audit_logs` antes/depois das leituras RF12. As seis coleções foram idênticas. O teste de Department inativo usa UPDATE deliberado fora desse intervalo; depois dele foi criado um novo snapshot antes dos casos de validação. Nenhuma leitura RF12 alterou auditoria, timestamp ou linha física. Bancos da prova são criados com nome `support_s1_proof_rf12_*`, inexistentes previamente, e removidos pelo próprio script em `finally`.

## 7.2 Prova N+1

O preload exclusivo do harness observou **uma** query `ticket_message_media` para página com **oito** mensagens. Mídias `['h1','h2','h1']` e `['v1','v2','v1']` preservaram ordem/duplicatas; mensagem sem mídia retornou `[]`. Nenhuma query por item. Para requester com filtro `false`, a contagem SQL de `ticket_messages` não aumentou: zero consultas a mensagens após ACL. O preload não é usado no runtime normal.

## 7.3 Consistência/concorrência

O harness pausou o retorno do count dentro da transação RF12, deixou writer RF10 ou RF11 commitar e liberou a leitura. O snapshot PostgreSQL já havia sido adquirido pela consulta de Ticket/ACL. Nenhum lock pessimista, deadlock ou timeout ocorreu.

| Cenário               | Fotografia observada                                                        | Coerência                            |
| --------------------- | --------------------------------------------------------------------------- | ------------------------------------ |
| RF12 requester × RF10 | `total=7` antes do commit; nova mensagem ausente, próxima leitura `total=8` | Sem mensagem/mídia parcial           |
| RF12 requester × RF11 | `total=8` antes de revelar nota; nota ausente, próxima leitura `total=9`    | Sem mistura de visibility/total/page |
| RF12 admin × RF11     | Item ainda visível na fotografia; próxima leitura mostra `false`            | Valor do item coerente com snapshot  |

# 8. Fronteira NFR e capacidades transversais

| Tema                                                 | Classificação       | Evidência/limite                                      |
| ---------------------------------------------------- | ------------------- | ----------------------------------------------------- |
| ACL, validação, read-only, consistência e correlação | Local               | Implementados/provados no recorte RF12                |
| AuthN ampla, RBAC geral, rate limit                  | Upstream/plataforma | BFF/gateway; não ampliado localmente                  |
| Tracing distribuído                                  | Compartilhado       | Sem requisito novo RF12                               |
| RabbitMQ, DLQ, Schema Registry                       | Fora do escopo      | Sem evento Support definido                           |
| Gap real local                                       | Nenhum identificado | CI remoto ainda não rodou porque não houve publicação |

# 9. Cobertura e validação real

| Gate                                                                                         | Exit | Resultado                                                                                                                                                             |
| -------------------------------------------------------------------------------------------- | ---: | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run lint`, `build`, `build:check`, `openapi:export`, `openapi:check`, `messaging:check` |    0 | Passaram                                                                                                                                                              |
| `npm run openapi:compat -- /tmp/rf12-openapi-main.json docs/openapi/v1/support-api.json`     |    0 | Compatível com `main`                                                                                                                                                 |
| `npm run test:unit`                                                                          |    0 | 19 suítes, 83 testes                                                                                                                                                  |
| `npm run test:integration`                                                                   |    0 | 13 suítes, 217 testes; primeira tentativa sem bind local falhou `EPERM`, repetida com permissão passou                                                                |
| `npm run test:contract`                                                                      |    0 | 1 suíte, 2 testes                                                                                                                                                     |
| `npm run test:coverage`, `npm run coverage:check`                                            |    0 | 33 suítes, 302 testes; 98,03% statements, 87,75% branches, 98,87% functions, 98,54% lines; limiares passaram                                                          |
| `proof:rf01:postgres`–`proof:rf11:postgres`                                                  |    0 | Todas passaram em bancos exclusivos; RF02 inicial falhou por timezone local e passou com `TZ=UTC`                                                                     |
| `proof:rf12:postgres`                                                                        |    0 | Processo compilado, ACL, matriz HTTP, N+1, seis tabelas físicas e concorrências; primeiras versões do harness falharam, foram corrigidas e repetidas com bancos novos |
| `proof:s1:image`                                                                             |    0 | Imagem, PostgreSQL/rede descartáveis, RF12 admin/requester e health; limpeza confirmada                                                                               |
| `npm run format:check`, `git diff --check`                                                   |    0 | Passaram após report/documentação                                                                                                                                     |

O comando `proof:rf12:postgres` exige ambiente PostgreSQL explícito e nome de banco `support_s1_(proof|ci)_rf12_*`. A execução local usou contêiner exclusivo `support-rf12-proof-db-20260925-1` com porta aleatória. A prova não acessou banco padrão/preexistente.

# 10. Divergências

## 10.1 Documentação prevê, código não comprova

RF13 continua planejada, fora do recorte. RF12 foi alinhada nesta branch ao contrato 0.14. A integração em `main` e CI remota ainda não ocorreram.

## 10.2 Código existe, documentação não comprova

Nenhuma divergência RF12 identificada após atualização de OpenAPI, `api.http`, estado e report.

## 10.3 ACTUAL_STATE afirma, código não comprova

Nenhuma afirmação de RF12 integrada em `main`; estado restrito à branch funcional.

## 10.4 PRD / TDD / TP divergem entre si

Nenhuma divergência nova. Support 0.14 distingue regra da fonte e decisões posteriores específicas de RF12.

## 10.5 Ambiguidades que impedem conclusão segura

Nenhuma lacuna contratual RF12 aberta. A prova remota CI depende de publicação futura da branch/PR.

# 11. Conclusão

RF12 está `IMPLEMENTED_AND_PROVEN` **nesta branch**, pronta para revisão de diff e, após autorização do próximo lote, publicação/PR. `main` continua RF11; RF13 permanece `NOT_IMPLEMENTED`. Nenhuma migration, evento, deploy, commit, push, PR ou merge foi executado neste lote.
