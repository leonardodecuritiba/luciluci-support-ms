# REPORT — Checkpoint contratual RF09 do support-ms

- **status:** `RF09_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION`
- **generated_by:** Codex
- **generated_at:** 2026-09-24T22:33:34Z
- **review_mode:** final
- **microservice:** support-ms
- **repository_ref:** `codex/support-rf09-contract-checkpoint` sobre `main`/`45be90318bdb71e67532482364933cb49e6660e9`
- **documentation_ref:** `luciluci-docs/support/{README,prd,notes,tdd,tp,dependencies}.md`, gitlink Support 0.10 `93edf66d6ed0002a2af537339da315db1285a779`
- **report_file:** `docs/reports/REPORT-SUPPORT-RF09-CHECKPOINT-20260924-223334.md`
- **reviewer:** não informado

---

# 1. Resumo executivo

- O PRD contém 14 operações: RF01–RF13, com RF07a e RF07b distintas. Nove (RF01–RF08) estão no runtime integrado; cinco (RF09–RF13) ainda não. Este checkpoint não implementa RF09.
- A [PR #8](https://github.com/leonardodecuritiba/luciluci-support-ms/pull/8) foi integrada no merge `45be90318bdb71e67532482364933cb49e6660e9`, estabelecendo `MAIN_BASELINE_RF08`. O check remoto `quality` do head `ab43d4e53e0d4fde70a66c42a8f38fc9e66806ad` passou no [run `36065884933`](https://github.com/leonardodecuritiba/luciluci-support-ms/actions/runs/36065884933). `main` local e `origin/main` foram sincronizadas nesse merge.
- A fonte fixa método/path, os onze campos de Ticket, ACL de §5.2 e ausência de auditoria. O contrato transversal de headers, IDs e erros segue aberto especificamente para RF09 em DEC-SUP-01/08/09. **Veredito: `RF09_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION`.**
- A ausência de rota RF09 é esperada nesta etapa; não há drift técnico de RF09 comprovado.

# 2. Escopo e fontes analisadas

- Fonte funcional: `luciluci-docs/support/sources/prd-original.md`, transposição `luciluci-docs/support/{prd,notes,tdd,tp,dependencies,README}.md`, todos no gitlink fixo 0.10. A fonte original foi preservada; SHA-256 verificado: `7d5e26647bcecc93cfb9df52d5c87bfa882e9d140ceb55632d527e15fa5b1c03`.
- Estado e processo: `AGENTS.md`, `AI_FIRST.md`, `ACTUAL_STATE.md`, `README.md`, `DRIFT_REPORT.md`, `docs/README.md`, `docs/workflows/support-development-branch-policy.md`, `service-identity.json`, `src/README.md`, `tests/README.md`, reports RF08 e `.github/workflows/ci.yml`.
- Runtime e contratos: `src/features/ticket/adapters/routes/ticket.routes.ts`, `src/features/ticket/adapters/controllers/ticket.controller.ts`, `src/shared/openapi/swagger.ts`, `docs/openapi/v1/support-api.json`, `api.http`, `tests/contract/openapi/openapi.contract.test.ts` e `tests/integration/department/delete-department.spec.ts`.
- Método: `docs/reports/REPORT-TEMPLATE.md`, `.codex/skills/report-review.md` e `docs/prompts/report-completeness-prompt.md`; inspeção estrutural e evidência remota da PR #8. Nenhuma suíte ou prova de RF09 executada. O run remoto prova o head RF08, não RF09 nem o merge commit isoladamente.
- Git: `git fetch origin --prune`, fast-forward local de `main`, branch documental própria sobre o merge e submódulo limpo no gitlink existente. Não houve `submodule update --remote`.

# 3. Matriz principal RF x implementação

| RF    | Endpoint/tema                                            | Estado         | Evidência e limite                                                       |
| ----- | -------------------------------------------------------- | -------------- | ------------------------------------------------------------------------ |
| RF01  | POST departments                                         | Implementado   | `src/features/department/**`; report RF01                                |
| RF02  | PATCH departments                                        | Implementado   | `src/features/department/**`; report RF02                                |
| RF03  | GET departments                                          | Implementado   | `src/features/department/**`; report RF03                                |
| RF04  | DELETE departments                                       | Implementado   | `src/features/department/**`; report RF04                                |
| RF05  | POST tickets                                             | Implementado   | `src/features/ticket/**`; report RF05                                    |
| RF06  | PATCH tickets/{ticketId}                                 | Implementado   | route/controller e report RF06                                           |
| RF07a | GET tickets/requester/{requesterId}                      | Implementado   | route/controller e report RF07                                           |
| RF07b | GET tickets/admin/{adminId}                              | Implementado   | route/controller e report RF07                                           |
| RF08  | POST tickets/{ticketId}/resolve                          | Implementado   | route/controller, report RF08, PR #8                                     |
| RF09  | GET tickets/{ticketId}                                   | Não encontrado | PRD/TDD/TP planejam; route/OpenAPI/api.http/testes não expõem GET por ID |
| RF10  | POST tickets/{ticketId}/messages                         | Não encontrado | Fora deste recorte; PRD/TDD/TP                                           |
| RF11  | PATCH tickets/{ticketId}/messages/{messageId}/visibility | Não encontrado | Fora deste recorte; PRD/TDD/TP                                           |
| RF12  | GET tickets/{ticketId}/messages                          | Não encontrado | Fora deste recorte; PRD/TDD/TP                                           |
| RF13  | GET tickets/history                                      | Não encontrado | Fora deste recorte; PRD/TDD/TP                                           |

# 4. Checklist consolidado por PRD

- [x] RF09 é `GET /api/support/tickets/{ticketId}` e retorna todos os campos de Ticket, com `adminStatus` e `requesterStatus` distintos.
- [x] §5.2 aplica a ACL: admin membro do `allowedUserIds` do Department do Ticket; solicitante `backoffice`/`cd` somente dono pelo `requesterId`. `Department.type` não governa o acesso. Ticket histórico em Department inativo continua funcional (P1).
- [x] Leitura não cria AuditLog. `description`, `mediaIds`, mensagens e Department expandido não são campos do Ticket.
- [!] §5.2 admite `403` ou `404` para negação, a escolher na implementação. O PRD sugere `X-Caller-*`, mas deixa o contrato de headers ajustável.
- [ ] O PRD não fecha matriz HTTP completa nem projeção serializada exata para RF09; decisões transversais anteriores têm escopo próprio.

# 5. Checklist consolidado por TDD

- [x] O fluxo planejado carrega Ticket, valida acesso e projeta seus campos. Nenhum evento de negócio Support foi especificado.
- [x] O runtime atual já possui entidade/repositório Ticket e ACL em outras RFs; isso é precedente técnico, não prova de RF09.
- [!] `tdd.md` marca DEC-SUP-01/08/09 pendentes para RF09. Definir formato do ID de path, identidade externa, headers, response e erros antes de alterar route/controller/OpenAPI.
- [ ] Nenhum handler GET por ID, DTO, contrato OpenAPI ou exemplo `api.http` de RF09 foi materializado.

# 6. Checklist consolidado por TP

- [x] `TC-SUP-RF09` planeja leitura por dono e admin autorizado, negação a não dono/admin sem membership, campos do Ticket e ausência de auditoria.
- [!] O código de negação depende de DEC-SUP-08; header e IDs dependem de DEC-SUP-01/09.
- [ ] Caso RF09 unitário, de integração, funcional ou de contrato não foi criado nem executado. Plano de teste não é prova.

## 6.1 Matriz RF → unit/integration/functional

| RF    | Unit                                                       | Integration                                              | Functional                            | Agrupamento / limite             | Estado       |
| ----- | ---------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------- | -------------------------------- | ------------ |
| RF01  | `tests/unit/department/create-department.use-case.spec.ts` | `tests/integration/department/create-department.spec.ts` | `scripts/prove-rf01-postgres.js`      | Report RF01; evidência histórica | histórica    |
| RF02  | `tests/unit/department/update-department.use-case.spec.ts` | `tests/integration/department/update-department.spec.ts` | `scripts/prove-rf02-postgres.js`      | Report RF02; evidência histórica | histórica    |
| RF03  | `tests/unit/department/list-departments.use-case.spec.ts`  | `tests/integration/department/list-departments.spec.ts`  | `scripts/prove-rf03-postgres.js`      | Report RF03; evidência histórica | histórica    |
| RF04  | `tests/unit/department/delete-department.use-case.spec.ts` | `tests/integration/department/delete-department.spec.ts` | `scripts/prove-rf04-postgres.js`      | Report RF04; evidência histórica | histórica    |
| RF05  | `tests/unit/ticket/create-ticket.use-case.spec.ts`         | `tests/integration/ticket/create-ticket.spec.ts`         | `scripts/prove-rf05-postgres.js`      | Report RF05; evidência histórica | histórica    |
| RF06  | `tests/unit/ticket/update-ticket.use-case.spec.ts`         | `tests/integration/ticket/update-ticket.spec.ts`         | `scripts/prove-rf06-postgres.js`      | Report RF06; evidência histórica | histórica    |
| RF07a | `tests/unit/ticket/list-tickets.use-case.spec.ts`          | `tests/integration/ticket/list-tickets.spec.ts`          | `scripts/prove-rf07-postgres.js`      | Asserções requester; report RF07 | histórica    |
| RF07b | `tests/unit/ticket/list-tickets.use-case.spec.ts`          | `tests/integration/ticket/list-tickets.spec.ts`          | `scripts/prove-rf07-postgres.js`      | Asserções admin; report RF07     | histórica    |
| RF08  | `tests/unit/ticket/resolve-ticket.use-case.spec.ts`        | `tests/integration/ticket/resolve-ticket.spec.ts`        | `scripts/prove-rf08-postgres.js`      | Report RF08 e CI da PR #8        | histórica    |
| RF09  | ausente                                                    | ausente                                                  | `TC-SUP-RF09` planejado, sem execução | Nenhuma exceção                  | não iniciado |
| RF10  | ausente                                                    | ausente                                                  | TP planejado                          | Fora do recorte                  | não iniciado |
| RF11  | ausente                                                    | ausente                                                  | TP planejado                          | Fora do recorte                  | não iniciado |
| RF12  | ausente                                                    | ausente                                                  | TP planejado                          | Fora do recorte                  | não iniciado |
| RF13  | ausente                                                    | ausente                                                  | TP planejado                          | Fora do recorte                  | não iniciado |

# 7. Inventário de endpoints reais

`src/features/ticket/adapters/routes/ticket.routes.ts` registra POST `/`, GET `/requester/:requesterId`, GET `/admin/:adminId`, PATCH `/:ticketId` e POST `/:ticketId/resolve`. O path `/api/support/tickets/{ticketId}` no OpenAPI tem PATCH, sem GET. `api.http` termina em RF08. RF09 permanece `404` pela ausência de route. RF01–RF04 e endpoints operacionais `/health`, `/metrics`, `/api-docs`, `/api-docs-json` continuam distintos do recorte RF09; OPTIONS tem tratamento técnico próprio.

# 8. Fronteira NFR e capacidades transversais

| Capacidade                                             | Fronteira                                  | Situação neste checkpoint                            |
| ------------------------------------------------------ | ------------------------------------------ | ---------------------------------------------------- |
| `X-Correlation-ID`, error mapping, OpenAPI, `api.http` | implementado localmente nas RFs existentes | RF09 precisa contrato próprio antes de uso           |
| ACL fina por ownership/membership                      | compartilhado entre BFF e serviço          | BFF autentica; Support valida §5.2 por Ticket        |
| AuthN, headers de identidade confiáveis na borda       | upstream/plataforma                        | Não atribuir JWT local sem contrato                  |
| OpenTelemetry, DLQ, redrive, Schema Registry externo   | upstream/plataforma                        | Sem requisito RF09 específico                        |
| Evento/outbox de leitura                               | fora do escopo desta release               | PRD não especifica evento e proíbe auditoria de RF09 |
| Seed robusto W1                                        | fora do escopo desta release               | `scripts/seed.ts` bloqueia massa ainda não definida  |

# 9. Cobertura de testes e validação

- Método: inspeção de paths, routes, OpenAPI, `api.http`, TP e evidências históricas dos reports. Nenhuma cobertura percentual nova foi medida; não se atribui execução de teste RF09.
- Unit/integration/functional/contract RF09: **ausentes**. Cobertura das RFs anteriores segue documentada nos reports respectivos; não é transferida para RF09.
- CI/CD: `.github/workflows/ci.yml` existe; [run remoto `36065884933`](https://github.com/leonardodecuritiba/luciluci-support-ms/actions/runs/36065884933), evento da PR #8, job `quality`, head `ab43d4e`, conclusão `success`. Não há run RF09.
- Validação deste checkpoint: conferir `git diff --check` e formato documental após edição. Sem build, PostgreSQL ou seed, pois não houve mudança de runtime.

# 10. Divergências e decisões RF09

## 10.1 Documentação prevê, código não comprova

RF09 consta em PRD/TDD/TP, mas não há GET por ID em route, controller, OpenAPI, `api.http` ou testes. Ausência planejada até freeze contratual, sem classificação de regressão.

## 10.2 Código existe, documentação não comprova

Nenhuma divergência nova encontrada neste recorte. Padrões de RF06–RF08 são implementações reais, porém suas decisões específicas não congelam RF09.

## 10.3 `ACTUAL_STATE.md` afirma, código não comprova

O estado anterior à PR #8 descrevia RF08 fora de `main`; foi atualizado neste checkpoint conforme merge observado. Nenhuma afirmação de runtime RF09 é feita.

## 10.4 PRD / TDD / TP divergem entre si

Não há contradição funcional identificada: o PRD descreve RF09, o TDD marca o contrato transversal pendente e o TP planeja casos condicionados às decisões. O PRD original não foi alterado.

## 10.5 Ambiguidades que impedem conclusão segura

| Decisão    | Fato recebido                                                                                                     | Escolha a registrar para RF09                                                                                  | Estado          |
| ---------- | ----------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | --------------- |
| DEC-SUP-01 | §5.2 define papéis/ACL, mas `X-Caller-*` é sugestão; RF06–RF08 adotaram `X-Performed-By*` apenas em seus recortes | Confirmar família de headers, roles literais e fronteira BFF/Support para RF09                                 | `OPEN_FOR_RF09` |
| DEC-SUP-08 | RF09 retorna todos os campos; §5.2 permite `403` ou `404` na negação                                              | Fixar status de sucesso, projeção exata, `403`/`404` para ACL, erros de header, path, query/body e inexistente | `OPEN_FOR_RF09` |
| DEC-SUP-09 | Ticket interno é UUID v4 nas RFs anteriores; atores externos são opacos                                           | Confirmar validação UUID v4 de `ticketId` e ID externo opaco no ownership RF09                                 | `OPEN_FOR_RF09` |

Proposta técnica para decisão, **ainda não aprovada**: `X-Correlation-ID`, `X-Performed-By`, `X-Performed-By-Type=admin|backoffice|cd`; Ticket UUID v4 e ator opaco; `200` com os onze campos de Ticket, sem expansão; `400` para headers inválidos, `403` para ACL negada, `404` para Ticket inexistente, `422` para UUID/query/body inválidos e `500` inesperado. Consultar membership atual mesmo com Department inativo; requester dono independe de `origin`. Não há paginação, idempotência de escrita, auditoria ou evento nesta leitura.

# 11. Conclusão e próximo passo

`MAIN_BASELINE_RF08` está integrada e o gitlink 0.10 permanece limpo. O contrato RF09 ainda depende de DEC-SUP-01/08/09; não publicar Support 0.11 nem implementar GET por ID a partir de precedentes isolados. Próxima ação: decidir a linha proposta acima ou registrar ajustes explícitos, então congelar o contrato RF09 no repositório canônico antes da branch funcional.
