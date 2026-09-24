# REPORT - Avaliação de completude do microserviço

**status:** `MAIN_BASELINE_RF04 / RF05_CONTRACT_CHECKPOINT_READY / CONTRACT_FROZEN_NOT_IMPLEMENTED`
**generated_by:** Codex
**generated_at:** `2026-09-17T18:06:21Z`
**review_mode:** final / RF05 contract resolution
**microservice:** `support-ms`
**repository_ref:** `main` / `04f4f8eb0f9c741fae7947a370fb50c121d8a624`, worktree documental modificada
**documentation_ref:** `luciluci-docs` / `docs/support-rf05-contract` / `cc9a4399d210114e3c8261f3c153f8339c049ffb`
**report_file:** `docs/reports/REPORT-SUPPORT-RF05-CONTRACT-20260917-180621.md`
**reviewer:** não informado

# 1. Resumo executivo

- RFs documentadas encontradas: 14 operações (RF01–RF13, com RF07a/RF07b).
- RFs classificadas como **Implementado**: 4 (RF01–RF04).
- RFs classificadas como **Parcial**: 0.
- RFs classificadas como **Não encontrado**: 10 (RF05–RF13).
- RFs classificadas como **Ambíguo** no recorte RF05: 0.
- RFs com matriz unit + integration + functional/prova completa: 4.
- NFRs classificados como gap real local neste fechamento: 0.

As cinco decisões que bloqueavam RF05 foram resolvidas por orientação explícita:
sequence PostgreSQL gapful, mensagem inicial visível, `201` somente com Ticket,
Department inativo como `422` e normalização de `mediaIds`. A revisão Support
0.7 foi publicada no commit
`cc9a4399d210114e3c8261f3c153f8339c049ffb`.

RF05 agora está `CONTRACT_FROZEN / NOT_IMPLEMENTED`. Nenhum arquivo executável,
OpenAPI, migration, teste ou branch funcional foi criado.

# 2. Escopo e fontes analisadas

Fontes:

- PRD original preservado em `luciluci-docs/support/sources/prd-original.md`;
- `luciluci-docs/support/{README,prd,notes,tdd,tp,dependencies}.md`;
- checkpoint histórico
  `docs/reports/REPORT-SUPPORT-RF05-CHECKPOINT-20260917-174742.md`;
- `ACTUAL_STATE.md`, `DRIFT_REPORT.md`, READMEs e política de branches;
- baseline executável RF01–RF04 somente para convenções técnicas já provadas.

Execução desta rodada:

- atualização e publicação exclusivamente documental;
- nenhuma suíte funcional, coverage, migration ou processo RF05 executado;
- CI remoto da PR #3 permanece evidência histórica de RF04, não de RF05.

# 3. Matriz principal RF x implementação

| RF        | Título                     | Endpoint                                         | Status                             | Evidência/observação                 |
| --------- | -------------------------- | ------------------------------------------------ | ---------------------------------- | ------------------------------------ |
| RF01      | Criar Departamento         | `POST /api/support/departments`                  | Implementado                       | código/testes/proof RF01             |
| RF02      | Editar Departamento        | `PATCH /api/support/departments/{departmentId}`  | Implementado                       | código/testes/proof RF02             |
| RF03      | Listar Departamentos       | `GET /api/support/departments`                   | Implementado                       | código/testes/proof RF03             |
| RF04      | Excluir Departamento       | `DELETE /api/support/departments/{departmentId}` | Implementado                       | código/testes/proof RF04/PR #3       |
| RF05      | Criar Ticket               | `POST /api/support/tickets`                      | Não encontrado; contrato congelado | revisão canônica 0.7; nenhum runtime |
| RF06–RF13 | demais operações canônicas | conforme PRD                                     | Não encontrado                     | fora deste lote                      |

# 4. Checklist consolidado por PRD

- [x] Ticket e mensagem inicial permanecem atômicos.
- [x] Defaults, autoria derivada e auditoria única foram preservados.
- [x] As cinco decisões adicionais estão rotuladas como posteriores ao PRD.
- [x] Department histórico permanece referenciável após soft delete.
- [ ] RF05 não está implementada.
- [ ] RF06–RF13 não foram iniciadas.

# 5. Checklist consolidado por TDD

- [x] `Ticket.number`: sequence/identity global, inicia em `1`, gaps permitidos,
      sem reuso, contador de aplicação ou lock global.
- [x] Mensagem inicial: `isVisibleToRequester=true`.
- [x] `mediaIds`: opcional, default `[]`, ordem e duplicatas preservadas.
- [x] Response: `201` somente com Ticket completo, sem `Location` obrigatório.
- [x] Department: inexistente `404`; inativo `422 department_inactive`.
- [x] Ticket, Message e AuditLog compartilham transação e lock do Department.
- [x] Modelo mínimo futuro de quatro tabelas do agregado está delimitado.
- [ ] Nenhuma dessas estruturas existe no runtime atual.

