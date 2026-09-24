# REPORT — Fechamento contratual RF08 do support-ms

- **status:** `RF08_CONTRACT_CHECKPOINT_READY / RF08_CONTRACT_FROZEN`
- **generated_by:** Codex
- **generated_at:** 2026-09-24T20:31:48Z
- **review_mode:** final
- **microservice:** support-ms
- **repository_ref:** `docs/support-rf08-resolve-ticket-contract` sobre `main`/`43a556ab1c70f5de9a63e3e6ab651445fa462173`; checkpoint histórico `a8714a86b5b67e9a7e7fafaf194991b0e078e9cb`
- **documentation_ref:** `luciluci-docs/support/{README,prd,notes,tdd,tp}.md`, Support 0.10 `93edf66d6ed0002a2af537339da315db1285a779`
- **report_file:** `docs/reports/REPORT-SUPPORT-RF08-CONTRACT-20260924-203148.md`
- **reviewer:** não informado

---

# 1. Resumo executivo

- O PRD contém 14 operações: RF01–RF13 com RF07a/RF07b distintas. Oito (RF01–RF07b) estão implementadas/provadas historicamente; seis (RF08–RF13) não têm runtime. Nenhuma RF foi implementada neste lote.
- A revisão canônica Support 0.10 fecha exclusivamente RF08. O commit `93edf66d6ed0002a2af537339da315db1285a779` foi publicado em `origin/docs/support-rf08-resolve-ticket-contract`; `ls-remote` retornou o mesmo SHA local.
- O checkpoint RF08 bloqueado, commit `a8714a86b5b67e9a7e7fafaf194991b0e078e9cb`, permanece intacto. As decisões posteriores resolveram body, response, no-op, timestamp, auditoria, ator/ownership, Department inativo, locks, concorrência, idempotência e erros.
- `RF08 NOT_IMPLEMENTED`; `feat/support-rf08-resolve-ticket NOT_CREATED`. Nenhuma prova RF08, CI nova ou aprovação humana foi observada.
- Superfícies `/health`, `/metrics`, `/api-docs`, `/api-docs-json` e OPTIONS são operacionais, não RFs.

# 2. Escopo e fontes analisadas

- Fonte preservada: `luciluci-docs/support/sources/prd-original.md`, SHA-256 `7d5e26647bcecc93cfb9df52d5c87bfa882e9d140ceb55632d527e15fa5b1c03` antes/depois. Transposição e decisões: `luciluci-docs/support/{README,prd,notes,tdd,tp}.md`.
- Serviço: `AGENTS.md`, `AI_FIRST.md`, `ACTUAL_STATE.md`, `DRIFT_REPORT.md`, `README.md`, `docs/README.md`, política de branch e reports RF07/RF08. Método: `.codex/skills/report-review.md`, `docs/reports/REPORT-TEMPLATE.md` e `docs/prompts/report-completeness-prompt.md`.
- Limite de runtime inspecionado estruturalmente: `src/features/ticket/adapters/routes/ticket.routes.ts`, `docs/openapi/v1/support-api.json`, `api.http`, `tests/**`, `scripts/**` e `.github/workflows/ci.yml`. Nenhum foi alterado.
- Evidência remota histórica RF07: PR #7, merge `43a556ab1c70f5de9a63e3e6ab651445fa462173`, run `36049802944` concluído com sucesso. Nenhuma CI deste fechamento documental ou execução RF08 é atribuída àquela prova.

# 3. Matriz principal RF x implementação

| RF          | Contrato                         | Runtime        | Evidência                                   |
| ----------- | -------------------------------- | -------------- | ------------------------------------------- |
| RF01–RF06   | Congelado em recortes anteriores | Implementado   | Reports RF01–RF06; provas históricas        |
| RF07a/RF07b | Support 0.9 congelado            | Implementado   | Report RF07 e PR #7 integrada               |
| RF08        | Support 0.10 congelado           | Não encontrado | TP planejado; sem rota, teste ou prova RF08 |
| RF09–RF13   | Pendente                         | Não encontrado | Fora deste recorte                          |

Não há classificação parcial ou ambígua de runtime neste fechamento. A matriz não converte planejamento em prova.

# 4. Checklist consolidado por PRD

- [x] Preservados path, exclusividade do solicitante dono, mudança apenas de `requesterStatus` e `alteracao_status` de requester da fonte.
- [x] Decisões posteriores explicitadas como complementos RF08: POST sem body (qualquer body, inclusive `{}`, `422`); transição e no-op `200` com Ticket completo; no-op sem write, timestamp ou AuditLog.
- [x] Admin e não dono `403`; role `backoffice|cd` não precisa igualar `ticket.origin`. Department inativo não bloqueia.
- [x] Fonte original preservada byte a byte. Nenhuma decisão foi estendida a RF09–RF13.

# 5. Checklist consolidado por TDD

