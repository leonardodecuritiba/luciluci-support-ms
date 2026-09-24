# REPORT — Checkpoint contratual RF07a/RF07b do support-ms

- **status:** `RF07_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION`
- **generated_by:** Codex
- **generated_at:** 2026-09-24T18:00:59Z
- **review_mode:** final
- **microservice:** support-ms
- **repository_ref:** `docs/support-rf07-list-tickets-checkpoint` sobre `main`/`0387167cfe02416c5d05cf3b8288350dd5ba682b`
- **documentation_ref:** `luciluci-docs/support/notes.md`, Support 0.8 `4650ec671c948a4fa8fb04fa33b300d8fd255ae4` + checkpoint `775f349b6393933787507c7314e09702d0f8c817`
- **report_file:** `docs/reports/REPORT-SUPPORT-RF07-CHECKPOINT-20260924-180059.md`
- **reviewer:** não informado

---

# 1. Resumo executivo

- O PRD contém 14 operações: RF01–RF13 com RF07a/RF07b distintas; cinco são listagens.
- Código implementado/provado: RF01–RF06 (6). Não implementado: RF07a/RF07b e RF08–RF13 (8). Nenhuma RF adicional foi parcialmente implementada neste checkpoint.
- Tríade unit/integration/functional RF01–RF06: evidência histórica nos reports correspondentes; não reexecutada aqui. RF07a/RF07b: somente casos planejados, sem testes ou runtime.
- Superfícies operacionais `/health`, `/metrics`, `/api-docs`, `/api-docs-json` e OPTIONS não contam como RF.
- RF06 está em `MAIN_BASELINE_RF06`. RF07a/RF07b possuem fonte funcional suficiente para paths, papéis, escopo, projeção e ausência de auditoria, mas não para contrato executável completo. **Support 0.9 não foi congelado.**

O prompt recebido descrevia a PR #5 como aberta e bloqueada por review. Na inspeção deste checkpoint, a [PR #5](https://github.com/leonardodecuritiba/luciluci-support-ms/pull/5) já estava **merged** no commit `0387167`; `main` e `origin/main` locais apontavam para esse SHA após `git fetch origin --prune`. O head foi `204ab0c9cfa09052539db9272dd03e4c47aa9084`, com [CI final `36032135712`](https://github.com/leonardodecuritiba/luciluci-support-ms/actions/runs/36032135712) aprovada. A página ainda mostrava **No reviews**. O merge ocorreu fora deste checkpoint: nenhuma ação na PR #5 ou tentativa de contornar review foi feita aqui. Isso deixa uma discrepância de processo a ser tratada pelos responsáveis, sem reabrir a RF06 nem alterar seu runtime.

# 2. Escopo e fontes analisadas

- Fonte: `luciluci-docs/support/sources/prd-original.md` preservado; transposição `luciluci-docs/support/{README,prd,tdd,tp,notes,dependencies}.md`.
- Serviço: `AGENTS.md`, `AI_FIRST.md`, `ACTUAL_STATE.md`, `DRIFT_REPORT.md`, `README.md`, `docs/README.md`, `docs/workflows/support-development-branch-policy.md`, report RF05 e [report RF06](REPORT-SUPPORT-RF06-20260924-164819.md).
- Inventário de runtime: `src/app.ts`, `src/features/ticket/**`, `src/features/department/**`, `src/shared/openapi/swagger.ts`, `docs/openapi/v1/support-api.json`, `api.http`, `tests/**`, `scripts/prove-rf06-postgres.js`, `.github/workflows/ci.yml`. Inspeção estrutural apenas; nenhum teste RF07 foi executado.
- Report: `.codex/skills/report-review.md`, `docs/prompts/report-completeness-prompt.md`, `docs/reports/REPORT-TEMPLATE.md`.
- Git: worktree documental isolada desde `main`/`0387167`; submódulo inicializado **na revisão fixada** sem `--remote`. `git fetch origin --prune` passou. `gh pr view 5`/`gh pr checks 5` falharam por indisponibilidade de `api.github.com`; estado remoto foi lido na página GitHub da PR e o merge foi cotejado com Git local.
- CI/CD: workflow `.github/workflows/ci.yml`; run remoto comprovado `36032135712`, trigger `pull_request #5`, head `204ab0c`, status `completed`, conclusion `success`; job `quality`, sem step falho. Nenhum run novo de RF07 foi atribuído à RF06.

