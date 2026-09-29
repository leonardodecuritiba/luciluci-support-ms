# REPORT — Fechamento da integração da seed determinística W1

- **status:** `SEED_W1_IMPLEMENTED_PROVEN_INTEGRATED_IN_MAIN / NO_DEPLOY`
- **generated_by:** Codex
- **generated_at:** 2026-09-28T21:51:39Z
- **review_mode:** final
- **microservice:** support-ms
- **repository_ref:** `docs/support-seed-w1-merge-closure`, base `origin/main=1c1348d7f1bae38e5b926b69ae53564a295302e3`
- **documentation_ref:** Support 0.15, gitlink `14efcdfdc70d774c4343e2ec47662b7b5c8b691b`
- **report_file:** `docs/reports/REPORT-SUPPORT-SEED-W1-MERGE-CLOSURE-20260928.md`
- **reviewer:** revisão local separada em `REPORT-SUPPORT-SEED-W1-REVIEW-20260928-200426.md`; merge da PR #17 confirmado remotamente

---

# 1. Resumo executivo

A [PR #17](https://github.com/leonardodecuritiba/luciluci-support-ms/pull/17)
foi integrada em `main` no merge
`1c1348d7f1bae38e5b926b69ae53564a295302e3`. O primeiro parent é
`c417d8f1f7d853e6dd1770a27866132032c2de2b` e o segundo é o head W1
`cb92228602ec356566151710bdd05abfacef86be`. O workflow remoto `ci`,
job `quality`, passou no
[run 36478828865](https://github.com/leonardodecuritiba/luciluci-support-ms/actions/runs/36478828865)
para esse head. O job incluiu a proof W1 PostgreSQL, provas RF01–RF13,
smoke da imagem, lint, build, OpenAPI, mensageria desabilitada e coverage.

Estado: **`SEED_W1_IMPLEMENTED_PROVEN_INTEGRATED_IN_MAIN`**. A seed cobre seis
Departments, sete memberships, 16 Tickets, 44 Messages, oito Media rows e
80 AuditLogs, usando oito identidades sintéticas. Só está autorizada para
bancos novos descartáveis local/CI com opt-in explícito. RF01–RF13 continuam
14/14 operações integradas; zero RF parcial, ausente ou ambígua no contrato
Support 0.15. O merge não representa execução da seed em produção, deploy,
UAT ou aceitação operacional.

# 2. Escopo e fontes analisadas

- Fonte de negócio/contrato: `luciluci-docs/support/{README,prd,notes,tdd,tp,dependencies}.md` no gitlink 0.15. Seus textos de status são fotografias do congelamento contratual, anteriores ao runtime RF13 e à W1.
- Definição operacional W1: `REPORT-SUPPORT-SEED-W1-DEFINITION-20260928-184122.md`.
- Implementação/prova local: `REPORT-SUPPORT-SEED-W1-20260928-193318.md`, `scripts/seed.ts`, `scripts/seed/support-w1.*.ts`, `scripts/prove-seed-w1-postgres.js` e `tests/unit/scripts/support-w1-seed.spec.ts`.
- Revisão separada: `REPORT-SUPPORT-SEED-W1-REVIEW-20260928-200426.md`, com cinco findings remediados antes da publicação.
- Estado/runtime: `ACTUAL_STATE.md`, `DRIFT_REPORT.md`, `src/app.ts`, `src/features/{department,ticket}/**`, `api.http` e `docs/openapi/v1/support-api.json`.
- CI: `.github/workflows/ci.yml`; run `36478828865`, trigger `pull_request` da PR #17, head `cb92228`, `completed/success`, job `quality` `completed/success`. Passo **Prove W1 deterministic seed, safety, rollback, and HTTP reads** `completed/success`.

Nesta branch documental, a conferência local executou `git fetch origin
--prune`, `git show --pretty=raw` do merge, `git diff --name-status` e
`git submodule status`. A conclusão dos steps da CI foi obtida da execução
remota. Não foram repetidas proofs PostgreSQL, testes ou imagem após o
merge; a evidência de execução é o head exato da PR, mais os reports locais.

# 3. Matriz principal RF x implementação

W1 é tooling operacional, **não** uma RF ou endpoint novo. A matriz completa
das 14 operações permanece no
[fechamento RF13](REPORT-SUPPORT-FINAL-CLOSURE-20260928-174429.md#3-matriz-principal-rf-x-implementação).
O job `quality` da PR #17 reexecutou as provas PostgreSQL RF01–RF13 no head
W1. A relação W1 com o domínio está em `scripts/seed/support-w1.fixture.ts`:
as seis tabelas materializam cenários das RFs existentes, sem mudar seus
handlers, rotas, OpenAPI, migrations ou contrato canônico.

| Recorte                           | Código/contrato                                   | Prova                                | Estado    |
| --------------------------------- | ------------------------------------------------- | ------------------------------------ | --------- |
| RF01–RF04                         | `src/features/department/**`, OpenAPI             | steps PostgreSQL RF01–RF04 da CI #17 | Integrado |
| RF05–RF13 (RF07a/RF07b separados) | `src/features/ticket/**`, OpenAPI                 | steps PostgreSQL RF05–RF13 da CI #17 | Integrado |
| W1 operacional                    | `scripts/seed.ts`, `scripts/seed/support-w1.*.ts` | proof W1 no run `36478828865`        | Integrado |

# 4. Checklist consolidado por PRD

- [x] RF01–RF13, com RF07a/RF07b separadas: 14 operações integradas em `main`.
- [x] W1 usa as entidades, estados, ACL e auditoria já contratados; não introduz quarta ação de AuditLog nem evento Support.
- [x] Support 0.15 permanece no gitlink `14efcdf`.
- [ ] Aceitação do domínio em ambiente de produção: não comprovada.

# 5. Checklist consolidado por TDD

- [x] Fixture determinística de domínio completo com 6/7/16/44/8/80 rows e oito atores externos sintéticos.
- [x] Safety pré-conexão, `EMPTY/EXACT_W1/DIVERGENT`, transação única, no-op físico, rollback e locks de concorrência descritos no report de implementação/revisão.
- [x] Uso restrito a banco novo descartável local/CI, documentado em `docs/runbooks/local-development.md`; DB padrão `support_ms` recusado.
- [x] Sem migration, evento, alteração do Dockerfile ou startup de seed.
- [ ] Dataset volumétrico e implantação: fora da integração W1 e sem prova neste lote.

# 6. Checklist consolidado por TP

- [x] Unitários W1 em `tests/unit/scripts/support-w1-seed.spec.ts`, incluindo invariantes semânticos, safety, classificador e determinismo.
- [x] Integração/funcional em `scripts/prove-seed-w1-postgres.js`: PostgreSQL descartável, SQL, no-op `xmin`/sequence, divergência sem write, falha tardia, concorrência e smoke HTTP.
- [x] Prova local em UTC e São Paulo e smoke da imagem documentados no report de revisão.
- [x] A CI remota da PR #17 executou a proof W1 e a regressão RF01–RF13 com sucesso.
- [ ] UAT/deploy de produção: sem evidência; não são inferidos da CI.

## 6.1 Matriz RF → unit / integration / functional

| RF          | Unit                                                     | Integration/contract                                            | Functional                                                          | Agrupamento/evidência                                               | Estado     |
| ----------- | -------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------- | ---------- |
| RF01–RF06   | `tests/unit/{department,ticket}/**`                      | `tests/integration/{department,ticket}/**`, OpenAPI             | `scripts/prove-rf01-postgres.js` a `scripts/prove-rf06-postgres.js` | Tríades discriminadas nos reports RF; provas reexecutadas na CI #17 | Comprovada |
| RF07a/RF07b | `tests/unit/ticket/list-tickets.use-case.spec.ts`        | `tests/integration/ticket/list-tickets.spec.ts`                 | `scripts/prove-rf07-postgres.js`                                    | Duas rotas no mesmo proof RF07; CI #17                              | Comprovada |
| RF08–RF12   | `tests/unit/ticket/**`                                   | `tests/integration/ticket/**`, OpenAPI                          | `scripts/prove-rf08-postgres.js` a `scripts/prove-rf12-postgres.js` | Tríades discriminadas nos reports RF; CI #17                        | Comprovada |
| RF13        | `tests/unit/ticket/list-ticket-history.use-case.spec.ts` | `tests/integration/ticket/list-ticket-history.spec.ts`, OpenAPI | `scripts/prove-rf13-postgres.js`, `scripts/prove-s1-image.js`       | Revisão RF13 e CI #17                                               | Comprovada |

A matriz é consolidada do fechamento RF13; a presente branch não executou
novos testes. W1 tem testes próprios acima e não é uma décima quinta operação.

# 7. Inventário de endpoints reais

As 14 operações sob `/api/support/*` constam do fechamento RF13 e da
OpenAPI versionada; W1 não acrescenta rota. `GET /health`, `/metrics`,
`/api-docs` e `/api-docs-json` continuam superfícies operacionais locais,
fora das RFs. `npm run seed` é CLI com gates explícitos, não endpoint HTTP.

# 8. Fronteira NFR e capacidades transversais

| Capacidade                                                   | Categoria                       | Evidência/limite                                         |
| ------------------------------------------------------------ | ------------------------------- | -------------------------------------------------------- |
| Seed determinística e segurança de target                    | implementado localmente         | `scripts/seed.ts`, validator/safety, proof W1 e CI #17   |
| Persistência, migrations, idempotência e correlation ID HTTP | implementado localmente         | Baseline RF13; regressão PostgreSQL e coverage na CI #17 |
| Rate limit/gateway                                           | upstream/plataforma             | Não atribuído à seed nem promovido a drift local         |
| Tracing distribuído                                          | compartilhado                   | Sem decisão local nova neste merge                       |
| Schema Registry, DLQ e redrive                               | fora do escopo desta release    | Sem evento Support contratado                            |
| Implantação, ambiente e aceitação de produção                | fora do escopo desta integração | Nenhuma evidência de deploy/UAT                          |

CI `quality` está comprovada pelo run remoto; CD/deploy não está comprovado.
O drift `DRIFT-SUP-S1-001` permanece fechado e nenhum drift novo foi
identificado na revisão W1.

# 9. Cobertura de testes

O report de revisão mediu localmente 36 suítes/340 testes, com 97,91%
statements, 88,04% branches, 98,93% functions e 98,37% lines. O head W1
passou no step remoto `npm run test:coverage` e `coverage:check`; estes
percentuais são os da medição local documentada, não uma extração nova dos
logs remotos. Unitários, integração e contrato por RF estão discriminados na
matriz 6.1. A proof W1 e o smoke da imagem são provas funcionais adicionais.
Nenhum teste foi reexecutado nesta branch documental.

# 10. Divergências

## 10.1 Documentação prevê, código não comprova

Nenhuma divergência funcional nova identificada para RF01–RF13 ou W1. Deploy,
UAT e massa volumétrica são pendências operacionais separadas, não provas
atribuídas a este merge.

## 10.2 Código existe, documentação não comprova

Os textos de estado nos documentos canônicos 0.15 registram o congelamento
anterior ao runtime RF13 e à W1. `ACTUAL_STATE.md` e este report registram o
estado posterior; o gitlink não foi avançado nem a fotografia canônica
reescrita nesta integração.

## 10.3 `ACTUAL_STATE.md` afirma, código não comprova

Não identificado: a seed e seus gates estão em `scripts/seed.ts` e helpers;
a integração/CI é comprovada pelo merge e run remoto.

## 10.4 PRD / TDD / TP divergem entre si

Nenhuma decisão contratual nova foi tomada neste lote. W1-01 foi resolvida
expressamente na definição anterior; volumes maiores do TDD não são volume W1.

## 10.5 Ambiguidades que impedem conclusão segura

Não há ambiguidade para afirmar integração de código e CI. Não há evidência
para afirmar prontidão ou aceitação de produção, nem ausência absoluta de
falhas fora das provas executadas.

# 11. Conclusão

`SEED_W1_IMPLEMENTED_PROVEN_INTEGRATED_IN_MAIN / NO_DEPLOY`. O próximo passo
operacional, caso solicitado, é planejar ambiente e critérios de aceitação de
produção em lote próprio; a seed W1 continua autorizada apenas para bancos
descartáveis local/CI. Esta branch altera somente documentação de fechamento.
