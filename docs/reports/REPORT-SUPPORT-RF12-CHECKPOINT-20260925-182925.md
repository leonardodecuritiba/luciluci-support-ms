# REPORT — Checkpoint contratual RF12 (List Ticket Messages)

- **status:** `RF12_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION`
- **generated_by:** Codex
- **generated_at:** 2026-09-25T18:29:25Z
- **review_mode:** wave-1 documental
- **microservice:** support-ms
- **repository_ref:** `docs/support-rf12-list-messages-checkpoint`, desde `MAIN_BASELINE_RF11` após a PR #13 (`7724382245545c5918262ebb66aff0d696b0a2b2`)
- **documentation_ref:** Support 0.13, gitlink `4958fd1840042200fd1a87e45d6a7f69d4011dcd`
- **report_file:** `docs/reports/REPORT-SUPPORT-RF12-CHECKPOINT-20260925-182925.md`
- **reviewer:** não designado

---

# 1. Resumo executivo

- O PRD possui 14 operações HTTP (RF07a/RF07b separadas). RF01–RF11, 12 operações, estão integradas em `MAIN_BASELINE_RF11`; RF12/RF13 permanecem sem runtime.
- A PR #13 documental foi integrada em 2026-09-25 no merge `7724382`: head `425cad5`, `ci / quality` sucesso no run `36171699704`, nenhuma review ou review thread. `main` local/remota coincidiram após fast-forward.
- RF12 define `GET /api/support/tickets/{ticketId}/messages`, filtro opcional `isVisibleToRequester`, paginação obrigatória, ACL geral do Ticket e nenhuma auditoria. A fonte não define a projeção de visibilidade por papel. `notes.md` marca DEC-SUP-01/02/04/08/09 abertas para RF12.
- Veredito: **bloqueado por decisão**. Support 0.14 não foi criado; o gitlink permanece 0.13. Nenhum teste RF12, migration, runtime ou deploy foi executado.
- Risco principal: omissão do filtro ou `false` pelo solicitante pode revelar conteúdo ou contagem de mensagens internas. `total` e página devem observar a mesma política após a decisão.

# 2. Escopo e fontes analisadas

Fonte de negócio: `luciluci-docs/support/sources/prd-original.md` §§2.3, 3, 4, 5/P1/P6, 6/RF12 e 7; transposição em `support/prd.md` §§5.1, 5.2, 7/RF12; `support/notes.md` DEC-SUP-01/02/04/08/09; `support/tdd.md` RF12 e §5.2; `support/tp.md` TC-SUP-RF12 e SEC-SUP-07; `support/README.md` e `dependencies.md`.

Estado e precedentes: `AGENTS.md`, `AI_FIRST.md`, `ACTUAL_STATE.md`, `DRIFT_REPORT.md`, `README.md`, `docs/workflows/support-development-branch-policy.md`; reports RF10 e RF11 de implementação, RF11 de contrato e checkpoint. Inventário read-only: `src/features/ticket/adapters/routes/ticket.routes.ts`, `src/shared/openapi/swagger.ts`, `docs/openapi/v1/support-api.json`, `src/shared/infrastructure/database/migrations/1768010000000-CreateSupportTickets.ts`, schemas e entidades de Message/Media. A fonte original foi preservada byte a byte.

Validação deste lote: `git diff --check`, `npm run format:check` e `git -C luciluci-docs diff --check`, com resultados na seção 9. Não executar testes RF12. CI remota observada somente para a PR #13: workflow `ci`, job `quality`, run [36171699704](https://github.com/leonardodecuritiba/luciluci-support-ms/actions/runs/36171699704), head `425cad5`, conclusão `success`; não é prova RF12.

# 3. Matriz principal RF x implementação

| RF          | Estado nesta baseline    | Evidência                                                                            | Limite                                      |
| ----------- | ------------------------ | ------------------------------------------------------------------------------------ | ------------------------------------------- |
| RF01–RF06   | Implementadas e provadas | Reports e rotas integradas                                                           | Provas históricas, não repetidas            |
| RF07a/RF07b | Implementadas e provadas | PR #7, rotas de listagem                                                             | Decisões de paginação exclusivas destas RFs |
| RF08–RF11   | Implementadas e provadas | PRs #8/#9/#10/#12 e reports                                                          | RF11 integrada na baseline `9387b3d`        |
| RF12        | Não implementada         | `ticket.routes.ts` só registra POST em `/:ticketId/messages`; OpenAPI só define POST | Contrato bloqueado                          |
| RF13        | Não implementada         | `/history` responde 404 por reserva de path                                          | Fora do recorte                             |

## Confronto da fonte RF12

