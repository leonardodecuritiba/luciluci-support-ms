# REPORT — Fechamento contratual RF12 (List Ticket Messages)

- **status:** `RF12_CONTRACT_CHECKPOINT_READY / RF12_CONTRACT_FROZEN / NOT_IMPLEMENTED`
- **generated_by:** Codex
- **generated_at:** 2026-09-25T18:50:19Z
- **review_mode:** final documental
- **microservice:** support-ms
- **repository_ref:** `docs/support-rf12-list-messages-checkpoint`, sobre o checkpoint histórico `98efe16ea6854460fe1a9fd26ab05113e1d91932`
- **documentation_ref:** Support 0.14 `820b2a8b29819fc52aefd078dc51bfe651a51204`, branch `docs/support-rf12-list-messages-contract`
- **report_file:** `docs/reports/REPORT-SUPPORT-RF12-CONTRACT-20260925-185019.md`
- **reviewer:** não designado

# 1. Resumo executivo

A decisão expressa fecha somente RF12: `GET /api/support/tickets/{ticketId}/messages`. A fonte original fixa rota, ACL geral, filtro opcional, paginação obrigatória e auditoria zero. Support 0.14 complementa a política de mensagens internas por papel, total sem vazamento, paginação, ordem, item, mídia, validação e fotografia de leitura. O checkpoint bloqueado `98efe16` permanece histórico. RF01–RF11 estão integradas em `MAIN_BASELINE_RF11`; RF12/RF13 não têm runtime. RF13 não herda as decisões deste report.

O maior risco tratado é o solicitante inferir notas internas por `data`, `total`, `totalPages` ou posição da página. O filtro `false` do requester é válido, mas retorna página vazia/total zero após ACL, sem consultar linhas ocultas. Nenhuma migration, evento, OpenAPI executável, teste funcional ou deploy foi produzido neste lote.

# 2. Escopo e fontes analisadas

- Autoridade funcional: `luciluci-docs/support/sources/prd-original.md` §§2.3, 3, 4, 5/P1/P6, 6/RF12 e 7. SHA-256 original preservado: `7d5e26647bcecc93cfb9df52d5c87bfa882e9d140ceb55632d527e15fa5b1c03`.
- Contrato transposto: `luciluci-docs/support/{README,prd,notes,tdd,tp,dependencies}.md` na base Support 0.13 e na revisão 0.14. Somente README, PRD, notes, TDD e TP foram editados no repositório canônico.
- Serviço: `AGENTS.md`, `AI_FIRST.md`, `ACTUAL_STATE.md`, `DRIFT_REPORT.md`, `README.md`, política de branches, report bloqueado RF12 e report final RF11. Inventário read-only de route, OpenAPI e migration RF05.
- Git: `main=origin/main=7724382245545c5918262ebb66aff0d696b0a2b2`; branch documental do serviço partiu de `98efe16`; gitlink anterior `4958fd1`. Branch canônica 0.14 publicada no SHA acima, com `HEAD`, tracking ref e `ls-remote` iguais.
- CI remota: PR #13 documental RF11, workflow `ci`/job `quality`, run [36171699704](https://github.com/leonardodecuritiba/luciluci-support-ms/actions/runs/36171699704), sucesso no head `425cad5`. Não é prova RF12. Não há run remoto RF12 neste fechamento.

# 3. Matriz principal RF x implementação

| RF          | Estado                                   | Evidência/limite                                     |
| ----------- | ---------------------------------------- | ---------------------------------------------------- |
| RF01–RF06   | Integradas e provadas                    | Reports anteriores; não repetidas                    |
| RF07a/RF07b | Integradas e provadas                    | PR #7; contratos de listagem próprios                |
| RF08–RF11   | Integradas e provadas                    | PRs #8/#9/#10/#12; RF11 em `MAIN_BASELINE_RF11`      |
| RF12        | Contrato 0.14 congelado, **sem runtime** | Route/OpenAPI GET ausentes por estágio; TP planejado |
| RF13        | Contrato pendente, sem runtime           | Fora deste recorte                                   |

## Confronto de fonte e complemento

| Tema      | PRD original                                   | Decisão posterior RF12                                                                               |
| --------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| Operação  | GET por `ticketId`                             | ID UUID v4; inexistente 404; sem ACL 403                                                             |
| Atores    | Admin por membership e requester por ownership | Headers locais, membership atual, Department inativo permitido, role independente de `ticket.origin` |
| Filtro    | `isVisibleToRequester` opcional                | Literais minúsculos; requester nunca recebe ou conta internas; `false` gera página vazia             |
| Paginação | Obrigatória, exemplo `page=1&size=20`          | Defaults/limites, envelope, total, página além do fim e ordem cronológica                            |
| Item      | Entidade TicketMessage com oito campos         | Shape exato de RF10/RF11, mídia posicional em lote                                                   |
| Leitura   | Sem auditoria                                  | Sem write/evento; snapshot coerente PostgreSQL `REPEATABLE READ`                                     |

