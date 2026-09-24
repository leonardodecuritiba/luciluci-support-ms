# REPORT - Avaliação de completude do microserviço

- **status:** `RF06_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION`
- **generated_by:** Codex
- **generated_at:** `2026-09-24T15:34:27Z`
- **review_mode:** final / checkpoint contratual RF06
- **microservice:** `support-ms`
- **repository_ref:** `docs/support-rf06-checkpoint` sobre `MAIN_BASELINE_RF04` / `04f4f8eb0f9c741fae7947a370fb50c121d8a624`
- **documentation_ref:** `luciluci-docs` Support 0.7 / `cc9a4399d210114e3c8261f3c153f8339c049ffb`, branch local de análise `docs/support-rf06-contract` / `2f3dfec` (push bloqueado por autenticação SSH)
- **report_file:** `docs/reports/REPORT-SUPPORT-RF06-CHECKPOINT-20260924-153427.md`
- **reviewer:** não informado

# 1. Resumo executivo

- RFs documentadas: 14 operações, RF01–RF13 com RF07a/RF07b.
- Implementadas e provadas na baseline integrada: 4 (RF01–RF04).
- Não encontradas na baseline integrada: 10 (RF05–RF13 com RF07a/RF07b).
- Matriz unit + integration + functional/prova justificada: 4, por evidências históricas RF01–RF04; nenhuma prova foi reexecutada neste checkpoint.
- RF06: contrato parcial, bloqueado por decisões; runtime `NOT_IMPLEMENTED`.
- Novos gaps técnicos locais comprovados: 0. Lacunas aqui são contratuais, não falhas reproduzidas.

`origin/main` foi consultada remotamente e aponta para `04f4f8eb0f9c741fae7947a370fb50c121d8a624` (`MAIN_BASELINE_RF04`). A worktree principal estava limpa em `main`, com submódulo não inicializado e gitlink `864e02a9885852a6c6f6a385c3301e9a757edb60` (Support 0.6). A worktree documental isolada inicializou essa revisão fixa e materializou explicitamente Support 0.7. O commit de análise `2f3dfec` ficou na branch local `docs/support-rf06-contract`; o push falhou com `Permission denied (publickey)`, e `gh auth status` informou token inválido. A revisão 0.8 não foi publicada. O gitlink do serviço foi mantido em `cc9a4399d210114e3c8261f3c153f8339c049ffb`, já publicado. O origin do serviço não apresentou a branch `feat/support-rf05-create-ticket` na consulta remota; não se infere inexistência de trabalho RF05 em outro checkout ou ref não consultado.

O contrato RF05 0.7 é dependência documental legítima para o agregado Ticket. Não prova implementação, migration, repositório ou teste RF05. `RF06_IMPLEMENTATION_DEPENDS_ON_RF05_RUNTIME = YES`; runtime RF06 exige base Git estável contendo RF05, preferencialmente `MAIN_BASELINE_RF05`. Não foi criada `feat/support-rf06-update-ticket`.

# 2. Escopo e fontes analisadas

Foram lidos `AGENTS.md`, `AI_FIRST.md`, `ACTUAL_STATE.md`, `DRIFT_REPORT.md`, `README.md`, a política de branches, reports RF04, template de report, inventário `src/`/`tests/` e `luciluci-docs/support/{README,prd,notes,tdd,tp,dependencies}.md`, além de `support/sources/prd-original.md`. Não há report RF05 no `main` observado. O commit documental 0.7 foi verificado no objeto Git e no ref remoto `docs/support-rf05-contract`. A fonte original permaneceu intacta.