| Tema               | PRD original                                                                                          | PRD transposto / TDD / TP                                                               | Conclusão deste checkpoint                                                 |
| ------------------ | ----------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Rota e operação    | GET `/api/support/tickets/{ticketId}/messages`                                                        | Preservadas                                                                             | Fechado pela fonte                                                         |
| Atores e ACL       | §4: admin por `allowedUserIds`; requester backoffice ou cd por ownership; P6 exclui `Department.type` | §5.2 preserva; TDD manda autorizar Ticket                                               | Regra base fechada; headers/validação local ainda exigem decisão RF12      |
| Department inativo | P1 mantém Tickets históricos operantes                                                                | P1 preservada                                                                           | Inatividade por si não remove acesso; membership atual continua necessária |
| Filtro             | Exemplo `isVisibleToRequester=true`; filtro boolean opcional                                          | TDD exige política por papel antes do total/página; TP SEC-SUP-07 cobre `false`/omitido | Semântica por papel **aberta**; filtro opcional não autoriza vazamento     |
| Paginação          | §3 exige paginação de todas as listas; exemplo `page=1&size=20`                                       | §5.1 declara defaults/envelope/limites RF03 e RF07 sem extensão à RF12                  | Paginação e nomes `page/size` fechados; detalhes **abertos**               |
| Ordem              | Não especificada                                                                                      | DEC-SUP-02 propõe `createdAt ASC,id ASC` para mensagens                                 | Candidata, não aprovada                                                    |
| Item               | Entidade TicketMessage contém 8 campos, inclusive `mediaIds`                                          | RF10/RF11 retornam oito campos; RF12 não define projeção                                | Shape RF12 **aberto**                                                      |
| Media              | `mediaIds` na entidade; sem exemplo RF12                                                              | Schema RF05 usa `position`; RF10/RF11 preservam ordem/duplicatas                        | Preservar dados se retornados; inclusão/estratégia RF12 **aberta**         |
| Response/erros     | Não traz exemplo nem status de sucesso RF12                                                           | DEC-SUP-08/09 abertas; TP só planeja testes                                             | Envelope e matriz HTTP **abertos**                                         |
| Auditoria          | RF12 e tabela §7: nenhuma                                                                             | TDD: leitura sem auditoria/evento                                                       | Fechado pela fonte; não criar evento Support                               |

# 4. Checklist consolidado por PRD

- [x] Rota, método, filtro opcional, paginação, ACL geral e ausência de AuditLog identificados na fonte.
- [x] P1/P6 preservam Ticket histórico e excluem `Department.type` da autorização.
- [!] Omitir filtro ou solicitar `false` não tem semântica de segurança aprovada para requester.
- [!] Ordem, item, envelope, defaults/limites e erros não são definidos pelo PRD original.
- [ ] Não há base contratual para congelar Support 0.14 nem liberar RF12.

# 5. Checklist consolidado por TDD

- [x] TDD RF12 exige aplicar política de visibilidade antes do total e paginação e proíbe tratar filtro omitido como acesso irrestrito do solicitante.
- [x] Migration RF05 já contém `ticket_messages` e `ticket_message_media` com `position`; nenhum dado novo foi identificado como necessidade de schema.
- [!] DEC-SUP-01/02/04/08/09 permanecem pendentes para RF12. Reusar detalhe RF07/RF10/RF11 seria extensão não aprovada.
- [ ] Não há rota GET RF12, use case, controller, DTO, contrato OpenAPI ou `api.http` RF12; ausência esperada neste checkpoint.

# 6. Checklist consolidado por TP

- [x] `TC-SUP-RF12` e `SEC-SUP-07` planejam filtro `true|false|omitido`, total, ACL, ordenação e auditoria zero.
- [ ] Nenhum teste RF12 foi escrito ou executado neste lote.
- [!] Os casos planejados dependem da decisão DEC-SUP-04 antes de poderem ter resultado esperado completo.

## 6.1 Matriz RF → testes

| RF          | Unit                          | Integration                   | Functional                                                   | Estado          |
| ----------- | ----------------------------- | ----------------------------- | ------------------------------------------------------------ | --------------- |
| RF01–RF06   | Reports históricos de cada RF | Reports históricos de cada RF | Provas PostgreSQL/HTTP históricas                            | Não repetidas   |
| RF07a/RF07b | Report RF07                   | Report RF07                   | Prova PostgreSQL RF07                                        | Não repetida    |
| RF08–RF11   | Reports de cada RF            | Reports de cada RF            | Provas PostgreSQL e CI anteriores                            | Não repetidas   |
| RF12        | `UT-SUP-RF12` planejado       | `INT-SUP-RF12` planejado      | `FU-SUP-02/04/05/06`, `CT-SUP-RF12`, `SEC-SUP-07` planejados | `NOT_RUN`       |
| RF13        | Planejado                     | Planejado                     | Planejado                                                    | Fora do recorte |

