# REPORT — Fechamento contratual RF11 do support-ms

- **status:** `RF11_CONTRACT_CHECKPOINT_READY / RF11_CONTRACT_FROZEN / NOT_IMPLEMENTED`
- **generated_by:** Codex
- **generated_at:** 2026-09-25T16:51:05Z
- **review_mode:** final
- **microservice:** support-ms
- **repository_ref:** `docs/support-rf11-message-visibility-checkpoint`, sobre `MAIN_BASELINE_RF10` `734ba5de74e544b1e8dc2a31c135cb2bb54d20e1`; checkpoint bloqueado histórico `85b3adb2be6bfa40d12e39036986e6d63549e7ba`
- **documentation_ref:** Support 0.13 `4958fd1840042200fd1a87e45d6a7f69d4011dcd`, publicado em `origin/docs/support-rf11-message-visibility-contract` e fixado no gitlink
- **report_file:** `docs/reports/REPORT-SUPPORT-RF11-CONTRACT-20260925-165105.md`
- **reviewer:** não informado

---

# 1. Resumo executivo

RF01–RF10 (11 operações, contando RF07a/RF07b) estão implementadas e provadas
em `MAIN_BASELINE_RF10`; RF11–RF13 (três operações) permanecem sem runtime.
`main == origin/main == 734ba5d`. O PRD original da RF11 especifica rota,
campo de visibilidade, ACL geral de Ticket e nenhuma auditoria. A decisão
posterior fornecida para este recorte fecha a autorização admin-only,
elegibilidade de Message `type=admin`, resposta, no-op, efeitos e concorrência.
O checkpoint bloqueado anterior continua íntegro como fotografia histórica.

Support 0.13 foi publicado no commit canônico `4958fd1`; `ls-remote`
confirmou SHA remoto idêntico ao local antes do avanço do gitlink. O PRD
original segue com SHA-256
`7d5e26647bcecc93cfb9df52d5c87bfa882e9d140ceb55632d527e15fa5b1c03`.
Nenhum runtime, migration, teste funcional ou deploy RF11 foi feito.

# 2. Escopo e fontes analisadas

Fontes: `AGENTS.md`, `AI_FIRST.md`, `ACTUAL_STATE.md`, `DRIFT_REPORT.md`,
`README.md`, política de branches, checkpoint RF11, reports RF10 de contrato e
implementação, `luciluci-docs/support/{README,prd,notes,tdd,tp,dependencies}.md`
e `sources/prd-original.md`. O PRD original permanece fonte nominal; as
decisões desta revisão são complementos **pós-PRD**, restritos a RF11.

Inventário existente: `TicketMessage` tem `id,ticketId,message,type,authorId,`
`isVisibleToRequester,createdAt`; mídia está em `ticket_message_media`.
RF10 permite mensagem admin visível/interna e mensagem requester apenas
visível. A migration RF05 contém `ticket_messages.is_visible_to_requester`.
RF11 não está na rota nem na OpenAPI; os testes históricos ainda verificam
ausência da rota. Esse 404 anterior não é evidência de teste funcional RF11.