| Tema               | Fonte                                 | O que a fonte realmente define                                                                                                                                                                          |
| ------------------ | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Rota/campos        | PRD original RF06                     | `PATCH /api/support/tickets/{ticketId}` edita `priority`, `departmentId`, `adminStatus`; não edita `requesterStatus`.                                                                                   |
| Papel/ACL          | PRD original §4/P6 e DEC-SUP-03       | Admin precisa pertencer a `allowedUserIds` do Department atual; requester acessa/altera o próprio Ticket. Não há regra por campo RF06. `Department.type` não autoriza.                                  |
| Transferência      | PRD original RF06/P1/P4 e DEC-SUP-05  | `departmentId` editável e transferência isolada sem auditoria; restrição a Department inativo é explícita só para ticket novo. Membership no destino não está definida.                                 |
| Status/prioridade  | PRD original entidades/RF06           | Enums literais; transições `adminStatus` livres; não há state machine adicional.                                                                                                                        |
| Auditoria          | PRD original RF06/P4/tabela §7        | Exatamente um `alteracao_status` apenas se `adminStatus` mudar; `statusType=admin`, `newStatus` novo. Priority/transfer isoladas não auditam.                                                           |
| Identidade         | PRD original P7, DEC-SUP-01, RF05 0.7 | BFF envia identidade; nomes `X-Caller-*` são sugestão. Família técnica escolhida é `X-Performed-By*` quando o ator for necessário; RF05 não exige ator local. Detalhes de erro RF06 não foram fechados. |
| Estrutura Ticket   | Support 0.7, DEC-SUP-09               | IDs locais UUID v4, IDs externos opacos, Ticket completo, FK Department, número sequence gapful, TicketMessage/AuditLog. É contrato, não runtime integrado.                                             |
| PATCH HTTP         | DEC-SUP-06/08/10 RF02                 | RF02 tem body não vazio, 200 completo, no-op sem write/timestamp e sem idempotência HTTP. As decisões são explicitamente restritas a RF02.                                                              |
| Locks              | TDD RF05 e DEC-SUP-12                 | RF02/RF04/RF05 serializam o Department com lock pessimista; RF06 precisa definir ordem conjunta com Ticket e target antes da implementação.                                                             |
| Correlação/eventos | Kernel local, DEC-SUP-11              | `X-Correlation-ID` obrigatório nas rotas de negócio; nenhum evento Support especificado.                                                                                                                |

Sem testes de runtime nesta execução. Evidências RF01–RF04 permanecem nos reports históricos; não foram reatribuídas a RF06. CI remoto deste checkpoint não foi observado.

# 3. Matriz principal RF x implementação

| RF    | Endpoint                                                                | Status em `MAIN_BASELINE_RF04` | Evidência                           |
| ----- | ----------------------------------------------------------------------- | ------------------------------ | ----------------------------------- |
| RF01  | `POST /api/support/departments`                                         | Implementado                   | report RF01                         |
| RF02  | `PATCH /api/support/departments/{departmentId}`                         | Implementado                   | report RF02                         |
| RF03  | `GET /api/support/departments`                                          | Implementado                   | report RF03                         |
| RF04  | `DELETE /api/support/departments/{departmentId}`                        | Implementado                   | report RF04 e merge PR #3           |
| RF05  | `POST /api/support/tickets`                                             | Não encontrado na baseline     | contrato 0.7; runtime não integrado |
| RF06  | `PATCH /api/support/tickets/{ticketId}`                                 | Não encontrado                 | checkpoint bloqueado                |
| RF07a | `GET /api/support/tickets/requester/{requesterId}`                      | Não encontrado                 | fora do lote                        |
| RF07b | `GET /api/support/tickets/admin/{adminId}`                              | Não encontrado                 | fora do lote                        |
| RF08  | `POST /api/support/tickets/{ticketId}/resolve`                          | Não encontrado                 | fora do lote                        |
| RF09  | `GET /api/support/tickets/{ticketId}`                                   | Não encontrado                 | fora do lote                        |
| RF10  | `POST /api/support/tickets/{ticketId}/messages`                         | Não encontrado                 | fora do lote                        |
| RF11  | `PATCH /api/support/tickets/{ticketId}/messages/{messageId}/visibility` | Não encontrado                 | fora do lote                        |
| RF12  | `GET /api/support/tickets/{ticketId}/messages`                          | Não encontrado                 | fora do lote                        |
| RF13  | `GET /api/support/tickets/history`                                      | Não encontrado                 | fora do lote                        |

# 4. Checklist consolidado por PRD

- [x] Caminho, campos, enums, transições livres e auditoria P4 preservados.
- [x] ACL do Department atual antecede a mutação; `type` não participa.
- [!] Regra geral de escrita versus papéis/campos RF06 não foi resolvida pela fonte.
- [!] Target ACL e target inativo permanecem abertos.
- [x] `requesterStatus` permanece reservado a RF08; nenhum evento inventado.
- [ ] Nenhum runtime RF06 ou revisão 0.8 congelada.

# 5. Checklist consolidado por TDD