# 7. Inventário e decisões RF12

Rotas de negócio RF01–RF11 estão integradas. Em `ticket.routes.ts`, existe POST `/:ticketId/messages` (RF10), PATCH de visibilidade (RF11) e GET `/:ticketId` (RF09), mas nenhum GET `/:ticketId/messages`. A OpenAPI mantém somente POST nesse path. `/health`, `/metrics` e `/api-docs*` são superfícies operacionais, não RF12. `GET /history` continua reserva 404 de RF13.

**Natureza:** fonte = texto literal do PRD; precedente = contrato de outra RF; candidata = proposta em notes/prompt, ainda não aprovada. `OPEN_FOR_RF12` nunca significa aprovação por analogia.

| Tema               | Decisão ou candidata                                                                                          | Natureza                                                                   | Status                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- | ---------------------------------------------------------- |
| ACL base           | Admin com membership atual no Department do Ticket; requester dono; `Department.type` irrelevante             | Fonte §4/P6                                                                | Fechado como regra base                                    |
| Headers            | `X-Correlation-ID`, `X-Performed-By`, `X-Performed-By-Type` obrigatórios; sem alias `X-Caller-*`              | Precedente RF09–RF11 / DEC-SUP-01                                          | `OPEN_FOR_RF12`                                            |
| Visibility         | Admin vê todas; requester só `true`; `false` pedido pelo requester: 422 ou 403; omitido equivale a visível    | Candidata DEC-SUP-04; fonte só diz filtro opcional                         | **Gate aberto**                                            |
| Filtro admin       | Admin pode filtrar true ou false; omitido vê todas                                                            | Candidata DEC-SUP-04                                                       | `OPEN_FOR_RF12`                                            |
| Paginação          | `page/size`; defaults `1/20`, `page>=1`, `size 1..100`, página além do fim `200/[]`                           | Nomes/obrigação da fonte; valores são precedente RF03/RF07                 | `OPEN_FOR_RF12` nos detalhes                               |
| Ordem              | `createdAt ASC,id ASC`, sem sort param                                                                        | Proposta DEC-SUP-02                                                        | `OPEN_FOR_RF12`                                            |
| Item               | Oito campos `id,ticketId,message,type,authorId,mediaIds,isVisibleToRequester,createdAt`                       | Precedente RF10/RF11                                                       | `OPEN_FOR_RF12`                                            |
| Mídia              | `mediaIds` em `position ASC`, duplicatas preservadas; busca em lote sem N+1                                   | Storage e precedente RF10/RF11; desenho técnico candidato                  | `OPEN_FOR_RF12`                                            |
| Total              | Contar só mensagens autorizadas e filtradas, antes de `LIMIT/OFFSET`; não vazar notas internas                | Invariante de segurança TDD/TP; política específica pendente               | **Gate aberto**                                            |
| Envelope           | `{data,pagination:{page,size,total,totalPages}}`, zero com `totalPages=0`                                     | Precedente RF03/RF07                                                       | `OPEN_FOR_RF12`                                            |
| Body/query         | GET sem body; somente `isVisibleToRequester,page,size`; desconhecidos/repetidos/aliases e body presente `422` | Fonte dos nomes; validação candidata DEC-SUP-08                            | `OPEN_FOR_RF12`                                            |
| IDs/erros          | UUID v4 `ticketId`, inválido 422; Ticket inexistente 404; ACL 403; header 400; falha 500; sucesso 200         | Precedente RF09/DEC-SUP-08/09                                              | `OPEN_FOR_RF12` nos códigos/precedência                    |
| Department inativo | Ticket histórico continua acessível sob ACL atual                                                             | Fonte P1/P6                                                                | Fechado como regra base                                    |
| Read-only          | Nenhum write em Ticket/Message/Media/AuditLog; sem idempotency key, evento/outbox/messaging                   | GET + ausência de auditoria/evento no PRD; inferência técnica para efeitos | Sem efeito de escrita; detalhe técnico não amplia contrato |
| Consistência       | Page e media devem representar itens íntegros; sem N+1 ou lock pessimista; definir leitura sob RF10/RF11      | TDD/TP e proposta técnica                                                  | `OPEN_FOR_RF12` no observável                              |

Matriz HTTP **candidata**, ainda não congelada: `200` sucesso/vazio; `400` correlação/ator inválido; `403` ACL; `404` Ticket inexistente; `422` UUID, body ou query inválidos; `500` inesperado. Não inventar `401/409` local. Precedência entre validação, lookup e ACL deve ser decidida no recorte.

