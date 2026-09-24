# REPORT - Avaliação de completude do microserviço

**status:** `MAIN_BASELINE_RF04 / RF05_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION`
**generated_by:** Codex
**generated_at:** `2026-09-17T17:47:42Z`
**review_mode:** wave-2 / merge RF04 + RF05 contract checkpoint
**microservice:** `support-ms`
**repository_ref:** `main` / `04f4f8eb0f9c741fae7947a370fb50c121d8a624`, worktree documental modificada
**documentation_ref:** `luciluci-docs` base `864e02a9885852a6c6f6a385c3301e9a757edb60`, branch local `docs/support-rf05-checkpoint`, não publicada
**report_file:** `docs/reports/REPORT-SUPPORT-RF05-CHECKPOINT-20260917-174742.md`
**reviewer:** não informado

# 1. Resumo executivo

- RFs documentadas encontradas: 14 operações (RF01–RF13, com RF07a/RF07b).
- RFs classificadas como **Implementado**: 4 (RF01–RF04).
- RFs classificadas como **Parcial**: 0.
- RFs classificadas como **Não encontrado**: 10 (RF05–RF13, incluindo RF07a/RF07b).
- RFs classificadas como **Ambíguo**: 1 no contrato (RF05).
- RFs com matriz unit + integration + functional/prova completa: 4.
- NFRs classificados como gap real local neste checkpoint: 0.

A PR #3 foi revalidada e integrada por merge commit. O check remoto `quality`
estava concluído com sucesso no head
`e61a6ed2fb9796a202f41c9b00f9188afa7f737b`, sem reviews, solicitações de
review ou threads pendentes. `main` e `origin/main` apontam para o merge
`04f4f8eb0f9c741fae7947a370fb50c121d8a624`, estabelecendo
`MAIN_BASELINE_RF04`.

O checkpoint RF05 confirmou as regras recebidas para criação atômica de
Ticket, mensagem inicial e uma única auditoria `criacao_ticket`, mas encontrou
cinco decisões sem autoridade suficiente: geração de `Ticket.number`,
visibilidade inicial da mensagem, response `201`, erro para Department inativo
e normalização de `mediaIds`. Portanto, não há revisão 0.7 congelada, publicação
documental, gitlink novo, branch funcional ou implementação RF05.

# 2. Escopo e fontes analisadas

Fontes canônicas e históricas:

- `luciluci-docs/support/{README,prd,notes,tdd,tp,dependencies}.md`;
- `luciluci-docs/support/sources/prd-original.md`, preservado sem alteração;
- guias globais de API, arquitetura e qualidade em `luciluci-docs`;
- serviços canônicos usados somente para detectar convenções divergentes;
- `AI_FIRST.md`, `ACTUAL_STATE.md`, `README.md`, `DRIFT_REPORT.md` e política
  de branches;
- reports de checkpoint, implementação e publicação de RF01–RF04;
- código, OpenAPI, `api.http`, migrations, scripts, testes e workflow atuais.

A pesquisa encontrou sequence PostgreSQL gapful como decisão específica de
Payments, não norma transversal. Também encontrou responses `201` com shapes
divergentes. `X-Idempotency-Key` é transversal somente quando aplicável, não
uma obrigação universal para todo create.

Execução neste checkpoint:

- revisão integral do diff remoto da PR #3 e de sua evidência de CI;
- merge da PR #3 e fast-forward local de `main`;
- edição exclusivamente documental para registrar o bloqueio RF05;
- nenhuma suíte RF05 criada ou executada e nenhum resultado histórico
  reatribuído à RF05.

Evidência remota de CI/CD:

- `workflow_file`: `.github/workflows/ci.yml`;
- `workflow_name`: `ci`;
- `workflow_versioned_present`: sim;
- `remote_run_evidence`: comprovado para a PR #3;
- `remote_run_trigger`: pull request #3;
- `remote_head_sha`: `e61a6ed2fb9796a202f41c9b00f9188afa7f737b`;
- `remote_status`: completed;
- `remote_conclusion`: success;
- `failed_job`, `failed_step`, `error_summary`: n/a.

# 3. Matriz principal RF x implementação

