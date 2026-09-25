# REPORT — Checkpoint contratual RF11 do support-ms

- **status:** `RF11_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION / NOT_IMPLEMENTED`
- **generated_by:** Codex
- **generated_at:** 2026-09-25T16:10:25Z
- **review_mode:** final
- **microservice:** support-ms
- **repository_ref:** `docs/support-rf11-message-visibility-checkpoint`, de `MAIN_BASELINE_RF10` `734ba5de74e544b1e8dc2a31c135cb2bb54d20e1`
- **documentation_ref:** `luciluci-docs/support/`, Support 0.12 `85c7e958adb0cbb9fa43842de7f990260f2bc0ee`; `sources/prd-original.md` SHA-256 `7d5e26647bcecc93cfb9df52d5c87bfa882e9d140ceb55632d527e15fa5b1c03`
- **report_file:** `docs/reports/REPORT-SUPPORT-RF11-CHECKPOINT-20260925-161025.md`
- **reviewer:** não informado

---

# 1. Resumo executivo

`main` e `origin/main` coincidem em `734ba5d`, após a PR #10 (merge
`8827c0b`, CI `quality` run `36156561044`) e a PR documental #11 (merge
`734ba5d`). RF01–RF10 estão implementadas/provadas; RF11–RF13 não estão
implementadas. O gitlink canônico permanece em Support 0.12. Não houve deploy.

O PRD original especifica a rota RF11, exemplo de body
`{"isVisibleToRequester":false}`, ACL geral de Ticket, mudança exclusivamente
nesse campo e zero auditoria. Ele não define a matriz de permissão por ação,
mensagens elegíveis, autoria permitida, transições, resposta, no-op ou
`Ticket.updatedAt`. `notes.md` marca a proposta admin-only como proposta, e o
TDD/TP mantêm os recortes pendentes. O contrato não pode ser congelado.

# 2. Escopo e fontes analisadas