# 4. Checklist consolidado por PRD

- [x] Path, método, filtro opcional, paginação, ACL geral e auditoria zero preservados.
- [x] P1/P6 preservam Ticket histórico de Department inativo e excluem `Department.type` da ACL.
- [x] Política de leitura interna é complemento pós-PRD identificado como tal, sem alterar a fonte original.
- [x] Nenhuma decisão RF12 foi estendida a RF13.

# 5. Checklist consolidado por TDD

- [x] DEC-SUP-01/02/04/08/09/12 resolvidas apenas para RF12; DEC-SUP-11 não se aplica.
- [x] Scope de visibilidade e filtro no banco precedem count/paginação; requester `false` short-circuit após ACL sem ler hidden rows.
- [x] Total, page, ACL e media da mesma fotografia; sem `FOR UPDATE`, write transaction ou N+1 de mídia.
- [x] Schema RF05 já comporta Messages/Media; nenhuma migration nova.
- [ ] Rota GET RF12, controller, DTO, use case, OpenAPI e `api.http` não criados neste lote.

# 6. Checklist consolidado por TP

- [x] `TC-SUP-RF12` agora planeja ACL, true/false/omitido, count sem vazamento, paginação, tie-breaker, oito campos, mídia e concorrências RF10/RF11.
- [x] Erros 200/400/403/404/422/500 e rejeições estritas constam do plano.
- [ ] Nenhum teste RF12 foi escrito ou executado neste fechamento documental.

## 6.1 Matriz RF → testes

| RF        | Unit                      | Integration               | Functional                                                   | Estado              |
| --------- | ------------------------- | ------------------------- | ------------------------------------------------------------ | ------------------- |
| RF01–RF11 | Reports históricos por RF | Reports históricos por RF | Provas PostgreSQL/HTTP históricas                            | Não repetidas aqui  |
| RF12      | `UT-SUP-RF12` planejado   | `INT-SUP-RF12` planejado  | `FU-SUP-02/04/05/06`, `CT-SUP-RF12`, `SEC-SUP-07` planejados | `PLANNED / NOT_RUN` |
| RF13      | Planejado                 | Planejado                 | Planejado                                                    | Fora do recorte     |

# 7. Inventário e decisões RF12

`ticket.routes.ts` contém POST `/:ticketId/messages` (RF10) e PATCH de visibilidade (RF11), sem GET RF12. OpenAPI também só contém POST no path de mensagens. `/health`, `/metrics` e `/api-docs*` são operacionais e não entram na contagem de RFs.

| Tema               | Decisão final                                                                                    | Natureza                     | Status         |
| ------------------ | ------------------------------------------------------------------------------------------------ | ---------------------------- | -------------- |
| Headers            | Correlação UUID, ator opaco e role admin/backoffice/cd obrigatórios; sem aliases                 | DEC-SUP-01 posterior         | Resolvido RF12 |
| ACL                | Admin por membership atual; requester owner; origin e `Department.type` não autorizam            | Fonte §4/P6 e clarificação   | Resolvido RF12 |
| Ticket ID          | UUID v4; inválido 422, ausente 404, existente sem ACL 403                                        | DEC-SUP-08/09 posterior      | Resolvido RF12 |
| Visibility scope   | Admin vê todas; requester só visíveis, inclusive sem filtro                                      | DEC-SUP-04 posterior         | Resolvido RF12 |
| Filtro             | Lowercase true/false; requester false retorna 200 vazio/total zero sem ler ocultas               | Fonte + DEC-SUP-04/08        | Resolvido RF12 |
| Paginação          | Defaults 1/20, limites page>=1 e size 1..100, parse decimal seguro; página além do fim 200 vazia | DEC-SUP-02/08 posterior      | Resolvido RF12 |
| Query whitelist    | Somente page, size, isVisibleToRequester; extra, alias e repetida 422                            | DEC-SUP-08 posterior         | Resolvido RF12 |
| Ordem              | `createdAt ASC,id ASC` sem sort                                                                  | DEC-SUP-02 posterior         | Resolvido RF12 |
| Item               | Oito campos exatos de TicketMessage, sem expansão                                                | DEC-SUP-08 posterior         | Resolvido RF12 |
| Media              | Busca em lote da página, position ASC, duplicatas e vazio `[]`, sem N+1                          | DEC-SUP-08/12 técnica        | Resolvido RF12 |
| Total              | ACL + visibility + filtro antes de paginação; zero ou ceil(total/size)                           | DEC-SUP-02/04/08 posterior   | Resolvido RF12 |
| Body               | Qualquer body, inclusive `{}`/`null`, é 422                                                      | DEC-SUP-08 posterior         | Resolvido RF12 |
| Read-only          | Sem write, AuditLog, touch, idempotência, evento/outbox/messaging ou lock pessimista             | Fonte + clarificação técnica | Resolvido RF12 |
| Snapshot           | Ticket/ACL, total, página e media em transação PostgreSQL `REPEATABLE READ`                      | DEC-SUP-12 técnica           | Resolvido RF12 |
| RF12 × RF10        | Nova mensagem com mídias aparece inteira ou não, conforme snapshot                               | DEC-SUP-12 técnica           | Resolvido RF12 |
| RF12 × RF11        | Visibility, total e page no mesmo snapshot; mudança posterior só na próxima leitura              | DEC-SUP-12 técnica           | Resolvido RF12 |
| Department inativo | Membership atual/admin ou owner/requester continua válido                                        | Fonte P1/P6                  | Resolvido RF12 |
| Erros              | 200/400/403/404/422/500; sem 401/409 local                                                       | DEC-SUP-08 posterior         | Resolvido RF12 |

