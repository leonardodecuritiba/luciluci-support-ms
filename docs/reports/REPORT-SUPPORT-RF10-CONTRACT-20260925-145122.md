# REPORT — Fechamento contratual RF10 / Support 0.12

- **status:** Final — `RF10_CONTRACT_CHECKPOINT_READY`
- **generated_by:** Codex
- **generated_at:** 2026-09-25T14:51:22Z
- **review_mode:** final
- **microservice:** support-ms
- **repository_ref:** `docs/support-rf10-create-message-checkpoint`, após o checkpoint histórico `8498620803e206f4ef0fa481835af5270db1f721`
- **documentation_ref:** `luciluci-docs` Support 0.12, `85c7e958adb0cbb9fa43842de7f990260f2bc0ee`, branch `docs/support-rf10-create-message-contract`
- **report_file:** `docs/reports/REPORT-SUPPORT-RF10-CONTRACT-20260925-145122.md`
- **reviewer:** não identificado

# 1. Resumo executivo

RF01–RF09, incluindo RF07a/RF07b, estão implementadas/provadas em `MAIN_BASELINE_RF09` (`393af3ed50c35fb541825c1822cecaa3b8005a29`). RF10–RF13 não têm runtime. Esta revisão congela somente o contrato RF10, sem atribuir testes novos, CI, UAT ou deploy. O checkpoint RF10 bloqueado anterior permanece histórico. Não foi identificado drift técnico que impeça o contrato. O principal risco remanescente é implementar RF10 sem reproduzir a cardinalidade literal de duas auditorias para o solicitante quando `adminStatus` já é `pendente`.

Inventário: 14 operações planejadas; dez operações implementadas (RF01–RF09 com RF07a/b), quatro não implementadas (RF10–RF13). A tríade de prova das RF01–RF09 consta dos reports anteriores; este report não a repetiu. `/health`, `/metrics` e `/api-docs*` são superfícies operacionais, fora da contagem de RFs.

# 2. Escopo e fontes analisadas

Fontes: `luciluci-docs/support/{README,prd,notes,tdd,tp}.md`, `luciluci-docs/support/sources/prd-original.md`, `ACTUAL_STATE.md`, `DRIFT_REPORT.md`, `README.md`, `AGENTS.md`, `AI_FIRST.md`, `docs/reports/REPORT-SUPPORT-RF10-CHECKPOINT-20260925-143047.md`, `docs/reports/REPORT-TEMPLATE.md`, `.codex/skills/report-review.md` e `docs/prompts/report-completeness-prompt.md`. Conferidos também a migration `src/shared/infrastructure/database/migrations/1768010000000-CreateSupportTickets.ts`, entidade TicketMessage, rotas existentes, OpenAPI e reports RF09. Nenhum executável foi alterado. O original conserva SHA-256 `7d5e26647bcecc93cfb9df52d5c87bfa882e9d140ceb55632d527e15fa5b1c03`.

Evidência remota desta revisão: branch canônica publicada; `git -C luciluci-docs ls-remote --heads origin docs/support-rf10-create-message-contract` retornou `85c7e958adb0cbb9fa43842de7f990260f2bc0ee`, igual ao SHA local. Não há run de CI RF10 nem PR RF10; o check `quality` histórico da PR #9 passou no run `36145983860` para RF09.

# 3. Matriz principal RF x implementação

| RF          | Fonte/contrato          | Endpoint/estado de runtime                                                 | Prova                                           |
| ----------- | ----------------------- | -------------------------------------------------------------------------- | ----------------------------------------------- |
| RF01–RF04   | PRD/TDD/TP Support      | Department, implementado em `main`                                         | Reports RF01–RF04 históricos                    |
| RF05        | Support 0.7             | Criar Ticket, implementado em `main`                                       | Report RF05 histórico                           |
| RF06        | Support 0.8             | Editar Ticket, implementado em `main`                                      | Report RF06 histórico                           |
| RF07a/RF07b | Support 0.9             | Duas listagens de Ticket, implementadas em `main`                          | Report RF07 histórico                           |
| RF08        | Support 0.10            | Resolver Ticket, implementado em `main`                                    | Report RF08 histórico                           |
| RF09        | Support 0.11            | Buscar Ticket por ID, implementado em `main`                               | Report RF09 e PR #9                             |
| RF10        | Support 0.12            | `POST /api/support/tickets/{ticketId}/messages`, não encontrado no runtime | `TC-SUP-RF10` planejado; nenhum teste executado |
| RF11–RF13   | Contratos ainda abertos | Não encontrados no runtime                                                 | Planejados, sem prova nesta revisão             |

# 4. Checklist consolidado por PRD

- [x] Fonte original RF10 preserva `type` e `authorId` no body e a cardinalidade de auditoria P3.
- [x] Complemento RF10 congela headers, ACL, body, visibilidade, efeito no status, resposta, erros e concorrência somente para essa operação.
- [ ] RF10 implementada; RF11–RF13 permanecem fora do runtime.

# 5. Checklist consolidado por TDD

- [x] Transação única com lock inicial de Ticket; admin bloqueia Department atual após Ticket e revalida membership; owner não precisa do lock de Department.
- [x] Toda mensagem renova `Ticket.updatedAt`; requester preserva `requesterStatus`, atribui `adminStatus=pendente` e gera duas auditorias inclusive quando pendente antes/depois. Admin preserva `adminStatus` e gera uma auditoria.
- [x] RF10×RF10, RF10×RF06 e RF10×RF08 possuem comportamento serial definido; cada POST válido gera recurso distinto sem idempotency key.
- [ ] Código/repositórios/OpenAPI executável da RF10 ainda não foram materializados.

