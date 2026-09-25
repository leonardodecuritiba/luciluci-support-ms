# REPORT — Fechamento contratual RF09 do support-ms

- **status:** `RF09_CONTRACT_CHECKPOINT_READY / RF09_CONTRACT_FROZEN_LOCAL / PUBLICATION_PENDING`
- **generated_by:** Codex
- **generated_at:** 2026-09-25T12:55:28Z
- **review_mode:** final
- **microservice:** support-ms
- **repository_ref:** `codex/support-rf09-contract-checkpoint` sobre `MAIN_BASELINE_RF08`/`45be90318bdb71e67532482364933cb49e6660e9`; checkpoint `dd3f65ccf5ba535e97fc8dbbd3ca82f8684d10f6`
- **documentation_ref:** `luciluci-docs/support/{README,prd,notes,tdd,tp}.md`, Support 0.11 local `a198b46c62d4b5cd1a4aa0ced8eb171b2e6ef3b2`
- **report_file:** `docs/reports/REPORT-SUPPORT-RF09-CONTRACT-20260925-125528.md`
- **reviewer:** não informado; aprovação explícita da proposta RF09 pelo usuário em 2026-09-25

---

# 1. Resumo executivo

- O PRD contém 14 operações: RF01–RF13 com RF07a/RF07b separadas. RF01–RF08 estão integradas em `MAIN_BASELINE_RF08`; RF09–RF13 não têm runtime.
- A aprovação explícita da proposta do [checkpoint RF09](REPORT-SUPPORT-RF09-CHECKPOINT-20260924-223334.md) fechou DEC-SUP-01/08/09 somente para `GET /api/support/tickets/{ticketId}`. Support 0.11 foi commitado no repositório canônico local em `a198b46c62d4b5cd1a4aa0ced8eb171b2e6ef3b2`; o gitlink desta branch aponta a esse SHA. A fonte original não mudou.
- A revisão automática rejeitou o push para `git@github.com:lucilucitecnologia/luciluci-docs.git`, pois a aprovação do contrato não foi considerada autorização para publicar documentos nesse remoto. O SHA 0.11 **não tem publicação remota comprovada**. Nenhuma branch do serviço foi publicada, nenhuma PR RF09 foi aberta, e nenhum runtime foi iniciado.
- Veredito: contrato aprovado e congelado localmente, com publicação canônica pendente. O checkpoint bloqueado anterior permanece histórico.

# 2. Escopo e fontes analisadas

- Autoridade: `luciluci-docs/support/sources/prd-original.md` (SHA-256 `7d5e26647bcecc93cfb9df52d5c87bfa882e9d140ceb55632d527e15fa5b1c03` antes/depois), `luciluci-docs/support/{README,prd,notes,tdd,tp,dependencies}.md`, aprovação do usuário e checkpoint RF09 `dd3f65c`.
- Estado do serviço: `AGENTS.md`, `AI_FIRST.md`, `ACTUAL_STATE.md`, `README.md`, `DRIFT_REPORT.md`, `docs/README.md`, política de branches, `src/README.md`, `tests/README.md` e reports RF08/RF09.
- Limite executável: `src/features/ticket/adapters/routes/ticket.routes.ts`, `src/shared/openapi/swagger.ts`, `docs/openapi/v1/support-api.json`, `api.http`, `tests/**` e `.github/workflows/ci.yml`. Inspeção estrutural; nenhum arquivo de runtime alterado.
- Método de report: `docs/reports/REPORT-TEMPLATE.md`, `.codex/skills/report-review.md` e `docs/prompts/report-completeness-prompt.md`.
- Git canônico: estado limpo antes da branch, `git fetch origin --prune`, SHA local/remoto 0.10 coincidente em `93edf66d6ed0002a2af537339da315db1285a779`, branch `docs/support-rf09-get-ticket-contract` criada sem `--remote`; commit local 0.11 em `a198b46`. Tentativa de `git push -u origin docs/support-rf09-get-ticket-contract` rejeitada pela revisão automática **antes da execução**. Não atribuir push ou CI remota a este lote.

# 3. Matriz principal RF x implementação

| RF    | Contrato                | Runtime        | Evidência                                        |
| ----- | ----------------------- | -------------- | ------------------------------------------------ |
| RF01  | congelado antes de 0.11 | Implementado   | report RF01; `src/features/department/**`        |
| RF02  | congelado antes de 0.11 | Implementado   | report RF02; `src/features/department/**`        |
| RF03  | congelado antes de 0.11 | Implementado   | report RF03; `src/features/department/**`        |
| RF04  | congelado antes de 0.11 | Implementado   | report RF04; `src/features/department/**`        |
| RF05  | Support 0.7             | Implementado   | report RF05; `src/features/ticket/**`            |
| RF06  | Support 0.8             | Implementado   | report RF06; `PATCH /tickets/{ticketId}`         |
| RF07a | Support 0.9             | Implementado   | report RF07; GET requester                       |
| RF07b | Support 0.9             | Implementado   | report RF07; GET admin                           |
| RF08  | Support 0.10            | Implementado   | report RF08; PR #8 integrada                     |
| RF09  | Support 0.11 local      | Não encontrado | PRD/TDD/TP atualizados; GET por ID ainda ausente |
| RF10  | pendente                | Não encontrado | Fora do recorte                                  |
| RF11  | pendente                | Não encontrado | Fora do recorte                                  |
| RF12  | pendente                | Não encontrado | Fora do recorte                                  |
| RF13  | pendente                | Não encontrado | Fora do recorte                                  |