# 3. Matriz principal RF x implementação

| RF    | Endpoint/tema                                            | Fonte          | Estado no serviço | Evidência                                 |
| ----- | -------------------------------------------------------- | -------------- | ----------------- | ----------------------------------------- |
| RF01  | POST departments                                         | PRD/TDD/TP     | Implementado      | `src/features/department`, report RF01    |
| RF02  | PATCH departments                                        | PRD/TDD/TP     | Implementado      | `src/features/department`, report RF02    |
| RF03  | GET departments                                          | PRD/TDD/TP     | Implementado      | `src/features/department`, report RF03    |
| RF04  | DELETE departments                                       | PRD/TDD/TP     | Implementado      | `src/features/department`, report RF04    |
| RF05  | POST tickets                                             | PRD/TDD/TP     | Implementado      | `src/features/ticket`, report RF05        |
| RF06  | PATCH tickets/{ticketId}                                 | PRD/TDD/TP 0.8 | Implementado      | `src/features/ticket`, report RF06, PR #5 |
| RF07a | GET tickets/requester/{requesterId}                      | PRD/TDD/TP     | Não encontrado    | contrato pendente; nenhuma rota/teste     |
| RF07b | GET tickets/admin/{adminId}                              | PRD/TDD/TP     | Não encontrado    | contrato pendente; nenhuma rota/teste     |
| RF08  | POST tickets/{ticketId}/resolve                          | PRD/TDD/TP     | Não encontrado    | fora do recorte                           |
| RF09  | GET tickets/{ticketId}                                   | PRD/TDD/TP     | Não encontrado    | fora do recorte                           |
| RF10  | POST tickets/{ticketId}/messages                         | PRD/TDD/TP     | Não encontrado    | fora do recorte                           |
| RF11  | PATCH tickets/{ticketId}/messages/{messageId}/visibility | PRD/TDD/TP     | Não encontrado    | fora do recorte                           |
| RF12  | GET tickets/{ticketId}/messages                          | PRD/TDD/TP     | Não encontrado    | fora do recorte                           |
| RF13  | GET tickets/history                                      | PRD/TDD/TP     | Não encontrado    | fora do recorte                           |

# 4. Checklist consolidado por PRD

- [x] RF07a/RF07b preservam os paths e filtros nomeados no PRD; RF07b acrescenta `requesterId` opcional.
- [x] RF07a restringe ao dono; RF07b restringe por membership em `allowedUserIds`. `Department.type` não amplia visibilidade; inativo não remove ticket histórico.
- [x] Item de ambos usa `id,number,createdAt,departmentId,requesterId,origin,priority,status`; `status=adminStatus`. Nenhuma leitura cria AuditLog.
- [ ] Defaults/envelope/teto, datas, ordenação e detalhes de combinação/validação de filtros ainda dependem de decisão. Exemplo não foi convertido em norma silenciosa.

# 5. Checklist consolidado por TDD

- [x] Identidade de ator do recorte documentada com a família `X-Performed-By*` já materializada em RF06; igualdade path/ator obrigatória, papel específico em cada endpoint.
- [x] Escopo e total devem ser aplicados no banco antes da paginação; consulta admin por membership sem multiplicar linhas ou fallback irrestrito. Isso é invariante de implementação futura, não runtime criado.
- [ ] DEC-SUP-02/07/08 e semântica detalhada dos filtros impedem request/response/erros completos. Nenhuma migration, índice, OpenAPI executável ou `api.http` RF07 foi adicionado.

# 6. Checklist consolidado por TP

- [x] `TC-SUP-RF07a` e `TC-SUP-RF07b` identificam positivos, negativos e autorização.
- [ ] Unit/integration/functional/contract RF07a/RF07b são `PLANNED / NOT_RUN`. Não confundir roteiro do TP com prova executada.
- [ ] Faltam casos fechados para datas, paginação/ordem e filtros após decisão.

## 6.1 Matriz RF → unit/integration/functional

