# REPORT — Checkpoint contratual RF08 do support-ms

- **status:** `RF08_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION`
- **generated_by:** Codex
- **generated_at:** 2026-09-24T20:11:49Z
- **review_mode:** final
- **microservice:** support-ms
- **repository_ref:** `docs/support-rf08-resolve-ticket-contract` sobre `main`/`43a556ab1c70f5de9a63e3e6ab651445fa462173`
- **documentation_ref:** `luciluci-docs/support/{README,prd,notes,tdd,tp,dependencies}.md`, Support 0.9 `1583a586793437a7b7c0569581637ee8ddac5ae5`
- **report_file:** `docs/reports/REPORT-SUPPORT-RF08-CHECKPOINT-20260924-201149.md`
- **reviewer:** não informado

---

# 1. Resumo executivo

- O PRD contém 14 operações: RF01–RF13 com RF07a/RF07b distintas. Oito estão implementadas/provadas (RF01–RF07b); seis não têm runtime (RF08–RF13). Nenhuma é parcial neste lote.
- `main` e `origin/main` apontam para `43a556ab1c70f5de9a63e3e6ab651445fa462173`, merge da PR #7 e `MAIN_BASELINE_RF07`. O gitlink Support 0.9 é `1583a586793437a7b7c0569581637ee8ddac5ae5`.
- A [PR #7](https://github.com/leonardodecuritiba/luciluci-support-ms/pull/7) foi integrada após o check `quality` do head conciliado: [run `36049802944`](https://github.com/leonardodecuritiba/luciluci-support-ms/actions/runs/36049802944), sucesso. A página mostrou `No reviews`. Isso é discrepância processual histórica, sem reabrir RF07.
- A fonte determina path, ownership, mudança exclusiva de `requesterStatus` e `alteracao_status`. Não determina body, response nem semântica de repetição. Esses pontos alteram efeitos observáveis e impedem Support 0.10. **Veredito: `RF08_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION`.**
- Superfícies `/health`, `/metrics`, `/api-docs`, `/api-docs-json` e OPTIONS são operacionais, não RFs.

# 2. Escopo e fontes analisadas

- Fonte funcional: `luciluci-docs/support/sources/prd-original.md` §§2.2, 2.4, 4, 5 e RF08, preservada intacta; transposição `luciluci-docs/support/{README,prd,notes,tdd,tp,dependencies}.md` na revisão fixa 0.9.
- Serviço: `AGENTS.md`, `AI_FIRST.md`, `ACTUAL_STATE.md`, `DRIFT_REPORT.md`, `README.md`, `docs/README.md`, `docs/workflows/support-development-branch-policy.md`, `service-identity.json`, `src/README.md`, `tests/README.md`, `docs/reports/README.md` e reports RF05–RF07.
- Inventário do limite de runtime: `src/features/ticket/adapters/routes/ticket.routes.ts`, `src/shared/openapi/swagger.ts`, `docs/openapi/v1/support-api.json`, `api.http`, `tests/**`, `scripts/prove-rf07-postgres.js` e `.github/workflows/ci.yml`. Inspeção estrutural, sem prova RF08.
- Método de report: `.codex/skills/report-review.md`, `docs/prompts/report-completeness-prompt.md` e `docs/reports/REPORT-TEMPLATE.md`.
- Git: `git fetch origin --prune`; `main`, `origin/main` e HEAD inicial coincidiram em `43a556a`. Worktree documental isolada, submódulo inicializado apenas no gitlink fixado, sem `--remote`. Nenhuma branch funcional RF08 criada.
- CI/CD: workflow versionado `.github/workflows/ci.yml`; run remoto da PR #7 `36049802944` aprovado no head de conciliação `f5b991fb71a0f869e09ffcd87d2d4d29749232e7`, antes do merge `43a556a`. Nenhum run ou teste novo de RF08 é atribuído a esse resultado.

# 3. Matriz principal RF x implementação

| RF    | Endpoint/tema                                            | Fonte          | Estado no serviço | Evidência                                                 |
| ----- | -------------------------------------------------------- | -------------- | ----------------- | --------------------------------------------------------- |
| RF01  | POST departments                                         | PRD/TDD/TP     | Implementado      | `src/features/department/**`; report RF01                 |
| RF02  | PATCH departments                                        | PRD/TDD/TP     | Implementado      | `src/features/department/**`; report RF02                 |
| RF03  | GET departments                                          | PRD/TDD/TP     | Implementado      | `src/features/department/**`; report RF03                 |
| RF04  | DELETE departments                                       | PRD/TDD/TP     | Implementado      | `src/features/department/**`; report RF04                 |
| RF05  | POST tickets                                             | PRD/TDD/TP     | Implementado      | `src/features/ticket/**`; report RF05                     |
| RF06  | PATCH tickets/{ticketId}                                 | PRD/TDD/TP 0.8 | Implementado      | Ticket update; report RF06                                |
| RF07a | GET tickets/requester/{requesterId}                      | PRD/TDD/TP 0.9 | Implementado      | Ticket listing; report RF07; PR #7                        |
| RF07b | GET tickets/admin/{adminId}                              | PRD/TDD/TP 0.9 | Implementado      | Ticket listing; report RF07; PR #7                        |
| RF08  | POST tickets/{ticketId}/resolve                          | PRD/TDD/TP     | Não encontrado    | fonte parcial; rota, OpenAPI executável e testes ausentes |
| RF09  | GET tickets/{ticketId}                                   | PRD/TDD/TP     | Não encontrado    | fora do recorte                                           |
| RF10  | POST tickets/{ticketId}/messages                         | PRD/TDD/TP     | Não encontrado    | fora do recorte                                           |
| RF11  | PATCH tickets/{ticketId}/messages/{messageId}/visibility | PRD/TDD/TP     | Não encontrado    | fora do recorte                                           |
| RF12  | GET tickets/{ticketId}/messages                          | PRD/TDD/TP     | Não encontrado    | fora do recorte                                           |
| RF13  | GET tickets/history                                      | PRD/TDD/TP     | Não encontrado    | fora do recorte                                           |

# 4. Checklist consolidado por PRD

- [x] RF08 é `POST /api/support/tickets/{ticketId}/resolve`, ação exclusiva do solicitante dono; `admin` não ganha acesso por `allowedUserIds`.
- [x] A operação altera somente `requesterStatus` de `nao_resolvido` para `resolvido`; `adminStatus` é independente. O evento efetivo gera `alteracao_status`, `statusType=requester`, `newStatus=resolvido`.
- [x] Ticket histórico em Department inativo continua funcional (P1); RF08 não seleciona um Department novo.
- [ ] O PRD não fornece request body, response nem regra para repetição sobre estado `resolvido`; nenhum desses candidatos foi convertido em fonte original.
- [ ] Não há autorização para Support 0.10 ou implementação RF08 neste checkpoint.

# 5. Checklist consolidado por TDD

- [x] A família `X-Correlation-ID`, `X-Performed-By` e `X-Performed-By-Type` foi materializada em RF06/RF07; solicitante `backoffice|cd` deve provar ownership pelo ID opaco de ator. Role diferente de `ticket.origin` não invalida ownership na fonte.
- [x] `Ticket.id` interno é UUID v4 pela baseline RF05/RF06; ID externo de solicitante permanece opaco. UUID inválido candidato `422`, inexistente candidato `404`.
- [~] Lock de Ticket `FOR UPDATE`, revalidação de ownership após lock e transação para mudança + AuditLog são coerentes com RF06 e com integridade exigida. Concorrência RF08×RF08 e RF06×RF08 requer a semântica de no-op e auditoria fechada antes do freeze.
- [ ] Sem body, response e repetição decididos, não há contrato HTTP executável completo. Não alterar migration, OpenAPI, `api.http`, rotas ou eventos.

# 6. Checklist consolidado por TP

- [x] `TC-SUP-RF08` planeja dono, negação a admin/não dono, independência de `adminStatus` e auditoria requester.
- [~] Após decisão, planejar casos para body vazio/extra, idempotência por estado, `updatedAt`, cardinalidade de AuditLog, rollback, lock e concorrência RF08×RF08/RF06×RF08, Department inativo e matriz HTTP.
- [ ] Nenhum caso RF08 unitário, de integração, contrato ou funcional foi criado ou executado. TP planejado não é evidência.

## 6.1 Matriz RF → unit/integration/functional

| RF    | Unit                                                       | Integration                                              | Functional                       | Agrupamento / limite                                      | Estado        |
| ----- | ---------------------------------------------------------- | -------------------------------------------------------- | -------------------------------- | --------------------------------------------------------- | ------------- |
| RF01  | `tests/unit/department/create-department.use-case.spec.ts` | `tests/integration/department/create-department.spec.ts` | `scripts/prove-rf01-postgres.js` | Report RF01; não reexecutado                              | histórica     |
| RF02  | `tests/unit/department/update-department.use-case.spec.ts` | `tests/integration/department/update-department.spec.ts` | `scripts/prove-rf02-postgres.js` | Report RF02; não reexecutado                              | histórica     |
| RF03  | `tests/unit/department/list-departments.use-case.spec.ts`  | `tests/integration/department/list-departments.spec.ts`  | `scripts/prove-rf03-postgres.js` | Report RF03; não reexecutado                              | histórica     |
| RF04  | `tests/unit/department/delete-department.use-case.spec.ts` | `tests/integration/department/delete-department.spec.ts` | `scripts/prove-rf04-postgres.js` | Report RF04; não reexecutado                              | histórica     |
| RF05  | `tests/unit/ticket/create-ticket.use-case.spec.ts`         | `tests/integration/ticket/create-ticket.spec.ts`         | `scripts/prove-rf05-postgres.js` | Report RF05; não reexecutado                              | histórica     |
| RF06  | `tests/unit/ticket/update-ticket.use-case.spec.ts`         | `tests/integration/ticket/update-ticket.spec.ts`         | `scripts/prove-rf06-postgres.js` | Report RF06; não reexecutado                              | histórica     |
| RF07a | `tests/unit/ticket/list-tickets.use-case.spec.ts`          | `tests/integration/ticket/list-tickets.spec.ts`          | `scripts/prove-rf07-postgres.js` | Asserções requester compartilhadas com RF07b; report RF07 | histórica     |
| RF07b | `tests/unit/ticket/list-tickets.use-case.spec.ts`          | `tests/integration/ticket/list-tickets.spec.ts`          | `scripts/prove-rf07-postgres.js` | Asserções admin compartilhadas com RF07a; report RF07     | histórica     |
| RF08  | ausente                                                    | ausente                                                  | `TC-SUP-RF08` apenas planejado   | Nenhuma evidência executável                              | não executado |
| RF09  | ausente                                                    | ausente                                                  | TP apenas planejado              | Fora do recorte                                           | não iniciado  |
| RF10  | ausente                                                    | ausente                                                  | TP apenas planejado              | Fora do recorte                                           | não iniciado  |
| RF11  | ausente                                                    | ausente                                                  | TP apenas planejado              | Fora do recorte                                           | não iniciado  |
| RF12  | ausente                                                    | ausente                                                  | TP apenas planejado              | Fora do recorte                                           | não iniciado  |
| RF13  | ausente                                                    | ausente                                                  | TP apenas planejado              | Fora do recorte                                           | não iniciado  |

# 7. Inventário de endpoints reais

RF01–RF04 usam `/api/support/departments`; RF05 expõe `POST /api/support/tickets`; RF06, `PATCH /api/support/tickets/{ticketId}`; RF07a/RF07b, os dois GETs de listagem. `POST /api/support/tickets/{ticketId}/resolve` não está em `src/features/ticket/adapters/routes/ticket.routes.ts`, OpenAPI executável nem `api.http`. O PRD o documenta como futuro. Endpoints operacionais e OPTIONS permanecem separados das RFs.

# 8. Fronteira NFR e capacidades transversais

| Item                                                    | Categoria                    | Evidência / limite                                            |
| ------------------------------------------------------- | ---------------------------- | ------------------------------------------------------------- |
| Correlação, erros HTTP, PostgreSQL e OpenAPI RF01–RF07  | implementado localmente      | Código e provas históricos; não comprovam RF08                |
| AuthN e RBAC amplo                                      | upstream/plataforma          | BFF envia identidade confiável; Support aplica ownership fino |
| Tracing distribuído                                     | compartilhado                | Nenhuma obrigação local nova RF08 foi especificada            |
| Mensageria, DLQ/redrive, Schema Registry e notificações | fora do escopo desta release | Nenhum evento Support foi especificado                        |
| Contrato RF08 incompleto                                | gap real local documental    | Body, repetição, response e efeitos dependentes ainda abertos |

# 9. Cobertura de testes e validação

Este lote é exclusivamente documental. Nenhum teste, build, migration, prova PostgreSQL, seed ou chamada HTTP RF08 foi executado; números dos reports RF01–RF07 são históricos. `git diff --check` e `git -C luciluci-docs diff --check` passaram. A primeira execução de `npm run format:check` apontou apenas este novo report; ele foi formatado com Prettier e a repetição do comando passou. O Prettier já instalado em outra worktree foi usado temporariamente, sem instalação de dependências nem arquivo executável versionado. Não imputar a CI PR #7 à RF08.

# 10. Divergências e decisões RF08

## 10.1 Fonte RF08

| Tema                    | Fonte                                                   | Definição real                                                                            |
| ----------------------- | ------------------------------------------------------- | ----------------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| Método/path             | PRD original RF08; `prd.md` RF08                        | `POST /api/support/tickets/{ticketId}/resolve`                                            |
| Ator                    | PRD original RF08 e §4; `prd.md` §5.2                   | Solicitante dono por igualdade `ticket.requesterId == callerId`; admin não executa        |
| Status                  | PRD original Ticket/RF08; `prd.md` §9.2                 | `requesterStatus=nao_resolvido                                                            | resolvido`; resolver define `resolvido`, sem tocar `adminStatus` |
| AuditLog                | PRD original AuditLog/RF08                              | `alteracao_status`, `statusType=requester`, `newStatus=resolvido`; repetição não definida |
| Department inativo      | P1                                                      | Ticket antigo permanece funcional                                                         |
| Body/response/repetição | ausência na RF08 original; `prd.md` §9.2; `tdd.md` RF08 | Não definidos; candidatos abaixo não são regra da fonte                                   |

## 10.2 Matriz de decisões e natureza

| Tema / DEC-SUP              | Definição ou candidata                                                                                              | Estado RF08                                | Natureza                                                    |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------------ | ----------------------------------------------------------- | ---------------------------- |
| Actor e headers / 01        | `X-Correlation-ID`, `X-Performed-By`, `X-Performed-By-Type`; role `backoffice                                       | cd`; ID opaco não vazio                    | base técnica suficiente; fechamento canônico RF08 pendente  | fonte §4 + família RF06/RF07 |
| Ownership / 01, 09          | `ticket.requesterId == X-Performed-By`; admin e não dono negados; role não precisa igualar `ticket.origin`          | regra funcional clara                      | fonte RF08/§4; ausência de restrição por origin             |
| ticketId / 09, 08           | UUID v4 interno; inválido `422`, inexistente `404`                                                                  | base técnica suficiente                    | padrão local RF05/RF06                                      |
| Body / 08                   | sem campos; ausência de body válida; `{}` possivelmente vazio técnico; extra `422`                                  | `OPEN_FOR_RF08`                            | ausente na fonte; sem precedente específico de POST de ação |
| requesterStatus / fonte     | somente `resolvido`, preservando demais campos                                                                      | regra funcional clara                      | fonte RF08/§9.2                                             |
| No-op / 06                  | já resolvido: `200`, sem write, sem `updatedAt` e sem nova auditoria                                                | `OPEN_FOR_RF08`                            | analogia RF02/RF04/RF06, não decisão RF08                   |
| updatedAt / 06, 08          | transição efetiva renova; no-op preserva                                                                            | dependente do no-op                        | padrão técnico local                                        |
| AuditLog / fonte, 01, 08    | transição efetiva: um `alteracao_status/requester/resolvido`, authorId=callerId, origin=callerRole; no-op zero      | cardinalidade da repetição aberta          | fonte + mapeamento técnico RF06                             |
| Response / 08               | `200` com Ticket completo, também no no-op, sem mensagens/AuditLog/Department expandido                             | `OPEN_FOR_RF08`                            | analogia RF06; PRD RF08 não define                          |
| Department inativo / 12, P1 | não bloquear resolve nem exigir membership                                                                          | regra funcional clara                      | P1 e ownership RF08                                         |
| Lock e transação / 06, 08   | Ticket `FOR UPDATE`, revalidar ownership/status sob lock, update + auditoria atômicos; sem lock Department          | proposta técnica, depende do no-op         | padrão RF06 e integridade                                   |
| Concorrência RF08×RF08 / 06 | duas chamadas podem ter sucesso; uma transição/uma auditoria, segunda no-op após lock                               | `OPEN_FOR_RF08`                            | consequência da proposta de no-op/lock                      |
| Concorrência RF06×RF08 / 06 | serializar no lock Ticket; preservar ambas alterações de status e auditorias efetivas                               | proposta técnica                           | ordem de locks RF06                                         |
| Idempotência / 10           | sem `X-Idempotency-Key` se repetição por estado for segura                                                          | `OPEN_FOR_RF08`                            | depende do no-op; guia diz quando aplicável                 |
| Eventos                     | nenhum evento/outbox/mensageria Support                                                                             | resolvido para ausência de requisito       | fonte não especifica; DEC-SUP-11                            |
| Erros / 08                  | `200` efetivo/no-op; `400` headers/JSON; `403` admin/não dono; `404` inexistente; `422` UUID/body; `500` inesperado | parcial, dependente de body/no-op/response | P8 + envelope local e candidatos                            |

## 10.3 Decisões abertas que bloqueiam o freeze

1. **DEC-SUP-08 — body e response:** aprovar o POST sem payload; decidir precisamente se `{}` é permitido, se qualquer outro conteúdo é `422`, e se sucesso/no-op retornam `200` com Ticket completo ou outro status/shape.
2. **DEC-SUP-06/08 — repetição e auditoria:** definir se Ticket já resolvido retorna sucesso idempotente sem write, `updatedAt` ou AuditLog; confirmar quando `updatedAt` avança e se transição efetiva cria exatamente um registro.
3. **DEC-SUP-10 — idempotência e concorrência:** com no-op aprovado, decidir se não há `X-Idempotency-Key` e congelar lock Ticket, revalidação e resultados RF08×RF08/RF06×RF08. Sem essa decisão, não presumir retry seguro.

DEC-SUP-01/09 têm precedentes materializados e regra funcional clara; não exigem pergunta de produto nova se a família técnica for adotada explicitamente no fechamento RF08. A matriz de erros permanece candidata onde depende dos itens acima. Nenhum `DEC-SUP-*` foi marcado `RESOLVED_FOR_RF08` no submódulo neste checkpoint.

## 10.4 Outras divergências

- Documentação prevê RF08, código não comprova: esperado. `src/README.md` ainda diz que RF07 não tem rota, mas esse texto é legado de baseline anterior e está fora do escopo de edição `src/**` deste lote; código, testes e PR #7 comprovam RF07.
- O PRD original usa `X-Caller-*` como sugestão ajustável; RF06/RF07 materializaram `X-Performed-By*`. Adotar essa família para RF08 requer registro explícito no fechamento, sem alias silencioso.
- O checkpoint não reescreve reports RF05–RF07 nem afirma que planos do TP foram executados.

# 11. Conclusão e próximo passo

**Veredito:** `RF08_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION`. Support 0.10 **não** foi congelado. O gitlink do serviço segue em `1583a586793437a7b7c0569581637ee8ddac5ae5`; não há branch/commit canônico 0.10. `RF08 NOT_IMPLEMENTED`; `feat/support-rf08-resolve-ticket NOT_CREATED`. Nenhum executável foi alterado.

Próximo passo único: resolver somente as três decisões RF08 da seção 10.3, então atualizar `luciluci-docs/support/{README,prd,notes,tdd,tp}.md`, publicar Support 0.10 e só depois abrir lote explícito de implementação RF08.