CI remota da baseline RF10: [run 36156561044](https://github.com/leonardodecuritiba/luciluci-support-ms/actions/runs/36156561044),
`quality` concluída com sucesso antes da PR #10. Não há run remoto RF11
neste fechamento documental.

# 3. Matriz principal RF x implementação

| RF          | Contrato                      | Estado runtime     | Evidência                                  |
| ----------- | ----------------------------- | ------------------ | ------------------------------------------ |
| RF01–RF04   | Department                    | Implementado       | Reports por RF, rotas e provas anteriores  |
| RF05        | Criar Ticket/mensagem inicial | Implementado       | Report RF05                                |
| RF06        | Editar Ticket                 | Implementado       | Report RF06                                |
| RF07a/RF07b | Listar Tickets                | Implementado       | Report RF07                                |
| RF08        | Resolver Ticket               | Implementado       | Report RF08                                |
| RF09        | Buscar Ticket                 | Implementado       | Report RF09                                |
| RF10        | Criar mensagem                | Implementado       | Report RF10, PR #10 e CI                   |
| RF11        | Editar visibilidade           | **Não encontrado** | Contrato 0.13; rota/OpenAPI ainda ausentes |
| RF12/RF13   | Mensagens/histórico           | Não encontrado     | Contratos pendentes; fora deste lote       |

# 4. Checklist consolidado por PRD

- [x] Rota literal e body com `isVisibleToRequester` preservados.
- [x] ACL geral do Ticket e P1/P6 preservadas; restrição admin-only
      registrada como **clarificação posterior por ação**, sem ampliar a fonte.
- [x] Somente Message `type=admin` é elegível; requester não pode ocultar
      sua mensagem nem publicar nota interna de admin por conhecer `messageId`.
- [x] Auditoria zero, sem criar action ou evento de negócio.
- [x] RF12/RF13 não receberam decisão por implicação.

# 5. Checklist consolidado por TDD

- [x] Headers `X-Correlation-ID`, `X-Performed-By`, `X-Performed-By-Type`;
      ambos os IDs internos UUID v4 e Message scoped ao Ticket.
- [x] Body estrito com boolean obrigatório; query proibida; `200` com os oito
      campos de TicketMessage em mudança e no-op.
- [x] Update estreito só de `ticket_messages.is_visible_to_requester`; Ticket,
      `Ticket.updatedAt`, mídia, conteúdo, autor, tipo, `createdAt` e AuditLog
      preservados. A coluna já existe; sem migration.
- [x] Transação Ticket→Department atual→Message, com revalidação sob locks;
      RF11×RF11/RF10/RF06/RF08 serializadas sem lost update.
- [ ] Implementação dessas regras ainda não iniciada.

# 6. Checklist consolidado por TP

| RF        | Unit                    | Integration                                | Functional/contract                 | Estado                      |
| --------- | ----------------------- | ------------------------------------------ | ----------------------------------- | --------------------------- |
| RF01–RF09 | Suítes históricas       | Provas por RF                              | Reports anteriores                  | Provadas anteriormente      |
| RF10      | Suíte unitária RF10     | HTTP/SQLite e PostgreSQL RF10              | Smoke e CI #10                      | Provada anteriormente       |
| RF11      | `TC-SUP-RF11` planejado | `IT-SUP-09` e cenários de locks planejados | `FU-SUP-05`/`SEC-SUP-06` planejados | `CONTRACT_FROZEN / NOT_RUN` |
| RF12/RF13 | Planejados              | Planejados                                 | Planejados                          | Fora do recorte             |

Nenhum caso RF11 foi implementado ou executado. `PLANNED` não equivale a
aprovação funcional ou UAT.

# 7. Inventário de endpoints e decisões RF11

O endpoint RF11 permanece ausente do runtime. As decisões finais abaixo são
registradas em `luciluci-docs/support/notes.md` §4.8 e detalhadas no PRD,
TDD e TP da revisão 0.13.

| Tema               | Decisão final                                                                             | Natureza                            | Status                              |
| ------------------ | ----------------------------------------------------------------------------------------- | ----------------------------------- | ----------------------------------- | --------------------- | -------------- |
| Headers            | Correlação UUID, ator opaco não vazio e role `admin                                       | backoffice                          | cd`; sem `X-Caller-\*`ou`401` local | DEC-SUP-01; posterior | Resolvido RF11 |
| Atores/ACL         | Admin-only com membership atual no Department do Ticket; requester dono `403`             | DEC-SUP-03/04; clarificação pós-PRD | Resolvido RF11                      |
| IDs/scope          | `ticketId`/`messageId` UUID v4; Message precisa pertencer ao Ticket; fora do escopo `404` | DEC-SUP-09/08; posterior            | Resolvido RF11                      |
| Body/query         | Objeto JSON estrito com um boolean obrigatório; nenhum query param                        | DEC-SUP-08; posterior               | Resolvido RF11                      |
| Elegibilidade      | Somente Message `type=admin`; inicial RF05 e requester RF10 `422`                         | DEC-SUP-04; posterior               | Resolvido RF11                      |
| Autor              | Não exigir igualdade com caller; qualquer admin com membership pode editar Message admin  | DEC-SUP-04; posterior               | Resolvido RF11                      |
| Transições         | `true→false` e `false→true`, valor alvo explícito                                         | DEC-SUP-04; posterior               | Resolvido RF11                      |
| No-op              | Mesmo valor: `200`, sem write ou efeitos                                                  | DEC-SUP-06; posterior               | Resolvido RF11                      |
| Response           | `200` com TicketMessage completa de oito campos, inclusive no no-op                       | DEC-SUP-08; posterior               | Resolvido RF11                      |
| `Ticket.updatedAt` | Não muda; TicketMessage não ganha timestamp novo                                          | DEC-SUP-08; posterior               | Resolvido RF11                      |
| Audit              | Nenhum AuditLog, inclusive em mudança efetiva                                             | PRD RF11 literal                    | `NO_AUDIT_RF11`                     |
| Idempotência       | Sem key/replay; retry do mesmo valor vira no-op                                           | DEC-SUP-10; posterior               | Resolvido RF11                      |
| Locks              | Ticket→Department→Message, `FOR UPDATE` e revalidação; update focal do boolean            | DEC-SUP-12; técnico                 | Resolvido RF11                      |
| RF11×RF11          | Mesmo alvo: segunda no-op; opostos: última escrita da ordem serial vence                  | DEC-SUP-12; técnico                 | Resolvido RF11                      |
| RF11×RF10          | Serializam por Ticket; RF10 não sobrescreve Message anterior                              | DEC-SUP-12; técnico                 | Resolvido RF11                      |
| RF11×RF06          | Revalidar Department atual após possível transferência                                    | DEC-SUP-12; técnico                 | Resolvido RF11                      |
| RF11×RF08          | Efeitos independentes preservados; RF11 não toca status/Ticket                            | DEC-SUP-12; técnico                 | Resolvido RF11                      |
| Department inativo | Não bloqueia; membership atual ainda exigida                                              | PRD P1/P6 + clarificação            | Resolvido RF11                      |
| Erros              | `200/400/403/404/422/500` conforme matriz 0.13; sem `401/409`                             | DEC-SUP-08; posterior               | Resolvido RF11                      |
| Eventos/migration  | Nenhum evento/outbox/AsyncAPI; coluna já existe, sem migration                            | DEC-SUP-11 N/A; schema RF05         | N/A / sem migration                 |

Matriz HTTP detalhada: `400` correlação/ator/role inválidos ou JSON
malformado; `403` requester ou admin sem membership; `404` Ticket/Message
inexistente no escopo; `422` UUID, body, query ou Message não-admin; `500`
inesperado. Sucesso efetivo e no-op retornam `200`. Nenhum `401/409` local.

# 8. Fronteira NFR e capacidades transversais

| Capacidade                                    | Classificação                | Limite                                      |
| --------------------------------------------- | ---------------------------- | ------------------------------------------- |
| Correlação, erro, persistência RF01–RF10      | Implementado localmente      | RF11 requer implementação e provas próprias |
| AuthN/RBAC amplo                              | Upstream/plataforma          | Support aplica ACL fina da RF11             |
| Observabilidade distribuída                   | Compartilhado                | Sem requisito adicional RF11                |
| Eventos, outbox, DLQ/redrive, Schema Registry | Fora do escopo desta release | Nenhum evento Support foi especificado      |
| Seed W1                                       | Gap real local anterior      | Independente do congelamento RF11           |

# 9. Cobertura de testes e validação

Esta revisão executou somente gates documentais: `git diff --check`,
`npm run format:check`, `git -C luciluci-docs diff --check`,
`git show --check HEAD` e `git -C luciluci-docs show --check HEAD`. Os
resultados serão conferidos no fechamento do commit do serviço. O push
canônico foi sem force, e `ls-remote` confirmou
`4958fd1840042200fd1a87e45d6a7f69d4011dcd` no remoto. Nenhum teste,
PostgreSQL, smoke, build funcional ou CI RF11 foi executado.

# 10. Divergências

## 10.1 Documentação prevê, código não comprova

RF11 tem contrato congelado, mas route, controller, use case, DTO, OpenAPI e
testes ainda não existem. Este é o estado esperado antes do lote funcional.
RF12/RF13 seguem sem contrato congelado e sem runtime.

## 10.2 Código existe, documentação não comprova

Nenhum código RF11 foi criado. O comportamento RF10 existente foi inventariado
como contexto e não alterado.

## 10.3 ACTUAL_STATE afirma, código não comprova

O estado declara `RF11 NOT_IMPLEMENTED`, coerente com runtime e OpenAPI.
O congelamento 0.13 é documental; não declara a RF concluída.

## 10.4 PRD / TDD / TP divergem entre si

O PRD original aplica ACL geral de Ticket a RF11. A decisão recebida torna a
ação admin-only, registrada expressamente como complemento pós-PRD no PRD
transposto, notes, TDD e TP. A fonte original foi preservada byte a byte.

## 10.5 Ambiguidades que impedem conclusão segura

Nenhuma lacuna material permanece no recorte RF11 após as decisões expressas.
DEC-SUP-02/07 e as decisões de RF12/RF13 continuam fora do escopo.

# 11. Conclusão

`RF11_CONTRACT_CHECKPOINT_READY / RF11_CONTRACT_FROZEN / NOT_IMPLEMENTED`.
Support 0.13 está publicado em `4958fd1` e fixado no gitlink da branch
documental do serviço. O checkpoint bloqueado `85b3adb` não foi reescrito.
Não há branch funcional RF11, migration, evento, teste funcional ou deploy.

Próximo passo: abrir lote explícito de implementação RF11 em
`feat/support-rf11-message-visibility`, a partir da baseline RF10 com contrato
0.13 fixado. RF12/RF13 permanecem pendentes.
