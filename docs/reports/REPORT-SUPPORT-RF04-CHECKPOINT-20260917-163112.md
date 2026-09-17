# REPORT - Avaliação de completude do microserviço

**status:** `RF04_CONTRACT_CHECKPOINT_READY`
**generated_by:** Codex
**generated_at:** `2026-09-17T16:31:12Z`
**review_mode:** final / merge RF03 + contract checkpoint RF04
**microservice:** `support-ms`
**repository_ref:** `main` / `0ca1eab9fcc74a4254b710fd12342d761234e9ff`, worktree documental modificada
**documentation_ref:** `luciluci-docs` branch `docs/support-rf04-contract` / `864e02a9885852a6c6f6a385c3301e9a757edb60`
**report_file:** `docs/reports/REPORT-SUPPORT-RF04-CHECKPOINT-20260917-163112.md`
**reviewer:** não informado

# 1. Resumo executivo

- RFs documentadas encontradas: 14 operações (RF01–RF13, com RF07a/RF07b).
- RFs implementadas e provadas: 3 (RF01–RF03).
- RFs parciais ou ambíguas: 0.
- RFs sem runtime: 11 (RF04–RF13, com RF07a/RF07b).
- RFs com tríade unit + integration + functional/prova justificada: 3.
- Gap real local novo: 0.

A PR #2 foi revalidada e integrada. O head final
`95e720176b1a84933467fab6e64b9c9d83c0cd1e` teve CI remoto concluído com
sucesso e gerou o merge `0ca1eab9fcc74a4254b710fd12342d761234e9ff`, que
estabelece `MAIN_BASELINE_RF03`.

O checkpoint seguinte congelou somente o contrato RF04. A revisão canônica 0.6
foi publicada no commit `864e02a9885852a6c6f6a385c3301e9a757edb60`.
Nenhuma rota, use case, migration, OpenAPI, `api.http` ou teste RF04 foi criado.

# 2. Escopo e fontes analisadas

Foram analisados `AGENTS.md`, `AI_FIRST.md`, `ACTUAL_STATE.md`,
`DRIFT_REPORT.md`, `README.md`, a política de branches, os reports RF02/RF03,
o inventário real em `src/`, `tests/`, OpenAPI e `api.http`, além de
`luciluci-docs/support/{README,prd,notes,tdd,tp,dependencies}.md` e da fonte
preservada `support/sources/prd-original.md`.

| Requisito RF04                                                 | Fonte/autoridade                         | Classificação                                       |
| -------------------------------------------------------------- | ---------------------------------------- | --------------------------------------------------- |
| `DELETE /api/support/departments/{departmentId}`               | PRD original/transposto                  | funcional recebido                                  |
| soft delete por `active=false`                                 | PRD original/transposto                  | funcional recebido                                  |
| tickets antigos preservam referência e funcionamento           | PRD original/transposto, P1              | funcional recebido                                  |
| Department inativo não pode ser escolhido em ticket novo       | PRD original/transposto, P1              | funcional recebido; execução pertence à futura RF05 |
| não gerar AuditLog                                             | PRD original/transposto                  | funcional recebido                                  |
| correlação, UUID v4, envelopes 400/422/404/500                 | kernel e contratos RF01/RF02 comprovados | herdado                                             |
| `204`, repetição sem write, body rejeitado e lock transacional | revisão 0.6                              | decisão técnica posterior explícita                 |

Não foram executados testes locais de runtime neste checkpoint documental. A
evidência remota observada foi o workflow `ci`, run `35246564818`, trigger da PR
#2, head SHA `95e720176b1a84933467fab6e64b9c9d83c0cd1e`, status `completed`,
conclusão `success`: https://github.com/leonardodecuritiba/luciluci-support-ms/actions/runs/35246564818.

# 3. Matriz principal RF x implementação

| RF    | Título                          | Endpoint/contrato                                | Status                                     | Evidência                                    |
| ----- | ------------------------------- | ------------------------------------------------ | ------------------------------------------ | -------------------------------------------- |
| RF01  | Criar Departamento              | `POST /api/support/departments`                  | Implementado                               | código, OpenAPI, testes e prova RF01         |
| RF02  | Editar Departamento             | `PATCH /api/support/departments/{departmentId}`  | Implementado                               | código, OpenAPI, testes e prova RF02         |
| RF03  | Listar Departamentos            | `GET /api/support/departments`                   | Implementado                               | código, OpenAPI, testes, prova RF03 e PR #2  |
| RF04  | Excluir Departamento            | `DELETE /api/support/departments/{departmentId}` | Contrato congelado; runtime não encontrado | revisão canônica 0.6; endpoint segue ausente |
| RF05  | Criar Ticket                    | contrato canônico                                | Não encontrado                             | fora do lote                                 |
| RF06  | Editar Ticket                   | contrato canônico                                | Não encontrado                             | fora do lote                                 |
| RF07a | Listar Tickets do Solicitante   | contrato canônico                                | Não encontrado                             | fora do lote                                 |
| RF07b | Listar Tickets (Admin)          | contrato canônico                                | Não encontrado                             | fora do lote                                 |
| RF08  | Finalizar Ticket (solicitante)  | contrato canônico                                | Não encontrado                             | fora do lote                                 |
| RF09  | Buscar Ticket por ID            | contrato canônico                                | Não encontrado                             | fora do lote                                 |
| RF10  | Criar Mensagem do Ticket        | contrato canônico                                | Não encontrado                             | fora do lote                                 |
| RF11  | Editar Visibilidade da Mensagem | contrato canônico                                | Não encontrado                             | fora do lote                                 |
| RF12  | Listar Mensagens do Ticket      | contrato canônico                                | Não encontrado                             | fora do lote                                 |
| RF13  | Listar Histórico (genérico)     | contrato canônico                                | Não encontrado                             | fora do lote                                 |