- [x] Headers `X-Correlation-ID` UUID, `X-Performed-By` opaco e `X-Performed-By-Type=backoffice|cd`; AuthN ampla permanece no BFF.
- [x] Ticket UUID v4; inexistente `404`, ID inválido `422`. Erros `400/403/404/422/500`; sem `401` ou `409` local.
- [x] Ticket `FOR UPDATE`, revalidação de ownership/status sob lock, update + único AuditLog atômicos; rollback conjunto na falha da auditoria.
- [x] RF08×RF08 e RF06×RF08 serializam sem lost update; `updatedAt` reflete última mutação efetiva. Sem idempotency key, evento, outbox ou mensageria.
- [ ] Nenhuma destas regras tem código ou prova RF08 neste lote documental.

# 6. Checklist consolidado por TP

- [x] `TC-SUP-RF08` planeja dono `backoffice|cd`, origin diferente, Department inativo, body ausente/presente, resposta completa, no-op e erros.
- [x] Planeja rollback da auditoria, RF08×RF08 e RF06×RF08 com lock e cardinalidade de efeitos.
- [ ] `TC-SUP-RF08` está `CONTRACT_FROZEN / PLANNED / NOT_RUN`; nenhum teste RF08 executado.

| RF          | Unit                                              | Integration                                     | Functional/contrato                     | Estado                                |
| ----------- | ------------------------------------------------- | ----------------------------------------------- | --------------------------------------- | ------------------------------------- |
| RF01–RF06   | Reports e suítes históricos                       | PostgreSQL histórico por recorte                | Provas/processo e OpenAPI históricos    | Implementado/provado antes deste lote |
| RF07a/RF07b | `tests/unit/ticket/list-tickets.use-case.spec.ts` | `tests/integration/ticket/list-tickets.spec.ts` | `scripts/prove-rf07-postgres.js`; PR #7 | Implementado/provado antes deste lote |
| RF08        | `UT-SUP-RF08` planejado                           | `INT-SUP-RF08` planejado                        | `FU-SUP-06`, `CT-SUP-RF08` planejados   | Nenhum executado                      |
| RF09–RF13   | TP planejado                                      | TP planejado                                    | TP planejado                            | Fora do recorte                       |

# 7. Inventário de endpoints reais

RF01–RF04 usam `/api/support/departments`; RF05 expõe `POST /api/support/tickets`; RF06, `PATCH /api/support/tickets/{ticketId}`; RF07a/RF07b, os dois GETs de listagem. `POST /api/support/tickets/{ticketId}/resolve` está somente no contrato canônico, ausente da rota real, OpenAPI executável e `api.http`.

# 8. Fronteira NFR e capacidades transversais

| Item                                                         | Categoria                    | Evidência / limite                                     |
| ------------------------------------------------------------ | ---------------------------- | ------------------------------------------------------ |
| Correlação, envelope de erro, PostgreSQL e OpenAPI RF01–RF07 | Implementado localmente      | Código/provas históricos; não comprovam RF08           |
| AuthN e RBAC amplo                                           | Upstream/plataforma          | BFF provê identidade; Support fará ownership fino RF08 |
| Tracing distribuído                                          | Compartilhado                | Nenhuma obrigação local nova neste contrato            |
| Mensageria, DLQ/redrive, Schema Registry                     | Fora do escopo desta release | Sem evento Support especificado                        |
| Runtime RF08 ausente                                         | Gap real local futuro        | Esperado para lote exclusivamente documental           |

# 9. Cobertura de testes e validação

Este lote não executou teste, build, migration, prova PostgreSQL, seed ou HTTP RF08. O SHA canônico local/remoto foi conferido por `rev-parse`/`ls-remote`; a fonte original foi conferida por SHA-256. `git diff --check`, `git -C luciluci-docs diff --check` e `npm run format:check` passaram; o Prettier instalado em outra worktree foi usado temporariamente, sem instalação de dependências nem arquivo executável versionado. `git -C luciluci-docs show --check HEAD` passou; `git show --check HEAD` do serviço será executado após o commit deste report. Nenhum número de cobertura histórica é atribuído à RF08. Não há CI remota nova comprovada para este lote.

# 10. Divergências e decisões RF08

O checkpoint histórico listou body, response e repetição como abertas. A decisão expressa posterior congelou ausência estrita de body, `200` com Ticket completo e no-op sem efeitos. DEC-SUP-01/06/08/09/10/12 estão `RESOLVED_FOR_RF08` apenas para esta ação; DEC-SUP-11 é `NOT_APPLICABLE_RF08`. O PRD original sugeria `X-Caller-*`; Support 0.10 registra a família `X-Performed-By*` materializada nas RFs anteriores, sem alias. `src/README.md` contém fotografia antiga de RF07; permanece fora do escopo de edição `src/**`. Não foi encontrada contradição material nova.

# 11. Conclusão e próximo passo

**Veredito:** `RF08_CONTRACT_CHECKPOINT_READY / RF08_CONTRACT_FROZEN`. Support 0.10 foi publicado em `93edf66d6ed0002a2af537339da315db1285a779`; o gitlink desta branch aponta para essa revisão. `RF08 NOT_IMPLEMENTED`; `feat/support-rf08-resolve-ticket NOT_CREATED`. Próximo passo: abrir lote explícito de implementação RF08 em `feat/support-rf08-resolve-ticket` a partir de `MAIN_BASELINE_RF07`, com testes e provas próprias.