# 4. Checklist consolidado por PRD

- [x] Preservados método/path, ACL §5.2, retorno de todos os campos de Ticket e ausência de AuditLog da fonte. `Department.type` não governa acesso; tickets históricos em Department inativo continuam funcionando.
- [x] Complemento aprovado distingue fonte de decisão posterior: headers, UUID v4 de Ticket, identidade externa opaca, `403` para negação, `200` com onze campos, erros `400/404/422/500` e GET sem query/body.
- [x] `sources/prd-original.md` preservado byte a byte; RF10–RF13 não recebem decisões por inferência.
- [ ] Nenhuma destas regras foi implementada no runtime RF09 neste lote.

# 5. Checklist consolidado por TDD

- [x] Admin lê somente com membership **atual** em `allowedUserIds` do Department do Ticket, mesmo inativo. Solicitante `backoffice|cd` lê somente o próprio Ticket, sem comparar role com `origin`.
- [x] `X-Correlation-ID` UUID válido, `X-Performed-By` opaco não vazio e `X-Performed-By-Type=admin|backoffice|cd`; `X-Caller-*` não é alias. AuthN ampla permanece no BFF.
- [x] Response exato: `id,number,subject,requesterId,departmentId,priority,origin,adminStatus,requesterStatus,createdAt,updatedAt`, sem expansão, escrita, auditoria ou evento.
- [x] Matriz HTTP: `400` headers, `403` ACL, `404` inexistente, `422` UUID/query/body, `500` inesperado. Sem `401`/`409` local.
- [ ] Nenhuma rota, migration, OpenAPI executável ou `api.http` RF09 criada.

# 6. Checklist consolidado por TP

- [x] `TC-SUP-RF09` agora planeja dono/admin autorizado, Department inativo, role/origin diferentes, campos exatos, ACL negada, validação, inexistência e ausência de efeitos.
- [ ] Nenhum caso RF09 unitário, de integração, contrato ou funcional foi executado. `PLANNED / NOT_RUN` não é prova.

## 6.1 Matriz RF → unit/integration/functional

| RF    | Unit                                                       | Integration                                              | Functional                       | Limite                       |
| ----- | ---------------------------------------------------------- | -------------------------------------------------------- | -------------------------------- | ---------------------------- |
| RF01  | `tests/unit/department/create-department.use-case.spec.ts` | `tests/integration/department/create-department.spec.ts` | `scripts/prove-rf01-postgres.js` | report RF01; histórico       |
| RF02  | `tests/unit/department/update-department.use-case.spec.ts` | `tests/integration/department/update-department.spec.ts` | `scripts/prove-rf02-postgres.js` | report RF02; histórico       |
| RF03  | `tests/unit/department/list-departments.use-case.spec.ts`  | `tests/integration/department/list-departments.spec.ts`  | `scripts/prove-rf03-postgres.js` | report RF03; histórico       |
| RF04  | `tests/unit/department/delete-department.use-case.spec.ts` | `tests/integration/department/delete-department.spec.ts` | `scripts/prove-rf04-postgres.js` | report RF04; histórico       |
| RF05  | `tests/unit/ticket/create-ticket.use-case.spec.ts`         | `tests/integration/ticket/create-ticket.spec.ts`         | `scripts/prove-rf05-postgres.js` | report RF05; histórico       |
| RF06  | `tests/unit/ticket/update-ticket.use-case.spec.ts`         | `tests/integration/ticket/update-ticket.spec.ts`         | `scripts/prove-rf06-postgres.js` | report RF06; histórico       |
| RF07a | `tests/unit/ticket/list-tickets.use-case.spec.ts`          | `tests/integration/ticket/list-tickets.spec.ts`          | `scripts/prove-rf07-postgres.js` | casos requester; report RF07 |
| RF07b | `tests/unit/ticket/list-tickets.use-case.spec.ts`          | `tests/integration/ticket/list-tickets.spec.ts`          | `scripts/prove-rf07-postgres.js` | casos admin; report RF07     |
| RF08  | `tests/unit/ticket/resolve-ticket.use-case.spec.ts`        | `tests/integration/ticket/resolve-ticket.spec.ts`        | `scripts/prove-rf08-postgres.js` | report RF08; CI da PR #8     |
| RF09  | ausente                                                    | ausente                                                  | `TC-SUP-RF09` planejado          | Não iniciado                 |
| RF10  | ausente                                                    | ausente                                                  | TP planejado                     | Fora do recorte              |
| RF11  | ausente                                                    | ausente                                                  | TP planejado                     | Fora do recorte              |
| RF12  | ausente                                                    | ausente                                                  | TP planejado                     | Fora do recorte              |
| RF13  | ausente                                                    | ausente                                                  | TP planejado                     | Fora do recorte              |