| RF    | Título                          | Endpoint                                         | Status                              | Evidência/observação                         |
| ----- | ------------------------------- | ------------------------------------------------ | ----------------------------------- | -------------------------------------------- |
| RF01  | Criar Departamento              | `POST /api/support/departments`                  | Implementado                        | código, OpenAPI, testes e proof RF01         |
| RF02  | Editar Departamento             | `PATCH /api/support/departments/{departmentId}`  | Implementado                        | código, lock, testes e proof RF02            |
| RF03  | Listar Departamentos            | `GET /api/support/departments`                   | Implementado                        | código, OpenAPI, testes e proof RF03         |
| RF04  | Excluir Departamento            | `DELETE /api/support/departments/{departmentId}` | Implementado                        | código, testes, proof RF04, PR #3 e CI verde |
| RF05  | Criar Ticket                    | `POST /api/support/tickets` planejado            | Não encontrado / contrato bloqueado | cinco decisões abertas; nenhum runtime       |
| RF06  | Editar Ticket                   | contrato canônico                                | Não encontrado                      | fora do checkpoint                           |
| RF07a | Listar Tickets do Solicitante   | contrato canônico                                | Não encontrado                      | fora do checkpoint                           |
| RF07b | Listar Tickets (Admin)          | contrato canônico                                | Não encontrado                      | fora do checkpoint                           |
| RF08  | Finalizar Ticket (solicitante)  | contrato canônico                                | Não encontrado                      | fora do checkpoint                           |
| RF09  | Buscar Ticket por ID            | contrato canônico                                | Não encontrado                      | fora do checkpoint                           |
| RF10  | Criar Mensagem do Ticket        | contrato canônico                                | Não encontrado                      | fora do checkpoint                           |
| RF11  | Editar Visibilidade da Mensagem | contrato canônico                                | Não encontrado                      | fora do checkpoint                           |
| RF12  | Listar Mensagens do Ticket      | contrato canônico                                | Não encontrado                      | fora do checkpoint                           |
| RF13  | Listar Histórico                | contrato canônico                                | Não encontrado                      | fora do checkpoint                           |

# 4. Checklist consolidado por PRD

- [x] RF01–RF04 estão implementadas, provadas e integradas.
- [x] RF05 cria Ticket e mensagem inicial atomicamente.
- [x] O Ticket nasce com `adminStatus=pendente` e
      `requesterStatus=nao_resolvido`.
- [x] `authorId` e `type` da mensagem inicial derivam do solicitante.
- [x] RF05 gera exatamente uma auditoria `criacao_ticket`, sem
      `nova_mensagem` para a mensagem inicial.
- [x] Department inativo não pode ser selecionado.
- [!] O PRD não define número gapful/gapless, visibilidade inicial, shape do
  `201`, erro do Department inativo nem semântica detalhada de `mediaIds`.
- [ ] RF05 não foi implementada.
- [ ] RF06–RF13 não foram iniciadas neste lote.

# 5. Checklist consolidado por TDD

Regras fechadas para RF05:

- [x] Somente `X-Correlation-ID` é exigido localmente; autenticação e RBAC
      amplo permanecem no BFF.
- [x] IDs locais de Ticket, TicketMessage e AuditLog são UUID v4; IDs externos
      são strings opacas, sem validação remota ou FK local.
- [x] O fluxo deve usar uma transação para Ticket, mensagem inicial e AuditLog.
- [x] A seleção de Department deve observar `active=true` após lock pessimista
      compatível com RF02/RF04.
- [x] Não há idempotência HTTP na RF05; retry válido cria outro Ticket.
- [x] Não há evento de negócio Support, outbox ou mensageria no slice.
- [!] A estratégia técnica não resolve as cinco decisões contratuais abertas.
- [ ] Não existem route, DTO, use case, schema, migration, repository ou
      OpenAPI RF05.

# 6. Checklist consolidado por TP

- [x] O TP registra os casos a provar quando o contrato puder ser congelado.
- [x] O checkpoint separa casos derivados da fonte de expectativas ainda
      dependentes de decisão.
- [ ] Testes unitários RF05: não criados/não executados.
- [ ] Testes de integração RF05: não criados/não executados.
- [ ] Testes de contrato RF05: não criados/não executados.
- [ ] Prova funcional PostgreSQL RF05: não criada/não executada.

## 6.1 Matriz obrigatória RF -> testes

| RF        | Unit                                 | Integration                 | Functional                     | Agrupamento/exceção             | Status               |
| --------- | ------------------------------------ | --------------------------- | ------------------------------ | ------------------------------- | -------------------- |
| RF01      | `create-department.use-case.spec.ts` | `create-department.spec.ts` | `proof:rf01:postgres`          | FU-SUP-01 agregado              | completa com exceção |
| RF02      | `update-department.use-case.spec.ts` | `update-department.spec.ts` | `proof:rf02:postgres`          | lock/rollback real              | completa             |
| RF03      | `list-departments.use-case.spec.ts`  | `list-departments.spec.ts`  | `proof:rf03:postgres`          | regressão em provas posteriores | completa             |
| RF04      | `delete-department.use-case.spec.ts` | `delete-department.spec.ts` | `proof:rf04:postgres` + imagem | PR #3 e CI remoto               | completa             |
| RF05      | ausente                              | ausente                     | ausente                        | contrato bloqueado              | ausente              |
| RF06–RF13 | ausente                              | ausente                     | ausente                        | fora do checkpoint              | ausente              |

# 7. Inventário de endpoints reais

## Endpoints funcionais