# 4. Checklist consolidado por PRD

- [x] RF01–RF03 implementadas, provadas e integradas.
- [x] RF04 preserva path, soft delete, tickets antigos e auditoria zero.
- [x] A fonte original permaneceu inalterada.
- [ ] RF04 ainda não possui runtime.
- [ ] RF05–RF13 não foram iniciadas.

# 5. Checklist consolidado por TDD

| Tópico RF04         | Decisão                                                       | Estado/origem                       |
| ------------------- | ------------------------------------------------------------- | ----------------------------------- |
| sucesso             | `204 No Content`, sem body                                    | congelado; decisão técnica nova     |
| repetição           | já inativo retorna `204`, sem write e sem renovar `updatedAt` | congelado; DEC-SUP-06               |
| mutação efetiva     | `active=false` e `updatedAt` renovado                         | congelado; PRD + decisão técnica    |
| autorização         | sem ACL fina/ator local; RBAC amplo no BFF                    | herdado; DEC-SUP-01/03              |
| identificação/erros | UUID v4; 400/422/404/500                                      | herdado; DEC-SUP-08/09              |
| persistência        | preservar linha e memberships; sem cascade/restore            | congelado; PRD + DEC-SUP-12         |
| concorrência        | transação e lock pessimista compartilhado com RF02            | congelado; decisão técnica nova     |
| idempotência        | sem `X-Idempotency-Key`; idempotência apenas semântica        | congelado; DEC-SUP-10               |
| efeitos             | sem AuditLog, evento, outbox ou migration                     | PRD/herdado                         |
| RF05 concorrente    | seleção ativa versus RF04                                     | aberta para RF05; não bloqueia RF04 |

DEC-SUP-01/03/06/08/09/10/12 estão `RESOLVED_FOR_RF04`. DEC-SUP-02 não se
aplica ao DELETE; DEC-SUP-11 mantém a ausência de mensageria definida em S1.
As decisões de tickets, mensagens, datas, transferência e paginações futuras
permanecem abertas em seus próprios recortes.

# 6. Checklist consolidado por TP

- [x] Casos RF04 foram definidos para sucesso, repetição, erros, preservação,
      ausência de efeitos e concorrência RF02/RF04.
- [ ] Unit RF04: planejado, não criado/não executado.
- [ ] Integration RF04: planejado, não criado/não executado.
- [ ] Functional RF04: planejado, não criado/não executado.
- [ ] Contract RF04: planejado, não criado/não executado.

## 6.1 Matriz obrigatória RF -> testes

| RF    | Unit                                                       | Integration                                              | Functional                              | Agrupamento/exceção                      | Status               |
| ----- | ---------------------------------------------------------- | -------------------------------------------------------- | --------------------------------------- | ---------------------------------------- | -------------------- |
| RF01  | `tests/unit/department/create-department.use-case.spec.ts` | `tests/integration/department/create-department.spec.ts` | `proof:rf01:postgres`                   | FU-SUP-01 completo depende de RF04/RF05  | completa com exceção |
| RF02  | `tests/unit/department/update-department.use-case.spec.ts` | `tests/integration/department/update-department.spec.ts` | `proof:rf02:postgres`                   | inclui lock/rollback                     | completa             |
| RF03  | `tests/unit/department/list-departments.use-case.spec.ts`  | `tests/integration/department/list-departments.spec.ts`  | `proof:rf03:postgres` + smoke de imagem | FU-SUP-01 completo depende de RF04/RF05  | completa com exceção |
| RF04  | planejado                                                  | planejado                                                | planejado                               | contrato congelado, runtime não iniciado | ausente / NOT_RUN    |
| RF05  | ausente                                                    | ausente                                                  | ausente                                 | fora do lote                             | ausente              |
| RF06  | ausente                                                    | ausente                                                  | ausente                                 | fora do lote                             | ausente              |
| RF07a | ausente                                                    | ausente                                                  | ausente                                 | fora do lote                             | ausente              |
| RF07b | ausente                                                    | ausente                                                  | ausente                                 | fora do lote                             | ausente              |
| RF08  | ausente                                                    | ausente                                                  | ausente                                 | fora do lote                             | ausente              |
| RF09  | ausente                                                    | ausente                                                  | ausente                                 | fora do lote                             | ausente              |
| RF10  | ausente                                                    | ausente                                                  | ausente                                 | fora do lote                             | ausente              |
| RF11  | ausente                                                    | ausente                                                  | ausente                                 | fora do lote                             | ausente              |
| RF12  | ausente                                                    | ausente                                                  | ausente                                 | fora do lote                             | ausente              |
| RF13  | ausente                                                    | ausente                                                  | ausente                                 | fora do lote                             | ausente              |