| Tema              | Decisão/status                                                                                                 | Natureza                        |
| ----------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------- |
| A papéis/campos   | `OPEN_FOR_RF06`; escolher matriz explícita                                                                     | aberta de produto               |
| B headers/erros   | Família `X-Performed-By*` é canônica quando há ator; presença/erros RF06 abertos                               | herdada e aberta                |
| C ACL atual       | Membership no Department atual, inclusive histórico inativo; antes de mutação; `type` irrelevante              | PRD + derivação de P1           |
| D transferência   | FK implica target existente; membership no target e perda de acesso abertas                                    | PRD + aberta                    |
| E target inativo  | P1 não decide transferência existente                                                                          | aberta de produto               |
| F body            | Somente três campos; RF02 é precedente para parcial não vazio/422, ainda não aplicável automaticamente         | PRD + aberta técnica            |
| G no-op           | Sem AuditLog para status igual; response/write/updatedAt abertos                                               | PRD + aberta técnica            |
| H updatedAt       | Sem regra RF06 explícita; precedente RF02 não transversal                                                      | aberta técnica                  |
| I response        | Sem shape/status RF06; 200 Ticket completo é proposta                                                          | aberta técnica                  |
| J ticketId        | UUID v4 interno; 422 inválido, 404 inexistente                                                                 | RF05 0.7 + padrão RF02          |
| K adminStatus     | cinco valores literais, transições livres inclusive regressivas                                                | PRD                             |
| L priority        | quatro valores literais, sem restrição de transição/auditoria própria                                          | PRD                             |
| M requesterStatus | não editável em RF06; rejeição de presença, código depende de F                                                | PRD                             |
| N AuditLog        | um `alteracao_status` na mudança efetiva, `statusType=admin`, `newStatus` novo; autoria/origem dependem de A/B | PRD + mapeamento aberto         |
| O atomicidade     | Ticket update + eventual AuditLog na mesma transação; target/ACL validados no mesmo escopo                     | técnica derivada da integridade |
| P locks           | Ticket deve ser serializado; ordem global com Department(s) aberta; prova depende de RF05                      | aberta técnica                  |
| Q idempotência    | Chave não exigida pela fonte; decisão RF06 de ativação ainda aberta                                            | aberta técnica                  |
| R eventos         | Nenhum evento/outbox Support                                                                                   | PRD / DEC-SUP-11                |

`DEC-SUP-02/04/07` continuam para RFs posteriores e não bloqueiam RF06. Não transformar a proposta RF02 em regra RF06 por semelhança. Não permitir transferência por admin ao target sem membership por inferência ou mera conveniência.

# 6. Checklist consolidado por TP

- [x] `TC-SUP-RF06` existe como plano; foi ajustado para registrar decisões e concorrência futuras.
- [ ] Unit RF06: não criado/não executado.
- [ ] Integration RF06: não criado/não executado.
- [ ] Functional RF06: não criado/não executado.
- [ ] Contract/OpenAPI RF06: não criado/não executado.

## 6.1 Matriz obrigatória RF -> testes

| RF    | Unit                                                       | Integration                                              | Functional            | Agrupamento/exceção      | Estado                  |
| ----- | ---------------------------------------------------------- | -------------------------------------------------------- | --------------------- | ------------------------ | ----------------------- |
| RF01  | `tests/unit/department/create-department.use-case.spec.ts` | `tests/integration/department/create-department.spec.ts` | `proof:rf01:postgres` | prova histórica          | completa historicamente |
| RF02  | `tests/unit/department/update-department.use-case.spec.ts` | `tests/integration/department/update-department.spec.ts` | `proof:rf02:postgres` | prova histórica          | completa historicamente |
| RF03  | `tests/unit/department/list-departments.use-case.spec.ts`  | `tests/integration/department/list-departments.spec.ts`  | `proof:rf03:postgres` | prova histórica          | completa historicamente |
| RF04  | `tests/unit/department/delete-department.use-case.spec.ts` | `tests/integration/department/delete-department.spec.ts` | `proof:rf04:postgres` | prova histórica          | completa historicamente |
| RF05  | ausente na baseline                                        | ausente na baseline                                      | ausente na baseline   | contrato 0.7 não é prova | ausente                 |
| RF06  | ausente                                                    | ausente                                                  | ausente               | checkpoint documental    | ausente / NOT_RUN       |
| RF07a | ausente                                                    | ausente                                                  | ausente               | fora do lote             | ausente                 |
| RF07b | ausente                                                    | ausente                                                  | ausente               | fora do lote             | ausente                 |
| RF08  | ausente                                                    | ausente                                                  | ausente               | fora do lote             | ausente                 |
| RF09  | ausente                                                    | ausente                                                  | ausente               | fora do lote             | ausente                 |
| RF10  | ausente                                                    | ausente                                                  | ausente               | fora do lote             | ausente                 |
| RF11  | ausente                                                    | ausente                                                  | ausente               | fora do lote             | ausente                 |
| RF12  | ausente                                                    | ausente                                                  | ausente               | fora do lote             | ausente                 |
| RF13  | ausente                                                    | ausente                                                  | ausente               | fora do lote             | ausente                 |

# 7. Inventário de endpoints reais

