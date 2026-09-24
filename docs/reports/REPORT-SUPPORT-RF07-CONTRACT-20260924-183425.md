# REPORT — Fechamento contratual RF07a/RF07b

- **status:** `RF07_CONTRACT_CHECKPOINT_READY`
- **generated_by:** Codex
- **generated_at:** 2026-09-24T18:34:25Z
- **review_mode:** final / RF07 contract resolution
- **microservice:** support-ms
- **repository_ref:** `docs/support-rf07-list-tickets-checkpoint` sobre `MAIN_BASELINE_RF06` / `0387167cfe02416c5d05cf3b8288350dd5ba682b`
- **documentation_ref:** `luciluci-docs` / `docs/support-rf07-checkpoint` / `1583a586793437a7b7c0569581637ee8ddac5ae5`
- **report_file:** `docs/reports/REPORT-SUPPORT-RF07-CONTRACT-20260924-183425.md`
- **reviewer:** não informado

---

# 1. Resumo executivo

O PRD preserva 14 operações (RF01–RF13 com RF07a/RF07b distintas), cinco
listagens. RF01–RF06 estão implementadas/provadas em `MAIN_BASELINE_RF06`;
RF07a/RF07b e RF08–RF13 não têm runtime. As decisões recebidas fecham somente
RF07a/RF07b como Support 0.9 `RF07A_RF07B_CONTRACT_FROZEN`. Não há nova
contradição material no recorte. Não houve implementação, teste funcional,
migration, OpenAPI executável, `api.http`, CI, script ou package alterado.

`origin/main` e `main` apontam para o merge RF06 `0387167`; a PR #5 está merged,
head integrado `204ab0c`, CI final `36032135712/success`. A página da PR #5
ainda mostra `No reviews`, discrepância processual histórica sem ação neste lote.

# 2. Escopo e fontes analisadas

Fontes: PRD original preservado em
`luciluci-docs/support/sources/prd-original.md`, transposição e decisões em
`support/{README,prd,notes,tdd,tp,dependencies}.md`, checkpoint histórico
`REPORT-SUPPORT-RF07-CHECKPOINT-20260924-180059.md`, `ACTUAL_STATE.md`,
`AGENTS.md`, `AI_FIRST.md`, READMEs, `DRIFT_REPORT.md` e política de branches.
Inventário de runtime do checkpoint anterior em `src/features/ticket/**`,
`src/app.ts`, `docs/openapi/v1/support-api.json`, `api.http`, `tests/**` e
`.github/workflows/ci.yml` permanece válido; nesta rodada o diff é documental.
`gh pr view` não alcançou `api.github.com`; a publicação Git foi validada por
`git push` e `git ls-remote`. A PR #6/CI deve ser tratada como gate documental,
jamais prova de RF07.

# 3. Matriz principal RF x implementação

| RF        | Operação                            | Estado         | Evidência                                     |
| --------- | ----------------------------------- | -------------- | --------------------------------------------- |
| RF01–RF04 | Department POST/PATCH/GET/DELETE    | Implementado   | Código, testes e reports RF01–RF04 anteriores |
| RF05      | POST tickets                        | Implementado   | Código, testes e report RF05 anterior         |
| RF06      | PATCH tickets/{ticketId}            | Implementado   | PR #5, report RF06 e CI histórica             |
| RF07a     | GET tickets/requester/{requesterId} | Não encontrado | Contrato 0.9; sem rota, teste ou prova        |
| RF07b     | GET tickets/admin/{adminId}         | Não encontrado | Contrato 0.9; sem rota, teste ou prova        |
| RF08–RF13 | Demais operações do PRD             | Não encontrado | Fora do lote; planejadas                      |

# 4. Checklist consolidado por PRD

- [x] RF07a mantém path e filtros da fonte, ownership do requester e zero auditoria.
- [x] RF07b mantém path, filtro adicional requesterId e visibilidade por
      `Department.allowedUserIds`, sem usar `type` como autorização.
- [x] Item de ambas as listas usa exatamente os oito campos do PRD,
      `status=adminStatus`; RF07a herda o mesmo shape de RF07b.
- [x] Decisões contratuais posteriores 0.9 classificadas em `notes.md`, sem
      editar `sources/prd-original.md`.
- [ ] Runtime RF07a/RF07b: ausente, conforme escopo deste fechamento.

# 5. Checklist consolidado por TDD

DEC-SUP-01/02/07/08/09 foram marcadas `RESOLVED_FOR_RF07` somente para as duas
rotas. Headers `X-Correlation-ID`, `X-Performed-By`, `X-Performed-By-Type`;
role/ator do path; ACL aplicada no banco antes de count e paginação; filtros
escalares por AND; datas `DD/MM/YYYY` sobre `Ticket.createdAt` em UTC; ordem
`createdAt DESC,id DESC`; defaults/limites de page/size; envelope, shape e
erros estão fechados. Para RF07b, membership atual e Department inativo são
tratados sem supercontagem. RF12/RF13 não herdam as decisões automaticamente.
Leituras não têm idempotency key, AuditLog, evento, outbox, write ou mudança
de `updatedAt` (`NOT_APPLICABLE_RF07`).

# 6. Checklist consolidado por TP

`TC-SUP-RF07a` e `TC-SUP-RF07b` agora planejam casos positivos, negativos,
ACL, datas UTC e bordas, filtros AND, repetição/desconhecidos, paginação,
ordem, count único, ausência de efeitos e erro por categoria. Ambos continuam
`CONTRACT_FROZEN / PLANNED / NOT_RUN`. Nenhum caso foi executado nesta rodada.