# 8. Fronteira NFR e capacidades transversais

| Tema                                             | Classificação                     | Impacto RF12                                |
| ------------------------------------------------ | --------------------------------- | ------------------------------------------- |
| ACL fina, correlação, HTTP e PostgreSQL          | Local                             | Contrato RF12 fechado; runtime não criado   |
| AuthN ampla, RBAC amplo e rate limit             | Upstream/plataforma               | Responsabilidade BFF/gateway                |
| Observabilidade distribuída                      | Compartilhado                     | Não cria requisito local novo neste recorte |
| Segurança/carga automatizadas e streaming        | Fora do escopo desta release      | Não são gaps locais automáticos             |
| RabbitMQ, DLQ, redrive e Schema Registry externo | Fora do contrato RF12 ou upstream | Nenhum evento Support definido              |

A migration RF05 contém `ticket_messages`, `ticket_message_media` e coluna de visibilidade. Nenhum campo novo é requerido pelo contrato RF12. `api.http`, OpenAPI, runtime e CI do serviço foram preservados.

# 9. Cobertura e validação real

Cobertura RF12: nenhuma; não há teste executável RF12 neste lote. Percentuais de RF11 são históricos e não foram medidos novamente. `git diff --check`, `npm run format:check`, `git -C luciluci-docs diff --check` e `git -C luciluci-docs show --check HEAD` passaram. A confirmação do commit do serviço com `git show --check HEAD` é registrada no handoff. O submódulo canônico teve cinco arquivos Markdown alterados, sem mudança em `sources/prd-original.md`; o hash SHA-256 original foi confirmado. O serviço altera documentação e gitlink, sem executáveis.

# 10. Divergências

## 10.1 Documentação prevê, código não comprova

RF12 tem contrato congelado em Support 0.14, mas não tem rota GET/runtime/OpenAPI; é ausência esperada entre contrato e implementação. RF13 continua pendente.

## 10.2 Código existe, documentação não comprova

Nenhuma divergência nova identificada no recorte. A revisão canônica descreve o contrato, enquanto `ACTUAL_STATE.md` registra o runtime integrado até RF11.

## 10.3 ACTUAL_STATE afirma, código não comprova

Nenhuma alegação de RF12 implementada. O estado correto é `NOT_IMPLEMENTED`.

## 10.4 PRD / TDD / TP divergem entre si

O filtro opcional do PRD original não define visibilidade por papel. A revisão 0.14 registra decisões posteriores coerentes nos três documentos sem reescrever a fonte.

## 10.5 Ambiguidades que impedem conclusão segura

Nenhuma lacuna material RF12 restante para congelamento. A implementação futura deve provar isolamento de leitura, ausência de vazamento por total e query em lote de mídia. RF13 continua pendente, fora do recorte.

# 11. Conclusão

`RF12_CONTRACT_CHECKPOINT_READY / RF12_CONTRACT_FROZEN / NOT_IMPLEMENTED`. Support 0.14 foi publicado no commit canônico `820b2a8b29819fc52aefd078dc51bfe651a51204`, com SHA local/remoto igual, e fixado no gitlink do serviço. O checkpoint bloqueado `98efe16` permanece histórico. RF13 não herda as decisões RF12. Próximo lote, quando explicitamente aberto: `feat/support-rf12-list-messages` a partir de `main` sincronizada e contrato 0.14 fixado.