| RF          | Unit                                                       | Integration                                              | Functional                             | Estado               |
| ----------- | ---------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------- | -------------------- |
| RF01        | `tests/unit/department/create-department.use-case.spec.ts` | `tests/integration/department/create-department.spec.ts` | `scripts/prove-rf01-postgres.js`       | histórico comprovado |
| RF02        | `tests/unit/department/update-department.use-case.spec.ts` | `tests/integration/department/update-department.spec.ts` | `scripts/prove-rf02-postgres.js`       | histórico comprovado |
| RF03        | `tests/unit/department/list-departments.use-case.spec.ts`  | `tests/integration/department/list-departments.spec.ts`  | `scripts/prove-rf03-postgres.js`       | histórico comprovado |
| RF04        | `tests/unit/department/delete-department.use-case.spec.ts` | `tests/integration/department/delete-department.spec.ts` | `scripts/prove-rf04-postgres.js`       | histórico comprovado |
| RF05        | `tests/unit/ticket/create-ticket.use-case.spec.ts`         | `tests/integration/ticket/create-ticket.spec.ts`         | `scripts/prove-rf05-postgres.js`       | histórico comprovado |
| RF06        | `tests/unit/ticket/update-ticket.use-case.spec.ts`         | `tests/integration/ticket/update-ticket.spec.ts`         | `scripts/prove-rf06-postgres.js`       | histórico comprovado |
| RF07a/RF07b | ausente                                                    | ausente                                                  | `TC-SUP-RF07a/RF07b` apenas planejados | não executado        |
| RF08–RF13   | ausente                                                    | ausente                                                  | TP apenas planejado                    | fora do recorte      |

# 7. Inventário de endpoints reais

RF01–RF06 estão ativos: `POST/PATCH/GET/DELETE /api/support/departments` conforme RF01–RF04, `POST /api/support/tickets` e `PATCH /api/support/tickets/{ticketId}`. Em `src/features/ticket/adapters/routes/ticket.routes.ts`, `src/shared/openapi/swagger.ts` e `api.http` não há GET RF07a/RF07b. Os paths de RF07 aparecem somente na documentação planejada. Superfícies operacionais herdadas: `/health`, `/metrics`, `/api-docs`, `/api-docs-json` e OPTIONS, separadas das RFs.

# 8. Fronteira NFR e capacidades transversais

| Capacidade                                            | Classificação                 | Evidência/limite                                             |
| ----------------------------------------------------- | ----------------------------- | ------------------------------------------------------------ |
| Correlação, erros HTTP, PostgreSQL, OpenAPI RF01–RF06 | implementado localmente       | código, testes e CI RF06; RF07 não herda conclusão funcional |
| Autenticação e RBAC amplo                             | upstream/plataforma           | BFF; Support aplica ACL fina recebendo ator                  |
| Observabilidade distribuída                           | compartilhado                 | sem requisito local RF07 novo                                |
| Mensageria, DLQ, Schema Registry e carga              | fora do escopo desta release  | nenhum evento Support especificado                           |
| Contrato RF07 incompleto                              | gap real local **documental** | DEC-SUP-02/07/08 e filtros; nenhum runtime RF07 autorizado   |

`api.http` cobre RFs implementadas, não RF07. Seed W1 continua bloqueada conforme estado anterior; esta revisão não executa seed ou banco. A presença do workflow e da CI RF06 não prova RF07.

# 9. Cobertura de testes

Nenhum teste, build, migration ou prova de banco foi executado neste checkpoint documental. O [report RF06](REPORT-SUPPORT-RF06-20260924-164819.md) registra 21 suítes/177 testes e cobertura global histórica de 98,17% statements, 85,18% branches, 98,31% functions e 98,38% lines; o run final da PR #5 passou. Esses números **não** são cobertura RF07. RF07a/RF07b permanecem sem código e sem testes.

# 10. Divergências e decisões

## 10.1 Documentação prevê, código não comprova

RF07a/RF07b constam em PRD/TDD/TP, porém não têm rota, OpenAPI executável ou teste. Isso é esperado pelo fluxo RF por RF e pelo checkpoint ainda aberto. RF08–RF13 também não têm runtime e ficaram fora deste lote.

## 10.2 Código existe, documentação não comprova

Nenhuma nova divergência de RF07. O contrato canônico 0.8 é fotografia anterior ao runtime RF06; `ACTUAL_STATE.md` registra o merge posterior da PR #5.

## 10.3 `ACTUAL_STATE.md` afirma, código não comprova

Nenhuma afirmação de implementação RF07. A integração RF06 é comprovada por Git local/remoto e página da PR. A ausência de review formal na página não é interpretada como prova de aprovação formal.

