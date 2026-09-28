# REPORT — Fechamento funcional RF01–RF13 do Support MS

- **status:** `SUPPORT_RF_SCOPE_CLOSED / DOCUMENTATION_CURRENT / NO_DEPLOY`
- **generated_by:** Codex
- **generated_at:** 2026-09-28T17:44:29Z
- **review_mode:** final
- **microservice:** support-ms
- **repository_ref:** `docs/support-rf13-merge-closure`, base funcional `MAIN_BASELINE_RF13=2aacc5554c9c2c4f25415dd8b170f5ff73b6d189`
- **documentation_ref:** Support 0.15, gitlink canônico `14efcdfdc70d774c4343e2ec47662b7b5c8b691b`
- **report_file:** `docs/reports/REPORT-SUPPORT-FINAL-CLOSURE-20260928-174429.md`
- **reviewer:** nenhuma revisão formal da PR #15; revisão independente local RF13 registrada em `REPORT-SUPPORT-RF13-REVIEW-20260928.md`

---

# 1. Resumo executivo

`MAIN_BASELINE_RF13` é o merge funcional da [PR #15](https://github.com/leonardodecuritiba/luciluci-support-ms/pull/15):
`2aacc5554c9c2c4f25415dd8b170f5ff73b6d189`. Seu primeiro parent é
`1e243d386dbca3e2d4dbf14fec7d29c8e5d1b366` (`MAIN_BASELINE_RF12`) e o
segundo é `2741f0e2a68fc209d13e411f9533b628d96a6843` (head RF13).
RF01–RF13 estão implementadas, provadas e integradas em `main`. RF07a/RF07b
contam separadamente: **14 operações HTTP**, cinco delas listagens, estão
materializadas. Não há RF pendente no escopo atual do PRD Support.

Inventário: 14 operações implementadas, zero parciais, zero não encontradas e
zero ambíguas no contrato congelado. Evidência acumulada unitária, integração,
contrato e funcional existe por RF; a prova RF13 reexecutou regressões
PostgreSQL RF01–RF12. Superfícies `/health`, `/metrics` e `/api-docs*` são
operacionais e não contam como RF. A CI remota `ci / quality` do head RF13
passou no [run `36456698983`](https://github.com/leonardodecuritiba/luciluci-support-ms/actions/runs/36456698983).

O contrato canônico permanece Support 0.15 no gitlink
`14efcdfdc70d774c4343e2ec47662b7b5c8b691b`. **Nenhum deploy foi
realizado.** A seed de domínio continua indisponível até definição da massa
determinística W1; ambiente, operação integrada e aceitação de produção não
foram provados. Conclusão das RFs não implica prontidão de produção.

# 2. Escopo e fontes analisadas

- Autoridade funcional: `luciluci-docs/support/{README,prd,notes,tdd,tp,dependencies}.md` na revisão 0.15 fixada; os textos de status nesses arquivos registram a fotografia do congelamento anterior ao runtime RF13.
- Estado e proveniência: `ACTUAL_STATE.md`, `DRIFT_REPORT.md`, `README.md`, `AI_FIRST.md`, `AGENTS.md`, `docs/workflows/support-development-branch-policy.md` e reports RF01–RF13.
- Runtime/contrato: `src/app.ts`, `src/features/department/**`, `src/features/ticket/**`, `src/shared/**`, `docs/openapi/v1/support-api.json` e `api.http`.
- Testes/provas: `tests/unit/**`, `tests/integration/**`, `tests/contract/**`, `scripts/prove-rf01-postgres.js` a `scripts/prove-rf13-postgres.js`, `scripts/prove-s1-image.js`, `.github/workflows/ci.yml`.
- Evidência remota RF13: workflow `ci`, job `quality`, run `36456698983`, evento `pull_request`, head `2741f0e2a68fc209d13e411f9533b628d96a6843`, `completed/success`. Não se atribui CI nova ao merge ou a esta branch documental antes de sua execução.
- A presente alteração é apenas documental. Não repetiu proofs PostgreSQL, imagem ou cobertura; usa a evidência funcional e remota já executada nos lotes RF13.

## 2.1 Integrações principais

| Recorte     | PR/integração    | Merge em `main`                            | Fonte                                             |
| ----------- | ---------------- | ------------------------------------------ | ------------------------------------------------- |
| S1 + RF01   | baseline inicial | `MAIN_BASELINE_RF01`                       | `REPORT-SUPPORT-MAIN-BASELINE-20260910-145800.md` |
| RF02        | PR #1            | `e2dba18a7d0c54577805d6bf2f44adc40ecf0295` | política de branches                              |
| RF03        | PR #2            | `0ca1eab9fcc74a4254b710fd12342d761234e9ff` | política de branches                              |
| RF04        | PR #3            | `04f4f8eb0f9c741fae7947a370fb50c121d8a624` | política de branches                              |
| RF05        | PR #4            | `2cfb637854c5c90abfaf197e6e0822ceb53571f8` | política de branches                              |
| RF06        | PR #5            | `0387167cfe02416c5d05cf3b8288350dd5ba682b` | política de branches                              |
| RF07a/RF07b | PR #7            | `43a556ab1c70f5de9a63e3e6ab651445fa462173` | política de branches                              |
| RF08        | PR #8            | `45be90318bdb71e67532482364933cb49e6660e9` | `ACTUAL_STATE.md`                                 |
| RF09        | PR #9            | `393af3ed50c35fb541825c1822cecaa3b8005a29` | `ACTUAL_STATE.md`                                 |
| RF10        | PR #10           | `8827c0b2f6d0b7597984f5131d4f1ec7b658084f` | `ACTUAL_STATE.md`                                 |
| RF11        | PR #12           | `9387b3dc6e636db4b8124785e7b3bc92ec46d054` | `ACTUAL_STATE.md`                                 |
| RF12        | PR #14           | `1e243d386dbca3e2d4dbf14fec7d29c8e5d1b366` | `ACTUAL_STATE.md`                                 |
| RF13        | PR #15           | `2aacc5554c9c2c4f25415dd8b170f5ff73b6d189` | PR #15, `git rev-list --parents`                  |

PRs #6, #11 e #13 foram checkpoints/fechamentos documentais intermediários;
não representam RFs adicionais. O relatório inicial RF01 tratou a publicação
de `MAIN_BASELINE_RF01` como um gate posterior; esta tabela não inventa um SHA
de merge para ela.

# 3. Matriz principal RF x implementação

| RF    | Operação HTTP sob `/api/support`                            | Código/contrato          | Prova acumulada                                    | Estado    |
| ----- | ----------------------------------------------------------- | ------------------------ | -------------------------------------------------- | --------- |
| RF01  | `POST /departments`                                         | Department, OpenAPI      | unit/integration, PostgreSQL RF01                  | Integrada |
| RF02  | `PATCH /departments/{departmentId}`                         | Department, OpenAPI      | unit/integration, PostgreSQL RF02                  | Integrada |
| RF03  | `GET /departments`                                          | Department, OpenAPI      | unit/integration, PostgreSQL RF03                  | Integrada |
| RF04  | `DELETE /departments/{departmentId}`                        | Department, OpenAPI      | unit/integration, PostgreSQL RF04                  | Integrada |
| RF05  | `POST /tickets`                                             | Ticket, OpenAPI          | unit/integration, PostgreSQL RF05                  | Integrada |
| RF06  | `PATCH /tickets/{ticketId}`                                 | Ticket, OpenAPI          | unit/integration, PostgreSQL RF06                  | Integrada |
| RF07a | `GET /tickets/requester/{requesterId}`                      | Ticket, OpenAPI          | unit/integration, PostgreSQL RF07                  | Integrada |
| RF07b | `GET /tickets/admin/{adminId}`                              | Ticket, OpenAPI          | unit/integration, PostgreSQL RF07                  | Integrada |
| RF08  | `POST /tickets/{ticketId}/resolve`                          | Ticket, OpenAPI          | unit/integration, PostgreSQL RF08                  | Integrada |
| RF09  | `GET /tickets/{ticketId}`                                   | Ticket, OpenAPI          | unit/integration, PostgreSQL RF09                  | Integrada |
| RF10  | `POST /tickets/{ticketId}/messages`                         | TicketMessage, OpenAPI   | unit/integration, PostgreSQL RF10                  | Integrada |
| RF11  | `PATCH /tickets/{ticketId}/messages/{messageId}/visibility` | TicketMessage, OpenAPI   | unit/integration, PostgreSQL RF11                  | Integrada |
| RF12  | `GET /tickets/{ticketId}/messages`                          | TicketMessage, OpenAPI   | unit/integration, PostgreSQL RF12                  | Integrada |
| RF13  | `GET /tickets/history`                                      | AuditLog/Ticket, OpenAPI | unit/integration/contract, PostgreSQL RF13, imagem | Integrada |

Os paths reais estão em `src/features/{department,ticket}/adapters/routes/` e
na OpenAPI versionada. Nenhum evento de negócio Support foi especificado.

# 4. Checklist consolidado por PRD

- [x] RF01–RF13 e RF07a/RF07b separadas: 14 operações materializadas.
- [x] ACL fina por `allowedUserIds` ou ownership, conforme o recorte de cada RF.
- [x] Histórico RF13 preserva as três ações de AuditLog do PRD e o filtro de visibilidade aprovado.
- [x] Contrato Support 0.15 fixo; nenhum Support 0.16, migration ou evento RF13 criado.

# 5. Checklist consolidado por TDD

- [x] HTTP, OpenAPI, `api.http`, persistência PostgreSQL e erros alinhados por RF.
- [x] RF13 filtra `nova_mensagem` de admin antes de `COUNT` e paginação, sem correlação heurística AuditLog↔TicketMessage.
- [x] RF13 lê em transação PostgreSQL `REPEATABLE READ`, sem escrita, auditoria de leitura ou lock pessimista.
- [x] Cinco listagens: Department, duas de Ticket RF07, mensagens RF12 e histórico RF13.
- [ ] Seed de domínio determinística W1: o comando `npm run seed` ainda rejeita antes de conectar/escrever. Massa e critérios permanecem por definir fora do fechamento de RFs.

# 6. Checklist consolidado por TP

- [x] Testes unitários, integração HTTP, contrato OpenAPI e provas funcionais com processo compilado/PostgreSQL foram acumulados por RF.
- [x] RF13: 35 suítes/310 testes; proofs PostgreSQL RF01–RF13; proof RF13 em `UTC` e `America/Sao_Paulo`; smoke da imagem; CI remota verde.
- [x] Revisão independente RF13 `RF13_REVIEW_PASS / READY_FOR_PUBLICATION`; findings RF13-REV-01/02 corrigidos antes do commit publicado.
- [ ] UAT/aceitação de produção e deploy: sem evidência; não necessários para afirmar integração das RFs, necessários para decisão operacional própria.

## 6.1 Matriz RF → unit / integration / functional

| RF          | Unit                                                     | Integration/contract                                                                                      | Functional                                                          | Agrupamento / limite                                                | Estado     |
| ----------- | -------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------- | ---------- |
| RF01–RF06   | `tests/unit/{department,ticket}/**`                      | `tests/integration/{department,ticket}/**`, OpenAPI                                                       | `scripts/prove-rf01-postgres.js` a `scripts/prove-rf06-postgres.js` | Evidência por recorte em reports anteriores; reexecutada na CI RF13 | Comprovada |
| RF07a/RF07b | `tests/unit/ticket/list-tickets.use-case.spec.ts`        | `tests/integration/ticket/list-tickets.spec.ts`, OpenAPI                                                  | `scripts/prove-rf07-postgres.js`                                    | Duas operações no mesmo proof RF07                                  | Comprovada |
| RF08–RF12   | `tests/unit/ticket/**`                                   | `tests/integration/ticket/**`, OpenAPI                                                                    | `scripts/prove-rf08-postgres.js` a `scripts/prove-rf12-postgres.js` | Evidência por recorte em reports anteriores; reexecutada na CI RF13 | Comprovada |
| RF13        | `tests/unit/ticket/list-ticket-history.use-case.spec.ts` | `tests/integration/ticket/list-ticket-history.spec.ts`, `tests/contract/openapi/openapi.contract.test.ts` | `scripts/prove-rf13-postgres.js`, `scripts/prove-s1-image.js`       | PostgreSQL, duas TZ, concorrência e imagem; CI run `36456698983`    | Comprovada |

Os agrupamentos apontam para suítes reais e proofs por RF; este report não
afirma execução nova na branch documental.

# 7. Inventário de endpoints reais

## Endpoints funcionais

As 14 operações exatas estão na seção 3, em `docs/openapi/v1/support-api.json`
e `api.http`. Não há rota Profile no contrato Support. RF13 é a última operação
do PRD atual, com resposta paginada de oito campos e `Ticket.number`.

## Endpoints operacionais / contratos

`GET /health`, `GET /metrics`, `GET /api-docs` e `GET /api-docs-json` são
superfícies operacionais herdadas, não RFs. OpenAPI exportada/check e
compatibilidade retroativa passaram na CI RF13; a validação não constitui deploy.

# 8. Fronteira NFR e capacidades transversais

## 8.1 Matriz de fronteira NFR

| Item                                                                       | Classificação                                                  | Evidência / limite                                                                     |
| -------------------------------------------------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| Correlação HTTP, ACL fina, auditoria do PRD, persistência e transação RF13 | Implementado localmente                                        | Rotas, casos de uso, proofs PostgreSQL e CI RF13                                       |
| Autenticação pública, papel amplo e identidade confiável                   | Upstream/plataforma (BFF)                                      | `luciluci-docs/support/dependencies.md`; Support valida identidade recebida e ACL fina |
| Contrato entre BFFs e Support                                              | Compartilhado                                                  | BFFs não foram modificados/testados neste lote                                         |
| RabbitMQ, DLQ, redrive, Schema Registry, OpenTelemetry global              | Fora do escopo desta release ou responsabilidade de plataforma | PRD não especifica evento Support; não inferir gap local                               |
| Seed determinística W1                                                     | Pendência operacional local                                    | `scripts/seed.ts` rejeita; TDD ainda não define massa W1                               |
| Deploy, ambiente, UAT e operação de produção                               | Pendente fora do fechamento de RFs                             | Nenhuma execução/evidência de implantação neste ciclo                                  |

## 8.2 Capacidades transversais

Headers `X-Correlation-ID` e de ator, matriz de erros, OpenAPI e provas de
autorização funcional estão materializados. O módulo de mensageria de domínio
permanece inativo porque não há evento Support contratado. Upload/download de
mídia pertencem a Files; Support persiste referências `mediaIds` conforme o
PRD. NFRs de plataforma não são drifts locais automáticos.

# 9. Cobertura de testes

O último `npm run test:coverage` executado no lote RF13 reportou 35 suítes,
310 testes, 97,91% statements, 88,04% branches, 98,93% functions e 98,37%
lines; `coverage:check` passou. A CI remota do head RF13 executou cobertura e
gate com conclusão `success`. Esta branch documental não repetiu cobertura.
Unit, integração HTTP/SQLite, contrato OpenAPI, processo real/PostgreSQL e
imagem cobrem camadas diferentes. SQLite não prova isolamento, locks nem
snapshot PostgreSQL; esses pontos foram provados pelos scripts em banco
descartável. RF13 foi também provada sob dois fusos e concorrência com
RF10/RF06/RF08/RF11.

# 10. Divergências

## 10.1 Documentação prevê, código não comprova

Nenhuma divergência funcional identificada nas 14 operações do contrato
Support 0.15. A seed W1 proposta no TDD não tem massa definida e o comando
continua indisponível; é pendência operacional explícita, não RF ausente.

## 10.2 Código existe, documentação não comprova

Nenhuma divergência funcional identificada. As superfícies operacionais
herdadas estão documentadas localmente e não entram na matriz de RF.

## 10.3 `ACTUAL_STATE.md` afirma, código não comprova

O bloco corrente deste fechamento refere-se à integração e evidência acima.
Os blocos anteriores de `ACTUAL_STATE.md` e reports preservam fotografias
históricas de cada etapa, inclusive RF13 ainda local/ausente. A documentação
canônica 0.15 também preserva a fotografia anterior ao runtime; seu contrato
de comportamento continua a autoridade, sem alteração nesta branch.

## 10.4 PRD / TDD / TP divergem entre si

Nenhuma divergência contratual RF13 residual encontrada após as decisões
registradas em `REPORT-SUPPORT-RF13-CONTRACT-20260928-141233.md`.

## 10.5 Ambiguidades que impedem conclusão segura

Não há blocker contratual aberto para RF01–RF13 no contrato congelado. Sem
evidência de deploy, ambiente e UAT, a prontidão de produção não pode ser
concluída. A definição da seed W1 continua pendente. Não se extrapola a
decisão RF13 para novos requisitos fora do PRD atual.

# 11. Conclusão

`SUPPORT_RF_SCOPE_CLOSED`: RF01–RF13 estão implementadas, provadas e integradas
em `MAIN_BASELINE_RF13=2aacc5554c9c2c4f25415dd8b170f5ff73b6d189`.
`DRIFT-SUP-S1-001` está `RESOLVED / PROVEN`; blockers contratuais RF13 dos
checkpoints anteriores foram resolvidos antes do runtime. A revisão
independente não identificou drift funcional RF13 residual. O inventário de
`DRIFT_REPORT.md` não aponta outro drift técnico funcional aberto no escopo RF.

`NO_DEPLOY`: este fechamento não implanta nem atesta produção. A seed W1
indisponível é a pendência local obrigatória ainda registrada; definição da
massa e implementação devem ser tratadas em trabalho separado, junto com
preparação de ambiente e critérios de operação/aceitação. Por isso este report
não declara `SUPPORT_MS_FINAL_CLOSURE_COMPLETE` nem `SERVICE_PRODUCTION_READY`.
O merge documental futuro identificará `SUPPORT_FINAL_DOCUMENTED_MAIN`
separadamente, sem redefinir `MAIN_BASELINE_RF13`.