Foram confrontados `AGENTS.md`, `AI_FIRST.md`, `ACTUAL_STATE.md`,
`DRIFT_REPORT.md`, `README.md`, política de branches, reports RF10 de contrato,
implementação e merge, os seis documentos canônicos Support e a cópia original
do PRD. O inventário de código incluiu entidades, schemas, migration, criação
RF10, rota, OpenAPI e provas históricas. Os reports RF10 são evidência da
baseline, não autoridade funcional de RF11. CI remota RF10 está registrada no
run [36156561044](https://github.com/leonardodecuritiba/luciluci-support-ms/actions/runs/36156561044);
nenhum run RF11 ocorreu neste checkpoint.

| Tema                     | PRD original                                                                                                                  | PRD transposto                            | notes/TDD/TP                                                                | Status RF11                                                                |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------- | --------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| Rota/body                | PATCH com `ticketId`, `messageId` e exemplo `isVisibleToRequester: false`                                                     | Preserva rota e exemplo                   | TDD identifica boolean; TP planeja caso                                     | Campo/rota definidos; validação fina aberta                                |
| Atores/ACL               | §4 aplica `admin` por `allowedUserIds` e `backoffice/cd` por ownership a todo Ticket, exceto RF01–RF05; não cita exceção RF11 | §5.2 preserva a regra                     | DEC-SUP-03/04 propõem admin-only, sem aprovação RF11                        | Permissão por ação aberta; proposta mais restritiva exige decisão expressa |
| Escopo da mensagem       | Path inclui dois IDs, sem erro de relação explícito                                                                           | Mesmo path                                | TDD e TP exigem impedir acesso cruzado                                      | Invariante fixa; status HTTP aberto                                        |
| Tipos/autoria/transições | Edita exclusivamente o boolean; não limita tipo, autor nem direção                                                            | Não acrescenta limite                     | DEC-SUP-04 registra lacuna sobre mensagens elegíveis                        | Aberto, gate principal                                                     |
| Efeitos/resposta         | Auditoria não gera; response/no-op/timestamp não descritos                                                                    | Auditoria não gera; response não definido | DEC-SUP-06/08/10 e TDD mantêm efeitos pendentes                             | Auditoria fechada; demais abertos                                          |
| Visibilidade futura      | RF12 contém filtro opcional                                                                                                   | Mantém filtro                             | DEC-SUP-04 alerta risco de mensagem interna ao requester; RF12/13 pendentes | Não autoriza antecipar RF12/13                                             |

`TicketMessage` no runtime tem `id,ticketId,message,type,authorId,`
`isVisibleToRequester,createdAt`; mídia é tabela separada
`ticket_message_media`. RF05 cria mensagem inicial visível. RF10 aceita mensagem
admin visível/interna e mensagem backoffice/cd apenas visível. A migration RF05
já inclui `ticket_messages.is_visible_to_requester`. A rota RF11 inexiste na
route e OpenAPI; `get-ticket.spec.ts` e contrato OpenAPI ainda esperam ausência
da rota. RF12/RF13 também estão ausentes. Isto é contexto implementado, não
aprovação de uma regra RF11.

# 3. Matriz principal RF x implementação

| RF          | Contrato e superfície         | Estado         | Evidência                                                |
| ----------- | ----------------------------- | -------------- | -------------------------------------------------------- |
| RF01–RF04   | Department                    | Implementado   | Reports RF01–RF04 e rotas atuais                         |
| RF05        | Criar Ticket/mensagem inicial | Implementado   | `create-ticket.use-case.ts`, report RF05                 |
| RF06        | Editar Ticket                 | Implementado   | Report RF06 e rota PATCH                                 |
| RF07a/RF07b | Listar Tickets                | Implementado   | Report RF07 e rotas GET                                  |
| RF08        | Resolver Ticket               | Implementado   | Report RF08 e rota POST                                  |
| RF09        | Buscar Ticket por ID          | Implementado   | Report RF09 e rota GET                                   |
| RF10        | Criar mensagem                | Implementado   | `create-ticket-message.use-case.ts`, report RF10, PR #10 |
| RF11        | Editar visibilidade           | Não encontrado | PRD/TDD/TP planejam; route/OpenAPI ausentes              |
| RF12/RF13   | Listar mensagens/histórico    | Não encontrado | Planejados; fora deste lote                              |

# 4. Checklist consolidado por PRD

- [x] Path RF11 e campo literal preservados.
- [x] ACL geral §4/P1/P6: membership atual para admin, ownership para
      backoffice/cd; `Department.type` não autoriza e Department inativo não
      inutiliza Ticket histórico.
- [x] RF11 não gera AuditLog; não há ação `alteracao_visibilidade`.
- [!] PRD não declara RF11 admin-only, tipos de mensagem permitidos,
  restrição por autor ou direções válidas da mudança.
- [!] Status/shape de sucesso, no-op, `Ticket.updatedAt` e erros não definidos.

# 5. Checklist consolidado por TDD

- [x] TDD RF11 protege relação entre Ticket e Message e preserva texto,
      tipo, autor, mídia e `createdAt`.
- [x] A entidade/schema e migration atual já suportam o boolean: nenhuma
      migration é exigida pelo campo descrito.
- [!] TDD marca DEC-SUP-01/03/04/06/08/09/10 pendentes para RF11; locks e
  concorrência precisam de escolha técnica registrada no recorte.
- [ ] Nenhum use case, controller, DTO ou route RF11 foi criado.

# 6. Checklist consolidado por TP

| RF        | Unit                                                       | Integration                                              | Functional/contract                    | Resultado                   |
| --------- | ---------------------------------------------------------- | -------------------------------------------------------- | -------------------------------------- | --------------------------- |
| RF01–RF09 | Evidência histórica por report                             | Evidência histórica por report                           | Provas PostgreSQL/HTTP por report      | Não repetidas aqui          |
| RF10      | `tests/unit/ticket/create-ticket-message.use-case.spec.ts` | `tests/integration/ticket/create-ticket-message.spec.ts` | Report RF10, prova PostgreSQL e CI #10 | Integrada; não prova RF11   |
| RF11      | `TC-SUP-RF11` planejado                                    | `IT-SUP-09` planejado                                    | `FU-SUP-05`/`SEC-SUP-06` planejados    | `NOT_IMPLEMENTED / NOT_RUN` |
| RF12/RF13 | Planejados                                                 | Planejados                                               | Planejados                             | Fora do recorte             |

O TP não executou RF11. A expectativa histórica de `404` para `/visibility`
com headers válidos é guarda de ausência, não teste funcional RF11.

# 7. Inventário de endpoints reais e decisões RF11

Não há PATCH `/tickets/{ticketId}/messages/{messageId}/visibility` no runtime
ou na OpenAPI. `/health`, `/metrics` e `/api-docs*` são operacionais, não RFs.
Na tabela, **candidata** significa alternativa para decisão, não contrato
congelado.

| Tema                | Definição ou candidata                                                                                                                                                                                                       | Fonte                                           | Status                              |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ----------------------------------- |
| Atores/ACL          | §4 permite admin com membership atual e requester dono; admin-only é proposta conflitante. Role requester reconhecida porém proibida daria `403` somente se admin-only for aprovada. `Department.type` não conta.            | PRD §4/P6; notes DEC-SUP-03/04                  | **Aberto: permissão por ação**      |
| Headers             | `X-Correlation-ID`, `X-Performed-By`, `X-Performed-By-Type` são precedentes fortes; falta/blank/role inválida candidata `400`; aliases `X-Caller-*` não aceitos em RFs anteriores. AuthN/RBAC amplo no BFF; sem `401` local. | PRD P7; notes DEC-SUP-01; RF06–RF10             | Aberto para RF11                    |
| IDs e escopo        | Ticket/Message internos UUID v4; resolver Ticket e exigir `message.ticketId=ticketId`. Inválido `422`, inexistente/no escopo `404` são candidatas.                                                                           | Schema, TDD RF11, TP `IT-SUP-09`; DEC-SUP-08/09 | Invariante fixa; HTTP aberto        |
| Body/query          | Exemplo literal tem apenas boolean `isVisibleToRequester`. Obrigatoriedade, body estrito, null, extras e query `422` são candidatas de precedentes. Sem aliases.                                                             | PRD RF11, TDD; DEC-SUP-08                       | Campo fixo; validação aberta        |
| Mensagens elegíveis | Qualquer mensagem, somente admin, somente nota interna, mensagem inicial ou de requester: nenhuma seleção consta da RF11.                                                                                                    | PRD RF11; notes DEC-SUP-04                      | **Aberto: gate principal**          |
| Autor               | Igualdade `message.authorId == callerId` não consta da fonte. Qualquer admin com membership é alternativa se admin-only for escolhido.                                                                                       | PRD §4/RF11; notes DEC-SUP-04                   | Aberto                              |
| Transições          | Exemplo `false`; não proíbe `false→true` nem `true→false`.                                                                                                                                                                   | PRD RF11; DEC-SUP-04                            | Aberto                              |
| No-op               | Reenvio do mesmo valor: `200` sem write é precedente RF02/RF06/RF08, não decisão RF11. Message não tem `updatedAt`.                                                                                                          | notes DEC-SUP-06; entidade                      | Aberto                              |
| Response            | `200` TicketMessage com oito campos/mediaIds ou `204` sem body são alternativas; PRD não define.                                                                                                                             | PRD RF11; DEC-SUP-08                            | Aberto                              |
| Ticket.updatedAt    | Fonte não define se mutação de Message renova Ticket. `createdAt` da Message não deve mudar.                                                                                                                                 | TDD §4.4/RF11; DEC-SUP-08                       | Aberto                              |
| Auditoria           | Nenhuma; não criar action nova ou reaproveitar `nova_mensagem`.                                                                                                                                                              | PRD RF11/tabela; TDD §7                         | Fechado pela fonte                  |
| Idempotência        | Sem requisito de chave/replay; PATCH por estado permite no-op, mas retry precisa de decisão expressa.                                                                                                                        | notes DEC-SUP-10/06                             | Aberto                              |
| Locks/transação     | Ticket→Department→Message, ou Ticket→Message→Department são alternativas. Revalidar ACL atual e evitar ciclo com RF06/RF10; atomicidade de update.                                                                           | RF06/RF10, TDD; DEC-SUP-12 técnico              | Aberto                              |
| RF11×RF11           | Mesmo valor pode virar no-op da segunda; valores opostos podem seguir ordem serial. Exige escolha de lock e semântica.                                                                                                       | DEC-SUP-06/12; ausência no PRD                  | Aberto                              |
| RF11×RF10           | RF10 usa Ticket lock e não deve sobrescrever Message existente; visibilidade de mensagem recém-criada depende da ordem serial.                                                                                               | Runtime RF10; DEC-SUP-12 técnico                | Aberto                              |
| RF11×RF06/RF08      | Se tocar Ticket, concorre em `updatedAt`; mesmo sem tocar Ticket, ACL/locks precisam coexistir.                                                                                                                              | TDD, runtime RF06/RF08                          | Aberto por `updatedAt` e locks      |
| Department inativo  | P1 mantém tickets históricos; para admin, membership atual segue necessária. Inatividade sozinha não proíbe operação.                                                                                                        | PRD P1/P6/§4                                    | Regra base fixa; papel RF11 aberto  |
| Erros               | `400` headers/JSON, `403` ACL, `404` Ticket/Message no escopo, `422` UUID/body/query e `500` inesperado são candidatas; erro de tipo de Message depende da política. Sem `409` sem base.                                     | PRD P8; DEC-SUP-08/09                           | Aberto como matriz RF11             |
| Evento/migration    | Nenhum evento Support especificado; coluna boolean já existe. Sem outbox, AsyncAPI ou migration nova na definição atual.                                                                                                     | PRD, DEC-SUP-11, migration RF05                 | Fora do recorte / schema suficiente |

IDs reais aplicáveis: DEC-SUP-01 (headers), 03 (ação/papel), 04
(visibilidade), 06 (no-op), 08 (HTTP/response), 09 (IDs), 10
(idempotência). DEC-SUP-12 está resolvida para operações anteriores, mas a
estratégia RF11 ainda precisa ser registrada; DEC-SUP-11 é apenas ausência de
evento, não autorização para inventar mensageria. Nenhuma decisão é estendida
às RF12/RF13.

# 8. Fronteira NFR e capacidades transversais

| Capacidade                                            | Classificação                | Limite                                  |
| ----------------------------------------------------- | ---------------------------- | --------------------------------------- |
| Correlação, envelopes, PostgreSQL e OpenAPI RF01–RF10 | Implementado localmente      | RF11 exigirá contrato e prova próprios  |
| AuthN e RBAC amplo                                    | Upstream/plataforma          | Support aplica ACL fina do Ticket       |
| Observabilidade distribuída                           | Compartilhado                | Sem requisito novo RF11                 |
| Eventos, outbox, DLQ/redrive, Schema Registry         | Fora do escopo desta release | Nenhum evento Support especificado      |
| Seed W1                                               | Gap real local prévio        | Não bloqueia este checkpoint documental |

# 9. Cobertura de testes e validação

Este checkpoint é documental. Nenhum teste funcional, integração, PostgreSQL,
build ou UAT RF11 foi executado; a prova RF10/CI citada não é atribuída à RF11.
`git diff --check`, `npm run format:check` e
`git -C luciluci-docs diff --check` passaram. `git show --check HEAD` também
passou após o commit documental. A revisão do PRD original foi comparada
por SHA-256; o arquivo não foi alterado. O submódulo permanece limpo na revisão
fixada.

# 10. Divergências

## 10.1 Documentação prevê, código não comprova

RF11–RF13 têm seções planejadas no PRD/TDD/TP, mas nenhuma rota. A ausência
é planejada nesta baseline, não drift técnico de RF10.

## 10.2 Código existe, documentação não comprova

RF10 cria mensagens com visibilidade conforme seu contrato 0.12. Isso amplia
os estados que RF11 encontrará, mas não define a política de edição RF11.

## 10.3 ACTUAL_STATE afirma, código não comprova

O estado RF11 `NOT_IMPLEMENTED` confere com route/OpenAPI e probes de 404.
Nenhum código RF11 é atribuído a este checkpoint.

## 10.4 PRD / TDD / TP divergem entre si

O PRD aplica a ACL geral §4 a RF11, inclusive requester dono; notes propõe
admin-only e TDD pede permissão por ação futura. Essa proposta não substitui
a regra funcional recebida sem aprovação expressa. O TP planeja prevenção de
cross-ticket, mas não fecha a matriz de erros.

## 10.5 Ambiguidades que impedem conclusão segura

Decidir no recorte RF11: (1) admin-only versus acesso do requester dono;
(2) mensagens elegíveis, inclusive RF05 e mensagens backoffice/cd;
(3) restrição de `authorId` e direções permitidas; (4) validação de body,
headers/IDs/query e status para tipo inelegível; (5) no-op, response e
`Ticket.updatedAt`; (6) idempotência; (7) locks e semântica RF11×RF11,
RF11×RF10 e RF11×RF06/RF08. O comportamento `403` de requester válido depende
da decisão (1). Auditoria zero, ACL base/P1/P6, campo literal e vínculo
Ticket→Message já estão definidos.

# 11. Conclusão

`RF11_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION`. Support 0.13 não foi
congelado, nenhum commit canônico RF11 foi criado e o gitlink segue em
Support 0.12 `85c7e95`. RF11 `NOT_IMPLEMENTED`; a branch
`feat/support-rf11-message-visibility` **não foi criada**. RF12/RF13
`NOT_IMPLEMENTED`. Não houve migration, evento ou deploy.

Próximo passo: resolver expressamente apenas as decisões RF11 da seção 10.5
na fonte canônica; somente depois considerar Support 0.13 e abrir lote de
implementação separado.