| Método | Path                                      | Handler                       | RF   | Status       |
| ------ | ----------------------------------------- | ----------------------------- | ---- | ------------ |
| POST   | `/api/support/departments`                | `DepartmentController.create` | RF01 | Implementado |
| PATCH  | `/api/support/departments/{departmentId}` | `DepartmentController.update` | RF02 | Implementado |
| GET    | `/api/support/departments`                | `DepartmentController.list`   | RF03 | Implementado |
| DELETE | `/api/support/departments/{departmentId}` | `DepartmentController.delete` | RF04 | Implementado |

`POST /api/support/tickets` não está registrado. `/health`, `/metrics`,
`/api-docs` e `/api-docs-json` permanecem superfícies operacionais herdadas,
não RFs do domínio.

# 8. Fronteira NFR e capacidades transversais

## 8.1 Matriz obrigatória de fronteira NFR

| Item                               | Categoria                    | Estado no checkpoint                           | Gap real local? |
| ---------------------------------- | ---------------------------- | ---------------------------------------------- | --------------- |
| correlação/error mapping           | implementado localmente      | baseline comprovada; aplicável à futura RF05   | não             |
| atomicidade/lock PostgreSQL        | implementado localmente      | padrão local comprovado; desenho RF05 definido | não             |
| autenticação/RBAC amplo            | upstream/plataforma          | BFF; RF05 é exceção à ACL fina de Ticket       | não             |
| autorização fina posterior         | compartilhado                | não aplicável à criação RF05                   | não             |
| idempotência RF05                  | fora do escopo desta release | decisão explícita: ausente                     | não             |
| eventos/outbox/mensageria          | fora do escopo desta release | nenhum evento Support especificado             | não             |
| OpenTelemetry/DLQ/redrive          | compartilhado/fora do escopo | sem responsabilidade local RF05                | não             |
| segurança/performance automatizada | fora do escopo desta release | não exigida pelo checkpoint                    | não             |

## 8.2 Capacidades transversais

RF05 deve reutilizar o middleware de correlação e envelopes locais, mas isso
não autoriza criar o endpoint. A transação e o lock pessimista são decisões
técnicas posteriores coerentes com a baseline. Nenhum NFR transversal preenche
automaticamente as lacunas de negócio do contrato.

# 9. Cobertura de testes

Este checkpoint não alterou código executável e não criou ou executou testes
RF05. As provas de RF01–RF04 permanecem atribuídas aos seus reports. A única
evidência remota nova usada aqui é o check `quality` da PR #3, concluído com
sucesso no head RF04; ele comprova a integração RF04, não RF05.

Não foram recalculados percentuais de cobertura nem reatribuídas as 109
asserções históricas à RF05. A ausência de testes RF05 é esperada enquanto o
contrato estiver bloqueado.

# 10. Divergências

## 10.1 Documentação prevê, código não comprova

RF05–RF13 estão previstas no PRD e ausentes do runtime. Para RF05, a ausência é
deliberada: o contrato ainda contém cinco decisões abertas.

## 10.2 Código existe, documentação não comprova

Nenhuma divergência nova. As tabelas e componentes RF05 não existem.

## 10.3 `ACTUAL_STATE.md` afirma, código não comprova

Nenhuma. O estado diferencia `MAIN_BASELINE_RF04`, checkpoint RF05 bloqueado e
implementação RF05 ausente.

## 10.4 PRD / TDD / TP divergem entre si

Os documentos agora registram a mesma fronteira: regras recebidas preservadas,
decisões técnicas explicitamente classificadas e cinco questões abertas. A
fonte original não foi modificada.

## 10.5 Ambiguidades que impedem conclusão segura

1. `Ticket.number`: sequence global gapful com não reutilização ou numeração
   estritamente gapless.
2. `TicketMessage.isVisibleToRequester` da mensagem inicial: `true` ou `false`.
3. Resposta `201`: shape do body e presença/forma do header `Location`.
4. Department inativo: `404`, `422` ou outro erro explicitamente aprovado.
5. `message.mediaIds`: default quando omitido e política de ordem/duplicatas.

## 10.6 Publicação documental

As edições estão somente na branch local `docs/support-rf05-checkpoint`, ainda
no commit-base `864e02a9885852a6c6f6a385c3301e9a757edb60`. Não houve commit,
push, revisão 0.7 nem avanço do gitlink no repositório pai. Publicar um contrato
incompleto criaria uma falsa fonte canônica.

# 11. Conclusão

`MAIN_BASELINE_RF04` está confirmada no merge
`04f4f8eb0f9c741fae7947a370fb50c121d8a624`. O checkpoint RF05 preservou o que
é autoritativo e não converteu padrões de outros domínios em decisão Support.

Estado final: `RF05_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION`.

Próximo passo: resolver somente as cinco decisões RF05 registradas, antes de
congelar revisão, publicar documentação ou criar branch funcional.