# 6. Checklist consolidado por TP

- [x] Casos planejados RF05 foram atualizados para as decisões 0.7.
- [x] Concorrência RF04/RF05, sequence gapful e rollback estão rastreados.
- [x] Response, erro de inativo e preservação de mídias possuem critérios.
- [ ] Unit RF05: não criado/não executado.
- [ ] Integration RF05: não criado/não executado.
- [ ] Functional RF05: não criado/não executado.
- [ ] Contract RF05: não criado/não executado.

## 6.1 Matriz obrigatória RF -> testes

| RF        | Unit                                 | Integration                 | Functional                     | Agrupamento/exceção           | Status               |
| --------- | ------------------------------------ | --------------------------- | ------------------------------ | ----------------------------- | -------------------- |
| RF01      | `create-department.use-case.spec.ts` | `create-department.spec.ts` | `proof:rf01:postgres`          | FU agregado                   | completa com exceção |
| RF02      | `update-department.use-case.spec.ts` | `update-department.spec.ts` | `proof:rf02:postgres`          | lock/rollback                 | completa             |
| RF03      | `list-departments.use-case.spec.ts`  | `list-departments.spec.ts`  | `proof:rf03:postgres`          | regressão posterior           | completa             |
| RF04      | `delete-department.use-case.spec.ts` | `delete-department.spec.ts` | `proof:rf04:postgres` + imagem | CI remoto PR #3               | completa             |
| RF05      | planejado                            | planejado                   | planejado                      | contrato 0.7, runtime ausente | ausente / NOT_RUN    |
| RF06–RF13 | ausente                              | ausente                     | ausente                        | fora do lote                  | ausente              |

# 7. Inventário de endpoints reais

| Método | Path                                      | RF   | Status       |
| ------ | ----------------------------------------- | ---- | ------------ |
| POST   | `/api/support/departments`                | RF01 | Implementado |
| PATCH  | `/api/support/departments/{departmentId}` | RF02 | Implementado |
| GET    | `/api/support/departments`                | RF03 | Implementado |
| DELETE | `/api/support/departments/{departmentId}` | RF04 | Implementado |

`POST /api/support/tickets` não está registrado. `/health`, `/metrics`,
`/api-docs` e `/api-docs-json` continuam superfícies operacionais herdadas, não
RFs do domínio.

# 8. Fronteira NFR e capacidades transversais

## 8.1 Matriz obrigatória de fronteira NFR

| Item                        | Categoria                    | Estado                                                | Gap real local? |
| --------------------------- | ---------------------------- | ----------------------------------------------------- | --------------- |
| correlação/error mapping    | implementado localmente      | baseline pronta para reuso                            | não             |
| PostgreSQL/lock/atomicidade | implementado localmente      | estratégia RF05 congelada; runtime ausente por escopo | não             |
| autenticação/RBAC amplo     | upstream/plataforma          | BFF                                                   | não             |
| eventos/mensageria          | fora do escopo desta release | nenhum evento Support                                 | não             |
| OpenTelemetry/DLQ/redrive   | compartilhado/fora do escopo | sem decisão local RF05                                | não             |

## 8.2 Capacidades transversais

O contrato reutiliza correlação e envelopes locais, mas não ativa idempotência
HTTP, evento, outbox ou integração Files. `mediaIds` permanece referência opaca.

# 9. Cobertura de testes

Não houve execução de testes ou coverage nesta rodada documental. Os 109 testes
históricos RF04 não são prova RF05 e não foram reatribuídos. RF05 permanece com
casos planejados e `NOT_RUN` até o lote funcional.

# 10. Divergências

## 10.1 Documentação prevê, código não comprova

RF05 possui contrato congelado e ainda não possui código, OpenAPI, migration ou
testes. Essa ausência é o estado esperado desta rodada.

## 10.2 Código existe, documentação não comprova

Nenhuma divergência nova.

## 10.3 `ACTUAL_STATE.md` afirma, código não comprova

Nenhuma: o estado declara explicitamente `CONTRACT_FROZEN / NOT_IMPLEMENTED`.

## 10.4 PRD / TDD / TP divergem entre si

Nenhuma divergência bloqueante no recorte RF05 após a revisão 0.7.

## 10.5 Ambiguidades que impedem conclusão segura

Nenhuma para implementar RF05. Decisões de RF06–RF13 permanecem abertas apenas
nos seus recortes.

# 11. Conclusão

Estado final: `RF05_CONTRACT_CHECKPOINT_READY`.

Revisão Support 0.7 publicada; gitlink local avançado para
`cc9a4399d210114e3c8261f3c153f8339c049ffb`. Nenhuma implementação RF05 foi
iniciada. Próxima ação única: abrir lote explícito de implementação RF05 em
`feat/support-rf05-create-ticket`.