## 10.4 PRD / TDD / TP e matriz de decisões

| Tema          | Decisão/limite atual                                                                                           | Status                               | Natureza                             |
| ------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------ | ------------------------------------ | --------------------------------- |
| Identidade    | `X-Correlation-ID` e `X-Performed-By*`; RF07a `backoffice                                                      | cd`, RF07b `admin`; path=ator        | resolvido RF07a/b                    | PRD §5.2 + adoção da família RF06 |
| Paginação     | fonte exige `page/size`; RF03 tem defaults/envelope, sem decisão transversal para tickets                      | aberto                               | PRD + DEC-SUP-02                     |
| Datas         | formato, timezone, limites, timestamp e intervalo não normatizados                                             | aberto                               | DEC-SUP-07                           |
| Shape         | oito campos do item RF07b; RF07a igual; `status=adminStatus`                                                   | resolvido para item; envelope aberto | PRD/P5                               |
| IDs           | Ticket/Department UUID v4; requester/admin/ator externos opacos; number persistido positivo                    | resolvido                            | DEC-SUP-09 RF05/RF06 reutilizada     |
| Ordenação     | `createdAt DESC,id DESC` é proposta, sem aprovação                                                             | aberto                               | DEC-SUP-02 proposta                  |
| ACL requester | papel solicitante, path igual a ator, filtrar ownership no banco; origin não é gate adicional                  | resolvido                            | PRD RF07a/§5.2                       |
| ACL admin     | admin, path igual a ator, membership em Department inclusive inativo; sem uso de type                          | resolvido                            | PRD RF07b/P1/P6 + derivação rotulada |
| Filtros       | nomes e enums conhecidos; `AND`, number exato, query repetida e validação final pendentes                      | parcial                              | PRD + detalhes técnicos abertos      |
| Erros         | header inválido `400`, mismatch/ACL `403`, UUID/enum inválido `422`, inesperado `500`; data/envelope pendentes | parcial                              | P8 + envelope local, DEC-SUP-08      |

## 10.5 Ambiguidades que impedem conclusão segura

1. **DEC-SUP-02:** aprovar ou rejeitar explicitamente para RF07a/RF07b `page=1`, `size=20`, `1<=size<=100`, `{data,pagination:{page,size,total,totalPages}}`, `totalPages=0` no vazio e página além do fim com `200/data=[]`; definir ordenação estável.
2. **DEC-SUP-07:** escolher formato externo (`DD/MM/YYYY`, `YYYY-MM-DD` ou ISO timestamp), timezone, inclusividade de `startDate`, fim inclusivo ou limite exclusivo do dia seguinte, campo temporal (presumido `createdAt`), limite isolado permitido e resultado de `startDate > endDate` (`422`?).
3. **DEC-SUP-08/filtros:** decidir `AND`, igualdade exata de `number`, formato numérico aceito no query, repetição de parâmetro, datas inválidas e fechamento do catálogo de `422`.

Não converter exemplos de datas em norma; não tratar a decisão RF03 como global; não deduzir OR ou busca parcial. Se a regra de `Department.active` for refinada, preservar P1 e P6 sem excluir ticket histórico autorizado por default.

# 11. Conclusão e publicação

**Veredito:** `RF07_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION`. Support 0.9 **não** está congelado. `RF07a NOT_IMPLEMENTED`, `RF07b NOT_IMPLEMENTED`, `feat/support-rf07-list-tickets NOT_CREATED`. Nenhum executável foi alterado e RF08 não foi iniciada.

Publicação canônica: branch `docs/support-rf07-checkpoint`, commit `775f349b6393933787507c7314e09702d0f8c817` publicado em `origin`; fonte original intacta. Serviço: branch documental `docs/support-rf07-list-tickets-checkpoint` isolada de `main` RF06, com gitlink explícito para esse commit canônico. O próximo passo é resolver **somente** as decisões RF07a/RF07b da seção 10.5; depois atualizar PRD/TDD/TP, congelar o contrato e só então considerar uma branch funcional.

Validação deste checkpoint: `git diff --check`, `git -C luciluci-docs diff --check` e `npm run format:check` passaram. O `format:check` usou o binário Prettier já instalado em outra worktree local, sem instalação de dependências nesta worktree. O diff do serviço contém apenas Markdown e gitlink; o submódulo não contém alterações pendentes após seu commit.