# 7. Inventário de endpoints reais

`src/features/ticket/adapters/routes/ticket.routes.ts` continua com POST `/`, GET `/requester/:requesterId`, GET `/admin/:adminId`, PATCH `/:ticketId` e POST `/:ticketId/resolve`. Não há GET `/:ticketId`. O OpenAPI executável e `api.http` continuam até RF08. Operacionais `/health`, `/metrics`, `/api-docs`, `/api-docs-json` e OPTIONS não são RF09.

# 8. Fronteira NFR e capacidades transversais

| Capacidade                                           | Classificação                               | Limite                                     |
| ---------------------------------------------------- | ------------------------------------------- | ------------------------------------------ |
| Correlação, envelope de erro, OpenAPI, PostgreSQL    | implementado localmente para RFs existentes | RF09 requer código/prova próprios          |
| Autenticação e RBAC amplo                            | upstream/plataforma                         | BFF envia identidade confiável             |
| ACL fina por Ticket                                  | compartilhado BFF/Support                   | Support aplica membership/ownership RF09   |
| OpenTelemetry, DLQ/redrive e Schema Registry externo | upstream/plataforma                         | Sem novo requisito RF09                    |
| Mensageria/evento/auditoria de leitura               | fora do escopo desta release                | PRD não especifica efeito RF09             |
| Rota RF09 ausente                                    | gap real local futuro                       | Esperado no lote exclusivamente documental |

# 9. Cobertura de testes e validação

- Nenhum teste, build, migration, prova PostgreSQL, seed ou HTTP RF09 foi executado. Não há percentual de cobertura RF09 medido.
- Verificações documentais: `git diff --check` e Prettier `--check` dos cinco arquivos canônicos e dos arquivos alterados no serviço passaram; `git -C luciluci-docs show --check HEAD` passou; SHA-256 da fonte original permaneceu `7d5e2664...`.
- CI remota: o run `36065884933` da PR #8 comprovou o head RF08 anterior, não Support 0.11 nem RF09. Nenhum run remoto deste lote foi observado.
- Publicação: push canônico rejeitado pela revisão automática antes da execução. Motivo informado: destino remoto cuja confiança/ownership não foi estabelecida e aprovação do contrato insuficiente para autorizar essa publicação. Não foi tentada via alternativa indireta.

# 10. Divergências e decisões RF09

## 10.1 Documentação prevê, código não comprova

O GET RF09 está documentado e congelado no commit local 0.11, mas ausente de route/controller/OpenAPI/api.http/testes. Esperado até lote de implementação; não é regressão de RF01–RF08.

## 10.2 Código existe, documentação não comprova

Nenhuma divergência nova neste recorte. Precedentes RF06–RF08 não substituem a decisão agora registrada da RF09.

## 10.3 `ACTUAL_STATE.md` afirma, código não comprova

O estado declara expressamente RF09 `NOT_IMPLEMENTED`; a afirmação é consistente com o inventário. O gitlink aponta a commit local 0.11, cuja publicação remota permanece pendente.

## 10.4 PRD / TDD / TP divergem entre si

Nenhuma contradição funcional encontrada após o complemento 0.11. O PRD original permanece preservado; PRD transposto, TDD, TP e `notes.md` registram a mesma decisão apenas para RF09.

## 10.5 Ambiguidades que impedem conclusão segura

DEC-SUP-01/08/09 estão resolvidas para RF09. O bloqueio remanescente é operacional: sem SHA canônico comprovado remotamente, outro checkout não reproduz o gitlink. RF10–RF13 seguem com decisões próprias abertas. Não afirmar runtime, CI ou produção RF09.

# 11. Conclusão e próximo passo

`RF09_CONTRACT_CHECKPOINT_READY / RF09_CONTRACT_FROZEN_LOCAL`. A publicação do commit canônico `a198b46c62d4b5cd1a4aa0ced8eb171b2e6ef3b2` exige autorização específica após a rejeição automática. Depois de publicar e verificar `ls-remote`, publicar a branch do serviço com o gitlink e revisar o checkpoint; somente então abrir o lote funcional RF09 em branch própria a partir de `MAIN_BASELINE_RF08` com contrato 0.11 acessível.