# 8. Fronteira NFR e capacidades transversais

| Tema                                               | Categoria                                                          | Estado neste checkpoint                              |
| -------------------------------------------------- | ------------------------------------------------------------------ | ---------------------------------------------------- |
| ACL fina, correlação, HTTP, persistência e OpenAPI | Implementado localmente nas RFs anteriores; contrato RF12 pendente | Não inferir RF12 implementada                        |
| AuthN/RBAC amplo e rate limit                      | Upstream/plataforma (BFF/gateway)                                  | Não há gap local RF12 por ausência de JWT/rate limit |
| Observabilidade distribuída                        | Compartilhado                                                      | Não condiciona este checkpoint sem decisão local     |
| Segurança/carga automatizadas, streaming           | Fora do escopo desta release                                       | Não atribuir gap local automático                    |
| RabbitMQ, DLQ, redrive, Schema Registry externo    | Fora do contrato RF12 ou upstream/plataforma                       | Nenhum evento Support especificado                   |

Schema existente suporta leitura de mensagem e mídia. Não se identificou necessidade de migration RF12. Seed de domínio continua fora deste recorte; `api.http` e OpenAPI RF12 não foram alterados por ser checkpoint bloqueado.

# 9. Cobertura e validação real

Cobertura RF12: nenhuma, por design. Percentuais da suíte RF11 pertencem ao report de implementação anterior; não foram medidos novamente. O check remoto da PR #13 comprova apenas o fechamento documental RF11, não RF12. Neste checkpoint foram planejados somente gates documentais; registrar abaixo os comandos efetivamente executados e seus resultados, sem atribuir prova de runtime RF12.

- `git diff --check`: passou, sem whitespace inválido.
- `git diff --cached --check`: primeira execução apontou espaços finais nos metadados do novo report; eles foram convertidos em lista Markdown e a repetição passou.
- `npm run format:check`: primeira execução encontrou somente este report sem formatação; `prettier --write` foi aplicado apenas ao report; repetição passou (`All matched files use Prettier code style!`).
- `git -C luciluci-docs diff --check`: passou; submódulo sem alterações.
- Testes unit/integration/functional RF12, PostgreSQL e deploy: **não executados**.

# 10. Divergências

## 10.1 Documentação prevê, código não comprova

- RF12 e RF13 estão no PRD/TDD/TP, mas sem rotas funcionais, DTOs ou OpenAPI; ausência esperada para o estágio. Não é drift técnico RF11.

## 10.2 Código existe, documentação não comprova

- Nenhuma divergência nova identificada no recorte RF12. A fonte canônica 0.13 é fotografia contratual anterior ao merge funcional RF11; `ACTUAL_STATE.md` registra o runtime integrado.

## 10.3 ACTUAL_STATE afirma, código não comprova

- Nenhuma alegação de RF12 implementada. A rota GET RF12 não foi encontrada em `ticket.routes.ts`/OpenAPI.

## 10.4 PRD / TDD / TP divergem entre si

- O PRD chama o filtro `isVisibleToRequester` de opcional sem definir leitura segura por solicitante; TDD/TP explicitam o risco e mantêm a decisão aberta. Isso é lacuna da fonte, não autorização para tornar a omissão irrestrita.
- Defaults/envelope e ordem de mensagens são propostas/precedentes posteriores, sem aprovação RF12.

## 10.5 Ambiguidades que impedem conclusão segura

- DEC-SUP-04: visibilidade por papel, `false`/omitido, contagem/página sem vazamento.
- DEC-SUP-02/08: paginação, ordem, shape, filtro, body/query e matriz de erros.
- DEC-SUP-01/09: headers, identidade e `ticketId` no recorte RF12.
- Consistência observável ao listar durante RF10/RF11, inclusive associação de mídias, requer escolha técnica alinhada ao contrato final.

# 11. Conclusão

`RF12_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION`. RF12 está `NOT_IMPLEMENTED`; `feat/support-rf12-list-messages` não foi criada. RF13 está `NOT_IMPLEMENTED`. Support 0.14 **não foi congelado** e o gitlink permanece Support 0.13 (`4958fd1`).

Próximo passo: obter decisão expressa, **somente para RF12**, sobre DEC-SUP-04 (visibilidade/filtro/total), DEC-SUP-02 (paginação/ordem), DEC-SUP-08 (shape/erros/body/query), DEC-SUP-01/09 (headers/IDs) e consistência observável. Só então atualizar o contrato canônico e avaliar freeze; não abrir runtime RF12 antes disso.