`MAIN_BASELINE_RF04` registra somente RF01–RF04 em `src/app.ts` e na OpenAPI executável. `GET /health`, `/metrics`, `/api-docs` e `/api-docs-json` são superfícies operacionais, não RFs. RF05–RF13 não têm rota na baseline. `api.http` não recebeu RF06.

# 8. Fronteira NFR e capacidades transversais

## 8.1 Matriz obrigatória de fronteira NFR

| Item                               | Categoria                         | Evidência/limite                                   | Gap real local?                |
| ---------------------------------- | --------------------------------- | -------------------------------------------------- | ------------------------------ |
| Correlação HTTP                    | implementado localmente           | kernel e reports RF01–RF04; RF06 futuro            | não neste checkpoint           |
| Autorização fina Ticket            | gap real local futuro             | requisito PRD; ainda sem runtime RF05/RF06         | não é defeito da baseline RF04 |
| Autenticação/RBAC amplo            | upstream/plataforma               | BFF/borda segundo PRD                              | não                            |
| Transação/locks RF06               | implementado localmente no futuro | desenho pendente; RF05 runtime ausente da baseline | não há prova RF06              |
| Eventos/broker                     | fora do escopo desta release      | nenhum evento Support                              | não                            |
| OpenTelemetry/DLQ/redrive          | compartilhado/fora do escopo      | nenhuma obrigação local RF06                       | não                            |
| Segurança/performance automatizada | fora do escopo desta release      | não exigida pelo checkpoint                        | não                            |

## 8.2 Capacidades transversais

Migration, Ticket repository, AuditLog e response mapping são dependências de runtime RF05, não capacidades comprovadas pelo contrato 0.7. O kernel de idempotência existe genericamente, mas sua ativação em RF06 está aberta. A OpenAPI executável, `api.http`, scripts, CI, seed e infraestrutura permaneceram intactos.

# 9. Cobertura de testes

Este lote só valida documentação. Nenhum teste unitário, de integração, funcional, contrato, PostgreSQL ou imagem foi executado. As provas de RF01–RF04 citadas são históricas. Os checks documentais executados e seus resultados constam no fechamento deste report; não representam prova de RF06.

# 10. Divergências

## 10.1 Documentação prevê, código não comprova

Support 0.7 prevê Ticket, TicketMessage e AuditLog para RF05; `main` ainda aponta para Support 0.6 e não contém esse runtime. RF06 depende deles e permanece sem implementação.

## 10.2 Código existe, documentação não comprova

Nenhuma divergência nova encontrada neste recorte. A revisão local histórica do serviço estava desatualizada quanto ao merge RF04; os arquivos de estado foram corrigidos nesta branch documental.

## 10.3 `ACTUAL_STATE.md` afirma, código não comprova

O arquivo de `main` ainda descrevia RF04 fora da baseline apesar do merge `04f4f8e`; foi atualizado nesta worktree documental. Não se afirma RF05 implementada.

## 10.4 PRD / TDD / TP divergem entre si

Não há mudança funcional contraditória criada. O TDD e TP anteriores já marcavam DEC-SUP-03/05 pendentes para RF06; a matriz A–R explicita a fronteira entre fonte, precedente e proposta.

## 10.5 Ambiguidades que impedem conclusão segura

1. Papel por campo: admin-only ou também requester dono, inclusive `adminStatus` e transferência.
2. Transferência: membership no target, perda de acesso e response.
3. Target inativo: política e status/código.
4. Identidade: obrigatoriedade/erros de `X-Performed-By*`; decisão 403/404 para ACL.
5. PATCH: adoção explícita do padrão RF02 para body, response, no-op e `updatedAt`.
6. Idempotência e ordem global de locks Ticket/Department(s).

# 11. Conclusão

`RF06_CONTRACT_CHECKPOINT_BLOCKED_BY_DECISION`. Support 0.8 não foi congelado. `RF06_IMPLEMENTATION_DEPENDS_ON_RF05_RUNTIME = YES`, e RF06 runtime permanece `NOT_IMPLEMENTED`. Resolver somente as decisões RF06 listadas, mantendo RF05 preservada. Depois disso, congelar o contrato e, após base Git estável com RF05, abrir um lote funcional próprio. Não iniciar RF07+.

**Validação documental:** `git diff --check` e `git -C luciluci-docs diff --check` passaram antes do commit canônico; `prettier --check` dos cinco documentos do submódulo passou. `npm run format:check` inicialmente falhou por dependências ausentes, que foram instaladas via `npm ci --ignore-scripts --offline`; o primeiro check apontou somente este report, formatado de modo focal. `npm run format:check` passou após o ajuste. A lista de arquivos alterados contém apenas Markdown e o gitlink do submódulo; nenhum arquivo executável mudou. Nenhum teste funcional foi executado.