# 6. Checklist consolidado por TP

| RF        | Unitário                        | Integração                                                              | Funcional/contrato                                  | Estado nesta revisão  |
| --------- | ------------------------------- | ----------------------------------------------------------------------- | --------------------------------------------------- | --------------------- |
| RF01–RF09 | Evidência em reports anteriores | Evidência em reports anteriores, com PostgreSQL descartável por recorte | Evidência em reports anteriores; RF09 integra PR #9 | Não reexecutados aqui |
| RF10      | `TC-SUP-RF10` planejado         | Atomicidade, cardinalidade, locks e concorrência planejados             | HTTP/processo, response, ACL e erros planejados     | `PLANNED / NOT_RUN`   |
| RF11–RF13 | Planejados                      | Planejados                                                              | Planejados                                          | `NOT_RUN`             |

Casos RF10 essenciais: headers e coerência body↔ator; admin com/sem membership, owner/não owner e Department inativo; mídia opcional/duplicada; visibilidade falsa somente para admin; status anteriores inclusive pendente; auditoria exata e NULLs; replay como nova mensagem; rollback de cada escrita; concorrência com RF10/RF06/RF08. Nenhum caso foi executado nesta revisão.

# 7. Inventário de endpoints reais e decisões RF10

`src/features/ticket/adapters/routes/ticket.routes.ts` contém RF05–RF09; `POST /:ticketId/messages` ainda não está exposto. O contrato futuro exige `X-Correlation-ID`, `X-Performed-By`, `X-Performed-By-Type` e body estrito com `message,type,authorId,isVisibleToRequester` obrigatórios, `mediaIds` opcional. O body deve coincidir com os headers de ator. Admin acessa por membership atual e escolhe visibilidade; backoffice/cd acessam por ownership e devem enviar visibilidade `true`. A resposta é `201` com TicketMessage completa, sem Ticket/AuditLogs. `400` headers, `403` ACL, `404` Ticket, `422` ID/body/query/domínio e `500` inesperado; sem `401/409` locais. DEC-SUP-01/04/06/08/09/10/12 estão `RESOLVED_FOR_RF10`; DEC-SUP-05/11 são `NOT_APPLICABLE_RF10`. Sem evento, outbox ou migration nova prevista.

# 8. Fronteira NFR e capacidades transversais

| Capacidade                                          | Classificação                | Limite                                                              |
| --------------------------------------------------- | ---------------------------- | ------------------------------------------------------------------- |
| Correlação, erros e persistência das RFs existentes | Implementado localmente      | RF10 precisará de implementação e prova próprias                    |
| AuthN/RBAC amplo                                    | Upstream/plataforma          | BFF fornece contexto; Support aplica ACL fina                       |
| Observabilidade distribuída                         | Compartilhado                | Nenhuma obrigação adicional RF10 recebida                           |
| Eventos, outbox, DLQ/redrive, Schema Registry       | Fora do escopo desta release | PRD não especifica evento Support                                   |
| Seed W1                                             | Gap real local anterior      | Não alterado por este contrato; massa determinística ainda pendente |

# 9. Cobertura de testes e validação

Nesta revisão: `git -C luciluci-docs diff --check`, Prettier dos cinco documentos canônicos e `git -C luciluci-docs show --check HEAD` passaram; SHA-256 da fonte original conferido. No serviço, `git diff --check` passou; o primeiro `npm run format:check` apontou apenas este report e foi corrigido antes do gate final. `git show --check HEAD` será verificado após o commit. Nenhum teste RF10, build funcional RF10, migration, prova PostgreSQL, smoke, UAT ou CI RF10 foi executado. A cobertura histórica RF09 não prova RF10.

# 10. Divergências

## 10.1 Documentação prevê, código não comprova

RF10–RF13 constam no PRD, mas não têm runtime; esperado para este lote. O `src/README.md` conserva menção histórica à branch funcional RF09; não integra a lista documental autorizada neste recorte.

## 10.2 Código existe, documentação não comprova

As tabelas de TicketMessage, mídia e AuditLog já existem via RF05; isso não comprova RF10 executável. A tipagem TypeScript de `TicketMessage.type` ainda reflete origem de solicitante e exigirá alinhamento no lote funcional para permitir `admin`, sem migration nova presumida.

## 10.3 `ACTUAL_STATE.md` afirma, código não comprova

O estado declara RF10 `NOT_IMPLEMENTED`, coerente com ausência de rota/testes. Support 0.12 refere-se somente ao contrato publicado.

## 10.4 PRD / TDD / TP divergem entre si

A revisão 0.12 alinha body com `type/authorId`, visibilidade, efeitos, resposta, erros, transação e cenários planejados. Não foi encontrada contradição material nova que bloqueie o congelamento.

## 10.5 Ambiguidades que impedem conclusão segura

Nenhuma no recorte RF10 após as decisões explícitas desta revisão. RF11–RF13 conservam suas lacunas próprias; não foram inferidas a partir de RF10.

# 11. Conclusão

`RF10_CONTRACT_CHECKPOINT_READY / RF10_CONTRACT_FROZEN / NOT_IMPLEMENTED`. Support 0.12 está publicada em `85c7e958adb0cbb9fa43842de7f990260f2bc0ee` e o checkpoint bloqueado `8498620` não foi reescrito. Próximo passo: abrir lote explícito de implementação RF10 em `feat/support-rf10-create-message`, partindo de `main` sincronizada e fixando o contrato canônico. RF11 não foi iniciada.