# 7. Inventário de endpoints reais

| Método | Path                                      | RF   | Estado                      |
| ------ | ----------------------------------------- | ---- | --------------------------- |
| POST   | `/api/support/departments`                | RF01 | Implementado                |
| PATCH  | `/api/support/departments/{departmentId}` | RF02 | Implementado                |
| GET    | `/api/support/departments`                | RF03 | Implementado                |
| DELETE | `/api/support/departments/{departmentId}` | RF04 | Ausente; contrato congelado |

`GET /health`, `/metrics`, `/api-docs` e `/api-docs-json` continuam superfícies
operacionais herdadas, não RFs do domínio. Nenhum endpoint RF05–RF13 existe.

# 8. Fronteira NFR e capacidades transversais

## 8.1 Matriz obrigatória de fronteira NFR

| Item                               | Classificação                | Estado/evidência                         | Gap real local?      |
| ---------------------------------- | ---------------------------- | ---------------------------------------- | -------------------- |
| correlação/error mapping           | implementado localmente      | provado em RF01–RF03; contratado em RF04 | não                  |
| PostgreSQL/lock                    | implementado localmente      | RF02 provado; RF04 planejado             | não neste checkpoint |
| RBAC amplo                         | upstream/plataforma          | BFF/borda                                | não                  |
| eventos/broker                     | fora do escopo desta release | nenhum evento Support                    | não                  |
| OpenTelemetry/DLQ/redrive          | compartilhado/fora do escopo | sem decisão local RF04                   | não                  |
| segurança/performance automatizada | fora do escopo desta release | não exigida pelo checkpoint              | não                  |

## 8.2 Capacidades transversais

O schema existente de Department já contém `active` e `updatedAt`; RF04 não
requer migration ou índice. O kernel de idempotência permanece inativo. O seed
W1 segue bloqueado e não foi reclassificado. Não houve mudança em mensageria,
observabilidade, deploy ou infraestrutura.

# 9. Cobertura de testes

O CI remoto da PR #2 passou sobre o head final e executou os gates da RF03. Este
checkpoint RF04 alterou somente documentação e gitlink: não foram executadas nem
atribuídas a RF04 suítes funcionais existentes. As provas históricas de RF03
permanecem no report `REPORT-SUPPORT-RF03-20260917-155713.md`.

# 10. Divergências

## 10.1 Documentação prevê, código não comprova

RF04 agora possui contrato integral para o slice, mas continua deliberadamente
ausente do runtime. RF05–RF13 seguem previstas e não implementadas.

## 10.2 Código existe, documentação não comprova

Nenhuma divergência nova encontrada.

## 10.3 `ACTUAL_STATE.md` afirma, código não comprova

Nenhuma. O estado diferencia contrato RF04 congelado de implementação ausente.

## 10.4 PRD / TDD / TP divergem entre si

Nenhuma divergência bloqueante no recorte RF04 após a revisão 0.6. Decisões
técnicas posteriores estão identificadas e a fonte original não foi editada.

## 10.5 Ambiguidades que impedem conclusão segura

Nenhuma para congelar RF04. A concorrência da futura RF05 com a inativação e as
demais `DEC-SUP-*` abertas permanecem bloqueios apenas de slices posteriores.

## 10.6 Documentação e publicação do checkpoint

No serviço foram atualizados `ACTUAL_STATE.md`, `DRIFT_REPORT.md`, `README.md`,
`AGENTS.md`, `AI_FIRST.md`, `docs/README.md`, `docs/reports/README.md`, a política
de branches, este report e o gitlink. Na documentação canônica foram atualizados
`support/README.md`, `prd.md`, `notes.md`, `tdd.md` e `tp.md`.

A branch `docs/support-rf04-contract` foi publicada sem force no SHA
`864e02a9885852a6c6f6a385c3301e9a757edb60`; o remoto foi conferido nesse mesmo
SHA. Não foi aberta PR documental, pois a execução não encontrou política que a
exigisse. A branch funcional RF04 foi deliberadamente não criada.

# 11. Conclusão

Estado final: `RF04_CONTRACT_CHECKPOINT_READY`.

- PR #2: `MERGED` em `0ca1eab9fcc74a4254b710fd12342d761234e9ff`.
- baseline: `MAIN_BASELINE_RF03` confirmada em `main` e `origin/main`.
- documentação 0.6: publicada em `docs/support-rf04-contract`, commit
  `864e02a9885852a6c6f6a385c3301e9a757edb60`.
- gitlink local: avançado somente para esse commit remoto comprovado.
- branch funcional RF04: não criada.
- próximo passo autorizado: abrir lote explícito de implementação RF04 em
  `feat/support-rf04-delete-department`.