## 6.1 Matriz obrigatória RF -> testes

| RF        | Unit                   | Integration             | Functional                            | Contrato             | Evidência nesta rodada            |
| --------- | ---------------------- | ----------------------- | ------------------------------------- | -------------------- | --------------------------------- |
| RF01–RF04 | Reports RF01–RF04      | Reports RF01–RF04       | Provas PostgreSQL/processo históricas | OpenAPI histórico    | Não reexecutada                   |
| RF05      | Report RF05            | Report RF05             | Prova PostgreSQL/processo histórica   | OpenAPI histórico    | Não reexecutada                   |
| RF06      | Report RF06            | Report RF06             | Prova PostgreSQL/processo histórica   | OpenAPI/CI histórica | Não reexecutada                   |
| RF07a     | UT-SUP-RF07a planejado | INT-SUP-RF07a planejado | FU-SUP-02 futuro                      | CT-SUP-RF07a futuro  | `NOT_RUN`, sem arquivo executável |
| RF07b     | UT-SUP-RF07b planejado | INT-SUP-RF07b planejado | FU-SUP-03 futuro                      | CT-SUP-RF07b futuro  | `NOT_RUN`, sem arquivo executável |
| RF08–RF13 | TP planejado           | TP planejado            | TP planejado                          | TP planejado         | Fora do lote                      |

# 7. Inventário de endpoints reais

RF01–RF04 expõem `/api/support/departments`, RF05 expõe
`POST /api/support/tickets` e RF06 expõe `PATCH /api/support/tickets/{ticketId}`.
RF07a/RF07b permanecem ausentes do runtime, OpenAPI executável e `api.http`.
`/health`, `/metrics`, `/api-docs`, `/api-docs-json` e OPTIONS são superfícies
operacionais, não RFs. O `api.http` cobre somente RFs implementadas. Seed W1
continua bloqueada por decisão própria; não é pré-requisito de congelamento 0.9.

# 8. Fronteira NFR e capacidades transversais

## 8.1 Matriz obrigatória de fronteira NFR

| Item                                              | Categoria                           | Evidência/limite                                         |
| ------------------------------------------------- | ----------------------------------- | -------------------------------------------------------- |
| Correlação, erros, PostgreSQL e OpenAPI RF01–RF06 | implementado localmente             | Histórico do serviço; não comprova RF07                  |
| AuthN e RBAC amplo                                | upstream/plataforma                 | BFF; Support aplica ACL fina contratada                  |
| Observabilidade distribuída                       | compartilhado                       | Sem requisito local novo neste recorte                   |
| Mensageria, DLQ/redrive e notificações            | fora do escopo desta release        | Sem evento Support especificado                          |
| Contrato RF07 antes aberto                        | gap real local documental resolvido | Support 0.9 publicado; runtime permanece trabalho futuro |

## 8.2 Capacidades transversais

O contrato exige correlação, rejeição de headers inválidos e filtragem ACL no
banco; a implementação futura precisa provar esses pontos. Nenhuma NFR genérica
amplia a auditoria ou cria mensageria Support. A PR #6 pode executar CI de
regressão histórica, sem atribuição de evidência funcional RF07.

# 9. Cobertura de testes

Nenhum teste, build, migration, prova PostgreSQL ou cobertura foi executado
para RF07. Os 21 suites/177 testes e métricas do report RF06 são históricos,
não cobertura deste contrato. Validação deste lote: `git diff --check`,
`npm run format:check`, `git -C luciluci-docs diff --check` e
`git show --check HEAD` em ambos os repositórios, com resultados registrados
após os commits.

# 10. Divergências

## 10.1 Documentação prevê, código não comprova

RF07a/RF07b têm contrato 0.9 sem runtime, esperado neste lote documental.
RF08–RF13 continuam planejadas.

## 10.2 Código existe, documentação não comprova

Nenhuma divergência nova no recorte RF07 identificada. A fotografia 0.8
anterior ao merge RF06 foi alinhada ao estado atual nas entradas canônicas.

## 10.3 `ACTUAL_STATE.md` afirma, código não comprova

O estado afirma somente o congelamento contratual RF07, não implementação.
As provas RF01–RF06 são referenciadas como históricas.

## 10.4 PRD / TDD / TP divergem entre si

Nenhuma divergência material no recorte RF07 após aplicar as decisões 0.9.
Propostas do checkpoint bloqueado anterior estão identificadas como históricas.

## 10.5 Ambiguidades que impedem conclusão segura

Nenhuma para RF07a/RF07b neste fechamento. DEC-SUP de RF08–RF13 continuam
abertas em seus próprios recortes. `RF07_IMPLEMENTATION_BASELINE = MAIN_BASELINE_RF06`.

# 11. Conclusão

`RF07_CONTRACT_CHECKPOINT_READY` e `RF07A_RF07B_CONTRACT_FROZEN` em Support 0.9.
Revisão canônica `1583a586793437a7b7c0569581637ee8ddac5ae5` publicada
na branch documental existente; o serviço aponta para esse gitlink e será
publicado na PR #6 existente. `RF07a NOT_IMPLEMENTED`, `RF07b NOT_IMPLEMENTED`,
`feat/support-rf07-list-tickets NOT_CREATED`. A próxima ação é abrir lote
explícito para implementar e provar RF07a/RF07b a partir de `MAIN_BASELINE_RF06`.
